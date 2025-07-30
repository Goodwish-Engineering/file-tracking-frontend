import React from 'react';
import FormField from '../Common/FormField';
import { REGISTRATION_CONSTANTS } from '../../constants/registrationConstants';

const LoanDetailsForm = ({ 
  formData, 
  errors, 
  handleChange 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        ऋण विवरण
      </h3>
      
      {/* Loan Status */}
      <div className="mb-6">
        <FormField
          label={REGISTRATION_CONSTANTS.LABELS.HAS_LOAN}
          name="has_loan"
          type="select"
          value={formData.has_loan || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'चयन गर्नुहोस्' },
            { value: 'yes', label: 'छ' },
            { value: 'no', label: 'छैन' }
          ]}
          error={errors.has_loan}
        />
      </div>

      {/* Loan Details - Show only if has_loan is 'yes' */}
      {formData.has_loan === 'yes' && (
        <div className="space-y-6">
          {/* Basic Loan Information */}
          <div>
            <h4 className="text-md font-medium text-blue-600 mb-3">
              ऋण सम्बन्धी जानकारी
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={REGISTRATION_CONSTANTS.LABELS.LOAN_TYPE}
                name="loan_type"
                type="select"
                value={formData.loan_type || ''}
                onChange={handleChange}
                options={REGISTRATION_CONSTANTS.LOAN_TYPES}
                error={errors.loan_type}
              />
              
              <FormField
                label={REGISTRATION_CONSTANTS.LABELS.LOAN_AMOUNT}
                name="loan_amount"
                type="number"
                value={formData.loan_amount || ''}
                onChange={handleChange}
                error={errors.loan_amount}
                placeholder="रुपैयाँमा"
                min="0"
                step="0.01"
              />
              
              <FormField
                label={REGISTRATION_CONSTANTS.LABELS.LOAN_SOURCE}
                name="loan_source"
                value={formData.loan_source || ''}
                onChange={handleChange}
                error={errors.loan_source}
                placeholder="बैंक/सहकारी/व्यक्तिगत"
              />
            </div>
          </div>

          {/* Guarantor Information */}
          <div>
            <h4 className="text-md font-medium text-purple-600 mb-3">
              जमानतकर्ताको विवरण
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={REGISTRATION_CONSTANTS.LABELS.GUARANTOR_NAME}
                name="guarantor_name"
                value={formData.guarantor_name || ''}
                onChange={handleChange}
                error={errors.guarantor_name}
              />
              
              <FormField
                label={REGISTRATION_CONSTANTS.LABELS.GUARANTOR_RELATION}
                name="guarantor_relation"
                type="select"
                value={formData.guarantor_relation || ''}
                onChange={handleChange}
                options={REGISTRATION_CONSTANTS.RELATIONS.map(relation => ({ 
                  value: relation, 
                  label: relation 
                }))}
                error={errors.guarantor_relation}
              />
              
              <FormField
                label={REGISTRATION_CONSTANTS.LABELS.GUARANTOR_CONTACT}
                name="guarantor_contact"
                value={formData.guarantor_contact || ''}
                onChange={handleChange}
                error={errors.guarantor_contact}
                placeholder="फोन नम्बर"
              />
              
              <FormField
                label={REGISTRATION_CONSTANTS.LABELS.GUARANTOR_ADDRESS}
                name="guarantor_address"
                value={formData.guarantor_address || ''}
                onChange={handleChange}
                error={errors.guarantor_address}
              />
            </div>
          </div>
        </div>
      )}

      {/* No Loan Declaration */}
      {formData.has_loan === 'no' && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-800 text-sm">
            ✓ तपाईंले कुनै ऋण नभएको घोषणा गर्नुभएको छ。
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanDetailsForm;