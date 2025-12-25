import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getStatistics } from '../utils/api';
import { FaUsers, FaHeartbeat, FaExclamationTriangle, FaCheckCircle, FaDownload, FaFileExcel } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportAll = async () => {
    try {
      const response = await fetch(`${API_URL}/export/patients/excel`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `patients_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  const handleExportHighRisk = async () => {
    try {
      const response = await fetch(`${API_URL}/export/high-risk/excel`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `high_risk_patients_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Overview of patient predictions' : 'রোগী পূর্বাভাসের সারসংক্ষেপ'}
          </p>
        </div>

        {/* Export Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={handleExportAll}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg"
          >
            <FaFileExcel />
            <span>{language === 'en' ? 'Export All Patients' : 'সব রোগী এক্সপোর্ট করুন'}</span>
          </button>
          
          <button
            onClick={handleExportHighRisk}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg"
          >
            <FaFileExcel />
            <span>{language === 'en' ? 'Export High Risk Only' : 'শুধু উচ্চ ঝুঁকি এক্সপোর্ট করুন'}</span>
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Patients */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FaUsers className="text-3xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats?.total_predictions || 0}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {t('totalPredictions')}
            </p>
          </div>

          {/* High Risk */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <FaExclamationTriangle className="text-3xl text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats?.high_risk_count || 0}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {t('highRiskPatients')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {stats?.high_risk_percentage?.toFixed(1) || 0}% {language === 'en' ? 'of total' : 'মোট থেকে'}
            </p>
          </div>

          {/* Low Risk */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <FaCheckCircle className="text-3xl text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats?.low_risk_count || 0}
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {t('lowRiskPatients')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {stats?.low_risk_percentage?.toFixed(1) || 0}% {language === 'en' ? 'of total' : 'মোট থেকে'}
            </p>
          </div>

          {/* Average Risk */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <FaHeartbeat className="text-3xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {stats?.average_risk?.toFixed(1) || 0}%
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {t('averageRisk')}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'System Information' : 'সিস্টেম তথ্য'}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'en' ? 'Total Patient Profiles' : 'মোট রোগী প্রোফাইল'}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.total_profiles || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'en' ? 'Latest Prediction' : 'সর্বশেষ পূর্বাভাস'}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats?.latest_prediction ? new Date(stats.latest_prediction).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
