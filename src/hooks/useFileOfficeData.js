import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants/fileDetailsConstants';

export const useFileOfficeData = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem("token");
  
  const [officeData, setOfficeData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [faats, setFaats] = useState([]);
  const [fileTypes, setFileTypeData] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isLoadingOffices, setIsLoadingOffices] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingFaats, setIsLoadingFaats] = useState(false);
  const [isLoadingFileTypes, setIsLoadingFileTypes] = useState(false);

  // Fetch initial office and file type data
  useEffect(() => {
    fetchOfficeData();
    fetchFileTypes();
  }, [baseUrl, token]);

  const fetchOfficeData = async () => {
    setIsLoadingOffices(true);
    try {
      const response = await axios.get(`${baseUrl}${API_ENDPOINTS.OFFICES}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.data) {
        setOfficeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching Office data:", error);
      setOfficeData([]);
    } finally {
      setIsLoadingOffices(false);
    }
  };

  const fetchFileTypes = async () => {
    setIsLoadingFileTypes(true);
    try {
      const response = await axios.get(`${baseUrl}${API_ENDPOINTS.FILE_TYPES}`, {
        headers: { Authorization: `Token ${token}` },
      });
      if (response.data) {
        setFileTypeData(response.data);
      }
    } catch (error) {
      console.error("Error fetching File Types data:", error);
      setFileTypeData([]);
    } finally {
      setIsLoadingFileTypes(false);
    }
  };

  const fetchFaats = async (departmentId) => {
    if (!departmentId) {
      setFaats([]);
      return;
    }

    setIsLoadingFaats(true);
    try {
      // Try direct department fetch first
      const response = await fetch(`${baseUrl}/department/${departmentId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Department Data:", data);
        
        // Extract faats from department response
        setFaats(data.faats || []); // Ensure it's always an array
      } else {
        // Fallback to the query parameter approach if direct fetch fails
        console.log("Trying fallback approach for faats...");
        const fallbackResponse = await fetch(`${baseUrl}${API_ENDPOINTS.FAATS}?department=${departmentId}`, {
          headers: { Authorization: `Token ${token}` },
        });
        
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log("Fetched faats (fallback):", fallbackData);
          setFaats(Array.isArray(fallbackData) ? fallbackData : []);
        } else {
          console.error("Both direct and fallback approaches failed for faats");
          setFaats([]);
        }
      }
    } catch (error) {
      console.error("Error fetching faats:", error);
      setFaats([]);
    } finally {
      setIsLoadingFaats(false);
    }
  };

  // Handle office selection change
  const handleOfficeChange = (officeId, clearFields) => {
    // Clear dependent fields
    clearFields(['related_department', 'related_faat']);
    
    // Find and store the selected office object
    const selectedOfficeObj = officeData.find(
      (office) => office.id.toString() === officeId
    );
    setSelectedOffice(selectedOfficeObj);
    
    // Set departments from selected office
    if (selectedOfficeObj?.departments) {
      setDepartments(selectedOfficeObj.departments);
    } else {
      setDepartments([]);
    }
    
    // Clear faats when office changes
    setFaats([]);
  };

  // Handle department selection change  
  const handleDepartmentChange = (departmentId, clearFields) => {
    // Clear dependent fields
    clearFields(['related_faat']);
    
    // Only fetch faats if it's a head office
    if (selectedOffice?.is_head_office && departmentId) {
      fetchFaats(departmentId);
    } else {
      setFaats([]);
    }
  };

  // Reset office-related data
  const resetOfficeData = () => {
    setSelectedOffice(null);
    setDepartments([]);
    setFaats([]);
  };

  return {
    officeData,
    departments,
    faats,
    fileTypes,
    selectedOffice,
    isLoadingOffices,
    isLoadingDepartments,
    isLoadingFaats,
    isLoadingFileTypes,
    fetchOfficeData,
    fetchFileTypes,
    fetchFaats,
    handleOfficeChange,
    handleDepartmentChange,
    resetOfficeData
  };
};
