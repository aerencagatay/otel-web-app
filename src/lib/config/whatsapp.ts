import { HOTEL } from "./hotel";

/** wa.me expects digits only (no "+"). */
const WHATSAPP_PHONE = HOTEL.phone.replace(/[^0-9]/g, "");

/** Builds a `wa.me` deep link with an optional pre-filled message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
