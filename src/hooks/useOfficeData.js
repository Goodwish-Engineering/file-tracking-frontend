import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useOfficeData = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [offices, setOffices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faats, setFaats] = useState([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedFaatId, setSelectedFaatId] = useState('');

  const fetchOffices = async () => {
    try {
      const response = await fetch(`${baseUrl}/offices/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.log("Error fetching offices:", error);
      setOffices([]);
    }
  };

  const fetchFaatsForDepartment = async (departmentId) => {
    try {
      const response = await fetch(`${baseUrl}/department/${departmentId}`, {
        headers: { Authorization: `token ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFaats(data.faats || []);
        return data.faats || [];
      } else {
        // Fallback approach
        const fallbackResponse = await fetch(`${baseUrl}/faat/?department=${departmentId}`, {
          headers: { Authorization: `token ${token}` },
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const faatsList = Array.isArray(fallbackData) ? fallbackData : [];
          setFaats(faatsList);
          return faatsList;
        }
      }
    } catch (error) {
      console.error("Error fetching faats:", error);
    }
    setFaats([]);
    return [];
  };

  const handleOfficeChange = (officeId) => {
    setSelectedOfficeId(officeId);
    setSelectedDepartmentId('');
    setSelectedFaatId('');
    
    if (officeId) {
      const selectedOffice = offices.find(office => office.id.toString() === officeId);
      if (selectedOffice && selectedOffice.departments) {
        setDepartments(selectedOffice.departments);
      } else {
        setDepartments([]);
      }
    } else {
      setDepartments([]);
    }
    setFaats([]);
  };

  const handleDepartmentChange = async (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setSelectedFaatId('');
    
    const selectedOffice = offices.find(office => office.id.toString() === selectedOfficeId);
    const isHeadOffice = selectedOffice?.is_head_office;
    
    if (departmentId && isHeadOffice) {
      await fetchFaatsForDepartment(departmentId);
    } else {
      setFaats([]);
    }
  };

  const handleFaatChange = (faatId) => {
    setSelectedFaatId(faatId);
  };

  const resetSelections = () => {
    setSelectedOfficeId('');
    setSelectedDepartmentId('');
    setSelectedFaatId('');
    setDepartments([]);
    setFaats([]);
  };

  const initializeWithEmployee = async (employee) => {
    if (employee.office && employee.office.id) {
      setSelectedOfficeId(employee.office.id.toString());
      
      const selectedOffice = offices.find(office => office.id === employee.office.id);
      if (selectedOffice && selectedOffice.departments) {
        setDepartments(selectedOffice.departments);
        
        if (employee.department && employee.department.id) {
          setSelectedDepartmentId(employee.department.id.toString());
          
          if (selectedOffice.is_head_office && employee.faat) {
            const faats = await fetchFaatsForDepartment(employee.department.id);
            if (employee.faat && employee.faat.id) {
              setSelectedFaatId(employee.faat.id.toString());
            }
          }
        } else {
          setSelectedDepartmentId('');
          setSelectedFaatId('');
        }
      } else {
        setDepartments([]);
        setSelectedDepartmentId('');
        setSelectedFaatId('');
      }
    } else {
      resetSelections();
    }
  };

  const getSelectedOffice = () => {
    return offices.find(office => office.id.toString() === selectedOfficeId);
  };

  const buildUpdatePayload = () => {
    const payload = {};
    if (selectedOfficeId) payload.office = selectedOfficeId;
    if (selectedDepartmentId) payload.department = selectedDepartmentId;
    
    const selectedOffice = getSelectedOffice();
    if (selectedOffice?.is_head_office && selectedFaatId) {
      payload.faat = selectedFaatId;
    }
    
    return payload;
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  return {
    offices,
    departments,
    faats,
    selectedOfficeId,
    selectedDepartmentId,
    selectedFaatId,
    handleOfficeChange,
    handleDepartmentChange,
    handleFaatChange,
    resetSelections,
    initializeWithEmployee,
    getSelectedOffice,
    buildUpdatePayload,
    fetchFaatsForDepartment
  };
};
