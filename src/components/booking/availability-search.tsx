"use client";

import { useState } from "react";
import { Search, CalendarDays, Users, BedDouble } from "lucide-react";
import type { SearchParams } from "./booking-flow";

interface Props {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

const roomTypes = [
  { value: "", label: "Tüm Oda Tipleri" },
  { value: "deluxe_sea_view", label: "Deluxe Deniz Manzaralı" },
  { value: "traditional_room", label: "Traditional Oda" },
  { value: "premium_family", label: "1+1 Premium (Aile)" },
];

export default function AvailabilitySearch({ onSearch, loading }: Props) {
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (checkIn >= checkOut) return;
    onSearch({ checkIn, checkOut, adults, children, roomType: roomType || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border p-8">
      <h3 className="text-[20px] mb-6">
        <CalendarDays className="inline w-5 h-5 mr-2 text-gold" />
        Müsaitlik Ara
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="form-label">Giriş Tarihi</label>
          <input
            type="date"
            className="form-input"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={fmt(new Date())}
            required
          />
        </div>
        <div>
          <label className="form-label">Çıkış Tarihi</label>
          <input
            type="date"
            className="form-input"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn}
            required
          />
        </div>
        <div>
          <label className="form-label">Yetişkin</label>
          <select
            className="form-input"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
          >
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n} Yetişkin
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Çocuk</label>
          <select
            className="form-input"
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
          >
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} Çocuk
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="form-label">Oda Tipi (İsteğe Bağlı)</label>
          <select
            className="form-input"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            {roomTypes.map((rt) => (
              <option key={rt.value} value={rt.value}>
                {rt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="btn-gold w-full"
            disabled={loading}
          >
            <Search className="inline w-4 h-4 mr-2" />
            {loading ? "Aranıyor..." : "Müsaitlik Ara"}
          </button>
        </div>
      </div>

      {checkIn >= checkOut && checkIn && checkOut && (
        <p className="text-red-500 text-[13px] mt-2">
          Çıkış tarihi giriş tarihinden sonra olmalıdır.
        </p>
      )}
    </form>
  );
}
