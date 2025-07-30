import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaBuilding, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

// Import optimized hooks
import { useRegistrationForm } from '../../hooks/useRegistrationForm';
import { useLocationAPI } from '../../hooks/useLocationAPI';
import { useOfficeAPI } from '../../hooks/useOfficeAPI';
import { useRegistrationSubmit } from '../../hooks/useRegistrationSubmit';

// Import form components
import PersonalInfoForm from './PersonalInfoForm';
import AddressForm from './AddressForm';
import CitizenshipContactForm from './CitizenshipContactForm';
import OfficeAssignmentForm from './OfficeAssignmentForm';
import EducationAchievementsForm from './EducationAchievementsForm';
import LoanDetailsForm from './LoanDetailsForm';

const MainRegistration = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem('token');
  
  // Form management
  const { 
    formData, 
    errors, 
    handleChange, 
    handleNepaliDateChange,
    validateForm, 
    resetForm, 
    setMultipleFields 
  } = useRegistrationForm();
  
  // API hooks
  const locationAPI = useLocationAPI(baseUrl);
  const officeAPI = useOfficeAPI(baseUrl, token);
  const { isSubmitting, submitError, submitSuccess, handleSubmit: submitRegistration } = useRegistrationSubmit();
  
  // Connection status
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    if (!baseUrl) {
      setConnectionStatus('error');
      toast.error('API कनेक्शन उपलब्ध छैन - BaseURL सेट गरिएको छैन');
      return;
    }
    
    setConnectionStatus('checking');
    try {
      await Promise.all([
        locationAPI.fetchProvinces(),
        officeAPI.fetchOffices()
      ]);
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('error');
      toast.error('डाटा लोड गर्न समस्या भयो');
    }
  };

  // Event handlers
  const handleProvinceChange = (provinceId, isTemp = false) => {
    if (isTemp) {
      setMultipleFields({
        temp_district: '',
        temp_municipality: ''
      });
    } else {
      setMultipleFields({
        perm_district: '',
        perm_municipality: ''
      });
    }
    
    if (provinceId) {
      locationAPI.fetchDistricts(provinceId, isTemp);
    }
  };

  const handleDistrictChange = (districtId, provinceId, isTemp = false) => {
    if (isTemp) {
      setMultipleFields({ temp_municipality: '' });
    } else {
      setMultipleFields({ perm_municipality: '' });
    }
    
    if (districtId && provinceId) {
      locationAPI.fetchMunicipalities(provinceId, districtId, isTemp);
    }
  };

  const handleOfficeChange = (officeId) => {
    const selectedOffice = officeAPI.offices.find(office => office.id == officeId);
    
    setMultipleFields({
      office: officeId,
      department: '',
      faat: ''
    });
    
    if (officeId) {
      officeAPI.fetchDepartments(officeId);
    }
  };

  const handleDepartmentChange = (departmentId) => {
    setMultipleFields({
      department: departmentId,
      faat: ''
    });
    
    if (departmentId) {
      const selectedOffice = officeAPI.offices.find(office => office.id == formData.office);
      if (selectedOffice?.is_head_office) {
        officeAPI.fetchFaats(departmentId);
      }
    }
  };

  const handleCopyAddress = () => {
    const permanentData = {
      temp_state: formData.perm_state,
      temp_district: formData.perm_district,
      temp_municipality: formData.perm_municipality,
      temp_ward_no: formData.perm_ward_no
    };
    
    setMultipleFields(permanentData);
    locationAPI.copyToTemp();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्');
      return;
    }

    await submitRegistration(formData, validateForm, resetForm);
  };

  // Show connection error if API not available
  if (connectionStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-3">API कनेक्शन त्रुटि</h2>
          <p className="text-gray-600 mb-4">सर्भरसँग सम्पर्क गर्न सकिएन। कृपया पछि प्रयास गर्नुहोस्।</p>
          <button
            onClick={initializeData}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaUser className="text-4xl text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">कर्मचारी दर्ता</h1>
          </div>
          <p className="text-lg text-gray-600">
            नयाँ कर्मचारी दर्ता गर्न तलका सबै जानकारी भर्नुहोस्
          </p>
        </div>

        {/* Loading overlay */}
        {(connectionStatus === 'checking' || isSubmitting) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl flex items-center space-x-4">
              <FaSpinner className="animate-spin text-3xl text-blue-600" />
              <div>
                <p className="text-gray-700 font-medium">
                  {connectionStatus === 'checking' ? 'डाटा लोड गर्दै...' : 'दर्ता गर्दै...'}
                </p>
                <p className="text-gray-500 text-sm">कृपया पर्खनुहोस्</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Information */}
          <PersonalInfoForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />

          {/* Address Information */}
          <AddressForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            provinces={locationAPI.provinces}
            districts={locationAPI.districts}
            municipalities={locationAPI.municipalities}
            tempDistricts={locationAPI.tempDistricts}
            tempMunicipalities={locationAPI.tempMunicipalities}
            onProvinceChange={handleProvinceChange}
            onDistrictChange={handleDistrictChange}
            onTempProvinceChange={(provinceId) => handleProvinceChange(provinceId, true)}
            onTempDistrictChange={(districtId) => handleDistrictChange(districtId, formData.temp_state, true)}
            onCopyAddress={handleCopyAddress}
            isLoadingDistricts={locationAPI.isLoadingDistricts}
            isLoadingMunicipalities={locationAPI.isLoadingMunicipalities}
          />

          {/* Citizenship and Contact */}
          <CitizenshipContactForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleNepaliDateChange={handleNepaliDateChange}
            districts={locationAPI.allDistricts}
          />

          {/* Office Assignment */}
          <OfficeAssignmentForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            setMultipleFields={setMultipleFields}
            handleNepaliDateChange={handleNepaliDateChange}
            officeData={{
              offices: officeAPI.offices,
              departments: officeAPI.departments,
              faats: officeAPI.faats,
              isLoading: officeAPI.isLoading,
              error: officeAPI.error,
              handleOfficeChange,
              handleDepartmentChange,
              handleFaatChange: (faatId) => setMultipleFields({ faat: faatId }),
              isHeadOffice: () => {
                const selectedOffice = officeAPI.offices.find(office => office.id == formData.office);
                return selectedOffice?.is_head_office || false;
              },
              getOfficeHierarchyText: () => {
                const office = officeAPI.offices.find(o => o.id == formData.office);
                const department = officeAPI.departments.find(d => d.id == formData.department);
                const faat = officeAPI.faats.find(f => f.id == formData.faat);
                
                let hierarchy = '';
                if (office) hierarchy += office.name;
                if (department) hierarchy += ` → ${department.name}`;
                if (faat) hierarchy += ` → ${faat.name}`;
                
                return hierarchy;
              }
            }}
          />

          {/* Education and Achievements */}
          <EducationAchievementsForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />

          {/* Loan Details */}
          <LoanDetailsForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
          />

          {/* Submit Button */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">दर्ता पूरा गर्नुहोस्</h3>
              <p className="text-gray-600 text-sm mb-6">
                सबै जानकारी सहि छ भनी निश्चित भएपछि दर्ता बटन थिच्नुहोस्
              </p>
              
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
              )}
              
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-700 text-sm">दर्ता सफलतापूर्वक पूरा भयो!</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting || connectionStatus !== 'connected'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-12 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    दर्ता गर्दै...
                  </>
                ) : (
                  'कर्मचारी दर्ता गर्नुहोस्'
                )}
              </button>
            </div>
          </div>

        </form>

        {/* Toast Container */}
        <ToastContainer 
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="text-sm"
        />
      </div>
    </div>
  );
};

export default MainRegistration;
