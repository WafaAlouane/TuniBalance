import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';


// Define the Reaction class with the necessary properties
@Schema()
class Reaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true, enum: ['❤️', '👍', '😊', '😂', '😮'] })
  type: string;
}

// Define the PrivateMessage schema with reactions as an array of Reaction objects
@Schema({ timestamps: true })
export class PrivateMessage extends Document {
  
  @Prop({ required: function() { return !this.isVoiceMessage; } })
    content: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: Types.ObjectId;
  
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    recipient: Types.ObjectId;
  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: false })
  isSystemMessage: boolean;
  // Define reactions as an array of Reaction objects
  @Prop({ 
    type: [Reaction], 
    default: [],
    required: false // Rendre explicitement optionnel
  })
  reactions?: Reaction[];

  
  @Prop({ type: String })
  audioUrl?: string;

  @Prop({ type: Number })
  duration?: number;

  @Prop({ type: Boolean, default: false })
  isVoiceMessage: boolean;

  @Prop({
    type: {
      content: String,
      sender: { type: Types.ObjectId, ref: 'User' }
    },
    required: false
  })
  replyTo?: {
    content: string;
    sender: Types.ObjectId;
  };

  @Prop({ default: false })
  isDeleted: boolean;
}
export type PrivateMessageDocument = PrivateMessage & Document;

export const PrivateMessageSchema = SchemaFactory.createForClass(PrivateMessage);
