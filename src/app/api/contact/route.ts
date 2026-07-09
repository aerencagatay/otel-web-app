import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/utils/validation";
import { getMailService } from "@/lib/mail";
import {
  contactAdminNotificationEmail,
  contactAutoReplyEmail,
} from "@/lib/mail/templates";
import { reportServerError } from "@/lib/monitoring";
import {
  getClientIp,
  contactLimiter,
  RATE_LIMIT_MESSAGE,
} from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const rateLimitResult = await contactLimiter.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz bilgiler.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const turnstileResult = await verifyTurnstileToken(data.turnstileToken, ip);
    if (!turnstileResult.success) {
      if (turnstileResult.reason === "no-secret-configured") {
        return NextResponse.json(
          {
            error:
              "İletişim formu şu anda geçici olarak kullanılamıyor. Lütfen bizi telefonla arayın veya daha sonra tekrar deneyin.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error:
            "Güvenlik doğrulaması başarısız oldu. Lütfen sayfayı yenileyip tekrar deneyin.",
        },
        { status: 403 }
      );
    }

    const mail = getMailService();
    const adminEmail = process.env.ADMIN_EMAIL;

    try {
      if (adminEmail) {
        const adminTemplate = contactAdminNotificationEmail({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          subject: data.subject,
          message: data.message,
        });
        await mail.send({ to: adminEmail, ...adminTemplate });
      }
    } catch (mailErr) {
      console.error("Failed to send contact admin email:", mailErr);
      await reportServerError(mailErr, { stage: "contact_admin_email" });
      // Admin mail failing is server-side; still tell the guest we failed so
      // they don't think their message went through when it may not have.
      return NextResponse.json(
        {
          error:
            "Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin veya bizi telefonla arayın.",
        },
        { status: 502 }
      );
    }

    try {
      const autoReply = contactAutoReplyEmail({ name: data.name });
      await mail.send({ to: data.email, ...autoReply });
    } catch (mailErr) {
      console.error("Failed to send contact auto-reply:", mailErr);
      await reportServerError(mailErr, { stage: "contact_auto_reply" });
      // Don't fail the request — the admin already received the message.
    }

    return NextResponse.json({
      message: "Mesajınız başarıyla iletildi.",
    });
  } catch (err) {
    console.error("Contact form error:", err);
    await reportServerError(err, { stage: "contact_submit" });
    return NextResponse.json(
      { error: "Mesajınız gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
