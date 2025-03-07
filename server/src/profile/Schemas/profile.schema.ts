import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type ProfileDocument = Profile & Document;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: String, ref: 'User', required: true, unique: true })
  userId: string;

  @Prop({ type: String })
  companyName: string;

  @Prop({ type: String })
  bio: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: Date })
  companyCreationDate: Date;

  @Prop({ type: [String] })
  socialLinks: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);