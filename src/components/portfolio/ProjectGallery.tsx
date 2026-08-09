"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, X } from "lucide-react";

type ProjectGalleryProps = {
  /** Title used for alt text + lightbox header */
  title: string;
  /** Ordered list of image URLs */
  images: string[];
  /**
   * Optional stable key — when this changes, the parent should remount
   * the gallery via React's `key` prop so internal state (activeIndex,
   * lightboxOpen) resets cleanly. Recommended: pass project.id.
   */
  resetKey?: string;
};

/**
 * Project screenshot gallery for detail pages.
 *
 * Features:
 *  - Main image view with cross-fade transition between slides
 *  - Prev/next chevron buttons (hover-revealed on desktop, always on mobile)
 *  - Thumbnail strip below for direct navigation
 *  - "1 / N" counter pill bottom-right of main image
 *  - Keyboard arrows (Left/Right) for navigation, Escape to close lightbox
 *  - Click main image to open fullscreen lightbox modal with zoom
 *  - Auto-degrades gracefully when only 1 image is provided (hides controls)
 *  - Pagination dots indicator on mobile
 */
export function ProjectGallery({ title, images }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = images.length;
  const hasMultiple = total > 1;

  const goTo = useCallback(
    (idx: number) => {
      const next = (idx + total) % total;
      setActiveIndex(next);
    },
    [total]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Keyboard nav
  useEffect(() => {
    if (!hasMultiple && !lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (isTyping) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape" && lightboxOpen) {
        e.preventDefault();
        setLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasMultiple, lightboxOpen, goPrev, goNext]);

  // Clamp activeIndex if it falls outside the new image set
  // (e.g. when navigating to a project with fewer screenshots).
  if (activeIndex > total - 1) {
    setActiveIndex(Math.max(0, total - 1));
  }

  if (!total) return null;

  return (
    <>
      <div className="relative">
        {/* Main image viewport */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-[14px] sm:rounded-[18px] border border-outline-2 bg-surface-2/40 shadow-[0_6px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.35)] group">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${title} — screenshot ${activeIndex + 1} of ${total}`}
              initial={{ opacity: 0, scale: 1.01 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            />
          </AnimatePresence>

          {/* Top-right counter pill (only when multiple) */}
          {hasMultiple && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/85 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              <span className="text-emerald-300">{activeIndex + 1}</span>
              <span className="text-white/45">/</span>
              <span className="text-white/65">{total}</span>
            </div>
          )}

          {/* Top-left image-count indicator pill */}
          {hasMultiple && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-white/85 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
              <ImageIcon className="w-3 h-3" />
              {total} screens
            </div>
          )}

          {/* Lightbox hint */}
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open fullscreen"
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/85 hover:bg-black/65 hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Prev/Next arrows — only when multiple */}
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous screenshot"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/85 hover:bg-black/70 hover:text-white transition-all hover:-translate-x-0.5 hover:scale-105"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next screenshot"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/85 hover:bg-black/70 hover:text-white transition-all hover:translate-x-0.5 hover:scale-105"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Mobile pagination dots */}
          {hasMultiple && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to screenshot ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-5 bg-emerald-400"
                      : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail strip — only when multiple */}
        {hasMultiple && (
          <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Show screenshot ${i + 1}`}
                aria-current={i === activeIndex}
                className={`relative flex-shrink-0 w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden border transition-all duration-300 ${
                  i === activeIndex
                    ? "border-emerald-400/60 ring-2 ring-emerald-400/20 opacity-100"
                    : "border-outline-2 opacity-55 hover:opacity-90 hover:border-outline-3"
                }`}
              >
                <img
                  src={img}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className="absolute bottom-1 left-1 text-[9px] font-mono text-white/80 bg-black/45 backdrop-blur-sm px-1.5 py-0.5 rounded">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — fullscreen gallery`}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 text-center sm:text-left">
              <p className="text-xs font-mono uppercase tracking-widest text-white/55">
                {title.split("—")[0]}
              </p>
              <p className="text-[10px] font-mono text-white/45 mt-0.5">
                Screen {activeIndex + 1} of {total}
              </p>
            </div>

            {/* Image */}
            <motion.img
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${title} — screenshot ${activeIndex + 1}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[92vw] max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Prev/Next in lightbox */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Thumbnail strip in lightbox */}
            {hasMultiple && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 max-w-[90vw] overflow-x-auto scrollbar-none px-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                    aria-label={`Show screenshot ${i + 1}`}
                    className={`relative flex-shrink-0 w-14 sm:w-16 aspect-[4/3] rounded overflow-hidden border transition-all duration-300 ${
                      i === activeIndex
                        ? "border-emerald-400 opacity-100"
                        : "border-white/15 opacity-50 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
