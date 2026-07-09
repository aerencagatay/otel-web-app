"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Loader2, Phone, MessageCircle, Clock, CalendarCheck2 } from "lucide-react";
import { HOTEL } from "@/lib/config/hotel";
import { whatsappUrl } from "@/lib/config/whatsapp";

type LookupResult = {
  reservationId: string;
  status: "pending" | "confirmed" | "cancelled";
  checkIn: string;
  checkOut: string;
  nights: number;
  roomLabel: string;
  roomTypeName: string;
  depositAmount: number;
  adults: number;
  children: number;
};

export default function ReservationLookupForm() {
  const t = useTranslations("reservationLookup");
  const tErr = useTranslations("apiErrors");

  const [reservationId, setReservationId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  function translateError(code: unknown): string {
    return typeof code === "string" && tErr.has(code) ? tErr(code) : tErr("unknown");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/reservations/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setError(t("notFound"));
        } else {
          setError(translateError(data.error));
        }
        return;
      }

      setResult(data);
    } catch {
      setError(t("connectionError"));
    } finally {
      setLoading(false);
    }
  }

  const statusLabel: Record<LookupResult["status"], string> = {
    pending: t("status.pending"),
    confirmed: t("status.confirmed"),
    cancelled: t("status.cancelled"),
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="booking-card max-w-xl mx-auto">
        <div className="form-field mb-5">
          <label className="form-label" htmlFor="lookup-id">
            {t("reservationIdLabel")}
          </label>
          <input
            id="lookup-id"
            type="text"
            required
            className="form-input"
            placeholder={t("reservationIdPlaceholder")}
            value={reservationId}
            onChange={(e) => setReservationId(e.target.value)}
          />
        </div>
        <div className="form-field mb-6">
          <label className="form-label" htmlFor="lookup-email">
            {t("emailLabel")}
          </label>
          <input
            id="lookup-email"
            type="email"
            required
            className="form-input"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn-cta-solid w-full justify-center inline-flex items-center gap-2 py-3.5"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? t("searching") : t("submit")}
        </button>

        {error && (
          <p className="text-red-700 text-[13px] mt-4 text-center m-0">{error}</p>
        )}
      </form>

      {result && (
        <div className="premium-trip-card max-w-xl mx-auto mt-8">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-border">
            <span className="font-mono text-[15px] font-semibold text-dark">
              {result.reservationId}
            </span>
            <span
              className={`text-[10px] tracking-[0.16em] uppercase font-semibold px-3 py-1.5 rounded-[var(--radius-pill)] ${
                result.status === "confirmed"
                  ? "bg-green-100 text-green-800"
                  : result.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-900"
              }`}
            >
              {statusLabel[result.status]}
            </span>
          </div>

          <div className="space-y-3 text-[14px] mb-6">
            <div className="flex justify-between gap-3">
              <span className="text-text-light">{t("room")}</span>
              <span className="font-medium text-dark text-right">{result.roomTypeName}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-text-light">{t("checkIn")}</span>
              <span className="font-medium text-dark">{result.checkIn}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-text-light">{t("checkOut")}</span>
              <span className="font-medium text-dark">{result.checkOut}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-text-light">{t("nights")}</span>
              <span className="font-medium text-dark">{result.nights}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-text-light">{t("deposit")}</span>
              <span className="font-medium text-dark">
                {result.depositAmount.toLocaleString("tr-TR")} ₺
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <p className="text-[12.5px] text-text-light mb-4 flex items-center gap-2">
              <Clock size={14} />
              {t("changeHint")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${HOTEL.phone.replace(/\s/g, "")}`}
                className="btn-dark-sq flex-1 justify-center inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {t("callUs")}
              </a>
              <a
                href={whatsappUrl(
                  t("whatsappMessage", { reservationId: result.reservationId })
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex-1 justify-center inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {t("whatsapp")}
              </a>
            </div>
          </div>
        </div>
      )}

      {!result && !error && (
        <p className="text-text-light text-[13px] text-center mt-8 flex items-center justify-center gap-2">
          <CalendarCheck2 size={15} />
          {t("hint")}
        </p>
      )}
    </div>
  );
}
