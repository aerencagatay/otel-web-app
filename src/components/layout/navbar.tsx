"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { routing } from "@/i18n/routing";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Diğer dil: mevcut path korunarak locale değiştirilir.
  const otherLocale = routing.locales.find((l) => l !== locale) ?? "en";

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/rooms", label: t("rooms") },
    { href: "/reservation", label: t("reservation") },
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

  return (
    <div className="header-nav">
      <nav
        className={`navbar-base ${scrolled || menuOpen || solidNav ? "navbar-scrolled" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link
            href="/"
            className="navbar-brand-text shrink-0 no-underline max-w-[min(100%,220px)]"
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
            <a href="tel:+905010913417" className="nav-phone">
              +90 501 091 34 17
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
          <button
            className={`lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center ${
              scrolled || menuOpen || solidNav ? "text-dark" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={t("menu")}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-border px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 text-dark text-[11.5px] tracking-[1.8px] uppercase font-bold no-underline ${
                  pathname === link.href ? "text-gold" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+905010913417"
              className="nav-phone block py-3"
              onClick={() => setMenuOpen(false)}
            >
              +90 501 091 34 17
            </a>
            <Link
              href={pathname}
              locale={otherLocale}
              className="block py-3 text-dark text-[11.5px] tracking-[1.8px] uppercase font-bold no-underline"
              onClick={() => setMenuOpen(false)}
              aria-label={t("switchToLabel")}
            >
              {t("switchTo")}
            </Link>
            <Link
              href="/reservation"
              className="btn-cta-solid block mt-3 text-center no-underline"
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
