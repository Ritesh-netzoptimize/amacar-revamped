# ZIP Code to City/State Lookup Implementation

This implementation provides a complete ZIP code to city/state lookup functionality using Redux Thunk, with debouncing and proper error handling.

## 🚀 Features

- **Debounced API calls** (500ms delay) to prevent excessive requests
- **Automatic city/state population** when valid ZIP is entered
- **Loading states** with spinner indicators
- **Error handling** with inline error messages
- **Visual feedback** for auto-filled fields
- **Redux state management** with proper cleanup

## 📁 Files Modified/Created

### 1. Redux Slice (`src/redux/slices/carDetailsAndQuestionsSlice.js`)

**Added:**
- `fetchCityStateByZip` async thunk
- Location state management (`location`, `locationStatus`, `locationError`)
- Reducers: `clearLocation`, `setLocationError`
- ExtraReducers for pending/success/error states

**API Endpoint:**
```javascript
GET /location/city-state-by-zip?zipcode=90290
```

**Expected Response:**
```json
{
  "success": true,
  "timestamp": "2025-09-12 13:15:14",
  "version": "1.0.0",
  "location": {
    "city": "Topanga",
    "state_name": "California",
    "zipcode": "90290"
  }
}
```

### 2. AuctionYourRideModal (`src/components/ui/AuctionYourRideModal.jsx`)

**Added:**
- Debounced ZIP code input handling
- Redux state integration
- Loading spinners and error display
- Auto-filled field styling
- Proper cleanup on modal close

### 3. Example Component (`src/components/examples/ZipCodeExample.jsx`)

**Created:**
- Standalone example showing usage
- Complete implementation reference
- Best practices demonstration

## 🔧 Usage

### Basic Implementation

```jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityStateByZip, clearLocation } from '@/redux/slices/carDetailsAndQuestionsSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { location, locationStatus, locationError } = useSelector(
    (state) => state.carDetailsAndQuestions
  );
  
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Debounced ZIP lookup
  const debouncedZipLookup = useCallback(
    (() => {
      let timeoutId;
      return (zip) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (zip && zip.length === 5 && /^\d{5}$/.test(zip)) {
            dispatch(fetchCityStateByZip(zip));
          } else if (zip.length === 0) {
            dispatch(clearLocation());
            setCity('');
            setState('');
          }
        }, 500);
      };
    })(),
    [dispatch]
  );

  // Handle ZIP input
  const handleZipChange = (value) => {
    setZipCode(value);
    debouncedZipLookup(value);
  };

  // Update local state when Redux changes
  useEffect(() => {
    if (locationStatus === 'succeeded' && location.city && location.state) {
      setCity(location.city);
      setState(location.state);
    }
  }, [location, locationStatus]);

  return (
    <div>
      <input
        type="text"
        value={zipCode}
        onChange={(e) => handleZipChange(e.target.value)}
        placeholder="Enter ZIP code"
      />
      
      {locationStatus === 'loading' && <div>Loading...</div>}
      {locationError && <div className="error">{locationError}</div>}
      
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="City"
      />
      
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State"
      />
    </div>
  );
}
```

## 🎯 Redux State Structure

```javascript
{
  carDetailsAndQuestions: {
    // ... existing state
    location: {
      city: "Topanga",
      state: "California", 
      zipcode: "90290"
    },
    locationStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    locationError: null
  }
}
```

## 🔄 State Flow

1. **User types ZIP code** → Input validation (5 digits)
2. **Debounced API call** → 500ms delay before dispatch
3. **Redux thunk execution** → API call to backend
4. **State updates** → Pending → Success/Error
5. **UI updates** → Loading spinner → Auto-filled fields or error message

## 🎨 UI States

### Loading State
- Spinner in ZIP input field
- Disabled city/state inputs
- "Looking up..." placeholders

### Success State
- Green styling for auto-filled fields
- "(Auto-filled)" labels
- City and state populated

### Error State
- Red error message below ZIP input
- Cleared location data
- User can retry

## 🧹 Cleanup

- **Modal close**: Clears Redux location state
- **Empty ZIP**: Clears location data
- **Component unmount**: Automatic cleanup via Redux

## 🚨 Error Handling

- **Invalid ZIP**: Shows "Invalid ZIP code" message
- **API failure**: Shows backend error message
- **Network error**: Shows "Failed to fetch location data"
- **Empty response**: Clears location data

## ⚡ Performance

- **Debouncing**: Prevents API calls on every keystroke
- **Validation**: Only calls API for valid 5-digit ZIP codes
- **Caching**: Redux state persists until cleared
- **Cleanup**: Prevents memory leaks

## 🔧 Customization

### Change Debounce Delay
```javascript
timeoutId = setTimeout(() => {
  // ... API call
}, 1000); // Change from 500ms to 1000ms
```

### Custom Error Messages
```javascript
// In the thunk
return rejectWithValue('Custom error message');
```

### Different API Endpoint
```javascript
const response = await api.get(`/your-custom-endpoint?zip=${zip}`);
```

## 🧪 Testing

The implementation includes console logs for debugging:
- ZIP lookup requests
- API responses
- Error states
- State changes

Check browser console for detailed flow information.

## 📝 Best Practices Implemented

✅ **Debounced input** - Prevents excessive API calls  
✅ **Loading states** - Clear user feedback  
✅ **Error handling** - Graceful failure management  
✅ **State cleanup** - Prevents memory leaks  
✅ **Visual feedback** - Auto-filled field styling  
✅ **Input validation** - Only valid ZIP codes trigger API  
✅ **Redux patterns** - Proper thunk and reducer usage  
✅ **TypeScript ready** - Well-structured for type safety  

This implementation provides a robust, user-friendly ZIP code lookup system that integrates seamlessly with your existing Redux architecture.
