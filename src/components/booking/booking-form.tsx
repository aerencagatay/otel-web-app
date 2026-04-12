"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

interface Props {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes?: string;
  }) => void;
  submitting: boolean;
}

export default function BookingForm({ onSubmit, submitting }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) return;
    onSubmit({ firstName, lastName, email, phone, notes: notes || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Ad *</label>
          <input
            type="text"
            className="form-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Adınız"
            required
          />
        </div>
        <div>
          <label className="form-label">Soyad *</label>
          <input
            type="text"
            className="form-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Soyadınız"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="form-label">E-posta *</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            required
          />
        </div>
        <div>
          <label className="form-label">Telefon *</label>
          <input
            type="tel"
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90 5__ ___ __ __"
            required
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="form-label">Notlar (İsteğe Bağlı)</label>
        <textarea
          className="form-input"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Özel istekleriniz varsa belirtin..."
        />
      </div>
      <div className="mt-6">
        <button
          type="submit"
          className="btn-gold w-full"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
              Rezervasyon Oluşturuluyor...
            </>
          ) : (
            <>
              <Send className="inline w-4 h-4 mr-2" />
              Rezervasyonu Tamamla
            </>
          )}
        </button>
      </div>
    </form>
  );
}
