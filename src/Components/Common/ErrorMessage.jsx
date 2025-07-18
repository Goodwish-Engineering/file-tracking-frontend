import React from 'react';

const ErrorMessage = ({ 
  message = "त्रुटि भयो", 
  onRetry, 
  retryText = "फेरि प्रयास गर्नुहोस्" 
}) => (
  <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
    <div className="text-red-500 text-4xl mx-auto mb-4">⚠️</div>
    <p className="text-red-600 font-medium">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors"
      >
        {retryText}
      </button>
    )}
  </div>
);

export default ErrorMessage;
