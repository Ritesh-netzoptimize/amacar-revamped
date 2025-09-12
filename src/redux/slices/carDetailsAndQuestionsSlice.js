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
      });
  },
});

// Export actions
export const { setVehicleDetails, updateQuestion, resetQuestions, setZipState } = carDetailsAndQuestionsSlice.actions;

// Export reducer
export default carDetailsAndQuestionsSlice.reducer;