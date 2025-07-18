import React from 'react';
import { TABLE_HEADERS, PLACEHOLDER_VALUES, BUTTON_TITLES } from '../../constants/employeeConstants';
import ActionButton from '../common/ActionButton';
import { MdOutlineInfo } from 'react-icons/md';
import { FaUserTie, FaBuilding } from 'react-icons/fa';

const EmployeeTableHeader = ({ onSort, getSortIndicator }) => (
  <thead className="bg-gray-50">
    <tr>
      <th 
        scope="col" 
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
        onClick={() => onSort('employee_id')}
      >
        <div className="flex items-center gap-1">
          {TABLE_HEADERS.EMPLOYEE_ID}
          {getSortIndicator('employee_id')}
        </div>
      </th>
      <th 
        scope="col" 
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
        onClick={() => onSort('first_name')}
      >
        <div className="flex items-center gap-1">
          {TABLE_HEADERS.FIRST_NAME}
          {getSortIndicator('first_name')}
        </div>
      </th>
      <th 
        scope="col" 
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
        onClick={() => onSort('last_name')}
      >
        <div className="flex items-center gap-1">
          {TABLE_HEADERS.LAST_NAME}
          {getSortIndicator('last_name')}
        </div>
      </th>
      <th 
        scope="col" 
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
        onClick={() => onSort('position')}
      >
        <div className="flex items-center gap-1">
          {TABLE_HEADERS.POSITION}
          {getSortIndicator('position')}
        </div>
      </th>
      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        {TABLE_HEADERS.ACTIONS}
      </th>
    </tr>
  </thead>
);

const EmployeeTableRow = ({ 
  employee, 
  onViewDetails, 
  onEditRole, 
  onEditOffice 
}) => (
  <tr className="hover:bg-gray-50 transition-colors duration-150">
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {employee.employee_id || PLACEHOLDER_VALUES.NOT_AVAILABLE}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {employee.first_name || PLACEHOLDER_VALUES.NOT_AVAILABLE}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {employee.last_name || PLACEHOLDER_VALUES.NOT_AVAILABLE}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {employee.position || PLACEHOLDER_VALUES.NOT_AVAILABLE}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
      <div className="flex justify-center gap-2">
        <ActionButton
          onClick={() => onViewDetails(employee)}
          icon={MdOutlineInfo}
          title={BUTTON_TITLES.VIEW_DETAILS}
          variant="primary"
        />
        <ActionButton
          onClick={() => onEditRole(employee)}
          icon={FaUserTie}
          title={BUTTON_TITLES.EDIT_ROLE}
          variant="success"
        />
        <ActionButton
          onClick={() => onEditOffice(employee)}
          icon={FaBuilding}
          title={BUTTON_TITLES.EDIT_OFFICE}
          variant="warning"
        />
      </div>
    </td>
  </tr>
);

const EmployeeTable = ({ 
  employees, 
  onSort, 
  getSortIndicator,
  onViewDetails,
  onEditRole,
  onEditOffice
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <EmployeeTableHeader onSort={onSort} getSortIndicator={getSortIndicator} />
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <EmployeeTableRow
              key={employee.id}
              employee={employee}
              onViewDetails={onViewDetails}
              onEditRole={onEditRole}
              onEditOffice={onEditOffice}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmployeeTable;
