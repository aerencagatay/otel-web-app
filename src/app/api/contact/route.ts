import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/utils/validation";
import { getMailService } from "@/lib/mail";
import {
  contactAdminNotificationEmail,
  contactAutoReplyEmail,
} from "@/lib/mail/templates";
import { reportServerError } from "@/lib/monitoring";
import { getClientIp, contactLimiter } from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

// Hatalar mesaj yerine KOD döndürür (client `apiErrors.*` ile çevirir) —
// rezervasyon/availability route'larıyla aynı i18n yaklaşımı.
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const rateLimitResult = await contactLimiter.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "rateLimit" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalidData", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    // Otomatik yanıt dili (payload'dan; varsayılan tr). Admin maili hep TR.
    const guestLocale: "tr" | "en" = body?.locale === "en" ? "en" : "tr";

    const turnstileResult = await verifyTurnstileToken(data.turnstileToken, ip);
    if (!turnstileResult.success) {
      if (turnstileResult.reason === "no-secret-configured") {
        return NextResponse.json(
          { error: "contactUnavailable" },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: "securityFailed" }, { status: 403 });
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
      return NextResponse.json({ error: "contactSendFailed" }, { status: 502 });
    }

    try {
      const autoReply = contactAutoReplyEmail({
        name: data.name,
        locale: guestLocale,
      });
      await mail.send({ to: data.email, ...autoReply });
    } catch (mailErr) {
      console.error("Failed to send contact auto-reply:", mailErr);
      await reportServerError(mailErr, { stage: "contact_auto_reply" });
      // Don't fail the request — the admin already received the message.
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    await reportServerError(err, { stage: "contact_submit" });
    return NextResponse.json({ error: "contactError" }, { status: 500 });
  }
}
