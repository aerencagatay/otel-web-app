import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Waves, UtensilsCrossed, Coffee, CarFront, type LucideIcon } from "lucide-react";

// Dört öne çıkan olanak (O2 ile aynı dörtlü: havuz, restoran, kahvaltı,
// otopark) — küçük bir ikon, metni tarama kolaylığı için destekler.
// Sıra, çeviri anahtarlarındaki highlight1..4 sırasıyla birebir eşleşir.
const HIGHLIGHT_ICONS: LucideIcon[] = [Waves, UtensilsCrossed, Coffee, CarFront];

export default function AboutSnippet() {
  const t = useTranslations("home.about");
  const highlights = [
    t("highlight1"),
    t("highlight2"),
    t("highlight3"),
    t("highlight4"),
  ];

  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            {/* Y11 düzeltmesi: sabit piksel yükseklik yerine tek bir oran
                (aspect-[4/3]) + <Image fill> — width/height çelişkisi ve
                Next.js uyarısı kaynağında kalkar. O1 düzeltmesi: iki kişinin
                poz verdiği kare yerine otelin taş dış cephesi (mekânın
                karakterini satan bir görsel) kullanıldı. */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]">
              <Image
                src="/img/dis-cephe-web.jpg"
                alt={t("imageAlt")}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
            <div className="about-accent" />
          </div>

          <div className="lg:pl-14">
            <h2
              className="mb-6 font-normal"
              style={{ fontSize: "clamp(28px, 4.2vw, 52px)", lineHeight: 1.18 }}
            >
              {t("titleLine1")}
              <br />
              {t("titleLine2")}
            </h2>
            <p className="text-[15px] leading-[1.85] text-text mb-4">
              {t("p1")}
            </p>
            <p className="text-[15px] leading-[1.85] text-text mb-8">
              {t("p2")}
            </p>
            <ul className="list-none p-0 mb-9">
              {highlights.map((h, i) => {
                const Icon = HIGHLIGHT_ICONS[i];
                return (
                  <li
                    key={h}
                    className="flex items-center gap-3 text-[14px] tracking-[0.01em] text-dark py-3 border-b border-border first:border-t first:border-border"
                  >
                    <Icon size={17} strokeWidth={1.5} className="text-stone-55 shrink-0" />
                    {h}
                  </li>
                );
              })}
            </ul>
            <Link
              href="/about"
              className="text-[11px] font-semibold tracking-[0.22em] uppercase text-gold-dark no-underline border-b border-gold-dark/40 pb-1 hover:border-gold-dark transition-colors"
            >
              {t("moreInfo")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
