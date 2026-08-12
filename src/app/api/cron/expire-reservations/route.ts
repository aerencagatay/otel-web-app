import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * PAUSED: this used to cancel pending reservations not confirmed within
 * RESERVATION_HOLD_HOURS. That deadline was tied to the IBAN/kapora deposit
 * flow, which is currently suspended — reservations are now confirmed by
 * phone call instead, with no payment deadline, so auto-cancelling "pending"
 * reservations after a few hours no longer makes sense. Returns early
 * without touching any reservations. The prior implementation (Sheets
 * lookup, cancellation, expiry email) is in git history — restore it if the
 * deposit/payment deadline flow comes back.
 *
 * Still protected by CRON_SECRET so the endpoint doesn't 200 for anyone.
 * Call with header:  Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, skipped: true, reason: "deposit_flow_paused" });
}
