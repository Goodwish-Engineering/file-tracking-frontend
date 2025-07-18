import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { LABELS } from '../../constants/employeeConstants';

const EmployeeSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  totalEmployees, 
  onRefresh 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={LABELS.SEARCH_PLACEHOLDER}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{LABELS.TOTAL_EMPLOYEES}: {totalEmployees} कर्मचारीहरू</span>
          <button 
            onClick={onRefresh}
            className="ml-2 text-[#E68332] hover:text-[#c36f2a] flex items-center gap-1"
            title="रिफ्रेश गर्नुहोस्"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {LABELS.REFRESH}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSearchBar;
