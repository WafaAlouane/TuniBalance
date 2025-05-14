// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { friendRequestApi } from './../services/friendRequestApi';

import authReducer from './slices/authSlice';
import friendRequestReducer from './slices/friendRequestSlice';
import factureReducer from './slices/factureSlice';
import transactionReducer from './slices/transactionSlice';
import { privateMessagesApi } from './../services/privateMessagesApi';
import appointmentReducer from './slices/appointmentSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    factures: factureReducer,
    transactions: transactionReducer,
    friendRequests: friendRequestReducer,
    appointments: appointmentReducer,
    [friendRequestApi.reducerPath]: friendRequestApi.reducer,
    [privateMessagesApi.reducerPath]: privateMessagesApi.reducer, // Ajouté

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      friendRequestApi.middleware,
      privateMessagesApi.middleware // Ajouté
    ),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
