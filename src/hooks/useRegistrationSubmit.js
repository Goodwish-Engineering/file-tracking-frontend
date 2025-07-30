import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export const useRegistrationSubmit = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = useCallback(async (formData, validateForm, resetForm) => {
    if (!validateForm()) {
      toast.error('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्');
      
      // Show first error field
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorElement.focus();
      }
      return false; // Return false for failure
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Prepare submission data with proper type conversion
      const submissionData = {};
      
      // Copy all form data first
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== '' && value !== null && value !== undefined) {
          submissionData[key] = value;
        }
      });

      // Convert specific fields to integers
      const integerFields = ['office', 'department', 'faat', 'user_type', 'perm_state', 'perm_district', 'perm_municipality', 'temp_state', 'temp_district', 'temp_municipality'];
      integerFields.forEach(field => {
        if (submissionData[field]) {
          submissionData[field] = parseInt(submissionData[field]);
        }
      });

      // Choose endpoint based on whether it's an update (has user_id) or new registration
      const endpoint = formData.user_id ? `${baseUrl}/users/${formData.user_id}/update/` : `${baseUrl}/user/register/`;
      const method = formData.user_id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Token ${token}` })
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Registration failed';
        
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.errors) {
          // Handle validation errors
          const errors = Object.entries(errorData.errors).map(([field, messages]) => {
            return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
          }).join('\n');
          errorMessage = errors;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Success
      setSubmitSuccess(true);
      const successMessage = formData.user_id ? 
        'प्रोफाइल सफलतापूर्वक अद्यावधिक गरियो' : 
        'कर्मचारी सफलतापूर्वक दर्ता गरियो';
      
      toast.success(successMessage, {
        position: 'top-center',
        autoClose: 3000,
      });
      
      // Reset form after short delay if not updating and resetForm is provided
      if (!formData.user_id && resetForm && typeof resetForm === 'function') {
        setTimeout(() => {
          resetForm();
        }, 2000);
      }

      return true; // Return true for success

    } catch (error) {
      setSubmitError(error.message);
      toast.error(`दर्ता गर्न असफल: ${error.message}`, {
        position: 'top-center',
        autoClose: 4000,
      });
      return false; // Return false for failure
    } finally {
      setIsSubmitting(false);
    }
  }, [baseUrl, token]);

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    setSubmitError,
    setSubmitSuccess,
    handleSubmit
  };
};