import twilio from 'twilio';
import { SmsMessage, SmsProvider } from './SmsProvider';

export class TwilioProvider implements SmsProvider {
  private client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  async send(message: SmsMessage): Promise<string> {
    const res = await this.client.messages.create({
      to: message.to,
      from: process.env.TWILIO_FROM_NUMBER!,
      body: message.body
    });
    return res.sid;
  }
}
