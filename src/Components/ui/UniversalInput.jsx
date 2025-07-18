import React from 'react';
import DateInputField from '../Components/Common/DateInputField';

const UniversalInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  disabled = false,
  error,
  icon,
  className = '',
  rows = 3,
  ...props
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all outline-none';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={inputClasses}
            {...props}
          >
            <option value="">{placeholder || `${label} छान्नुहोस्`}</option>
            {options.map((option, index) => (
              <option 
                key={typeof option === 'object' ? option.id : index} 
                value={typeof option === 'object' ? option.id : option}
              >
                {typeof option === 'object' ? option.name : option}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={`${inputClasses} resize-vertical`}
            {...props}
          />
        );
      
      case 'date':
        return (
          <DateInputField
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full"
            {...props}
          />
        );
      
      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="flex items-center font-medium text-gray-700 mb-2">
          {icon && <span className="mr-2 text-[#E68332]">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default UniversalInput;
