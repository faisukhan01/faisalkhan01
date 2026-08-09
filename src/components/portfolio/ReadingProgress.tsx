"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A sticky top reading progress bar that fills as the user scrolls down the page.
 * Sits below the fixed nav bar (top-14).
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-14 left-0 right-0 h-[2px] z-40 origin-left bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
      aria-hidden="true"
    />
  );
}
