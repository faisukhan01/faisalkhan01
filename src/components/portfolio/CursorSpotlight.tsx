"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorSpotlight() {
  const [mounted, setMounted] = useState(false);
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
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mounted, x, y]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[60] w-[500px] h-[500px] rounded-full"
      style={{
        left: sx,
        top: sy,
        x: "-50%",
        y: "-50%",
        background:
          "radial-gradient(circle, var(--spotlight) 0%, transparent 70%)",
      }}
    />
  );
}
