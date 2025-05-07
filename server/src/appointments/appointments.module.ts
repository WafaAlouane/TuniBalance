import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '../appointments/appointments.schema';
import { MailService } from '../services/mail.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
    ConfigModule,
    UserModule
  ],
  providers: [AppointmentsService, MailService],
  controllers: [AppointmentsController]
})
export class AppointmentsModule {}
