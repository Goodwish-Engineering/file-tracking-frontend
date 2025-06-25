import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";

const DateInputField = ({ 
  name, 
  value, 
  onChange, 
  placeholder = "YYYY-MM-DD (उदाहरण: 2081-05-15)",
  primaryColor = "orange-500",
  className = ""
}) => {
  // Local state to handle formatted value during typing
  const [localValue, setLocalValue] = useState(value || '');

  // Update local value when prop value changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || '');
    }
  }, [value]);

  // Format date input with automatic hyphen insertion
  const formatDateInput = (inputValue) => {
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
  };

  // Handle date input changes with auto-formatting
  const handleDateChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatDateInput(rawValue);
    
    // Update local state for immediate UI feedback
    setLocalValue(formattedValue);
    
    // Notify parent component with the formatted value
    if (onChange) {
      const syntheticEvent = {
        target: { name, value: formattedValue }
      };
      onChange(syntheticEvent);
    }
  };

  // Handle keydown to prevent non-numeric input
  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right arrows
    const allowedKeys = [8, 9, 27, 13, 35, 36, 37, 38, 39, 40, 46];
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && [65, 67, 86, 88, 90].includes(e.keyCode)) {
      return;
    }
    
    // Allow function keys (F1-F12)
    if (e.keyCode >= 112 && e.keyCode <= 123) {
      return;
    }
    
    if (allowedKeys.includes(e.keyCode)) {
      return;
    }
    
    // Prevent if not a number
    if (
      e.shiftKey || 
      ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105))
    ) {
      e.preventDefault();
    }
  };

  // Determine focus ring color based on primaryColor prop
  const getFocusClasses = () => {
    if (primaryColor === "orange-500") {
      return "focus:ring-2 focus:ring-[#ED772F] focus:border-[#ED772F]";
    } else if (primaryColor === "green-500") {
      return "focus:ring-2 focus:ring-green-500 focus:border-green-500";
    } else {
      return `focus:ring-2 focus:ring-${primaryColor} focus:border-${primaryColor}`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        name={name}
        value={localValue}
        onChange={handleDateChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength="10"
        className={`w-full border border-gray-300 rounded-md shadow-sm p-3 ${getFocusClasses()} transition-all duration-200 outline-none text-gray-700 font-mono tracking-wider`}
        autoComplete="off"
      />
      {!localValue && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
          <span className="bg-gray-100 px-2 py-1 rounded text-xs">
            वर्ष-महिना-दिन
          </span>
        </div>
      )}
    </div>
  );
};

export default DateInputField;
