import React from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import EmployeeDetailsHeader from '../Components/employee/EmployeeDetailsHeader';
import EmployeeSearchBar from '../Components/employee/EmployeeSearchBar';
import EmployeeTable from '../Components/employee/EmployeeTable';
import EmployeeDetailModal from '../Components/employee/EmployeeDetailModal';
import RoleAssignmentModal from '../Components/employee/RoleAssignmentModal';
import OfficeAssignmentModal from '../Components/employee/OfficeAssignmentModal';
import { LoadingState, ErrorState, EmptyState } from '../Components/employee/EmployeeStates';
import { useEmployeeData } from '../hooks/useEmployeeData';
import { useEmployeeFilters } from '../hooks/useEmployeeFilters';
import { useEmployeeModals } from '../hooks/useEmployeeModals';
import { useOfficeData } from '../hooks/useOfficeData';

const EmployeeDetails = () => {
  // Custom hooks
  const { 
    employees, 
    isLoading, 
    error, 
    refetchEmployees, 
    updateEmployeeRole, 
    updateEmployeeOffice 
  } = useEmployeeData();

  const {
    searchQuery,
    setSearchQuery,
    sortedEmployees,
    handleSort,
    getSortIndicator
  } = useEmployeeFilters(employees);

  const {
    selectedEmployee,
    roleModal,
    editOffice,
    newRole,
    setNewRole,
    openEmployeeDetailModal,
    openRoleModal,
    openOfficeModal,
    closeAllModals
  } = useEmployeeModals();

  const officeData = useOfficeData();

  // Event handlers
  const handleEmployeeView = (employee) => {
    openEmployeeDetailModal(employee);
  };

  const handleRoleEdit = (employee) => {
    openRoleModal(employee);
  };

  const handleOfficeEdit = (employee) => {
    openOfficeModal(employee);
  };

  // Render content based on state
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={refetchEmployees} />;
    }

    if (sortedEmployees.length === 0) {
      return <EmptyState />;
    }

    return (
      <EmployeeTable
        employees={sortedEmployees}
        onSort={handleSort}
        getSortIndicator={getSortIndicator}
        onViewDetails={handleEmployeeView}
        onEditRole={handleRoleEdit}
        onEditOffice={handleOfficeEdit}
      />
    );
  };

  return (
    <DashboardLayout>
      <EmployeeDetailsHeader />
      
      <EmployeeSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalEmployees={sortedEmployees.length}
        onRefresh={refetchEmployees}
      />

      {renderContent()}

      {/* Modals */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={closeAllModals}
      />

      <RoleAssignmentModal
        employee={roleModal}
        isOpen={!!roleModal}
        onClose={closeAllModals}
        newRole={newRole}
        setNewRole={setNewRole}
        onUpdateRole={updateEmployeeRole}
      />

      <OfficeAssignmentModal
        employee={editOffice}
        isOpen={!!editOffice}
        onClose={closeAllModals}
        officeData={officeData}
        onUpdateOffice={updateEmployeeOffice}
      />

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default EmployeeDetails;
