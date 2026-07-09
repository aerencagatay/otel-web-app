import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ParsedMonth } from "./parser";

/**
 * checkAvailability / findNearestAvailability tests with a mocked sheet
 * cache — no Google Sheets I/O. The synthetic month has ONE deluxe room
 * that is occupied on exactly 2026-07-10 and 2026-07-11, so:
 *   - the requested window 10→12 (nights 10, 11) is fully booked,
 *   - shifting by ±2 days frees the window → alternatives are suggested.
 */

const OCCUPIED_DATES = new Set(["2026-07-10", "2026-07-11"]);

function syntheticJuly(): ParsedMonth {
  const cells = new Map<string, { value: string }>();
  for (let day = 1; day <= 31; day++) {
    const date = `2026-07-${String(day).padStart(2, "0")}`;
    cells.set(date, { value: OCCUPIED_DATES.has(date) ? "DOLU" : "" });
  }
  return {
    month: "2026-07",
    dateColumns: Array.from({ length: 31 }, (_, i) => ({
      date: `2026-07-${String(i + 1).padStart(2, "0")}`,
      colIndex: i + 1,
    })),
    rooms: [
      {
        rowIndex: 2,
        roomLabel: "1+0 Deluxe 101",
        roomType: "deluxe_sea_view",
        cells: cells as ParsedMonth["rooms"][number]["cells"],
      },
    ],
  };
}

const parseMonthSheetCached = vi.fn();

vi.mock("./cache", () => ({
  parseMonthSheetCached: (tabName: string) => parseMonthSheetCached(tabName),
}));

// Mock'tan SONRA import edilmeli (vi.mock hoisted olsa da dinamik import netlik sağlar).
const { checkAvailability, findNearestAvailability } = await import("./availability");

beforeEach(() => {
  parseMonthSheetCached.mockReset();
  parseMonthSheetCached.mockImplementation(async (tabName: string) =>
    tabName === "Temmuz 2026" ? syntheticJuly() : null
  );
});

describe("checkAvailability", () => {
  it("returns no rooms when every room is occupied in the window", async () => {
    const rooms = await checkAvailability("2026-07-10", "2026-07-12", "deluxe_sea_view");
    expect(rooms).toEqual([]);
  });

  it("returns the room when the window is free", async () => {
    const rooms = await checkAvailability("2026-07-20", "2026-07-22", "deluxe_sea_view");
    expect(rooms).toHaveLength(1);
    expect(rooms[0].roomType).toBe("deluxe_sea_view");
    expect(rooms[0].available).toBe(1);
  });
});

describe("findNearestAvailability", () => {
  it("suggests shifted same-length windows when the requested one is full", async () => {
    const alternatives = await findNearestAvailability(
      "2026-07-10",
      "2026-07-12",
      "deluxe_sea_view"
    );
    expect(alternatives.length).toBeGreaterThanOrEqual(1);
    expect(alternatives.length).toBeLessThanOrEqual(3);
    for (const alt of alternatives) {
      // Aynı uzunlukta (2 gece) pencere önerilmeli.
      const nights =
        (new Date(alt.checkOut).getTime() - new Date(alt.checkIn).getTime()) / 86_400_000;
      expect(nights).toBe(2);
      // Önerilen pencere gerçekten müsait olmalı.
      const rooms = await checkAvailability(alt.checkIn, alt.checkOut, "deluxe_sea_view");
      expect(rooms.length).toBeGreaterThan(0);
    }
  });

  it("filters suggestions by guest count", async () => {
    // deluxe_sea_view maxGuests=2 — 4 misafir için hiçbir öneri dönmemeli.
    const alternatives = await findNearestAvailability(
      "2026-07-10",
      "2026-07-12",
      "deluxe_sea_view",
      4
    );
    expect(alternatives).toEqual([]);
  });
});
