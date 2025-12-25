import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FaHeartbeat, FaClock, FaFileDownload, FaHistory, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: <FaHeartbeat className="text-5xl text-red-500" />,
      title: t('feature1Title'),
      desc: t('feature1Desc')
    },
    {
      icon: <FaClock className="text-5xl text-blue-500" />,
      title: t('feature2Title'),
      desc: t('feature2Desc')
    },
    {
      icon: <FaFileDownload className="text-5xl text-green-500" />,
      title: t('feature3Title'),
      desc: t('feature3Desc')
    },
    {
      icon: <FaHistory className="text-5xl text-purple-500" />,
      title: t('feature4Title'),
      desc: t('feature4Desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-full shadow-2xl animate-pulse">
              <FaHeartbeat className="text-white text-7xl" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('welcomeTitle')}
          </h1>

          <p className="text-2xl md:text-3xl text-blue-600 font-semibold mb-6">
            {t('welcomeSubtitle')}
          </p>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            {t('welcomeDesc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/predict')}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center justify-center space-x-2"
            >
              <span>{t('getStarted')}</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all"
            >
              {t('viewDashboard')}
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          {t('features')}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('language') === 'bn' 
              ? 'আজই আপনার হৃদরোগ ঝুঁকি মূল্যায়ন শুরু করুন' 
              : 'Start Your Heart Health Assessment Today'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('language') === 'bn'
              ? 'প্রাথমিক সনাক্তকরণ জীবন বাঁচাতে পারে'
              : 'Early detection can save lives'}
          </p>
          <button
            onClick={() => navigate('/predict')}
            className="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
          >
            {t('getStarted')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
