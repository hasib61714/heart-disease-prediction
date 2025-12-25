import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaCog, FaMoon, FaSun, FaGlobe, FaBell, FaDatabase, FaTrash } from 'react-icons/fa';

const Settings = () => {
  const { language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleClearCache = () => {
    if (window.confirm(language === 'en' ? 'Clear all cached data? This will not delete patient records.' : 'সব ক্যাশ ডেটা মুছবেন? এটি রোগীর রেকর্ড মুছবে না।')) {
      localStorage.removeItem('preferences');
      alert(language === 'en' ? 'Cache cleared successfully!' : 'ক্যাশ সফলভাবে মুছে ফেলা হয়েছে!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaCog className="text-4xl text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {language === 'en' ? 'Settings' : 'সেটিংস'}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Customize your experience' : 'আপনার অভিজ্ঞতা কাস্টমাইজ করুন'}
          </p>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Appearance' : 'চেহারা'}
          </h2>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {darkMode ? <FaMoon className="text-2xl text-blue-600 dark:text-blue-400" /> : <FaSun className="text-2xl text-yellow-600" />}
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {language === 'en' ? 'Dark Mode' : 'ডার্ক মোড'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Reduce eye strain in low light' : 'কম আলোতে চোখের চাপ কমান'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Language Selection */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <FaGlobe className="text-2xl text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {language === 'en' ? 'Language' : 'ভাষা'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Choose your preferred language' : 'আপনার পছন্দের ভাষা নির্বাচন করুন'}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('bn')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  language === 'bn'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Application' : 'অ্যাপ্লিকেশন'}
          </h2>
          
          {/* Notifications */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <FaBell className="text-2xl text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {language === 'en' ? 'Notifications' : 'বিজ্ঞপ্তি'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Enable prediction alerts' : 'পূর্বাভাস সতর্কতা সক্রিয় করুন'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                notifications ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <FaDatabase className="text-2xl text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {language === 'en' ? 'Auto Save' : 'অটো সেভ'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Automatically save form progress' : 'স্বয়ংক্রিয়ভাবে ফর্ম অগ্রগতি সংরক্ষণ করুন'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                autoSave ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  autoSave ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Data Management' : 'ডেটা ব্যবস্থাপনা'}
          </h2>
          
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <FaTrash className="text-2xl text-red-600 dark:text-red-400" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {language === 'en' ? 'Clear Cache' : 'ক্যাশ মুছুন'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'en' ? 'Clear temporary data and preferences' : 'অস্থায়ী ডেটা এবং পছন্দ মুছুন'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClearCache}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              {language === 'en' ? 'Clear' : 'মুছুন'}
            </button>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Heart Disease Prediction System</p>
          <p>Version 1.0.0 • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
