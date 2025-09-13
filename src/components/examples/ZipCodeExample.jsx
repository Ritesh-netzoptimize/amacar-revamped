import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityStateByZip, clearLocation } from '@/redux/slices/carDetailsAndQuestionsSlice';
import { Loader2, MapPin } from 'lucide-react';

/**
 * Example component demonstrating ZIP code to city/state lookup
 * This shows how to use the Redux thunk and display the results
 */
export default function ZipCodeExample() {
  const dispatch = useDispatch();
  const { location, locationStatus, locationError } = useSelector((state) => state.carDetailsAndQuestions);
  
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Debounced ZIP code lookup (500ms delay)
  const debouncedZipLookup = useCallback(
    (() => {
      let timeoutId;
      return (zip) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (zip && zip.length === 5 && /^\d{5}$/.test(zip)) {
            console.log('Looking up ZIP:', zip);
            dispatch(fetchCityStateByZip(zip));
          } else if (zip.length === 0) {
            // Clear location when ZIP is empty
            dispatch(clearLocation());
            setCity('');
            setState('');
          }
        }, 500);
      };
    })(),
    [dispatch]
  );

  // Handle ZIP code input changes
  const handleZipChange = (value) => {
    setZipCode(value);
    debouncedZipLookup(value);
  };

  // Update local state when Redux location changes
  useEffect(() => {
    if (locationStatus === 'succeeded' && location.city && location.state) {
      setCity(location.city);
      setState(location.state);
    }
  }, [location, locationStatus]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">ZIP Code Lookup Example</h2>
      
      {/* ZIP Code Input */}
      <div className="mb-4">
        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
          ZIP Code
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <input
            id="zip"
            type="text"
            value={zipCode}
            onChange={(e) => handleZipChange(e.target.value)}
            placeholder="Enter 5-digit ZIP code"
            maxLength={5}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          {locationStatus === 'loading' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {locationError && (
          <p className="mt-1 text-sm text-red-600">{locationError}</p>
        )}
      </div>

      {/* City Input (Read-only when auto-filled) */}
      <div className="mb-4">
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          City {locationStatus === 'succeeded' && city && (
            <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>
          )}
        </label>
        <input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={locationStatus === 'loading' ? 'Looking up city...' : 'Enter city'}
          disabled={locationStatus === 'loading' || (locationStatus === 'succeeded' && city)}
          className={`block w-full px-3 py-2 border rounded-md ${
            locationStatus === 'loading'
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
              : locationStatus === 'succeeded' && city
              ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
              : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
          }`}
        />
      </div>

      {/* State Input (Read-only when auto-filled) */}
      <div className="mb-4">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
          State {locationStatus === 'succeeded' && state && (
            <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>
          )}
        </label>
        <input
          id="state"
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder={locationStatus === 'loading' ? 'Looking up state...' : 'Enter state'}
          disabled={locationStatus === 'loading' || (locationStatus === 'succeeded' && state)}
          className={`block w-full px-3 py-2 border rounded-md ${
            locationStatus === 'loading'
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
              : locationStatus === 'succeeded' && state
              ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
              : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
          }`}
        />
      </div>

      {/* Status Display */}
      <div className="text-sm text-gray-600">
        <p>Status: <span className="font-medium">{locationStatus}</span></p>
        {locationStatus === 'succeeded' && (
          <p className="text-green-600 mt-1">
            ✓ Successfully found: {city}, {state}
          </p>
        )}
      </div>
    </div>
  );
}
