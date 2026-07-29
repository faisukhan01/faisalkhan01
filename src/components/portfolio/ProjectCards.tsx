"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback } from "react";

const projects = [
  {
    title: "The simplest example is kafka + golang",
    description:
      "This article presents a simple way to implement a microservice architecture using Kafka, Golang and Docker.",
    image: "/project-1.jpg",
    tag: "Microservices",
  },
  {
    title: "Building scalable REST APIs with Nest.js",
    description:
      "A comprehensive guide to building production-ready REST APIs with Nest.js, TypeORM and PostgreSQL with proper authentication and authorization.",
    image: "/project-2.jpg",
    tag: "Backend",
  },
  {
    title: "Real-time data visualization dashboard",
    description:
      "Creating an interactive real-time dashboard with React, WebSocket and D3.js for monitoring microservices infrastructure and performance metrics.",
    image: "/project-3.jpg",
    tag: "Frontend",
  },
];

export function ProjectCards() {
  const [activeIndex, setActiveIndex] = useState(1);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  }, []);

  return (
    <section id="projects" className="py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-white/40 mb-8 tracking-wider"
      >
        ... / Projects
      </motion.p>

      <div className="relative">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrev}
            className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center gap-4 md:gap-6 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => {
              const isActive = index === activeIndex;
              const distance = index - activeIndex;

              // Only show 3 cards (prev, active, next)
              if (Math.abs(distance) > 1 && !(Math.abs(distance) === projects.length - 1)) {
                return null;
              }

              // Handle wrapping for 3 items
              const adjustedDistance = distance === projects.length - 1 ? -1 : distance === -(projects.length - 1) ? 1 : distance;

              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: isActive ? 1 : 0.3,
                    scale: isActive ? 1 : 0.88,
                    x: 0,
                    filter: isActive ? "blur(0px)" : "blur(1px)",
                  }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`flex-shrink-0 cursor-pointer transition-all ${
                    isActive ? "z-10 w-full md:w-[55%]" : "z-0 w-full md:w-[25%]"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] group">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/60 bg-white/[0.08] px-2.5 py-1 rounded-full">
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
                            <span className="text-sm font-medium text-white/80 flex items-center gap-2 hover:text-white transition-colors">
                              Read more
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
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
