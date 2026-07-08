import type { Metadata } from "next";
import "./globals.css";

/**
 * Passthrough kök layout. `<html>`/`<body>` burada DEĞİL — birden fazla root
 * layout var:
 *   - herkese açık, çok dilli sayfalar → `src/app/[locale]/layout.tsx`
 *   - admin (yalnızca TR) → `src/app/admin/layout.tsx`
 * Bu dosya yalnızca global CSS'i enjekte eder ve `metadataBase` gibi tüm
 * uygulama genelinde geçerli meta ayarlarını taşır.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://karaduttasotel.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
