import { configureStore } from '@reduxjs/toolkit';
import factureReducer from './slices/factureSlice';

const store = configureStore({
  reducer: {
    factures: factureReducer,
  },
});

export default store;
