import { NextRequest, NextResponse } from "next/server";
import { reservationSchema } from "@/lib/utils/validation";
import { writePendingReservation } from "@/lib/sheets/reservations";
import { appendReservationLog } from "@/lib/sheets/log";
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

    // Write to sheet (optimistic locking via re-check)
    const guestName = `${data.firstName} ${data.lastName}`;
    const result = await writePendingReservation(
      data.checkIn,
      data.checkOut,
      data.roomType,
      guestName
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

    const reservationId = generateReservationId();
    const nights = nightCount(data.checkIn, data.checkOut);

    // Log to sheet
    await appendReservationLog({
      reservationId,
      status: "pending",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      nights,
      roomType: data.roomType,
      roomLabel: result.roomLabel,
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
    });

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
