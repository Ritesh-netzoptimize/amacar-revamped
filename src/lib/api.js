// src/api.js (Centralized API utility with Axios interceptor)
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // Adjust to your backend base URL, e.g., "https://your-backend.com/api"
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on 401 (unauthorized)
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authExpiration");
      window.location.href = "/unauthorized";
    }
    return Promise.reject(error);
  }
);

export default api;