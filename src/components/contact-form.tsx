"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    trackEvent("contact_submitted");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      (e.target as HTMLFormElement).reset();
    }, 3000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="form-label">{t("name")}</label>
          <input
            type="text"
            className="form-input"
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div>
          <label className="form-label">{t("phone")}</label>
          <input
            type="tel"
            className="form-input"
            placeholder="+90 5__ ___ __ __"
          />
        </div>
      </div>
      <div className="mt-5">
        <label className="form-label">{t("email")}</label>
        <input
          type="email"
          className="form-input"
          placeholder={t("emailPlaceholder")}
        />
      </div>
      <div className="mt-5">
        <label className="form-label">{t("subject")}</label>
        <select className="form-input" defaultValue="">
          <option value="" disabled>
            {t("subjectPlaceholder")}
          </option>
          <option>{t("subjectGeneral")}</option>
          <option>{t("subjectReservation")}</option>
          <option>{t("subjectPrice")}</option>
          <option>{t("subjectComplaint")}</option>
          <option>{t("subjectOther")}</option>
        </select>
      </div>
      <div className="mt-5">
        <label className="form-label">{t("message")}</label>
        <textarea
          className="form-input"
          rows={5}
          placeholder={t("messagePlaceholder")}
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="btn-gold w-full border-none cursor-pointer"
          style={
            submitted
              ? { background: "#28a745", borderColor: "#28a745" }
              : undefined
          }
        >
          {submitted ? (
            <>
              <CheckCircle className="inline w-4 h-4 mr-2" />
              {t("submitted")}
            </>
          ) : (
            <>
              <Send className="inline w-4 h-4 mr-2" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
