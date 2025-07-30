import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartmentsByOffice } from '../../app/patraSlice';

const SelectDepartment = ({ 
  officeId,
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  loading = false 
}) => {
  const dispatch = useDispatch();
  const { departments } = useSelector(state => state.patra);

  useEffect(() => {
    if (officeId) {
      dispatch(fetchDepartmentsByOffice(officeId));
    }
  }, [dispatch, officeId]);

  // Fallback test data if API isn't ready
  const testDepartments = {
    1: [ // Main Office
      { id: 1, name: 'प्रशासन', code: 'ADMIN' },
      { id: 2, name: 'वित्त', code: 'FIN' },
      { id: 3, name: 'मानव संसाधन', code: 'HR' }
    ],
    2: [ // Regional Office - East
      { id: 4, name: 'सञ्चालन', code: 'OPS' },
      { id: 5, name: 'ग्राहक सेवा', code: 'CS' }
    ],
    3: [ // Regional Office - West
      { id: 6, name: 'मार्केटिङ', code: 'MKT' },
      { id: 7, name: 'बिक्री', code: 'SALES' }
    ],
    4: [ // Branch Office - Central
      { id: 8, name: 'सहयोग', code: 'SUP' },
      { id: 9, name: 'तालिम', code: 'TRN' }
    ]
  };

  // Handle both array and nested object responses from API
  let departmentList = [];
  if (departments.data && Array.isArray(departments.data)) {
    departmentList = departments.data;
  } else if (departments.data && departments.data.departments) {
    departmentList = departments.data.departments;
  } else if (testDepartments[officeId]) {
    departmentList = testDepartments[officeId];
  }

  const isDisabled = disabled || !officeId;
  const isLoading = loading || departments.loading;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        विभाग {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={isDisabled || isLoading}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${(isDisabled || isLoading) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        required={required}
      >
        <option value="">
          {!officeId
            ? 'पहिले कार्यालय छान्नुहोस्'
            : isLoading
            ? 'विभागहरू लोड हुँदैछ...'
            : 'विभाग छान्नुहोस्'}
        </option>
        {departmentList.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {officeId && departmentList.length === 0 && !isLoading && (
        <p className="mt-1 text-sm text-yellow-600">
          यस कार्यालयमा कुनै विभाग उपलब्ध छैन
        </p>
      )}
      {departments.error && officeId && (
        <p className="mt-1 text-sm text-yellow-600">
          विभागहरू लोड गर्न समस्या भयो। परीक्षण डाटा प्रयोग गरिँदै。
        </p>
      )}
    </div>
  );
};

export default SelectDepartment;