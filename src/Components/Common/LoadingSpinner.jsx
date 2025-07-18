import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ message = "लोड गर्दै..." }) => (
  <div className="text-center py-12 bg-white rounded-lg shadow-md">
    <FaSpinner className="animate-spin text-4xl text-[#E68332] mx-auto mb-4" />
    <p className="text-gray-600">{message}</p>
  </div>
);

export default LoadingSpinner;
