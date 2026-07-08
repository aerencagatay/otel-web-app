import { Cormorant_Garamond, DM_Sans } from "next/font/google";

/**
 * Ortak font tanımları. Hem herkese açık ([locale]) layout hem admin layout
 * aynı değişkenleri kullanır (globals.css `--font-heading` / `--font-body`
 * üzerinden okur). Birden fazla root layout olduğu için tek kaynaktan gelir.
 */
export const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const fontVariables = `${cormorant.variable} ${dmSans.variable}`;
