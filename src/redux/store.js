import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import carDetailsAndQuestionsReducer from './slices/carDetailsAndQuestionsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    carDetailsAndQuestions: carDetailsAndQuestionsReducer,
  },
  devTools: true,
});