import React from 'react';
import FormField from '../Common/FormField';
import { REGISTRATION_CONSTANTS } from '../../constants/registrationConstants';

const PersonalInfoForm = ({ 
  formData, 
  errors, 
  handleChange, 
  handleNepaliDateChange 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        व्यक्तिगत जानकारी
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.FIRST_NAME}
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          error={errors.first_name}
          required
        />
        
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.LAST_NAME}
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          error={errors.last_name}
          required
        />
        
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.FATHER_NAME}
          name="father_name"
          value={formData.father_name}
          onChange={handleChange}
          error={errors.father_name}
        />
        
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.MOTHER_NAME}
          name="mother_name"
          value={formData.mother_name}
          onChange={handleChange}
          error={errors.mother_name}
        />
        
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.GRANDFATHER_NAME}
          name="grand_father_name"
          value={formData.grand_father_name}
          onChange={handleChange}
          error={errors.grand_father_name}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.USERNAME}
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />
        
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.PASSWORD}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />
      </div>

      <div className="mt-4">
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.EMAIL}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
