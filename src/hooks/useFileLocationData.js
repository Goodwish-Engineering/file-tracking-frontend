import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_ENDPOINTS } from '../constants/fileDetailsConstants';

export const useFileLocationData = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, [baseUrl]);

  const fetchProvinces = async () => {
    setIsLoadingProvinces(true);
    try {
      const response = await fetch(`${baseUrl}${API_ENDPOINTS.PROVINCES}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProvinces(data || []);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      setProvinces([]);
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  const fetchDistricts = async (provinceId) => {
    if (!provinceId) {
      setDistricts([]);
      return;
    }

    setIsLoadingDistricts(true);
    try {
      const response = await fetch(`${baseUrl}/districts/${provinceId}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDistricts(data || []);
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const fetchMunicipalities = async (districtId) => {
    if (!districtId) {
      setMunicipalities([]);
      return;
    }

    setIsLoadingMunicipalities(true);
    try {
      const response = await fetch(`${baseUrl}/municipalities/${districtId}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMunicipalities(data || []);
    } catch (error) {
      console.error("Error fetching municipalities:", error);
      setMunicipalities([]);
    } finally {
      setIsLoadingMunicipalities(false);
    }
  };

  // Handle province change
  const handleProvinceChange = (provinceId, clearFields) => {
    // Clear dependent fields
    clearFields(['district', 'municipality']);
    setDistricts([]);
    setMunicipalities([]);
    
    // Fetch new districts
    if (provinceId) {
      fetchDistricts(provinceId);
    }
  };

  // Handle district change  
  const handleDistrictChange = (districtId, clearFields) => {
    // Clear dependent fields
    clearFields(['municipality']);
    setMunicipalities([]);
    
    // Fetch new municipalities
    if (districtId) {
      fetchMunicipalities(districtId);
    }
  };

  // Reset all location data
  const resetLocationData = () => {
    setDistricts([]);
    setMunicipalities([]);
  };

  return {
    provinces,
    districts,
    municipalities,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingMunicipalities,
    fetchProvinces,
    fetchDistricts,
    fetchMunicipalities,
    handleProvinceChange,
    handleDistrictChange,
    resetLocationData
  };
};
