import React from 'react';
import FormField from '../Common/FormField';
import { REGISTRATION_CONSTANTS } from '../../constants/registrationConstants';
import { FaMapMarkerAlt, FaCopy, FaSpinner } from 'react-icons/fa';

const AddressForm = ({ 
  formData, 
  errors, 
  handleChange,
  provinces = [],
  districts = [],
  municipalities = [],
  tempDistricts = [],
  tempMunicipalities = [],
  onProvinceChange = () => {},
  onDistrictChange = () => {},
  onTempProvinceChange = () => {},
  onTempDistrictChange = () => {},
  onCopyAddress,
  isLoadingDistricts = false,
  isLoadingMunicipalities = false
}) => {
  
  const handleCopyPermanentToTemp = () => {
    if (onCopyAddress) {
      onCopyAddress();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 transition-all duration-200 hover:shadow-xl">
      <div className="flex items-center mb-6">
        <FaMapMarkerAlt className="text-2xl text-orange-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-800">ठेगाना विवरण</h3>
      </div>
      
      {/* Debug: Show province count */}
      {provinces.length > 0 && (
        <div className="mb-4 p-2 bg-green-50 rounded text-sm text-green-700">
          {provinces.length} प्रदेशहरू उपलब्ध छन्
        </div>
      )}
      
      {/* Permanent Address */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-blue-600 mr-3"></div>
          <h4 className="text-lg font-semibold text-blue-600">
            {REGISTRATION_CONSTANTS.LABELS.PERMANENT_ADDRESS}
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.PROVINCE}
            name="perm_state"
            type="select"
            value={formData.perm_state || ''}
            onChange={(e) => {
              handleChange(e);
              onProvinceChange(e.target.value);
            }}
            options={provinces.map(p => ({ 
              value: p.id, 
              label: p.name || p.name_en || `Province ${p.id}` 
            }))}
            error={errors.perm_state}
            required
            placeholder="प्रदेश छान्नुहोस्"
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.DISTRICT}
            name="perm_district"
            type="select"
            value={formData.perm_district || ''}
            onChange={(e) => {
              handleChange(e);
              onDistrictChange(e.target.value);
            }}
            options={districts.map(d => ({ value: d.id, label: d.name }))}
            error={errors.perm_district}
            required
            disabled={!formData.perm_state || isLoadingDistricts}
            placeholder={isLoadingDistricts ? "लोड गर्दै..." : "जिल्ला छान्नुहोस्"}
            icon={isLoadingDistricts ? <FaSpinner className="animate-spin" /> : null}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.MUNICIPALITY}
            name="perm_municipality"
            type="select"
            value={formData.perm_municipality || ''}
            onChange={handleChange}
            options={municipalities.map(m => ({ value: m.id, label: m.name }))}
            error={errors.perm_municipality}
            required
            disabled={!formData.perm_district || isLoadingMunicipalities}
            placeholder={isLoadingMunicipalities ? "लोड गर्दै..." : "नगरपालिका छान्नुहोस्"}
            icon={isLoadingMunicipalities ? <FaSpinner className="animate-spin" /> : null}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.WARD_NO}
            name="perm_ward_no"
            type="number"
            value={formData.perm_ward_no || ''}
            onChange={handleChange}
            error={errors.perm_ward_no}
            required
            placeholder="वार्ड नं."
            min="1"
            max="35"
          />
        </div>
      </div>

      {/* Copy Address Button */}
      <div className="mb-8 flex justify-center">
        <button
          type="button"
          onClick={handleCopyPermanentToTemp}
          disabled={!formData.perm_state || !formData.perm_district || !formData.perm_municipality}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <FaCopy className="mr-2" />
          स्थायी ठेगाना अस्थायीमा कपी गर्नुहोस्
        </button>
      </div>

      {/* Temporary Address */}
      <div>
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-green-600 mr-3"></div>
          <h4 className="text-lg font-semibold text-green-600">
            {REGISTRATION_CONSTANTS.LABELS.TEMPORARY_ADDRESS}
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.PROVINCE}
            name="temp_state"
            type="select"
            value={formData.temp_state || ''}
            onChange={(e) => {
              handleChange(e);
              onTempProvinceChange(e.target.value);
            }}
            options={provinces.map(p => ({ value: p.id, label: p.name }))}
            error={errors.temp_state}
            placeholder="प्रदेश छान्नुहोस्"
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.DISTRICT}
            name="temp_district"
            type="select"
            value={formData.temp_district || ''}
            onChange={(e) => {
              handleChange(e);
              onTempDistrictChange(e.target.value);
            }}
            options={(tempDistricts || districts).map(d => ({ value: d.id, label: d.name }))}
            error={errors.temp_district}
            disabled={!formData.temp_state || isLoadingDistricts}
            placeholder={isLoadingDistricts ? "लोड गर्दै..." : "जिल्ला छान्नुहोस्"}
            icon={isLoadingDistricts ? <FaSpinner className="animate-spin" /> : null}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.MUNICIPALITY}
            name="temp_municipality"
            type="select"
            value={formData.temp_municipality || ''}
            onChange={handleChange}
            options={(tempMunicipalities || municipalities).map(m => ({ value: m.id, label: m.name }))}
            error={errors.temp_municipality}
            disabled={!formData.temp_district || isLoadingMunicipalities}
            placeholder={isLoadingMunicipalities ? "लोड गर्दै..." : "नगरपालिका छान्नुहोस्"}
            icon={isLoadingMunicipalities ? <FaSpinner className="animate-spin" /> : null}
          />
          
          <FormField
            label={REGISTRATION_CONSTANTS.LABELS.WARD_NO}
            name="temp_ward_no"
            type="number"
            value={formData.temp_ward_no || ''}
            onChange={handleChange}
            error={errors.temp_ward_no}
            placeholder="वार्ड नं."
            min="1"
            max="35"
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>सहायता:</strong> पहिले स्थायी ठेगाना भर्नुहोस्, त्यसपछि "कपी गर्नुहोस्" बटन दबाएर अस्थायी ठेगानामा प्रतिलिपि गर्न सक्नुहुन्छ।
          यदि अस्थायी ठेगाना फरक छ भने हस्तचालित रूपमा परिवर्तन गर्नुहोस्।
        </p>
      </div>
    </div>
  );
};

export default AddressForm;
