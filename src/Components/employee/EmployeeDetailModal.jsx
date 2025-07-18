import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import Modal from '../ui/Modal';
import EmployeeDetailsContent from './EmployeeDetailsContent';
import { LABELS } from '../../constants/employeeConstants';

const EmployeeDetailModal = ({ employee, isOpen, onClose }) => {
  if (!employee) return null;

  const footer = (
    <button
      className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors"
      onClick={onClose}
    >
      {LABELS.CLOSE}
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="कर्मचारी विस्तृत विवरण"
      icon={FaUserAlt}
      size="lg"
      footer={footer}
    >
      <EmployeeDetailsContent employee={employee} />
    </Modal>
  );
};

export default EmployeeDetailModal;
