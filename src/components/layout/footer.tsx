import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
                className="no-underline hover:text-gold transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="no-underline hover:text-gold transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Pages */}
          <div>
            <h6 className="footer-heading">{tf("pagesHeading")}</h6>
            <ul className="list-none p-0 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/55 no-underline text-[13.5px] hover:text-gold hover:pl-1 transition-all"
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
            <ul className="list-none p-0 space-y-2.5">
              <li>
                <a
                  href="tel:+905010913417"
                  className="text-white/55 no-underline text-[13.5px] hover:text-gold transition-colors"
                >
                  +90 501 091 34 17
                </a>
              </li>
              <li>
                <a
                  href="mailto:karaduttas@gmail.com"
                  className="text-white/55 no-underline text-[13.5px] hover:text-gold transition-colors"
                >
                  karaduttas@gmail.com
                </a>
              </li>
              <li className="text-white/55 text-[13.5px]">
                {tf("reception")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 mt-13 text-center text-white/35 text-[12.5px]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="footer-license">{tf("license")}</p>
        </div>
      </div>
    </footer>
  );
}
