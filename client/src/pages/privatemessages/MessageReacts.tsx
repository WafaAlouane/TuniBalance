// src/pages/privatemessages/MessageReacts.tsx
import React from 'react';
import { useRemoveReactionMutation, useAddReactionMutation } from '../../services/privateMessagesApi';
import { socketService } from '../../services/socketService';

interface Reaction {
  user: string;
  type: string;
}

interface MessageReactsProps {
  message: {
    _id: string;
    reactions?: Reaction[];
  };
  currentUserId: string;
}

const MessageReacts: React.FC<MessageReactsProps> = ({ message, currentUserId }) => {
  const [removeReaction] = useRemoveReactionMutation();
  const [addReaction] = useAddReactionMutation();

  const handleReactionClick = async (type: string) => {
    try {
      const existingReaction = (message.reactions || []).find(r => r.user === currentUserId && r.type === type);

      if (existingReaction) {
        await removeReaction(message._id).unwrap();
        socketService.socket?.emit('reaction:removed', {
          messageId: message._id,
          userId: currentUserId,
          type
        });
      } else {
        await addReaction({ messageId: message._id, type }).unwrap();
        socketService.socket?.emit('reaction:added', {
          messageId: message._id,
          userId: currentUserId,
          type
        });
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  // Regrouper les réactions par type
  const reactionCounts = (message.reactions || []).reduce((acc, reaction) => {
    acc[reaction.type] = (acc[reaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {Object.entries(reactionCounts).map(([type, count]) => (
        <button
          key={type}
          onClick={() => handleReactionClick(type)}
          className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
            (message.reactions || []).some(r => r.user === currentUserId && r.type === type)
              ? 'bg-blue-900 text-blue-300 border border-blue-700'
              : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
          }`}
        >
          {type} {count}
        </button>
      ))}
      <button
        className="px-2 py-0.5 rounded-full text-xs bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 transition-colors"
        onClick={() => handleReactionClick('👍')}
      >
        + Add
      </button>
    </div>
  );
};

export default MessageReacts;


/*import React from 'react';
import { PrivateMessage, User } from '../../types/user';

import { useRemoveReactionMutation,useAddReactionMutation } from '../../services/privateMessagesApi';
import { socketService } from '../../services/socketService';
interface MessageReactsProps {
    message: PrivateMessage;
    currentUserId: string;
  }


  const MessageReacts: React.FC<MessageReactsProps> = ({ message, currentUserId }) => {
    const [removeReaction, { isLoading: isRemoving }] = useRemoveReactionMutation();
    const [addReaction, { isLoading: isAdding }] = useAddReactionMutation();

    const handleReactionClick = async (type: string) => {
      if (isRemoving || isAdding) return;

      try {
        await addReaction({ messageId: message._id, type }).unwrap();
        const existingReaction = message.reactions?.find(
          reaction => reaction.user.toString() === currentUserId && reaction.type === type
        );

        if (existingReaction) {
          const result = await removeReaction({ messageId: message._id }).unwrap();
          socketService.socket?.emit('reactionRemoved', {
            messageId: message._id,
            type: type,
            userId: currentUserId
          });
        } else {
          const result = await addReaction({ messageId: message._id, type }).unwrap();
          socketService.socket?.emit('reactionAdded', {
            messageId: message._id,
            type: type,
            userId: currentUserId
          });
        }
        socketService.socket?.emit('reaction:added', { messageId: message._id });
      } catch (error) {
        console.error('Error handling reaction:', error);
      }
    };


    // Group reactions by type
    const reactionCounts = message.reactions?.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return (
      <div className="message-reactions">
        <div className="existing-reactions">
          {Object.entries(reactionCounts).map(([type, count]) => (
            <button
              key={type}
              disabled={isRemoving || isAdding}
              className={`reaction-badge ${
                message.reactions?.some(r => r.user.toString() === currentUserId && r.type === type)
                  ? 'active'
                  : ''
              } ${(isRemoving || isAdding) ? 'opacity-50' : ''}`}
              onClick={() => handleReactionClick(type)}
            >
              {type} {count}
            </button>
          ))}
        </div>
      </div>
    );
  };

  export default MessageReacts;*/