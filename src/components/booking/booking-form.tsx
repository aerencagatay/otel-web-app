"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

interface Props {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes?: string;
    turnstileToken?: string;
  }) => void;
  submitting: boolean;
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function BookingForm({ onSubmit, submitting }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(
    undefined
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) return;
    onSubmit({
      firstName,
      lastName,
      email,
      phone,
      notes: notes || undefined,
      turnstileToken,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="booking-card">
      <div className="mb-8 pb-8 border-b border-border">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold-dark font-semibold m-0 mb-2">
          Adım 3
        </p>
        <h3 className="type-section-title m-0">İletişim bilgileri</h3>
        <p className="type-lede mt-3 mb-0 max-w-xl">
          Bu bilgiler rezervasyon kaydı ve kapora talimatları için kullanılır. Lütfen
          ulaşabileceğiniz bir telefon girin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div className="form-field">
          <label className="form-label" htmlFor="bf-first">
            Ad *
          </label>
          <input
            id="bf-first"
            type="text"
            className="form-input rounded-sm"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Adınız"
            required
            autoComplete="given-name"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="bf-last">
            Soyad *
          </label>
          <input
            id="bf-last"
            type="text"
            className="form-input rounded-sm"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Soyadınız"
            required
            autoComplete="family-name"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="bf-email">
            E-posta *
          </label>
          <input
            id="bf-email"
            type="email"
            className="form-input rounded-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            required
            autoComplete="email"
          />
          <p className="form-hint">Kapora ve onay bu adrese gönderilir.</p>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="bf-phone">
            Telefon *
          </label>
          <input
            id="bf-phone"
            type="tel"
            className="form-input rounded-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90 5__ ___ __ __"
            required
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="form-field mt-6">
        <label className="form-label" htmlFor="bf-notes">
          Notlar <span className="text-text-light font-normal normal-case tracking-normal">(isteğe bağlı)</span>
        </label>
        <textarea
          id="bf-notes"
          className="form-input rounded-sm min-h-[108px] resize-y"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Özel istek, varış saati…"
        />
      </div>

      {TURNSTILE_SITE_KEY && (
        <div className="mt-6">
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            options={{ size: "invisible" }}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(undefined)}
          />
        </div>
      )}

      <div className="mt-10">
        <button
          type="submit"
          className="btn-cta-solid w-full justify-center py-4 text-[10px] tracking-[0.24em] border-0 disabled:opacity-60 disabled:transform-none"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Gönderiliyor…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" strokeWidth={1.75} />
              Talebi gönder
            </>
          )}
        </button>
      </div>
    </form>
  );
}
