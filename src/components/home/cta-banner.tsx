import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function CtaBanner() {
  const t = useTranslations("home.cta");
  return (
    <section className="cta-banner">
      <div className="max-w-7xl mx-auto px-4 relative z-2">
        <span className="eyebrow" style={{ color: "#f0b830" }}>
          {t("eyebrow")}
        </span>
        <h2
          className="text-white mb-3.5"
          style={{ fontSize: "clamp(26px, 4vw, 46px)" }}
        >
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h2>
        <p className="text-white/70 text-[15px] mb-2">
          {t("text1")}
          <br />
          {t("text2")}
        </p>
        <a href="tel:+905010913417" className="phone-display">
          +90 501 091 34 17
        </a>
        <br />
        <Link
          href="/reservation"
          className="btn-outline-light"
          style={{ marginTop: "8px" }}
        >
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
