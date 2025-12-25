import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaGlobe } from 'react-icons/fa';

const LanguageSelection = () => {
  const { setLanguage } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
  ];

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-6 rounded-full shadow-lg">
              <FaGlobe className="text-white text-6xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Select Your Language
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            আপনার ভাষা নির্বাচন করুন
          </h2>
          <p className="text-gray-600 text-lg">
            Choose your preferred language to continue
          </p>
          <p className="text-gray-600 text-lg">
            চালিয়ে যেতে আপনার পছন্দের ভাষা বেছে নিন
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-6xl mb-4">{lang.flag}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {lang.name}
              </h3>
              <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg inline-block">
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">💡 Tip:</span> You can change the language anytime from settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
