"use client";

import { motion, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { SocialButtons } from "./SocialButtons";

function TypingEffect() {
  const roles = ["Full-stack Developer", "UI/UX Enthusiast", "Open Source Contributor", "Problem Solver"];
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
    <span className="text-foreground/50 text-sm font-mono whitespace-nowrap">
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
  return (
    <section className="relative pt-2 pb-16 md:pt-4 md:pb-24 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />

      {/* Animated gradient mesh blobs */}
      <div className="gradient-mesh-blob gradient-mesh-blob-1 w-[400px] h-[400px] top-[-10%] left-[-5%] bg-emerald-500/[0.05]" />
      <div className="gradient-mesh-blob gradient-mesh-blob-2 w-[350px] h-[350px] top-[20%] right-[-8%] bg-purple-500/[0.04]" />
      <div className="gradient-mesh-blob gradient-mesh-blob-3 w-[300px] h-[300px] bottom-[-5%] left-[30%] bg-blue-500/[0.04]" />

      <div className="relative flex flex-col">
        {/* Main heading: Full-stack + Developer on two lines, left-aligned */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-6"
        >
          <span
            className="block text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem] xl:text-[5.25rem] font-medium text-foreground leading-[0.9] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
          >
            Full-stack
          </span>
          <span
            className="block text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[4.75rem] xl:text-[5.25rem] font-medium text-foreground leading-[0.9] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
          >
            Developer
          </span>
        </motion.div>

        {/* Typing effect + Projects CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-8 flex items-center gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
            <TypingEffect />
          </div>

          {/* Projects CTA — elegant pill button */}
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.06em] uppercase text-foreground/60 hover:text-foreground transition-colors duration-300"
          >
            <span className="relative">
              View Projects
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-foreground/50 group-hover:w-full transition-all duration-300" />
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </motion.div>

        <SocialButtons />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
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
