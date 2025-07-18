import React from 'react';
import { FaSpinner, FaUserAlt } from 'react-icons/fa';
import { LABELS } from '../../constants/employeeConstants';

export const LoadingState = () => (
  <div className="text-center py-12 bg-white rounded-lg shadow-md">
    <FaSpinner className="animate-spin text-4xl text-[#E68332] mx-auto mb-4" />
    <p className="text-gray-600">{LABELS.LOADING}</p>
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
    <div className="text-red-500 text-4xl mx-auto mb-4">⚠️</div>
    <p className="text-red-600 font-medium">{error}</p>
    <button 
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors"
    >
      {LABELS.TRY_AGAIN}
    </button>
  </div>
);

export const EmptyState = () => (
  <div className="text-center py-12 bg-white rounded-lg shadow-md">
    <FaUserAlt className="text-gray-300 text-5xl mx-auto mb-4" />
    <p className="text-gray-600 font-medium">{LABELS.NO_EMPLOYEES}</p>
    <p className="text-gray-500 mt-2">{LABELS.NO_EMPLOYEES_DESC}</p>
  </div>
);
