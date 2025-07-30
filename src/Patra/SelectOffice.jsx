import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOffices } from '../app/patraSlice';

const SelectOffice = ({ 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  loading = false 
}) => {
  const dispatch = useDispatch();
  const { offices } = useSelector(state => state.patra);

  useEffect(() => {
    if (offices.data.length === 0 && !offices.loading) {
      dispatch(fetchOffices());
    }
  }, [dispatch, offices.data.length, offices.loading]);

  // Fallback test data if API isn't ready
  const testOffices = [
    { id: 1, name: 'मुख्य कार्यालय', code: 'MAIN', is_head_office: true },
    { id: 2, name: 'क्षेत्रीय कार्यालय - पूर्व', code: 'REG-E', is_head_office: false },
    { id: 3, name: 'क्षेत्रीय कार्यालय - पश्चिम', code: 'REG-W', is_head_office: false },
    { id: 4, name: 'शाखा कार्यालय - केन्द्रीय', code: 'BR-C', is_head_office: false }
  ];

  const officeList = offices.data.length > 0 ? offices.data : testOffices;
  const isLoading = loading || offices.loading;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        कार्यालय {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${(disabled || isLoading) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        required={required}
      >
        <option value="">
          {isLoading ? 'कार्यालयहरू लोड हुँदैछ...' : 'कार्यालय छान्नुहोस्'}
        </option>
        {officeList.map((office) => (
          <option key={office.id} value={office.id}>
            {office.name} {office.is_head_office ? '(मुख्य कार्यालय)' : ''}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {offices.error && (
        <p className="mt-1 text-sm text-yellow-600">
          कार्यालयहरू लोड गर्न समस्या भयो। परीक्षण डाटा प्रयोग गरिँदै。
        </p>
      )}
    </div>
  );
};

export default SelectOffice;
