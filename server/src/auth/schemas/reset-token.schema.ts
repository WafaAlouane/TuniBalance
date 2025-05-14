import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import mongoose from 'mongoose';

@Schema({ versionKey:false,timestamps: true })  // Adds createdAt and updatedAt fields
export class ResetToken extends Document {
  
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId})
  userId: string;  // Reference to the User model

  @Prop({ required: true })
  token: string;  // The reset token string

  @Prop({ required: true}) 
  expiryDate: Date;  // Token expiration (default 1 hour)
}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);
