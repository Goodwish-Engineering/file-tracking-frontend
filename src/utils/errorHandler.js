/**
 * Utility functions for handling API errors gracefully
 */

export const handleApiError = (error, defaultMessage = 'कुनै त्रुटि भयो') => {
  console.error('API Error:', error);
  
  if (error.message) {
    if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
      return 'नेटवर्क त्रुटि: कृपया आफ्नो इन्टरनेट जडान जाँच गर्नुहोस्';
    }
    
    if (error.message.includes('500')) {
      return 'सर्भर त्रुटि: कृपया पछि फेरि प्रयास गर्नुहोस्';
    }
    
    if (error.message.includes('404')) {
      return 'माग गरिएको डाटा फेला परेन';
    }
    
    if (error.message.includes('403')) {
      return 'तपाईंलाई यो डाटा पहुँच गर्ने अनुमति छैन';
    }
    
    if (error.message.includes('401')) {
      return 'कृपया पुन: लग इन गर्नुहोस्';
    }
  }
  
  return defaultMessage;
};

export const safeApiCall = async (apiCall, fallbackData = null) => {
  try {
    const result = await apiCall();
    return { success: true, data: result, error: null };
  } catch (error) {
    const errorMessage = handleApiError(error);
    return { success: false, data: fallbackData, error: errorMessage };
  }
};

export const withErrorBoundary = (Component) => {
  return function WrappedComponent(props) {
    try {
      return Component(props);
    } catch (error) {
      console.error('Component Error:', error);
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <h3 className="text-red-800 font-medium mb-2">कम्पोनेन्ट लोड गर्न समस्या भयो</h3>
          <p className="text-red-600 text-sm">कृपया पृष्ठ पुन: लोड गर्नुहोस् वा केही समय पछि पुन: प्रयास गर्नुहोस्।</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            पृष्ठ पुन: लोड गर्नुहोस्
          </button>
        </div>
      );
    }
  };
};

export const validateResponse = (response, requiredFields = []) => {
  if (!response || typeof response !== 'object') {
    throw new Error('अमान्य प्रतिक्रिया ढाँचा');
  }
  
  for (const field of requiredFields) {
    if (!(field in response)) {
      console.warn(`Missing required field: ${field}`);
    }
  }
  
  return response;
};
