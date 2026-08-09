"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

type BackToTopButtonProps = {
  /** Pixel scroll threshold at which the button appears. */
  threshold?: number;
};

/**
 * Floating "back to top" button.
 *
 * - Hidden until the user scrolls past `threshold` (default 600px).
 * - Smooth scroll to top on click.
 * - Renders above the footer / above any other fixed widgets.
 */
export function BackToTopButton({ threshold = 600 }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > threshold);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-11 h-11 rounded-full border border-outline-2 bg-background/80 backdrop-blur-md text-foreground/70 hover:text-foreground hover:border-emerald-400/40 hover:bg-surface-3/70 shadow-[0_4px_18px_rgba(0,0,0,0.18)] dark:shadow-[0_4px_18px_rgba(0,0,0,0.55)] transition-all duration-300 group"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
          {/* subtle ring pulse */}
          <span className="absolute inset-0 rounded-full border border-emerald-400/0 group-hover:border-emerald-400/30 transition-colors duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
