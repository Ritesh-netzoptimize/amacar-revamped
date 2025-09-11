// Pages/UnauthorizedPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { requiredRole, userRole } = location.state || {};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Access Denied
          </h1>
          
          <p className="text-slate-600 mb-6">
            You don't have permission to access this page.
          </p>

          {/* Role Information */}
          {requiredRole && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-slate-600">
                <div className="mb-2">
                  <span className="font-medium">Required Role:</span>
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    {requiredRole}
                  </span>
                </div>
                {userRole && (
                  <div>
                    <span className="font-medium">Your Role:</span>
                    <span className="ml-2 px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-xs">
                      {userRole}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Need access to this page?{' '}
              <a 
                href="mailto:support@amacar.com" 
                className="text-orange-600 hover:text-orange-700 underline"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;