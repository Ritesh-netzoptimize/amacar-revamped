// src/hooks/useAuth.jsx (Form management hook)
import { useState } from "react";

export default function useAuth() {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const setValue = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const setError = (key, error) => {
    setErrors((prev) => ({ ...prev, [key]: error }));
  };

  const resetForm = () => {
    setValues({});
    setErrors({});
  };

  return { values, errors, setValue, setError, resetForm };
}