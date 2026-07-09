"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
    consent: boolean;
  }) => void;
  submitting: boolean;
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function BookingForm({ onSubmit, submitting }: Props) {
  const t = useTranslations("booking.form");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+90 ");
  const [notes, setNotes] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | undefined>(
    undefined
  );
  const [consent, setConsent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !consent) return;
    onSubmit({
      firstName,
      lastName,
      email,
      phone,
      notes: notes || undefined,
      turnstileToken,
      consent,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="booking-card">
      <div className="mb-8 pb-8 border-b border-border">
        <p className="text-[10px] tracking-[0.28em] uppercase text-gold-dark font-semibold m-0 mb-2">
          {t("step")}
        </p>
        <h3 className="type-section-title m-0">{t("title")}</h3>
        <p className="type-lede mt-3 mb-0 max-w-xl">
          {t("lede")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div className="form-field">
          <label className="form-label" htmlFor="bf-first">
            {t("firstName")}
          </label>
          <input
            id="bf-first"
            type="text"
            className="form-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={t("firstNamePlaceholder")}
            required
            autoComplete="given-name"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="bf-last">
            {t("lastName")}
          </label>
          <input
            id="bf-last"
            type="text"
            className="form-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={t("lastNamePlaceholder")}
            required
            autoComplete="family-name"
          />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="bf-email">
            {t("email")}
          </label>
          <input
            id="bf-email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            required
            autoComplete="email"
          />
          <p className="form-hint">{t("emailHint")}</p>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="bf-phone">
            {t("phone")}
          </label>
          <input
            id="bf-phone"
            type="tel"
            className="form-input"
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
          {t("notes")} <span className="text-text-light font-normal normal-case tracking-normal">{t("notesOptional")}</span>
        </label>
        <textarea
          id="bf-notes"
          className="form-input min-h-[108px] resize-y"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("notesPlaceholder")}
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

      <div className="form-field mt-6">
        <label className="flex items-start gap-2.5 text-[13px] text-text cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-0.5 shrink-0"
          />
          <span>
            {t.rich("consent", {
              link: (chunks) => (
                <Link href="/kvkk" target="_blank" className="text-gold-dark underline">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
      </div>

      <div className="mt-10">
        <button
          type="submit"
          className="btn-cta-solid w-full justify-center py-4 text-[10px] tracking-[0.24em] border-0 disabled:opacity-60 disabled:transform-none"
          disabled={submitting || !consent}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" strokeWidth={1.75} />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
