// redux/slices/transactionSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState: {
    transactionData: null,
    error: null,
    loading: false,
  },
  reducers: {
    addTransactionRequest: (state) => {
      state.loading = true;
    },
    addTransactionSuccess: (state, action) => {
      state.transactionData = action.payload;
      state.loading = false;
    },
    addTransactionFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    createTransaction: (state, action) => {
        // Traitement de la transaction si nécessaire
        state.transactionData = action.payload; // ou tout autre traitement
      },
  },
});

export const {
  addTransactionRequest,
  addTransactionSuccess,
  createTransaction,
  addTransactionFailure,
} = transactionSlice.actions;

export default transactionSlice.reducer;
