import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getAllPatients, downloadReport, deletePatient } from '../utils/api';
import { FaDownload, FaTrash, FaSearch } from 'react-icons/fa';

const PatientHistory = () => {
  const { t } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      await downloadReport(id);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('patientHistoryTitle')}</h1>
          <p className="text-gray-600">{t('patientHistorySubtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-600 text-sm mb-1">{t('totalPatients')}</p>
            <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-600 text-sm mb-1">{t('highRisk')}</p>
            <p className="text-3xl font-bold text-red-600">
              {patients.filter(p => p.prediction === 'High Risk').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-gray-600 text-sm mb-1">{t('lowRisk')}</p>
            <p className="text-3xl font-bold text-green-600">
              {patients.filter(p => p.prediction === 'Low Risk').length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchPatients')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">{t('patientName')}</th>
                  <th className="px-6 py-4 text-left">{t('ageGender')}</th>
                  <th className="px-6 py-4 text-left">{t('prediction')}</th>
                  <th className="px-6 py-4 text-left">{t('riskProbability')}</th>
                  <th className="px-6 py-4 text-left">{t('date')}</th>
                  <th className="px-6 py-4 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      {t('noPatients')}
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{patient.id}</td>
                      <td className="px-6 py-4 font-medium">{patient.name}</td>
                      <td className="px-6 py-4">{patient.age} / {patient.sex}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          patient.prediction === 'High Risk'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {patient.prediction}
                        </span>
                      </td>
                      <td className="px-6 py-4">{patient.risk_probability}%</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{patient.created_at}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleDownload(patient.id)}
                            className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                            title={t('download')}
                          >
                            <FaDownload />
                          </button>
                          <button
                            onClick={() => handleDelete(patient.id)}
                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            title={t('delete')}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;
