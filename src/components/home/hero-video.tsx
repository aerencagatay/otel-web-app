"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { getImageProps } from "next/image";

/**
 * Hero zemin medyası — performans odaklı yükleme stratejisi (korunuyor):
 *
 * - LCP elementi video değil, posterdir.
 * - Video `preload="none"` ile başlar ve `src`'si ancak tarayıcı boşta
 *   kaldığında (requestIdleCallback, yoksa kısa bir timeout) atanır;
 *   ilk boyama video indirmesiyle yarışmaz.
 * - prefers-reduced-motion açıksa video hiç indirilmez, poster kalır.
 *
 * DEĞİŞEN: video artık TAM EKRAN değil, sağ üstte 7:8'lik bir "pencere".
 * Gerekçe (bulgu Y1/K4): elde yatay master yok — `otel-video.mp4`,
 * `havuz-video.mp4` ve `oda-video.mp4` üçü de 720x1280 DİKEY ve üçünde de
 * gömülü pazarlama yazısı var. Üstelik hero klibi altı kesmeli bir sosyal
 * medya reel'i. 720 px genişliğindeki bir kaynağı 1440 px'lik yatay bir
 * çerçeveye yaymak 2x büyütme demekti; sitenin ilk ve en büyük görseli bu
 * yüzden bulanıktı. `scripts/build-hero-assets.mjs` tek kesintisiz planı
 * kırpıp yazıyı keserek 720x820'lik bir klip üretiyor; 320 CSS px'lik
 * pencerede bu, DPR2'de 0.89x küçültme — yani net.
 */

/**
 * Videonun servis edileceği alt sınır. Bulgu Y2: 390px'de bile 3.1 MB'lık
 * `otel-video.mp4` indiriliyordu (ölçülen toplam transfer 4.67 MB).
 * 768 -> 1024: pencere <1024px'te tasarımda zaten yok, o yüzden tablet
 * bandı da video indirmesinden kurtulur.
 */
const VIDEO_MIN_WIDTH = 1024;

/**
 * Medya sorgusunu React'in dış-kaynak aboneliği (useSyncExternalStore) ile
 * okuruz. Effect içinde setState çağırmak React 19'da zincirleme render'a
 * yol açtığı için önerilmiyor; bu API tam olarak matchMedia gibi harici
 * kaynaklar için var. Sunucu anlık görüntüsü `false`: HTML'de <video> hiç
 * bulunmaz, istemci geniş ekransa sonradan eklenir.
 */
const wideScreenStore = {
  subscribe(onChange: () => void) {
    const mq = window.matchMedia(`(min-width: ${VIDEO_MIN_WIDTH}px)`);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  },
  getSnapshot: () => window.matchMedia(`(min-width: ${VIDEO_MIN_WIDTH}px)`).matches,
  getServerSnapshot: () => false,
};

const POSTER_ALT = "Assos Karadut Taş Otel — taş mimari ve Ege manzarası";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Video DOM'a hiç girmez: `src` atanmadığı gibi <video> de render edilmez. */
  const allowVideo = useSyncExternalStore(
    wideScreenStore.subscribe,
    wideScreenStore.getSnapshot,
    wideScreenStore.getServerSnapshot
  );

  useEffect(() => {
    if (!allowVideo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      const video = videoRef.current;
      if (!video) return;
      video.src = "/img/hero-window-v1.mp4";
      video.play().catch(() => {
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

  /**
   * Sanat yönlü poster (art direction). Mobilde 1920x1280 YATAY kaynağın
   * genişliğinin ~%68'i indirilip atılıyordu; ayrıca kadraj koyu çerçeve
   * dışında bırakıyordu. `hero-poster-mobile.jpg` kaynağın pergola
   * açıklığını ve koy kavisini içeren dikey bölgesi — mobilde kendi başına
   * tam bir kompozisyon (75 KB, eskiden 344 KB).
   *
   * `<Image>` `media` niteliğini desteklemiyor; `hidden` ile iki <img>
   * render etmek de ikisini birden indirir. Next.js'in bu iş için
   * belgelenmiş yolu `getImageProps()` + gerçek bir `<picture>`.
   */
  const common = { alt: POSTER_ALT, sizes: "100vw" };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: "/img/hero-poster.jpg",
    width: 1920,
    height: 1280,
  });
  const {
    props: { srcSet: mobileSrcSet, ...rest },
  } = getImageProps({
    ...common,
    src: "/img/hero-poster-mobile.jpg",
    width: 720,
    height: 1280,
  });

  return (
    <>
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
        <source srcSet={mobileSrcSet} />
        {/* `preload` KULLANILMIYOR: iki farklı LCP adayı olduğunda Next.js
            belgeleri bunu açıkça yasaklıyor (ikisini birden preload eder).
            Doğru araç `fetchPriority="high"` + `loading="eager"`. */}
        <img
          {...rest}
          alt={POSTER_ALT}
          className="hero-media"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {allowVideo && (
        <video
          ref={videoRef}
          className="hero-window"
          /* Poster, klibin İLK KARESİ (build-hero-assets.mjs üretiyor).
             Bu yüzden video eklenip oynamaya başladığında görünür bir
             geçiş YOK — duran görüntü sadece kaymaya başlar. Opacity hep
             1; §8.10'un tek hareket anı ikinci bir fade'le bozulmuyor. */
          poster="/img/hero-window-poster.jpg"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}
    </>
  );
}
