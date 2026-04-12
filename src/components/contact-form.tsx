"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      (e.target as HTMLFormElement).reset();
    }, 3000);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="form-label">Ad Soyad</label>
          <input
            type="text"
            className="form-input"
            placeholder="Adınız ve soyadınız"
          />
        </div>
        <div>
          <label className="form-label">Telefon</label>
          <input
            type="tel"
            className="form-input"
            placeholder="+90 5__ ___ __ __"
          />
        </div>
      </div>
      <div className="mt-3">
        <label className="form-label">E-posta</label>
        <input
          type="email"
          className="form-input"
          placeholder="ornek@email.com"
        />
      </div>
      <div className="mt-3">
        <label className="form-label">Konu</label>
        <select className="form-input" defaultValue="">
          <option value="" disabled>
            Konu seçin
          </option>
          <option>Genel Bilgi</option>
          <option>Rezervasyon</option>
          <option>Fiyat Bilgisi</option>
          <option>Şikayet / Öneri</option>
          <option>Diğer</option>
        </select>
      </div>
      <div className="mt-3">
        <label className="form-label">Mesajınız</label>
        <textarea
          className="form-input"
          rows={5}
          placeholder="Mesajınızı buraya yazın..."
        />
      </div>
      <div className="mt-3">
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
              Mesajınız İletildi
            </>
          ) : (
            <>
              <Send className="inline w-4 h-4 mr-2" />
              Gönder
            </>
          )}
        </button>
      </div>
    </form>
  );
}
