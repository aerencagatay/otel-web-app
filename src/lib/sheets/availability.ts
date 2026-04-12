import { parseMonthSheet, isCellOccupied } from "./parser";
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

  // Fetch each month's sheet
  for (const group of monthGroups) {
    const tabName = monthToTabName(group.month);

    try {
      const parsed = await parseMonthSheet(tabName);
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
    } catch (err) {
      console.error(`Failed to parse sheet tab: ${tabName}`, err);
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
