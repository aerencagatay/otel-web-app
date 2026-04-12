import type { MailService } from "./types";
import { ResendMailService } from "./resend";
import { SmtpMailService } from "./smtp";

let mailService: MailService | null = null;

export function getMailService(): MailService {
  if (mailService) return mailService;

  if (process.env.RESEND_API_KEY) {
    mailService = new ResendMailService();
  } else if (process.env.SMTP_USER) {
    mailService = new SmtpMailService();
  } else {
    // Fallback: log-only service for development
    mailService = {
      async send(options) {
        console.log("[MAIL] Would send:", options.to, options.subject);
      },
    };
  }

  return mailService;
}
