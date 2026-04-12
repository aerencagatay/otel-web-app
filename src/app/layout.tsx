import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Assos Karadut Taş Otel – Ayvacık, Çanakkale",
    template: "%s – Assos Karadut Taş Otel",
  },
  description:
    "Assos Karadut Taş Otel, Ayvacık'ın tarihi güzelliği içinde eşsiz bir konaklama deneyimi sunar. Kadırga Plajı'na 5 dakika, Assos Antik Kenti'ne 7 dakika.",
  keywords:
    "karadut taş otel, assos otel, ayvacık otel, çanakkale otel, taş otel çanakkale, kadırga koyu otel",
  metadataBase: new URL("https://karaduttasotel.com"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Assos Karadut Taş Otel",
    images: [{ url: "/img/hero.JPG", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/img/restauran_logo.png",
    apple: "/img/restauran_logo.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
