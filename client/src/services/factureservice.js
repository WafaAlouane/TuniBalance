import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API URL pour créer une facture
const API_URL = 'http://localhost:3000/factures'; // Remplacez l'URL par celle de votre API

// Action pour créer une facture
export const createFacture = createAsyncThunk(
  'factures/createFacture',
  async (factureData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, factureData);
      return response.data; // Retourne les données de la facture créée
    } catch (error) {
      return rejectWithValue(error.response.data); // Retourne l'erreur si elle se produit
    }
  }
);

// Slice Redux pour gérer les factures
const factureSlice = createSlice({
  name: 'factures',
  initialState: {
    factures: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createFacture.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFacture.fulfilled, (state, action) => {
        state.loading = false;
        state.factures.push(action.payload); // Ajouter la facture créée à la liste
      })
      .addCase(createFacture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Enregistrer l'erreur si elle se produit
      });
  }
});

export default factureSlice.reducer;
