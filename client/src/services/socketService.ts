import { io, Socket } from 'socket.io-client';
import { store } from '../redux/store.ts';
import { FriendRequest, friendRequestActions  } from '../redux/slices/friendRequestSlice.ts';

import {PrivateMessage, User} from '../types/user';
import { privateMessagesApi } from './privateMessagesApi.ts';
import { RootState } from '../redux/types.ts';

class SocketService {
  public  socket: Socket | null = null;

  connect(token: string) {
    this.socket = io('http://localhost:3001',{
      auth: { token },
      transports: ['websocket']
    });

    this.setupListeners();
  }
  public listenForPrivateMessages(callback: (message: any) => void) {
    this.socket?.on('private-message:new', callback);
  }
  
  public stopListeningForPrivateMessages(handleNewMessage: (message: PrivateMessage) => void) {
    this.socket?.off('private-message:new');
  }
  
  public listenForMessageDeleted(callback: (messageId: string) => void) {
    this.socket?.on('messageDeleted', callback);
  }
  
  public stopListeningForMessageDeleted() {
    this.socket?.off('messageDeleted');
  }
  
  public listenForMessageEdited(callback: (message: any) => void) {
    this.socket?.on('messageEdited', callback);
  }
  
  public stopListeningForMessageEdited() {
    this.socket?.off('messageEdited');
  }
  
  public emitMessageDeleted(messageId: string) {
    this.socket?.emit('messageDeleted', messageId);
  }
  
  public emitMessageEdited(message: any) {
    this.socket?.emit('messageEdited', message);
  }
  public setupListeners() {
    if (!this.socket) return;

    // Friend requests
    this.socket.on('friend-request:new', (request: FriendRequest) => {
      store.dispatch(friendRequestActions.addRequest(request));
    });

    this.socket.on('friend-request:accepted', (data: { requestId: string; friend: User }) => {
      store.dispatch(friendRequestActions.removeRequest(data.requestId));
      store.dispatch(friendRequestActions.addFriend(data.friend));
    });

    this.socket.on('friend-request:cancelled', (requestId: string) => {
      store.dispatch(friendRequestActions.removeRequest(requestId));
    });

    this.socket?.on('private-message:new', (message: PrivateMessage) => {
      // Cast explicite du state
      const state = store.getState() as { 
        auth: { 
          user?: { 
            _id: string 
          } 
        } 
      };
      
      const currentUserId = state.auth.user?._id;
      
      if (!currentUserId) return;
    
      const recipientId = message.sender._id === currentUserId 
        ? message.recipient._id 
        : message.sender._id;
      
      store.dispatch(privateMessagesApi.util.updateQueryData(
        'getMessagesWithUser',
        recipientId,
        (draft) => {
          if (!draft.some(m => m._id === message._id)) {
            draft.push(message);
          }
        }
      ));
    });


    this.socket?.on('private-message:updated', (updated: { messageId: string; content: string }) => {
      store.dispatch(privateMessagesApi.util.updateQueryData(
        'getMessagesWithUser',
        updated.messageId, // À remplacer par le bon recipientId
        (draft) => {
          const index = draft.findIndex(m => m._id === updated.messageId);
          if (index !== -1) draft[index].content = updated.content;
        }
      ));
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }

  sendFriendRequest(recipientId: string) {
    this.socket?.emit('friend-request:send', { recipientId });
  }

  acceptFriendRequest(requestId: string) {
    this.socket?.emit('friend-request:accept', { requestId });
  }

  sendPrivateMessage(recipientId: string, content: string) {
    this.socket?.emit('private-message:send', { recipientId, content });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
}

export const socketService = new SocketService();