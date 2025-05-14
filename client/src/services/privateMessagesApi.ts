
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "../redux/store.ts"
import type { PrivateMessage } from "../types/user"

export const privateMessagesApi = createApi({
  reducerPath: "privateMessagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as { auth: { token: string | null } };
       const token = state.auth.token;
       
       if (token) {
         headers.set("Authorization", `Bearer ${token}`);
         // Maintenant TypeScript sait que token est de type string
         console.log("Token ajouté aux en-têtes:", token.substring(0, 15) + "...");
       } else {
         console.warn("Aucun token trouvé dans le state");
       }
       
       return headers;
     
    },
    credentials: 'include',
  }),
  tagTypes: ["PrivateMessages"],
  endpoints: (builder) => ({
    getMessagesWithUser: builder.query<PrivateMessage[], string>({
      query: (recipientId) => ({
        url: `/private-messages/with/${recipientId}`,
        // Ajouter des options supplémentaires pour le débogage
        responseHandler: (response) => {
          console.log("Réponse brute:", response.status, response.statusText)
          return response.json()
        },
        validateStatus: (response, result) => {
          console.log("Validation du statut:", response.status)
          return response.status === 200
        }
      }),
      // Ajouter des logs pour déboguer
      onQueryStarted: async (recipientId, { queryFulfilled, getState }) => {
        const state = getState() as RootState
        console.log("Token utilisé pour getMessagesWithUser:", state.auth.token ? "Présent" : "Absent")
        console.log("Démarrage de la requête getMessagesWithUser avec recipientId:", recipientId)
        try {
          const result = await queryFulfilled
          console.log("Résultat de getMessagesWithUser:", result.data)
        } catch (err) {
          console.error("Erreur dans getMessagesWithUser:", err)
          // Afficher plus de détails sur l'erreur
          if (err.error?.status === 401) {
            console.error("Erreur d'authentification. Vérifiez votre token.")
          }
        }
      },
      providesTags: (result, error, recipientId) => [{ type: "PrivateMessages", id: recipientId }],
    }),
    sendPrivateMessage: builder.mutation<PrivateMessage, { recipientId: string; content: string }>({
      query: (messageData) => ({
        url: "/private-messages",
        method: "POST",
        body: messageData,
      }),
      async onQueryStarted(messageData, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState
        console.log("Token utilisé pour sendPrivateMessage:", state.auth.token ? "Présent" : "Absent")
        console.log("Envoi de message:", messageData)
        try {
          const { data: newMessage } = await queryFulfilled
          console.log("Message envoyé avec succès:", newMessage)

          // Mettre à jour le cache avec le nouveau message
          dispatch(
            privateMessagesApi.util.updateQueryData("getMessagesWithUser", messageData.recipientId, (draft) => {
              const exists = draft.some((m) => m._id === newMessage._id)
              if (!exists) draft.push(newMessage)
            }),
          )
        } catch (err) {
          console.error("Erreur lors de l'envoi du message:", err)
        }
      },
      invalidatesTags: ["PrivateMessages"],
    }),

    editPrivateMessage: builder.mutation<PrivateMessage, { messageId: string; content: string }>({
      query: ({ messageId, content }) => ({
        url: `/private-messages/${messageId}`,
        method: "PUT",
        body: { content },
      }),
      invalidatesTags: ["PrivateMessages"],
    }),

    deletePrivateMessage: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `/private-messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PrivateMessages"],
    }),

    addReaction: builder.mutation<void, { messageId: string; type: string }>({
      query: ({ messageId, type }) => ({
        url: `/private-messages/${messageId}/reactions`,
        method: "POST",
        body: { type },
      }),
      invalidatesTags: ["PrivateMessages"],
    }),

    removeReaction: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `/private-messages/${messageId}/reactions`,
        method: "DELETE",
      }),
      invalidatesTags: ["PrivateMessages"],
    }),

    markMessagesAsRead: builder.mutation<void, string>({
      query: (otherUserId) => ({
        url: `/private-messages/mark-as-read/${otherUserId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["PrivateMessages"],
    }),

    uploadVoiceMessage: builder.mutation<{ audioUrl: string }, FormData>({
      query: (formData) => ({
        url: "/private-messages/upload-voice",
        method: "POST",
        body: formData,
      }),
    }),

    sendVoiceMessage: builder.mutation({
      query: (voiceMessageData) => ({
        url: "/private-messages/voice",
        method: "POST",
        body: voiceMessageData,
      }),
      invalidatesTags: ["PrivateMessages"],
    }),
  }),
})

export const {
  useGetMessagesWithUserQuery,
  useSendPrivateMessageMutation,
  useEditPrivateMessageMutation,
  useDeletePrivateMessageMutation,
  useAddReactionMutation,
  useRemoveReactionMutation,
  useMarkMessagesAsReadMutation,
  useUploadVoiceMessageMutation,
  useSendVoiceMessageMutation,
} = privateMessagesApi
