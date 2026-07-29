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
        className="fixed top-0 left-0 right-0 h-[2px] bg-white/80 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Section indicator dots (right side) */}
      <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group flex items-center gap-2 justify-end"
          >
            <span
              className={`text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${
                activeSection === section.id
                  ? "text-white/80 opacity-100"
                  : "text-white/30 opacity-0 group-hover:opacity-60"
              }`}
            >
              {section.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                activeSection === section.id
                  ? "w-1.5 h-1.5 bg-white"
                  : "w-1 h-1 bg-white/30 group-hover:bg-white/50"
              }`}
            />
          </a>
        ))}
      </div>
    </>
  );
}
