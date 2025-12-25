import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaBook, FaVideo, FaLifeRing } from 'react-icons/fa';

const Help = () => {
  const { language } = useLanguage();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const faqs = {
    en: [
      {
        question: "How accurate is the heart disease prediction?",
        answer: "Our machine learning model has been trained on validated medical datasets and achieves approximately 85% accuracy. However, this system is designed for educational purposes and should not replace professional medical diagnosis. Always consult qualified healthcare professionals for medical advice."
      },
      {
        question: "How do I create a new patient profile?",
        answer: "Click 'Create New Patient Profile' on the prediction page. Fill in the patient's basic information including Patient ID, name, date of birth, gender, and contact details. Then proceed to the medical form to input clinical data for prediction."
      },
      {
        question: "What does the risk factor explanation mean?",
        answer: "Our Explainable AI feature shows which factors contributed most to the prediction. Factors are color-coded: 🔴 Red (High Impact) - major contributors to risk, 🟡 Yellow (Medium Impact) - moderate contributors, 🟢 Green (Low Impact) - minimal contributors. This helps understand WHY a patient is at risk."
      },
      {
        question: "Can I track a patient's progress over time?",
        answer: "Yes! Use the Timeline feature. Search for an existing patient and click 'View Timeline' to see their complete prediction history, risk trend (improving/stable/worsening), and a visual chart showing changes over time."
      },
      {
        question: "How do I export patient data?",
        answer: "Go to the Dashboard and use the 'Export All Patients' button to download an Excel file with all patient predictions. You can also export only high-risk patients using the 'Export High Risk Only' button."
      },
      {
        question: "What do the chest pain types mean?",
        answer: "• Type 0 (Typical Angina): Classic heart-related chest pain\n• Type 1 (Atypical Angina): Similar but not classic presentation\n• Type 2 (Non-anginal Pain): Chest pain not related to heart\n• Type 3 (Asymptomatic): No chest pain"
      },
      {
        question: "How do I switch between English and Bengali?",
        answer: "Click the three-dot menu (⋮) in the top-right corner and select 'Switch to বাংলা' or 'Switch to English'. You can also change language in Settings."
      },
      {
        question: "What is the medication guidance based on?",
        answer: "The medication guidance is based on established clinical guidelines for cardiovascular disease management. It provides general categories of medications (e.g., cholesterol management, blood pressure control) that doctors commonly prescribe. This is NOT a prescription - patients must consult their doctor for actual medication."
      }
    ],
    bn: [
      {
        question: "হৃদরোগের পূর্বাভাস কতটা নির্ভুল?",
        answer: "আমাদের মেশিন লার্নিং মডেল যাচাইকৃত চিকিৎসা ডেটাসেটে প্রশিক্ষিত এবং প্রায় ৮৫% নির্ভুলতা অর্জন করে। তবে, এই সিস্টেমটি শিক্ষামূলক উদ্দেশ্যে ডিজাইন করা হয়েছে এবং পেশাদার চিকিৎসা নির্ণয় প্রতিস্থাপন করা উচিত নয়। চিকিৎসা পরামর্শের জন্য সর্বদা যোগ্য স্বাস্থ্যসেবা পেশাদারদের পরামর্শ নিন।"
      },
      {
        question: "কিভাবে নতুন রোগী প্রোফাইল তৈরি করবো?",
        answer: "পূর্বাভাস পৃষ্ঠায় 'নতুন রোগী প্রোফাইল তৈরি করুন' ক্লিক করুন। রোগী আইডি, নাম, জন্ম তারিখ, লিঙ্গ এবং যোগাযোগের বিবরণ সহ রোগীর প্রাথমিক তথ্য পূরণ করুন। তারপর পূর্বাভাসের জন্য ক্লিনিকাল ডেটা ইনপুট করতে মেডিকেল ফর্মে এগিয়ে যান।"
      },
      {
        question: "ঝুঁকি ফ্যাক্টর ব্যাখ্যা মানে কি?",
        answer: "আমাদের ব্যাখ্যাযোগ্য AI বৈশিষ্ট্য দেখায় যে কোন ফ্যাক্টরগুলি পূর্বাভাসে সবচেয়ে বেশি অবদান রেখেছে। ফ্যাক্টরগুলি রঙ-কোডেড: 🔴 লাল (উচ্চ প্রভাব) - ঝুঁকির প্রধান অবদানকারী, 🟡 হলুদ (মাঝারি প্রভাব) - মাঝারি অবদানকারী, 🟢 সবুজ (নিম্ন প্রভাব) - ন্যূনতম অবদানকারী। এটি বুঝতে সাহায্য করে কেন একজন রোগী ঝুঁকিতে আছে।"
      },
      {
        question: "আমি কি সময়ের সাথে রোগীর অগ্রগতি ট্র্যাক করতে পারি?",
        answer: "হ্যাঁ! টাইমলাইন বৈশিষ্ট্য ব্যবহার করুন। একটি বিদ্যমান রোগী অনুসন্ধান করুন এবং তাদের সম্পূর্ণ পূর্বাভাস ইতিহাস, ঝুঁকি প্রবণতা (উন্নতি/স্থিতিশীল/অবনতি), এবং সময়ের সাথে পরিবর্তন দেখানো একটি ভিজ্যুয়াল চার্ট দেখতে 'টাইমলাইন দেখুন' ক্লিক করুন।"
      },
      {
        question: "কিভাবে রোগীর ডেটা এক্সপোর্ট করবো?",
        answer: "ড্যাশবোর্ডে যান এবং সব রোগীর পূর্বাভাস সহ একটি এক্সেল ফাইল ডাউনলোড করতে 'সব রোগী এক্সপোর্ট করুন' বাটন ব্যবহার করুন। আপনি 'শুধু উচ্চ ঝুঁকি এক্সপোর্ট করুন' বাটন ব্যবহার করে শুধুমাত্র উচ্চ-ঝুঁকির রোগীদের এক্সপোর্ট করতে পারেন।"
      },
      {
        question: "বুকে ব্যথার ধরন মানে কি?",
        answer: "• টাইপ ০ (সাধারণ এনজাইনা): ক্লাসিক হৃদয়-সম্পর্কিত বুকে ব্যথা\n• টাইপ ১ (অ্যাটিপিক্যাল এনজাইনা): অনুরূপ কিন্তু ক্লাসিক উপস্থাপনা নয়\n• টাইপ ২ (নন-এনজাইনাল ব্যথা): হৃদয়ের সাথে সম্পর্কিত নয় এমন বুকে ব্যথা\n• টাইপ ৩ (লক্ষণহীন): কোন বুকে ব্যথা নেই"
      },
      {
        question: "কিভাবে ইংরেজি এবং বাংলার মধ্যে পরিবর্তন করবো?",
        answer: "উপরের-ডানদিকের কোণায় তিন-বিন্দু মেনু (⋮) ক্লিক করুন এবং 'Switch to বাংলা' বা 'Switch to English' নির্বাচন করুন। আপনি সেটিংসেও ভাষা পরিবর্তন করতে পারেন।"
      },
      {
        question: "ওষুধ নির্দেশনা কিসের উপর ভিত্তি করে?",
        answer: "ওষুধ নির্দেশনা কার্ডিওভাসকুলার রোগ ব্যবস্থাপনার জন্য প্রতিষ্ঠিত ক্লিনিকাল নির্দেশিকাগুলির উপর ভিত্তি করে। এটি ওষুধের সাধারণ বিভাগ প্রদান করে (যেমন, কোলেস্টেরল ব্যবস্থাপনা, রক্তচাপ নিয়ন্ত্রণ) যা ডাক্তাররা সাধারণত নির্ধারণ করেন। এটি একটি প্রেসক্রিপশন নয় - রোগীদের প্রকৃত ওষুধের জন্য তাদের ডাক্তারের সাথে পরামর্শ করতে হবে।"
      }
    ]
  };

  const guides = {
    en: [
      {
        title: "Getting Started",
        steps: [
          "Select your preferred language (English or বাংলা)",
          "Click 'Get Started' from the home page",
          "Choose to create a new patient or search existing patient",
          "Fill in the medical data form (3 steps)",
          "Submit for risk prediction",
          "View results with explainable AI factors"
        ]
      },
      {
        title: "Understanding Medical Inputs",
        steps: [
          "Age: Patient's current age in years",
          "Blood Pressure: Resting blood pressure in mm Hg",
          "Cholesterol: Serum cholesterol in mg/dl",
          "Max Heart Rate: Maximum heart rate achieved during exercise",
          "ST Depression: Depression induced by exercise relative to rest",
          "Major Vessels: Number of major vessels colored by fluoroscopy (0-3)"
        ]
      },
      {
        title: "Using Timeline Feature",
        steps: [
          "Search for an existing patient by ID, phone, or email",
          "Click 'View Timeline' button",
          "Review patient profile information",
          "Check risk trend indicator (improving/stable/worsening)",
          "Analyze the line chart showing risk changes over time",
          "View complete prediction history with dates"
        ]
      }
    ],
    bn: [
      {
        title: "শুরু করা",
        steps: [
          "আপনার পছন্দের ভাষা নির্বাচন করুন (English বা বাংলা)",
          "হোম পেজ থেকে 'শুরু করুন' ক্লিক করুন",
          "নতুন রোগী তৈরি করুন বা বিদ্যমান রোগী খুঁজুন",
          "মেডিকেল ডেটা ফর্ম পূরণ করুন (৩ ধাপ)",
          "ঝুঁকি পূর্বাভাসের জন্য জমা দিন",
          "ব্যাখ্যাযোগ্য AI ফ্যাক্টর সহ ফলাফল দেখুন"
        ]
      },
      {
        title: "মেডিকেল ইনপুট বোঝা",
        steps: [
          "বয়স: রোগীর বর্তমান বয়স বছরে",
          "রক্তচাপ: বিশ্রামের রক্তচাপ mm Hg তে",
          "কোলেস্টেরল: সিরাম কোলেস্টেরল mg/dl তে",
          "সর্বোচ্চ হার্ট রেট: ব্যায়ামের সময় অর্জিত সর্বোচ্চ হৃদস্পন্দন",
          "ST ডিপ্রেশন: বিশ্রামের তুলনায় ব্যায়াম দ্বারা প্রবর্তিত বিষণ্নতা",
          "প্রধান শিরা: ফ্লুরোস্কোপি দ্বারা রঙিন প্রধান শিরার সংখ্যা (০-৩)"
        ]
      },
      {
        title: "টাইমলাইন বৈশিষ্ট্য ব্যবহার",
        steps: [
          "আইডি, ফোন বা ইমেইল দ্বারা বিদ্যমান রোগী খুঁজুন",
          "'টাইমলাইন দেখুন' বাটনে ক্লিক করুন",
          "রোগী প্রোফাইল তথ্য পর্যালোচনা করুন",
          "ঝুঁকি প্রবণতা সূচক পরীক্ষা করুন (উন্নতি/স্থিতিশীল/অবনতি)",
          "সময়ের সাথে ঝুঁকি পরিবর্তন দেখানো লাইন চার্ট বিশ্লেষণ করুন",
          "তারিখ সহ সম্পূর্ণ পূর্বাভাস ইতিহাস দেখুন"
        ]
      }
    ]
  };

  const currentFaqs = language === 'en' ? faqs.en : faqs.bn;
  const currentGuides = language === 'en' ? guides.en : guides.bn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <FaQuestionCircle className="text-4xl text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'en' ? 'Help & Guide' : 'সাহায্য এবং গাইড'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {language === 'en' ? 'Everything you need to know' : 'আপনার জানা দরকার সবকিছু'}
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <a href="#faqs" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaBook className="text-3xl text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'en' ? 'FAQs' : 'সাধারণ প্রশ্ন'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {language === 'en' ? 'Common questions answered' : 'সাধারণ প্রশ্নের উত্তর'}
            </p>
          </a>
          
          <a href="#guides" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaVideo className="text-3xl text-green-600 dark:text-green-400 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'en' ? 'User Guides' : 'ব্যবহারকারী গাইড'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {language === 'en' ? 'Step-by-step tutorials' : 'ধাপে ধাপে টিউটোরিয়াল'}
            </p>
          </a>
          
          <a href="mailto:support@heartdisease.app" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaLifeRing className="text-3xl text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'en' ? 'Contact Support' : 'সহায়তা যোগাযোগ'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {language === 'en' ? 'Get personalized help' : 'ব্যক্তিগত সাহায্য পান'}
            </p>
          </a>
        </div>

        {/* FAQs Section */}
        <div id="faqs" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'en' ? 'Frequently Asked Questions' : 'প্রায়শই জিজ্ঞাসিত প্রশ্ন'}
          </h2>
          <div className="space-y-4">
            {currentFaqs.map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(`faq-${index}`)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  {openSection === `faq-${index}` ? (
                    <FaChevronUp className="text-blue-600 dark:text-blue-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>
                {openSection === `faq-${index}` && (
                  <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Guides Section */}
        <div id="guides">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'en' ? 'User Guides' : 'ব্যবহারকারী গাইড'}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {currentGuides.map((guide, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {guide.title}
                </h3>
                <ol className="space-y-3">
                  {guide.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {stepIndex + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Still Need Help?' : 'এখনও সাহায্য প্রয়োজন?'}
          </h2>
          <p className="mb-6">
            {language === 'en' 
              ? 'Our support team is here to assist you'
              : 'আমাদের সহায়তা দল আপনাকে সাহায্য করতে এখানে আছে'}
          </p>
          <a
            href="mailto:support@heartdisease.app"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {language === 'en' ? 'Contact Support' : 'সহায়তা যোগাযোগ'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
