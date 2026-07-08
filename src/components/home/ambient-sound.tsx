"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * User-controlled ambient nature sound (CC0 sea waves).
 * Off by default — browsers block autoplay-with-sound and it's better UX.
 * The guest opts in via the floating button.
 *
 * Audio nesnesi DOM'a hiç yazılmaz ve ancak ilk tıklamada oluşturulur:
 * kullanıcı sesi açmadıkça ambient.mp3 (~2.3MB) asla indirilmez.
 */
export default function AmbientSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

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

  return (
    <>
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
