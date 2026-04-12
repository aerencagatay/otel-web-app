import { z } from "zod";

export const availabilitySchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.coerce.number().min(1).max(6),
  children: z.coerce.number().min(0).max(4),
  roomType: z.string().optional(),
});

export const reservationSchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().min(1).max(6),
  children: z.number().min(0).max(4),
  roomType: z.string().min(1),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  notes: z.string().max(500).optional(),
});

export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
