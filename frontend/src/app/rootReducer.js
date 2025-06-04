import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import storeReducer from '../features/store/storeSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  store: storeReducer,
});

export default rootReducer;
