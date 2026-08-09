"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Github,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { projectsData, type ProjectDetail } from "@/lib/portfolio-data";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const project: ProjectDetail | undefined = projectsData.find(
    (p) => p.id === slug
  );

  // Get related projects (same tag, different id)
  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return projectsData
      .filter((p) => p.tag === project.tag && p.id !== project.id)
      .slice(0, 3);
  }, [project]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <button
              onClick={() => router.push("/")}
              className="text-foreground/40 hover:text-foreground/70 transition-colors font-medium"
            >
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-foreground/20" />
            <button
              onClick={() => router.push("/projects")}
              className="text-foreground/40 hover:text-foreground/70 transition-colors font-medium"
            >
              Projects
            </button>
            <ChevronRight className="w-3 h-3 text-foreground/20" />
            <span className="text-foreground/70 font-medium truncate max-w-[200px]">
              {project.title.split("—")[0].trim()}
            </span>
          </nav>
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
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden rounded-[16px] sm:rounded-[22px] md:rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] group">
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Featured badge on hero */}
            {project.featured && (
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/25 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/25 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                  ★ Featured Project
                </span>
              </div>
            )}
            {/* Tag overlay on image */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                {project.tag}
              </span>
              <span className="text-[10px] font-mono text-white/50 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/[0.08]">
                {project.year}
              </span>
            </div>
            {/* Title overlay on hero image */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 max-w-[60%] text-right">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {project.title}
              </h1>
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
            <div className="rounded-[14px] border border-outline-1 bg-surface-2/30 p-4 sm:p-5">
              <h3 className="text-foreground font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-rose-400/50 rounded-full" />
                Challenge
              </h3>
              <p className="text-foreground/50 text-sm leading-relaxed">
                {project.challenge}
              </p>
            </div>
            <div className="rounded-[14px] border border-outline-1 bg-surface-2/30 p-4 sm:p-5">
              <h3 className="text-foreground font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-emerald-400/50 rounded-full" />
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
                  className="text-xs font-mono text-foreground/60 bg-surface-2 border border-outline-2 px-3.5 py-2 rounded-full hover:bg-surface-3 transition-colors"
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
                  className="rounded-[16px] border border-outline-2 bg-card p-4 sm:p-5 shadow-[var(--card-shadow)] hover:border-emerald-400/15 transition-colors"
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
            {/* Browse all projects link */}
            <button
              onClick={() => router.push("/projects")}
              className="flex items-center gap-2 text-foreground/50 hover:text-foreground px-5 py-2.5 rounded-full font-medium text-sm transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
              All projects
            </button>
          </motion.div>
        </motion.div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-12"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-foreground font-medium text-base sm:text-lg flex items-center gap-2">
                <span className="w-1 h-5 bg-foreground/30 rounded-full" />
                Related <span className="text-foreground/50">projects</span>
              </h3>
              <button
                onClick={() => router.push("/projects")}
                className="text-xs font-mono text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {relatedProjects.map((relProject, index) => (
                <motion.div
                  key={relProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => router.push(`/projects/${relProject.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] sm:rounded-[16px] shadow-[0_6px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.35)] border border-white/[0.08] dark:border-white/[0.06]">
                    <img
                      src={relProject.image}
                      alt={relProject.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-end">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-white/60 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 w-fit mb-2">
                        {relProject.tag}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-white mb-1 leading-snug line-clamp-1 group-hover:text-emerald-100 transition-colors duration-300">
                        {relProject.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-white/50 group-hover:text-emerald-300 transition-colors duration-300">
                        <span>View project</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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
            Back to portfolio
          </button>
        </motion.div>
      </div>
    </div>
  );
}
