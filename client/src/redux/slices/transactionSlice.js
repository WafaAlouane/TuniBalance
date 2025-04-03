// redux/transactionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [], // Liste des transactions
  loading: false,    // Indicateur de chargement
  error: null,       // Erreur possible
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.loading = true;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    fetchTransactionsFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
} = transactionSlice.actions;

export default transactionSlice.reducer;
