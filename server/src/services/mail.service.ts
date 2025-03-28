import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
<<<<<<< HEAD
             user: 'cedrick.murphy95@ethereal.email',
               pass: 'Z53SKr2ptNnkWRYrQq'
=======
                user: 'eve89@ethereal.email',
        pass: 'bfwkXQKCqPcYE8QVKR'
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
            },
        });
    }
    async sendPasswordResetEmail(to: string, token: string) {
<<<<<<< HEAD
        const resetLink = `http://localhost:5173/BusinessOwner/change-password?token=${token}`;
=======
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
        const mailOptions = {
            from: 'Auth-backend service',
            to,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
        };
    
        try {
            const info = await this.transporter.sendMail(mailOptions);
            Logger.log('Email sent:', info);
        } catch (error) {
            Logger.error('Error sending email:', error);
        }
    }

    
    async sendVerificationEmail(to: string, token: string) {
        const confirmLink = `http://localhost:5173/BusinessOwner/confirm-email?token=${token}`;
        const mailOptions = {
            from: 'Auth-backend service',
            to,
            subject: 'Email Verification',
            html: `<p>Click the link below to verify your email:</p>
                   <p><a href="${confirmLink}">${confirmLink}</a></p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
