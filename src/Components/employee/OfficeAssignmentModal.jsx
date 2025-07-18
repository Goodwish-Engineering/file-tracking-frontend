import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { FaBuilding } from 'react-icons/fa';
import { LABELS, SUCCESS_MESSAGES } from '../../constants/employeeConstants';

const OfficeAssignmentModal = ({
  employee,
  isOpen,
  onClose,
  officeData,
  onUpdateOffice
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedFaatId, setSelectedFaatId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [faats, setFaats] = useState([]);

  useEffect(() => {
    if (employee && isOpen && officeData) {
      // Initialize with employee's current office/department/faat
      if (employee.office?.id) {
        setSelectedOfficeId(employee.office.id.toString());
        const office = officeData.offices.find(o => o.id === employee.office.id);
        setDepartments(office?.departments || []);
        
        if (employee.department?.id) {
          setSelectedDepartmentId(employee.department.id.toString());
          
          if (office?.is_head_office && employee.faat?.id) {
            setSelectedFaatId(employee.faat.id.toString());
          }
        }
      }
    }
  }, [employee, isOpen, officeData]);

  const handleOfficeChange = (officeId) => {
    setSelectedOfficeId(officeId);
    setSelectedDepartmentId('');
    setSelectedFaatId('');
    setFaats([]);
    
    if (officeId && officeData) {
      const office = officeData.offices.find(o => o.id === parseInt(officeId));
      setDepartments(office?.departments || []);
    } else {
      setDepartments([]);
    }
  };

  const handleDepartmentChange = async (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setSelectedFaatId('');
    
    if (departmentId && officeData) {
      const office = officeData.offices.find(o => o.id === parseInt(selectedOfficeId));
      if (office?.is_head_office) {
        // Fetch faats for this department if needed
        const faatsData = await officeData.fetchFaatsForDepartment(parseInt(departmentId));
        setFaats(faatsData || []);
      }
    } else {
      setFaats([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOfficeId || !selectedDepartmentId || !employee) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        office_id: parseInt(selectedOfficeId),
        department_id: parseInt(selectedDepartmentId),
        ...(selectedFaatId && { faat_id: parseInt(selectedFaatId) })
      };

      await onUpdateOffice(employee.id, updateData);
      alert(SUCCESS_MESSAGES.OFFICE_UPDATED);
      onClose();
    } catch (error) {
      alert('कार्यालय परिवर्तन गर्न असफल');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!employee || !officeData) return null;

  const selectedOffice = officeData.offices.find(o => o.id === parseInt(selectedOfficeId));
  const isHeadOffice = selectedOffice?.is_head_office;

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
        form="office-form"
        className="px-4 py-2 bg-[#E68332] text-white rounded-md hover:bg-[#c36f2a] transition-colors disabled:opacity-50"
        disabled={isSubmitting || !selectedOfficeId || !selectedDepartmentId}
      >
        {isSubmitting ? LABELS.UPDATING : LABELS.UPDATE}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="कार्यालय परिवर्तन गर्नुहोस्"
      icon={FaBuilding}
      footer={footer}
    >
      <form id="office-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">
            <strong>{employee.first_name} {employee.last_name}</strong> को कार्यालय विवरण परिवर्तन गर्नुहोस्
          </p>

          {/* Office Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              कार्यालय चयन गर्नुहोस्:
            </label>
            <select
              value={selectedOfficeId}
              onChange={(e) => handleOfficeChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
              required
              disabled={isSubmitting}
            >
              <option value="">कार्यालय चयन गर्नुहोस्</option>
              {officeData.offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.name} {office.is_head_office ? '(मुख्य कार्यालय)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Department Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              विभाग चयन गर्नुहोस्:
            </label>
            <select
              value={selectedDepartmentId}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
              required
              disabled={isSubmitting || !selectedOfficeId}
            >
              <option value="">विभाग चयन गर्नुहोस्</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Faat Selection (only for head offices) */}
          {isHeadOffice && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                फाँट चयन गर्नुहोस् (वैकल्पिक):
              </label>
              <select
                value={selectedFaatId}
                onChange={(e) => setSelectedFaatId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E68332] focus:border-transparent"
                disabled={isSubmitting || !selectedDepartmentId}
              >
                <option value="">फाँट चयन गर्नुहोस्</option>
                {faats.map((faat) => (
                  <option key={faat.id} value={faat.id}>
                    {faat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default OfficeAssignmentModal;
