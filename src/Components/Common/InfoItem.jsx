import React from "react";
import FormField from "./FormField";
import DateInputField from "./DateInputField";

const InfoItem = ({ 
  label, 
  value, 
  icon, 
  fieldName, 
  type = "text", 
  options = [], 
  isEditing, 
  formData, 
  onChange,
  primaryColor = "blue-500"
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center min-w-0 flex-1">
        {icon && <span className="mr-2 text-gray-400 flex-shrink-0">{icon}</span>}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {isEditing && fieldName ? (
            type === "date" ? (
              <DateInputField
                name={fieldName}
                value={formData[fieldName]}
                onChange={onChange}
                primaryColor={primaryColor}
              />
            ) : type === "textarea" ? (
              <textarea
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={onChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:border-${primaryColor} text-sm`}
                rows={3}
              />
            ) : type === "select" ? (
              <select
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={onChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:border-${primaryColor} text-sm`}
              >
                <option value="">छान्नुहोस्</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={onChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:border-${primaryColor} text-sm`}
              />
            )
          ) : (
            <p className="text-sm text-gray-900 break-words">{value || "उपलब्ध छैन"}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoItem;
