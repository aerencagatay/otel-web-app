"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AvailabilitySearch from "./availability-search";
import RoomCard from "./room-card";
import BookingForm from "./booking-form";
import BookingSummary from "./booking-summary";
import { Loader2 } from "lucide-react";

export type RoomResult = {
  roomType: string;
  label: string;
  available: number;
  depositAmount: number;
  maxGuests: number;
};

export type SearchParams = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomType?: string;
};

export default function BookingFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoRan = useRef(false);

  const [step, setStep] = useState<"search" | "select" | "form">("search");
  const [search, setSearch] = useState<SearchParams | null>(null);
  const [rooms, setRooms] = useState<RoomResult[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [prefill, setPrefill] = useState<Partial<SearchParams> | undefined>(
    undefined
  );

  useEffect(() => {
    const ci = searchParams.get("checkIn") || undefined;
    const co = searchParams.get("checkOut") || undefined;
    const a = searchParams.get("adults");
    const c = searchParams.get("children");
    const rt = searchParams.get("roomType") || undefined;
    if (ci && co) {
      setPrefill({
        checkIn: ci,
        checkOut: co,
        adults: a ? Number(a) : 2,
        children: c ? Number(c) : 0,
        roomType: rt || undefined,
      });
    }
  }, [searchParams]);

  const runSearch = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setSearch(params);

    try {
      const qs = new URLSearchParams({
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        adults: String(params.adults),
        children: String(params.children),
        ...(params.roomType ? { roomType: params.roomType } : {}),
      });

      const res = await fetch(`/api/availability?${qs}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Müsaitlik kontrolü başarısız.");
        return;
      }

      setRooms(data.rooms || []);
      setStep("select");
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoRan.current) return;
    if (searchParams.get("auto") !== "1") return;
    const ci = searchParams.get("checkIn");
    const co = searchParams.get("checkOut");
    if (!ci || !co || ci >= co) return;
    autoRan.current = true;
    runSearch({
      checkIn: ci,
      checkOut: co,
      adults: Number(searchParams.get("adults") || 2),
      children: Number(searchParams.get("children") || 0),
      roomType: searchParams.get("roomType") || undefined,
    });
  }, [searchParams, runSearch]);

  function handleSelectRoom(room: RoomResult) {
    setSelectedRoom(room);
    setStep("form");
  }

  async function handleBookingSubmit(formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes?: string;
  }) {
    if (!search || !selectedRoom) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          checkIn: search.checkIn,
          checkOut: search.checkOut,
          adults: search.adults,
          children: search.children,
          roomType: selectedRoom.roomType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Rezervasyon oluşturulamadı.");
        setSubmitting(false);
        return;
      }

      router.push(`/booking-success?id=${data.reservationId}`);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  const progressLabels = ["Tarih & misafir", "Oda seçimi", "Bilgiler & kapora"];

  return (
    <div>
      <div className="booking-progress" aria-hidden="true">
        {progressLabels.map((label, i) => {
          const idx = step === "search" ? 0 : step === "select" ? 1 : 2;
          let cls = "booking-progress-step";
          if (i === idx) cls += " booking-progress-step--active";
          else if (i < idx) cls += " booking-progress-step--done";
          return (
            <div key={label} className={cls}>
              {i + 1}. {label}
            </div>
          );
        })}
      </div>

      {error && (
        <div
          className="border px-4 py-3 mb-6 text-[14px] rounded-sm"
          style={{
            background: "rgba(127, 29, 29, 0.06)",
            borderColor: "rgba(127, 29, 29, 0.25)",
            color: "#7f1d1d",
          }}
        >
          {error}
        </div>
      )}

      {step === "search" && (
        <div className="relative">
          <AvailabilitySearch
            onSearch={runSearch}
            loading={loading}
            prefill={prefill}
          />
          {loading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 backdrop-blur-[2px]">
              <Loader2 className="animate-spin text-gold" size={32} />
              <span className="ml-3 text-text-light text-[14px]">
                Müsaitlik kontrol ediliyor…
              </span>
            </div>
          )}
        </div>
      )}

      {step === "select" && search && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <h3 className="font-heading text-2xl font-semibold text-dark m-0">
              Müsait odalar
            </h3>
            <button
              type="button"
              onClick={() => {
                setStep("search");
                setRooms([]);
              }}
              className="text-gold-dark text-[11px] font-semibold tracking-[0.2em] uppercase hover:underline bg-transparent border-0 cursor-pointer p-0"
            >
              ← Tarihleri değiştir
            </button>
          </div>

          {rooms.length === 0 ? (
            <div className="state-surface">
              <p className="text-text-light text-[16px] mb-4 m-0">
                Seçtiğiniz tarihler için müsait oda bulunamadı.
              </p>
              <button type="button" onClick={() => setStep("search")} className="btn-gold">
                Farklı tarih dene
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {rooms.map((room) => (
                <RoomCard
                  key={room.roomType}
                  room={room}
                  onSelect={() => handleSelectRoom(room)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {step === "form" && search && selectedRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h3 className="font-heading text-2xl font-semibold text-dark m-0">
                Misafir bilgileri
              </h3>
              <button
                type="button"
                onClick={() => setStep("select")}
                className="text-gold-dark text-[11px] font-semibold tracking-[0.2em] uppercase hover:underline bg-transparent border-0 cursor-pointer p-0"
              >
                ← Oda değiştir
              </button>
            </div>
            <BookingForm
              onSubmit={handleBookingSubmit}
              submitting={submitting}
            />
          </div>
          <div>
            <BookingSummary search={search} room={selectedRoom} />
          </div>
        </div>
      )}
    </div>
  );
}
