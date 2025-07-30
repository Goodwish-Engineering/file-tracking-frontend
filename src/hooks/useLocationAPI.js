import { useState } from 'react';
import { toast } from 'react-toastify';
import { FALLBACK_LOCATION_DATA } from '../constants/fallbackLocationData';

export const useLocationAPI = (baseUrl) => {
  const [locationData, setLocationData] = useState({
    provinces: [],
    districts: [],
    tempDistricts: [],
    municipalities: [],
    tempMunicipalities: [],
    isLoading: false, // Unified loading state
    error: null
  });

  // Fetch provinces
  const fetchProvinces = async () => {
    if (!baseUrl) {
      setLocationData(prev => ({
        ...prev,
        provinces: FALLBACK_LOCATION_DATA.provinces,
        isLoadingProvinces: false,
        error: null
      }));
      return;
    }

    setLocationData(prev => ({ ...prev, isLoadingProvinces: true, error: null }));
    try {
      const response = await fetch(`${baseUrl}/provinces/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Provinces response:', data);
      const provinces = Array.isArray(data) ? data : (data.results || []);
      
      setLocationData(prev => ({
        ...prev,
        provinces,
        isLoadingProvinces: false,
        error: null
      }));
      
      console.log('Provinces loaded successfully:', provinces.length);
    } catch (error) {
      console.error('Error fetching provinces, using fallback data:', error);
      
      setLocationData(prev => ({
        ...prev,
        provinces: FALLBACK_LOCATION_DATA.provinces,
        isLoadingProvinces: false,
        error: null
      }));
      
      toast.warning(`API उपलब्ध छैन, अफलाइन डाटा प्रयोग गरिंदै`);
    }
  };

  // Fetch districts
  const fetchDistricts = async (provinceId, isTemp = false) => {
    if (!provinceId) {
      console.log('ProvinceId missing:', provinceId);
      return;
    }

    setLocationData(prev => ({ ...prev, isLoading: true }));

    if (!baseUrl) {
      console.log('BaseUrl not available, using fallback districts for province:', provinceId);
      const fallbackDistricts = FALLBACK_LOCATION_DATA.districts[provinceId] || [];
      setLocationData(prev => ({
        ...prev,
        [isTemp ? 'tempDistricts' : 'districts']: fallbackDistricts,
        isLoadingDistricts: false
      }));
      return;
    }

    try {
      console.log('Fetching districts from:', `${baseUrl}/districts/${provinceId}/`);
      const response = await fetch(`${baseUrl}/districts/${provinceId}/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Districts response:', data);
      const districts = Array.isArray(data) ? data : (data.results || []);
      
      setLocationData(prev => ({
        ...prev,
        [isTemp ? 'tempDistricts' : 'districts']: districts,
        isLoadingDistricts: false
      }));
      
      console.log(`${isTemp ? 'Temp' : ''} Districts loaded for province ${provinceId}:`, districts.length);
    } catch (error) {
      console.error('Error fetching districts, using fallback data:', error);
      
      const fallbackDistricts = FALLBACK_LOCATION_DATA.districts[provinceId] || [];
      setLocationData(prev => ({
        ...prev,
        [isTemp ? 'tempDistricts' : 'districts']: fallbackDistricts,
        isLoadingDistricts: false
      }));
      
      if (fallbackDistricts.length === 0) {
        toast.warning(`प्रदेश ${provinceId} का लागि जिल्लाहरू उपलब्ध छैन`);
      }
    }
  };

  // Fetch municipalities
  const fetchMunicipalities = async (provinceId, districtId, isTemp = false) => {
    if (!districtId || !provinceId) {
      console.log('ProvinceId or districtId missing:', provinceId, districtId);
      return;
    }

    setLocationData(prev => ({ ...prev, isLoadingMunicipalities: true }));

    if (!baseUrl) {
      console.log('BaseUrl not available, using fallback municipalities for district:', districtId);
      const fallbackMunicipalities = FALLBACK_LOCATION_DATA.municipalities[districtId] || [];
      setLocationData(prev => ({
        ...prev,
        [isTemp ? 'tempMunicipalities' : 'municipalities']: fallbackMunicipalities,
        isLoadingMunicipalities: false
      }));
      return;
    }

    try {
      const endpoint = `${baseUrl}/municipalities/${provinceId}/${districtId}/`;
      console.log('Fetching municipalities from:', endpoint);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Municipalities response:', data);
      const municipalities = Array.isArray(data) ? data : (data.results || []);
      
      setLocationData(prev => ({
        ...prev,
        [isTemp ? 'tempMunicipalities' : 'municipalities']: municipalities,
        isLoadingMunicipalities: false
      }));
      
      console.log(`${isTemp ? 'Temp' : ''} Municipalities loaded for district ${districtId}:`, municipalities.length);
    } catch (error) {
      console.error('Error fetching municipalities, using fallback data:', error);
      
      const fallbackMunicipalities = FALLBACK_LOCATION_DATA.municipalities[districtId] || [];
      setLocationData(prev => ({
        ...prev,
        [isTemp ? 'tempMunicipalities' : 'municipalities']: fallbackMunicipalities,
        isLoadingMunicipalities: false
      }));
      
      if (fallbackMunicipalities.length === 0) {
        toast.warning(`जिल्ला ${districtId} का लागि नगरपालिकाहरू उपलब्ध छैन`);
      }
    }
  };

  // Reset location data
  const resetLocationData = (isTemp = false) => {
    if (isTemp) {
      setLocationData(prev => ({
        ...prev,
        tempDistricts: [],
        tempMunicipalities: []
      }));
    } else {
      setLocationData(prev => ({
        ...prev,
        districts: [],
        municipalities: []
      }));
    }
  };

  // Copy permanent address data to temporary
  const copyToTemp = () => {
    setLocationData(prev => ({
      ...prev,
      tempDistricts: prev.districts,
      tempMunicipalities: prev.municipalities
    }));
  };

  // Initialize location data
  const initialize = async () => {
    await fetchProvinces();
  };

  // Reset all data
  const reset = () => {
    setLocationData({
      provinces: [],
      districts: [],
      tempDistricts: [],
      municipalities: [],
      tempMunicipalities: [],
      isLoading: false,
      error: null
    });
  };

  return {
    ...locationData,
    initialize,
    fetchProvinces,
    fetchDistricts, 
    fetchMunicipalities,
    resetLocationData,
    copyToTemp,
    reset
  };
};
