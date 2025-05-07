// src/redux/slices/friendRequestSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ⚠️ URL à adapter selon ton backend
const API_URL = "http://localhost:3001/friend-requests";

// Obtenir les demandes reçues
export const fetchFriendRequests = createAsyncThunk(
  'friendRequests/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth.user; // Assure-toi que le token est bien là
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Envoyer une demande d'ami
export const sendFriendRequest = createAsyncThunk(
  'friendRequests/send',
  async (email, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth.user;
      const res = await axios.post(
        API_URL,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const friendRequestSlice = createSlice({
  name: 'friendRequests',
  initialState: {
    requests: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.requests.push(action.payload); // ou notifier l'utilisateur
      });
  },
});

export default friendRequestSlice.reducer;
