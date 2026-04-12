import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth/session";
import { getReservationLogs } from "@/lib/sheets/log";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  try {
    const reservations = await getReservationLogs();
    return NextResponse.json({ reservations });
  } catch (err) {
    console.error("Admin reservations error:", err);
    return NextResponse.json(
      { error: "Rezervasyonlar yüklenirken hata oluştu." },
      { status: 500 }
    );
  }
}
