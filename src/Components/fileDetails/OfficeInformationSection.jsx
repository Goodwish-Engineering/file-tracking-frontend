import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import { LABELS, FIELD_NAMES } from '../../constants/fileDetailsConstants';

const OfficeInformationSection = ({ 
  formData, 
  offices, 
  departments, 
  faats,
  handleSelectChange,
  isLoadingOffices,
  isLoadingDepartments,
  isLoadingFaats 
}) => {
  
  const renderSelectField = (label, name, options = [], placeholder, required = false, icon, isLoading = false) => (
    <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
      <label htmlFor={name} className="flex items-center font-medium text-gray-700 mb-2">
        {icon && <span className="mr-2 text-[#ED772F]">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleSelectChange}
        className={`w-full border ${
          required && !formData[name] ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ED772F] focus:border-[#ED772F] transition-all duration-200 outline-none text-gray-700`}
        required={required}
        disabled={isLoading}
      >
        <option value="">{isLoading ? "लोड हुँदै..." : placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {required && !formData[name] && (
        <p className="text-xs text-red-500 mt-1">{LABELS.REQUIRED_FIELD_ERROR}</p>
      )}
    </div>
  );

  return (
    <div className="border-b pb-6 mb-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
        <FaBuilding className="mr-2 text-[#ED772F]" />
        {LABELS.OFFICE_INFORMATION}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSelectField(
          LABELS.OFFICE,
          FIELD_NAMES.OFFICE,
          offices,
          LABELS.SELECT_OFFICE,
          true,
          <FaBuilding />,
          isLoadingOffices
        )}

        {renderSelectField(
          LABELS.DEPARTMENT,
          FIELD_NAMES.DEPARTMENT_OFFICE,
          departments,
          formData[FIELD_NAMES.OFFICE] ? LABELS.SELECT_DEPARTMENT : LABELS.SELECT_OFFICE_FIRST,
          true,
          <FaBuilding />,
          isLoadingDepartments
        )}

        {renderSelectField(
          LABELS.FAAT,
          FIELD_NAMES.FAAT,
          faats,
          formData[FIELD_NAMES.DEPARTMENT_OFFICE] ? LABELS.SELECT_FAAT : LABELS.SELECT_DEPARTMENT_FIRST,
          false,
          <FaBuilding />,
          isLoadingFaats
        )}
      </div>
    </div>
  );
};

export default OfficeInformationSection;
