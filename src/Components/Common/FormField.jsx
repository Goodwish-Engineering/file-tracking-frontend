import React, { useState, useCallback } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const FormField = ({
  label,
  name,
  type = "text",
  options = [],
  placeholder,
  required = false,
  icon,
  isTextarea = false,
  rows = 3,
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
}) => {
  // Local state for date input to prevent focus loss
  const [localDateValue, setLocalDateValue] = useState(value || "");

  // Enhanced date formatting with automatic hyphen insertion
  const formatDateInput = useCallback((inputValue) => {
    // Remove all non-numeric characters
    const numbers = inputValue.replace(/\D/g, "");

    // Apply formatting based on length
    if (numbers.length === 0) {
      return "";
    } else if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
  }, []);

  // Handle keydown events for better UX
  const handleDateKeyDown = useCallback((e) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    const allowedKeys = [8, 9, 27, 13, 35, 36, 37, 38, 39, 40, 46];

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && [65, 67, 86, 88, 90].includes(e.keyCode)) {
      return;
    }

    // Allow function keys
    if (e.keyCode >= 112 && e.keyCode <= 123) {
      return;
    }

    // Allow backspace and delete
    if (allowedKeys.includes(e.keyCode)) {
      return;
    }

    // Ensure only numbers are entered
    if (
      e.shiftKey ||
      ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105))
    ) {
      e.preventDefault();
    }
  }, []);

  // Optimized date change handler
  const handleDateChange = useCallback(
    (e) => {
      const rawValue = e.target.value;
      const formattedValue = formatDateInput(rawValue);

      // Update local state immediately for responsive UI
      setLocalDateValue(formattedValue);

      // Call parent onChange with formatted value
      if (onChange) {
        const syntheticEvent = {
          target: { name, value: formattedValue },
        };
        onChange(syntheticEvent);
      }
    },
    [formatDateInput, name, onChange]
  );

  // Update local state when prop value changes (but not on every render)
  React.useEffect(() => {
    if (value !== localDateValue) {
      setLocalDateValue(value || "");
    }
  }, [value]); // Only depend on value, not localDateValue to prevent infinite loops

  if (type === "select") {
    return (
      <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
        <label
          htmlFor={name}
          className="block font-medium text-gray-700 mb-2 items-center"
        >
          {icon && <span className="mr-2 text-[#E68332]">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          className={`w-full border ${
            required && !value ? "border-red-300" : "border-gray-300"
          } rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] transition-all duration-200 outline-none text-gray-700`}
          required={required}
          disabled={options.length === 0 && name !== "province"}
        >
          <option value="">{placeholder || `${label} छान्नुहोस्`}</option>
          {options.map((option, index) => {
            // Handle different object structures safely
            let optionKey, optionValue, optionLabel;
            
            if (typeof option === 'string' || typeof option === 'number') {
              optionKey = index;
              optionValue = option;
              optionLabel = option;
            } else if (typeof option === 'object' && option !== null) {
              optionKey = option.id || option.value || index;
              optionValue = option.id || option.value || '';
              optionLabel = option.name || option.file_name || option.label || option.text || '';
            } else {
              // Fallback for undefined, null, or other types
              optionKey = index;
              optionValue = '';
              optionLabel = '';
            }
            
            return (
              <option key={optionKey} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
        {required && !value && !error && (
          <p className="text-xs text-red-500 mt-1">यो फिल्ड आवश्यक छ</p>
        )}
      </div>
    );
  } else if (type === "date") {
    return (
      <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
        <label
          htmlFor={name}
          className="flex font-medium text-gray-700 mb-2 items-center"
        >
          <FaCalendarAlt className="mr-2 text-[#E68332]" />
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          <input
            type="text"
            id={name}
            name={name}
            value={localDateValue}
            onChange={handleDateChange}
            onKeyDown={handleDateKeyDown}
            onBlur={onBlur}
            placeholder="YYYY-MM-DD (उदाहरण: 2081-05-15)"
            maxLength="10"
            className={`w-full border ${
              required && !localDateValue ? "border-red-300" : "border-gray-300"
            } rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] transition-all duration-200 outline-none text-gray-700 font-mono tracking-wider`}
            required={required}
            autoComplete="off"
          />

          {/* Format hint overlay when empty */}
          {!localDateValue && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                वर्ष-महिना-दिन
              </span>
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
        {required && !localDateValue && !error && (
          <p className="text-xs text-red-500 mt-1">यो फिल्ड आवश्यक छ</p>
        )}

        {/* Date format help text */}
        <p className="text-xs text-gray-500 mt-1">
          नेपाली मिति प्रविष्ट गर्नुहोस् (YYYY-MM-DD ढाँचामा)
        </p>
      </div>
    );
  } else {
    return (
      <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
        <label
          htmlFor={name}
          className="flex font-medium text-gray-700 mb-2 items-center"
        >
          {icon && <span className="mr-2 text-[#E68332]">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value !== undefined ? value : defaultValue || ""}
            onChange={onChange}
            onBlur={onBlur}
            rows={rows}
            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] transition-all duration-200 outline-none text-gray-700 resize-none"
            placeholder={placeholder}
            required={required}
            autoComplete="off"
          />
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value !== undefined ? value : defaultValue || ""}
            onChange={onChange}
            onBlur={onBlur}
            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] transition-all duration-200 outline-none text-gray-700"
            placeholder={placeholder}
            required={required}
            autoComplete="off"
          />
        )}
        
        {/* Error display for regular inputs and textareas */}
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
};

export default FormField;
