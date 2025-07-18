import { useState } from 'react';

export const useSimpleForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field changes
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const setValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setError = (name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const reset = (newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
  };

  const validate = (rules) => {
    const newErrors = {};
    
    Object.keys(rules).forEach(field => {
      if (rules[field].required && !values[field]) {
        newErrors[field] = rules[field].message || `${field} आवश्यक छ`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    values,
    errors,
    handleChange,
    setValue,
    setError,
    reset,
    validate
  };
};
