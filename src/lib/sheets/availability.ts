import { isCellOccupied } from "./parser";
import { parseMonthSheetCached } from "./cache";
import { ROOM_TYPE_MAP } from "../config/room-types";
import { splitByMonth, getDateRange } from "../utils/dates";

export interface AvailableRoom {
  roomType: string;
  label: string;
  available: number;
  depositAmount: number;
  maxGuests: number;
}

const TURKISH_MONTH_NAMES = [
  "",
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function monthToTabName(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number);
  return `${TURKISH_MONTH_NAMES[month]} ${year}`;
}

/**
 * Check availability for a date range. Returns list of room types with counts.
 */
export async function checkAvailability(
  checkIn: string,
  checkOut: string,
  roomTypeFilter?: string,
  minGuests?: number
): Promise<AvailableRoom[]> {
  const monthGroups = splitByMonth(checkIn, checkOut);
  const allDates = getDateRange(checkIn, checkOut);

  // Track occupancy per room (roomLabel -> set of occupied dates)
  const roomOccupancy = new Map<
    string,
    { roomType: string; occupiedDates: Set<string> }
  >();

  // Fetch every month's sheet in parallel (cached 60s per tab) instead of
  // one-at-a-time — a multi-month stay no longer pays the Sheets API
  // round-trip cost sequentially.
  const parsedMonths = await Promise.all(
    monthGroups.map(async (group) => {
      const tabName = monthToTabName(group.month);
      try {
        return { group, tabName, parsed: await parseMonthSheetCached(tabName) };
      } catch (err) {
        console.error(`Failed to parse sheet tab: ${tabName}`, err);
        return { group, tabName, parsed: null };
      }
    })
  );

  for (const { group, parsed } of parsedMonths) {
    if (!parsed) continue;

    for (const room of parsed.rooms) {
      if (!roomOccupancy.has(room.roomLabel)) {
        roomOccupancy.set(room.roomLabel, {
          roomType: room.roomType!,
          occupiedDates: new Set(),
        });
      }

      const entry = roomOccupancy.get(room.roomLabel)!;

      for (const date of group.dates) {
        const cell = room.cells.get(date);
        if (cell && isCellOccupied(cell)) {
          entry.occupiedDates.add(date);
        }
      }
    }
  }

  // Count available rooms per type
  const availabilityByType = new Map<string, number>();

  for (const [, entry] of roomOccupancy) {
    // Room is available if NONE of the requested dates are occupied
    const isAvailable = allDates.every(
      (date) => !entry.occupiedDates.has(date)
    );

    if (isAvailable) {
      const count = availabilityByType.get(entry.roomType) || 0;
      availabilityByType.set(entry.roomType, count + 1);
    }
  }

  // Build results
  const results: AvailableRoom[] = [];

  for (const [type, config] of Object.entries(ROOM_TYPE_MAP)) {
    if (roomTypeFilter && type !== roomTypeFilter) continue;
    if (minGuests && config.maxGuests < minGuests) continue;

    const available = availabilityByType.get(type) || 0;

    if (available > 0) {
      results.push({
        roomType: type,
        label: config.publicLabel,
        available,
        depositAmount: config.depositAmount,
        maxGuests: config.maxGuests,
      });
    }
  }

  return results;
}

export interface DateWindow {
  checkIn: string;
  checkOut: string;
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split("T")[0];
}

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * When the exact requested window has no availability, look for the same
 * length stay shifted by a handful of days either way. Tries the closest
 * offsets first (±1, ±2, … ±7 nights) and stops as soon as it has collected
 * up to 3 alternatives or exhausted a 6-query budget — each query reuses
 * `checkAvailability`, which itself pulls from the 60s sheet cache, so
 * candidates sharing a month with the original request rarely re-hit the
 * Sheets API.
 */
export async function findNearestAvailability(
  checkIn: string,
  checkOut: string,
  roomType?: string,
  minGuests?: number
): Promise<DateWindow[]> {
  const MAX_OFFSET = 7;
  const MAX_QUERIES = 6;
  const MAX_RESULTS = 3;
  const today = todayIso();

  // Closest offsets first: +1, -1, +2, -2, …
  const offsets: number[] = [];
  for (let d = 1; d <= MAX_OFFSET; d++) {
    offsets.push(d, -d);
  }

  const alternatives: DateWindow[] = [];
  let queries = 0;

  for (const offset of offsets) {
    if (queries >= MAX_QUERIES || alternatives.length >= MAX_RESULTS) break;

    const candidateCheckIn = shiftDate(checkIn, offset);
    if (candidateCheckIn < today) continue; // never suggest the past

    const candidateCheckOut = shiftDate(checkOut, offset);

    queries++;
    const rooms = await checkAvailability(
      candidateCheckIn,
      candidateCheckOut,
      roomType,
      minGuests
    );
    if (rooms.length > 0) {
      alternatives.push({ checkIn: candidateCheckIn, checkOut: candidateCheckOut });
    }
  }

  return alternatives;
}
