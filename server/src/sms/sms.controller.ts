import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
@Controller('sms')
export class SmsController {
    constructor(private readonly SmsService: SmsService) {}

    @Post('sendsms')
    async sendSMS(@Body() body: { to: string; message: string }) {
      return this.SmsService.sendSMS(body.to, body.message); // Correction : Ajout du message
    }



}
