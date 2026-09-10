import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HOTEL } from "@/lib/config/hotel";

/* İletişim bilgileri tek kaynaktan (AGENTS.md kanonik bölümü); footer'da
   elle yazılı kopyaları vardı. */
const TEL_HREF = `tel:${HOTEL.phone.replace(/\s/g, "")}`;
const MAIL_HREF = `mailto:${HOTEL.email}`;

export default function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/rooms", label: t("rooms") },
    { href: "/reservation", label: t("reservation") },
    { href: "/contact", label: t("contact") },
  ] as const;

  const legalLinks = [
    { href: "/rezervasyon-sorgula", label: tf("legal.lookup") },
    { href: "/kvkk", label: tf("legal.kvkk") },
    { href: "/gizlilik", label: tf("legal.privacy") },
    { href: "/iptal-politikasi", label: tf("legal.cancellation") },
  ] as const;

  return (
    <footer className="site-footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand + adres */}
          <div>
            <p className="text-[15px] text-white font-semibold mb-2">
              Assos Karadut Taş Otel
            </p>
            <p className="text-[13.5px] text-white/55 leading-[1.85]">
              Büyükhusun Köyü Namazgah Mevkii No:26, Ayvacık, Çanakkale 17860
            </p>
            <div className="flex gap-4 mt-5 text-[13px] text-white/55">
              <a
                href="https://www.instagram.com/karaduttasotel/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[44px] no-underline hover:text-gold transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="inline-flex items-center min-h-[44px] no-underline hover:text-gold transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h6 className="footer-heading">{tf("pagesHeading")}</h6>
            <ul className="list-none p-0">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] text-white/55 no-underline text-[15px] hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h6 className="footer-heading">{tf("contactHeading")}</h6>
            <ul className="list-none p-0">
              <li>
                <a
                  href={TEL_HREF}
                  className="inline-flex items-center min-h-[44px] text-white/55 no-underline text-[15px] hover:text-gold transition-colors"
                >
                  {HOTEL.phone}
                </a>
              </li>
              <li>
                <a
                  href={MAIL_HREF}
                  className="inline-flex items-center min-h-[44px] text-white/55 no-underline text-[15px] hover:text-gold transition-colors"
                >
                  {HOTEL.email}
                </a>
              </li>
              <li className="flex items-center min-h-[44px] text-white/55 text-[15px]">
                {tf("reception")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 mt-13 text-center text-white/35 text-[12.5px]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="footer-license mb-3">{tf("license")}</p>
          {/* Bulgu Y4: yasal linkler 20px yüksekliğindeydi. Görsel boyut
              küçük kalabilir ama dokunma alanı min 44px olmalı. */}
          <div className="flex flex-wrap justify-center gap-x-5 text-[13px]">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center min-h-[44px] text-white/45 no-underline hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
