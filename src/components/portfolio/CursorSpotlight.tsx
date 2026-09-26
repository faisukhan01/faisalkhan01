"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/*
 * Performance: the cursor layers used to animate `left`/`top` (layout +
 * paint on every mouse move) and `width`/`height` (layout on every hover
 * state change). Both are now transform/opacity based, which the browser
 * can composite on the GPU without touching layout.
 */
export function CursorSpotlight() {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 200, damping: 30 });
  const sy = useSpring(y, { stiffness: 200, damping: 30 });

  useEffect(() => {
    // Standard client-mount detection pattern; setState here is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Only track on devices with fine pointer (desktop)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);

    // Detect hover over interactive elements
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest("[data-cursor-hover]");
      setIsHovering(!!isInteractive);
    };

    const handleOut = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [mounted, x, y]);

  if (!mounted) return null;

  const dotScale = isHovering ? 3 : isClicking ? 1.5 : 1;
  const dotOpacity = isHovering ? 0.5 : 0.25;
  const glowScale = isHovering ? 0.6 : 1;

  return (
    <>
      {/* Main cursor dot — transform/opacity only */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[60]"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
          animate={{ scale: dotScale, opacity: dotOpacity }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            background: "var(--foreground)",
            border: "1px solid var(--foreground)",
          }}
        />
      </motion.div>
      {/* Ambient glow — transform/opacity only */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[59]"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          animate={{ scale: glowScale }}
          transition={{ type: "spring", stiffness: 150, damping: 25 }}
          style={{
            background:
              "radial-gradient(circle, var(--spotlight) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </>
  );
}
