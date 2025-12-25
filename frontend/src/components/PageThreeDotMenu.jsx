import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaEllipsisV, FaDownload, FaPrint, FaEdit, FaTrash, FaShare, FaEye, FaRedo, FaCopy, FaEnvelope } from 'react-icons/fa';

/**
 * Page-specific Three Dot Menu Component
 * Different options based on page context (patient card, report, etc.)
 */
const PageThreeDotMenu = ({ 
  context = 'patient-card', 
  data = {},
  onEdit,
  onDelete,
  onDownload,
  onShare,
  onView,
  onEmail
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    if (action) action(data);
    setIsOpen(false);
  };

  // Context-based menu options
  const getMenuOptions = () => {
    switch (context) {
      case 'patient-card':
        return [
          {
            icon: <FaEye />,
            label: language === 'en' ? 'View Details' : 'বিস্তারিত দেখুন',
            action: () => handleAction(onView),
            color: 'text-blue-600'
          },
          {
            icon: <FaDownload />,
            label: language === 'en' ? 'Download Report' : 'রিপোর্ট ডাউনলোড',
            action: () => handleAction(onDownload),
            color: 'text-green-600'
          },
          {
            icon: <FaEnvelope />,
            label: language === 'en' ? 'Email Report' : 'ইমেইল পাঠান',
            action: () => handleAction(onEmail),
            color: 'text-purple-600'
          },
          { divider: true },
          {
            icon: <FaEdit />,
            label: language === 'en' ? 'Edit Record' : 'এডিট করুন',
            action: () => handleAction(onEdit),
            color: 'text-yellow-600'
          },
          {
            icon: <FaTrash />,
            label: language === 'en' ? 'Delete' : 'মুছে ফেলুন',
            action: () => handleAction(onDelete),
            color: 'text-red-600',
            dangerous: true
          }
        ];

      case 'prediction-result':
        return [
          {
            icon: <FaDownload />,
            label: language === 'en' ? 'Download PDF' : 'পিডিএফ ডাউনলোড',
            action: () => handleAction(onDownload),
            color: 'text-green-600'
          },
          {
            icon: <FaPrint />,
            label: language === 'en' ? 'Print Report' : 'প্রিন্ট করুন',
            action: () => window.print(),
            color: 'text-blue-600'
          },
          {
            icon: <FaShare />,
            label: language === 'en' ? 'Share' : 'শেয়ার করুন',
            action: () => handleAction(onShare),
            color: 'text-purple-600'
          },
          {
            icon: <FaEnvelope />,
            label: language === 'en' ? 'Email to Patient' : 'রোগীকে ইমেইল',
            action: () => handleAction(onEmail),
            color: 'text-indigo-600'
          },
          { divider: true },
          {
            icon: <FaRedo />,
            label: language === 'en' ? 'New Prediction' : 'নতুন পূর্বাভাস',
            action: () => window.location.href = '/predict',
            color: 'text-blue-600'
          }
        ];

      case 'dashboard':
        return [
          {
            icon: <FaDownload />,
            label: language === 'en' ? 'Export as Excel' : 'এক্সেল এক্সপোর্ট',
            action: () => handleAction(onDownload),
            color: 'text-green-600'
          },
          {
            icon: <FaPrint />,
            label: language === 'en' ? 'Print Dashboard' : 'ড্যাশবোর্ড প্রিন্ট',
            action: () => window.print(),
            color: 'text-blue-600'
          },
          {
            icon: <FaRedo />,
            label: language === 'en' ? 'Refresh Data' : 'রিফ্রেশ করুন',
            action: () => window.location.reload(),
            color: 'text-purple-600'
          }
        ];

      case 'patient-history':
        return [
          {
            icon: <FaDownload />,
            label: language === 'en' ? 'Export All Data' : 'সব ডেটা এক্সপোর্ট',
            action: () => handleAction(onDownload),
            color: 'text-green-600'
          },
          {
            icon: <FaPrint />,
            label: language === 'en' ? 'Print List' : 'তালিকা প্রিন্ট',
            action: () => window.print(),
            color: 'text-blue-600'
          }
        ];

      default:
        return [];
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Three Dot Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Options"
      >
        <FaEllipsisV className="text-gray-600 dark:text-gray-400 text-lg" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
          {getMenuOptions().map((option, index) => {
            if (option.divider) {
              return (
                <div
                  key={`divider-${index}`}
                  className="border-t border-gray-200 dark:border-gray-700 my-1"
                />
              );
            }

            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  option.action();
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 group ${
                  option.dangerous ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : ''
                }`}
              >
                <span className={`${option.color} group-hover:scale-110 transition-transform`}>
                  {option.icon}
                </span>
                <span className={`text-sm font-medium ${
                  option.dangerous 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PageThreeDotMenu;
