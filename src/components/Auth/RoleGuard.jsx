// src/components/Auth/RoleGuard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle } from 'lucide-react';

const RoleGuard = ({
  children,
  allowedRoles = [],
  requiredRole = null,
  fallback = null,
  showMessage = true,
}) => {
  const { user, loading } = useSelector((state) => state.user);
  const expiration = localStorage.getItem('authExpiration');
  const isExpired = expiration && Date.now() > parseInt(expiration);

  // Show loading state if user data is still being fetched
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Check if user is authenticated and session is not expired
  if (!user || isExpired) {
    return (
      <div className="flex items-center justify-center min-h-[200px] p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Access Denied
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Please log in to access this content.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = allowedRoles.length > 0
    ? allowedRoles.includes(user?.role)
    : true;

  // Check if user has the required role
  const hasRequiredRole = requiredRole
    ? user?.role === requiredRole
    : true;

  // Check permissions
  const hasPermission = hasAllowedRole && hasRequiredRole;

  if (!hasPermission) {
    // Show custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Show default access denied message
    if (showMessage) {
      return (
        <div className="flex items-center justify-center min-h-[200px] p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              You don't have permission to access this content.
            </p>
            {requiredRole && (
              <p className="text-xs text-slate-500">
                Required role: <span className="font-medium">{requiredRole}</span>
              </p>
            )}
            {allowedRoles.length > 0 && (
              <p className="text-xs text-slate-500">
                Allowed roles: <span className="font-medium">{allowedRoles.join(', ')}</span>
              </p>
            )}
          </div>
        </div>
      );
    }

    // Return null if no message should be shown
    return null;
  }

  // User has permission, render children
  return children;
};

export default RoleGuard;