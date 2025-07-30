import React from 'react';
import FormField from '../Common/FormField';
import DateInputField from '../Common/DateInputField';
import { REGISTRATION_CONSTANTS } from '../../constants/registrationConstants';

const CitizenshipContactForm = ({ 
  formData, 
  errors, 
  handleChange, 
  handleNepaliDateChange,
  districts 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        नागरिकता र सम्पर्क विवरण
      </h3>
      
      {/* Citizenship Information */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-purple-600 mb-3">
          नागरिकता विवरण
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.CITIZENSHIP_ID}
            name="citizenship_id"
            value={formData.citizenship_id}
            onChange={handleChange}
            error={errors.citizenship_id}
            placeholder="जस्तै: १०५६-२०७७-१२३४५"
            required
          />
          
          <DateInputField
            label={REGISTRATION_CONSTANTS.LABELS.CITIZENSHIP_DATE}
            name="citizenship_date_of_issue"
            value={formData.citizenship_date_of_issue}
            onChange={(value) => handleNepaliDateChange('citizenship_date_of_issue', value)}
            error={errors.citizenship_date_of_issue}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.CITIZENSHIP_DISTRICT}
            name="citizenship_district"
            type="select"
            value={formData.citizenship_district}
            onChange={handleChange}
            options={(districts || []).map(d => ({ value: d.id, label: d.name }))}
            error={errors.citizenship_district}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h4 className="text-md font-medium text-orange-600 mb-3">
          सम्पर्क विवरण
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.HOME_NUMBER}
            name="home_number"
            value={formData.home_number}
            onChange={handleChange}
            error={errors.home_number}
            placeholder="जस्तै: ०१-४४२३४५६"
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.PHONE_NUMBER}
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            error={errors.phone_number}
            placeholder="जस्तै: ०१-४४२३४५६"
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.MOBILE_NUMBER}
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            error={errors.mobile_number}
            placeholder="जस्तै: ९८०१२३४५६७"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CitizenshipContactForm;
