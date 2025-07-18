import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/employeeConstants';

export const useEmployeeData = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/user/all/`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data = await response.json();
      const filteredData = data.filter((user) => !user.is_superuser);
      setEmployees(filteredData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setError(ERROR_MESSAGES.FETCH_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployeeRole = async (employeeId, newRole) => {
    try {
      const response = await fetch(`${baseUrl}/user/${employeeId}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({ user_type: newRole }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update user role");
      }
      
      setEmployees(prevEmployees => 
        prevEmployees.map(employee => 
          employee.id === employeeId 
            ? { ...employee, user_type: newRole } 
            : employee
        )
      );
      
      toast.success(SUCCESS_MESSAGES.ROLE_UPDATED);
      return true;
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(ERROR_MESSAGES.ROLE_UPDATE_FAILED);
      return false;
    }
  };

  const updateEmployeeOffice = async (employeeId, payload) => {
    try {
      const response = await fetch(`${baseUrl}/user/${employeeId}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update employee office");
      }

      toast.success(SUCCESS_MESSAGES.EMPLOYEE_UPDATED);
      await fetchEmployees(); // Refresh data
      return true;
    } catch (error) {
      console.error("Error updating employee office:", error);
      toast.error(ERROR_MESSAGES.EMPLOYEE_UPDATE_FAILED);
      return false;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    isLoading,
    error,
    refetchEmployees: fetchEmployees,
    updateEmployeeRole,
    updateEmployeeOffice
  };
};
