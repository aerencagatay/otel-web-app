import { HOTEL } from "../config/hotel";
import { formatDateTR } from "../utils/dates";

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
          <p>Sayın ${data.firstName} ${data.lastName},</p>
          <p>Rezervasyon talebiniz başarıyla oluşturulmuştur. Kesinleşmesi için aşağıdaki kapora ödemesini <strong>24 saat içinde</strong> yapmanız gerekmektedir.</p>

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
          <p>Sayın ${data.firstName} ${data.lastName},</p>
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
