import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <p className="text-[13.5px] text-white/55 leading-[1.85]">
              Assos Karadut Taş Otel, Ayvacık&apos;ın tarihi güzelliği içinde
              geleneksel taş mimarisiyle modern konforu buluşturuyor.
              Misafirlerimize unutulmaz bir Ege deneyimi sunuyoruz.
            </p>
            <div className="flex gap-2.5 mt-5">
              {[
                { icon: FacebookIcon, href: "#" },
                {
                  icon: InstagramIcon,
                  href: "https://www.instagram.com/karaduttasotel/",
                },
                { icon: XIcon, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  className="w-[38px] h-[38px] border border-white/20 rounded-full flex items-center justify-center text-white/55 no-underline text-sm hover:bg-gold hover:border-gold hover:text-white transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h6 className="footer-heading">Sayfalar</h6>
            <ul className="list-none p-0 space-y-2.5">
              {[
                { href: "/", label: "Anasayfa" },
                { href: "/about", label: "Hakkımızda" },
                { href: "/rooms", label: "Odalarımız" },
                { href: "/reservation", label: "Rezervasyon" },
                { href: "/contact", label: "İletişim" },
              ].map((link) => (
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

          {/* Rooms */}
          <div>
            <h6 className="footer-heading">Odalar</h6>
            <ul className="list-none p-0 space-y-2.5">
              {[
                "Deluxe Deniz Manzaralı",
                "Deluxe Kısmi Manzaralı",
                "Aile Odası",
              ].map((room) => (
                <li key={room}>
                  <Link
                    href="/rooms"
                    className="text-white/55 no-underline text-[13.5px] hover:text-gold hover:pl-1 transition-all"
                  >
                    {room}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h6 className="footer-heading">İletişim</h6>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-white/55 text-[13.5px]">
                <MapPin
                  size={15}
                  className="text-gold mt-0.5 flex-shrink-0"
                />
                <span>
                  Büyükhusun Köyü Namazgah Mevkii No:26,
                  <br />
                  Ayvacık, Çanakkale 17860
                </span>
              </div>
              <div className="flex items-start gap-3 text-white/55 text-[13.5px]">
                <Phone size={15} className="text-gold mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+905010913417"
                  className="text-white/55 no-underline hover:text-gold"
                >
                  +90 501 091 34 17
                </a>
              </div>
              <div className="flex items-start gap-3 text-white/55 text-[13.5px]">
                <Mail size={15} className="text-gold mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:karaduttas@gmail.com"
                  className="text-white/55 no-underline hover:text-gold"
                >
                  karaduttas@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-white/55 text-[13.5px]">
                <Clock size={15} className="text-gold mt-0.5 flex-shrink-0" />
                <span>7/24 Resepsiyon Hizmeti</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 mt-13 text-center text-white/35 text-[12.5px]">
        <div className="max-w-7xl mx-auto px-4">
          <span>
            © 2024{" "}
            <Link href="/" className="text-white/50 no-underline hover:text-gold">
              Assos Karadut Taş Otel
            </Link>
            . Tüm hakları saklıdır.
          </span>
        </div>
      </div>
    </footer>
  );
}
