import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from '../appointments/appointments.schema';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>
      ) {}
    
      async create(appointmentData: any) {
        const newAppointment = new this.appointmentModel(appointmentData);
        return newAppointment.save();
      }
    
      async getUserAppointments(userId: Types.ObjectId) {
        return this.appointmentModel.find({
          $or: [
            { senderId: userId }, 
            { receiverId: userId }
          ]
        }).populate('senderId receiverId', 'name email role');
      }
    
      async getFiscalDeadlines() {
        return this.appointmentModel.find({
          isFiscalDeadline: true
        });
      }
    
      async updateAppointment(id: string, updateData: any) {
        return this.appointmentModel.findByIdAndUpdate(id, updateData, { new: true });
      }
    
      async deleteAppointment(id: string) {
        return this.appointmentModel.findByIdAndDelete(id);
      }
    }