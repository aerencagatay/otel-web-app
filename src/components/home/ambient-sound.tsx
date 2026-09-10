"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Volume2, VolumeX } from "lucide-react";
import { useCookieConsentResolved } from "@/components/layout/cookie-banner";

/**
 * User-controlled ambient nature sound (CC0 sea waves).
 * Off by default — browsers block autoplay-with-sound and it's better UX.
 * The guest opts in via the floating button.
 *
 * Audio nesnesi DOM'a hiç yazılmaz ve ancak ilk tıklamada oluşturulur:
 * kullanıcı sesi açmadıkça ambient.mp3 (~2.3MB) asla indirilmez.
 */
export default function AmbientSound() {
  const t = useTranslations("home.ambient");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  /* Bulgu K3: çerez bandı çözülmeden bu düğme bandın tam üstüne biniyordu
     (ölçülen: bant 659-844, düğme 726-772). Sabit katmanların tamamı aynı
     kurala tabi — karar verilene kadar yalnızca bant görünür. */
  const consentResolved = useCookieConsentResolved();

  function toggle() {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio("/audio/ambient.mp3");
      audio.loop = true;
      audioRef.current = audio;
    }
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = 0.35;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }

  if (!consentResolved) return null;

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t("stop") : t("play")}
        aria-pressed={playing}
        title={playing ? t("titleOn") : t("titleOff")}
        className="ambient-toggle"
      >
        {playing ? (
          <Volume2 size={18} strokeWidth={1.75} />
        ) : (
          <VolumeX size={18} strokeWidth={1.75} />
        )}
      </button>
    </>
  );
}
