import React from 'react';
import { BsFileEarmark } from 'react-icons/bs';
import { FaFile, FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import { MdSubject } from 'react-icons/md';
import DateInputField from '../Common/DateInputField';
import { LABELS, FIELD_NAMES } from '../../constants/fileDetailsConstants';

const FileInformationSection = ({ 
  formData, 
  fileTypes, 
  handleSelectChange, 
  handleBlur, 
  handleDateChange, 
  inputRefs, 
  setInputRef,
  datePickerKey,
  isLoadingFileTypes 
}) => {
  
  const renderSelectField = (label, name, options = [], placeholder, required = false, icon) => (
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
        disabled={isLoadingFileTypes && name === FIELD_NAMES.FILE_TYPE}
      >
        <option value="">{placeholder}</option>
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
        <BsFileEarmark className="mr-2 text-[#ED772F]" />
        {LABELS.FILE_INFORMATION}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderSelectField(
          LABELS.FILE_TYPE,
          FIELD_NAMES.FILE_TYPE,
          fileTypes,
          LABELS.SELECT_FILE_TYPE,
          false,
          <FaFile />
        )}

        {renderInputField(
          LABELS.FILE_NAME,
          FIELD_NAMES.FILE_NAME,
          "text",
          LABELS.ENTER_FILE_NAME,
          true,
          <FaFile />
        )}

        {renderInputField(
          LABELS.SUBJECT,
          FIELD_NAMES.SUBJECT,
          "text",
          LABELS.ENTER_SUBJECT,
          true,
          <MdSubject />
        )}

        {renderInputField(
          LABELS.RESPONSIBLE_PERSON,
          FIELD_NAMES.SUBMITTED_BY,
          "text",
          LABELS.ENTER_RESPONSIBLE_PERSON,
          true,
          <FaUserCircle />
        )}

        <div className="mb-6 transition-all duration-200 hover:shadow-md rounded-md">
          <label className="flex items-center font-medium text-gray-700 mb-2">
            <FaCalendarAlt className="mr-2 text-[#ED772F]" />
            {LABELS.PRESENT_DATE}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <DateInputField
            key={datePickerKey}
            name={FIELD_NAMES.PRESENT_DATE}
            value={formData[FIELD_NAMES.PRESENT_DATE]}
            onChange={handleDateChange}
            placeholder={LABELS.DATE_PLACEHOLDER}
            primaryColor="orange-500"
            className="w-full"
          />
          {!formData[FIELD_NAMES.PRESENT_DATE] && (
            <p className="text-xs text-red-500 mt-1">{LABELS.REQUIRED_FIELD_ERROR}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileInformationSection;
