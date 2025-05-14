import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '../guards/auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import { UserDocument } from 'src/user/schemas/user.schema';
import { CreateAppointmentDto } from './create-appointment.dto';


@Controller('appointments')
@UseGuards(AuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() appointmentData: any, @GetUser() user: UserDocument & { _id: Types.ObjectId }) {
    try {
      // Manual conversion of string dates to Date objects
      const processedData = {
        ...appointmentData,
        senderId: user._id,
        // Convert receiverId to ObjectId if it's a string
        receiverId:
          typeof appointmentData.receiverId === "string"
            ? new Types.ObjectId(appointmentData.receiverId)
            : appointmentData.receiverId,
        // Convert dates to Date objects
        start: new Date(appointmentData.start),
        end: new Date(appointmentData.end),
      }

      // Validate dates
      if (isNaN(processedData.start.getTime()) || isNaN(processedData.end.getTime())) {
        throw new BadRequestException("Les dates de début et de fin doivent être valides")
      }

      return this.appointmentsService.create(processedData)
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new BadRequestException(`Erreur lors de la création du rendez-vous: ${error.message}`)
    }
  }

  @Get()
  getUserAppointments(@GetUser() user: UserDocument & { _id: Types.ObjectId }) {
    return this.appointmentsService.getUserAppointments(user._id);
  }

  @Get("fiscal-deadlines")
  getFiscalDeadlines() {
    return this.appointmentsService.getFiscalDeadlines()
  }

  @Put(":id")
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.appointmentsService.updateAppointment(id, updateData)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.appointmentsService.deleteAppointment(id);
  }
}

