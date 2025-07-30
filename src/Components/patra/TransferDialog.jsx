import React, { useState, useEffect } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import SelectOffice from './SelectOffice';
import SelectDepartment from './SelectDepartment';

const TransferDialog = ({ 
  open, 
  onClose, 
  onTransfer, 
  loading = false,
  patraSubject = ''
}) => {
  const [formData, setFormData] = useState({
    office: '',
    department: '',
    remarks: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setFormData({ office: '', department: '', remarks: '' });
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.office) {
      newErrors.office = 'Office selection is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department selection is required';
    }
    
    if (formData.remarks && formData.remarks.length > 500) {
      newErrors.remarks = 'Remarks cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const transferData = {
      receiver_office: parseInt(formData.office),
      receiver_department: parseInt(formData.department),
      remarks: formData.remarks || undefined
    };
    
    onTransfer(transferData);
  };

  const handleOfficeChange = (officeId) => {
    setFormData(prev => ({
      ...prev,
      office: officeId,
      department: '' // Reset department when office changes
    }));
    if (errors.office) {
      setErrors(prev => ({ ...prev, office: null }));
    }
  };

  const handleDepartmentChange = (departmentId) => {
    setFormData(prev => ({ ...prev, department: departmentId }));
    if (errors.department) {
      setErrors(prev => ({ ...prev, department: null }));
    }
  };

  const handleRemarksChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, remarks: value }));
    if (errors.remarks) {
      setErrors(prev => ({ ...prev, remarks: null }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transfer Patra</h2>
            <p className="text-sm text-gray-600 mt-1 truncate">{patraSubject}</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            {/* Office Selection */}
            <SelectOffice
              value={formData.office}
              onChange={handleOfficeChange}
              error={errors.office}
              required
              disabled={loading}
            />

            {/* Department Selection */}
            <SelectDepartment
              officeId={formData.office}
              value={formData.department}
              onChange={handleDepartmentChange}
              error={errors.department}
              required
              disabled={loading}
            />

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                value={formData.remarks}
                onChange={handleRemarksChange}
                rows={3}
                placeholder="Add any transfer remarks or instructions (optional)"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.remarks ? 'border-red-500' : 'border-gray-300'
                } ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.remarks && (
                <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.remarks.length}/500 characters
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.office || !formData.department}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[120px] justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <FaPaperPlane className="w-4 h-4" />
                  <span>Transfer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferDialog;
 