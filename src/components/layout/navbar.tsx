"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { routing } from "@/i18n/routing";
import { HOTEL } from "@/lib/config/hotel";

const TEL_HREF = `tel:${HOTEL.phone.replace(/\s/g, "")}`;

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Diğer dil: mevcut path korunarak locale değiştirilir.
  const otherLocale = routing.locales.find((l) => l !== locale) ?? "en";

  /* Bulgu O5: "Rezervasyon" hem nav linki hem CTA butonu olarak iki kez
     görünüyordu. Aynı hedefe giden iki öğe yan yana durunca hangisinin
     birincil olduğu belirsizleşiyor. Nav listesinden çıkarıldı; dönüşüm
     işini CTA butonu üstleniyor. */
  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/rooms", label: t("rooms") },
    { href: "/contact", label: t("contact") },
  ] as const;

  // Üstünde koyu hero olmayan sayfalarda şeffaf navbar beyaz metniyle okunmaz;
  // bu rotalarda navbar her zaman opak (scrolled) stiliyle başlar.
  const solidNav = pathname.startsWith("/booking-success");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Bulgu Y8: menü açıkken arkadaki sayfa kaymaya devam ediyordu ve
     Escape ile kapanmıyordu. Panel tam ekran olduğu için gövde scroll'u
     kilitleniyor; kilit yalnızca menü açıkken kurulup temizleniyor. */
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  /* Rota değişince menü kapanmalı — aksi halde yeni sayfada açık kalıyor. */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="header-nav">
      <nav
        className={`navbar-base ${scrolled || menuOpen || solidNav ? "navbar-scrolled" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Bulgu Y6: 220px sınırı marka adını iki satıra kırıyordu
              ("Assos Karadut Taş / Otel"), navbar hizası bozuluyordu.
              Tek satır garanti altına alındı. */}
          <Link
            href="/"
            className="navbar-brand-text shrink-0 no-underline whitespace-nowrap"
          >
            {t("brand")}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-custom ${
                  pathname === link.href ? "nav-link-active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a href={TEL_HREF} className="nav-phone whitespace-nowrap">
              {HOTEL.phone}
            </a>
            <Link
              href={pathname}
              locale={otherLocale}
              className={`nav-lang-switch text-[11px] tracking-[1.5px] uppercase font-semibold no-underline transition-colors ${
                scrolled || menuOpen || solidNav
                  ? "text-dark hover:text-gold"
                  : "text-white/85 hover:text-white"
              }`}
              aria-label={t("switchToLabel")}
            >
              {t("switchTo")}
            </Link>
            <Link
              href="/reservation"
              className={`nav-cta ml-2 no-underline ${
                scrolled || menuOpen || solidNav ? "nav-cta--on-light" : "nav-cta--on-dark"
              }`}
            >
              {t("reservationCta")}
            </Link>
          </div>

          {/* Mobile toggle */}
          {/* Bulgu Y8: aria-expanded / aria-controls yoktu — ekran okuyucu
              menünün açık mı kapalı mı olduğunu duyuramıyordu. */}
          <button
            className={`lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center ${
              scrolled || menuOpen || solidNav ? "text-dark" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("menu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {/* Bulgu Y8: panel ekranın yalnızca üst ~460px'ini kaplıyordu,
            altında hero görünmeye devam ediyordu ve geçiş yarım duruyordu.
            Artık tam ekran. Bulgu Y4: satırlar 17px'ten min 48px'e çıktı;
            büyük harf + 1.8px harf aralığı bırakıldı (Y5). */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden fixed inset-0 top-0 z-[1001] bg-stone-00 overflow-y-auto px-6 pt-24 pb-10 flex flex-col"
          >
            <nav className="flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center min-h-[56px] font-heading text-[24px] no-underline border-b border-stone-15 ${
                    pathname === link.href ? "text-sea" : "text-ink"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <a
              href={TEL_HREF}
              className="flex items-center min-h-[48px] mt-6 text-[17px] text-ink no-underline"
              onClick={() => setMenuOpen(false)}
            >
              {HOTEL.phone}
            </a>
            <Link
              href={pathname}
              locale={otherLocale}
              className="flex items-center min-h-[48px] text-[17px] text-stone-55 no-underline"
              onClick={() => setMenuOpen(false)}
              aria-label={t("switchToLabel")}
            >
              {t("switchTo")}
            </Link>

            <Link
              href="/reservation"
              className="btn-cta-solid mt-6 no-underline"
              onClick={() => setMenuOpen(false)}
            >
              {t("reservationCta")}
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
