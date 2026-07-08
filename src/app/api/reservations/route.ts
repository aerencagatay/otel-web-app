import { NextRequest, NextResponse } from "next/server";
import { reservationSchema } from "@/lib/utils/validation";
import { writePendingReservation } from "@/lib/sheets/reservations";
import type { ReservationLog } from "@/lib/sheets/log";
import { ROOM_TYPE_MAP } from "@/lib/config/room-types";
import { getNightlyPrice } from "@/lib/config/pricing";
import { generateReservationId } from "@/lib/utils/ids";
import { nightCount, isPastDate } from "@/lib/utils/dates";
import { getMailService } from "@/lib/mail";
import { reportServerError } from "@/lib/monitoring";
import {
  pendingReservationEmail,
  adminNotificationEmail,
} from "@/lib/mail/templates";
import {
  getClientIp,
  reservationLimiter,
  RATE_LIMIT_MESSAGE,
} from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const rateLimitResult = await reservationLimiter.limit(ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: RATE_LIMIT_MESSAGE },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz bilgiler.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const turnstileResult = await verifyTurnstileToken(
      data.turnstileToken,
      ip
    );
    if (!turnstileResult.success) {
      // "no-secret-configured" in production means the server itself is
      // misconfigured (helper fails closed) — surface as 503, not user error.
      if (turnstileResult.reason === "no-secret-configured") {
        return NextResponse.json(
          {
            error:
              "Rezervasyon sistemi şu anda geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin veya bizi telefonla arayın.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error:
            "Güvenlik doğrulaması başarısız oldu. Lütfen sayfayı yenileyip tekrar deneyin.",
        },
        { status: 403 }
      );
    }

    if (isPastDate(data.checkIn)) {
      return NextResponse.json(
        { error: "Giriş tarihi geçmişte olamaz." },
        { status: 400 }
      );
    }

    if (data.checkIn >= data.checkOut) {
      return NextResponse.json(
        { error: "Çıkış tarihi giriş tarihinden sonra olmalıdır." },
        { status: 400 }
      );
    }

    const config = ROOM_TYPE_MAP[data.roomType];
    if (!config) {
      return NextResponse.json(
        { error: "Geçersiz oda tipi." },
        { status: 400 }
      );
    }

    // Generate reservationId BEFORE the sheet write so it can be embedded in
    // the cell text as an idempotency marker (the post-write verifier in
    // writePendingReservation reads the cell back and checks for this id).
    const reservationId = generateReservationId();
    const nights = nightCount(data.checkIn, data.checkOut);
    // Deposit (kapora) = one night's price for the check-in season; falls
    // back to the room's configured amount for months without set pricing.
    const deposit =
      getNightlyPrice(data.roomType, data.checkIn) ?? config.depositAmount;
    const guestName = `${data.firstName} ${data.lastName}`;

    const log: ReservationLog = {
      reservationId,
      status: "pending",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      nights,
      roomType: data.roomType,
      roomLabel: "", // filled in by writePendingReservation
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      adults: data.adults,
      children: data.children,
      depositAmount: deposit,
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
      confirmedAt: "",
      cancelledAt: "",
    };

    // Single atomic batchUpdate: monthly cells (value+format) + log row.
    // Returns null if no room available OR if a concurrent request won the
    // post-write verification race.
    const result = await writePendingReservation(
      data.checkIn,
      data.checkOut,
      data.roomType,
      guestName,
      reservationId,
      log
    );

    if (!result) {
      return NextResponse.json(
        {
          error:
            "Seçtiğiniz tarihler için müsait oda kalmamıştır. Lütfen farklı tarih veya oda tipi deneyin.",
        },
        { status: 409 }
      );
    }

    const mail = getMailService();

    // Guest pending email
    try {
      const template = pendingReservationEmail({
        reservationId,
        firstName: data.firstName,
        lastName: data.lastName,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        nights,
        roomLabel: result.roomLabel,
        depositAmount: deposit,
      });
      await mail.send({ to: data.email, ...template });
    } catch (mailErr) {
      console.error("Failed to send guest email:", mailErr);
      await reportServerError(mailErr, { stage: "guest_email", reservationId });
      // Don't fail the reservation if email fails
    }

    // Admin notification email (so the hotel can confirm after deposit arrives)
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const adminTemplate = adminNotificationEmail({
          reservationId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          nights,
          roomLabel: result.roomLabel,
          adults: data.adults,
          children: data.children,
          depositAmount: deposit,
          notes: data.notes,
        });
        await mail.send({ to: adminEmail, ...adminTemplate });
      }
    } catch (mailErr) {
      console.error("Failed to send admin notification:", mailErr);
      await reportServerError(mailErr, { stage: "admin_email", reservationId });
    }

    return NextResponse.json({
      reservationId,
      roomLabel: result.roomLabel,
      message: "Rezervasyonunuz başarıyla oluşturuldu.",
    });
  } catch (err) {
    console.error("Reservation create error:", err);
    await reportServerError(err, { stage: "reservation_create" });
    return NextResponse.json(
      { error: "Rezervasyon oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
