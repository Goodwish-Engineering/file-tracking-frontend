import { USER_TYPE_LABELS } from './constants';

// Core utility functions
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch (error) {
    return '—';
  }
};

export const getUserTypeLabel = (userType) => {
  return USER_TYPE_LABELS[userType] || 'अन्य';
};

export const getFullName = (firstName, lastName) => {
  return `${firstName || ''} ${lastName || ''}`.trim() || '—';
};

export const truncateText = (text, maxLength = 30) => {
  if (!text) return '—';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Office-related helpers
export const getOfficeTypeLabel = (isHeadOffice) => {
  return isHeadOffice ? "(मुख्य)" : "(शाखा)";
};

export const getDepartmentLabel = (isHeadOffice) => {
  return isHeadOffice ? "महाशाखा" : "शाखा";
};

export const getFaatLabel = () => {
  return "शाखा";
};

// Form validation helpers
export const validateRequired = (value) => {
  return value && value.toString().trim() !== '';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Common form handlers
export const createFormHandler = (setFormData) => (e) => {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};
