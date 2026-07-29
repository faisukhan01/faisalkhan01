"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const circles = [
  { top: -160, right: -160, size: 600, speed: 0.15 },
  { top: -80, right: -80, size: 450, speed: 0.1 },
  { topPercent: 40, right: -256, size: 700, speed: 0.25 },
  { topPercent: 60, right: -128, size: 400, speed: 0.2 },
  { bottomPercent: 20, left: -160, size: 350, speed: 0.18 },
  { topPercent: 30, left: -80, size: 280, speed: 0.12 },
];

function ParallaxCircle({
  circle,
  scrollYProgress,
}: {
  circle: (typeof circles)[number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(scrollYProgress, [0, 1], [0, circle.speed * -600]);

  const style: React.CSSProperties = {
    width: circle.size,
    height: circle.size,
    position: "absolute",
    borderRadius: "50%",
    border: "1px solid var(--decorative-circle)",
  };
  if ("top" in circle && circle.top !== undefined) style.top = circle.top;
  if ("topPercent" in circle && circle.topPercent !== undefined)
    style.top = `${circle.topPercent}%`;
  if ("bottomPercent" in circle && circle.bottomPercent !== undefined)
    style.bottom = `${circle.bottomPercent}%`;
  if ("right" in circle && circle.right !== undefined) style.right = circle.right;
  if ("left" in circle && circle.left !== undefined) style.left = circle.left;

  return (
    <motion.div style={{ ...style, y }}>
      {/* Inner subtle ring for depth */}
      <div
        style={{
          position: "absolute",
          inset: "15%",
          borderRadius: "50%",
          border: "1px solid var(--decorative-circle)",
        }}
      />
    </motion.div>
  );
}

export function ParallaxCircles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {circles.map((circle, i) => (
        <ParallaxCircle
          key={i}
          circle={circle}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
