import { describe, expect, it } from "vitest";
import {
  getLowestUpcomingPrice,
  getStartingPriceLabel,
  calculateStayTotal,
  getDailyPriceMap,
  getCheapestRoomType,
} from "./pricing";

describe("getLowestUpcomingPrice", () => {
  it("returns the lowest price among the current and future defined months", () => {
    // deluxe_sea_view: 2026-06 -> 7700, 2026-07 -> 9500, 2026-08 -> 10500
    const price = getLowestUpcomingPrice("deluxe_sea_view", new Date("2026-06-15"));
    expect(price).toBe(7700);
  });

  it("ignores months before the reference date", () => {
    // From August onward only 2026-08 (10500) remains upcoming.
    const price = getLowestUpcomingPrice("deluxe_sea_view", new Date("2026-08-01"));
    expect(price).toBe(10500);
  });

  it("returns null once every priced month is in the past", () => {
    const price = getLowestUpcomingPrice("deluxe_sea_view", new Date("2026-09-01"));
    expect(price).toBeNull();
  });

  it("returns null for an unknown room type", () => {
    const price = getLowestUpcomingPrice("unknown_room", new Date("2026-06-01"));
    expect(price).toBeNull();
  });

  it("treats the reference month itself as upcoming (inclusive)", () => {
    const price = getLowestUpcomingPrice("traditional_room", new Date("2026-07-01"));
    // 2026-07 (9000) and 2026-08 (10000) are both >= reference month.
    expect(price).toBe(9000);
  });
});

describe("getStartingPriceLabel", () => {
  it("formats a defined price in Turkish locale with the standard suffix", () => {
    const label = getStartingPriceLabel("traditional_room", new Date("2026-06-01"));
    expect(label).toBe("₺7.200'den başlayan / gece · kahvaltı dahil");
  });

  it("falls back to a call-to-contact message when no upcoming price exists", () => {
    const label = getStartingPriceLabel("traditional_room", new Date("2026-09-01"));
    expect(label).toBe("Fiyat için bize ulaşın");
  });

  it("falls back for an unknown room type", () => {
    const label = getStartingPriceLabel("unknown_room");
    expect(label).toBe("Fiyat için bize ulaşın");
  });
});

describe("calculateStayTotal (month-boundary stays)", () => {
  it("prices each night by its own month for a stay spanning June -> July", () => {
    // traditional_room: 2026-06 -> 7200, 2026-07 -> 9000.
    // 30 Jun -> 3 Jul = nights on 30 Jun, 1 Jul, 2 Jul (checkout exclusive).
    const stay = calculateStayTotal("traditional_room", "2026-06-30", "2026-07-03");
    expect(stay.nights).toBe(3);
    expect(stay.complete).toBe(true);
    expect(stay.uniform).toBe(false);
    // 1 night at June price (7200) + 2 nights at July price (9000 x 2).
    expect(stay.total).toBe(7200 + 9000 * 2);
    expect(stay.fromPrice).toBe(7200);
  });

  it("marks the stay incomplete when any night falls in an unpriced month", () => {
    const stay = calculateStayTotal("traditional_room", "2026-08-30", "2026-09-02");
    expect(stay.complete).toBe(false);
    expect(stay.total).toBeNull();
  });
});

describe("getDailyPriceMap", () => {
  it("expands a priced month into a day -> price entry for every day", () => {
    const map = getDailyPriceMap("traditional_room", ["2026-06"]);
    expect(map["2026-06-01"]).toBe(7200);
    expect(map["2026-06-30"]).toBe(7200);
    expect(Object.keys(map)).toHaveLength(30);
  });

  it("omits months with no defined price", () => {
    const map = getDailyPriceMap("traditional_room", ["2026-09"]);
    expect(map).toEqual({});
  });

  it("combines multiple months, each with its own price", () => {
    const map = getDailyPriceMap("traditional_room", ["2026-06", "2026-07"]);
    expect(map["2026-06-15"]).toBe(7200);
    expect(map["2026-07-15"]).toBe(9000);
  });
});

describe("getCheapestRoomType", () => {
  it("returns the room type with the lowest upcoming price", () => {
    // From the reference date, traditional_room (7200) is cheaper than
    // deluxe_sea_view (7700) and premium_family (11500) for 2026-06.
    const type = getCheapestRoomType(new Date("2026-06-01"));
    expect(type).toBe("traditional_room");
  });
});
