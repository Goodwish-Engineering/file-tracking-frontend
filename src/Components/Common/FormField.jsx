import React from "react";
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
}) => {
  // Format date input as YYYY-MM-DD
  const formatDateInput = (inputValue) => {
    const numbers = inputValue.replace(/\D/g, "");
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else {
      return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
    }
  };

  if (type === "select") {
    return (
      <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
        <label
          htmlFor={name}
          className="block font-medium text-gray-700 mb-2 flex items-center"
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
          {options.map((option) => (
            <option
              key={option.id || option.value || option}
              value={option.id || option.value || option}
            >
              {option.name || option.file_name || option.label || option}
            </option>
          ))}
        </select>
        {required && !value && (
          <p className="text-xs text-red-500 mt-1">यो फिल्ड आवश्यक छ</p>
        )}
      </div>
    );
  } else if (type === "date") {
    return (
      <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md p-2">
        <label
          htmlFor={name}
          className="block font-medium text-gray-700 items-center mb-2 flex"
        >
          <FaCalendarAlt className="mr-2 text-[#E68332]" />
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <input
          type="text"
          id={name}
          name={name}
          value={value || ""}
          onChange={(e) => {
            const formattedValue = formatDateInput(e.target.value);
            if (onChange) {
              const syntheticEvent = {
                target: { name, value: formattedValue }
              };
              onChange(syntheticEvent);
            }
          }}
          placeholder="YYYY-MM-DD"
          maxLength="10"
          className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] transition-all duration-200 outline-none text-gray-700"
          required={required}
          autoComplete="off"
        />

        {required && !value && (
          <p className="text-xs text-red-500 mt-1">यो फिल्ड आवश्यक छ</p>
        )}
      </div>
    );
  } else {
    return (
      <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
        <label
          htmlFor={name}
          className="block font-medium text-gray-700 mb-2 flex items-center"
        >
          {icon && <span className="mr-2 text-[#E68332]">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value !== undefined ? value : (defaultValue || "")}
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
            value={value !== undefined ? value : (defaultValue || "")}
            onChange={onChange}
            onBlur={onBlur}
            className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#E68332] focus:border-[#E68332] transition-all duration-200 outline-none text-gray-700"
            placeholder={placeholder}
            required={required}
            autoComplete="off"
          />
        )}
      </div>
    );
  }
};

export default FormField;
