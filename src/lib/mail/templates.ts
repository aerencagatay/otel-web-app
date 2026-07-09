import { HOTEL, RESERVATION_HOLD_HOURS } from "../config/hotel";
import { formatDate, formatDateTR } from "../utils/dates";

export type MailLocale = "tr" | "en";

/**
 * Escapes HTML-significant characters so user-supplied strings (name,
 * notes, etc.) can't inject markup/scripts into outgoing HTML emails.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Misafire giden e-postaların iki dilli metinleri. Admin bildirimleri her
 * zaman Türkçedir (aşağıdaki adminNotificationEmail); burada yer almaz.
 */
const T = {
  tr: {
    pendingSubject: (id: string) => `Rezervasyon Alındı - ${id} | ${HOTEL.name}`,
    pendingHeading: "Rezervasyonunuz Alındı",
    dear: "Sayın",
    pendingIntro: `Rezervasyon talebiniz başarıyla oluşturulmuştur. Kesinleşmesi için aşağıdaki kapora ödemesini <strong>${RESERVATION_HOLD_HOURS} saat içinde</strong> yapmanız gerekmektedir. Bu süre içinde kapora onaylanmazsa rezervasyonunuz otomatik olarak iptal edilir.`,
    resNo: "Rezervasyon No",
    room: "Oda",
    checkIn: "Giriş",
    checkOut: "Çıkış",
    duration: "Süre",
    nights: (n: number) => `${n} gece`,
    depositTitle: "Kapora Bilgileri",
    amount: "Tutar",
    iban: "IBAN",
    recipient: "Alıcı",
    description: "Açıklama",
    warnRef: "⚠ Havale açıklamasına mutlaka rezervasyon numaranızı yazınız.",
    lookupLinkText: "Rezervasyon durumunuzu buradan takip edebilirsiniz:",
    questions: "Sorularınız için:",
    expiredSubject: (id: string) =>
      `Rezervasyon talebiniz iptal edildi - ${id} | ${HOTEL.name}`,
    expiredHeading: "Rezervasyon Talebiniz İptal Edildi",
    expiredIntro: (id: string) =>
      `<strong>${id}</strong> numaralı rezervasyon talebiniz, ${RESERVATION_HOLD_HOURS} saat içinde kapora ödemesi onaylanmadığı için otomatik olarak iptal edilmiştir. Seçtiğiniz tarihler yeniden müsait hale gelmiştir.`,
    expiredReassureTitle: "Kaporayı zaten gönderdiyseniz lütfen endişelenmeyin.",
    expiredReassureText:
      "Ödemeniz bize ulaşmış ancak rezervasyonunuz sehven iptal edilmiş olabilir. Bu durumda lütfen bizi arayın; rezervasyonunuzu hemen yeniden oluşturup kesinleştirelim. Kaporanız güvendedir.",
    expiredOutro:
      "Konaklamak isterseniz tekrar rezervasyon yapabilir veya doğrudan bizimle iletişime geçebilirsiniz.",
    callUs: "Bizi arayın:",
    confirmedSubject: (id: string) =>
      `Rezervasyonunuz Kesinleşti - ${id} | ${HOTEL.name}`,
    confirmedHeading: "Rezervasyonunuz Kesinleşti!",
    confirmedIntro:
      "Kapora ödemeniz onaylanmış ve rezervasyonunuz kesinleşmiştir. Sizi otelimizde ağırlamaktan mutluluk duyacağız.",
    confirmedOutro: "İyi tatiller dileriz!",
  },
  en: {
    pendingSubject: (id: string) => `Reservation Received - ${id} | ${HOTEL.name}`,
    pendingHeading: "Your Reservation Has Been Received",
    dear: "Dear",
    pendingIntro: `Your reservation request has been created successfully. To confirm it, you need to make the deposit payment below <strong>within ${RESERVATION_HOLD_HOURS} hours</strong>. If the deposit is not confirmed within that time, your reservation is cancelled automatically.`,
    resNo: "Reservation No.",
    room: "Room",
    checkIn: "Check-in",
    checkOut: "Check-out",
    duration: "Duration",
    nights: (n: number) => `${n} night${n === 1 ? "" : "s"}`,
    depositTitle: "Deposit Details",
    amount: "Amount",
    iban: "IBAN",
    recipient: "Recipient",
    description: "Description",
    warnRef:
      "⚠ Please be sure to write your reservation number in the transfer description.",
    lookupLinkText: "You can track your reservation status here:",
    questions: "For questions:",
    expiredSubject: (id: string) =>
      `Your reservation request has been cancelled - ${id} | ${HOTEL.name}`,
    expiredHeading: "Your Reservation Request Has Been Cancelled",
    expiredIntro: (id: string) =>
      `Your reservation request <strong>${id}</strong> has been cancelled automatically because the deposit was not confirmed within ${RESERVATION_HOLD_HOURS} hours. Your selected dates are available again.`,
    expiredReassureTitle: "If you have already sent the deposit, please don't worry.",
    expiredReassureText:
      "Your payment may have reached us while your reservation was cancelled by mistake. In that case, please call us; we'll recreate and confirm your reservation right away. Your deposit is safe.",
    expiredOutro:
      "If you'd still like to stay, you can book again or contact us directly.",
    callUs: "Call us:",
    confirmedSubject: (id: string) =>
      `Your Reservation Is Confirmed - ${id} | ${HOTEL.name}`,
    confirmedHeading: "Your Reservation Is Confirmed!",
    confirmedIntro:
      "Your deposit payment has been approved and your reservation is confirmed. We look forward to welcoming you to our hotel.",
    confirmedOutro: "We wish you a pleasant stay!",
  },
} as const;

