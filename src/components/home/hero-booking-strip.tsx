"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, Users, ArrowRight } from "lucide-react";

const roomTypes = [
  { value: "", label: "Tüm tipler" },
  { value: "deluxe_sea_view", label: "Deluxe deniz" },
  { value: "traditional_room", label: "Traditional" },
  { value: "premium_family", label: "Aile" },
];

function fmt(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function HeroBookingStrip() {
  const router = useRouter();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  const [checkIn, setCheckIn] = useState(fmt(tomorrow));
  const [checkOut, setCheckOut] = useState(fmt(dayAfter));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (checkIn >= checkOut) return;
    const qs = new URLSearchParams({
      checkIn,
      checkOut,
      adults: String(adults),
      children: String(children),
      auto: "1",
    });
    if (roomType) qs.set("roomType", roomType);
    router.push(`/reservation?${qs.toString()}`);
  }

  const invalid = checkIn >= checkOut && Boolean(checkIn && checkOut);

  return (
    <div className="hero-booking-shell animate-fade-up animate-fade-up-delay-3">
      <div className="flex flex-col xl:flex-row xl:items-end gap-6 xl:gap-10">
        <div className="flex-1 text-left xl:max-w-[340px] shrink-0">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-dark font-semibold mb-2">
            Hızlı arama
          </p>
          <h2 className="hero-booking-title m-0">
            Konaklama tarihleri
          </h2>
          <p className="text-[13px] text-text-light mt-3 mb-0 leading-relaxed">
            Müsait odaları görmek için gönderin — bilgileriniz rezervasyon sayfasına taşınır.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-3 items-end"
        >
          <div className="col-span-1">
            <label className="form-label flex items-center gap-1.5">
              <CalendarRange size={11} className="text-gold-dark/70" strokeWidth={1.5} />
              Giriş
            </label>
            <input
              type="date"
              className="form-input"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={fmt(new Date())}
              required
            />
          </div>
          <div className="col-span-1">
            <label className="form-label">Çıkış</label>
            <input
              type="date"
              className="form-input"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
              required
            />
          </div>
          <div className="col-span-1">
            <label className="form-label flex items-center gap-1.5">
              <Users size={11} className="text-gold-dark/70" strokeWidth={1.5} />
              Yetişkin
            </label>
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
          <div className="col-span-1">
            <label className="form-label">Çocuk</label>
            <select
              className="form-input"
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <label className="form-label">Oda</label>
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
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <button type="submit" className="btn-cta-solid w-full py-3.5 border-0">
              Müsaitlik
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </form>
      </div>
      {invalid && (
        <p className="text-red-700 text-[12px] mt-4 text-left m-0">
          Çıkış tarihi girişten sonra olmalıdır.
        </p>
      )}
    </div>
  );
}
