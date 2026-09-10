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
/**
 * Videonun servis edileceği alt sınır. Bulgu Y2: 390px'de bile 3.1 MB'lık
 * `otel-video.mp4` indiriliyordu (ölçülen toplam transfer 4.67 MB). Mobil
 * veri üzerindeki bir kullanıcı için bu doğrudan terk sebebi; ayrıca
 * kaynak 720x1280 dikey olduğu için telefonda zaten ağır kırpılıyor.
 */
const VIDEO_MIN_WIDTH = 768;

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  /** Video DOM'a hiç girmez: `src` atanmadığı gibi <video> de render edilmez. */
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mq = window.matchMedia(`(min-width: ${VIDEO_MIN_WIDTH}px)`);
    setAllowVideo(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setAllowVideo(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!allowVideo) return;
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
  }, [allowVideo]);

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
        /* Metin sola alındı; poster kadrajını sağa kaydırarak konuyu
           metnin altında kalmaktan kurtarıyoruz. */
        style={{ objectPosition: "70% center" }}
      />
      {allowVideo && (
        <video
          ref={videoRef}
          className="hero-video transition-opacity duration-700"
          /* Kaynak 720x1280 dikey (bulgu Y1). Yatay çerçevede merkez kırpma
             kompozisyonu bozuyordu; sağa kaydırılmış kadraj hem konuyu
             koruyor hem sola hizalı metinle çakışmayı azaltıyor. */
          style={{ opacity: playing ? 1 : 0, objectPosition: "70% center" }}
          muted
          loop
          playsInline
          preload="none"
          poster="/img/hero-poster.jpg"
          aria-hidden="true"
        />
      )}
    </>
  );
}
