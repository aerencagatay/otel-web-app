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
      .regex(NAME_REGEX, "validation.nameChars"),
    lastName: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .regex(NAME_REGEX, "validation.surnameChars"),
    email: z.email().trim(),
    phone: z
      .string()
      .transform((val) => val.replace(/[\s-]/g, ""))
      .pipe(z.string().regex(PHONE_REGEX, "validation.invalidPhone")),
    notes: z
      .string()
      .transform((val) => stripControlChars(val.trim()))
      .pipe(z.string().max(500))
      .optional(),
    turnstileToken: z.string().optional(),
    consent: z.literal(true, {
      // İstemci tarafında çevrilen hata kodu (messages/*.json → validation.*).
      error: "validation.consentRequired",
    }),
  })
  .refine((data) => nightCount(data.checkIn, data.checkOut) <= MAX_NIGHTS, {
    message: "validation.maxNights",
    path: ["checkOut"],
  })
  .refine((data) => isWithinAdvanceWindow(data.checkIn), {
    message: "validation.maxAdvance",
    path: ["checkIn"],
  })
  .superRefine((data, ctx) => {
    const config = ROOM_TYPE_MAP[data.roomType];
    if (!config) return;
    const totalGuests = data.adults + data.children;
    if (totalGuests > config.maxGuests) {
      ctx.addIssue({
        code: "custom",
        // İstemci tarafında çevrilen hata kodu (messages/*.json → validation.*).
        message: "validation.maxGuestsForRoom",
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

// Hata mesajları KOD olarak döner; istemci messages/*.json'daki
// validation.* anahtarlarıyla çevirir (Task 04 i18n yaklaşımı).
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "validation.fullNameRequired")
    .max(80)
    .regex(NAME_REGEX, "validation.fullNameChars"),
  email: z.email("validation.invalidEmail").trim(),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(PHONE_REGEX, "validation.invalidPhone"))
    .optional()
    .or(z.literal("")),
  subject: z.enum(CONTACT_SUBJECTS, "validation.subjectRequired"),
  message: z
    .string()
    .transform((val) => stripControlChars(val.trim()))
    .pipe(z.string().min(10, "validation.messageMin").max(1000)),
  turnstileToken: z.string().optional(),
});

// Rezervasyon sorgulama (self-servis, Task 05). Reservation ID format comes
// from `generateReservationId` (WEB-YYYYMMDD-XXXX); kept loose enough to
// still validate old/legacy ids consistently while rejecting junk input.
export const lookupSchema = z.object({
  reservationId: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2,6}-\d{8}-[A-Z0-9]{4,8}$/, "validation.invalidReservationId"),
  email: z.email("validation.invalidEmail").trim(),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
