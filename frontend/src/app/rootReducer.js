import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import storeReducer from '../features/store/storeSlice';
import paymentReducer from '../features/payment/paymentSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  store: storeReducer,
  payment:paymentReducer,
  
});

export default rootReducer;
