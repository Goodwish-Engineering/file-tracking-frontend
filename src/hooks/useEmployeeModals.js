import { useState, useRef, useEffect } from 'react';

export const useEmployeeModals = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [roleModal, setRoleModal] = useState(null);
  const [editOffice, setEditOffice] = useState(null);
  const [newRole, setNewRole] = useState("");
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeAllModals();
      }
    };

    if (selectedEmployee || roleModal || editOffice) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedEmployee, roleModal, editOffice]);

  const closeAllModals = () => {
    setSelectedEmployee(null);
    setRoleModal(null);
    setEditOffice(null);
    setNewRole("");
  };

  const openEmployeeDetailModal = (employee) => {
    setSelectedEmployee(employee);
  };

  const openRoleModal = (employee) => {
    setRoleModal(employee);
    setNewRole("");
  };

  const openOfficeModal = (employee) => {
    setEditOffice(employee);
  };

  return {
    selectedEmployee,
    roleModal,
    editOffice,
    newRole,
    setNewRole,
    modalRef,
    openEmployeeDetailModal,
    openRoleModal,
    openOfficeModal,
    closeAllModals
  };
};
