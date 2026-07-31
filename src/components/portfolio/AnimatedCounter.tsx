"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.5,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  // Use a spring for smooth easing
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 60,
    damping: 18,
    duration,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
      {suffix}
    </motion.span>
  );
}
