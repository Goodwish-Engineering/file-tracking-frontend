import React from 'react';
import FormField from '../Common/FormField';
import { REGISTRATION_CONSTANTS } from '../../constants/registrationConstants';

const EducationAchievementsForm = ({ 
  formData, 
  errors, 
  handleChange 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        शैक्षिक योग्यता र उपलब्धिहरू
      </h3>
      
      {/* Education Details */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-blue-600 mb-3">
          शैक्षिक विवरण
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.EDUCATION_LEVEL}
            name="education_level"
            type="select"
            value={formData.education_level || ''}
            onChange={handleChange}
            options={REGISTRATION_CONSTANTS.EDUCATION_LEVELS.map(level => ({ 
              value: level, 
              label: level 
            }))}
            error={errors.education_level}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.INSTITUTION}
            name="institution"
            value={formData.institution || ''}
            onChange={handleChange}
            error={errors.institution}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.PERCENTAGE}
            name="percentage"
            type="number"
            value={formData.percentage || ''}
            onChange={handleChange}
            error={errors.percentage}
            placeholder="०-१००"
            min="0"
            max="100"
            step="0.01"
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.YEAR}
            name="year"
            type="number"
            value={formData.year || ''}
            onChange={handleChange}
            error={errors.year}
            placeholder="जस्तै: २०७८"
            min="2000"
            max={new Date().getFullYear() + 57} // Nepali year
          />
        </div>
      </div>

      {/* Awards */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-green-600 mb-3">
          पुरस्कार र सम्मान
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.AWARD_NAME}
            name="award_name"
            value={formData.award_name || ''}
            onChange={handleChange}
            error={errors.award_name}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.AWARD_DESCRIPTION}
            name="award_description"
            isTextarea
            rows={3}
            value={formData.award_description || ''}
            onChange={handleChange}
            error={errors.award_description}
          />
        </div>
      </div>

      {/* Punishments */}
      <div>
        <h4 className="text-md font-medium text-red-600 mb-3">
          सजाय र अनुशासनिक कार्य
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.PUNISHMENT_NAME}
            name="punishment_name"
            value={formData.punishment_name || ''}
            onChange={handleChange}
            error={errors.punishment_name}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.PUNISHMENT_DESCRIPTION}
            name="punishment_description"
            isTextarea
            rows={3}
            value={formData.punishment_description || ''}
            onChange={handleChange}
            error={errors.punishment_description}
          />
        </div>
      </div>
    </div>
  );
};

export default EducationAchievementsForm;
