// src/components/chat/ChatWindow.tsx
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/types';
import { 
  useGetMessagesWithUserQuery,
  useSendPrivateMessageMutation,
  useMarkMessagesAsReadMutation
} from '../../services/privateMessagesApi';

const ChatWindow = () => {
  const { friendId } = useParams();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [message, setMessage] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], refetch } = useGetMessagesWithUserQuery(friendId!);
  const [sendMessage] = useSendPrivateMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();

  useEffect(() => {
    if (friendId) {
      markAsRead(friendId);
      scrollToBottom();
    }
  }, [friendId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !friendId) return;

    await sendMessage({
      recipientId: friendId,
      content: message
    });
    
    setMessage('');
    refetch();
    scrollToBottom();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-4 ${msg.sender._id === currentUser?._id ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                msg.sender._id === currentUser?._id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              <p>{msg.content}</p>
              {msg.isVoiceMessage && (
                <audio controls src={msg.audioUrl}>
                  Your browser does not support audio
                </audio>
              )}
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;