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
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import factureReducer from "./slices/factureSlice"; // Chemin relatif corrigé
import transactionReducer from "./slices/transactionSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"]
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// store.js
export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    factures: factureReducer,
    transactions: transactionReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);