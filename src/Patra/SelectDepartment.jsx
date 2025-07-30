import React, { useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  CircularProgress,
  Box 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartmentsByOffice } from '../app/patraSlice';

const SelectDepartment = ({ 
  officeId,
  value, 
  onChange, 
  error, 
  helperText, 
  required = false,
  disabled = false 
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
      { id: 1, name: 'Administration', code: 'ADMIN' },
      { id: 2, name: 'Finance', code: 'FIN' },
      { id: 3, name: 'Human Resources', code: 'HR' }
    ],
    2: [ // Regional Office - East
      { id: 4, name: 'Operations', code: 'OPS' },
      { id: 5, name: 'Customer Service', code: 'CS' }
    ],
    3: [ // Regional Office - West
      { id: 6, name: 'Marketing', code: 'MKT' },
      { id: 7, name: 'Sales', code: 'SALES' }
    ],
    4: [ // Branch Office - Central
      { id: 8, name: 'Support', code: 'SUP' },
      { id: 9, name: 'Training', code: 'TRN' }
    ]
  };

  const departmentList = departments.data.length > 0 
    ? departments.data 
    : (testDepartments[officeId] || []);

  const isDisabled = disabled || !officeId;

  return (
    <FormControl 
      fullWidth 
      error={error}
      disabled={isDisabled}
      variant="outlined"
    >
      <InputLabel id="department-select-label">
        Department {required && '*'}
      </InputLabel>
      <Select
        labelId="department-select-label"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label={`Department ${required ? '*' : ''}`}
        displayEmpty
      >
        <MenuItem value="">
          <em>
            {!officeId 
              ? 'Select an office first' 
              : 'Select a department'
            }
          </em>
        </MenuItem>
        {departments.loading ? (
          <MenuItem disabled>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              Loading departments...
            </Box>
          </MenuItem>
        ) : departmentList.length === 0 && officeId ? (
          <MenuItem disabled>
            <em>No departments available</em>
          </MenuItem>
        ) : (
          departmentList.map((department) => (
            <MenuItem key={department.id} value={department.id}>
              {department.name} ({department.code})
            </MenuItem>
          ))
        )}
      </Select>
      {(error || helperText) && (
        <FormHelperText>
          {error ? helperText : helperText}
        </FormHelperText>
      )}
      {departments.error && officeId && (
        <FormHelperText error>
          Failed to load departments. Using fallback data.
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectDepartment;
