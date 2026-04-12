import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getReservationLogs, updateReservationLog } from "@/lib/sheets/log";
import { confirmReservation } from "@/lib/sheets/reservations";
import { getMailService } from "@/lib/mail";
import { confirmedReservationEmail } from "@/lib/mail/templates";
import { nightCount } from "@/lib/utils/dates";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Find reservation
    const logs = await getReservationLogs();
    const reservation = logs.find((r) => r.reservationId === id);

    if (!reservation) {
      return NextResponse.json(
        { error: "Rezervasyon bulunamadı." },
        { status: 404 }
      );
    }

    if (reservation.status !== "pending") {
      return NextResponse.json(
        { error: "Bu rezervasyon zaten onaylanmış veya iptal edilmiş." },
        { status: 400 }
      );
    }

    // Update sheet colors (green → red)
    await confirmReservation(
      reservation.checkIn,
      reservation.checkOut,
      reservation.roomLabel
    );

    // Update log
    await updateReservationLog(id, {
      status: "confirmed",
      confirmedAt: new Date().toISOString(),
    });

    // Send confirmation email
    try {
      const mail = getMailService();
      const template = confirmedReservationEmail({
        reservationId: id,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        nights: nightCount(reservation.checkIn, reservation.checkOut),
        roomLabel: reservation.roomLabel,
      });
      await mail.send({ to: reservation.email, ...template });
    } catch (mailErr) {
      console.error("Failed to send confirmation email:", mailErr);
    }

    return NextResponse.json({ ok: true, message: "Rezervasyon onaylandı." });
  } catch (err) {
    console.error("Confirm error:", err);
    return NextResponse.json(
      { error: "Onaylama sırasında hata oluştu." },
      { status: 500 }
    );
  }
}
