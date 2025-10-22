import { Injectable, Logger } from '@nestjs/common';

export type EmailMessage = {
  to: string;
  subject: string;
  body: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  enqueueEmail(message: EmailMessage) {
    this.logger.log(`Email enfileirado para ${message.to}`);
    return { status: 'queued' };
  }
}
