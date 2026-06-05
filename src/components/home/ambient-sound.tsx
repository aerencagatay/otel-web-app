"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * User-controlled ambient nature sound (CC0 sea waves).
 * Off by default — browsers block autoplay-with-sound and it's better UX.
 * The guest opts in via the floating button.
 */
export default function AmbientSound() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
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

  return (
    <>
      <audio ref={audioRef} src="/audio/ambient.mp3" loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Doğa sesini kapat" : "Doğa sesini aç"}
        aria-pressed={playing}
        title={playing ? "Sesi kapat" : "Doğa sesi"}
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
