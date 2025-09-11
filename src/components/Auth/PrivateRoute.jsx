// src/components/Auth/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function PrivateRoute({ children, requiredRole }) {
  const { user } = useContext(AuthContext);
  const expiration = localStorage.getItem("authExpiration");
  const isExpired = expiration && Date.now() > parseInt(expiration);

  if (!user || isExpired) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}