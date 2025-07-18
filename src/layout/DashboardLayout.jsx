import React from 'react';

const DashboardLayout = ({ children, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default DashboardLayout;
