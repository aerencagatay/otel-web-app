import { HOTEL, RESERVATION_HOLD_HOURS } from "../config/hotel";
import { formatDateTR } from "../utils/dates";

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

export function pendingReservationEmail(data: {
  reservationId: string;
  firstName: string;
  lastName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomLabel: string;
  depositAmount: number;
}): { subject: string; html: string } {
  return {
    subject: `Rezervasyon Alındı - ${data.reservationId} | ${HOTEL.name}`,
    html: `
      <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;color:#555;">
        <div style="background:#1a1a1a;padding:32px;text-align:center;">
          <h1 style="color:#e4a00e;font-family:'Playfair Display',Georgia,serif;margin:0;">${HOTEL.name}</h1>
        </div>
        <div style="padding:32px;border:1px solid #e8e2d9;border-top:none;">
          <h2 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;">Rezervasyonunuz Alındı</h2>
          <p>Sayın ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>
          <p>Rezervasyon talebiniz başarıyla oluşturulmuştur. Kesinleşmesi için aşağıdaki kapora ödemesini <strong>${RESERVATION_HOLD_HOURS} saat içinde</strong> yapmanız gerekmektedir. Bu süre içinde kapora onaylanmazsa rezervasyonunuz otomatik olarak iptal edilir.</p>

          <div style="background:#faf8f5;border-left:3px solid #e4a00e;padding:16px 20px;margin:20px 0;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#888;">Rezervasyon No</td><td style="font-weight:700;color:#1a1a1a;">${data.reservationId}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Oda</td><td style="font-weight:700;color:#1a1a1a;">${data.roomLabel}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Giriş</td><td style="font-weight:700;color:#1a1a1a;">${formatDateTR(data.checkIn)} · 14:00</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Çıkış</td><td style="font-weight:700;color:#1a1a1a;">${formatDateTR(data.checkOut)} · 12:00</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Süre</td><td style="font-weight:700;color:#1a1a1a;">${data.nights} gece</td></tr>
            </table>
          </div>

          <h3 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;">Kapora Bilgileri</h3>
          <div style="background:#faf8f5;padding:16px 20px;margin:12px 0;border:1px solid #e8e2d9;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#888;">Tutar</td><td style="font-weight:700;color:#e4a00e;font-size:18px;">${data.depositAmount.toLocaleString("tr-TR")} ₺</td></tr>
              <tr><td style="padding:4px 0;color:#888;">IBAN</td><td style="font-weight:700;color:#1a1a1a;font-family:monospace;">${HOTEL.iban}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Alıcı</td><td style="font-weight:700;color:#1a1a1a;">${HOTEL.ibanHolder}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Açıklama</td><td style="font-weight:700;color:#e4a00e;">${data.reservationId}</td></tr>
            </table>
          </div>

          <p style="color:#c00;font-size:13px;">⚠ Havale açıklamasına mutlaka rezervasyon numaranızı yazınız.</p>

          <p>Sorularınız için: <a href="tel:${HOTEL.phone.replace(/\s/g, "")}" style="color:#e4a00e;">${HOTEL.phone}</a></p>
        </div>
        <div style="background:#252525;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,0.45);">
          ${HOTEL.name} · ${HOTEL.address}
        </div>
      </div>
    `,
  };
}

