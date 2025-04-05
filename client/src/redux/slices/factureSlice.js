// factureSlice.js
import { createSlice } from '@reduxjs/toolkit';

// 1. Déclarer l'état initial d'abord
const initialState = {
  factures: [],
  loading: false,
  error: null
};

const factureSlice = createSlice({
  name: 'factures',
  initialState,
  reducers: {
    fetchFacturesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFacturesSuccess: (state, action) => {
      state.factures = action.payload;
      state.loading = false;
    },
    fetchFacturesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});


export const { 
  fetchFacturesStart, 
  fetchFacturesSuccess, 
  fetchFacturesFailure 
} = factureSlice.actions;


export default factureSlice.reducer; // <-- Exporter le reducer à la fin