const shell = (bodyHtml: string) => `
      <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;color:#555;">
        <div style="background:#1a1a1a;padding:32px;text-align:center;">
          <h1 style="color:#e4a00e;font-family:'Playfair Display',Georgia,serif;margin:0;">${HOTEL.name}</h1>
        </div>
        <div style="padding:32px;border:1px solid #e8e2d9;border-top:none;">
          ${bodyHtml}
        </div>
        <div style="background:#252525;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,0.45);">
          ${HOTEL.name} · ${HOTEL.address}
        </div>
      </div>
    `;

export function pendingReservationEmail(data: {
  reservationId: string;
  firstName: string;
  lastName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomLabel: string;
  depositAmount: number;
  locale?: MailLocale;
}): { subject: string; html: string } {
  const locale = data.locale ?? "tr";
  const m = T[locale];
  const lookupUrl = `${HOTEL.website}${locale === "en" ? "/en" : ""}/rezervasyon-sorgula`;
  return {
    subject: m.pendingSubject(data.reservationId),
    html: shell(`
          <h2 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;">${m.pendingHeading}</h2>
          <p>${m.dear} ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>
          <p>${m.pendingIntro}</p>

          <div style="background:#faf8f5;border-left:3px solid #e4a00e;padding:16px 20px;margin:20px 0;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#888;">${m.resNo}</td><td style="font-weight:700;color:#1a1a1a;">${data.reservationId}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.room}</td><td style="font-weight:700;color:#1a1a1a;">${data.roomLabel}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.checkIn}</td><td style="font-weight:700;color:#1a1a1a;">${formatDate(data.checkIn, locale)} · 14:00</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.checkOut}</td><td style="font-weight:700;color:#1a1a1a;">${formatDate(data.checkOut, locale)} · 12:00</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.duration}</td><td style="font-weight:700;color:#1a1a1a;">${m.nights(data.nights)}</td></tr>
            </table>
          </div>

          <h3 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;">${m.depositTitle}</h3>
          <div style="background:#faf8f5;padding:16px 20px;margin:12px 0;border:1px solid #e8e2d9;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#888;">${m.amount}</td><td style="font-weight:700;color:#e4a00e;font-size:18px;">${data.depositAmount.toLocaleString("tr-TR")} ₺</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.iban}</td><td style="font-weight:700;color:#1a1a1a;font-family:monospace;">${HOTEL.iban}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.recipient}</td><td style="font-weight:700;color:#1a1a1a;">${HOTEL.ibanHolder}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.description}</td><td style="font-weight:700;color:#e4a00e;">${data.reservationId}</td></tr>
            </table>
          </div>

          <p style="color:#c00;font-size:13px;">${m.warnRef}</p>

          <p>${m.lookupLinkText} <a href="${lookupUrl}" style="color:#e4a00e;">${lookupUrl}</a></p>

          <p>${m.questions} <a href="tel:${HOTEL.phone.replace(/\s/g, "")}" style="color:#e4a00e;">${HOTEL.phone}</a></p>
    `),
  };
}

