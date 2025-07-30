import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Divider,
  TextField
} from '@mui/material';
import {
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { setFilters, clearFilters } from '../../app/patraSlice';

const PatraFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.patra);
  
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));
  };

  const handleDateChange = (field, value) => {
    if (field === 'from') {
      setDateFrom(value);
    } else {
      setDateTo(value);
    }
    
    const dateRange = {
      from: field === 'from' ? value : dateFrom,
      to: field === 'to' ? value : dateTo
    };
    
    dispatch(setFilters({ dateRange }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setDateFrom(null);
    setDateTo(null);
  };

  return (
    <Paper sx={{ p: 2, height: 'fit-content' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1, color: '#E68332' }} />
        <Typography variant="h6" sx={{ color: '#E68332', fontWeight: 'bold' }}>
          फिल्टरहरू
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Status Filter */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>स्थिति</InputLabel>
        <Select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          label="स्थिति"
          size="small"
        >
          <MenuItem value="">सबै</MenuItem>
          <MenuItem value="unread">नपढिएको</MenuItem>
          <MenuItem value="read">पढिएको</MenuItem>
          <MenuItem value="replied">जवाफ दिइएको</MenuItem>
          <MenuItem value="forwarded">फर्वार्ड गरिएको</MenuItem>
        </Select>
      </FormControl>

      {/* Priority Filter */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>प्राथमिकता</InputLabel>
        <Select
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          label="प्राथमिकता"
          size="small"
        >
          <MenuItem value="">सबै</MenuItem>
          <MenuItem value="normal">सामान्य</MenuItem>
          <MenuItem value="medium">मध्यम</MenuItem>
          <MenuItem value="high">उच्च</MenuItem>
          <MenuItem value="urgent">अति जरुरी</MenuItem>
        </Select>
      </FormControl>

      {/* Sender Filter */}
      <TextField
        fullWidth
        label="पठाउने व्यक्ति"
        value={filters.sender || ''}
        onChange={(e) => handleFilterChange('sender', e.target.value)}
        size="small"
        sx={{ mb: 2 }}
        placeholder="नाम खोज्नुहोस्"
      />

      {/* Department Filter */}
      <TextField
        fullWidth
        label="विभाग"
        value={filters.department || ''}
        onChange={(e) => handleFilterChange('department', e.target.value)}
        size="small"
        sx={{ mb: 2 }}
        placeholder="विभाग खोज्नुहोस्"
      />

      {/* Date Range Filter */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          मिति दायरा
        </Typography>
        
        <DatePicker
          label="देखि"
          value={dateFrom}
          onChange={(value) => handleDateChange('from', value)}
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth sx={{ mb: 1 }} />
          )}
        />
        
        <DatePicker
          label="सम्म"
          value={dateTo}
          onChange={(value) => handleDateChange('to', value)}
          renderInput={(params) => (
            <TextField {...params} size="small" fullWidth sx={{ mb: 2 }} />
          )}
        />
      </LocalizationProvider>

      {/* Clear Filters Button */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={handleClearFilters}
        sx={{
          borderColor: '#E68332',
          color: '#E68332',
          '&:hover': {
            borderColor: '#c36f2a',
            backgroundColor: 'rgba(230, 131, 50, 0.04)'
          }
        }}
      >
        फिल्टर हटाउनुहोस्
      </Button>
    </Paper>
  );
};

export default PatraFilters;
