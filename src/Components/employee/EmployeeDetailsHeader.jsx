import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import { LABELS } from '../../constants/employeeConstants';

const EmployeeDetailsHeader = () => {
  return (
    <div className="bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 rounded-lg mb-6 border-l-4 border-[#E68332]">
      <h1 className="text-2xl font-bold text-[#E68332] flex items-center gap-2">
        <FaUserAlt className="text-[#E68332]" />
        {LABELS.PAGE_TITLE}
      </h1>
      <p className="text-gray-600 mt-1">{LABELS.PAGE_SUBTITLE}</p>
    </div>
  );
};

export default EmployeeDetailsHeader;
