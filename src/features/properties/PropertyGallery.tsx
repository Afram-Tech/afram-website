"use client";

import { ChevronLeft, ChevronRight, Expand, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  const [zoomed, setZoomed] = useState(false);
  const [prevIndex, setPrevIndex] = useState(index);
  if (index !== prevIndex) {
    setPrevIndex(index);
    setZoomed(false);
  }

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchX.current === null || zoomed) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[1.9fr_1fr]">
        <button
          type="button"
          onClick={() => setIndex(0)}
          className="group bg-ink-50 relative aspect-[16/11] cursor-zoom-in overflow-hidden rounded-[1.25rem] lg:aspect-auto lg:h-[460px]"
        >
          <Image
            src={images[0]}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[12px] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Expand className="h-3.5 w-3.5" />
            View
          </span>
        </button>

        <div className="grid grid-cols-2 gap-3 lg:h-[460px]">
          {images.slice(1, 5).map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i + 1)}
              className="group bg-ink-50 relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl lg:aspect-auto"
            >
              <Image
                src={src}
                alt={`${title} photo ${i + 2}`}
                fill
                sizes="(max-width: 1024px) 50vw, 22vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              {i === 3 && images.length > 5 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-[15px] font-semibold text-white">
                  +{images.length - 5} more
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {index !== null && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="bg-ink-950/95 fixed inset-0 z-[120] flex flex-col backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery`}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <span className="tnum text-sm font-medium text-white/70">
              {index + 1} / {images.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 ring-1 ring-white/20 transition-colors hover:bg-white/10 hover:text-white"
              >
                {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 ring-1 ring-white/20 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative flex flex-1 items-center justify-center px-4 sm:px-16"
          >
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setZoomed((z) => !z);
              }}
              className={`relative h-full max-h-[72vh] w-full max-w-5xl overflow-hidden ${
                zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            >
              <Image
                key={index}
                src={images[index]}
                alt={`${title} photo ${index + 1}`}
                fill
                sizes="100vw"
                className={`object-contain transition-transform duration-300 ${
                  zoomed ? "scale-[1.8]" : ""
                }`}
              />
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto px-4 py-4">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View photo ${i + 1}`}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                  i === index ? "ring-white" : "opacity-55 ring-transparent hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
