"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Giriş başarısız.");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(165deg, var(--color-ivory) 0%, var(--color-warm) 45%, #e8e4dc 100%)",
      }}
    >
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10">
          <div className="w-14 h-14 border border-border bg-white flex items-center justify-center mx-auto mb-5 rounded-sm shadow-sm">
            <Lock size={24} className="text-gold-dark" strokeWidth={1.5} />
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-dark font-semibold m-0 mb-2">
            Yönetim
          </p>
          <h1 className="font-heading text-[30px] font-semibold text-dark m-0">Giriş</h1>
          <p className="text-text-light text-[14px] mt-2 m-0">
            Rezervasyon paneli
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="premium-trip-card p-8 md:p-9"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 text-[14px]">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label">E-posta</label>
            <input
              type="email"
              className="form-input rounded-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-input rounded-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-gold w-full border-none py-3.5 text-[11px] tracking-[0.18em]"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Lock className="inline w-4 h-4 mr-2" />
            )}
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
