import { Fraunces, Archivo } from "next/font/google";

/**
 * Ortak font tanımları. Hem herkese açık ([locale]) layout hem admin layout
 * aynı değişkenleri kullanır (globals.css `--font-heading` / `--font-body`
 * üzerinden okur). Birden fazla root layout olduğu için tek kaynaktan gelir.
 *
 * Seçim gerekçesi (UI_UX_AUDIT.md §8.4): önceki Cormorant Garamond + DM Sans
 * ikilisi teknik olarak sağlamdı ama "butik otel şablonu"nun varsayılan
 * ikilisiydi ve Cormorant gövde boyutlarında incelip kayboluyordu (13px'lik
 * h5 başlıkların okunmaması bundandı).
 *
 * - Fraunces: eski-stil serif, değişken `SOFT`/`WONK` eksenleriyle gerçek bir
 *   karaktere sahip; optik boyut ekseni sayesinde 13px'te de 80px'te de sağlam.
 * - Archivo: endüstriyel grotesk. DM Sans'tan belirgin yüksek x-yüksekliği →
 *   aynı puntoda daha okunur.
 *
 * `latin-ext` alt kümesi ZORUNLU: Türkçe ş/ğ/ı/İ karakterleri `latin`
 * içinde yok, eksik bırakılırsa bu harfler sistem fontuna düşer.
 */
export const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${archivo.variable}`;
