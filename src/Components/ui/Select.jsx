import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "छान्नुहोस्...",
  required = false,
  disabled = false,
  error,
  helpText,
  icon,
  className = '',
  selectClassName = '',
  ...props
}) => {
  const baseSelectClasses = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E68332] focus:border-transparent transition-all outline-none';
  const errorClasses = error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block font-medium text-gray-700 mb-2 flex items-center"
        >
          {icon && <span className="mr-2 text-[#E68332]">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`${baseSelectClasses} ${errorClasses} ${disabledClasses} ${selectClassName}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={typeof option === 'object' ? option.id : option}
            value={typeof option === 'object' ? option.id : option}
          >
            {typeof option === 'object' ? option.name : option}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-xs text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default Select;
