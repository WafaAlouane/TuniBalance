import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
               user: 'lew.reilly68@ethereal.email',
               pass: 'actka1XH3GM5FqZ9Kz'
            },
        });
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `http://yourapp.com/reset-password?token=${token}`;
        const mailOptions = {
            from: 'Auth-backend service',
            to,
            subject: 'Password Reset Request',
            html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
