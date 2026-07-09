"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, CalendarDays } from "lucide-react";
import type { SearchParams } from "./booking-flow";
import DateRangePicker from "./date-range-picker";

interface Props {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
  prefill?: Partial<SearchParams>;
}

export default function AvailabilitySearch({
  onSearch,
  loading,
  prefill,
}: Props) {
  const t = useTranslations("booking.search");
  const tr = useTranslations("roomTypes");

  const roomTypes = [
    { value: "", label: t("allRoomTypes") },
    { value: "deluxe_sea_view", label: tr("deluxe_sea_view") },
    { value: "traditional_room", label: tr("traditional_room") },
    { value: "premium_family", label: tr("premium_family") },
  ];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(fmt(tomorrow));
  const [checkOut, setCheckOut] = useState(fmt(dayAfter));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState("");

  // URL'den gelen prefill değiştiğinde state'i senkronize et. Effect yerine
  // render sırasında güncelleme (React'in "adjusting state when a prop
  // changes" deseni) kullanılıyor — cascading render lint uyarısını da önler.
  const [appliedPrefill, setAppliedPrefill] = useState<
    Partial<SearchParams> | undefined
  >(undefined);
  if (prefill !== appliedPrefill) {
    setAppliedPrefill(prefill);
    if (prefill?.checkIn && prefill?.checkOut) {
      setCheckIn(prefill.checkIn);
      setCheckOut(prefill.checkOut);
      if (typeof prefill.adults === "number") setAdults(prefill.adults);
      if (typeof prefill.children === "number") setChildren(prefill.children);
      if (prefill.roomType !== undefined) setRoomType(prefill.roomType || "");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (checkIn >= checkOut) return;
    onSearch({
      checkIn,
      checkOut,
      adults,
      children,
      roomType: roomType || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="booking-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <p className="text-[10px] tracking-[0.28em] uppercase text-gold-dark font-semibold m-0 mb-2">
            {t("step")}
          </p>
          <h3 className="type-section-title m-0 flex items-center gap-2.5">
            <CalendarDays className="w-5 h-5 text-gold shrink-0" strokeWidth={1.5} />
            {t("title")}
          </h3>
        </div>
        <p className="type-lede m-0 max-w-xs sm:text-right">
          {t("lede")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          numberOfMonths={2}
          roomType={roomType || undefined}
          showSummary
          onChange={(ci, co) => {
            setCheckIn(ci);
            if (co) setCheckOut(co);
          }}
          className="grid grid-cols-2 gap-5 md:col-span-2"
          renderTrigger={({ checkInLabel, checkOutLabel, open, openPicker }) => (
            <>
              <div className="form-field">
                <label className="form-label">{t("checkInDate")}</label>
                <button
                  type="button"
                  className="form-input text-left"
                  onClick={openPicker}
                  aria-expanded={open}
                  aria-haspopup="dialog"
                >
                  {checkInLabel}
                </button>
              </div>
              <div className="form-field">
                <label className="form-label">{t("checkOutDate")}</label>
                <button
                  type="button"
                  className="form-input text-left"
                  onClick={openPicker}
                  aria-expanded={open}
                  aria-haspopup="dialog"
                >
                  {checkOutLabel}
                </button>
              </div>
            </>
          )}
        />
        <div className="form-field">
          <label className="form-label">{t("adults")}</label>
          <select
            className="form-input"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {t("adultsOption", { count: n })}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">{t("children")}</label>
          <select
            className="form-input"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
          >
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {t("childrenOption", { count: n })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <div className="form-field">
          <label className="form-label">{t("roomTypeOptional")}</label>
          <select
            className="form-input"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            {roomTypes.map((rt) => (
              <option key={rt.value || "all"} value={rt.value}>
                {rt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="btn-cta-solid w-full justify-center inline-flex items-center gap-2 py-3.5"
            disabled={loading}
          >
            <Search className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            {loading ? t("searching") : t("submit")}
          </button>
        </div>
      </div>

      {checkIn >= checkOut && checkIn && checkOut && (
        <p className="text-red-700 text-[13px] mt-3 m-0">
          {t("invalidDate")}
        </p>
      )}
    </form>
  );
}
