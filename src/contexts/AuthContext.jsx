// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api"; // Assuming you create src/api.js as shown below

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");
      const expiration = localStorage.getItem("authExpiration");

      if (token && storedUser && expiration) {
        const expTime = parseInt(expiration);
        if (Date.now() < expTime) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Set auto-logout timer for remaining time
          const remainingTime = expTime - Date.now();
          setTimeout(() => {
            logout();
          }, remainingTime);
        } else {
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const setAuthData = (data) => {
    const { user, token, expires_in } = data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    const expirationTime = Date.now() + expires_in * 1000;
    localStorage.setItem("authExpiration", expirationTime);
    setUser(user);
    // Set auto-logout timer
    setTimeout(() => {
      logout();
    }, expires_in * 1000);
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      if (response.data.success) {
        setAuthData(response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post("/register", data);
      if (response.data.success) {
        setAuthData(response.data);
        return response.data;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post("/forgot-password", { email });
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (data) => {
    try {
      const response = await api.post("/verify-otp", data);
      if (response.data.success) {
        return response.data.resetToken; // Assuming backend returns resetToken
      } else {
        throw new Error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await api.post("/reset-password", { token, newPassword });
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authExpiration");
    setUser(null);
    navigate("/");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, forgotPassword, verifyOTP, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}