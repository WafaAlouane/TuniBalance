import { configureStore } from "@reduxjs/toolkit"; 
import { 
  persistReducer, 
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER 
} from "redux-persist";
import friendRequestReducer from "./slices/friendRequestSlice";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import factureReducer from "./slices/factureSlice"; // Chemin relatif corrigé
import transactionReducer from "./slices/transactionSlice";
import { friendRequestApi } from '../../src/services/friendRequestApi'; // ton API RTK
import { privateMessagesApi } from './../services/privateMessagesApi';
import appointmentReducer from './slices/appointmentSlice';

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// store.ts
export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    factures: factureReducer,
    transactions: transactionReducer,
    appointments: appointmentReducer,
    [friendRequestApi.reducerPath]: friendRequestApi.reducer,
        [privateMessagesApi.reducerPath]: privateMessagesApi.reducer, // Ajouté // <-- ici
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
