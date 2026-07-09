"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle, AlertCircle, MessageCircle } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_SUBJECTS } from "@/lib/utils/validation";
import { HOTEL } from "@/lib/config/hotel";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const PHONE_DIGITS = HOTEL.phone.replace(/\D/g, "");
const WHATSAPP_URL =
  `https://wa.me/${PHONE_DIGITS}?text=` +
  encodeURIComponent(`Merhaba, ${HOTEL.name} hakkında bilgi almak istiyorum.`);

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(undefined);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject,
          message,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Mesajınız gönderilemedi. Lütfen tekrar deneyin.");
        return;
      }

      trackEvent("contact_submitted");
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Bağlantı hatası. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-green-700/25 bg-green-50 text-green-800 px-5 py-6 rounded-[var(--radius-sm)] flex items-start gap-3">
        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold m-0 mb-1">Mesajınız iletildi</p>
          <p className="text-[13.5px] m-0">
            En kısa sürede size dönüş yapacağız. Acil durumlar için bizi doğrudan
            arayabilirsiniz: <a href={`tel:+${PHONE_DIGITS}`} className="underline">{HOTEL.phone}</a>.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-[12px] font-semibold tracking-[0.15em] uppercase underline mt-3 bg-transparent border-0 cursor-pointer p-0 text-green-800"
          >
            Yeni mesaj gönder
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        {status === "error" && errorMessage && (
          <div className="border border-red-700/25 bg-red-50 text-red-700 px-4 py-3 mb-5 text-[14px] rounded-[var(--radius-sm)] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="form-label" htmlFor="cf-name">
              Ad Soyad
            </label>
            <input
              id="cf-name"
              type="text"
              className="form-input"
              placeholder="Adınız ve soyadınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="cf-phone">
              Telefon <span className="text-text-light font-normal normal-case tracking-normal">(isteğe bağlı)</span>
            </label>
            <input
              id="cf-phone"
              type="tel"
              className="form-input"
              placeholder="+90 5__ ___ __ __"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </div>
        <div className="mt-5">
          <label className="form-label" htmlFor="cf-email">
            E-posta
          </label>
          <input
            id="cf-email"
            type="email"
            className="form-input"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="mt-5">
          <label className="form-label" htmlFor="cf-subject">
            Konu
          </label>
          <select
            id="cf-subject"
            className="form-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="" disabled>
              Konu seçin
            </option>
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-5">
          <label className="form-label" htmlFor="cf-message">
            Mesajınız
          </label>
          <textarea
            id="cf-message"
            className="form-input"
            rows={5}
            placeholder="Mesajınızı buraya yazın..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
            maxLength={1000}
          />
        </div>

        {TURNSTILE_SITE_KEY && (
          <div className="mt-5">
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              options={{ size: "invisible" }}
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken(undefined)}
            />
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="btn-gold w-full border-none cursor-pointer disabled:opacity-60"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              "Gönderiliyor…"
            ) : (
              <>
                <Send className="inline w-4 h-4 mr-2" />
                Gönder
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-[13px] text-text-light mb-3">
          Daha hızlı yanıt için doğrudan WhatsApp&apos;tan yazabilirsiniz.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click")}
          className="inline-flex items-center gap-2 text-[12.5px] font-semibold tracking-[0.1em] uppercase text-white bg-[#25D366] px-5 py-2.5 rounded-[var(--radius-sm)] no-underline hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp&apos;tan Yazın
        </a>
      </div>

      <p className="text-[11.5px] text-text-light mt-6 text-center">
        Formu göndererek{" "}
        <Link href="/kvkk" className="text-gold-dark underline">
          KVKK Aydınlatma Metni&apos;ni
        </Link>{" "}
        kabul etmiş olursunuz.
      </p>
    </>
  );
}
