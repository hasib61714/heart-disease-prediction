import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaChartLine, FaCalendar, FaHeartbeat, FaArrowUp, FaArrowDown, FaMinus, FaDownload } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PatientTimeline = ({ patientId }) => {
  const { t, language } = useLanguage();
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTimeline();
  }, [patientId]);

  const fetchTimeline = async () => {
    try {
      const response = await axios.get(`${API_URL}/profiles/${patientId}/timeline`);
      setTimeline(response.data);
    } catch (err) {
      setError('Failed to load patient timeline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          {language === 'en' ? 'Loading timeline...' : 'টাইমলাইন লোড হচ্ছে...'}
        </div>
      </div>
    );
  }

  if (error || !timeline) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = timeline.history.slice().reverse().map((h, index) => ({
    checkup: `#${timeline.history.length - index}`,
    risk: h.risk_probability,
    date: new Date(h.created_at).toLocaleDateString()
  }));

  // Trend icon
  const getTrendIcon = () => {
    switch (timeline.risk_trend) {
      case 'improving':
        return <FaArrowDown className="text-green-500 text-2xl" />;
      case 'worsening':
        return <FaArrowUp className="text-red-500 text-2xl" />;
      default:
        return <FaMinus className="text-yellow-500 text-2xl" />;
    }
  };

  const getTrendText = () => {
    switch (timeline.risk_trend) {
      case 'improving':
        return language === 'en' ? 'Improving' : 'উন্নতি হচ্ছে';
      case 'worsening':
        return language === 'en' ? 'Worsening' : 'খারাপ হচ্ছে';
      default:
        return language === 'en' ? 'Stable' : 'স্থিতিশীল';
    }
  };

  const getTrendColor = () => {
    switch (timeline.risk_trend) {
      case 'improving':
        return 'bg-green-100 dark:bg-green-900/30 border-green-500';
      case 'worsening':
        return 'bg-red-100 dark:bg-red-900/30 border-red-500';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Info Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {timeline.profile.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              ID: {timeline.profile.patient_id}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 flex items-center space-x-2 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-semibold">{getTrendText()}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Date of Birth' : 'জন্ম তারিখ'}:
            </span>
            <p className="font-semibold text-gray-800 dark:text-white">
              {timeline.profile.date_of_birth}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Gender' : 'লিঙ্গ'}:
            </span>
            <p className="font-semibold text-gray-800 dark:text-white">
              {timeline.profile.gender}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Phone' : 'ফোন'}:
            </span>
            <p className="font-semibold text-gray-800 dark:text-white">
              {timeline.profile.phone}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'Total Checkups' : 'মোট চেকআপ'}:
            </span>
            <p className="font-semibold text-gray-800 dark:text-white">
              {timeline.profile.total_predictions}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Trend Chart */}
      {timeline.history.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
            <FaChartLine className="text-blue-500" />
            <span>{language === 'en' ? 'Risk Trend' : 'ঝুঁকির ধারা'}</span>
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="checkup" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-3 shadow-lg">
                        <p className="font-semibold">{payload[0].payload.checkup}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{payload[0].payload.date}</p>
                        <p className="text-lg font-bold" style={{ color: payload[0].color }}>
                          {payload[0].value.toFixed(2)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={3}
                name={language === 'en' ? 'Risk %' : 'ঝুঁকি %'}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
          <FaCalendar className="text-purple-500" />
          <span>{language === 'en' ? 'Checkup History' : 'চেকআপ ইতিহাস'}</span>
        </h3>

        <div className="space-y-4">
          {timeline.history.map((record, index) => (
            <div 
              key={record.id}
              className="relative pl-8 pb-8 border-l-2 border-gray-300 dark:border-gray-600 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 transform -translate-x-1/2">
                <div className={`w-4 h-4 rounded-full ${
                  record.prediction === 'High Risk' 
                    ? 'bg-red-500' 
                    : 'bg-green-500'
                }`}></div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        record.prediction === 'High Risk'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {record.prediction}
                      </span>
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {record.risk_probability}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <FaCalendar className="inline mr-1" />
                      {record.created_at}
                    </p>
                  </div>

                  <button
                    onClick={() => window.open(`${API_URL}/report/${record.id}`, '_blank')}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title={language === 'en' ? 'Download Report' : 'রিপোর্ট ডাউনলোড'}
                  >
                    <FaDownload />
                  </button>
                </div>

                {/* Medical Parameters Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">BP:</span>
                    <span className="ml-1 font-semibold">{record.trestbps}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Chol:</span>
                    <span className="ml-1 font-semibold">{record.chol}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">HR:</span>
                    <span className="ml-1 font-semibold">{record.thalach}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Age:</span>
                    <span className="ml-1 font-semibold">{record.age}</span>
                  </div>
                </div>

                {/* Doctor Notes */}
                {record.doctor_notes && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      {language === 'en' ? 'Doctor\'s Notes:' : 'ডাক্তারের মন্তব্য:'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{record.doctor_notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientTimeline;
