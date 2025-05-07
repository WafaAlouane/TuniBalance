// services/friendRequestApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../redux/store.ts'; // Assurez-vous que le chemin est correct

export const friendRequestApi = createApi({
  reducerPath: 'friendRequestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001', // change selon ton env
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  tagTypes: ['FriendRequests'],
  endpoints: (builder) => ({
    getFriends: builder.query<any[], void>({
        query: () => '/friend-requests', 
    }),
    
    getSentRequests: builder.query<any[], void>({
      query: () => '/friend-requests/sent',
    }),
    getAllFriendRequests: builder.query<any[], void>({
        query: () => '/friend-requests',
      }),
      getMyFriendRequests: builder.query<any[], void>({
        query: () => '/friend-requests/me', // ✅ maintenant ce path existe
        providesTags: ['FriendRequests'],
      }),
      
      
      
      
    getFriendRequestById: builder.query<any, string>({
      query: (id) => `/friend-requests/${id}`,
    }),
    createFriendRequest: builder.mutation<any, { email: string }>({
      query: ({ email }) => ({
        url: '/friend-requests',
        method: 'POST',
        body: { email },
      }),
      invalidatesTags: ['FriendRequests'],
    }),
    acceptFriendRequest: builder.mutation<any, string>({
      query: (id) => ({
        url: `/friend-requests/${id}/accept`,
        method: 'PATCH',
      }),
      invalidatesTags: ['FriendRequests'],
    }),
    rejectFriendRequest: builder.mutation<any, string>({
      query: (id) => ({
        url: `/friend-requests/${id}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: ['FriendRequests'],
    }),
    cancelFriendRequest: builder.mutation<any, string>({
      query: (id) => ({
        url: `/friend-requests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FriendRequests'],
    }),
    checkFriendRequestStatus: builder.query<any, string>({
      query: (recipientId) => `/friend-requests/status/${recipientId}`,
    }),
    searchUsers: builder.query<any[], string>({
      query: (name) => `/friend-requests/search?name=${name}`,
    }),
  }),
});

export const {
  useGetFriendsQuery,
  useGetSentRequestsQuery,
  useCreateFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
  useCancelFriendRequestMutation,
  useSearchUsersQuery,
  useCheckFriendRequestStatusQuery,
  useGetFriendRequestByIdQuery,
  useGetMyFriendRequestsQuery,
  useGetAllFriendRequestsQuery,
} = friendRequestApi;
