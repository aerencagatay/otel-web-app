import { getDateRange } from "../utils/dates";

/**
 * Seasonal nightly room prices, by room type and year-month (YYYY-MM).
 * Values are in TRY and assumed KDV (VAT) dahil.
 *
 * To add new months/seasons, just add more "YYYY-MM": price entries.
 * Nights that fall in a month with no entry are treated as "price unknown"
 * and the UI falls back to a "call us" message instead of a wrong total.
 */
export const ROOM_PRICING: Record<string, Record<string, number>> = {
  deluxe_sea_view: {
    "2026-06": 7700,
    "2026-07": 9500,
    "2026-08": 10500,
    "2026-09": 8000,
  },
  traditional_room: {
    "2026-06": 7200,
    "2026-07": 9000,
    "2026-08": 10000,
    "2026-09": 7500,
  },
  premium_family: {
    "2026-06": 11500,
    "2026-07": 15000,
    "2026-08": 15500,
    "2026-09": 12000,
  },
};

/**
 * Nightly price for a room type on a given date (by its month), or null if
 * that month has no defined price. The deposit (kapora) equals one night,
 * so this is also the deposit amount for a stay starting on `date`.
 */
export function getNightlyPrice(roomType: string, date: string): number | null {
  const table = ROOM_PRICING[roomType];
  if (!table) return null;
  return table[date.substring(0, 7)] ?? null;
}

/**
 * Lowest defined nightly price for a room type across the current and future
 * months, or null when no upcoming month has pricing (season over / not yet
 * entered). Used for "starting from" display and JSON-LD Offer price — never
 * hardcode price values elsewhere.
 */
export function getLowestUpcomingPrice(
  roomType: string,
  from: Date = new Date()
): number | null {
  const table = ROOM_PRICING[roomType];
  if (!table) return null;
  const currentMonth = `${from.getFullYear()}-${String(from.getMonth() + 1).padStart(2, "0")}`;
  const upcoming = Object.entries(table)
    .filter(([month]) => month >= currentMonth)
    .map(([, price]) => price);
  return upcoming.length ? Math.min(...upcoming) : null;
}

/**
 * User-facing "starting from" price label for a room type, derived only
 * from `ROOM_PRICING` (never hand-typed). Falls back to a graceful
 * "call us" message when no upcoming month has a defined price, so the UI
 * never shows a stale or fabricated number.
 */
export function getStartingPriceLabel(
  roomType: string,
  from: Date = new Date()
): string {
  const price = getLowestUpcomingPrice(roomType, from);
  if (price == null) return "Fiyat için bize ulaşın";
  return `₺${price.toLocaleString("tr-TR")}'den başlayan / gece · kahvaltı dahil`;
}

/**
 * Lowest-priced room type across ROOM_PRICING (used when the pricing API is
 * queried without a `roomType`, so the calendar can still show "from" prices).
 */
export function getCheapestRoomType(from: Date = new Date()): string | null {
  let cheapest: { type: string; price: number } | null = null;
  for (const type of Object.keys(ROOM_PRICING)) {
    const price = getLowestUpcomingPrice(type, from);
    if (price != null && (cheapest == null || price < cheapest.price)) {
      cheapest = { type, price };
    }
  }
  return cheapest?.type ?? null;
}

/**
 * Day -> nightly price map for a room type across a list of "YYYY-MM" months.
 * Used by GET /api/pricing to feed the date-range-picker's per-day labels.
 * Months without a defined price are simply absent from the result (no key).
 */
export function getDailyPriceMap(
  roomType: string,
  months: string[]
): Record<string, number> {
  const table = ROOM_PRICING[roomType] ?? {};
  const result: Record<string, number> = {};
  for (const month of months) {
    const price = table[month];
    if (price == null) continue;
    const [year, m] = month.split("-").map(Number);
    const daysInMonth = new Date(year, m, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${month}-${String(day).padStart(2, "0")}`;
      result[dateStr] = price;
    }
  }
  return result;
}

export interface StayPrice {
  nights: number;
  /** Total stay price, or null if any night's month has no defined price. */
  total: number | null;
  /** True when every night in the range has a defined price. */
  complete: boolean;
  /** True when all nights share the same nightly price (single-season stay). */
  uniform: boolean;
  /** Check-in month nightly price (for "X ₺ / gece"), or null. */
  fromPrice: number | null;
}

/**
 * Calculate the total stay price for a room type across a date range,
 * correctly handling month-boundary stays (each night priced by its month).
 */
export function calculateStayTotal(
  roomType: string,
  checkIn: string,
  checkOut: string
): StayPrice {
  const dates = getDateRange(checkIn, checkOut); // night dates [checkIn, checkOut)
  const table = ROOM_PRICING[roomType] ?? {};

  let total = 0;
  let complete = dates.length > 0;
  let uniform = true;

  const firstPrice = dates.length ? table[dates[0].substring(0, 7)] ?? null : null;

  for (const date of dates) {
    const price = table[date.substring(0, 7)];
    if (price == null) {
      complete = false;
    } else {
      total += price;
    }
    if (price !== firstPrice) uniform = false;
  }

  return {
    nights: dates.length,
    total: complete ? total : null,
    complete,
    uniform,
    fromPrice: firstPrice,
  };
}
