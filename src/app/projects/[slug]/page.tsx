"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Github,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { projectsData, type ProjectDetail } from "@/lib/portfolio-data";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const project: ProjectDetail | undefined = projectsData.find(
    (p) => p.id === slug
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <button
            onClick={() => router.push("/")}
            className="text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/40">
              {project.tag}
            </span>
            <span className="text-[10px] font-mono text-foreground/20">·</span>
            <span className="text-[10px] font-mono text-foreground/40">
              {project.year}
            </span>
          </div>
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-14"
      >
        <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[60vh] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 -mt-20 sm:-mt-28 relative z-10">
        {/* Title Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 sm:mb-14"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/50 bg-surface-2 px-3 py-1 rounded-full border border-outline-2">
              {project.tag}
            </span>
            <span className="text-[10px] font-mono text-foreground/30 bg-surface-2 px-3 py-1 rounded-full border border-outline-2">
              {project.year}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            {project.title}
          </h1>
          <p className="text-foreground/50 text-sm sm:text-base leading-relaxed max-w-2xl">
            {project.overview}
          </p>
        </motion.div>

        {/* Meta Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-14 py-6 sm:py-8 border-y border-outline-1"
        >
          {[
            { label: "Client", value: project.client },
            { label: "Duration", value: project.duration },
            { label: "Role", value: project.role },
            { label: "Year", value: project.year },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-foreground/30 text-[10px] font-mono uppercase tracking-[0.15em] mb-1.5">
                {item.label}
              </p>
              <p className="text-foreground/80 text-sm">{item.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Challenge & Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 mb-10 sm:mb-14"
        >
          <div>
            <h3 className="text-foreground font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-foreground/40 rounded-full" />
              Challenge
            </h3>
            <p className="text-foreground/50 text-sm leading-relaxed">
              {project.challenge}
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-foreground/40 rounded-full" />
              Solution
            </h3>
            <p className="text-foreground/50 text-sm leading-relaxed">
              {project.solution}
            </p>
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <h3 className="text-foreground font-semibold text-sm sm:text-base mb-4">
            Tech stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono text-foreground/60 bg-surface-2 border border-outline-2 px-3.5 py-2 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-10 sm:mb-14"
        >
          <h3 className="text-foreground font-semibold text-sm sm:text-base mb-4">
            Results
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.results.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl border border-outline-2 bg-card p-5 shadow-[var(--card-shadow)]"
              >
                <p className="text-foreground text-xl sm:text-2xl font-bold mb-1">
                  {r.value}
                </p>
                <p className="text-foreground/40 text-[10px] font-mono uppercase tracking-widest">
                  {r.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-wrap gap-3 pt-8 border-t border-outline-1 mb-10"
        >
          {project.liveUrl && project.liveUrl !== "#" && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Live demo
            </a>
          )}
          {project.repoUrl && project.repoUrl !== "#" && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-outline-4 text-foreground px-6 py-3 rounded-full font-semibold text-sm hover:bg-surface-3 transition-colors"
            >
              <Github className="w-4 h-4" />
              Source code
            </a>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center py-8 border-t border-outline-1"
        >
          <button
            onClick={() => router.push("/")}
            className="text-foreground/40 hover:text-foreground/70 transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to all projects
          </button>
        </motion.div>
      </div>
    </div>
  );
}
