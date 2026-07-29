"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { SocialButtons } from "./SocialButtons";

function MagneticButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    x.set(offsetX * 0.2);
    y.set(offsetY * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="#projects"
      style={{ x, y }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex items-center gap-2 bg-white text-[#0D0D0D] pl-7 pr-2 py-2 rounded-full font-semibold text-sm tracking-wide overflow-hidden"
    >
      <span className="relative z-10">Projects</span>
      <span className="relative z-10 w-9 h-9 rounded-full bg-[#0D0D0D] flex items-center justify-center text-white transition-transform group-hover:rotate-45">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </motion.a>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-28 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Left Column */}
        <div className="flex flex-col flex-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed mb-10 md:mb-14"
          >
            My goal is to write maintainable, clean and understandable code to process development was enjoyable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="leading-[0.85] tracking-tight mb-10"
          >
            <span className="block text-[4rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold text-white leading-[0.85] tracking-[-0.02em]">
              Full-stack
            </span>
            <span className="block text-[4rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold text-white leading-[0.85] tracking-[-0.02em] md:pl-16 lg:pl-24">
              Developer
            </span>
          </motion.div>

          <SocialButtons />
        </div>

        {/* Right Column - Magnetic CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-3 md:mt-16"
        >
          <MagneticButton />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/20">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