export function expiredReservationEmail(data: {
  reservationId: string;
  firstName: string;
  lastName: string;
  locale?: MailLocale;
}): { subject: string; html: string } {
  const locale = data.locale ?? "tr";
  const m = T[locale];
  return {
    subject: m.expiredSubject(data.reservationId),
    html: shell(`
          <h2 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;">${m.expiredHeading}</h2>
          <p>${m.dear} ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>
          <p>${m.expiredIntro(data.reservationId)}</p>

          <div style="background:#faf8f5;border-left:3px solid #e4a00e;padding:16px 20px;margin:20px 0;">
            <p style="margin:0 0 6px;color:#1a1a1a;font-weight:700;">${m.expiredReassureTitle}</p>
            <p style="margin:0;">${m.expiredReassureText}</p>
          </div>

          <p>${m.expiredOutro}</p>
          <p style="font-size:16px;">${m.callUs} <a href="tel:${HOTEL.phone.replace(/\s/g, "")}" style="color:#e4a00e;font-weight:700;">${HOTEL.phone}</a></p>
    `),
  };
}

export function confirmedReservationEmail(data: {
  reservationId: string;
  firstName: string;
  lastName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomLabel: string;
  locale?: MailLocale;
}): { subject: string; html: string } {
  const locale = data.locale ?? "tr";
  const m = T[locale];
  return {
    subject: m.confirmedSubject(data.reservationId),
    html: shell(`
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:60px;height:60px;background:#d4edda;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
              <span style="font-size:28px;color:#28a745;">✓</span>
            </div>
          </div>
          <h2 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;text-align:center;">${m.confirmedHeading}</h2>
          <p>${m.dear} ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>
          <p>${m.confirmedIntro}</p>

          <div style="background:#faf8f5;border-left:3px solid #28a745;padding:16px 20px;margin:20px 0;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#888;">${m.resNo}</td><td style="font-weight:700;color:#1a1a1a;">${data.reservationId}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.room}</td><td style="font-weight:700;color:#1a1a1a;">${data.roomLabel}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.checkIn}</td><td style="font-weight:700;color:#1a1a1a;">${formatDate(data.checkIn, locale)} · 14:00</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.checkOut}</td><td style="font-weight:700;color:#1a1a1a;">${formatDate(data.checkOut, locale)} · 12:00</td></tr>
              <tr><td style="padding:4px 0;color:#888;">${m.duration}</td><td style="font-weight:700;color:#1a1a1a;">${m.nights(data.nights)}</td></tr>
            </table>
          </div>

          <p>${m.confirmedOutro}</p>
          <p>${m.questions} <a href="tel:${HOTEL.phone.replace(/\s/g, "")}" style="color:#e4a00e;">${HOTEL.phone}</a></p>
    `),
  };
}

export function adminNotificationEmail(data: {
  reservationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomLabel: string;
  adults: number;
  children: number;
  depositAmount: number;
  notes?: string;
}): { subject: string; html: string } {
  const adminUrl = `${HOTEL.website}/admin`;
  return {
    subject: `🟢 Yeni Web Rezervasyonu - ${data.reservationId} (Kapora Bekleniyor)`,
    html: `
      <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;color:#555;">
        <div style="background:#1a1a1a;padding:24px;text-align:center;">
          <h1 style="color:#e4a00e;font-family:'Playfair Display',Georgia,serif;margin:0;font-size:20px;">${HOTEL.name} · Yeni Rezervasyon</h1>
        </div>
        <div style="padding:28px;border:1px solid #e8e2d9;border-top:none;">
          <p style="margin-top:0;">Web üzerinden yeni bir rezervasyon geldi. Kapora ödemesi tarafınıza ulaştığında admin panelinden onaylayın.</p>

          <div style="background:#faf8f5;border-left:3px solid #e4a00e;padding:16px 20px;margin:20px 0;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#888;">Rezervasyon No</td><td style="font-weight:700;color:#1a1a1a;">${data.reservationId}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Misafir</td><td style="font-weight:700;color:#1a1a1a;">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Telefon</td><td style="font-weight:700;color:#1a1a1a;"><a href="tel:${encodeURIComponent(data.phone.replace(/\s/g, ""))}" style="color:#1a1a1a;">${escapeHtml(data.phone)}</a></td></tr>
              <tr><td style="padding:4px 0;color:#888;">E-posta</td><td style="font-weight:700;color:#1a1a1a;"><a href="mailto:${encodeURIComponent(data.email)}" style="color:#1a1a1a;">${escapeHtml(data.email)}</a></td></tr>
              <tr><td style="padding:4px 0;color:#888;">Oda</td><td style="font-weight:700;color:#1a1a1a;">${data.roomLabel}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Giriş</td><td style="font-weight:700;color:#1a1a1a;">${formatDateTR(data.checkIn)}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Çıkış</td><td style="font-weight:700;color:#1a1a1a;">${formatDateTR(data.checkOut)}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Süre</td><td style="font-weight:700;color:#1a1a1a;">${data.nights} gece</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Kişi</td><td style="font-weight:700;color:#1a1a1a;">${data.adults} yetişkin${data.children ? `, ${data.children} çocuk` : ""}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Beklenen Kapora</td><td style="font-weight:700;color:#e4a00e;">${data.depositAmount.toLocaleString("tr-TR")} ₺</td></tr>
              ${data.notes ? `<tr><td style="padding:4px 0;color:#888;">Not</td><td style="font-weight:700;color:#1a1a1a;">${escapeHtml(data.notes)}</td></tr>` : ""}
            </table>
          </div>

          <div style="text-align:center;margin:24px 0;">
            <a href="${adminUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 28px;font-weight:600;">Admin Panelini Aç</a>
          </div>

          <p style="font-size:13px;color:#888;">Kapora bu rezervasyon için takvimde <strong style="color:#1a8a3a;">yeşil</strong> olarak işaretlendi. Onayladığınızda <strong style="color:#c0392b;">kırmızıya</strong> dönecek ve misafire kesinleşme maili gidecek.</p>
        </div>
        <div style="background:#252525;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,0.45);">
          ${HOTEL.name} · ${HOTEL.address}
        </div>
      </div>
    `,
  };
}

