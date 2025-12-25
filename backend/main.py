from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import pickle
import numpy as np
from typing import List
import os
from datetime import datetime

from app.database import init_db, get_db, PatientProfile, PredictionHistory
from app.schemas import (
    PredictionInput, PredictionResponse, 
    PatientProfileCreate, PatientProfileResponse,
    PredictionHistoryResponse, PatientTimelineResponse,
    StatsResponse
)
from app.report_generator import generate_patient_report
from excel_exporter import create_patients_excel, create_high_risk_patients_excel

app = FastAPI(
    title="Heart Disease Prediction API - With Patient Profiles",
    description="ML-based Heart Disease Prediction with Patient History Tracking",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model and scaler
MODEL_PATH = "models/model.pkl"
SCALER_PATH = "models/scaler.pkl"

model = None
scaler = None

def load_model_and_scaler():
    global model, scaler
    
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError("Model or scaler not found. Please train the model first.")
    
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    
    print("Model and scaler loaded successfully!")

@app.on_event("startup")
async def startup_event():
    init_db()
    load_model_and_scaler()
    print("Database initialized and model loaded!")

@app.get("/")
async def root():
    return {
        "message": "Heart Disease Prediction API - With Patient Profiles",
        "version": "2.0.0",
        "features": [
            "Patient Profile Management",
            "Prediction History Tracking",
            "Timeline View",
            "Progress Analysis"
        ]
    }

# ============ PATIENT PROFILE ENDPOINTS ============

@app.post("/profiles/create", response_model=PatientProfileResponse)
async def create_patient_profile(profile: PatientProfileCreate, db: Session = Depends(get_db)):
    """Create a new patient profile"""
    
    # Check if patient_id already exists
    existing = db.query(PatientProfile).filter(
        PatientProfile.patient_id == profile.patient_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Patient ID already exists")
    
    new_profile = PatientProfile(
        patient_id=profile.patient_id,
        name=profile.name,
        date_of_birth=profile.date_of_birth,
        gender=profile.gender,
        phone=profile.phone,
        email=profile.email,
        address=profile.address
    )
    
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    
    return new_profile.to_dict()

@app.get("/profiles/search/{patient_id}", response_model=PatientProfileResponse)
async def search_patient_profile(patient_id: str, db: Session = Depends(get_db)):
    """Search for a patient by ID"""
    
    profile = db.query(PatientProfile).filter(
        PatientProfile.patient_id == patient_id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return profile.to_dict()

@app.get("/profiles", response_model=List[PatientProfileResponse])
async def get_all_profiles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all patient profiles"""
    
    profiles = db.query(PatientProfile).offset(skip).limit(limit).all()
    return [p.to_dict() for p in profiles]

# ============ PREDICTION WITH PROFILE ============

@app.post("/predict", response_model=PredictionResponse)
async def predict_with_profile(data: PredictionInput, db: Session = Depends(get_db)):
    """
    Predict heart disease risk with patient profile tracking
    
    - If patient_id is provided: Add to existing patient's history
    - If profile_data is provided: Create new patient and add prediction
    """
    
    try:
        # Get or create patient profile
        is_new_patient = False
        
        if data.patient_id:
            # Existing patient
            profile = db.query(PatientProfile).filter(
                PatientProfile.patient_id == data.patient_id
            ).first()
            
            if not profile:
                raise HTTPException(status_code=404, detail="Patient not found. Please create profile first.")
        
        elif data.profile_data:
            # New patient - create profile
            profile = PatientProfile(
                patient_id=data.profile_data.patient_id,
                name=data.profile_data.name,
                date_of_birth=data.profile_data.date_of_birth,
                gender=data.profile_data.gender,
                phone=data.profile_data.phone,
                email=data.profile_data.email,
                address=data.profile_data.address
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
            is_new_patient = True
        else:
            raise HTTPException(
                status_code=400, 
                detail="Either patient_id or profile_data must be provided"
            )
        
        # Prepare features for prediction
        features = np.array([[
            data.age, data.sex, data.cp, data.trestbps, data.chol,
            data.fbs, data.restecg, data.thalach, data.exang,
            data.oldpeak, data.slope, data.ca, data.thal
        ]])
        
        # Scale and predict
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]
        risk_prob = probability[1]
        risk_level = "High Risk" if prediction == 1 else "Low Risk"
        
        # Save prediction to history
        new_prediction = PredictionHistory(
            profile_id=profile.id,
            age=data.age,
            sex=data.sex,
            cp=data.cp,
            trestbps=data.trestbps,
            chol=data.chol,
            fbs=data.fbs,
            restecg=data.restecg,
            thalach=data.thalach,
            exang=data.exang,
            oldpeak=data.oldpeak,
            slope=data.slope,
            ca=data.ca,
            thal=data.thal,
            prediction=risk_level,
            risk_probability=risk_prob,
            doctor_notes=data.doctor_notes
        )
        
        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)
        
        # Generate recommendations
        if risk_level == "High Risk":
            recommendations = [
                "Consult with a cardiologist immediately",
                "Schedule comprehensive cardiac screening",
                "Monitor blood pressure and cholesterol regularly",
                "Adopt a heart-healthy diet",
                "Engage in regular physical activity",
                "Avoid smoking and limit alcohol",
                "Manage stress effectively"
            ]
            message = "High risk detected. Please consult a healthcare professional immediately."
        else:
            recommendations = [
                "Continue maintaining a healthy lifestyle",
                "Regular annual health check-ups",
                "Balanced diet and exercise",
                "Monitor vital signs periodically",
                "Avoid smoking and excessive alcohol"
            ]
            message = "Low risk detected. Keep up the good work with healthy habits!"
        
        return PredictionResponse(
            prediction_id=new_prediction.id,
            patient_id=profile.patient_id,
            patient_name=profile.name,
            prediction=risk_level,
            risk_probability=round(risk_prob * 100, 2),
            message=message,
            recommendations=recommendations,
            is_new_patient=is_new_patient
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# ============ PATIENT HISTORY & TIMELINE ============

@app.get("/profiles/{patient_id}/timeline", response_model=PatientTimelineResponse)
async def get_patient_timeline(patient_id: str, db: Session = Depends(get_db)):
    """Get patient's complete timeline with all predictions"""
    
    profile = db.query(PatientProfile).filter(
        PatientProfile.patient_id == patient_id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get all predictions
    history = db.query(PredictionHistory).filter(
        PredictionHistory.profile_id == profile.id
    ).order_by(PredictionHistory.created_at.desc()).all()
    
    # Analyze trend
    risk_trend = "stable"
    if len(history) >= 2:
        recent_risks = [h.risk_probability for h in history[:3]]
        if len(recent_risks) >= 2:
            if recent_risks[0] < recent_risks[-1]:
                risk_trend = "improving"
            elif recent_risks[0] > recent_risks[-1]:
                risk_trend = "worsening"
    
    return PatientTimelineResponse(
        profile=profile.to_dict(),
        history=[h.to_dict() for h in history],
        risk_trend=risk_trend
    )

@app.get("/profiles/{patient_id}/latest")
async def get_latest_prediction(patient_id: str, db: Session = Depends(get_db)):
    """Get patient's latest prediction"""
    
    profile = db.query(PatientProfile).filter(
        PatientProfile.patient_id == patient_id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    latest = db.query(PredictionHistory).filter(
        PredictionHistory.profile_id == profile.id
    ).order_by(PredictionHistory.created_at.desc()).first()
    
    if not latest:
        return {"message": "No predictions found for this patient"}
    
    return latest.to_dict()

# ============ STATISTICS ============

@app.get("/stats", response_model=StatsResponse)
async def get_statistics(db: Session = Depends(get_db)):
    """Get overall statistics"""
    
    total_patients = db.query(PatientProfile).count()
    total_predictions = db.query(PredictionHistory).count()
    high_risk = db.query(PredictionHistory).filter(
        PredictionHistory.prediction == "High Risk"
    ).count()
    low_risk = db.query(PredictionHistory).filter(
        PredictionHistory.prediction == "Low Risk"
    ).count()
    
    return StatsResponse(
        total_patients=total_patients,
        total_predictions=total_predictions,
        high_risk_count=high_risk,
        low_risk_count=low_risk,
        high_risk_percentage=round((high_risk / total_predictions * 100) if total_predictions > 0 else 0, 2),
        low_risk_percentage=round((low_risk / total_predictions * 100) if total_predictions > 0 else 0, 2)
    )

# ============ REPORT GENERATION ============

@app.get("/report/{prediction_id}")
async def download_report(prediction_id: int, db: Session = Depends(get_db)):
    """Generate and download PDF report for a specific prediction"""
    
    prediction = db.query(PredictionHistory).filter(
        PredictionHistory.id == prediction_id
    ).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    profile = db.query(PatientProfile).filter(
        PatientProfile.id == prediction.profile_id
    ).first()
    
    # Prepare data for report
    report_data = prediction.to_dict()
    report_data['name'] = profile.name
    report_data['patient_id'] = profile.patient_id
    
    # Generate PDF
    pdf_buffer = generate_patient_report(report_data)
    
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=patient_{profile.patient_id}_report_{prediction_id}.pdf"
        }
    )

# ============ BACKWARD COMPATIBILITY (Old endpoints still work) ============

@app.get("/patients")
async def get_all_patients_legacy(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Legacy endpoint - returns all predictions"""
    predictions = db.query(PredictionHistory).order_by(
        PredictionHistory.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    result = []
    for p in predictions:
        profile = db.query(PatientProfile).filter(
            PatientProfile.id == p.profile_id
        ).first()
        
        data = p.to_dict()
        data['name'] = profile.name if profile else "Unknown"
        data['patient_id'] = profile.patient_id if profile else "Unknown"
        result.append(data)
    
    return result


@app.get("/export/patients/excel")
def export_all_patients_excel(db: Session = Depends(get_db)):
    """Export all patient predictions to Excel"""
    try:
        excel_file = create_patients_excel(db)
        
        filename = f"heart_disease_patients_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return StreamingResponse(
            excel_file,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/export/high-risk/excel")
def export_high_risk_patients_excel(db: Session = Depends(get_db)):
    """Export high-risk patients to Excel"""
    try:
        excel_file = create_high_risk_patients_excel(db)
        
        filename = f"high_risk_patients_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        return StreamingResponse(
            excel_file,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
