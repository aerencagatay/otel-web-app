"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  CalendarDays,
  BedDouble,
  Users,
  Phone,
  Mail,
} from "lucide-react";
import type { ReservationLog } from "@/lib/sheets/log";

type Tab = "pending" | "confirmed" | "all";

export default function AdminDashboard() {
  const router = useRouter();
  const [reservations, setReservations] = useState<ReservationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchReservations() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reservations");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setReservations(data.reservations || []);
    } catch {
      console.error("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  async function handleConfirm(id: string) {
    if (!confirm("Bu rezervasyonu onaylamak istediğinizden emin misiniz?"))
      return;

    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}/confirm`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchReservations();
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Bu rezervasyonu iptal etmek istediğinizden emin misiniz?"))
      return;

    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}/cancel`, {
        method: "POST",
      });
      if (res.ok) {
        await fetchReservations();
      }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const filtered = reservations.filter((r) => {
    if (tab === "pending") return r.status === "pending";
    if (tab === "confirmed") return r.status === "confirmed";
    return true;
  });

  const pendingCount = reservations.filter(
    (r) => r.status === "pending"
  ).length;
  const confirmedCount = reservations.filter(
    (r) => r.status === "confirmed"
  ).length;

  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      {/* Header */}
      <div
        className="text-white px-6 py-5 flex items-center justify-between border-b border-white/10"
        style={{
          background:
            "linear-gradient(135deg, var(--color-dark) 0%, var(--color-olive) 100%)",
        }}
      >
        <div>
          <p className="text-[10px] tracking-[0.28em] uppercase text-white/50 m-0 mb-1">
            Yönetim
          </p>
          <h1 className="font-heading text-[22px] font-semibold m-0">Rezervasyonlar</h1>
          <p className="text-white/55 text-[12px] m-0 mt-1">
            Assos Karadut Taş Otel
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchReservations}
            className="text-white/60 hover:text-white transition-colors"
            title="Yenile"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-[13px]"
          >
            <LogOut size={16} />
            Çıkış
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-border p-6 shadow-[0_1px_0_rgba(26,28,24,0.04)] rounded-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-sm bg-amber-100 flex items-center justify-center shrink-0">
                <Clock size={20} className="text-amber-800" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[11px] text-text-light uppercase tracking-[0.15em]">
                  Kapora bekliyor
                </div>
                <div className="font-heading text-[28px] font-semibold text-dark leading-none mt-1">
                  {pendingCount}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-border p-6 shadow-[0_1px_0_rgba(26,28,24,0.04)] rounded-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-sm bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-emerald-800" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[11px] text-text-light uppercase tracking-[0.15em]">
                  Onaylı
                </div>
                <div className="font-heading text-[28px] font-semibold text-dark leading-none mt-1">
                  {confirmedCount}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-border p-6 shadow-[0_1px_0_rgba(26,28,24,0.04)] rounded-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-sm bg-dark/5 flex items-center justify-center shrink-0">
                <BedDouble size={20} className="text-gold-dark" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[11px] text-text-light uppercase tracking-[0.15em]">
                  Toplam kayıt
                </div>
                <div className="font-heading text-[28px] font-semibold text-dark leading-none mt-1">
                  {reservations.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          {(
            [
              { key: "pending", label: "Bekleyen", count: pendingCount },
              { key: "confirmed", label: "Onaylanan", count: confirmedCount },
              { key: "all", label: "Tümü", count: reservations.length },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-[11px] tracking-[0.12em] uppercase font-bold transition-colors rounded-sm ${
                tab === t.key
                  ? "bg-dark text-white"
                  : "bg-white text-text-light border border-border hover:border-dark/20"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16 bg-white border border-border">
            <Loader2 className="animate-spin text-gold" size={28} />
            <span className="ml-3 text-text-light">Yükleniyor...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white border border-border">
            <p className="text-text-light">Bu kategoride rezervasyon yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((res) => (
              <div
                key={res.reservationId}
                className="bg-white border border-border p-6 hover:shadow-[0_12px_40px_rgba(26,28,24,0.06)] transition-all rounded-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[14px] font-bold text-dark">
                        {res.reservationId}
                      </span>
                      <span
                        className={
                          res.status === "pending"
                            ? "admin-badge admin-badge--pending"
                            : res.status === "confirmed"
                              ? "admin-badge admin-badge--confirmed"
                              : "admin-badge admin-badge--cancelled"
                        }
                      >
                        {res.status === "pending"
                          ? "Bekliyor"
                          : res.status === "confirmed"
                            ? "Onaylandı"
                            : "İptal"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px]">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-gold" />
                        <span>
                          {res.firstName} {res.lastName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-gold" />
                        <span>
                          {res.checkIn} → {res.checkOut} ({res.nights}g)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BedDouble size={13} className="text-gold" />
                        <span>{res.roomLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gold font-bold">
                          {res.depositAmount.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-2 text-[12px] text-text-light">
                      <span className="flex items-center gap-1">
                        <Phone size={11} />
                        {res.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail size={11} />
                        {res.email}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    {res.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleConfirm(res.reservationId)}
                          disabled={actionLoading === res.reservationId}
                          className="px-4 py-2 bg-green-600 text-white text-[11px] tracking-wide uppercase font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === res.reservationId ? (
                            <Loader2
                              size={14}
                              className="animate-spin inline"
                            />
                          ) : (
                            <CheckCircle
                              size={14}
                              className="inline mr-1"
                            />
                          )}
                          Onayla
                        </button>
                        <button
                          onClick={() => handleCancel(res.reservationId)}
                          disabled={actionLoading === res.reservationId}
                          className="px-4 py-2 bg-red-600 text-white text-[11px] tracking-wide uppercase font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <XCircle size={14} className="inline mr-1" />
                          İptal
                        </button>
                      </>
                    )}
                    {res.status === "confirmed" && (
                      <button
                        onClick={() => handleCancel(res.reservationId)}
                        disabled={actionLoading === res.reservationId}
                        className="px-4 py-2 border border-red-300 text-red-600 text-[11px] tracking-wide uppercase font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={14} className="inline mr-1" />
                        İptal Et
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
