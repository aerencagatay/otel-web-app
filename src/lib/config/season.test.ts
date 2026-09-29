import { describe, expect, it } from "vitest";
import {
  firstBookableDate,
  isBookableNight,
  isClosedPickerDay,
  isStayInSeason,
} from "./season";

describe("isBookableNight", () => {
  it.each(["2027-05-01", "2027-07-15", "2027-09-30"])("open: %s", (d) => {
    expect(isBookableNight(d)).toBe(true);
  });
  it.each(["2026-10-01", "2026-12-31", "2027-01-15", "2027-04-30"])("closed: %s", (d) => {
    expect(isBookableNight(d)).toBe(false);
  });
});

describe("isStayInSeason", () => {
  it("accepts a stay fully inside the season", () => {
    expect(isStayInSeason("2027-06-10", "2027-06-14")).toBe(true);
  });
  it("accepts checking out on Oct 1 (last night is Sep 30)", () => {
    expect(isStayInSeason("2027-09-28", "2027-10-01")).toBe(true);
  });
  it("rejects a stay with any night after Sep 30", () => {
    expect(isStayInSeason("2027-09-29", "2027-10-02")).toBe(false);
  });
  it("rejects a stay starting before May 1", () => {
    expect(isStayInSeason("2027-04-29", "2027-05-02")).toBe(false);
  });
  it("rejects stays entirely in the closed period", () => {
    expect(isStayInSeason("2026-11-10", "2026-11-12")).toBe(false);
  });
  it("rejects an empty range", () => {
    expect(isStayInSeason("2027-06-10", "2027-06-10")).toBe(false);
  });
});

describe("isClosedPickerDay", () => {
  it("keeps Oct 1 selectable as a check-out day", () => {
    expect(isClosedPickerDay(new Date(2027, 9, 1))).toBe(false);
  });
  it("closes the rest of the off-season", () => {
    expect(isClosedPickerDay(new Date(2027, 9, 2))).toBe(true);
    expect(isClosedPickerDay(new Date(2028, 3, 30))).toBe(true);
  });
  it("opens the season", () => {
    expect(isClosedPickerDay(new Date(2028, 4, 1))).toBe(false);
  });
});

describe("firstBookableDate", () => {
  it("returns the same day inside the season", () => {
    expect(firstBookableDate(new Date(2026, 8, 29))).toEqual(new Date(2026, 8, 29));
  });
  it("jumps to next May 1 during the off-season", () => {
    expect(firstBookableDate(new Date(2026, 9, 5))).toEqual(new Date(2027, 4, 1));
    expect(firstBookableDate(new Date(2027, 1, 5))).toEqual(new Date(2027, 4, 1));
  });
});
