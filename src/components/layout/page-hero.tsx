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
        <div className="relative z-2 text-white">
          <h1
            className="text-white mb-4"
            style={{ fontSize: "clamp(28px, 5vw, 52px)" }}
          >
            {title}
          </h1>
          <nav className="flex justify-center gap-2 text-[12px]">
            <Link href="/" className="text-white/65 no-underline">
              Anasayfa
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-gold">{breadcrumb}</span>
          </nav>
        </div>
      </div>
    </div>
  );
}
