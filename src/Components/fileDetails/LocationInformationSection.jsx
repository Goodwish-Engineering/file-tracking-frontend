import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { LABELS, FIELD_NAMES } from '../../constants/fileDetailsConstants';

const LocationInformationSection = ({ 
  formData, 
  provinces, 
  districts, 
  municipalities,
  handleSelectChange,
  handleBlur,
  setInputRef,
  isLoadingProvinces,
  isLoadingDistricts,
  isLoadingMunicipalities 
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

  const renderInputField = (label, name, type, placeholder, required = false, icon) => (
    <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
      <label htmlFor={name} className="flex items-center font-medium text-gray-700 mb-2">
        {icon && <span className="mr-2 text-[#ED772F]">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        defaultValue={formData[name]}
        onBlur={handleBlur}
        className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-2 focus:ring-[#ED772F] focus:border-[#ED772F] transition-all duration-200 outline-none text-gray-700"
        placeholder={placeholder}
        ref={(ref) => setInputRef(name, { current: ref })}
        required={required}
      />
      {required && !formData[name] && (
        <p className="text-xs text-red-500 mt-1">{LABELS.REQUIRED_FIELD_ERROR}</p>
      )}
    </div>
  );

  return (
    <div className="border-b pb-6 mb-8">
      <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-[#ED772F]" />
        {LABELS.LOCATION_INFORMATION}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSelectField(
          LABELS.PROVINCE,
          FIELD_NAMES.PROVINCE,
          provinces,
          LABELS.SELECT_PROVINCE,
          false,
          <FaMapMarkerAlt />,
          isLoadingProvinces
        )}

        {renderSelectField(
          LABELS.DISTRICT,
          FIELD_NAMES.DISTRICT,
          districts,
          formData[FIELD_NAMES.PROVINCE] ? LABELS.SELECT_DISTRICT : LABELS.SELECT_PROVINCE_FIRST,
          false,
          <FaMapMarkerAlt />,
          isLoadingDistricts
        )}

        {renderSelectField(
          LABELS.MUNICIPALITY,
          FIELD_NAMES.MUNICIPALITY,
          municipalities,
          formData[FIELD_NAMES.DISTRICT] ? LABELS.SELECT_MUNICIPALITY : LABELS.SELECT_DISTRICT_FIRST,
          false,
          <FaMapMarkerAlt />,
          isLoadingMunicipalities
        )}

        {renderInputField(
          LABELS.WARD_NUMBER,
          FIELD_NAMES.WARD_NO,
          "text",
          LABELS.ENTER_WARD_NUMBER,
          false,
          <FaMapMarkerAlt />
        )}

        {renderInputField(
          LABELS.TOLE,
          FIELD_NAMES.TOLE,
          "text",
          LABELS.ENTER_TOLE,
          false,
          <FaMapMarkerAlt />
        )}
      </div>
    </div>
  );
};

export default LocationInformationSection;
