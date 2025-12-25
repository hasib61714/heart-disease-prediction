import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaEllipsisV, FaGlobe, FaMoon, FaSun, FaPrint, FaDownload, FaFileExport, FaInfo, FaCog, FaSignOutAlt, FaUserMd, FaChartBar } from 'react-icons/fa';

const ThreeDotMenu = ({ context = 'global' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setIsOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setIsOpen(false);
  };

  const handleExportData = () => {
    // Will trigger export functionality
    const event = new CustomEvent('exportData');
    window.dispatchEvent(event);
    setIsOpen(false);
  };

  const handleAbout = () => {
    alert(`Heart Disease Prediction System\nVersion: 1.0.0\nDeveloped by: Hasib\nGreen University of Bangladesh`);
    setIsOpen(false);
  };

  const handleSettings = () => {
    // Navigate to settings page
    window.location.href = '/settings';
    setIsOpen(false);
  };

  const handleHelp = () => {
    window.open('/help', '_blank');
    setIsOpen(false);
  };

  // Different menu options based on context
  const getMenuOptions = () => {
    const globalOptions = [
      {
        icon: language === 'en' ? <FaGlobe /> : <FaGlobe />,
        label: language === 'en' ? 'Switch to বাংলা' : 'Switch to English',
        action: toggleLanguage,
        shortcut: 'Alt+L'
      },
      {
        icon: darkMode ? <FaSun /> : <FaMoon />,
        label: darkMode ? (language === 'en' ? 'Light Mode' : 'লাইট মোড') : (language === 'en' ? 'Dark Mode' : 'ডার্ক মোড'),
        action: toggleDarkMode,
        shortcut: 'Alt+D'
      },
      { divider: true },
      {
        icon: <FaPrint />,
        label: language === 'en' ? 'Print Page' : 'প্রিন্ট করুন',
        action: handlePrint,
        shortcut: 'Ctrl+P'
      },
      {
        icon: <FaFileExport />,
        label: language === 'en' ? 'Export Data' : 'ডেটা এক্সপোর্ট',
        action: handleExportData,
        shortcut: 'Ctrl+E'
      },
      { divider: true },
      {
        icon: <FaCog />,
        label: language === 'en' ? 'Settings' : 'সেটিংস',
        action: handleSettings
      },
      {
        icon: <FaInfo />,
        label: language === 'en' ? 'About' : 'সম্পর্কে',
        action: handleAbout
      },
      {
        icon: <FaChartBar />,
        label: language === 'en' ? 'Help & Guide' : 'সাহায্য',
        action: handleHelp
      }
    ];

    return globalOptions;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Three Dot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Menu"
      >
        <FaEllipsisV className="text-gray-700 dark:text-gray-300 text-xl" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
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
                onClick={option.action}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {option.icon}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                    {option.label}
                  </span>
                </div>
                {option.shortcut && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {option.shortcut}
                  </span>
                )}
              </button>
            );
          })}

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 bg-gray-50 dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {language === 'en' ? 'Heart Disease Prediction v1.0' : 'হৃদরোগ পূর্বাভাস v১.০'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDotMenu;
