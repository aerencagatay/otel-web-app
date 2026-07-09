import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getBookingContext,
  setBookingContext,
  subscribeBookingContext,
} from "./booking-context";

afterEach(() => setBookingContext(null));

describe("booking-context store", () => {
  it("stores and returns the current context", () => {
    expect(getBookingContext()).toBeNull();
    setBookingContext({ checkIn: "2026-07-12", checkOut: "2026-07-15", roomType: "deluxe_sea_view" });
    expect(getBookingContext()).toEqual({
      checkIn: "2026-07-12",
      checkOut: "2026-07-15",
      roomType: "deluxe_sea_view",
    });
  });

  it("notifies subscribers on every change and stops after unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeBookingContext(listener);

    setBookingContext({ checkIn: "2026-07-12", checkOut: "2026-07-15" });
    expect(listener).toHaveBeenCalledTimes(1);

    setBookingContext(null);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    setBookingContext({ checkIn: "2026-08-01", checkOut: "2026-08-03" });
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
