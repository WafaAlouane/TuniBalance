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
        user: 'marvin11@ethereal.email',
        pass: 'ZK8jpBMHHqd9fp414s'
            },
        });
    }
    async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `http://localhost:5173/BusinessOwner/change-password?token=${token}`;
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
}
