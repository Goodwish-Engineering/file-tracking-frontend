import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useLocationData = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tempDistricts, setTempDistricts] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [tempMunicipalities, setTempMunicipalities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch provinces
  const fetchProvinces = useCallback(async () => {
    if (!baseUrl) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/provinces/`);
      if (!response.ok) {
        throw new Error('Failed to fetch provinces');
      }
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setError('प्रदेशहरू लोड गर्न असफल');
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  // Fetch districts for permanent address
  const fetchDistricts = useCallback(async (provinceId) => {
    if (!baseUrl || !provinceId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/districts/${provinceId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      const data = await response.json();
      setDistricts(data);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setError('जिल्लाहरू लोड गर्न असफल');
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  // Fetch districts for temporary address
  const fetchTempDistricts = useCallback(async (provinceId) => {
    if (!baseUrl || !provinceId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/districts/${provinceId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch temporary districts');
      }
      const data = await response.json();
      setTempDistricts(data);
    } catch (error) {
      console.error('Error fetching temporary districts:', error);
      setError('अस्थायी ठेगानाका जिल्लाहरू लोड गर्न असफल');
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  // Fetch municipalities for permanent address
  const fetchMunicipalities = useCallback(async (provinceId, districtId) => {
    if (!baseUrl || !provinceId || !districtId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/municipalities/${provinceId}/${districtId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch municipalities');
      }
      const data = await response.json();
      setMunicipalities(data);
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      setError('नगरपालिकाहरू लोड गर्न असफल');
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  // Fetch municipalities for temporary address
  const fetchTempMunicipalities = useCallback(async (provinceId, districtId) => {
    if (!baseUrl || !provinceId || !districtId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/municipalities/${provinceId}/${districtId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch temporary municipalities');
      }
      const data = await response.json();
      setTempMunicipalities(data);
    } catch (error) {
      console.error('Error fetching temporary municipalities:', error);
      setError('अस्थायी ठेगानाका नगरपालिकाहरू लोड गर्न असफल');
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  // Handle province change for permanent address
  const handleProvinceChange = useCallback((provinceId) => {
    setSelectedProvince(provinceId);
    if (provinceId) {
      fetchDistricts(provinceId);
    } else {
      setDistricts([]);
      setMunicipalities([]);
    }
  }, [fetchDistricts]);

  // Handle district change for permanent address
  const handleDistrictChange = useCallback((districtId) => {
    if (districtId && selectedProvince) {
      fetchMunicipalities(selectedProvince, districtId);
    } else {
      setMunicipalities([]);
    }
  }, [selectedProvince, fetchMunicipalities]);

  // Handle province change for temporary address
  const handleTempProvinceChange = useCallback((provinceId) => {
    if (provinceId) {
      fetchTempDistricts(provinceId);
    } else {
      setTempDistricts([]);
      setTempMunicipalities([]);
    }
  }, [fetchTempDistricts]);

  // Handle district change for temporary address
  const handleTempDistrictChange = useCallback((districtId, tempProvinceId) => {
    if (districtId && tempProvinceId) {
      fetchTempMunicipalities(tempProvinceId, districtId);
    } else {
      setTempMunicipalities([]);
    }
  }, [fetchTempMunicipalities]);

  // Copy permanent address to temporary address
  const copyPermanentToTemporary = useCallback((permData) => {
    setTempDistricts(districts);
    setTempMunicipalities(municipalities);
    return {
      temp_state: permData.perm_state,
      temp_district: permData.perm_district,
      temp_municipality: permData.perm_municipality,
      temp_ward_no: permData.perm_ward_no
    };
  }, [districts, municipalities]);

  // Initialize provinces on mount
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  return {
    // Data
    provinces,
    districts,
    tempDistricts,
    municipalities,
    tempMunicipalities,
    selectedProvince,
    
    // State
    isLoading,
    error,
    
    // Actions
    handleProvinceChange,
    handleDistrictChange,
    handleTempProvinceChange,
    handleTempDistrictChange,
    copyPermanentToTemporary,
    
    // Direct fetch methods (for manual calls)
    fetchDistricts,
    fetchTempDistricts,
    fetchMunicipalities,
    fetchTempMunicipalities
  };
};
