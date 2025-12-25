import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

def create_sample_dataset():
    """Create a realistic sample heart disease dataset"""
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'age': np.random.randint(30, 80, n_samples),
        'sex': np.random.randint(0, 2, n_samples),  # 0: female, 1: male
        'cp': np.random.randint(0, 4, n_samples),  # chest pain type
        'trestbps': np.random.randint(90, 200, n_samples),  # resting blood pressure
        'chol': np.random.randint(120, 400, n_samples),  # cholesterol
        'fbs': np.random.randint(0, 2, n_samples),  # fasting blood sugar
        'restecg': np.random.randint(0, 3, n_samples),  # resting ECG
        'thalach': np.random.randint(70, 200, n_samples),  # max heart rate
        'exang': np.random.randint(0, 2, n_samples),  # exercise induced angina
        'oldpeak': np.random.uniform(0, 6, n_samples),  # ST depression
        'slope': np.random.randint(0, 3, n_samples),  # slope of peak exercise ST
        'ca': np.random.randint(0, 4, n_samples),  # number of major vessels
        'thal': np.random.randint(0, 4, n_samples)  # thalassemia
    }
    
    df = pd.DataFrame(data)
    
    # Create target based on realistic risk factors
    risk_score = (
        (df['age'] > 55).astype(int) * 2 +
        (df['sex'] == 1).astype(int) * 1.5 +
        (df['cp'] > 2).astype(int) * 2 +
        (df['trestbps'] > 140).astype(int) * 1.5 +
        (df['chol'] > 240).astype(int) * 1.5 +
        (df['thalach'] < 120).astype(int) * 2 +
        (df['exang'] == 1).astype(int) * 2 +
        (df['oldpeak'] > 2).astype(int) * 1.5 +
        np.random.uniform(0, 2, n_samples)
    )
    
    df['target'] = (risk_score > 6).astype(int)  # 1: high risk, 0: low risk
    
    return df

def train_model():
    """Train the heart disease prediction model"""
    print("Creating sample dataset...")
    df = create_sample_dataset()
    
    # Save dataset
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/heart_disease_data.csv', index=False)
    print(f"Dataset created with {len(df)} samples")
    print(f"Target distribution:\n{df['target'].value_counts()}")
    
    # Split features and target
    X = df.drop('target', axis=1)
    y = df['target']
    
    # Split into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    print("\nScaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training Logistic Regression model...")
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'High Risk']))
    
    # Save model and scaler
    os.makedirs('models', exist_ok=True)
    with open('models/model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('models/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    print("\nModel and scaler saved successfully!")
    print("Files created:")
    print("- models/model.pkl")
    print("- models/scaler.pkl")
    print("- data/heart_disease_data.csv")
    
    return model, scaler, accuracy

if __name__ == "__main__":
    train_model()
