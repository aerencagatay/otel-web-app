import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Admin Panel – Assos Karadut Taş Otel",
  robots: { index: false, follow: false },
};

/**
 * Admin, locale yönlendirmesinin dışındadır ve daima Türkçedir. Kök layout
 * passthrough olduğu için `<html>`/`<body>` burada tanımlanır (çok-root
 * yapısı).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
