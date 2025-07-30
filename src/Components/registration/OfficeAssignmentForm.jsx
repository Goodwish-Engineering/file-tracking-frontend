import React from 'react';
import FormField from '../Common/FormField';
import DateInputField from '../Common/DateInputField';
import { REGISTRATION_CONSTANTS } from '../../constants/registrationConstants';
import { FaBuilding, FaSpinner, FaInfoCircle } from 'react-icons/fa';

const OfficeAssignmentForm = ({ 
  formData, 
  errors, 
  handleChange, 
  setMultipleFields,
  handleNepaliDateChange,
  officeData 
}) => {
  const {
    offices = [],
    departments = [],
    faats = [],
    isLoading = false,
    error = null,
    handleOfficeChange = () => {},
    handleDepartmentChange = () => {},
    handleFaatChange = () => {},
    isHeadOffice = () => false,
    getOfficeHierarchyText = () => ''
  } = officeData || {};

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center mb-6">
        <FaBuilding className="text-2xl text-orange-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-800">कार्यालय र सेवा विवरण</h3>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-4 mb-6">
          <FaSpinner className="animate-spin text-2xl text-blue-600 mr-2" />
          <span className="text-blue-600">डाटा लोड गर्दै...</span>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700">
            <FaInfoCircle className="mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      {/* Service Date */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-indigo-600 mr-3"></div>
          <h4 className="text-lg font-semibold text-indigo-600">सेवा अवधि</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateInputField
            label={REGISTRATION_CONSTANTS.LABELS.DATE_JOINED}
            name="date_joined"
            value={formData.date_joined || ''}
            onChange={(value) => handleNepaliDateChange('date_joined', value)}
            error={errors.date_joined}
          />
        </div>
      </div>

      {/* Position Details */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-teal-600 mr-3"></div>
          <h4 className="text-lg font-semibold text-teal-600">पद विवरण</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.POSITION}
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
            error={errors.position}
            placeholder="पद नाम"
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.POSITION_CATEGORY}
            name="position_category"
            type="select"
            value={formData.position_category || ''}
            onChange={handleChange}
            options={REGISTRATION_CONSTANTS.POSITION_CATEGORIES || []}
            error={errors.position_category}
            placeholder="पद श्रेणी छान्नुहोस्"
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.EMPLOYEE_TYPE}
            name="employee_type"
            type="select"
            value={formData.employee_type || ''}
            onChange={handleChange}
            options={REGISTRATION_CONSTANTS.EMPLOYEE_TYPES || []}
            error={errors.employee_type}
            placeholder="कर्मचारी प्रकार छान्नुहोस्"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <FaInfoCircle className="text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Loading Display */}
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
          <FaSpinner className="animate-spin text-blue-500 mr-2" />
          <p className="text-blue-700">कार्यालय डाटा लोड गर्दै...</p>
        </div>
      )}

      {/* Office Assignment */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-blue-600 mb-3">
          कार्यालय नियुक्ति
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.OFFICE}
            name="office"
            type="select"
            value={formData.office || ''}
            onChange={(e) => handleOfficeChange(e.target.value)}
            options={(offices || []).map(o => ({ 
              value: o.id, 
              label: `${o.name} ${o.is_head_office ? '(मुख्य कार्यालय)' : ''}` 
            }))}
            error={errors.office}
            required
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.DEPARTMENT}
            name="department"
            type="select"
            value={formData.department || ''}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            options={(departments || []).map(d => ({ value: d.id, label: d.name }))}
            error={errors.department}
            required
            disabled={!formData.office}
          />
          
          {isHeadOffice() && (
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.FAAT}
              name="faat"
              type="select"
              value={formData.faat || ''}
              onChange={(e) => handleFaatChange(e.target.value)}
              options={(faats || []).map(f => ({ value: f.id, label: f.name }))}
              error={errors.faat}
              disabled={!formData.department}
            />
          )}
        </div>

        {/* Office hierarchy display */}
        {getOfficeHierarchyText() && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>चयनित कार्यालय श्रृंखला:</strong> {getOfficeHierarchyText()}
            </p>
          </div>
        )}
      </div>

      {/* User Type */}
      <div>
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.USER_TYPE}
          name="user_type"
          type="select"
          value={formData.user_type || ''}
          onChange={handleChange}
          options={REGISTRATION_CONSTANTS.USER_TYPES}
          error={errors.user_type}
          required
        />
      </div>
    </div>
  );
};

export default OfficeAssignmentForm;