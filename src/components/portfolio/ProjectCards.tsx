"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { projectsData, useModalStore } from "@/lib/portfolio-data";

export function ProjectCards() {
  const { setProject } = useModalStore();
  const [activeIndex, setActiveIndex] = useState(1);
  const [direction, setDirection] = useState(0);

  const projects = projectsData;

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, [projects.length]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, [projects.length]);

  // Keyboard nav (only arrow up/down; left/right reserved for gallery inside modal)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goToPrev();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToPrev, goToNext]);

  return (
    <section id="projects" className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <p className="font-mono text-xs text-white/40 mb-3 tracking-wider">
            ... / Projects
          </p>
          <h2 className="text-white font-semibold text-2xl md:text-3xl">
            Featured <span className="text-white/40">work</span>
          </h2>
        </div>
        <p className="hidden md:block text-xs text-white/30 font-mono">
          <span className="text-white">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span> / {String(projects.length).padStart(2, "0")}</span>
        </p>
      </motion.div>

      <div className="relative">
        {/* Navigation Arrows + Dots */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPrev}
              className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Previous project"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNext}
              className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Next project"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={`rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-6 overflow-hidden">
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            const distance = index - activeIndex;

            if (Math.abs(distance) > 1 && !(Math.abs(distance) === projects.length - 1)) {
              return null;
            }

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.85, x: direction * 50 }}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? 1 : 0.88,
                  x: 0,
                  filter: isActive ? "blur(0px)" : "blur(1px)",
                }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className={`flex-shrink-0 cursor-pointer transition-all ${
                  isActive ? "z-10 w-full md:w-[58%]" : "z-0 w-full md:w-[24%]"
                }`}
                onClick={() => {
                  if (isActive) {
                    setProject(project);
                  } else {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                  }
                }}
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] group">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute top-4 right-4 text-[10px] font-mono text-white/40 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/[0.08]">
                    {project.year}
                  </div>

                  <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/70 bg-white/[0.1] backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/[0.08]">
                        {project.tag}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2 leading-snug">
                      {project.title}
                    </h3>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                      >
                        <p className="text-sm text-white/70 leading-relaxed line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-white/80 flex items-center gap-2 hover:text-white transition-colors animated-underline">
                            View case study
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/[0.15] hover:bg-white/20 transition-colors"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
