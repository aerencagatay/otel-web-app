import Link from "next/link";

interface PageHeroProps {
  title: string;
  breadcrumb: string;
  backgroundImage?: string;
}

export default function PageHero({
  title,
  breadcrumb,
  backgroundImage = "/img/hotel.JPG",
}: PageHeroProps) {
  return (
    <div style={{ paddingTop: "38px" }}>
      <div
        className="page-hero"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="relative z-2 text-white px-4">
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/60 mb-3 m-0">
            Assos Karadut
          </p>
          <h1
            className="text-white mb-5 font-heading font-semibold tracking-tight m-0"
            style={{ fontSize: "clamp(1.85rem, 4.5vw, 3rem)" }}
          >
            {title}
          </h1>
          <nav className="flex justify-center gap-2 text-[11px] tracking-[0.12em] uppercase">
            <Link href="/" className="text-white/55 no-underline hover:text-white transition-colors">
              Anasayfa
            </Link>
            <span className="text-white/25">·</span>
            <span className="text-gold-light">{breadcrumb}</span>
          </nav>
        </div>
      </div>
    </div>
  );
}
