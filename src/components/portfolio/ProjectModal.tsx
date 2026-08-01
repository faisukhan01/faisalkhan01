"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, Github, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useModalStore, type ProjectDetail } from "@/lib/portfolio-data";

export function ProjectModal() {
  const { activeProject, setProject } = useModalStore();

  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setProject(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setProject]);

  return (
    <AnimatePresence>
      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
          onClick={() => setProject(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[20px] sm:rounded-[28px] border border-outline-3 bg-background shadow-[var(--card-shadow)]"
          >
            {/* Key by project id so gallery state resets per project */}
            <ProjectModalContent
              key={activeProject.id}
              project={activeProject}
              onClose={() => setProject(null)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectModalContent({
  project,
  onClose,
}: {
  project: ProjectDetail;
  onClose: () => void;
}) {
  const [galleryIndex, setGalleryIndex] = useState(0);

  const goToPrev = useCallback(() => {
    setGalleryIndex((prev) =>
      prev === 0 ? project.gallery.length - 1 : prev - 1
    );
  }, [project.gallery.length]);

  const goToNext = useCallback(() => {
    setGalleryIndex((prev) =>
      prev === project.gallery.length - 1 ? 0 : prev + 1
    );
  }, [project.gallery.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goToPrev, goToNext]);

  return (
    <div className="modal-scroll max-h-[90vh] overflow-y-auto">
      <style>{`
        .modal-scroll::-webkit-scrollbar { width: 4px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 2px; }
      `}</style>

      {/* Gallery */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-[20px] sm:rounded-t-[28px]">
        <AnimatePresence mode="wait">
          <motion.img
            key={galleryIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            src={project.gallery[galleryIndex]}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/[0.15] flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Gallery nav */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/[0.15] flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/[0.15] flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Gallery dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {project.gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => setGalleryIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === galleryIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>

        {/* Tag + Year */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/80 bg-white/[0.1] backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/[0.1]">
            {project.tag}
          </span>
          <span className="text-[10px] font-mono text-white/50 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/[0.08]">
            {project.year}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 leading-tight">
          {project.title}
        </h2>
        <p className="text-foreground/50 text-sm leading-relaxed mb-8">
          {project.overview}
        </p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 py-4 sm:py-6 border-y border-outline-1">
          {[
            { label: "Client", value: project.client },
            { label: "Duration", value: project.duration },
            { label: "Role", value: project.role },
            { label: "Year", value: project.year },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-foreground/30 text-[10px] font-mono uppercase tracking-[0.15em] mb-1">
                {item.label}
              </p>
              <p className="text-foreground/80 text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Challenge & Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-foreground/40 rounded-full" />
              Challenge
            </h3>
            <p className="text-foreground/50 text-sm leading-relaxed">
              {project.challenge}
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-foreground/40 rounded-full" />
              Solution
            </h3>
            <p className="text-foreground/50 text-sm leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-8">
          <h3 className="text-foreground font-semibold text-sm mb-3">Tech stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-foreground/60 bg-surface-2 border border-outline-2 px-3 py-1.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <h3 className="text-foreground font-semibold text-sm mb-3">Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {project.results.map((r) => (
              <div
                key={r.label}
                className="rounded-[16px] border border-outline-2 bg-card p-4 shadow-[var(--card-shadow)]"
              >
                <p className="text-foreground text-xl font-bold mb-1">{r.value}</p>
                <p className="text-foreground/40 text-[10px] font-mono uppercase tracking-widest">
                  {r.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-outline-1">
          <a
            href={project.liveUrl}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Live demo
          </a>
          <a
            href={project.repoUrl}
            className="flex items-center gap-2 border border-outline-4 text-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-surface-3 transition-colors"
          >
            <Github className="w-4 h-4" />
            Source code
          </a>
        </div>
      </div>
    </div>
  );
}
