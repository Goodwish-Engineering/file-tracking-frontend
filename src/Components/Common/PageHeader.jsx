import React from 'react';
import { FaUserAlt } from 'react-icons/fa';

const PageHeader = ({ 
  title, 
  subtitle, 
  icon: Icon = FaUserAlt,
  className = ""
}) => (
  <div className={`bg-gradient-to-r from-[#f9f1ea] to-[#fcf8f5] p-4 rounded-lg mb-6 border-l-4 border-[#E68332] ${className}`}>
    <h1 className="text-2xl font-bold text-[#E68332] flex items-center gap-2">
      <Icon className="text-[#E68332]" />
      {title}
    </h1>
    {subtitle && (
      <p className="text-gray-600 mt-1">{subtitle}</p>
    )}
  </div>
);

export default PageHeader;
