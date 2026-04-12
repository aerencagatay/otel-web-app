"use client";

import { useEffect, useState } from "react";
import { Search, CalendarDays } from "lucide-react";
import type { SearchParams } from "./booking-flow";

interface Props {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
  prefill?: Partial<SearchParams>;
}

const roomTypes = [
  { value: "", label: "Tüm Oda Tipleri" },
  { value: "deluxe_sea_view", label: "Deluxe Deniz Manzaralı" },
  { value: "traditional_room", label: "Traditional Oda" },
  { value: "premium_family", label: "1+1 Premium (Aile)" },
];

export default function AvailabilitySearch({
  onSearch,
  loading,
  prefill,
}: Props) {
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

  useEffect(() => {
    if (!prefill?.checkIn || !prefill?.checkOut) return;
    setCheckIn(prefill.checkIn);
    setCheckOut(prefill.checkOut);
    if (typeof prefill.adults === "number") setAdults(prefill.adults);
    if (typeof prefill.children === "number") setChildren(prefill.children);
    if (prefill.roomType !== undefined) setRoomType(prefill.roomType || "");
  }, [prefill]);

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
            Adım 1
          </p>
          <h3 className="type-section-title m-0 flex items-center gap-2.5">
            <CalendarDays className="w-5 h-5 text-gold shrink-0" strokeWidth={1.5} />
            Müsaitlik ara
          </h3>
        </div>
        <p className="type-lede m-0 max-w-xs sm:text-right">
          Tarih ve kişi sayısı seçin; uygun odaları anında listeleyelim.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="form-field">
          <label className="form-label">Giriş tarihi</label>
          <input
            type="date"
            className="form-input rounded-sm"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={fmt(new Date())}
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label">Çıkış tarihi</label>
          <input
            type="date"
            className="form-input rounded-sm"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn}
            required
          />
        </div>
        <div className="form-field">
          <label className="form-label">Yetişkin</label>
          <select
            className="form-input rounded-sm"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} yetişkin
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label">Çocuk</label>
          <select
            className="form-input rounded-sm"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
          >
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} çocuk
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="form-field">
          <label className="form-label">Oda tipi (isteğe bağlı)</label>
          <select
            className="form-input rounded-sm"
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
            {loading ? "Aranıyor…" : "Müsaitlik ara"}
          </button>
        </div>
      </div>

      {checkIn >= checkOut && checkIn && checkOut && (
        <p className="text-red-700 text-[13px] mt-3 m-0">
          Çıkış tarihi giriş tarihinden sonra olmalıdır.
        </p>
      )}
    </form>
  );
}
