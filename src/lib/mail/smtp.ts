import nodemailer from "nodemailer";
import type { MailService, SendMailOptions } from "./types";

export class SmtpMailService implements MailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    this.from = process.env.MAIL_FROM || "Assos Karadut Taş Otel <karaduttas@gmail.com>";
  }

  async send(options: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
}
