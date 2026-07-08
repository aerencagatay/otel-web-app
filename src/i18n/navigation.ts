import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigasyon yardımcıları. Bileşenler `next/link` /
 * `next/navigation` yerine BUNLARI kullanır; böylece linkler aktif locale'e
 * göre otomatik doğru öneki (TR: yok, EN: `/en`) alır.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
