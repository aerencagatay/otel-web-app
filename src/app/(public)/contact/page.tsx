import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import ContactForm from "@/components/contact-form";
import JsonLd, { contactJsonLd } from "@/components/seo/json-ld";
import {
  MapPin,
  Phone,
  Mail,
  Umbrella,
  Landmark,
  Ship,
} from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Assos Karadut Taş Otel iletişim: +90 501 091 34 17 | karaduttas@gmail.com | Büyükhusun Köyü Namazgah Mevkii No:26, Ayvacık, Çanakkale.",
  alternates: { canonical: "/contact" },
};

const contactCards = [
  {
    icon: MapPin,
    title: "Adres",
    content: (
      <>
        Büyükhusun Köyü Namazgah Mevkii No:26,
        <br />
        Ayvacık, Çanakkale 17860
      </>
    ),
    link: { href: "https://maps.google.com", text: "HARİTADA AÇ →" },
  },
  {
    icon: Phone,
    title: "Telefon",
    content: (
      <a
        href="tel:+905010913417"
        className="font-heading text-[22px] font-bold text-dark no-underline"
      >
        +90 501 091 34 17
      </a>
    ),
    sub: "7/24 hizmet",
  },
  {
    icon: Mail,
    title: "E-posta",
    content: (
      <a
        href="mailto:karaduttas@gmail.com"
        className="text-dark no-underline"
      >
        karaduttas@gmail.com
      </a>
    ),
    sub: "En geç 24 saat içinde yanıt",
  },
];

const nearbyPlaces = [
  {
    icon: Umbrella,
    title: "Kadırga Plajı",
    desc: "Ege'nin berrak sularında yüzme ve güneşlenme imkânı. 5 dakika mesafe.",
  },
  {
    icon: Landmark,
    title: "Antik Assos",
    desc: "Aristo'nun yaşadığı tarihi antik kent ve Zeus Tapınağı kalıntıları. 7 dakika.",
  },
  {
    icon: Ship,
    title: "Assos Limanı",
    desc: "Tekneler, balık restoranları ve Ege manzarası eşliğinde romantik akşamlar. 10 dakika.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd()} />
      <PageHero title="İletişim" breadcrumb="İletişim" />

      {/* Contact Cards */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {contactCards.map((card, i) => (
              <div key={i} className="contact-info-card">
                <div className="contact-icon">
                  <card.icon size={24} className="text-gold transition-colors" />
                </div>
                <h5 className="text-[14px] tracking-wide uppercase mb-2.5">
                  {card.title}
                </h5>
                <div className="text-[14px] text-text">{card.content}</div>
                {card.sub && (
                  <p className="text-[12px] text-text-light -mt-2">
                    {card.sub}
                  </p>
                )}
                {card.link && (
                  <a
                    href={card.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[12px] text-gold no-underline tracking-wide font-semibold"
                  >
                    {card.link.text}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="section-py bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Form */}
            <div>
              <span className="eyebrow">Mesaj Gönderin</span>
              <h2 className="mb-4">Bize Yazın</h2>
              <p className="text-[14.5px] text-text-light mb-8">
                Soru, öneri veya bilgi talepleriniz için aşağıdaki formu
                doldurun. En kısa sürede size dönüş yapacağız.
              </p>
              <ContactForm />
            </div>

            {/* Map + Distances */}
            <div>
              <span className="eyebrow">Konumumuz</span>
              <h2 className="mb-4">Nasıl Gelinir?</h2>

              <div className="w-full h-[clamp(260px,32vw,340px)] bg-warm border border-border flex items-center justify-center mb-8">
                <div className="text-center p-6">
                  <MapPin size={28} className="text-gold mx-auto mb-4" />
                  <p className="text-[14px] text-text-light m-0">
                    Büyükhusun Köyü Namazgah Mevkii No:26,
                    <br />
                    Ayvacık, Çanakkale 17860
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold inline-block mt-5 text-[10px] py-2.5 px-5"
                  >
                    Google Haritalar&apos;da Aç
                  </a>
                </div>
              </div>

              <div className="location-item">
                <div className="location-num">5&apos;</div>
                <div>
                  <h6 className="text-[14px] font-bold mb-0.5">
                    Kadırga Plajı
                  </h6>
                  <p className="text-[12.5px] text-text-light m-0">
                    Araç ile yaklaşık 5 dakika
                  </p>
                </div>
              </div>
              <div className="location-item">
                <div className="location-num">7&apos;</div>
                <div>
                  <h6 className="text-[14px] font-bold mb-0.5">
                    Antik Assos (Behramkale)
                  </h6>
                  <p className="text-[12.5px] text-text-light m-0">
                    Araç ile yaklaşık 7 dakika
                  </p>
                </div>
              </div>
              <div className="location-item">
                <div className="location-num">10&apos;</div>
                <div>
                  <h6 className="text-[14px] font-bold mb-0.5">
                    Assos Limanı
                  </h6>
                  <p className="text-[12.5px] text-text-light m-0">
                    Araç ile yaklaşık 10 dakika
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby */}
      <section className="section-sm bg-warm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-15">
            <span className="eyebrow">Çevrede</span>
            <h2>Yakın Aktiviteler</h2>
            <div className="divider-gold-center" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {nearbyPlaces.map((p, i) => (
              <div key={i} className="amenity-card">
                <div className="amenity-icon">
                  <p.icon size={24} className="text-gold" />
                </div>
                <h5 className="text-[13px] tracking-[1.2px] uppercase mb-2">
                  {p.title}
                </h5>
                <p className="text-[13px] text-text-light m-0">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
