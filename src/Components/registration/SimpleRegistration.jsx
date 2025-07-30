import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUser, FaBuilding, FaSpinner, FaCheck, FaPlus, FaInfoCircle } from 'react-icons/fa';

// Import hooks
import { useRegistrationForm } from '../../hooks/useRegistrationForm';
import { useOfficeAPI } from '../../hooks/useOfficeAPI';
import { useRegistrationSubmit } from '../../hooks/useRegistrationSubmit';

// Import form components
import FormField from '../Common/FormField';
import { REGISTRATION_CONSTANTS } from '../../constants/registrationConstants';

const SimpleRegistration = () => {
  const baseUrl = useSelector((state) => state.login?.baseUrl);
  const token = localStorage.getItem('token');
  
  // Form management
  const { 
    formData, 
    errors, 
    handleChange, 
    resetForm, 
    setMultipleFields 
  } = useRegistrationForm();
  
  // API hooks
  const officeAPI = useOfficeAPI(baseUrl, token);
  const { isSubmitting, submitError, submitSuccess, handleSubmit: submitRegistration } = useRegistrationSubmit();
  
  // UI state
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const initializeData = async () => {
    if (!baseUrl) {
      setConnectionStatus('error');
      toast.error('API कनेक्शन उपलब्ध छैन - BaseURL सेट गरिएको छैन');
      return;
    }
    
    if (!token) {
      setConnectionStatus('error');
      toast.error('प्रमाणीकरण टोकन उपलब्ध छैन। कृपया पुनः लगइन गर्नुहोस्।');
      return;
    }
    
    setConnectionStatus('checking');
    try {
      await officeAPI.initialize();
      
      // Check if there was an actual API error (network, auth, etc.)
      if (officeAPI.error && (
        officeAPI.error.includes('Network') || 
        officeAPI.error.includes('fetch') ||
        officeAPI.error.includes('401') ||
        officeAPI.error.includes('403') ||
        officeAPI.error.includes('प्रमाणीकरण') ||
        officeAPI.error.includes('API URL')
      )) {
        // There was an actual API/network error
        setConnectionStatus('error');
        toast.error(`API कनेक्शन समस्या: ${officeAPI.error}`);
      } else {
        // API call was successful - even if data is empty, that's valid
        setConnectionStatus('connected');
        
        // Only show info about empty data if it's truly empty and no error occurred
        if (officeAPI.offices && officeAPI.offices.length === 0 && !officeAPI.error) {
          console.info('No offices found in database - this is valid but may need admin attention');
        }
      }
    } catch (error) {
      setConnectionStatus('error');
      // Only show toast for critical initialization errors
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        toast.error(`डाटा लोड गर्दा समस्या: ${error.message}`);
      }
    }
  };

  // Initialize data on mount and when baseUrl changes
  useEffect(() => {
    initializeData();
  }, [baseUrl]);

  // Handle office changes
  const handleOfficeChange = (officeId) => {
    const selectedOffice = officeAPI.offices.find(office => office.id == officeId);
    
    setMultipleFields({
      office: officeId,
      department: '',
      faat: ''
    });
    
    if (officeId) {
      officeAPI.fetchDepartments(officeId).then(() => {
        // Departments loaded successfully
      }).catch(error => {
        toast.error('विभागहरू लोड गर्न समस्या भयो');
      });
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
        officeAPI.fetchFaats(departmentId).then(() => {
          // Faats loaded successfully
        }).catch(error => {
          toast.error('फाँटहरू लोड गर्न समस्या भयो');
        });
      }
    }
  };

  // Validate essential fields only
  const validateEssentialFields = () => {
    const requiredFields = [
      'first_name', 
      'last_name', 
      'email', 
      'username', 
      'password', 
      'user_type', 
      'office', 
      'department'
    ];
    
    // Add faat if it's a head office
    const selectedOffice = officeAPI.offices.find(office => office.id == formData.office);
    if (selectedOffice?.is_head_office) {
      requiredFields.push('faat');
    }
    
    const missingFields = [];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        missingFields.push(getFieldLabel(field));
      }
    }
    
    if (missingFields.length > 0) {
      toast.error(`कृपया यी फिल्डहरू भर्नुहोस्: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const getFieldLabel = (field) => {
    const labels = {
      first_name: 'पहिलो नाम',
      last_name: 'अन्तिम नाम',
      username: 'प्रयोगकर्ता नाम',
      password: 'पासवर्ड',
      email: 'इमेल',
      office: 'कार्यालय',
      department: 'विभाग',
      faat: 'फाँट',
      user_type: 'प्रयोगकर्ता प्रकार'
    };
    return labels[field] || field;
  };

  // Handle essential registration submission
  const handleEssentialSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEssentialFields()) {
      return;
    }

    // Create minimal submission data
    const essentialData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      username: formData.username,
      password: formData.password,
      user_type: parseInt(formData.user_type),
      office: parseInt(formData.office),
      department: parseInt(formData.department),
      ...(formData.faat && { faat: parseInt(formData.faat) })
    };

    const success = await submitRegistration(essentialData, () => true, () => {});
    if (success) {
      setIsRegistered(true);
      toast.success('कर्मचारी सफलतापूर्वक दर्ता भयो! चाहेमा अतिरिक्त जानकारी थप्न सक्नुहुन्छ।');
    }
  };

  // Handle complete registration with additional details
  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    
    // Submit complete form data
    await submitRegistration(formData, () => true, resetForm);
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm('के तपाईं सबै जानकारी रिसेट गर्न चाहनुहुन्छ?')) {
      resetForm();
      officeAPI.reset();
      setIsRegistered(false);
      setShowMoreDetails(false);
    }
  };

  // Show connection error
  if (connectionStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f9f1ea] via-white to-[#fcf8f5] py-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-orange-200">
          <FaInfoCircle className="text-6xl text-[#E68332] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#E68332] mb-3">API कनेक्शन त्रुटि</h2>
          <p className="text-gray-600 mb-4">सर्भरसँग सम्पर्क गर्न सकिएन। कृपया पछि प्रयास गर्नुहोस्।</p>
          <button
            onClick={initializeData}
            className="bg-[#E68332] text-white px-6 py-2 rounded-lg hover:bg-[#c36f2a] transition-colors"
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#E68332] to-[#c36f2a] bg-clip-text text-transparent mb-3">
          कर्मचारी दर्ता फारम
        </h1>
        {!isRegistered ? (
          <p className="text-gray-600 text-lg">
            कृपया आधारभूत जानकारी भर्नुहोस् (अन्य विवरण पछि थप्न सकिन्छ)
          </p>
        ) : (
          <p className="text-green-600 text-lg">
            ✅ दर्ता सफल भयो! चाहेमा अतिरिक्त जानकारी थप्नुहोस्
          </p>
        )}
      </div>

      {/* Error Display */}
      {submitError && (
        <div className="mb-6 bg-orange-50 border-l-4 border-[#E68332] p-6 rounded-xl shadow-md">
          <div className="flex">
            <FaInfoCircle className="text-[#E68332] mt-1 mr-3 text-lg" />
            <div>
              <h3 className="text-[#E68332] font-bold text-lg">त्रुटि भयो</h3>
              <p className="text-[#E68332] mt-1">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Display */}
      {submitSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-[#E68332] p-6 rounded-xl shadow-md">
          <div className="flex">
            <FaCheck className="text-[#E68332] mt-1 mr-3 text-lg" />
            <div>
              <h3 className="text-[#E68332] font-bold text-lg">सफल भयो!</h3>
              <p className="text-[#E68332] mt-1">कर्मचारी दर्ता सफलतापूर्वक पूरा भयो</p>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={isRegistered && showMoreDetails ? handleCompleteSubmit : handleEssentialSubmit} className="space-y-8">
        
        {/* Essential Information */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-[#E68332]/30">
          <div className="flex items-center mb-6">
            <FaUser className="text-2xl text-[#E68332] mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">
              {isRegistered ? '✅ आधारभूत जानकारी (दर्ता भइसकेको)' : 'आधारभूत जानकारी'}
            </h3>
          </div>
          
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.FIRST_NAME}
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              error={errors.first_name}
              required
              disabled={isRegistered}
              placeholder="पहिलो नाम"
            />
            
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.LAST_NAME}
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              error={errors.last_name}
              required
              disabled={isRegistered}
              placeholder="अन्तिम नाम"
            />
          </div>

          <div className="mb-6">
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.EMAIL}
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              error={errors.email}
              required
              disabled={isRegistered}
              placeholder="इमेल ठेगाना"
            />
          </div>

          {/* Login Credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.USERNAME}
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              error={errors.username}
              required
              disabled={isRegistered}
              placeholder="प्रयोगकर्ता नाम"
            />
            
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.PASSWORD}
              name="password"
              type="password"
              value={formData.password || ''}
              onChange={handleChange}
              error={errors.password}
              required
              disabled={isRegistered}
              placeholder="पासवर्ड"
            />
          </div>

          {/* User Level */}
          <div className="mb-6">
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.USER_TYPE}
              name="user_type"
              type="select"
              value={formData.user_type || ''}
              onChange={handleChange}
              options={REGISTRATION_CONSTANTS.USER_TYPES}
              error={errors.user_type}
              required
              disabled={isRegistered}
              placeholder="प्रयोगकर्ता प्रकार छान्नुहोस्"
            />
          </div>
        </div>

        {/* Office Assignment */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-[#E68332]/30">
          <div className="flex items-center mb-6">
            <FaBuilding className="text-2xl text-[#E68332] mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">कार्यालय नियुक्ति</h3>
          </div>

          {/* Loading Display */}
          {officeAPI.isLoading && (
            <div className="mb-4 p-4 bg-orange-50 border border-[#E68332]/40 rounded-lg flex items-center">
              <FaSpinner className="animate-spin text-[#E68332] mr-2" />
              <p className="text-[#E68332]">कार्यालय डाटा लोड गर्दै...</p>
            </div>
          )}

          {/* Error Display */}
          {officeAPI.error && (
            <div className="mb-4 p-4 bg-orange-50 border border-[#E68332]/40 rounded-lg flex items-center">
              <FaInfoCircle className="text-[#E68332] mr-2" />
              <p className="text-[#E68332]">{officeAPI.error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.OFFICE}
              name="office"
              type="select"
              value={formData.office || ''}
              onChange={(e) => {
                handleChange(e);
                handleOfficeChange(e.target.value);
              }}
              options={(officeAPI.offices || []).map(o => ({ 
                value: o.id, 
                label: `${o.name} ${o.is_head_office ? '(मुख्य कार्यालय)' : ''}` 
              }))}
              error={errors.office}
              required
              disabled={isRegistered}
              placeholder="कार्यालय छान्नुहोस्"
            />
            
            <FormField
              label={REGISTRATION_CONSTANTS.LABELS.DEPARTMENT}
              name="department"
              type="select"
              value={formData.department || ''}
              onChange={(e) => {
                handleChange(e);
                handleDepartmentChange(e.target.value);
              }}
              options={(officeAPI.departments || []).map(d => ({ value: d.id, label: d.name }))}
              error={errors.department}
              required
              disabled={!formData.office || isRegistered}
              placeholder="विभाग छान्नुहोस्"
            />
          </div>

          {/* Show Faat only for head offices */}
          {(() => {
            const selectedOffice = officeAPI.offices.find(office => office.id == formData.office);
            return selectedOffice?.is_head_office && (
              <div className="mt-6">
                <FormField
                  label={REGISTRATION_CONSTANTS.LABELS.FAAT}
                  name="faat"
                  type="select"
                  value={formData.faat || ''}
                  onChange={handleChange}
                  options={(officeAPI.faats || []).map(f => ({ value: f.id, label: f.name }))}
                  error={errors.faat}
                  required
                  disabled={!formData.department || isRegistered}
                  placeholder="फाँट छान्नुहोस्"
                />
              </div>
            );
          })()}

          {/* Office hierarchy display */}
          {(() => {
            const office = officeAPI.offices.find(o => o.id == formData.office);
            const department = officeAPI.departments.find(d => d.id == formData.department);
            const faat = officeAPI.faats.find(f => f.id == formData.faat);
            
            let hierarchy = '';
            if (office) hierarchy += office.name;
            if (department) hierarchy += ` → ${department.name}`;
            if (faat) hierarchy += ` → ${faat.name}`;
            
            return hierarchy && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>चयनित कार्यालय श्रृंखला:</strong> {hierarchy}
                </p>
              </div>
            );
          })()}
        </div>

        {/* More Details Section - Only show if requested */}
        {showMoreDetails && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <FaPlus className="text-2xl text-[#E68332] mr-3" />
              <h3 className="text-2xl font-bold text-gray-800">अतिरिक्त जानकारी (वैकल्पिक)</h3>
            </div>

            {/* Extended Personal Info */}
            <div className="mb-8">
            <h4 className="text-lg font-semibold text-[#E68332] mb-4">थप व्यक्तिगत जानकारी</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label={REGISTRATION_CONSTANTS.LABELS.FATHER_NAME}
                  name="father_name"
                  value={formData.father_name || ''}
                  onChange={handleChange}
                  error={errors.father_name}
                  placeholder="बुबाको नाम"
                />
                
                <FormField
                  label={REGISTRATION_CONSTANTS.LABELS.MOTHER_NAME}
                  name="mother_name"
                  value={formData.mother_name || ''}
                  onChange={handleChange}
                  error={errors.mother_name}
                  placeholder="आमाको नाम"
                />
                
                <FormField
                  label={REGISTRATION_CONSTANTS.LABELS.GRANDFATHER_NAME}
                  name="grand_father_name"
                  value={formData.grand_father_name || ''}
                  onChange={handleChange}
                  error={errors.grand_father_name}
                  placeholder="हजुरबुबाको नाम"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
            <h4 className="text-lg font-semibold text-[#E68332] mb-4">सम्पर्क जानकारी</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label={REGISTRATION_CONSTANTS.LABELS.MOBILE_NUMBER}
                  name="mobile_number"
                  value={formData.mobile_number || ''}
                  onChange={handleChange}
                  error={errors.mobile_number}
                  placeholder="मोबाइल नम्बर"
                />
                
                <FormField
                  label={REGISTRATION_CONSTANTS.LABELS.PHONE_NUMBER}
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  error={errors.phone_number}
                  placeholder="फोन नम्बर"
                />
              </div>
            </div>

            {/* Citizenship Info */}
            <div className="mb-8">
            <h4 className="text-lg font-semibold text-[#E68332] mb-4">नागरिकता जानकारी</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label={REGISTRATION_CONSTANTS.LABELS.CITIZENSHIP_ID}
                  name="citizenship_id"
                  value={formData.citizenship_id || ''}
                  onChange={handleChange}
                  error={errors.citizenship_id}
                  placeholder="नागरिकता नम्बर"
                />
                
                <FormField
                  label={REGISTRATION_CONSTANTS.LABELS.EMPLOYEE_ID}
                  name="employee_id"
                  value={formData.employee_id || ''}
                  onChange={handleChange}
                  error={errors.employee_id}
                  placeholder="कर्मचारी आईडी"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-[#E68332]/30">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleReset}
            className="px-6 py-3 bg-[#E68332]/80 text-white rounded-lg hover:bg-[#E68332] transition-colors"
            >
              रिसेट गर्नुहोस्
            </button>

            {isRegistered && !showMoreDetails && (
              <button
                type="button"
                onClick={() => setShowMoreDetails(true)}
                className="px-6 py-3 bg-[#E68332]/60 text-white rounded-lg hover:bg-[#E68332] transition-colors flex items-center gap-2"
              >
                <FaPlus />
                अतिरिक्त जानकारी थप्नुहोस्
              </button>
            )}
          </div>

          {!isRegistered && (
            <button
              type="submit"
              disabled={isSubmitting || connectionStatus === 'checking'}
              className={`px-8 py-3 text-white font-medium rounded-lg flex items-center gap-2 transition-all ${
                isSubmitting || connectionStatus === 'checking' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#E68332] hover:bg-[#c36f2a]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  दर्ता गर्दै...
                </>
              ) : (
                <>
                  <FaCheck />
                  दर्ता गर्नुहोस्
                </>
              )}
            </button>
          )}

          {isRegistered && showMoreDetails && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 text-white font-medium rounded-lg flex items-center gap-2 transition-all ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#E68332] hover:bg-[#c36f2a]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  अपडेट गर्दै...
                </>
              ) : (
                <>
                  <FaCheck />
                  अतिरिक्त जानकारी सुरक्षित गर्नुहोस्
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Global Loading Overlay */}
      {(connectionStatus === 'checking' || officeAPI.isLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex items-center space-x-4">
            <FaSpinner className="animate-spin text-2xl text-[#E68332]" />
            <div>
              <p className="text-[#E68332] font-medium">डाटा लोड गर्दै...</p>
              <p className="text-gray-500 text-sm">कृपया पर्खनुहोस्</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleRegistration;
