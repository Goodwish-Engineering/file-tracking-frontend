import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { FaUserTie } from 'react-icons/fa';
import { USER_TYPE_LABELS, LABELS, SUCCESS_MESSAGES } from '../../constants/employeeConstants';

const RoleAssignmentModal = ({
  employee,
  isOpen,
  onClose,
  newRole,
  setNewRole,
  onUpdateRole
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee && isOpen) {
      setNewRole(employee.user_type || '');
    }
  }, [employee, isOpen, setNewRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRole || !employee) return;

    setIsSubmitting(true);
    try {
      await onUpdateRole(employee.id, newRole);
      alert(SUCCESS_MESSAGES.ROLE_UPDATED);
      onClose();
    } catch (error) {
      alert('भूमिका परिवर्तन गर्न असफल');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!employee) return null;

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        disabled={isSubmitting}
      >
        {LABELS.CANCEL}
      </button>
      <button
        type="submit"
        form="role-form"
        className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors disabled:opacity-50"
        disabled={isSubmitting || !newRole}
      >
        {isSubmitting ? LABELS.UPDATING : LABELS.UPDATE}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="भूमिका परिवर्तन गर्नुहोस्"
      icon={FaUserTie}
      footer={footer}
    >
      <form id="role-form" onSubmit={handleSubmit}>
        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            <strong>{employee.first_name} {employee.last_name}</strong> को भूमिका परिवर्तन गर्नुहोस्
          </p>
          
          <label className="block text-sm font-medium text-gray-700 mb-2">
            नयाँ भूमिका चयन गर्नुहोस्:
          </label>
          
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
            required
            disabled={isSubmitting}
          >
            <option value="">भूमिका चयन गर्नुहोस्</option>
            {Object.entries(USER_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default RoleAssignmentModal;
