import { Resend } from "resend";
import type { MailService, SendMailOptions } from "./types";

export class ResendMailService implements MailService {
  private client: Resend;
  private from: string;

  constructor() {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY not set");
    this.client = new Resend(key);
    this.from = process.env.MAIL_FROM || "Assos Karadut Taş Otel <noreply@karaduttasotel.com>";
  }

  async send(options: SendMailOptions): Promise<void> {
    await this.client.emails.send({
      from: this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
