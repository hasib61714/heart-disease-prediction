import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { predictHeartDisease, downloadReport } from '../utils/api';
import { 
  FaUser, FaHeartbeat, FaCheckCircle, FaExclamationTriangle, 
  FaDownload, FaRedo, FaChartLine, FaHistory, FaCapsules,
  FaArrowRight, FaArrowLeft
} from 'react-icons/fa';
import PatientSearch from '../components/PatientSearch';
import PatientTimeline from '../components/PatientTimeline';
import PageThreeDotMenu from '../components/PageThreeDotMenu';

const Predict = () => {
  const { t, language } = useLanguage();
  
  // Multi-step state
  const [step, setStep] = useState('search'); // 'search' | 'profile-form' | 'medical-form' | 'result' | 'timeline'
  const [currentFormStep, setCurrentFormStep] = useState(1); // For medical form steps
  
  // Patient state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isNewPatient, setIsNewPatient] = useState(false);
  
  // Loading and result state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Loading messages
  const [loadingMessage, setLoadingMessage] = useState('');

  // Profile data for new patient
  const [profileData, setProfileData] = useState({
    patient_id: '',
    name: '',
    date_of_birth: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: ''
  });

  // Medical data
  const [medicalData, setMedicalData] = useState({
    age: '',
    sex: '1',
    cp: '0',
    trestbps: '',
    chol: '',
    fbs: '0',
    restecg: '0',
    thalach: '',
    exang: '0',
    oldpeak: '',
    slope: '1',
    ca: '',
    thal: '0',
    doctor_notes: ''
  });

  // Clinical loading messages
  const loadingMessages = [
    language === 'en' ? 'Analyzing cardiovascular indicators...' : 'কার্ডিওভাসকুলার সূচক বিশ্লেষণ করা হচ্ছে...',
    language === 'en' ? 'Evaluating clinical parameters...' : 'ক্লিনিক্যাল পরামিতি মূল্যায়ন করা হচ্ছে...',
    language === 'en' ? 'Processing medical data...' : 'চিকিৎসা তথ্য প্রক্রিয়া করা হচ্ছে...',
    language === 'en' ? 'Calculating risk assessment...' : 'ঝুঁকি মূল্যায়ন গণনা করা হচ্ছে...',
    language === 'en' ? 'Generating recommendations...' : 'সুপারিশ তৈরি করা হচ্ছে...'
  ];

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setIsNewPatient(false);
    setStep('medical-form');
  };

  const handleNewPatient = () => {
    setIsNewPatient(true);
    setStep('profile-form');
  };

  // Handle profile form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setStep('medical-form');
  };

  // Handle medical form change
  const handleMedicalChange = (e) => {
    setMedicalData({
      ...medicalData,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile change
  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  // Cycle loading messages
  const startLoadingMessages = () => {
    let index = 0;
    setLoadingMessage(loadingMessages[0]);
    
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 1500);
    
    return interval;
  };

  // Handle final submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const interval = startLoadingMessages();

    try {
      const payload = {
        age: parseInt(medicalData.age),
        sex: parseInt(medicalData.sex),
        cp: parseInt(medicalData.cp),
        trestbps: parseInt(medicalData.trestbps),
        chol: parseInt(medicalData.chol),
        fbs: parseInt(medicalData.fbs),
        restecg: parseInt(medicalData.restecg),
        thalach: parseInt(medicalData.thalach),
        exang: parseInt(medicalData.exang),
        oldpeak: parseFloat(medicalData.oldpeak),
        slope: parseInt(medicalData.slope),
        ca: parseInt(medicalData.ca),
        thal: parseInt(medicalData.thal),
        doctor_notes: medicalData.doctor_notes
      };

      // Add patient info
      if (selectedPatient) {
        payload.patient_id = selectedPatient.patient_id;
      } else if (isNewPatient) {
        payload.profile_data = profileData;
      }

      const response = await predictHeartDisease(payload);
      setResult(response);
      setStep('result');
    } catch (err) {
      // Handle validation errors properly
      let errorMessage = 'Prediction failed. Please try again.';
      
      if (err.response?.data?.detail) {
        // If detail is an array of validation errors
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail
            .map(e => `${e.loc?.join(' > ')}: ${e.msg}`)
            .join(', ');
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        }
      }
      
      setError(errorMessage);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (result?.prediction_id) {
      try {
        await downloadReport(result.prediction_id);
      } catch (err) {
        setError('Failed to download report');
      }
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setSelectedPatient(null);
    setIsNewPatient(false);
    setCurrentFormStep(1);
    setMedicalData({
      age: '',
      sex: '1',
      cp: '0',
      trestbps: '',
      chol: '',
      fbs: '0',
      restecg: '0',
      thalach: '',
      exang: '0',
      oldpeak: '',
      slope: '1',
      ca: '',
      thal: '0',
      doctor_notes: ''
    });
    setProfileData({
      patient_id: '',
      name: '',
      date_of_birth: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: ''
    });
    setStep('search');
  };

  const handleViewTimeline = () => {
    setStep('timeline');
  };

  // Calculate risk factors for explanation
  const getRiskFactors = () => {
    if (!result) return [];
    
    const factors = [];
    const data = medicalData;
    
    // High cholesterol
    if (parseInt(data.chol) > 240) {
      factors.push({
        factor: language === 'en' ? 'High Cholesterol' : 'উচ্চ কোলেস্টেরল',
        value: `${data.chol} mg/dl`,
        status: 'high',
        impact: 'high',
        description: language === 'en' 
          ? 'Above normal range (>240 mg/dl)' 
          : 'স্বাভাবিক সীমার উপরে (>২৪০ mg/dl)'
      });
    } else if (parseInt(data.chol) < 200) {
      factors.push({
        factor: language === 'en' ? 'Cholesterol' : 'কোলেস্টেরল',
        value: `${data.chol} mg/dl`,
        status: 'good',
        impact: 'low',
        description: language === 'en' 
          ? 'Within normal range (<200 mg/dl)' 
          : 'স্বাভাবিক সীমার মধ্যে (<২০০ mg/dl)'
      });
    }
    
    // Blood pressure
    if (parseInt(data.trestbps) > 140) {
      factors.push({
        factor: language === 'en' ? 'High Blood Pressure' : 'উচ্চ রক্তচাপ',
        value: `${data.trestbps} mm Hg`,
        status: 'high',
        impact: 'high',
        description: language === 'en' 
          ? 'Elevated (>140 mm Hg)' 
          : 'বর্ধিত (>১৪০ mm Hg)'
      });
    }
    
    // Age factor
    if (parseInt(data.age) > 55) {
      factors.push({
        factor: language === 'en' ? 'Age Factor' : 'বয়সের কারণ',
        value: `${data.age} years`,
        status: 'warning',
        impact: 'medium',
        description: language === 'en' 
          ? 'Age-related risk increases' 
          : 'বয়স-সম্পর্কিত ঝুঁকি বৃদ্ধি'
      });
    }
    
    // Exercise-induced angina
    if (parseInt(data.exang) === 1) {
      factors.push({
        factor: language === 'en' ? 'Exercise-Induced Angina' : 'ব্যায়াম-জনিত এনজাইনা',
        value: language === 'en' ? 'Present' : 'উপস্থিত',
        status: 'high',
        impact: 'high',
        description: language === 'en' 
          ? 'Chest pain during exercise' 
          : 'ব্যায়ামের সময় বুকে ব্যথা'
      });
    }
    
    // Max heart rate
    if (parseInt(data.thalach) < 120) {
      factors.push({
        factor: language === 'en' ? 'Low Max Heart Rate' : 'কম সর্বোচ্চ হৃদস্পন্দন',
        value: `${data.thalach} bpm`,
        status: 'warning',
        impact: 'medium',
        description: language === 'en' 
          ? 'Below typical range' 
          : 'সাধারণ সীমার নিচে'
      });
    }

    // ST Depression
    if (parseFloat(data.oldpeak) > 2) {
      factors.push({
        factor: language === 'en' ? 'ST Depression' : 'ST ডিপ্রেশন',
        value: data.oldpeak,
        status: 'high',
        impact: 'high',
        description: language === 'en' 
          ? 'Elevated ST depression' 
          : 'বর্ধিত ST ডিপ্রেশন'
      });
    }
    
    return factors;
  };

  // Get medication guidance
  const getMedicationGuidance = () => {
    if (!result) return null;
    
    if (result.prediction === 'High Risk') {
      return {
        categories: [
          {
            name: language === 'en' ? 'Cholesterol Management' : 'কোলেস্টেরল ব্যবস্থাপনা',
            medications: language === 'en' 
              ? 'Statins (e.g., Atorvastatin, Rosuvastatin)' 
              : 'স্ট্যাটিন (যেমন, Atorvastatin, Rosuvastatin)',
            icon: '💊'
          },
          {
            name: language === 'en' ? 'Blood Pressure Control' : 'রক্তচাপ নিয়ন্ত্রণ',
            medications: language === 'en' 
              ? 'ACE Inhibitors, Beta Blockers' 
              : 'ACE ইনহিবিটর, বিটা ব্লকার',
            icon: '💉'
          },
          {
            name: language === 'en' ? 'Antiplatelet Therapy' : 'অ্যান্টিপ্লেটলেট থেরাপি',
            medications: language === 'en' 
              ? 'Aspirin (if recommended by doctor)' 
              : 'অ্যাসপিরিন (ডাক্তারের পরামর্শ অনুযায়ী)',
            icon: '🩺'
          }
        ],
        disclaimer: language === 'en'
          ? '⚠️ IMPORTANT: This is NOT a prescription. These are general medication categories that may be considered. Always consult your cardiologist before taking any medication.'
          : '⚠️ গুরুত্বপূর্ণ: এটি কোনো প্রেসক্রিপশন নয়। এগুলো সাধারণ ওষুধের শ্রেণী যা বিবেচনা করা যেতে পারে। যেকোনো ওষুধ খাওয়ার আগে অবশ্যই আপনার হৃদরোগ বিশেষজ্ঞের সাথে পরামর্শ করুন।'
      };
    }
    
    return null;
  };

  // RENDER: Timeline View
  if (step === 'timeline' && selectedPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setStep('result')}
            className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>{language === 'en' ? 'Back to Result' : 'ফলাফলে ফিরে যান'}</span>
          </button>
          <PatientTimeline patientId={selectedPatient.patient_id} />
        </div>
      </div>
    );
  }

  // RENDER: Result View with All Features
  if (step === 'result' && result) {
    const riskFactors = getRiskFactors();
    const medicationGuidance = getMedicationGuidance();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* Header with Three Dot Menu */}
            <div className="flex justify-between items-start mb-8">
              <div className="text-center flex-1">
                <div className="flex justify-center mb-4">
                  {result.prediction === 'High Risk' ? (
                    <FaExclamationTriangle className="text-red-500 text-6xl animate-pulse" />
                  ) : (
                    <FaCheckCircle className="text-green-500 text-6xl" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {t('predictionResult')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {result.patient_name}
                  {result.is_new_patient && (
                    <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                      {language === 'en' ? 'New Patient' : 'নতুন রোগী'}
                    </span>
                  )}
                </p>
              </div>
              
              <PageThreeDotMenu 
                context="prediction-result"
                data={result}
                onDownload={handleDownloadReport}
                onShare={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Heart Disease Prediction',
                      text: `Risk: ${result.prediction} (${result.risk_probability}%)`,
                    });
                  }
                }}
              />
            </div>

            {/* Risk Level Card */}
            <div className={`p-6 rounded-xl mb-6 ${
              result.prediction === 'High Risk' 
                ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500' 
                : 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
            }`}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('riskLevel')}</p>
                  <p className={`text-3xl font-bold ${
                    result.prediction === 'High Risk' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    {result.prediction}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('riskProbability')}</p>
                  <div className="flex items-center space-x-3">
                    <p className={`text-3xl font-bold ${
                      result.prediction === 'High Risk' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {result.risk_probability}%
                    </p>
                    {/* Visual Risk Meter */}
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full transition-all duration-1000 ${
                            result.risk_probability > 70 ? 'bg-red-600' :
                            result.risk_probability > 40 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${result.risk_probability}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 rounded mb-6">
              <p className="text-gray-700 dark:text-gray-300">{result.message}</p>
            </div>

            {/* Risk Factors Explanation */}
            {riskFactors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
                  <FaChartLine className="text-blue-600" />
                  <span>{language === 'en' ? 'Risk Factor Analysis' : 'ঝুঁকি কারণ বিশ্লেষণ'}</span>
                </h3>
                <div className="grid gap-3">
                  {riskFactors.map((factor, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        factor.status === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                        factor.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                        'bg-green-50 dark:bg-green-900/20 border-green-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white">{factor.factor}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{factor.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{factor.value}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            factor.impact === 'high' ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' :
                            factor.impact === 'medium' ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' :
                            'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                          }`}>
                            {factor.impact === 'high' ? (language === 'en' ? 'High Impact' : 'উচ্চ প্রভাব') :
                             factor.impact === 'medium' ? (language === 'en' ? 'Medium Impact' : 'মাঝারি প্রভাব') :
                             (language === 'en' ? 'Low Impact' : 'কম প্রভাব')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medication Guidance */}
            {medicationGuidance && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
                  <FaCapsules className="text-purple-600" />
                  <span>{language === 'en' ? 'Medication Guidance' : 'ওষুধের নির্দেশনা'}</span>
                </h3>
                
                <div className="grid gap-3 mb-4">
                  {medicationGuidance.categories.map((cat, index) => (
                    <div key={index} className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white">{cat.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{cat.medications}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-4 rounded-lg">
                  <p className="text-sm text-yellow-900 dark:text-yellow-200">{medicationGuidance.disclaimer}</p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{t('recommendations')}</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={handleDownloadReport}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
              >
                <FaDownload />
                <span>{t('downloadReport')}</span>
              </button>
              
              {selectedPatient && (
                <button
                  onClick={handleViewTimeline}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center justify-center space-x-2"
                >
                  <FaHistory />
                  <span>{language === 'en' ? 'View Timeline' : 'টাইমলাইন দেখুন'}</span>
                </button>
              )}
              
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <FaRedo />
                <span>{t('newPrediction')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Medical Form (Step 3)
  if (step === 'medical-form') {
    const totalSteps = 3;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => isNewPatient ? setStep('profile-form') : setStep('search')}
            className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>{language === 'en' ? 'Back' : 'ফিরে যান'}</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <FaHeartbeat className="text-red-500 text-6xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('predictTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">{t('predictSubtitle')}</p>
          </div>

          {/* Patient Info Card */}
          {selectedPatient && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {language === 'en' ? 'Patient:' : 'রোগী:'} {selectedPatient.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {selectedPatient.patient_id} | 
                    {language === 'en' ? ' Previous Checkups:' : ' পূর্ববর্তী চেকআপ:'} {selectedPatient.total_predictions}
                  </p>
                </div>
                <button
                  onClick={() => setStep('timeline')}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1"
                >
                  <FaHistory />
                  <span>{language === 'en' ? 'View History' : 'ইতিহাস দেখুন'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`flex flex-col items-center ${currentFormStep >= stepNum ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentFormStep >= stepNum 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {stepNum}
                    </div>
                    <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                      {stepNum === 1 ? (language === 'en' ? 'Basic' : 'মৌলিক') :
                       stepNum === 2 ? (language === 'en' ? 'Vitals' : 'গুরুত্বপূর্ণ') :
                       (language === 'en' ? 'Additional' : 'অতিরিক্ত')}
                    </span>
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 ${currentFormStep > stepNum ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-6">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* Step 1: Basic Information */}
            {currentFormStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
                  <FaUser className="text-blue-600" />
                  <span>{t('personalInfo')}</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('age')} *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={medicalData.age}
                      onChange={handleMedicalChange}
                      placeholder={t('agePlaceholder')}
                      min="1"
                      max="120"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('gender')} *
                    </label>
                    <select
                      name="sex"
                      value={medicalData.sex}
                      onChange={handleMedicalChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="1">{t('male')}</option>
                      <option value="0">{t('female')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('chestPainType')} *
                    </label>
                    <select
                      name="cp"
                      value={medicalData.cp}
                      onChange={handleMedicalChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="0">{t('chestPain0')}</option>
                      <option value="1">{t('chestPain1')}</option>
                      <option value="2">{t('chestPain2')}</option>
                      <option value="3">{t('chestPain3')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('exerciseAngina')} *
                    </label>
                    <select
                      name="exang"
                      value={medicalData.exang}
                      onChange={handleMedicalChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="1">{t('yes')}</option>
                      <option value="0">{t('no')}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentFormStep(2)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center space-x-2"
                  >
                    <span>{language === 'en' ? 'Next' : 'পরবর্তী'}</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Vital Signs */}
            {currentFormStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
                  <FaHeartbeat className="text-red-600" />
                  <span>{language === 'en' ? 'Vital Signs' : 'গুরুত্বপূর্ণ লক্ষণ'}</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('restingBP')} *
                    </label>
                    <input
                      type="number"
                      name="trestbps"
                      value={medicalData.trestbps}
                      onChange={handleMedicalChange}
                      placeholder={t('restingBPPlaceholder')}
                      min="80"
                      max="250"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('cholesterol')} *
                    </label>
                    <input
                      type="number"
                      name="chol"
                      value={medicalData.chol}
                      onChange={handleMedicalChange}
                      placeholder={t('cholesterolPlaceholder')}
                      min="100"
                      max="600"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('maxHeartRate')} *
                    </label>
                    <input
                      type="number"
                      name="thalach"
                      value={medicalData.thalach}
                      onChange={handleMedicalChange}
                      placeholder={t('maxHeartRatePlaceholder')}
                      min="60"
                      max="220"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('fastingBS')} *
                    </label>
                    <select
                      name="fbs"
                      value={medicalData.fbs}
                      onChange={handleMedicalChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="1">{t('yes')}</option>
                      <option value="0">{t('no')}</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentFormStep(1)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center space-x-2"
                  >
                    <FaArrowLeft />
                    <span>{language === 'en' ? 'Back' : 'পিছনে'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentFormStep(3)}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center space-x-2"
                  >
                    <span>{language === 'en' ? 'Next' : 'পরবর্তী'}</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Additional Parameters */}
            {currentFormStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  {language === 'en' ? 'Additional Parameters' : 'অতিরিক্ত পরামিতি'}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('restingECG')} *
                    </label>
                    <select
                      name="restecg"
                      value={medicalData.restecg}
                      onChange={handleMedicalChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="0">{t('ecg0')}</option>
                      <option value="1">{t('ecg1')}</option>
                      <option value="2">{t('ecg2')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('stDepression')} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="oldpeak"
                      value={medicalData.oldpeak}
                      onChange={handleMedicalChange}
                      placeholder={t('stDepressionPlaceholder')}
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('stSlope')} *
                    </label>
                    <select
                      name="slope"
                      value={medicalData.slope}
                      onChange={handleMedicalChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="0">{t('slope0')}</option>
                      <option value="1">{t('slope1')}</option>
                      <option value="2">{t('slope2')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('majorVessels')} *
                    </label>
                    <input
                      type="number"
                      name="ca"
                      value={medicalData.ca}
                      onChange={handleMedicalChange}
                      placeholder={t('majorVesselsPlaceholder')}
                      min="0"
                      max="4"
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('thalassemia')} *
                    </label>
                    <select
                      name="thal"
                      value={medicalData.thal}
                      onChange={handleMedicalChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="0">{t('thal0')}</option>
                      <option value="1">{t('thal1')}</option>
                      <option value="2">{t('thal2')}</option>
                      <option value="3">{t('thal3')}</option>
                    </select>
                  </div>

                  {/* Doctor Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'en' ? 'Doctor\'s Notes (Optional)' : 'ডাক্তারের মন্তব্য (ঐচ্ছিক)'}
                    </label>
                    <textarea
                      name="doctor_notes"
                      value={medicalData.doctor_notes}
                      onChange={handleMedicalChange}
                      rows="3"
                      placeholder={language === 'en' ? 'Add clinical observations or notes...' : 'ক্লিনিক্যাল পর্যবেক্ষণ বা মন্তব্য যোগ করুন...'}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    ></textarea>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentFormStep(2)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center space-x-2"
                  >
                    <FaArrowLeft />
                    <span>{language === 'en' ? 'Back' : 'পিছনে'}</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>{loadingMessage}</span>
                      </div>
                    ) : (
                      t('predictButton')
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  // RENDER: Profile Form (Step 2)
  if (step === 'profile-form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setStep('search')}
            className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>{language === 'en' ? 'Back' : 'ফিরে যান'}</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              {language === 'en' ? 'Create Patient Profile' : 'রোগী প্রোফাইল তৈরি করুন'}
            </h2>
            
            <form onSubmit={handleProfileSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Patient ID *' : 'রোগী আইডি *'}
                  </label>
                  <input
                    type="text"
                    name="patient_id"
                    value={profileData.patient_id}
                    onChange={handleProfileChange}
                    placeholder={language === 'en' ? 'e.g., P001 or phone number' : 'যেমন, P001 বা ফোন নম্বর'}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Full Name *' : 'সম্পূর্ণ নাম *'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder={language === 'en' ? 'Enter patient full name' : 'রোগীর সম্পূর্ণ নাম লিখুন'}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Date of Birth *' : 'জন্ম তারিখ *'}
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={profileData.date_of_birth}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Gender *' : 'লিঙ্গ *'}
                  </label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Male">{language === 'en' ? 'Male' : 'পুরুষ'}</option>
                    <option value="Female">{language === 'en' ? 'Female' : 'মহিলা'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Phone Number *' : 'ফোন নম্বর *'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder={language === 'en' ? 'e.g., 01712345678' : 'যেমন, ০১৭১২৩৪৫৬৭৮'}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Email (Optional)' : 'ইমেইল (ঐচ্ছিক)'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder={language === 'en' ? 'patient@example.com' : 'patient@example.com'}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'en' ? 'Address (Optional)' : 'ঠিকানা (ঐচ্ছিক)'}
                  </label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    rows="2"
                    placeholder={language === 'en' ? 'Enter full address' : 'সম্পূর্ণ ঠিকানা লিখুন'}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all text-lg flex items-center justify-center space-x-2"
                >
                  <span>{language === 'en' ? 'Continue to Medical Form' : 'চিকিৎসা ফর্মে এগিয়ে যান'}</span>
                  <FaArrowRight />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: Patient Search (Step 1 - Default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <PatientSearch 
          onPatientSelect={handlePatientSelect}
          onNewPatient={handleNewPatient}
        />
      </div>
    </div>
  );
};

export default Predict;
