import { NextRequest, NextResponse } from "next/server";
import { lookupSchema } from "@/lib/utils/validation";
import { getReservationLogs } from "@/lib/sheets/log";
import { ROOM_TYPE_MAP } from "@/lib/config/room-types";
import { getClientIp, lookupLimiter } from "@/lib/security/rate-limit";

/**
 * POST /api/reservations/lookup — self-service reservation status check.
 *
 * Requires BOTH the reservation number and the email used to book it to
 * match; if either doesn't, we return the exact same generic "not found"
 * response as a real miss (enumeration protection — otherwise an attacker
 * could brute-force reservation IDs and learn which emails are valid, or
 * vice versa). No cancellation action here by design (scope decision) —
 * the client shows a phone/WhatsApp CTA instead.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimitResult = await lookupLimiter.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "rateLimit" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = lookupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "invalidData" }, { status: 400 });
    }

    const { reservationId, email } = parsed.data;

    const logs = await getReservationLogs();
    const match = logs.find(
      (log) =>
        log.reservationId.toUpperCase() === reservationId &&
        log.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!match) {
      return NextResponse.json({ error: "reservationNotFound" }, { status: 404 });
    }

    return NextResponse.json({
      reservationId: match.reservationId,
      status: match.status,
      checkIn: match.checkIn,
      checkOut: match.checkOut,
      nights: match.nights,
      roomLabel: match.roomLabel,
      roomTypeName: ROOM_TYPE_MAP[match.roomType]?.publicLabel ?? match.roomLabel,
      depositAmount: match.depositAmount,
      adults: match.adults,
      children: match.children,
    });
  } catch (err) {
    console.error("Reservation lookup error:", err);
    return NextResponse.json({ error: "lookupError" }, { status: 500 });
  }
}
