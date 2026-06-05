export const HOTEL = {
  name: "Assos Karadut Taş Otel",
  phone: "+90 501 091 34 17",
  email: "karaduttas@gmail.com",
  address: "Büyükhusun Köyü Namazgah Mevkii No:26, Ayvacık, Çanakkale 17860",
  checkIn: "14:00",
  checkOut: "12:00",
  totalRooms: 28,
  website: "https://karaduttasotel.com",
  iban: "TR96 0001 5001 5800 7314 2776 85",
  ibanHolder: "NÜKHET DİLARA KAYABALI",
} as const;

/**
 * How long a pending (unconfirmed) reservation is held before it is
 * automatically cancelled and its dates freed. Used by the expiry cron and
 * shown in guest-facing copy (keep them in sync via this single source).
 */
export const RESERVATION_HOLD_HOURS = 3;
