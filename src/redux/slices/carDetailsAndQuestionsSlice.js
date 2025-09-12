import api from '@/lib/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch vehicle details
export const fetchVehicleDetails = createAsyncThunk(
  'carDetailsAndQuestions/fetchVehicleDetails',
  async ({ rejectWithValue }) => {
    try {
      const response = await api.get(
        `/vehicle/default-values-by-vin?vin=JTHBL46FX75021954&zip=80226`
      );
      console.log(response)
      console.log(response.data)
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
    options: ['Excellent', 'Good', 'Fair', 'Poor'],
    positive: ['Excellent', 'Good'],
    needsDetails: ['Fair', 'Poor'],
    answer: 'Excellent',
    details: '',
  },
  {
    key: 'smoked',
    label: 'Smoked in?',
    options: ['No', 'Yes'],
    positive: ['No'],
    needsDetails: ['Yes'],
    answer: 'No',
    details: '',
  },
  {
    key: 'title',
    label: 'Title status?',
    options: ['Clean', 'Salvage', 'Rebuilt'],
    positive: ['Clean'],
    needsDetails: ['Salvage', 'Rebuilt'],
    answer: 'Clean',
    details: '',
  },
  {
    key: 'features',
    label: 'Notable features?',
    options: ['Navigation', 'Leather', 'Sunroof', 'Alloy Wheels', 'Premium Audio', 'Safety+'],
    isMultiSelect: true,
    answer: [],
    details: '',
  },
  {
    key: 'modifications',
    label: 'Modifications?',
    options: ['No', 'Yes'],
    positive: ['No'],
    needsDetails: ['Yes'],
    answer: 'No',
    details: '',
  },
  {
    key: 'warning',
    label: 'Warning lights?',
    options: ['No', 'Yes'],
    positive: ['No'],
    needsDetails: ['Yes'],
    answer: 'No',
    details: '',
  },
  {
    key: 'tread',
    label: 'Tread condition?',
    options: ['New', 'Good', 'Fair', 'Replace'],
    positive: ['New', 'Good'],
    needsDetails: ['Fair', 'Replace'],
    answer: 'New',
    details: '',
  },
];

// Initial state
const initialState = {
  vehicleDetails: {},
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
      state.vehicleDetails = action.payload;
    },
    updateQuestion: (state, action) => {
      const { key, answer, details } = action.payload;
      const question = state.questions.find((q) => q.key === key);
      if (question) {
        question.answer = answer;
        if (details !== undefined) {
          question.details = details;
        } else if (
          (question.needsDetails && !question.needsDetails.includes(answer)) ||
          (question.isMultiSelect && answer.length === 0)
        ) {
          question.details = '';
        }
      }
    },
    resetQuestions: (state) => {
      state.questions = initialQuestions;
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
export const { setVehicleDetails, updateQuestion, resetQuestions } = carDetailsAndQuestionsSlice.actions;

// Export reducer
export default carDetailsAndQuestionsSlice.reducer;