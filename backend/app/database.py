from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()

# Patient Profile - Basic Info (Permanent)
class PatientProfile(Base):
    __tablename__ = "patient_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String, unique=True, index=True)  # Unique identifier (e.g., phone/email)
    name = Column(String)
    date_of_birth = Column(String)  # YYYY-MM-DD
    gender = Column(String)  # Male/Female
    phone = Column(String)
    email = Column(String)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    predictions = relationship("PredictionHistory", back_populates="patient")
    
    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'name': self.name,
            'date_of_birth': self.date_of_birth,
            'gender': self.gender,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'total_predictions': len(self.predictions)
        }

# Prediction History - Each Checkup
class PredictionHistory(Base):
    __tablename__ = "prediction_history"
    
    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey('patient_profiles.id'))
    
    # Medical Parameters
    age = Column(Integer)
    sex = Column(Integer)  # 0: Female, 1: Male
    cp = Column(Integer)
    trestbps = Column(Integer)
    chol = Column(Integer)
    fbs = Column(Integer)
    restecg = Column(Integer)
    thalach = Column(Integer)
    exang = Column(Integer)
    oldpeak = Column(Float)
    slope = Column(Integer)
    ca = Column(Integer)
    thal = Column(Integer)
    
    # Prediction Results
    prediction = Column(String)  # High Risk / Low Risk
    risk_probability = Column(Float)
    
    # Doctor's Notes (Optional)
    doctor_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    patient = relationship("PatientProfile", back_populates="predictions")
    
    def to_dict(self):
        return {
            'id': self.id,
            'profile_id': self.profile_id,
            'age': self.age,
            'sex': 'Male' if self.sex == 1 else 'Female',
            'cp': self.cp,
            'trestbps': self.trestbps,
            'chol': self.chol,
            'fbs': self.fbs,
            'restecg': self.restecg,
            'thalach': self.thalach,
            'exang': self.exang,
            'oldpeak': self.oldpeak,
            'slope': self.slope,
            'ca': self.ca,
            'thal': self.thal,
            'prediction': self.prediction,
            'risk_probability': round(self.risk_probability * 100, 2),
            'doctor_notes': self.doctor_notes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

# Database setup
DATABASE_URL = "sqlite:///./heart_disease.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
