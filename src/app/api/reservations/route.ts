import { NextRequest, NextResponse } from "next/server";
import { reservationSchema } from "@/lib/utils/validation";
import { writePendingReservation } from "@/lib/sheets/reservations";
import type { ReservationLog } from "@/lib/sheets/log";
import { ROOM_TYPE_MAP } from "@/lib/config/room-types";
import { generateReservationId } from "@/lib/utils/ids";
import { nightCount, isPastDate } from "@/lib/utils/dates";
import { getMailService } from "@/lib/mail";
import { pendingReservationEmail } from "@/lib/mail/templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Geçersiz bilgiler.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

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
      depositAmount: config.depositAmount,
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

    // Send email
    try {
      const mail = getMailService();
      const template = pendingReservationEmail({
        reservationId,
        firstName: data.firstName,
        lastName: data.lastName,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        nights,
        roomLabel: result.roomLabel,
        depositAmount: config.depositAmount,
      });
      await mail.send({ to: data.email, ...template });
    } catch (mailErr) {
      console.error("Failed to send email:", mailErr);
      // Don't fail the reservation if email fails
    }

    return NextResponse.json({
      reservationId,
      roomLabel: result.roomLabel,
      message: "Rezervasyonunuz başarıyla oluşturuldu.",
    });
  } catch (err) {
    console.error("Reservation create error:", err);
    return NextResponse.json(
      { error: "Rezervasyon oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
