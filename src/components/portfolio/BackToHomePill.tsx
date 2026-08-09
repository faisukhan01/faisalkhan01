"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

type BackToHomePillProps = {
  /** Scroll threshold (px) after which the pill appears. Default 320. */
  threshold?: number;
};

/**
 * Sticky "Back to home" pill that floats at the top-left of the
 * viewport on the /projects page (mirrors BackToProjectsPill on
 * detail pages).
 *
 * Behaviour:
 *  - Hidden when the user is at the top of the page (the breadcrumb
 *    "Back to portfolio" in the fixed nav already provides navigation
 *    context there).
 *  - Fades + slides in once the user scrolls past `threshold` px,
 *    giving them a persistent escape hatch back to the homepage
 *    without having to scroll all the way up.
 *  - Sits just below the fixed nav (top-16) so it never overlaps.
 *  - z-index lower than modals (z-50) but higher than content.
 *  - Uses requestAnimationFrame-throttled scroll listener for perf.
 *  - Hover: emerald accent ring + arrow nudges left + home icon brightens.
 *  - Mobile: pill shrinks to icon-only on very narrow viewports.
 */
export function BackToHomePill({ threshold = 320 }: BackToHomePillProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [rafId, setRafId] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafId !== null) return;
      const id = requestAnimationFrame(() => {
        setVisible(window.scrollY > threshold);
        setRafId(null);
      });
      setRafId(id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [threshold, rafId]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: -12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          onClick={() => router.push("/")}
          aria-label="Back to home"
          className="fixed top-16 left-3 sm:left-6 z-40 inline-flex items-center gap-1.5 pl-2.5 pr-3 sm:pr-4 py-2 rounded-full bg-background/90 backdrop-blur-xl border border-outline-2 hover:border-emerald-400/40 hover:bg-emerald-500/[0.06] text-foreground/75 hover:text-foreground shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 group"
        >
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-3/60 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          </span>
          <span className="text-xs font-medium hidden sm:inline">Home</span>
          <span className="text-xs font-medium sm:hidden">Home</span>
          <Home className="w-3.5 h-3.5 text-foreground/40 group-hover:text-emerald-500/70 transition-colors hidden sm:block" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
