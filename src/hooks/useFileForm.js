import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FIELD_NAMES, DEFAULT_FORM_DATA } from '../constants/fileDetailsConstants';

export const useFileForm = (clearData) => {
  const empId = localStorage.getItem("userId");
  
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    [FIELD_NAMES.PRESENT_BY]: empId
  });

  // Input refs for uncontrolled components
  const [inputRefs, setInputRefs] = useState({
    file_name: null,
    subject: null,
    ward_no: null,
    tole: null,
    submitted_by: null,
  });

  const [datePickerKey, setDatePickerKey] = useState(0);

  // Clear form data when clearData prop changes
  useEffect(() => {
    if (clearData) {
      const clearedData = {
        ...DEFAULT_FORM_DATA,
        [FIELD_NAMES.PRESENT_BY]: empId
      };
      setFormData(clearedData);
      
      // Clear input refs
      Object.values(inputRefs).forEach((ref) => {
        if (ref?.current) {
          ref.current.value = "";
        }
      });
      
      // Force re-mount of date picker
      setDatePickerKey(prev => prev + 1);
    }
  }, [clearData, empId]);

  // Handle blur events for uncontrolled inputs
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date field changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle controlled select inputs
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update form data programmatically
  const updateFormData = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Clear specific fields
  const clearFields = (fieldNames) => {
    const updates = {};
    fieldNames.forEach(field => {
      updates[field] = "";
    });
    updateFormData(updates);
    
    // Clear corresponding input refs
    fieldNames.forEach(field => {
      if (inputRefs[field]?.current) {
        inputRefs[field].current.value = "";
      }
    });
  };

  // Set ref for input field
  const setInputRef = (name, ref) => {
    setInputRefs(prev => ({
      ...prev,
      [name]: ref
    }));
  };

  // Get updated form data including ref values
  const getFormDataWithRefs = () => {
    const updatedFormData = { ...formData };
    Object.keys(inputRefs).forEach((name) => {
      if (inputRefs[name]?.current) {
        updatedFormData[name] = inputRefs[name].current.value;
      }
    });
    return updatedFormData;
  };

  return {
    formData,
    setFormData,
    inputRefs,
    datePickerKey,
    handleBlur,
    handleDateChange,
    handleSelectChange,
    updateFormData,
    clearFields,
    setInputRef,
    getFormDataWithRefs
  };
};
