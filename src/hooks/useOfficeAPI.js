import { useState } from 'react';
import { toast } from 'react-toastify';

export const useOfficeAPI = (baseUrl, token) => {
  const [officeData, setOfficeData] = useState({
    offices: [],
    departments: [],
    faats: [],
    selectedOffice: null,
    isLoading: false,
    error: null
  });

  // Fetch offices
  const fetchOffices = async () => {
    if (!baseUrl) {
      setOfficeData(prev => ({
        ...prev,
        isLoading: false,
        error: 'API URL उपलब्ध छैन'
      }));
      // Don't show URL error toast on every fetch attempt
      if (!sessionStorage.getItem('baseUrlErrorShown')) {
        toast.error('API URL उपलब्ध छैन। कृपया सेटिङ्स जाँच गर्नुहोस्।');
        sessionStorage.setItem('baseUrlErrorShown', 'true');
      }
      return;
    }
    
    if (!token) {
      setOfficeData(prev => ({
        ...prev,
        isLoading: false,
        error: 'प्रमाणीकरण टोकन आवश्यक छ'
      }));
      // Don't show token error toast on every office fetch - only show once
      if (!sessionStorage.getItem('tokenErrorShown')) {
        toast.error('प्रमाणीकरण टोकन उपलब्ध छैन। कृपया लगइन गर्नुहोस्।');
        sessionStorage.setItem('tokenErrorShown', 'true');
      }
      return;
    }
    
    setOfficeData(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      };
      
      const apiUrl = `${baseUrl}/offices/`;
      
      const response = await fetch(apiUrl, { 
        method: 'GET',
        headers 
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      const offices = Array.isArray(data) ? data : (data.results || data.data || []);
      
      setOfficeData(prev => ({
        ...prev,
        offices,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setOfficeData(prev => ({
        ...prev,
        offices: [],
        isLoading: false,
        error: `कार्यालयहरू लोड गर्न समस्या भयो: ${error.message}`
      }));
      // Only show toast for critical network errors, not for empty data
      if (error.message.includes('fetch') || error.message.includes('Network') || error.message.includes('401') || error.message.includes('403')) {
        toast.error(`कार्यालयहरू लोड गर्न समस्या भयो: ${error.message}`);
      }
    }
  };

  // Fetch departments with multiple fallback approaches
  const fetchDepartments = async (officeId) => {
    if (!baseUrl || !officeId) {
      return;
    }
    
    if (!token) {
      toast.error('प्रमाणीकरण टोकन आवश्यक छ');
      return;
    }
    
    setOfficeData(prev => ({ ...prev, isLoading: true, departments: [], error: null }));
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      };
      
      // Try multiple endpoint variations
      const endpoints = [
        `${baseUrl}/offices/${officeId}/departments/`,
        `${baseUrl}/departments/?office=${officeId}`,
        `${baseUrl}/department/?office_id=${officeId}`,
        `${baseUrl}/office/${officeId}/departments/`
      ];
      
      let departments = [];
      let success = false;
      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, { headers });
          
          if (response.ok) {
            const data = await response.json();
            departments = Array.isArray(data) ? data : (data.results || data.departments || data.data || []);
            
            if (departments.length >= 0) { // Accept even empty arrays as valid responses
              success = true;
              break;
            }
          } else {
            const errorText = await response.text();
            lastError = new Error(`HTTP ${response.status}: ${errorText}`);
          }
        } catch (endpointError) {
          lastError = endpointError;
          continue;
        }
      }
      
      setOfficeData(prev => ({
        ...prev,
        departments,
        isLoading: false,
        error: null
      }));
      
      if (!success) {
        throw lastError || new Error('सबै endpoints असफल भए');
      }
      
    } catch (error) {
      setOfficeData(prev => ({
        ...prev,
        departments: [],
        isLoading: false,
        error: `विभागहरू लोड गर्न समस्या भयो: ${error.message}`
      }));
    }
  };

  // Fetch faats with multiple fallback approaches
  const fetchFaats = async (departmentId) => {
    if (!baseUrl || !departmentId) return;
    
    setOfficeData(prev => ({ ...prev, isLoading: true }));
    try {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
      
      // Try direct department fetch first
      let response = await fetch(`${baseUrl}/department/${departmentId}`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        const faats = data.faats || [];
        
        setOfficeData(prev => ({
          ...prev,
          faats,
          isLoading: false
        }));
        return;
      }
      
      // Fallback 1: Try departments endpoint
      response = await fetch(`${baseUrl}/departments/${departmentId}/faats/`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        const faats = Array.isArray(data) ? data : (data.results || []);
        
        setOfficeData(prev => ({
          ...prev,
          faats,
          isLoading: false
        }));
        return;
      }
      
      // Fallback 2: Try query parameter approach
      response = await fetch(`${baseUrl}/faats/?department=${departmentId}`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        const faats = Array.isArray(data) ? data : (data.results || []);
        
        setOfficeData(prev => ({
          ...prev,
          faats,
          isLoading: false
        }));
        return;
      }
      
      // If all methods fail, just set empty array (faats might not exist)
      setOfficeData(prev => ({
        ...prev,
        faats: [],
        isLoading: false
      }));
      
    } catch (error) {
      setOfficeData(prev => ({
        ...prev,
        faats: [],
        isLoading: false
      }));
      // Don't show error for faats as they might be optional
    }
  };

  // Initialize office data
  const initialize = async () => {
    await fetchOffices();
  };

  // Reset all data
  const reset = () => {
    setOfficeData({
      offices: [],
      departments: [],
      faats: [],
      selectedOffice: null,
      isLoading: false,
      error: null
    });
  };

  return {
    ...officeData,
    initialize,
    fetchOffices,
    fetchDepartments,
    fetchFaats,
    reset
  };
};
