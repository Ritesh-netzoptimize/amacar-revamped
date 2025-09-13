import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api'; // Assuming api.js is in src/
import { useNavigate } from 'react-router-dom'; // Note: useNavigate cannot be used directly in slice, handled in components

// Async thunks for auth actions
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        return response.data; // { user, token, expires_in }
      }
      return rejectWithValue(response.data.message || 'Login failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', data);
      if (response.data.success) {
        return response.data; // { user, token, expires_in }
      }
      return rejectWithValue(response.data.message || 'Registration failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);


export const registerWithVin = createAsyncThunk(
  'user/registerWithVin',
  async (data, { rejectWithValue }) => {
    try {
        // console.log("data", data)
        const response = await api.post('/registration/register-with-vin', data);
        // console.log("Response", response)
        // console.log("Response.data", response.data)
      if (response.data.success) {
        // Store auth tokens in localStorage for persistence
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        if (response.data.user) {
          localStorage.setItem('authUser', JSON.stringify(response.data.user));
        }
        if (response.data.expires_in) {
          const expirationTime = Date.now() + response.data.expires_in * 1000;
          localStorage.setItem('authExpiration', expirationTime);
        }
        return response.data; // Assuming response contains { user, token, expires_in }
      }
      return rejectWithValue(response.data.message || 'Registration with VIN failed');
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration with VIN failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
        // console.log(email)
      const response = await api.post('/auth/forgot-password', { email });
      if (response.data.success) {
        // console.log(response)
        // console.log(response.data)
        return response.data;
      }
      return rejectWithValue(response.data.message || 'Failed to send OTP');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'user/verifyOTP',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Sending OTP verification request:', data);
      const response = await api.post('/auth/verify-otp', data);
      console.log('OTP verification response:', response.data);
      
      if (response.data.success) {
        console.log('OTP verification successful, returning token:', response.data.resetToken);
        return response.data.resetToken; // Assuming backend returns resetToken
      }
      console.log('OTP verification failed - success is false:', response.data);
      return rejectWithValue(response.data.message || 'Invalid OTP');
    } catch (error) {
      console.log('OTP verification API error:', error.response?.data || error.message);
      console.log('Full error object:', error);
      console.log('Error status:', error.response?.status);
      console.log('Error headers:', error.response?.headers);
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      if (response.data.success) {
        return response.data;
      }
      return rejectWithValue(response.data.message || 'Password reset failed');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: true,
    form: {
      values: {},
      errors: {},
    },
    error: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    loginRedirect: null,
  },
  reducers: {

    setLoginRedirect: (state, action) => {
        state.loginRedirect = action.payload;
    },
    clearLoginRedirect: (state) => {
        state.loginRedirect = null;
    },

    setFormValue: (state, action) => {
      const { key, value } = action.payload;
      state.form.values[key] = value;
      state.form.errors[key] = '';
    },
    setFormError: (state, action) => {
      const { key, error } = action.payload;
      state.form.errors[key] = error;
    },
    resetForm: (state) => {
      state.form.values = {};
      state.form.errors = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('authExpiration');
      state.user = null;
      state.error = null;
      state.form.values = {};
      state.form.errors = {};
    },
    loadUser: (state) => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      const expiration = localStorage.getItem('authExpiration');

      if (token && storedUser && expiration) {
        const expTime = parseInt(expiration);
        if (Date.now() < expTime) {
          state.user = JSON.parse(storedUser);
          state.loading = false;
          // Note: Auto-logout timer is set in the component
        } else {
          state.user = null;
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          localStorage.removeItem('authExpiration');
          state.loading = false;
        }
      } else {
        state.user = null;
        state.loading = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('authUser', JSON.stringify(action.payload.user));
        const expirationTime = Date.now() + action.payload.expires_in * 1000;
        localStorage.setItem('authExpiration', expirationTime);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('authUser', JSON.stringify(action.payload.user));
        const expirationTime = Date.now() + action.payload.expires_in * 1000;
        localStorage.setItem('authExpiration', expirationTime);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })      .addCase(registerWithVin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerWithVin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        // Auth tokens are already stored in localStorage by the thunk
        // No need to store them again in Redux state
      })
      .addCase(registerWithVin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Something went wrong';
      });
  },
});

export const { setFormValue, setFormError, resetForm, clearError, logout, loadUser, setLoginRedirect, clearLoginRedirect } = userSlice.actions;
export default userSlice.reducer;
