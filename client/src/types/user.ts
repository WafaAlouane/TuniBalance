export enum UserRole {
  BUSINESS_OWNER = 'business_owner',
  FINANCIER = 'financier',
  ACCOUNTANT = 'accountant', // Remplacer "comptable" par "accountant"
  ADMIN = 'admin',
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber: string;}
  
  export interface PrivateMessage {
    _id: string;
    content: string;
    sender: {
      _id: string;
      name: string;
      avatarUrl?: string;
    };
    recipient: {
      _id: string;
      name: string;
      avatarUrl?: string;
    };
    isSystemMessage?: boolean;
   
    createdAt: string;
    updatedAt: string;
    reactions?: Reaction[];
    isRead?: boolean;
    audioUrl?: string;
    duration?: number;
    isVoiceMessage?: boolean;
    replyTo?: ReplyToMessage;
  }
  
  export interface Reaction {
    type: string;
    user: string;
    _id?: string;
  }
  
  export interface ReplyToMessage {
    _id: string;
    content: string;
    sender: User;
  }