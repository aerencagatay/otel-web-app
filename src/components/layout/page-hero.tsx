"use client";

import { useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Link } from "@/i18n/navigation";

interface PageHeroProps {
  /** Başlık; iki satırlık kompozisyon için ReactNode da verilebilir. */
  title: ReactNode;
  breadcrumb: string;
  /** Başlığın altında duran kısa açıklama cümlesi (opsiyonel). */
  lede?: ReactNode;
  /**
   * Hero arka planı. YATAY kadraj olmalı: eski varsayılan `/img/hotel-web.jpg`
   * 2000×3000 dikeydi ve yatay hero çerçevesinde fotoğrafın yarısından fazlası
   * merkezden kırpılıyordu (bulgu Y11). Varsayılan artık 2000×1333 dış cephe.
   */
  backgroundImage?: string;
  /** Kırpma odağı — dikey bir kaynak verilmek zorunda kalınırsa ayarlanır. */
  focalPoint?: string;
}

// §8.10: tek easing, üç süre. Tuple tipi TS'in Easing imzasına birebir uysun.
const EASE: [number, number, number, number] = [0.2, 0.7, 0.3, 1];

export default function PageHero({
  title,
  breadcrumb,
  lede,
  backgroundImage = "/img/dis-cephe-web.jpg",
  focalPoint = "center 50%",
}: PageHeroProps) {
  const t = useTranslations("pageHero");
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Hero kaydırma boyunca ilerlerken arka plan katmanı hafifçe geride kalır.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end start"],
  });
  // Abartma yok: en fazla 42px kayma ve %5 ölçek. Hareket azaltmada tamamen düz.
  const bgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 42]);
  const bgScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 1.05],
  );

  const intro = { duration: reduceMotion ? 0 : 0.55, ease: EASE };

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={rootRef} className="page-hero overflow-hidden">
        {/*
          Katman sırası (hepsi z-index:auto, boyama DOM sırasına göre):
          globals.css'teki `.page-hero::before` en altta kalır ve bu görsel
          katman tarafından örtülür; bu yüzden scrim'i burada kendimiz kuruyoruz.
          İçerik `z-2` ile her ikisinin de üstünde durur.
        */}
        <m.div
          aria-hidden="true"
          className="absolute inset-x-0 -top-[6%] -bottom-[6%] bg-cover will-change-transform"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundPosition: focalPoint,
            y: bgY,
            scale: bgScale,
          }}
        />
        {/* Deterministik scrim: kontrast fotoğrafın parlaklığına bağlı kalmaz. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(29,27,24,.42)_0%,rgba(29,27,24,.55)_55%,rgba(29,27,24,.78)_100%)]"
        />

        <div className="relative z-2 w-full px-5 text-white">
          <m.h1
            className="m-0 font-heading font-semibold tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 4.6vw, 3.25rem)", lineHeight: 1.12 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={intro}
          >
            {title}
          </m.h1>

          {lede ? (
            <m.p
              className="measure-tight mx-auto mt-5 mb-0 text-[17px] leading-relaxed text-white/85"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...intro, delay: reduceMotion ? 0 : 0.12 }}
            >
              {lede}
            </m.p>
          ) : null}

          {/* Bulgu Y4: kırıntı yolu linkleri mobilde 44px dokunma alanı alır. */}
          <nav
            aria-label={breadcrumb}
            className="mt-4 flex items-center justify-center gap-2 text-[14px]"
          >
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center px-2 text-white/70 no-underline transition-colors hover:text-white"
            >
              {t("home")}
            </Link>
            <span aria-hidden="true" className="text-white/35">
              /
            </span>
            <span className="inline-flex min-h-[44px] items-center px-2 text-white">
              {breadcrumb}
            </span>
          </nav>
        </div>
      </div>
    </LazyMotion>
  );
}
