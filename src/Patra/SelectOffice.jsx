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
import { fetchOffices } from '../app/patraSlice';

const SelectOffice = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  required = false,
  disabled = false 
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
    { id: 1, name: 'Main Office', code: 'MAIN' },
    { id: 2, name: 'Regional Office - East', code: 'REG-E' },
    { id: 3, name: 'Regional Office - West', code: 'REG-W' },
    { id: 4, name: 'Branch Office - Central', code: 'BR-C' }
  ];

  const officeList = offices.data.length > 0 ? offices.data : testOffices;

  return (
    <FormControl 
      fullWidth 
      error={error}
      disabled={disabled}
      variant="outlined"
    >
      <InputLabel id="office-select-label">
        Office {required && '*'}
      </InputLabel>
      <Select
        labelId="office-select-label"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        label={`Office ${required ? '*' : ''}`}
        displayEmpty
      >
        <MenuItem value="">
          <em>Select an office</em>
        </MenuItem>
        {offices.loading ? (
          <MenuItem disabled>
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={16} />
              Loading offices...
            </Box>
          </MenuItem>
        ) : (
          officeList.map((office) => (
            <MenuItem key={office.id} value={office.id}>
              {office.name} ({office.code})
            </MenuItem>
          ))
        )}
      </Select>
      {(error || helperText) && (
        <FormHelperText>
          {error ? helperText : helperText}
        </FormHelperText>
      )}
      {offices.error && (
        <FormHelperText error>
          Failed to load offices. Using fallback data.
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectOffice;
