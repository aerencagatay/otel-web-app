"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { RoomImage } from "@/lib/config/room-images";

interface Props {
  images: RoomImage[];
  roomName: string;
}

/**
 * Minimal dependency-free lightbox for a room's photo gallery.
 * Grid of thumbnails -> full-screen modal with prev/next + Escape to close.
 *
 * Keyboard access: the dialog container is programmatically focused when it
 * opens (so its Escape/arrow onKeyDown handlers actually receive events),
 * and focus is returned to the thumbnail that opened it on close.
 */
export default function RoomGalleryLightbox({ images, roomName }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const isOpen = openIndex != null;

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  function open(index: number, trigger: HTMLElement) {
    triggerRef.current = trigger;
    setOpenIndex(index);
  }

  function close() {
    setOpenIndex(null);
    // Return focus to the thumbnail that opened the dialog.
    triggerRef.current?.focus();
    triggerRef.current = null;
  }

  function show(delta: number) {
    setOpenIndex((current) => {
      if (current == null) return current;
      const next = (current + delta + images.length) % images.length;
      return next;
    });
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 max-w-[960px] mx-auto mb-20">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={(e) => open(i, e.currentTarget)}
            className="gallery-item block w-full border-0 p-0 cursor-pointer bg-transparent"
            style={{ aspectRatio: "4/3" }}
            aria-label={`${roomName} fotoğrafı ${i + 1} - büyüt`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={480}
              height={360}
              className="w-full h-full object-cover"
            />
            <div className="gallery-overlay">
              <div className="text-white text-center p-5">
                <h5 className="font-heading text-white text-[16px]">{roomName}</h5>
              </div>
            </div>
          </button>
        ))}
      </div>

      {openIndex != null && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[100] bg-dark/95 flex items-center justify-center p-4 outline-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${roomName} galerisi`}
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") show(1);
            if (e.key === "ArrowLeft") show(-1);
          }}
          tabIndex={-1}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-transparent border-0 cursor-pointer p-2"
          >
            <X size={28} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                show(-1);
              }}
              aria-label="Önceki fotoğraf"
              className="absolute left-2 sm:left-6 text-white/80 hover:text-white bg-transparent border-0 cursor-pointer p-2"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          <div
            className="relative w-full max-w-4xl aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex].src}
              alt={images[openIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                show(1);
              }}
              aria-label="Sonraki fotoğraf"
              className="absolute right-2 sm:right-6 text-white/80 hover:text-white bg-transparent border-0 cursor-pointer p-2"
            >
              <ChevronRight size={36} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
