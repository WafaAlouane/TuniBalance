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
                user: 'eve89@ethereal.email',
        pass: 'bfwkXQKCqPcYE8QVKR'
            },
        });
    }
    async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
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
}