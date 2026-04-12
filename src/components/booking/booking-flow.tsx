"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [step, setStep] = useState<"search" | "select" | "form">("search");
  const [search, setSearch] = useState<SearchParams | null>(null);
  const [rooms, setRooms] = useState<RoomResult[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSearch(params: SearchParams) {
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
  }

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

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-[14px]">
          {error}
        </div>
      )}

      {step === "search" && (
        <AvailabilitySearch onSearch={handleSearch} loading={loading} />
      )}

      {step === "select" && search && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px]">Müsait Odalar</h3>
            <button
              onClick={() => setStep("search")}
              className="text-gold text-[13px] font-semibold tracking-wide uppercase hover:underline"
            >
              ← Tarihleri Değiştir
            </button>
          </div>

          {rooms.length === 0 ? (
            <div className="text-center py-16 bg-white border border-border">
              <p className="text-text-light text-[16px]">
                Seçtiğiniz tarihler için müsait oda bulunamadı.
              </p>
              <button
                onClick={() => setStep("search")}
                className="btn-gold mt-4"
              >
                Farklı Tarih Deneyin
              </button>
            </div>
          ) : (
            <div className="space-y-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px]">Misafir Bilgileri</h3>
              <button
                onClick={() => setStep("select")}
                className="text-gold text-[13px] font-semibold tracking-wide uppercase hover:underline"
              >
                ← Oda Değiştir
              </button>
            </div>
            <BookingForm
              onSubmit={handleBookingSubmit}
              submitting={submitting}
            />
          </div>
          <div>
            <BookingSummary
              search={search}
              room={selectedRoom}
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-gold" size={32} />
          <span className="ml-3 text-text-light">
            Müsaitlik kontrol ediliyor...
          </span>
        </div>
      )}
    </div>
  );
}
