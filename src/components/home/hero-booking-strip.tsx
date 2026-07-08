"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import DateRangePicker from "@/components/booking/date-range-picker";

const roomTypes = [
  { value: "", label: "Tüm tipler" },
  { value: "deluxe_sea_view", label: "Deluxe tam deniz" },
  { value: "traditional_room", label: "Traditional kısmi" },
  { value: "premium_family", label: "Aile suit" },
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
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold-dark font-semibold mb-1.5">
          Hızlı arama
        </p>
        <h2 className="hero-booking-title m-0">Konaklama tarihleri</h2>
      </div>

      <form onSubmit={handleSubmit} className="hero-booking-bar">
        <div className="hero-booking-bar__field">
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            numberOfMonths={2}
            onChange={(ci, co) => {
              setCheckIn(ci);
              if (co) setCheckOut(co);
            }}
            className="flex flex-1"
            renderTrigger={({ checkInLabel, checkOutLabel, open, openPicker }) => (
              <>
                <button
                  type="button"
                  className="hero-booking-bar__segment"
                  onClick={openPicker}
                  aria-expanded={open}
                  aria-haspopup="dialog"
                >
                  <span className="hero-booking-bar__label">Giriş</span>
                  <span className="hero-booking-bar__value">{checkInLabel}</span>
                </button>
                <button
                  type="button"
                  className="hero-booking-bar__segment"
                  onClick={openPicker}
                  aria-expanded={open}
                  aria-haspopup="dialog"
                >
                  <span className="hero-booking-bar__label">Çıkış</span>
                  <span className="hero-booking-bar__value">{checkOutLabel}</span>
                </button>
              </>
            )}
          />
        </div>

        <div className="hero-booking-bar__field hero-booking-bar__field--single">
          <div className="hero-booking-bar__segment">
            <label className="hero-booking-bar__label" htmlFor="hb-adults">
              Yetişkin
            </label>
            <select
              id="hb-adults"
              className="hero-booking-bar__select"
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
        </div>

        <div className="hero-booking-bar__field hero-booking-bar__field--single">
          <div className="hero-booking-bar__segment">
            <label className="hero-booking-bar__label" htmlFor="hb-children">
              Çocuk
            </label>
            <select
              id="hb-children"
              className="hero-booking-bar__select"
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
        </div>

        <div className="hero-booking-bar__field">
          <div className="hero-booking-bar__segment">
            <label className="hero-booking-bar__label" htmlFor="hb-room">
              Oda
            </label>
            <select
              id="hb-room"
              className="hero-booking-bar__select"
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
        </div>

        <button type="submit" className="hero-booking-bar__submit">
          Müsaitliğe bak
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </form>

      {invalid ? (
        <p className="text-red-700 text-[12px] mt-4 text-left m-0">
          Çıkış tarihi girişten sonra olmalıdır.
        </p>
      ) : (
        <p className="text-[12px] text-text-light mt-4 mb-0 text-left leading-relaxed">
          Müsait odaları görmek için gönderin — bilgileriniz rezervasyon sayfasına taşınır.
        </p>
      )}
    </div>
  );
}
