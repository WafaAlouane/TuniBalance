// appointment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../../src/auth/enums/role.enum';
import { User } from 'src/user/schemas/user.schema';
@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  senderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  start: Date;

  @Prop({ required: true })
  end: Date;

  @Prop({
    enum: ['meeting', 'fiscal_deadline', 'client_meeting'],
    default: 'meeting'
  })
  type: string;

  @Prop({ default: false })
  isFiscalDeadline: boolean;

  @Prop({ default: 'pending' })
  status: string;

  @Prop()
  meetLink: string;

  @Prop({ default: false })
  sendEmailNotification: boolean;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
export type AppointmentDocument = Appointment & Document;