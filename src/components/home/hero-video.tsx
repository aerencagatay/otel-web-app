"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Hero arka plan videosu — performans odaklı yükleme stratejisi:
 *
 * - LCP elementi video değil, `priority` işaretli poster görselidir
 *   (next/image ile optimize edilir, anında görünür).
 * - Video `preload="none"` ile başlar ve `src`'si ancak tarayıcı boşta
 *   kaldığında (requestIdleCallback, yoksa kısa bir timeout) atanır;
 *   ilk boyama video indirmesiyle yarışmaz.
 * - prefers-reduced-motion açıksa video hiç indirilmez, poster kalır.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      const video = videoRef.current;
      if (!video) return;
      video.src = "/img/otel-video.mp4";
      video
        .play()
        .then(() => {
          if (!cancelled) setPlaying(true);
        })
        .catch(() => {
          /* autoplay engellendi — poster görünmeye devam eder */
        });
    };

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(start, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <Image
        src="/img/hero-poster.jpg"
        alt="Assos Karadut Taş Otel — taş mimari ve Ege manzarası"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="hero-video object-cover"
      />
      <video
        ref={videoRef}
        className="hero-video transition-opacity duration-700"
        style={{ opacity: playing ? 1 : 0 }}
        muted
        loop
        playsInline
        preload="none"
        poster="/img/hero-poster.jpg"
        aria-hidden="true"
      />
    </>
  );
}
