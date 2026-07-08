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
  },
  traditional_room: {
    "2026-06": 7200,
    "2026-07": 9000,
    "2026-08": 10000,
  },
  premium_family: {
    "2026-06": 11500,
    "2026-07": 15000,
    "2026-08": 15500,
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