export function contactAdminNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): { subject: string; html: string } {
  return {
    subject: `Yeni İletişim Mesajı — ${data.subject} | ${HOTEL.name}`,
    html: `
      <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;color:#555;">
        <div style="background:#1a1a1a;padding:24px;text-align:center;">
          <h1 style="color:#e4a00e;font-family:'Playfair Display',Georgia,serif;margin:0;font-size:20px;">${HOTEL.name} · İletişim Formu</h1>
        </div>
        <div style="padding:28px;border:1px solid #e8e2d9;border-top:none;">
          <div style="background:#faf8f5;border-left:3px solid #e4a00e;padding:16px 20px;margin:0 0 20px;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#888;">Ad Soyad</td><td style="font-weight:700;color:#1a1a1a;">${escapeHtml(data.name)}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">E-posta</td><td style="font-weight:700;color:#1a1a1a;"><a href="mailto:${encodeURIComponent(data.email)}" style="color:#1a1a1a;">${escapeHtml(data.email)}</a></td></tr>
              ${data.phone ? `<tr><td style="padding:4px 0;color:#888;">Telefon</td><td style="font-weight:700;color:#1a1a1a;">${escapeHtml(data.phone)}</td></tr>` : ""}
              <tr><td style="padding:4px 0;color:#888;">Konu</td><td style="font-weight:700;color:#1a1a1a;">${escapeHtml(data.subject)}</td></tr>
            </table>
          </div>
          <p style="margin:0 0 6px;color:#888;font-size:13px;">Mesaj</p>
          <p style="white-space:pre-wrap;font-size:14px;color:#1a1a1a;">${escapeHtml(data.message)}</p>
        </div>
        <div style="background:#252525;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,0.45);">
          ${HOTEL.name} · ${HOTEL.address}
        </div>
      </div>
    `,
  };
}

/** İletişim formu otomatik yanıtı — misafirin form dilinde (tr/en). */
const CONTACT_REPLY = {
  tr: {
    subject: `Mesajınız Alındı | ${HOTEL.name}`,
    heading: "Mesajınız Alındı",
    dear: "Sayın",
    body: "Bize ulaştığınız için teşekkür ederiz. Mesajınız tarafımıza ulaşmıştır ve en geç 24 saat içinde size dönüş yapacağız.",
    urgent: "Acil bir konu için doğrudan bizi arayabilirsiniz:",
  },
  en: {
    subject: `We Have Received Your Message | ${HOTEL.name}`,
    heading: "Your Message Has Been Received",
    dear: "Dear",
    body: "Thank you for contacting us. Your message has reached us and we will get back to you within 24 hours at the latest.",
    urgent: "For urgent matters, you can call us directly:",
  },
} as const;

export function contactAutoReplyEmail(data: {
  name: string;
  locale?: MailLocale;
}): { subject: string; html: string } {
  const m = CONTACT_REPLY[data.locale ?? "tr"];
  return {
    subject: m.subject,
    html: shell(`
          <h2 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;">${m.heading}</h2>
          <p>${m.dear} ${escapeHtml(data.name)},</p>
          <p>${m.body}</p>
          <p>${m.urgent}</p>
          <p style="font-size:16px;"><a href="tel:${HOTEL.phone.replace(/\s/g, "")}" style="color:#e4a00e;font-weight:700;">${HOTEL.phone}</a></p>
    `),
  };
}
