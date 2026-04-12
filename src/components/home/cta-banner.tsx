import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="max-w-7xl mx-auto px-4 relative z-2">
        <span className="eyebrow" style={{ color: "#f0b830" }}>
          Rezervasyon
        </span>
        <h2
          className="text-white mb-3.5"
          style={{ fontSize: "clamp(26px, 4vw, 46px)" }}
        >
          Hayalinizdeki Tatil
          <br />
          Bir Telefon Kadar Yakın
        </h2>
        <p className="text-white/70 text-[15px] mb-2">
          Online ödeme yok, karmaşık form yok. Sadece bizi arayın,
          <br />
          size en uygun odayı birlikte bulalım.
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
          Rezervasyon Hakkında Bilgi Al
        </Link>
      </div>
    </section>
  );
}
