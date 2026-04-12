"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/rooms", label: "Odalarımız" },
  { href: "/reservation", label: "Rezervasyon" },
  { href: "/contact", label: "İletişim" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="header-nav">
      <nav
        className={`navbar-base ${scrolled || menuOpen ? "navbar-scrolled" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/img/otel_logo.png"
              alt="Assos Karadut Taş Otel"
              width={220}
              height={120}
              className="navbar-logo"
              priority
            />
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
            <Link
              href="/reservation"
              className={`nav-cta ml-2 no-underline ${
                scrolled || menuOpen ? "nav-cta--on-light" : "nav-cta--on-dark"
              }`}
            >
              Rezervasyon
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden p-1 ${
              scrolled || menuOpen ? "text-dark" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü"
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
                className={`block py-2 text-dark text-[11.5px] tracking-[1.8px] uppercase font-bold no-underline ${
                  pathname === link.href ? "text-gold" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/reservation"
              className="btn-cta-solid block mt-3 text-center no-underline"
              onClick={() => setMenuOpen(false)}
            >
              Rezervasyon
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
