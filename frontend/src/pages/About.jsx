import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaHeart, FaCode, FaUniversity, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mb-4">
            <FaHeart className="text-4xl text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'en' ? 'About This Project' : 'এই প্রকল্প সম্পর্কে'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Heart Disease Prediction System v1.0
          </p>
        </div>

        {/* Project Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Project Overview' : 'প্রকল্পের সারসংক্ষেপ'}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {language === 'en' 
              ? 'This Heart Disease Prediction System is an advanced medical diagnostic tool that leverages machine learning to predict cardiovascular disease risk. The system provides comprehensive patient management, history tracking, and explainable AI results to support healthcare professionals in making informed decisions.'
              : 'এই হার্ট ডিজিজ প্রিডিকশন সিস্টেম একটি উন্নত চিকিৎসা নির্ণয় সরঞ্জাম যা কার্ডিওভাসকুলার রোগের ঝুঁকি পূর্বাভাস দিতে মেশিন লার্নিং ব্যবহার করে। সিস্টেমটি স্বাস্থ্যসেবা পেশাদারদের সচেতন সিদ্ধান্ত নিতে সহায়তা করার জন্য ব্যাপক রোগী ব্যবস্থাপনা, ইতিহাস ট্র্যাকিং এবং ব্যাখ্যাযোগ্য AI ফলাফল প্রদান করে।'}
          </p>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Key Features' : 'প্রধান বৈশিষ্ট্য'}
          </h2>
          <ul className="space-y-3">
            {[
              language === 'en' ? '🎯 AI-Powered Risk Prediction with 85%+ Accuracy' : '🎯 ৮৫%+ নির্ভুলতা সহ AI-চালিত ঝুঁকি পূর্বাভাস',
              language === 'en' ? '📊 Explainable AI - Know WHY the risk is high/low' : '📊 ব্যাখ্যাযোগ্য AI - জানুন কেন ঝুঁকি বেশি/কম',
              language === 'en' ? '👥 Complete Patient Profile Management' : '👥 সম্পূর্ণ রোগী প্রোফাইল ব্যবস্থাপনা',
              language === 'en' ? '📈 Timeline & Progress Tracking' : '📈 টাইমলাইন এবং অগ্রগতি ট্র্যাকিং',
              language === 'en' ? '💊 Ethical Medication Guidance' : '💊 নৈতিক ঔষধ নির্দেশনা',
              language === 'en' ? '📄 Professional PDF Report Generation' : '📄 পেশাদার PDF রিপোর্ট তৈরি',
              language === 'en' ? '🌍 Bilingual Support (English & Bengali)' : '🌍 দ্বিভাষিক সহায়তা (ইংরেজি এবং বাংলা)',
              language === 'en' ? '🌙 Dark Mode for Reduced Eye Strain' : '🌙 চোখের চাপ কমাতে ডার্ক মোড',
            ].map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technology Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaCode className="mr-2" />
            {language === 'en' ? 'Technology Stack' : 'প্রযুক্তি স্ট্যাক'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Frontend:</h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>• React 18</li>
                <li>• Tailwind CSS</li>
                <li>• Recharts</li>
                <li>• React Router</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Backend:</h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>• FastAPI (Python)</li>
                <li>• Scikit-learn</li>
                <li>• SQLAlchemy</li>
                <li>• ReportLab (PDF)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Developer Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaUniversity className="mr-2" />
            {language === 'en' ? 'Academic Project' : 'একাডেমিক প্রকল্প'}
          </h2>
          <div className="text-gray-700 dark:text-gray-300 space-y-2">
            <p><strong>{language === 'en' ? 'Institution:' : 'প্রতিষ্ঠান:'}</strong> Green University of Bangladesh</p>
            <p><strong>{language === 'en' ? 'Department:' : 'বিভাগ:'}</strong> Computer Science & Engineering</p>
            <p><strong>{language === 'en' ? 'Project Type:' : 'প্রকল্পের ধরন:'}</strong> {language === 'en' ? 'Capstone Project' : 'ক্যাপস্টোন প্রকল্প'}</p>
            <p><strong>{language === 'en' ? 'Year:' : 'বছর:'}</strong> 2024-2025</p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Contact & Support' : 'যোগাযোগ এবং সহায়তা'}
          </h2>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:support@heartdisease.app" className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
              <FaEnvelope />
              <span>Email Support</span>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <FaGithub />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>{language === 'en' ? 'Medical Disclaimer:' : 'চিকিৎসা দাবিত্যাগ:'}</strong> {language === 'en' 
              ? 'This system is designed for educational and research purposes only. It should not replace professional medical diagnosis or treatment. Always consult qualified healthcare professionals for medical advice.'
              : 'এই সিস্টেমটি শুধুমাত্র শিক্ষাগত এবং গবেষণা উদ্দেশ্যে ডিজাইন করা হয়েছে। এটি পেশাদার চিকিৎসা নির্ণয় বা চিকিৎসা প্রতিস্থাপন করা উচিত নয়। চিকিৎসা পরামর্শের জন্য সর্বদা যোগ্য স্বাস্থ্যসেবা পেশাদারদের পরামর্শ নিন।'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
