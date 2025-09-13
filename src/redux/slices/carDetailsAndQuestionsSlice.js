import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch vehicle details
export const fetchVehicleDetails = createAsyncThunk(
  'carDetailsAndQuestions/fetchVehicleDetails',
  async ({vin, zip}, { rejectWithValue }) => {
    try {
        console.log(vin, zip)
      const response = await api.get(
        `/vehicle/default-values-by-vin?vin=${vin}&zip=${zip}`
      );
    //   console.log(response)
    //   console.log(response.data)
      if (response.data.success) {
        return response.data.values[0]; // Assuming the first item in the values array
      } else {
        return rejectWithValue('API request failed');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch city and state by ZIP code
export const fetchCityStateByZip = createAsyncThunk(
  'carDetailsAndQuestions/fetchCityStateByZip',
  async (zip, { rejectWithValue }) => {
    try {
      console.log('Fetching city/state for ZIP:', zip);
      const response = await api.get(
        `/location/city-state-by-zip?zipcode=${zip}`
      );
      console.log('City/State API response:', response.data);
      
      if (response.data.success) {
        return {
          city: response.data.location.city,
          state: response.data.location.state_name,
          zipcode: response.data.location.zipcode
        };
      } else {
        return rejectWithValue(response.data.message || 'Invalid ZIP code');
      }
    } catch (error) {
      console.log('City/State API error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch location data');
    }
  }
);

// Initial questions with defaults
const initialQuestions = [
  {
    key: 'cosmetic',
    label: 'Cosmetic condition?',
    emoji: '✨',
    options: ['Excellent', 'Good', 'Fair', 'Poor'],
    positive: ['Excellent', 'Good'],
    needsDetails: ['Fair', 'Poor'],
    isMultiSelect: false,
    answer: 'Excellent',
    details: '',
  },
  {
    key: 'smoked',
    label: 'Smoked in?',
    emoji: '🚭',
    options: ['No', 'Yes'],
    positive: ['No'],
    needsDetails: ['Yes'],
    isMultiSelect: false,
    answer: 'No',
    details: '',
  },
  {
    key: 'title',
    label: 'Title status?',
    emoji: '📋',
    options: ['Clean', 'Salvage', 'Rebuilt'],
    positive: ['Clean'],
    needsDetails: ['Salvage', 'Rebuilt'],
    isMultiSelect: false,
    answer: 'Clean',
    details: '',
  },
  {
    key: 'accident',
    label: 'Accident history',
    emoji: '🚗',
    options: ['None', 'Minor', 'Major'],
    positive: ['None'],
    needsDetails: ['Minor', 'Major'],
    isMultiSelect: false,
    answer: 'None',
    details: '',
  },
  {
    key: 'features',
    label: 'Notable features?',
    emoji: '⭐',
    options: ['Navigation', 'Leather', 'Sunroof', 'Alloy Wheels', 'Premium Audio', 'Safety+'],
    positive: [],
    needsDetails: [], // Fixed: Added empty array instead of undefined
    isMultiSelect: true,
    answer: [],
    details: '',
  },
  {
    key: 'modifications',
    label: 'Modifications?',
    emoji: '🔧',
    options: ['No', 'Yes'],
    positive: ['No'],
    needsDetails: ['Yes'],
    isMultiSelect: false,
    answer: 'No',
    details: '',
  },
  {
    key: 'warning',
    label: 'Warning lights?',
    emoji: '⚠️',
    options: ['No', 'Yes'],
    positive: ['No'],
    needsDetails: ['Yes'],
    isMultiSelect: false,
    answer: 'No',
    details: '',
  },
  {
    key: 'tread',
    label: 'Tread condition?',
    emoji: '🛞',
    options: ['New', 'Good', 'Fair', 'Replace'],
    positive: ['New', 'Good'],
    needsDetails: ['Fair', 'Replace'],
    isMultiSelect: false,
    answer: 'New',
    details: '',
  },
];

// Initial state
const initialState = {
  vehicleDetails: {},
  stateZip: "",
  questions: initialQuestions,
  loading: false,
  error: null,
  location: {
    city: "",
    state: "",
    zipcode: ""
  },
  locationStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  locationError: null,
  // Modal state management
  modalState: {
    phase: 'form', // 'form' | 'loading' | 'success' | 'error'
    isLoading: false,
    error: null,
    successMessage: null
  }
};

// Create slice
const carDetailsAndQuestionsSlice = createSlice({
  name: 'carDetailsAndQuestions',
  initialState,
  reducers: {
    setVehicleDetails: (state, action) => {
        state.vehicleDetails = action.payload.vehicle_data[0]; // storing the first vehicle
        state.stateZip = action.payload.user.meta.zip_code; // optional if you want zip code
      },
      clearVehicleDetails: (state) => {
        state.vehicleDetails = {};
        state.stateZip = "";
      },
    updateQuestion: (state, action) => {
      const { key, answer, details } = action.payload;
      const question = state.questions.find((q) => q.key === key);
      if (question) {
        // Update answer if provided
        if (answer !== undefined) {
          question.answer = answer;
        }
        
        // Update details if provided
        if (details !== undefined) {
          question.details = details;
        }
        
        // Only clear details when answer changes and new answer doesn't need details
        if (answer !== undefined && details === undefined) {
          const shouldClearDetails = question.isMultiSelect
            ? Array.isArray(answer) && answer.length === 0
            : !question.needsDetails?.includes(answer);
            
          if (shouldClearDetails) {
            question.details = '';
          }
        }
      }
    },
    resetQuestions: (state) => {
      state.questions = initialQuestions.map(q => ({ ...q })); // Deep copy to avoid reference issues
    },
    setZipState: (state, action) => {
        state.stateZip = action.payload;  // ✅ update zip
      },
    clearLocation: (state) => {
      state.location = {
        city: "",
        state: "",
        zipcode: ""
      };
      state.locationStatus = 'idle';
      state.locationError = null;
    },
    setLocationError: (state, action) => {
      state.locationError = action.payload;
      state.locationStatus = 'failed';
    },
    // Modal state management actions
    setModalPhase: (state, action) => {
      state.modalState.phase = action.payload;
    },
    setModalLoading: (state, action) => {
      state.modalState.isLoading = action.payload;
      if (action.payload) {
        state.modalState.phase = 'loading';
        state.modalState.error = null;
      }
    },
    setModalError: (state, action) => {
      state.modalState.error = action.payload;
      state.modalState.phase = 'error';
      state.modalState.isLoading = false;
    },
    setModalSuccess: (state, action) => {
      state.modalState.successMessage = action.payload;
      state.modalState.phase = 'success';
      state.modalState.isLoading = false;
      state.modalState.error = null;
    },
    resetModalState: (state) => {
      state.modalState = {
        phase: 'form',
        isLoading: false,
        error: null,
        successMessage: null
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicleDetails = action.payload;
      })
      .addCase(fetchVehicleDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // City/State by ZIP reducers
      .addCase(fetchCityStateByZip.pending, (state) => {
        state.locationStatus = 'loading';
        state.locationError = null;
      })
      .addCase(fetchCityStateByZip.fulfilled, (state, action) => {
        state.locationStatus = 'succeeded';
        state.location = action.payload;
        state.locationError = null;
      })
      .addCase(fetchCityStateByZip.rejected, (state, action) => {
        state.locationStatus = 'failed';
        state.locationError = action.payload;
        // Clear location data on error
        state.location = {
          city: "",
          state: "",
          zipcode: ""
        };
      });
  },
});

// Export actions
export const { 
  setVehicleDetails, 
  updateQuestion, 
  resetQuestions, 
  setZipState, 
  clearLocation, 
  setLocationError,
  setModalPhase,
  setModalLoading,
  setModalError,
  setModalSuccess,
  resetModalState
} = carDetailsAndQuestionsSlice.actions;

// Export reducer
export default carDetailsAndQuestionsSlice.reducer;