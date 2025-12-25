from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

# Patient Profile Schemas
class PatientProfileCreate(BaseModel):
    patient_id: str = Field(..., min_length=3, max_length=50)  # Phone/Email/ID
    name: str = Field(..., min_length=2, max_length=100)
    date_of_birth: str = Field(..., pattern=r'^\d{4}-\d{2}-\d{2}$')  # YYYY-MM-DD
    gender: str = Field(..., pattern=r'^(Male|Female)$')
    phone: str = Field(..., min_length=10, max_length=20)
    email: Optional[str] = None
    address: Optional[str] = None

class PatientProfileResponse(BaseModel):
    id: int
    patient_id: str
    name: str
    date_of_birth: str
    gender: str
    phone: str
    email: Optional[str]
    address: Optional[str]
    created_at: str
    total_predictions: int

# Prediction Input (Medical Data)
class PredictionInput(BaseModel):
    # Profile ID (for existing patients) OR create new
    patient_id: Optional[str] = None  # If existing patient
    
    # If new patient, provide profile data
    profile_data: Optional[PatientProfileCreate] = None
    
    # Medical Parameters
    age: int = Field(..., ge=1, le=120)
    sex: int = Field(..., ge=0, le=1)
    cp: int = Field(..., ge=0, le=3)
    trestbps: int = Field(..., ge=80, le=250)
    chol: int = Field(..., ge=100, le=600)
    fbs: int = Field(..., ge=0, le=1)
    restecg: int = Field(..., ge=0, le=2)
    thalach: int = Field(..., ge=60, le=220)
    exang: int = Field(..., ge=0, le=1)
    oldpeak: float = Field(..., ge=0, le=10)
    slope: int = Field(..., ge=0, le=2)
    ca: int = Field(..., ge=0, le=4)
    thal: int = Field(..., ge=0, le=3)
    
    # Optional doctor notes
    doctor_notes: Optional[str] = None

class PredictionResponse(BaseModel):
    prediction_id: int
    patient_id: str
    patient_name: str
    prediction: str
    risk_probability: float
    message: str
    recommendations: List[str]
    is_new_patient: bool

class PredictionHistoryResponse(BaseModel):
    id: int
    age: int
    sex: str
    prediction: str
    risk_probability: float
    created_at: str
    doctor_notes: Optional[str]

class PatientTimelineResponse(BaseModel):
    profile: PatientProfileResponse
    history: List[PredictionHistoryResponse]
    risk_trend: str  # "improving", "stable", "worsening"
    
class StatsResponse(BaseModel):
    total_patients: int
    total_predictions: int
    high_risk_count: int
    low_risk_count: int
    high_risk_percentage: float
    low_risk_percentage: float
