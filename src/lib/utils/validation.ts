import { z } from "zod";
import { ROOM_TYPE_MAP } from "@/lib/config/room-types";
import { nightCount } from "@/lib/utils/dates";

const ROOM_TYPE_KEYS = Object.keys(ROOM_TYPE_MAP) as [string, ...string[]];

const MAX_NIGHTS = 21;
const MAX_ADVANCE_DAYS = 365;

const NAME_REGEX = /^[A-Za-zÇĞİÖŞÜçğıöşü\s-]+$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

function stripControlChars(value: string): string {
  return value.replace(/[\x00-\x1F\x7F]/g, "");
}

function isWithinAdvanceWindow(checkIn: string): boolean {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const max = new Date(today);
  max.setUTCDate(max.getUTCDate() + MAX_ADVANCE_DAYS);
  const checkInDate = new Date(`${checkIn}T00:00:00Z`);
  return checkInDate.getTime() <= max.getTime();
}

export const availabilitySchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().min(1).max(6),
  children: z.coerce.number().min(0).max(4),
  roomType: z.enum(ROOM_TYPE_KEYS).optional(),
});

export const reservationSchema = z
  .object({
    checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    adults: z.number().min(1).max(6),
    children: z.number().min(0).max(4),
    roomType: z.enum(ROOM_TYPE_KEYS),
    firstName: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .regex(NAME_REGEX, "Ad yalnızca harf, boşluk ve tire içerebilir."),
    lastName: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .regex(NAME_REGEX, "Soyad yalnızca harf, boşluk ve tire içerebilir."),
    email: z.email().trim(),
    phone: z
      .string()
      .transform((val) => val.replace(/[\s-]/g, ""))
      .pipe(z.string().regex(PHONE_REGEX, "Geçerli bir telefon numarası girin.")),
    notes: z
      .string()
      .transform((val) => stripControlChars(val.trim()))
      .pipe(z.string().max(500))
      .optional(),
    turnstileToken: z.string().optional(),
    consent: z.literal(true, {
      error: "KVKK Aydınlatma Metni'ni okuyup onaylamanız gerekmektedir.",
    }),
  })
  .refine((data) => nightCount(data.checkIn, data.checkOut) <= MAX_NIGHTS, {
    message: "En fazla 21 gecelik rezervasyon yapılabilir.",
    path: ["checkOut"],
  })
  .refine((data) => isWithinAdvanceWindow(data.checkIn), {
    message: "Giriş tarihi bugünden en fazla 365 gün sonrası olabilir.",
    path: ["checkIn"],
  })
  .superRefine((data, ctx) => {
    const config = ROOM_TYPE_MAP[data.roomType];
    if (!config) return;
    const totalGuests = data.adults + data.children;
    if (totalGuests > config.maxGuests) {
      ctx.addIssue({
        code: "custom",
        message: `Seçilen oda tipi en fazla ${config.maxGuests} misafir kabul eder.`,
        path: ["adults"],
      });
    }
  });

export const CONTACT_SUBJECTS = [
  "Genel Bilgi",
  "Rezervasyon",
  "Fiyat Bilgisi",
  "Şikayet / Öneri",
  "Diğer",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ad Soyad zorunludur.")
    .max(80)
    .regex(NAME_REGEX, "Ad Soyad yalnızca harf, boşluk ve tire içerebilir."),
  email: z.email("Geçerli bir e-posta adresi girin.").trim(),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(PHONE_REGEX, "Geçerli bir telefon numarası girin."))
    .optional()
    .or(z.literal("")),
  subject: z.enum(CONTACT_SUBJECTS, "Lütfen bir konu seçin."),
  message: z
    .string()
    .transform((val) => stripControlChars(val.trim()))
    .pipe(z.string().min(10, "Mesajınız en az 10 karakter olmalıdır.").max(1000)),
  turnstileToken: z.string().optional(),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
