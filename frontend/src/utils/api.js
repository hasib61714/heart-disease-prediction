import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ PATIENT PROFILE ENDPOINTS ============

// Search patient profile
export const searchPatient = async (patientId) => {
  const response = await api.get(`/profiles/search/${patientId}`);
  return response.data;
};

// Create patient profile
export const createPatientProfile = async (profileData) => {
  const response = await api.post('/profiles/create', profileData);
  return response.data;
};

// Get all patient profiles
export const getAllProfiles = async (skip = 0, limit = 100) => {
  const response = await api.get('/profiles', {
    params: { skip, limit }
  });
  return response.data;
};

// ============ PREDICTION ENDPOINTS ============

// Prediction with patient profile support
export const predictHeartDisease = async (patientData) => {
  const response = await api.post('/predict', patientData);
  return response.data;
};

// ============ PATIENT HISTORY & TIMELINE ============

// Get patient timeline
export const getPatientTimeline = async (patientId) => {
  const response = await api.get(`/profiles/${patientId}/timeline`);
  return response.data;
};

// Get latest prediction for a patient
export const getLatestPrediction = async (patientId) => {
  const response = await api.get(`/profiles/${patientId}/latest`);
  return response.data;
};

// ============ LEGACY ENDPOINTS (Backward Compatibility) ============

// Get all patients (legacy - returns all predictions)
export const getAllPatients = async (skip = 0, limit = 100) => {
  const response = await api.get('/patients', {
    params: { skip, limit }
  });
  return response.data;
};

// Get patient detail (legacy)
export const getPatientDetail = async (patientId) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

// ============ STATISTICS ============

// Get statistics
export const getStatistics = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// ============ REPORT GENERATION ============

// Download report for a specific prediction
export const downloadReport = async (predictionId) => {
  const response = await api.get(`/report/${predictionId}`, {
    responseType: 'blob'
  });
  
  // Create blob link to download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `patient_report_${predictionId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

// ============ DELETE ============

// Delete patient (if needed)
export const deletePatient = async (patientId) => {
  const response = await api.delete(`/patients/${patientId}`);
  return response.data;
};

// ============ EXCEL EXPORT (If backend supports) ============

// Export all patients to Excel
export const exportPatientsToExcel = async () => {
  try {
    const response = await api.get('/export/patients', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `patients_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

// Export filtered patients
export const exportFilteredPatients = async (filters) => {
  try {
    const response = await api.post('/export/patients/filtered', filters, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `filtered_patients_${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

export default api;
