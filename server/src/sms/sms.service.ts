import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();
@Injectable()
export class SmsService {  private readonly baseURL = process.env.INFOBIP_BASE_URL;
    private readonly apiKey = process.env.INFOBIP_API_KEY;
    private readonly senderSMS = process.env.INFOBIP_SENDER_SMS;
  
    constructor() {
        console.log('INFOBIP_BASE_URL:', this.baseURL);
    console.log('INFOBIP_API_KEY:', this.apiKey ? 'Loaded' : 'Missing');
    console.log('INFOBIP_SENDER_SMS:', this.senderSMS);
    }
  
    async sendSMS(to: string, message: string): Promise<any> {
        try {
          // Vérifier si le numéro contient déjà l'indicatif, sinon l'ajouter
          if (!to.startsWith('+')) {
            to = `+216${to}`;
          }
    
          const response = await axios.post(
            `${this.baseURL}/sms/2/text/advanced`,
            {
              messages: [
                {
                  from: this.senderSMS,
                  destinations: [{ to }],
                  text: message,
                },
              ],
            },
            {
              headers: {
                Authorization: `App ${this.apiKey}`,
                'Content-Type': 'application/json',
              },
            }
          );
    
          console.log('SMS sent:', response.data);
          return response.data;
        } catch (error) {
          console.error('Error sending SMS:', error.response?.data || error.message);
          throw error;
        }
      }
    }
    