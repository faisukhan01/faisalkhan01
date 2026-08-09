"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ConfettiPiece = {
  id: number;
  x: number; // initial horizontal offset from center (%)
  y: number; // starting vertical offset
  vx: number; // horizontal velocity (px/s)
  vy: number; // vertical velocity (px/s)
  rotation: number; // initial rotation deg
  vr: number; // rotation velocity deg/s
  color: string;
  size: number; // px
  shape: "square" | "circle" | "rect";
  delay: number; // ms
};

const COLORS = [
  "#10b981", // emerald-500
  "#34d399", // emerald-400
  "#6ee7b7", // emerald-300
  "#fbbf24", // amber-400
  "#f59e0b", // amber-500
  "#a78bfa", // violet-400
  "#f472b6", // pink-400
];

const SHAPES: ConfettiPiece["shape"][] = ["square", "circle", "rect"];

type ConfettiProps = {
  /** Trigger a confetti burst by toggling this value. */
  fire: number;
  /** Origin X (0-100, percentage of viewport width). Default 50 (center). */
  originX?: number;
  /** Origin Y (0-100, percentage of viewport height). Default 50 (center). */
  originY?: number;
  /** Number of pieces to spawn per burst. Default 80. */
  count?: number;
  /** Duration in ms before pieces auto-clear. Default 2200. */
  duration?: number;
};

/**
 * Lightweight confetti animation component.
 *
 * Renders a fixed full-viewport overlay (pointer-events-none) with N
 * pieces that spring outward from a configurable origin, then fall
 * under simulated gravity with rotation. Each piece has a randomized
 * color, shape, size, and trajectory.
 *
 * Usage:
 *   const [burst, setBurst] = useState(0);
 *   <button onClick={() => setBurst(b => b + 1)}>Celebrate</button>
 *   <Confetti fire={burst} />
 *
 * The `fire` prop is a counter — bumping it spawns a fresh burst.
 * Pieces self-clear after `duration` ms.
 *
 * Implementation note: pieces are derived from `fire` via useMemo
 * (no setState-in-effect). A separate `hideKey` state tracks which
 * `fire` value has been "cleared" — it's updated only inside a
 * setTimeout callback (asynchronous), keeping the effect lint-clean.
 */
export function Confetti({
  fire,
  originX = 50,
  originY = 50,
  count = 80,
  duration = 2200,
}: ConfettiProps) {
  // Respect the user's reduced-motion preference: skip the burst entirely.
  const prefersReducedMotion = useReducedMotion();

  // Tracks the most recent `fire` value that has been auto-cleared.
  const [clearedFire, setClearedFire] = useState(0);

  // Generate pieces fresh whenever `fire` changes. Memoized so the
  // piece set is stable across re-renders until `fire` bumps again.
  const pieces = useMemo<ConfettiPiece[]>(() => {
    if (fire <= 0 || prefersReducedMotion) return [];
    return Array.from({ length: count }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 220; // px/s
      return {
        id: fire * 10000 + i,
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 120, // bias upward initially
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 720, // ±360 deg/s
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        delay: Math.random() * 120, // staggered start
      };
    });
  }, [fire, count, originX, originY, prefersReducedMotion]);

  // Schedule an asynchronous clear after `duration`. The setState call
  // lives inside the setTimeout callback (async), so this is lint-clean
  // under react-hooks/set-state-in-effect.
  useEffect(() => {
    if (fire <= 0) return;
    const t = setTimeout(() => setClearedFire(fire), duration);
    return () => clearTimeout(t);
  }, [fire, duration]);

  // Pieces are visible only while the current `fire` hasn't been cleared.
  const visible = fire > 0 && clearedFire !== fire;
  if (!visible) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] pointer-events-none overflow-hidden"
    >
      <AnimatePresence>
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            initial={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: 1,
              rotate: p.rotation,
              scale: 1,
            }}
            animate={{
              left: `${p.x + (p.vx * duration) / 1000 / 10}%`,
              top: `${p.y + (p.vy * duration) / 1000 / 10 + 25}%`, // gravity pulls down
              opacity: [1, 1, 0],
              rotate: p.rotation + (p.vr * duration) / 1000,
              scale: [1, 1, 0.6],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              delay: p.delay / 1000,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: duration / 1000, times: [0, 0.7, 1] },
            }}
            style={{
              position: "absolute",
              width:
                p.shape === "rect" ? `${p.size * 0.6}px` : `${p.size}px`,
              height:
                p.shape === "rect" ? `${p.size * 1.4}px` : `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === "circle" ? "9999px" : "2px",
              boxShadow: `0 0 6px ${p.color}40`,
              transformOrigin: "center",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
