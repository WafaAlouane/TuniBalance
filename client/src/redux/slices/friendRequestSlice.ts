// slices/friendRequestSlice.ts
import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types/user';
import { RootState } from '../store';

// Déclaration des interfaces en premier
export interface FriendRequest {
  _id: string;
  sender: User;
  recipient: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFriendRequestDto {
  recipient: string;
  email?: string; // Fusion des deux déclarations en une seule
}

export interface FriendRequestResponse {
  friendRequest: FriendRequest;
  message: string;
}

interface FriendRequestState {
  requests: FriendRequest[];
  friends: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: FriendRequestState = {
  requests: [],
  friends: [],
  status: 'idle',
  error: null,
};

// Déclaration des async thunks
export const fetchFriendRequests = createAsyncThunk(
  'friendRequests/fetchFriendRequests',
  async () => {
    const response = await axios.get('/api/friend-requests');
    return response.data as FriendRequest[];
  }
);

export const sendFriendRequest = createAsyncThunk(
  'friendRequests/sendFriendRequest',
  async (recipientId: string) => {
    const response = await axios.post('/api/friend-requests', { recipient: recipientId });
    return response.data as FriendRequest;
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friendRequests/acceptFriendRequest',
  async (requestId: string) => {
    const response = await axios.patch(`/api/friend-requests/${requestId}/accept`);
    return response.data as { friendRequest: FriendRequest; newFriend: User };
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'friendRequests/rejectFriendRequest',
  async (requestId: string) => {
    const response = await axios.patch(`/api/friend-requests/${requestId}/reject`);
    return response.data as FriendRequest;
  }
);

// Création de la slice
const friendRequestSlice = createSlice({
  name: 'friendRequest',
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<FriendRequest[]>) => {
      state.requests = action.payload;
    },
    addRequest: (state, action: PayloadAction<FriendRequest>) => {
      state.requests.push(action.payload);
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter(req => req._id !== action.payload);
    },
    addFriend: (state, action: PayloadAction<User>) => {
      if (!state.friends.some(f => f._id === action.payload._id)) {
        state.friends.push(action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(req => req._id !== action.payload.friendRequest._id);
        state.friends.push(action.payload.newFriend);
      });
  }
});

// Export des actions
 const friendRequestActions = {
  ...friendRequestSlice.actions,
  fetchFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest
};

export const { setRequests, addRequest, removeRequest, addFriend } = friendRequestSlice.actions;

export { friendRequestActions }; // 🔥 Ajoute ceci
export default friendRequestSlice.reducer;