// PrivateMessageChat.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useGetMessagesWithUserQuery, useSendPrivateMessageMutation } from "../../services/privateMessagesApi";
import MessageReacts from "./MessageReacts";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { socketService } from "../../services/socketService";
import { PrivateMessage } from "../../types/user";
import { useMarkMessagesAsReadMutation } from "../../services/privateMessagesApi";
import ChatLayout from "./ChatLayout";

export default function PrivateMessageChat() {
  const { userId } = useParams<{ userId: string }>();  const [sendMessage] = useSendPrivateMessageMutation()
  const currentUser = useSelector((s: RootState) => s.auth.user)
  const [text, setText] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  const [markMessagesAsRead] = useMarkMessagesAsReadMutation()
  const [friendName, setFriendName] = useState<string>("Chat")
  const token = useSelector((s: RootState) => s.auth.token)
  const [error, setError] = useState<string | null>(null)
  console.log("PrivateMessageChat - friendId:", userId)
  console.log("PrivateMessageChat - currentUser:", currentUser?._id)
  console.log("PrivateMessageChat - token present:", token ? "Yes" : "No")
  useEffect(() => {
    if (token && !socketService.socket?.connected) {
      socketService.connect(token)
    }
  }, [token])

  const {
    data: messages = [],
    isLoading,

    refetch,
  } = useGetMessagesWithUserQuery(userId!, {
    // Skip to avoid requests with invalid IDs
    skip: !userId || !currentUser?._id,
    // Force refresh on each mount
    refetchOnMountOrArgChange: true,
  })

  // Add a log to see retrieved messages
  console.log("PrivateMessageChat - retrieved messages:", messages)

  useEffect(() => {
    if (userId && currentUser?._id && token) {
      console.log("Fetching messages between", currentUser._id, "and", userId)
      refetch()
    }
  }, [userId, currentUser?._id, token])

  useEffect(() => {
    if (messages.length > 0) {
      const friend = messages[0].sender._id === currentUser?._id ? messages[0].recipient : messages[0].sender;
      setFriendName(friend.name || "Chat");

      // Important addition here:
      console.log("friendId:", friend._id); // <- for verification
    }
  }, [messages, currentUser?._id]);


  const handleNewMessage = useCallback(
    (message: PrivateMessage) => {
      console.log("New message received via socket:", message)
      if (
        userId &&
        currentUser?._id &&
        ((message.sender._id === userId && message.recipient._id === currentUser._id) ||
          (message.recipient._id === userId && message.sender._id === currentUser._id))
      ) {
        refetch()
      }
    },
    [userId, currentUser?._id, refetch],
  )
  // PrivateMessageChat.tsx - Modifier le useEffect
useEffect(() => {
  const cleanup = () => {
    socketService.stopListeningForPrivateMessages(handleNewMessage);
  };

  if (token) {
    socketService.listenForPrivateMessages(handleNewMessage);
    return cleanup;
  }
}, [handleNewMessage, token]);

  useEffect(() => {
    if (userId && currentUser?._id && messages.length > 0) {
      markMessagesAsRead(userId)
        .unwrap()
        .then(() => console.log("Messages marked as read"))
        .catch((err) => console.error("Error marking messages as read:", err))
    }
  }, [userId, currentUser?._id, markMessagesAsRead, messages.length])


  // Modifier la gestion d'erreur pour afficher plus de détails
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !userId || !currentUser) return

    setError(null)
    try {
      console.log("Sending message to", userId, ":", text)
      const result = await sendMessage({
        recipientId: userId,
        content: text,
      }).unwrap()

      console.log("Message sent successfully:", result)
      setText("")
      refetch()
    } catch (error: any) {
      console.error("Failed to send message:", error)
      setError(error.data?.message || "Error sending message")
    }
  }
;
if (!token) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-6 max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V8m0 0V6m0 0h2m-2 0H9" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-300 mb-2">Authentication Required</h3>
        <p className="text-red-400">You are not authenticated. Please log in to access the chat.</p>
      </div>
    </div>
  );
}

if (!userId || !currentUser?._id) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-6 max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-300 mb-2">Chat Unavailable</h3>
        <p className="text-red-400">This chat is currently unavailable. Please try again later.</p>
      </div>
    </div>
  );
}
const handleRefresh = () => {
  refetch()
}

useEffect(() => {
  if (endRef.current) {
    endRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);


  return (
    <ChatLayout title="Messages" recipientName={friendName} recipientId={userId} onlineStatus="online">
      <div className="flex flex-col h-screen">
        <div className="flex-1 p-4 bg-gray-900 overflow-auto" ref={endRef}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400 p-8 bg-gray-800 rounded-lg border border-gray-700 max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-300 mb-2">No messages yet</p>
                <p className="text-sm text-gray-400">Send a message to start the conversation</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.sender._id === currentUser._id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      msg.sender._id === currentUser._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-100 border border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-6 w-6 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-gray-600">
                        {msg.sender.avatarUrl ? (
                          <img
                            src={msg.sender.avatarUrl || "/placeholder.svg"}
                            alt={msg.sender.name?.[0] || "U"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs bg-gray-700 text-gray-300">{msg.sender.name?.[0] || "U"}</span>
                        )}
                      </div>
                      <span className="font-medium text-sm">{msg.sender.name}</span>
                      <span className="text-xs opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-sm break-words">{msg.content}</div>
                    {!msg.isSystemMessage && <MessageReacts message={msg} currentUserId={currentUser._id} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="p-2 bg-red-900 bg-opacity-20 border border-red-800 text-red-400 text-sm mx-4 mb-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSend} className="p-4 border-t border-gray-700 bg-gray-800 flex gap-3 items-center">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Paperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Smile size={20} />
            </button>
          </div>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Mic size={20} />
          </button>
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !text.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </ChatLayout>
  )
}

