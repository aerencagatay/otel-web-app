import { NextRequest, NextResponse } from "next/server";
import { getReservationLogs, updateReservationLog } from "@/lib/sheets/log";
import { cancelReservation } from "@/lib/sheets/reservations";
import { getMailService } from "@/lib/mail";
import { expiredReservationEmail } from "@/lib/mail/templates";
import { RESERVATION_HOLD_HOURS } from "@/lib/config/hotel";

export const dynamic = "force-dynamic";

/**
 * Cancels pending reservations that were not confirmed within
 * RESERVATION_HOLD_HOURS. Clears their calendar cells (freeing the dates),
 * marks the log row cancelled, and emails the guest.
 *
 * Protected by CRON_SECRET. Triggered by an external scheduler (GitHub
 * Actions every ~15 min) because Vercel Hobby cron only runs daily.
 * Call with header:  Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await getReservationLogs();
    const cutoff = Date.now() - RESERVATION_HOLD_HOURS * 60 * 60 * 1000;

    const expired = logs.filter((r) => {
      if (r.status !== "pending") return false;
      if (!r.createdAt) return false;
      const t = new Date(r.createdAt).getTime();
      if (Number.isNaN(t)) return false;
      return t < cutoff;
    });

    const processed: string[] = [];

    // Sequential to avoid concurrent sheet writes racing each other.
    for (const r of expired) {
      try {
        await cancelReservation(r.checkIn, r.checkOut, r.roomLabel);
        await updateReservationLog(r.reservationId, {
          status: "cancelled",
          cancelledAt: new Date().toISOString(),
        });
        processed.push(r.reservationId);

        // Notify guest (best effort — don't fail the run if mail breaks)
        try {
          if (r.email) {
            const mail = getMailService();
            const tpl = expiredReservationEmail({
              reservationId: r.reservationId,
              firstName: r.firstName,
              lastName: r.lastName,
            });
            await mail.send({ to: r.email, ...tpl });
          }
        } catch (mailErr) {
          console.error("Expiry mail failed:", r.reservationId, mailErr);
        }
      } catch (err) {
        console.error("Failed to expire reservation:", r.reservationId, err);
      }
    }

    return NextResponse.json({
      ok: true,
      checked: logs.length,
      expired: processed.length,
      ids: processed,
    });
  } catch (err) {
    console.error("expire-reservations error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
