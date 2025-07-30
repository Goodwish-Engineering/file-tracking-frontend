import { useState, useCallback } from 'react';
import { INITIAL_FORM_STATE, VALIDATION_RULES, REGISTRATION_CONSTANTS } from '../constants/registrationConstants';

export const useRegistrationForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Handle Nepali date changes - Fixed implementation
  const handleNepaliDateChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when date is selected
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Validate individual field
  const validateField = useCallback((name, value) => {
    const requiredFields = [
      'first_name', 'last_name', 'username', 'password', 'email',
      'perm_state', 'perm_district', 'perm_municipality', 'perm_ward_no',
      'citizenship_id', 'mobile_number', 'office', 'department', 'user_type'
    ];

    // Check if field is required
    if (requiredFields.includes(name)) {
      if (!VALIDATION_RULES.required(value)) {
        return REGISTRATION_CONSTANTS.VALIDATION_MESSAGES.REQUIRED;
      }
    }

    // Field-specific validations
    switch (name) {
      case 'email':
        if (value && !VALIDATION_RULES.email(value)) {
          return REGISTRATION_CONSTANTS.VALIDATION_MESSAGES.EMAIL_INVALID;
        }
        break;
      case 'password':
        if (value && !VALIDATION_RULES.password(value)) {
          return REGISTRATION_CONSTANTS.VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
        }
        break;
      case 'citizenship_id':
        if (value && !VALIDATION_RULES.citizenship(value)) {
          return REGISTRATION_CONSTANTS.VALIDATION_MESSAGES.CITIZENSHIP_INVALID;
        }
        break;
      case 'phone_number':
      case 'mobile_number':
        if (value && !VALIDATION_RULES.phone(value)) {
          return REGISTRATION_CONSTANTS.VALIDATION_MESSAGES.PHONE_INVALID;
        }
        break;
      case 'percentage':
        if (value && !VALIDATION_RULES.percentage(value)) {
          return REGISTRATION_CONSTANTS.VALIDATION_MESSAGES.PERCENTAGE_INVALID;
        }
        break;
      default:
        break;
    }

    return '';
  }, []);

  // Validate entire form
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  // Clear specific field
  const clearField = useCallback((fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  // Set multiple fields at once
  const setMultipleFields = useCallback((fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields
    }));
  }, []);

  // Get field value
  const getFieldValue = useCallback((fieldName) => {
    return formData[fieldName] || '';
  }, [formData]);

  // Check if form has changes
  const hasChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(INITIAL_FORM_STATE);
  }, [formData]);

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleNepaliDateChange,
    validateField,
    validateForm,
    resetForm,
    clearField,
    setMultipleFields,
    getFieldValue,
    hasChanges
  };
};
