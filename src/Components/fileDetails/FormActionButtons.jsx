import React from 'react';
import { FaPlus, FaUndo } from 'react-icons/fa';
import { LABELS } from '../../constants/fileDetailsConstants';

const FormActionButtons = ({ 
  onSubmit, 
  onReset, 
  isSubmitting = false,
  disabled = false 
}) => {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t">
      <button
        type="button"
        onClick={onReset}
        disabled={disabled || isSubmitting}
        className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
      >
        <FaUndo className="mr-2" />
        {LABELS.RESET}
      </button>
      
      <button
        type="submit"
        onClick={onSubmit}
        disabled={disabled || isSubmitting}
        className="flex items-center px-6 py-3 bg-[#ED772F] text-white rounded-md hover:bg-[#CC651F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
      >
        <FaPlus className="mr-2" />
        {isSubmitting ? LABELS.SUBMITTING : LABELS.CREATE_FILE}
      </button>
    </div>
  );
};

export default FormActionButtons;
