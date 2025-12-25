import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaSearch, FaUser, FaPhone, FaCalendar, FaHistory } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PatientSearch = ({ onPatientSelect, onNewPatient }) => {
  const { t, language } = useLanguage();
  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearching(true);
    setError(null);
    setPatient(null);

    try {
      const response = await axios.get(`${API_URL}/profiles/search/${searchId}`);
      setPatient(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError(language === 'en' 
          ? 'Patient not found. Please create a new profile.' 
          : 'রোগী পাওয়া যায়নি। নতুন প্রোফাইল তৈরি করুন।');
      } else {
        setError(language === 'en' ? 'Search failed. Please try again.' : 'সার্চ ব্যর্থ হয়েছে।');
      }
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPatient = () => {
    if (patient) {
      onPatientSelect(patient);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {language === 'en' ? 'Patient Search' : 'রোগী খুঁজুন'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'en' 
            ? 'Search by Patient ID, Phone, or Email' 
            : 'রোগী আইডি, ফোন বা ইমেইল দিয়ে খুঁজুন'}
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={language === 'en' ? 'Enter Patient ID/Phone/Email' : 'রোগী আইডি/ফোন/ইমেইল লিখুন'}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !searchId.trim()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? (language === 'en' ? 'Searching...' : 'খুঁজছি...') : (language === 'en' ? 'Search' : 'খুঁজুন')}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Patient Found */}
      {patient && (
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-3 rounded-full">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{patient.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {patient.patient_id}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
              {language === 'en' ? 'Found' : 'পাওয়া গেছে'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <FaCalendar className="text-blue-500" />
              <span className="text-sm">
                <strong>{language === 'en' ? 'DOB:' : 'জন্ম তারিখ:'}</strong> {patient.date_of_birth}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <FaUser className="text-purple-500" />
              <span className="text-sm">
                <strong>{language === 'en' ? 'Gender:' : 'লিঙ্গ:'}</strong> {patient.gender}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <FaPhone className="text-green-500" />
              <span className="text-sm">
                <strong>{language === 'en' ? 'Phone:' : 'ফোন:'}</strong> {patient.phone}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <FaHistory className="text-orange-500" />
              <span className="text-sm">
                <strong>{language === 'en' ? 'Total Checkups:' : 'মোট চেকআপ:'}</strong> {patient.total_predictions}
              </span>
            </div>
          </div>

          <button
            onClick={handleSelectPatient}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            {language === 'en' ? 'Continue with This Patient' : 'এই রোগীর সাথে এগিয়ে যান'}
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
            {language === 'en' ? 'OR' : 'অথবা'}
          </span>
        </div>
      </div>

      {/* New Patient Button */}
      <button
        onClick={onNewPatient}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
      >
        <FaUser />
        <span>{language === 'en' ? 'Create New Patient Profile' : 'নতুন রোগী প্রোফাইল তৈরি করুন'}</span>
      </button>
    </div>
  );
};

export default PatientSearch;
