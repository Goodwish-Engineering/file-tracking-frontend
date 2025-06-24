import React from "react";

const InfoCard = ({ title, children, icon, borderColor = "blue-500" }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${borderColor} hover:shadow-lg transition-shadow duration-300`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      {icon && <span className={`mr-2 text-${borderColor}`}>{icon}</span>}
      {title}
    </h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

export default InfoCard;
