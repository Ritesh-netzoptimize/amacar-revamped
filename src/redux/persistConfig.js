// redux/persistConfig.js
import storage from 'redux-persist/lib/storage'; // localStorage
export const carPersistConfig = {
  key: 'car',                // storage key prefix
  storage,
  whitelist: ['carDetails', 'questions', 'stateZip'] // keys INSIDE carDetailsAndQuestions slice to persist
};
