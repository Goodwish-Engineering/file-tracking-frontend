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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaRoute className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">पत्र ट्र्याकिङ</h1>
        </div>
        <p className="text-gray-600">
          पत्रको वर्तमान स्थिति र इतिहास हेर्नुहोस्
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ट्र्याकिङ ID वा संदर्भ नम्बर
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="उदाहरण: PTR-2024-001"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>खोज्दै...</span>
                </>
              ) : (
                <>
                  <FaSearch />
                  <span>खोज्नुहोस्</span>
                </>
              )}
            </button>
          </div>
        </form>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-600" />
              वर्तमान स्थिति
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">पत्र ID</p>
                <p className="font-medium">{trackingData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">विषय</p>
                <p className="font-medium">{trackingData.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">वर्तमान स्थान</p>
                <p className="font-medium">{trackingData.currentLocation}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingData.currentStatus)}`}>
                {trackingData.currentStatus}
              </span>
            </div>
          </div>

          {/* Tracking History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center">
              <FaClock className="mr-2 text-blue-600" />
              पत्र यात्रा इतिहास
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              <div className="space-y-6">
                {trackingData.history.map((item, index) => (
                  <div key={item.id} className="relative flex items-start space-x-4">
                    {/* Timeline dot */}
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{index + 1}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.status}</h3>
                          <p className="text-sm text-gray-600">{item.location}</p>
                          <p className="text-sm text-gray-500">जिम्मेवार: {item.officer}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!trackingData && !loading && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaRoute className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">ट्र्याकिङ जानकारी हेर्नको लागि ID प्रविष्ट गर्नुहोस्</p>
          <p className="text-sm text-gray-400 mt-2">
            पत्रको ट्र्याकिङ ID वा संदर्भ नम्बर माथिको बक्समा प्रविष्ट गर्नुहोस्
          </p>
        </div>
      )}
    </div>
  );
};

export default PatraTracking;
