"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import DateRangePicker from "@/components/booking/date-range-picker";

function fmt(d: Date) {
  return d.toISOString().split("T")[0];
}

interface Props {
  roomType: string;
}

/**
 * Embedded availability CTA on a room detail page: a scoped-to-this-room
 * date picker (with per-day pricing) that redirects to the full reservation
 * flow, prefilled and auto-searching (`/reservation?roomType=...&auto=1`).
 */
export default function RoomDetailBookingCta({ roomType }: Props) {
  const t = useTranslations("roomDetail");
  const router = useRouter();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const [checkIn, setCheckIn] = useState(fmt(tomorrow));
  const [checkOut, setCheckOut] = useState(fmt(dayAfter));
  const [adults, setAdults] = useState(2);

  const invalid = Boolean(checkIn && checkOut) && checkIn >= checkOut;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (invalid) return;
    const qs = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: "0",
      roomType,
      auto: "1",
    });
    router.push(`/reservation?${qs.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="room-detail-cta">
      <h3 className="font-heading text-lg font-semibold text-dark m-0 mb-4">
        {t("checkAvailability")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          numberOfMonths={2}
          roomType={roomType}
          showSummary
          onChange={(ci, co) => {
            setCheckIn(ci);
            if (co) setCheckOut(co);
          }}
          className="grid grid-cols-2 gap-3 sm:col-span-2"
          renderTrigger={({ checkInLabel, checkOutLabel, open, openPicker }) => (
            <>
              <button
                type="button"
                className="form-input text-left"
                onClick={openPicker}
                aria-expanded={open}
                aria-haspopup="dialog"
              >
                {checkInLabel}
              </button>
              <button
                type="button"
                className="form-input text-left"
                onClick={openPicker}
                aria-expanded={open}
                aria-haspopup="dialog"
              >
                {checkOutLabel}
              </button>
            </>
          )}
        />
        <select
          className="form-input"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      {invalid && (
        <p className="text-red-700 text-[12px] mt-3 m-0">{t("invalidDate")}</p>
      )}
      <button type="submit" className="btn-cta-solid w-full justify-center mt-4 inline-flex items-center gap-2">
        {t("checkAvailability")}
        <ArrowRight className="w-4 h-4" strokeWidth={2} />
      </button>
    </form>
  );
}
