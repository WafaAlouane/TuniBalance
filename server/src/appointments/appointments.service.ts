import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentDocument } from '../appointments/appointments.schema';
import { MailService } from '../services/mail.service';
import { UsersService } from '../user/user.service';

@Injectable()
export class AppointmentsService {
    private readonly logger = new Logger(AppointmentsService.name);

    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
        private mailService: MailService,
        private usersService: UsersService
      ) {}

      async create(appointmentData: any) {
        const newAppointment = new this.appointmentModel(appointmentData);
        const savedAppointment = await newAppointment.save();

        // Send email notification if requested
        if (appointmentData.sendEmailNotification && appointmentData.meetLink) {
          await this.sendMeetingInvitation(savedAppointment);
        }

        return savedAppointment;
      }

      async sendMeetingInvitation(appointment: AppointmentDocument) {
        try {
          // Get sender and receiver information
          const sender = await this.usersService.findById(appointment.senderId.toString());
          const receiver = await this.usersService.findById(appointment.receiverId.toString());

          if (!receiver || !receiver.email) {
            this.logger.error(`Cannot send invitation: Receiver not found or has no email`);
            return;
          }

          // Format dates for display
          const startDate = appointment.start ? new Date(appointment.start).toLocaleString() : 'Not specified';
          const endDate = appointment.end ? new Date(appointment.end).toLocaleString() : 'Not specified';

          // Send the email
          await this.sendCalendarInvitationEmail(
            receiver.email,
            receiver.name,
            sender.name,
            appointment.title,
            startDate,
            endDate,
            appointment.meetLink
          );

          this.logger.log(`Meeting invitation sent to ${receiver.email}`);
        } catch (error) {
          this.logger.error(`Error sending meeting invitation: ${error.message}`);
        }
      }

      async sendCalendarInvitationEmail(
        recipientEmail: string,
        recipientName: string,
        senderName: string,
        meetingTitle: string,
        startDate: string,
        endDate: string,
        meetLink: string
      ) {
        const transport = this.mailService.emailTransport();

        // Get the configured email from environment
        const fromEmail = this.mailService.getEmailUser();

        this.logger.log(`Preparing to send email from ${fromEmail} to ${recipientEmail}`);

        const mailOptions = {
          from: `TuniBalance <${fromEmail}>`,
          to: recipientEmail,
          subject: `Meeting Invitation: ${meetingTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="background: linear-gradient(to right, #4a6cf7, #6a3ef7); padding: 15px; border-radius: 5px 5px 0 0;">
                <h2 style="color: white; margin: 0;">Meeting Invitation</h2>
              </div>

              <div style="padding: 20px;">
                <p>Hello <strong>${recipientName}</strong>,</p>
                <p><strong>${senderName}</strong> has invited you to a meeting: <strong>${meetingTitle}</strong></p>

                <div style="background-color: #f5f5f5; border-left: 4px solid #4a6cf7; padding: 15px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>Meeting Details:</strong></p>
                  <p style="margin: 5px 0;"><strong>Title:</strong> ${meetingTitle}</p>
                  <p style="margin: 5px 0;"><strong>Start:</strong> ${startDate}</p>
                  <p style="margin: 5px 0;"><strong>End:</strong> ${endDate}</p>
                </div>

                <div style="background-color: #e8f4fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>Google Meet Link:</strong></p>
                  <p style="margin: 10px 0;">
                    <a href="${meetLink}" style="display: inline-block; background-color: #2196f3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                      Join Meeting
                    </a>
                  </p>
                  <p style="margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px;">
                    ${meetLink}
                  </p>
                </div>

                <p>Please click the link above to join the meeting at the scheduled time.</p>
                <p>Thank you,<br>TuniBalance Team</p>
              </div>

              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; color: #666;">
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          `
        };

        try {
          // Verify the transport connection before sending
          this.logger.log('Verifying email transport connection...');
          await transport.verify();
          this.logger.log('Email transport connection verified successfully');

          // Send the email
          this.logger.log('Sending calendar invitation email...');
          const info = await transport.sendMail(mailOptions);

          // Log detailed information about the sent email
          this.logger.log(`Calendar invitation email sent to ${recipientEmail}`);
          this.logger.log(`Email response: ${JSON.stringify(info)}`);

          return info;
        } catch (error) {
          this.logger.error(`Error sending calendar invitation email: ${error.message}`);
          this.logger.error(`Full error: ${JSON.stringify(error)}`);

          // Don't throw the error, just log it to prevent the appointment creation from failing
          return null;
        }
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