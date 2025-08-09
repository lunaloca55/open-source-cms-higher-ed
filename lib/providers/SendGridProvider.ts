import sgMail from '@sendgrid/mail';
import { EmailMessage, EmailProvider } from './EmailProvider';

export class SendGridProvider implements EmailProvider {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }
  async send(message: EmailMessage): Promise<string> {
    const res = await sgMail.send({
      to: message.to,
      from: 'no-reply@example.com',
      subject: message.subject,
      html: message.html
    });
    return res[0].headers['x-message-id'] as string;
  }
}
