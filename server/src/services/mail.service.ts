import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { SignupDto } from 'src/auth/dtos/signup.dto';
import { ConfigService } from '@nestjs/config';
import { UserRole } from 'src/auth/enums/role.enum';

@Injectable()
export class MailService {
    constructor(private readonly configService: ConfigService) {}

    emailTransport() {
      const transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST'),
        port: this.configService.get<number>('PORT'),
        secure: false,
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
      });
  
      return transporter;
    }
    async sendPasswordResetEmail(to: string, token: string) {
      const transport = this.emailTransport();
      // const resetLink = `http://localhost:5173/reset-password?token=${token}`; old working before
      const resetLink = `http://localhost:5173/?token=${token}`;

      const mailOptions: nodemailer.SendMailOptions = { 
          from: this.configService.get<string>('EMAIL_USER'),
          to,
          subject: 'Password Reset Request',
          html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                 <p><a href="${resetLink}">${resetLink}</a></p>`,
      };

      try {
          const info = await transport.sendMail(mailOptions);
          Logger.log(`Password reset email sent successfully: ${info.response}`);
      } catch (error) {
          Logger.error('Error sending password reset email:', error);
      }
  }
    // async sendPasswordResetEmail(to: string, token: string) {
    //     const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    //     const mailOptions = {
    //         from: 'Auth-backend service',
    //         to,
    //         subject: 'Password Reset Request',
    //         html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
    //     };
    
    //     try {
    //         const info = await this.transporter.sendMail(mailOptions);
    //         Logger.log('Email sent:', info);
    //     } catch (error) {
    //         Logger.error('Error sending email:', error);
    //     }
    // }

  
    async sendVerificationEmail(email: string, token: string) { 
        const transport = this.emailTransport();
        const confirmLink = `http://localhost:3001/auth/confirm-email?token=${token}`;

        const options: nodemailer.SendMailOptions = {
          from: this.configService.get<string>('EMAIL_USER'),
          to: email,
          subject: 'Email Verification',
          html: `<p>Click the link below to verify your email:</p>
                   <p><a href="${confirmLink}">${confirmLink}</a></p>`,
        };
        try {
          await transport.sendMail(options);
          console.log('Email sent successfully');
        } catch (error) {
          console.log('Error sending mail: ', error);
        }
      }


      async sendStaffCreationEmail(
        staffEmail: string,
        staffName: string,
        password: string,
        role: UserRole,
        businessOwnerName: string
      ) {
        const transport = this.emailTransport();
        const loginLink = `http://localhost:5173/login`;
      
        const mailOptions: nodemailer.SendMailOptions = {
          from: this.configService.get<string>('EMAIL_USER'),
          to: staffEmail,
          subject: 'Bienvenue dans notre équipe',
          html: `
            <p>Bonjour <strong>${staffName}</strong>,</p>
            <p>Vous avez été ajouté en tant que <strong>${role}</strong> par <strong>${businessOwnerName}</strong>.</p>
            <p>Voici vos informations de connexion :</p>
            <ul>
              <li><strong>Email :</strong> ${staffEmail}</li>
              <li><strong>Mot de passe :</strong> ${password}</li>
            </ul>
            <p>Vous pouvez vous connecter ici : <a href="${loginLink}">${loginLink}</a></p>
            <p>Merci et bienvenue !</p>
          `,
        };
      
        try {
          await transport.sendMail(mailOptions);
          Logger.log(`Email envoyé à ${staffEmail}`);
        } catch (error) {
          Logger.error('Erreur lors de l\'envoi de l\'email:', error);
        }
      }
      






    }