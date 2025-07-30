import React, { useState } from 'react';
import { FaSearch, FaRoute, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const PatraTracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError('कृपया ट्र्याकिङ ID प्रविष्ट गर्नुहोस्');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock tracking data
      const mockData = {
        id: trackingId,
        subject: 'बजेट अनुरोध पत्र',
        currentStatus: 'प्रक्रियामा',
        currentLocation: 'वित्त विभाग',
        history: [
          {
            id: 1,
            status: 'भेजिएको',
            location: 'प्रशासन विभाग',
            timestamp: '२०८१/०८/१५ १०:३०',
            officer: 'राम बहादुर'
          },
          {
            id: 2,
            status: 'प्राप्त',
            location: 'वित्त विभाग',
            timestamp: '२०८१/०८/१५ ११:१५',
            officer: 'शीता देवी'
          },
          {
            id: 3,
            status: 'समीक्षाधीन',
            location: 'वित्त विभाग',
            timestamp: '२०८१/०८/१५ १४:३०',
            officer: 'शीता देवी'
          }
        ]
      };
      
      setTrackingData(mockData);
    } catch (err) {
      setError('ट्र्याकिङ जानकारी प्राप्त गर्न असफल');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'भेजिएको': 'bg-blue-100 text-blue-800',
      'प्राप्त': 'bg-green-100 text-green-800',
      'समीक्षाधीन': 'bg-yellow-100 text-yellow-800',
      'प्रक्रियामा': 'bg-orange-100 text-orange-800',
      'सम्पन्न': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
            <FaRoute className="text-blue-600 mr-3" />
            पत्र ट्र्याकिङ सिस्टम
          </h1>
          <p className="text-gray-600">आफ्नो पत्रको स्थिति ट्र्याक गर्नुहोस्</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ट्र्याकिङ ID प्रविष्ट गर्नुहोस्
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="उदाहरण: TRK123456"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="font-medium">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  खोज्दै...
                </>
              ) : (
                <>
                  <FaSearch className="mr-2" />
                  खोज्नुहोस्
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Current Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">
                    {trackingData.subject || 'विषय उपलब्ध छैन'}
                  </h2>
                  <p className="text-gray-600">ID: {trackingData.id}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.currentStatus)}`}>
                    {trackingData.currentStatus}
                  </span>
                  <p className="text-gray-600 mt-1 flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {trackingData.currentLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaClock className="mr-2 text-blue-600" />
                पत्र यात्रा इतिहास
              </h3>
              
              <div className="space-y-4">
                {trackingData.history && trackingData.history.length > 0 ? (
                  trackingData.history.map((item, index) => (
                    <div key={item.id || index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.location || 'स्थान उपलब्ध छैन'}
                          </p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          अधिकारी: {item.officer || 'जानकारी उपलब्ध छैन'}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <FaClock className="mr-1" />
                          {item.timestamp || 'समय उपलब्ध छैन'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaClock className="mx-auto text-4xl mb-2" />
                    <p>कुनै इतिहास रेकर्ड उपलब्ध छैन</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !trackingData && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaRoute className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              पत्र ट्र्याकिङ सुरु गर्नुहोस्
            </h3>
            <p className="text-gray-500">
              आफ्नो पत्रको स्थिति जान्न माथि ट्र्याकिङ ID प्रविष्ट गर्नुहोस्
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatraTracking;
