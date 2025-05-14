import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Adapter à ton API
const API_URL = 'http://localhost:3001';

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const fiscalResponse = await axios.get(`${API_URL}/appointments/fiscal-deadlines`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const appointments = response.data.map(appointment => ({
        title: appointment.title,
        start: appointment.start,
        end: appointment.end,
        color: appointment.isFiscalDeadline ? '#ff0000' : '#3788d8',
        extendedProps: {
          type: appointment.type,
          status: appointment.status
        }
      }));

      const deadlines = fiscalResponse.data.map(deadline => ({
        title: deadline.title,
        start: deadline.start,
        end: deadline.end,
        color: '#ff0000',
        allDay: true
      }));

      return [...appointments, ...deadlines];

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur serveur');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: {
    events: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default appointmentSlice.reducer;
