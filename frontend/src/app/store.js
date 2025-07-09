import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from './rootReducer';
import storage from 'redux-persist/lib/storage';




const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth','store'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persister = persistStore(store);

export {  persister };
export default store;

// redux store <- root reducer <- slices <- dispatch(send) + selectors(read)