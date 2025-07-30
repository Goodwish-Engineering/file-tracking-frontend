import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  SUCCESS_MESSAGES, 
  ERROR_MESSAGES, 
  API_ENDPOINTS,
  REQUIRED_FIELDS 
} from '../constants/fileDetailsConstants';

export const useFileSubmission = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate required fields
  const validateForm = (formData) => {
    const errors = {};
    
    REQUIRED_FIELDS.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = 'यो फिल्ड आवश्यक छ';
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  // Submit form data
  const submitForm = async (formData, onSuccess) => {
    setIsSubmitting(true);
    
    try {
      // Validate form data
      const validation = validateForm(formData);
      if (!validation.isValid) {
        toast.error(ERROR_MESSAGES.VALIDATION_ERROR);
        setIsSubmitting(false);
        return { success: false, errors: validation.errors };
      }

      // Prepare form data for submission
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Submit to API
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.FILES_UPLOAD}`, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `token ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(SUCCESS_MESSAGES.FORM_SUBMITTED);
        localStorage.setItem("fileId", data.id);
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(data);
        }
        
        return { success: true, data };
      } else {
        console.error("Server error:", data);
        toast.error(data.message || ERROR_MESSAGES.SUBMISSION_FAILED);
        return { success: false, error: data.message || ERROR_MESSAGES.SUBMISSION_FAILED };
      }
    } catch (error) {
      console.error("Error submitting file details:", error);
      toast.error(`${ERROR_MESSAGES.NETWORK_ERROR}: ${error.message}`);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitForm,
    validateForm
  };
};
