import { NextRequest, NextResponse } from "next/server";
import { ROOM_TYPE_MAP } from "@/lib/config/room-types";
import { getDailyPriceMap, getCheapestRoomType } from "@/lib/config/pricing";

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const MAX_MONTHS = 6;

/**
 * GET /api/pricing?roomType=&months=YYYY-MM,YYYY-MM
 *
 * Returns a day -> nightly price map for the date-range-picker calendar.
 * Backed entirely by the static `ROOM_PRICING` config (no Sheets I/O), so a
 * long browser/CDN cache is safe — bump the cache only if pricing.ts changes
 * mid-season (revalidate hourly regardless as a safety net).
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const monthsParam = params.get("months") ?? "";
  const roomTypeParam = params.get("roomType") ?? undefined;

  const months = monthsParam
    .split(",")
    .map((m) => m.trim())
    .filter((m) => MONTH_REGEX.test(m))
    .slice(0, MAX_MONTHS);

  if (months.length === 0) {
    return NextResponse.json(
      { error: "invalidParams" },
      { status: 400 }
    );
  }

  let roomType = roomTypeParam;
  let usedFallback = false;

  if (!roomType || !ROOM_TYPE_MAP[roomType]) {
    roomType = getCheapestRoomType() ?? undefined;
    usedFallback = true;
  }

  const prices = roomType ? getDailyPriceMap(roomType, months) : {};

  return NextResponse.json(
    { roomType: roomType ?? null, from: usedFallback, prices },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
