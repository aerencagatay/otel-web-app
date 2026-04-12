import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="tr" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
