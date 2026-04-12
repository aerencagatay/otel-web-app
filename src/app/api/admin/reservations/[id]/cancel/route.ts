import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getReservationLogs, updateReservationLog } from "@/lib/sheets/log";
import { cancelReservation } from "@/lib/sheets/reservations";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const { id } = await params;

    const logs = await getReservationLogs();
    const reservation = logs.find((r) => r.reservationId === id);

    if (!reservation) {
      return NextResponse.json(
        { error: "Rezervasyon bulunamadı." },
        { status: 404 }
      );
    }

    if (reservation.status === "cancelled") {
      return NextResponse.json(
        { error: "Bu rezervasyon zaten iptal edilmiş." },
        { status: 400 }
      );
    }

    // Clear sheet cells
    await cancelReservation(
      reservation.checkIn,
      reservation.checkOut,
      reservation.roomLabel
    );

    // Update log
    await updateReservationLog(id, {
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, message: "Rezervasyon iptal edildi." });
  } catch (err) {
    console.error("Cancel error:", err);
    return NextResponse.json(
      { error: "İptal sırasında hata oluştu." },
      { status: 500 }
    );
  }
}
