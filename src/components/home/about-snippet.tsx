import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

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
            <Image
              src="/img/hotel-web.jpg"
              alt={t("imageAlt")}
              width={600}
              height={520}
              className="w-full h-[520px] object-cover"
            />
            <div className="about-accent" />
          </div>

          <div className="lg:pl-14">
            <span className="eyebrow">{t("eyebrow")}</span>
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
              {highlights.map((h) => (
                <li
                  key={h}
                  className="text-[13.5px] tracking-[0.04em] text-dark py-3 border-b border-border first:border-t first:border-border"
                >
                  {h}
                </li>
              ))}
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
