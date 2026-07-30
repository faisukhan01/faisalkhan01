"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

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

  const cursorSize = isHovering ? 60 : isClicking ? 30 : 20;
  const bgOpacity = isHovering ? 0.08 : 0.03;
  const borderOpacity = isHovering ? 0.2 : 0.06;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="pointer-events-none fixed z-[60] rounded-full mix-blend-difference"
        animate={{
          width: cursorSize,
          height: cursorSize,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          left: sx,
          top: sy,
          x: "-50%",
          y: "-50%",
          background: `rgba(255, 255, 255, ${bgOpacity})`,
          border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
        }}
      />
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none fixed z-[59] rounded-full"
        animate={{
          width: isHovering ? 300 : 500,
          height: isHovering ? 300 : 500,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 25 }}
        style={{
          left: sx,
          top: sy,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, var(--spotlight) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
