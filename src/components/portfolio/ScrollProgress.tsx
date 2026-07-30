"use client";

import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

const sections = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "articles", label: "Articles" },
  { id: "contacts", label: "Contacts" },
];

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const [activeSection, setActiveSection] = useState<string>("");

  useMotionValueEvent(scrollYProgress, "change", () => {
    // Determine active section based on scroll position
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY + viewportHeight * 0.35;

    let current = "";
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el && el.offsetTop <= scrollPosition) {
        current = section.id;
      }
    }
    setActiveSection(current);
  });

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-foreground/80 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Section indicator dots (right side) — clean minimal style */}
      <div className="fixed right-5 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="group relative flex items-center justify-end"
              aria-label={`Jump to ${section.label} section`}
            >
              {/* Label tooltip on hover */}
              <span
                className={`text-[10px] font-mono uppercase tracking-[0.12em] mr-3 transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "text-foreground/80 opacity-100"
                    : "text-foreground/50 opacity-0 group-hover:opacity-100"
                }`}
              >
                {section.label}
              </span>

              {/* Dot indicator */}
              <span
                className={`block rounded-full transition-all duration-500 ease-out flex-shrink-0 ${
                  isActive
                    ? "w-2.5 h-2.5 bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.15)]"
                    : "w-[6px] h-[6px] bg-foreground/30 group-hover:bg-foreground/60 group-hover:w-2 group-hover:h-2"
                }`}
              />

              {/* Active connector line */}
              {isActive && (
                <motion.span
                  layoutId="section-indicator-ring"
                  className="absolute -inset-1.5 rounded-full border border-foreground/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </div>
    </>
  );
}
