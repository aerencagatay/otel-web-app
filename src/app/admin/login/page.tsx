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
    <div className="min-h-screen bg-warm flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-gold" />
          </div>
          <h1 className="font-heading text-[28px] text-dark">Admin Girişi</h1>
          <p className="text-text-light text-[14px] mt-2">
            Assos Karadut Taş Otel Yönetim Paneli
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-border p-8"
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
              className="form-input"
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
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-gold w-full border-none"
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
