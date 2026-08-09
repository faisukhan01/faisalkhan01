"use client";

import { motion, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { SocialButtons } from "./SocialButtons";
import { usePortfolioData } from "@/lib/portfolio-context";

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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex items-center gap-1.5 bg-primary text-primary-foreground pl-4 pr-1.5 py-1.5 rounded-full font-medium text-xs tracking-wide overflow-hidden"
    >
      <span className="relative z-10">Projects</span>
      <span className="relative z-10 w-6 h-6 rounded-full bg-primary-foreground flex items-center justify-center text-primary transition-transform group-hover:rotate-45">
        <ArrowUpRight className="w-3 h-3" />
      </span>
    </motion.a>
  );
}

function TypingEffect() {
  const { data } = usePortfolioData();
  const roles = data.heroRoles.length > 0
    ? data.heroRoles
    : ["Next.js Engineer", "AI Integration Specialist", "Three.js Enthusiast", "TypeScript Lover"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => setIsPaused(false), 2000);
      return () => clearTimeout(pauseTimeout);
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const nextText = currentRole.slice(0, displayText.length + 1);
          setDisplayText(nextText);
          if (nextText.length === currentRole.length) {
            setIsPaused(true);
            setIsDeleting(true);
          }
        } else {
          const nextText = currentRole.slice(0, displayText.length - 1);
          setDisplayText(nextText);
          if (nextText.length === 0) {
            setIsDeleting(false);
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 30 : 80
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isPaused, currentRoleIndex, roles]);

  return (
    <span className="text-foreground/70 text-[11px] sm:text-sm font-mono overflow-hidden text-ellipsis">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[1.5px] h-3.5 sm:h-4 bg-emerald-500/80 ml-0.5 align-middle"
      />
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-2 pb-8 sm:pb-24 md:pt-8 md:pb-28 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-100 pointer-events-none" />

      {/* Radial vignette to add depth to hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 30% 20%, var(--spotlight) 0%, transparent 60%)",
        }}
      />

      {/* Animated gradient mesh blobs — multi-colored, subtle */}
      <div className="hidden sm:block">
        <div className="gradient-mesh-blob gradient-mesh-blob-1 w-[420px] h-[420px] top-[-8%] left-[-4%] bg-gradient-to-br from-emerald-500/10 to-teal-400/6" />
        <div className="gradient-mesh-blob gradient-mesh-blob-2 w-[380px] h-[380px] top-[18%] right-[-6%] bg-gradient-to-bl from-violet-500/8 to-rose-400/5" />
        <div className="gradient-mesh-blob gradient-mesh-blob-3 w-[320px] h-[320px] bottom-[-3%] left-[28%] bg-gradient-to-tr from-amber-400/7 to-cyan-500/5" />
        <div className="gradient-mesh-blob gradient-mesh-blob-1 w-[260px] h-[260px] top-[35%] left-[15%] bg-gradient-to-br from-blue-500/6 to-indigo-400/4" />
      </div>

      <div className="relative flex flex-col">
        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-4 sm:mb-6"
        >
          {/* "Full-stack" */}
          <span
            className="block text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-medium text-foreground leading-[0.92] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
          >
            Full-stack
          </span>

          {/* "Developer" with staggered indent */}
          <div className="flex items-end gap-3 sm:gap-5 md:gap-6">
            <span
              className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-medium text-foreground leading-[0.92] tracking-[-0.02em] ml-4 sm:ml-12 md:ml-16 lg:ml-20"
              style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
            >
              Developer
            </span>
            {/* Projects button — aligned to baseline of "Developer" */}
            <div className="pb-1 md:pb-2 hidden sm:block">
              <MagneticButton />
            </div>
          </div>

          {/* Mobile: Projects button below headline */}
          <div className="sm:hidden mt-4">
            <MagneticButton />
          </div>
        </motion.div>

        {/* Typing effect subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-4 sm:mb-8 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
          <TypingEffect />
        </motion.div>

        <SocialButtons />
      </div>

      {/* Scroll indicator — hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none hidden sm:flex"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/70">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-5 h-8 rounded-full border border-foreground/40 flex items-start justify-center pt-1.5"
        >
          <motion.span
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 rounded-full bg-foreground/80"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