export function expiredReservationEmail(data: {
  reservationId: string;
  firstName: string;
  lastName: string;
}): { subject: string; html: string } {
  return {
    subject: `Rezervasyon talebiniz iptal edildi - ${data.reservationId} | ${HOTEL.name}`,
    html: `
      <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;color:#555;">
        <div style="background:#1a1a1a;padding:32px;text-align:center;">
          <h1 style="color:#e4a00e;font-family:'Playfair Display',Georgia,serif;margin:0;">${HOTEL.name}</h1>
        </div>
        <div style="padding:32px;border:1px solid #e8e2d9;border-top:none;">
          <h2 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;">Rezervasyon Talebiniz İptal Edildi</h2>
          <p>Sayın ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>
          <p><strong>${data.reservationId}</strong> numaralı rezervasyon talebiniz, ${RESERVATION_HOLD_HOURS} saat içinde kapora ödemesi onaylanmadığı için otomatik olarak iptal edilmiştir. Seçtiğiniz tarihler yeniden müsait hale gelmiştir.</p>

          <div style="background:#faf8f5;border-left:3px solid #e4a00e;padding:16px 20px;margin:20px 0;">
            <p style="margin:0 0 6px;color:#1a1a1a;font-weight:700;">Kaporayı zaten gönderdiyseniz lütfen endişelenmeyin.</p>
            <p style="margin:0;">Ödemeniz bize ulaşmış ancak rezervasyonunuz sehven iptal edilmiş olabilir. Bu durumda lütfen bizi arayın; rezervasyonunuzu hemen yeniden oluşturup kesinleştirelim. Kaporanız güvendedir.</p>
          </div>

          <p>Konaklamak isterseniz tekrar rezervasyon yapabilir veya doğrudan bizimle iletişime geçebilirsiniz.</p>
          <p style="font-size:16px;">Bizi arayın: <a href="tel:${HOTEL.phone.replace(/\s/g, "")}" style="color:#e4a00e;font-weight:700;">${HOTEL.phone}</a></p>
        </div>
        <div style="background:#252525;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,0.45);">
          ${HOTEL.name} · ${HOTEL.address}
        </div>
      </div>
    `,
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

export function confirmedReservationEmail(data: {
  reservationId: string;
  firstName: string;
  lastName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomLabel: string;
}): { subject: string; html: string } {
  return {
    subject: `Rezervasyonunuz Kesinleşti - ${data.reservationId} | ${HOTEL.name}`,
    html: `
      <div style="font-family:'Montserrat',Arial,sans-serif;max-width:600px;margin:0 auto;color:#555;">
        <div style="background:#1a1a1a;padding:32px;text-align:center;">
          <h1 style="color:#e4a00e;font-family:'Playfair Display',Georgia,serif;margin:0;">${HOTEL.name}</h1>
        </div>
        <div style="padding:32px;border:1px solid #e8e2d9;border-top:none;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:60px;height:60px;background:#d4edda;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;">
              <span style="font-size:28px;color:#28a745;">✓</span>
            </div>
          </div>
          <h2 style="color:#1a1a1a;font-family:'Playfair Display',Georgia,serif;text-align:center;">Rezervasyonunuz Kesinleşti!</h2>
          <p>Sayın ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},</p>
          <p>Kapora ödemeniz onaylanmış ve rezervasyonunuz kesinleşmiştir. Sizi otelimizde ağırlamaktan mutluluk duyacağız.</p>

          <div style="background:#faf8f5;border-left:3px solid #28a745;padding:16px 20px;margin:20px 0;">
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;color:#888;">Rezervasyon No</td><td style="font-weight:700;color:#1a1a1a;">${data.reservationId}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Oda</td><td style="font-weight:700;color:#1a1a1a;">${data.roomLabel}</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Giriş</td><td style="font-weight:700;color:#1a1a1a;">${formatDateTR(data.checkIn)} · 14:00</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Çıkış</td><td style="font-weight:700;color:#1a1a1a;">${formatDateTR(data.checkOut)} · 12:00</td></tr>
              <tr><td style="padding:4px 0;color:#888;">Süre</td><td style="font-weight:700;color:#1a1a1a;">${data.nights} gece</td></tr>
            </table>
          </div>

          <p>İyi tatiller dileriz!</p>
          <p>Sorularınız için: <a href="tel:${HOTEL.phone.replace(/\s/g, "")}" style="color:#e4a00e;">${HOTEL.phone}</a></p>
        </div>
        <div style="background:#252525;padding:16px;text-align:center;font-size:12px;color:rgba(255,255,255,0.45);">
          ${HOTEL.name} · ${HOTEL.address}
        </div>
      </div>
    `,
  };
}
