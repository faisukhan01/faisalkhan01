"use client";

import { motion, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
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
    : ["Full-stack Developer", "Next.js Engineer", "AI Integration Specialist", "Three.js Enthusiast"];
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
    <span className="text-foreground/50 text-xs sm:text-sm font-mono overflow-hidden text-ellipsis">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-4 bg-foreground/50 ml-0.5 align-middle"
      />
    </span>
  );
}

export function HeroSection() {
  const fullStackRef = useRef<HTMLSpanElement>(null);
  const [developerOffset, setDeveloperOffset] = useState<number | undefined>(undefined);

  // Use useLayoutEffect to measure before paint, preventing flash of wrong layout
  // Only apply marginLeft offset on md+ screens to avoid overflow on mobile
  useLayoutEffect(() => {
    const measure = () => {
      if (fullStackRef.current) {
        // Only apply offset on screens >= 768px (md breakpoint)
        if (window.innerWidth >= 768) {
          setDeveloperOffset(fullStackRef.current.offsetWidth);
        } else {
          setDeveloperOffset(0);
        }
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    if (fullStackRef.current) {
      observer.observe(fullStackRef.current);
    }

    // Also listen for resize to handle orientation changes
    const handleResize = () => measure();
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="relative pt-6 pb-16 sm:pt-6 sm:pb-24 md:pt-8 md:pb-28 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />

      {/* Animated gradient mesh blobs */}
      <div className="gradient-mesh-blob gradient-mesh-blob-1 w-[400px] h-[400px] top-[-10%] left-[-5%] bg-emerald-500/[0.05]" />
      <div className="gradient-mesh-blob gradient-mesh-blob-2 w-[350px] h-[350px] top-[20%] right-[-8%] bg-purple-500/[0.04]" />
      <div className="gradient-mesh-blob gradient-mesh-blob-3 w-[300px] h-[300px] bottom-[-5%] left-[30%] bg-blue-500/[0.04]" />

      <div className="relative flex flex-col">
        {/* Main heading: Full-stack + Projects button on row 1, Developer on row 2 aligned under the "k" */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-8 sm:mb-6"
        >
          {/* Row 1: Full-stack + Projects Button */}
          {/* Mobile: Stack layout for small screens */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 md:gap-6">
            <span
              ref={fullStackRef}
              className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem] xl:text-[5.25rem] font-medium text-foreground leading-[0.92] tracking-[-0.02em] inline-block"
              style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
            >
              Full-stack
            </span>
            {/* Mobile: Projects button on its own line */}
            <div className="sm:pb-1 md:pb-2 sm:pb-3 mb-1">
              <MagneticButton />
            </div>
          </div>

          {/* Row 2: Developer — aligned under the "k" on desktop, normal on mobile */}
          <span
            className="block text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem] xl:text-[5.25rem] font-medium text-foreground leading-[0.92] tracking-[-0.02em]"
            style={{
              fontFamily: "var(--font-source-serif), Georgia, serif",
              marginLeft: developerOffset !== undefined ? `${developerOffset}px` : undefined,
            }}
          >
            Developer
          </span>
        </motion.div>

        {/* Typing effect subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-10 sm:mb-8 flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
          <TypingEffect />
        </motion.div>

        <SocialButtons />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none hidden sm:flex"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-foreground/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
