import { describe, expect, it } from "vitest";
import { getLowestUpcomingPrice, getStartingPriceLabel } from "./pricing";

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
