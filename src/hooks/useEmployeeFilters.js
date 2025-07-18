import { useState, useMemo } from 'react';
import { SORT_DIRECTIONS, SORT_FIELDS } from '../constants/employeeConstants';

export const useEmployeeFilters = (employees) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(SORT_FIELDS.EMPLOYEE_ID);
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASC);

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return employees;
    
    const query = searchQuery.toLowerCase();
    return employees.filter(employee => {
      return (
        (employee.first_name && employee.first_name.toLowerCase().includes(query)) ||
        (employee.last_name && employee.last_name.toLowerCase().includes(query)) ||
        (employee.employee_id && employee.employee_id.toString().includes(query)) ||
        (employee.position && employee.position.toLowerCase().includes(query)) ||
        (employee.email && employee.email.toLowerCase().includes(query))
      );
    });
  }, [employees, searchQuery]);

  // Sort employees
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      if (!a[sortField] && !b[sortField]) return 0;
      if (!a[sortField]) return 1;
      if (!b[sortField]) return -1;
      
      const valA = typeof a[sortField] === 'string' ? a[sortField].toLowerCase() : a[sortField];
      const valB = typeof b[sortField] === 'string' ? b[sortField].toLowerCase() : b[sortField];
      
      if (valA < valB) return sortDirection === SORT_DIRECTIONS.ASC ? -1 : 1;
      if (valA > valB) return sortDirection === SORT_DIRECTIONS.ASC ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortField, sortDirection]);

  // Handle column sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC);
    } else {
      setSortField(field);
      setSortDirection(SORT_DIRECTIONS.ASC);
    }
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === SORT_DIRECTIONS.ASC ? '↑' : '↓';
  };

  return {
    searchQuery,
    setSearchQuery,
    sortField,
    sortDirection,
    filteredEmployees,
    sortedEmployees,
    handleSort,
    getSortIndicator
  };
};
