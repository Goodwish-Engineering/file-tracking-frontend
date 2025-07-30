import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks for API calls
export const fetchInboxPatras = createAsyncThunk(
  'patra/fetchInbox',
  async ({ page = 1, filters = {} }, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        ...filters
      });
      
      const response = await fetch(`${login.baseUrl}/patra/inbox/?${params}`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch inbox patras');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSentPatras = createAsyncThunk(
  'patra/fetchSent',
  async ({ page = 1, filters = {} }, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        ...filters
      });
      
      const response = await fetch(`${login.baseUrl}/patra/sent/?${params}`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sent patras');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatraById = createAsyncThunk(
  'patra/fetchById',
  async (patraId, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${login.baseUrl}/patra/${patraId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patra details');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatraTracking = createAsyncThunk(
  'patra/fetchTracking',
  async (patraId, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${login.baseUrl}/patra/${patraId}/tracking/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patra tracking');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendPatra = createAsyncThunk(
  'patra/send',
  async (patraData, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      
      // Handle FormData for file uploads
      const isFormData = patraData instanceof FormData;
      
      const response = await fetch(`${login.baseUrl}/patra/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        },
        body: isFormData ? patraData : JSON.stringify(patraData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send patra');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markPatraAsRead = createAsyncThunk(
  'patra/markAsRead',
  async (patraId, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${login.baseUrl}/patra/${patraId}/mark-read/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark patra as read');
      }
      
      return { patraId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const transferPatra = createAsyncThunk(
  'patra/transfer',
  async ({ patraId, transferData }, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${login.baseUrl}/patra/${patraId}/transfer/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transferData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to transfer patra');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOffices = createAsyncThunk(
  'patra/fetchOffices',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${login.baseUrl}/offices/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch offices');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDepartmentsByOffice = createAsyncThunk(
  'patra/fetchDepartmentsByOffice',
  async (officeId, { getState, rejectWithValue }) => {
    try {
      const { login } = getState();
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${login.baseUrl}/offices/${officeId}/departments/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  inbox: {
    patras: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0
    }
  },
  sent: {
    patras: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0
    }
  },
  currentPatra: null,
  currentPatraLoading: false,
  currentPatraError: null,
  tracking: {
    data: null,
    loading: false,
    error: null
  },
  sending: false,
  sendError: null,
  transferring: false,
  transferError: null,
  filters: {
    search: '',
    status: '',
    priority: '',
    dateRange: null,
    sender: '',
    department: ''
  },
  unreadCount: 0,
  offices: {
    data: [],
    loading: false,
    error: null
  },
  departments: {
    data: [],
    loading: false,
    error: null
  }
};

const patraSlice = createSlice({
  name: 'patra',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    markAsRead: (state, action) => {
      const patraId = action.payload;
      // Update inbox patras
      const inboxPatra = state.inbox.patras.find(p => p.id === patraId);
      if (inboxPatra && inboxPatra.status === 'received') {
        inboxPatra.status = 'read';
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      // Update current patra
      if (state.currentPatra && state.currentPatra.id === patraId) {
        state.currentPatra.status = 'read';
      }
    },
    clearCurrentPatra: (state) => {
      state.currentPatra = null;
      state.currentPatraError = null;
    },
    clearTracking: (state) => {
      state.tracking.data = null;
      state.tracking.error = null;
    },
    clearErrors: (state) => {
      state.inbox.error = null;
      state.sent.error = null;
      state.currentPatraError = null;
      state.sendError = null;
      state.transferError = null;
      state.tracking.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Inbox
      .addCase(fetchInboxPatras.pending, (state) => {
        state.inbox.loading = true;
        state.inbox.error = null;
      })
      .addCase(fetchInboxPatras.fulfilled, (state, action) => {
        state.inbox.loading = false;
        state.inbox.patras = action.payload.data || [];
        state.inbox.pagination = {
          currentPage: action.payload.current_page || 1,
          totalPages: action.payload.total_pages || 1,
          totalItems: action.payload.total_items || 0
        };
        // Calculate unread count from response
        state.unreadCount = state.inbox.patras.filter(p => p.status === 'received').length;
      })
      .addCase(fetchInboxPatras.rejected, (state, action) => {
        state.inbox.loading = false;
        state.inbox.error = action.payload;
      })
      
      // Fetch Sent
      .addCase(fetchSentPatras.pending, (state) => {
        state.sent.loading = true;
        state.sent.error = null;
      })
      .addCase(fetchSentPatras.fulfilled, (state, action) => {
        state.sent.loading = false;
        state.sent.patras = action.payload.data || [];
        state.sent.pagination = {
          currentPage: action.payload.current_page || 1,
          totalPages: action.payload.total_pages || 1,
          totalItems: action.payload.total_items || 0
        };
      })
      .addCase(fetchSentPatras.rejected, (state, action) => {
        state.sent.loading = false;
        state.sent.error = action.payload;
      })
      
      // Fetch Patra by ID
      .addCase(fetchPatraById.pending, (state) => {
        state.currentPatraLoading = true;
        state.currentPatraError = null;
      })
      .addCase(fetchPatraById.fulfilled, (state, action) => {
        state.currentPatraLoading = false;
        state.currentPatra = action.payload;
      })
      .addCase(fetchPatraById.rejected, (state, action) => {
        state.currentPatraLoading = false;
        state.currentPatraError = action.payload;
      })
      
      // Fetch Patra Tracking
      .addCase(fetchPatraTracking.pending, (state) => {
        state.tracking.loading = true;
        state.tracking.error = null;
      })
      .addCase(fetchPatraTracking.fulfilled, (state, action) => {
        state.tracking.loading = false;
        state.tracking.data = action.payload;
      })
      .addCase(fetchPatraTracking.rejected, (state, action) => {
        state.tracking.loading = false;
        state.tracking.error = action.payload;
      })
      
      // Send Patra
      .addCase(sendPatra.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })
      .addCase(sendPatra.fulfilled, (state, action) => {
        state.sending = false;
        // Add to sent patras
        state.sent.patras.unshift(action.payload);
      })
      .addCase(sendPatra.rejected, (state, action) => {
        state.sending = false;
        state.sendError = action.payload;
      })
      
      // Transfer Patra
      .addCase(transferPatra.pending, (state) => {
        state.transferring = true;
        state.transferError = null;
      })
      .addCase(transferPatra.fulfilled, (state, action) => {
        state.transferring = false;
        // Update current patra with transfer info
        if (state.currentPatra) {
          state.currentPatra.transfer_history = [
            ...(state.currentPatra.transfer_history || []),
            action.payload
          ];
        }
      })
      .addCase(transferPatra.rejected, (state, action) => {
        state.transferring = false;
        state.transferError = action.payload;
      })
      
      // Mark as Read
      .addCase(markPatraAsRead.fulfilled, (state, action) => {
        const patraId = action.payload.patraId;
        // Update inbox patras
        const inboxPatra = state.inbox.patras.find(p => p.id === patraId);
        if (inboxPatra && inboxPatra.status === 'received') {
          inboxPatra.status = 'read';
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        // Update current patra
        if (state.currentPatra && state.currentPatra.id === patraId) {
          state.currentPatra.status = 'read';
        }
      })
      
      // Fetch Offices
      .addCase(fetchOffices.pending, (state) => {
        state.offices.loading = true;
        state.offices.error = null;
      })
      .addCase(fetchOffices.fulfilled, (state, action) => {
        state.offices.loading = false;
        state.offices.data = action.payload.data || action.payload;
      })
      .addCase(fetchOffices.rejected, (state, action) => {
        state.offices.loading = false;
        state.offices.error = action.payload;
      })
      
      // Fetch Departments by Office
      .addCase(fetchDepartmentsByOffice.pending, (state) => {
        state.departments.loading = true;
        state.departments.error = null;
      })
      .addCase(fetchDepartmentsByOffice.fulfilled, (state, action) => {
        state.departments.loading = false;
        state.departments.data = action.payload.data || action.payload;
      })
      .addCase(fetchDepartmentsByOffice.rejected, (state, action) => {
        state.departments.loading = false;
        state.departments.error = action.payload;
      })
  }
});

export const { 
  setFilters, 
  clearFilters, 
  markAsRead, 
  clearCurrentPatra, 
  clearTracking,
  clearErrors 
} = patraSlice.actions;

export default patraSlice.reducer;
