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
    <div className="min-h-screen bg-warm">
      {/* Header */}
      <div className="bg-dark text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[20px]">Admin Panel</h1>
          <p className="text-white/50 text-[12px]">
            Assos Karadut Taş Otel · Rezervasyon Yönetimi
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
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-border p-5">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-yellow-500" />
              <div>
                <div className="text-[12px] text-text-light uppercase tracking-wide">
                  Bekleyen
                </div>
                <div className="text-[24px] font-bold text-dark">
                  {pendingCount}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-border p-5">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-500" />
              <div>
                <div className="text-[12px] text-text-light uppercase tracking-wide">
                  Onaylanan
                </div>
                <div className="text-[24px] font-bold text-dark">
                  {confirmedCount}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-border p-5">
            <div className="flex items-center gap-3">
              <BedDouble size={20} className="text-gold" />
              <div>
                <div className="text-[12px] text-text-light uppercase tracking-wide">
                  Toplam
                </div>
                <div className="text-[24px] font-bold text-dark">
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
              className={`px-4 py-2 text-[12px] tracking-wide uppercase font-bold transition-colors ${
                tab === t.key
                  ? "bg-gold text-white"
                  : "bg-white text-text-light border border-border hover:border-gold"
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
                className="bg-white border border-border p-5 hover:border-gold transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[14px] font-bold text-dark">
                        {res.reservationId}
                      </span>
                      <span
                        className={`text-[10px] tracking-wide uppercase font-bold px-2 py-0.5 ${
                          res.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : res.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
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
