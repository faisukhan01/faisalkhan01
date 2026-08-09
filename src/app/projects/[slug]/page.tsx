"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
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
        <div className="max-w-[1440px] mx-auto w-full px-3.5 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-28 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to portfolio</span>
            <span className="sm:hidden">Back</span>
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

      {/* Main Content Container */}
      <div className="pt-14 max-w-[1440px] mx-auto w-full px-3.5 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-28">

        {/* Hero Image - properly contained */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-6 sm:mt-8 mb-8 sm:mb-12"
        >
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-[16px] sm:rounded-[22px] md:rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Tag overlay on image */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                {project.tag}
              </span>
              <span className="text-[10px] font-mono text-white/50 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/[0.08]">
                {project.year}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-[16px] sm:rounded-[20px] md:rounded-[28px] border border-white/[0.12] dark:border-white/[0.08] bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-2xl px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-8 sm:mb-12"
        >
          {/* Title Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 sm:mb-10"
          >
            <p className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/70 mb-2 sm:mb-3 tracking-wider">
              / Case Study
            </p>
            <h1 className="section-title text-foreground font-medium text-xl sm:text-2xl md:text-3xl leading-tight mb-4">
              {project.title}
            </h1>
            <p className="text-foreground/50 text-sm sm:text-base leading-relaxed max-w-2xl">
              {project.overview}
            </p>
          </motion.div>

          {/* Meta Grid */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-8 sm:mb-10 py-5 sm:py-6 border-y border-outline-1"
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10"
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-8 sm:mb-10"
          >
            <h3 className="text-foreground font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-foreground/40 rounded-full" />
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mb-8 sm:mb-10"
          >
            <h3 className="text-foreground font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-foreground/40 rounded-full" />
              Results
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {project.results.map((r) => (
                <div
                  key={r.label}
                  className="rounded-[16px] border border-outline-2 bg-card p-4 sm:p-5 shadow-[var(--card-shadow)]"
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex flex-wrap gap-3 pt-6 sm:pt-8 border-t border-outline-1"
          >
            {project.liveUrl && project.liveUrl !== "#" && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
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
                className="flex items-center gap-2 border border-outline-4 text-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-surface-3 transition-colors"
              >
                <Github className="w-4 h-4" />
                Source code
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center py-6 sm:py-8 mb-4"
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
