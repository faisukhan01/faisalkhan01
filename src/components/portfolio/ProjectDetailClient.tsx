"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Github,
  ChevronLeft,
  Clock,
  User,
  Building2,
  Calendar,
  Layers,
  BookOpen,
  Hash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { ProjectDetail } from "@/lib/portfolio-data";
import { projectsData } from "@/lib/portfolio-data";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";
import { ReadingProgress } from "@/components/portfolio/ReadingProgress";
import { ShareButtons } from "@/components/portfolio/ShareButtons";
import { TableOfContents, type TocItem } from "@/components/portfolio/TableOfContents";
import { BackToTopButton } from "@/components/portfolio/BackToTopButton";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";

type ProjectDetailClientProps = {
  project: ProjectDetail;
};

/**
 * Estimates reading time (in minutes) from the project's case-study text.
 * Uses an average of ~220 wpm for technical content.
 */
function estimateReadingTime(project: ProjectDetail): number {
  const text = [
    project.overview,
    project.challenge,
    project.solution,
    project.description,
    ...project.techStack,
    ...project.results.map((r) => `${r.value} ${r.label}`),
  ].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Builds the list of section anchors for the table of contents.
 */
function buildToc(gallery?: string[]): TocItem[] {
  const items: TocItem[] = [
    { id: "overview", label: "Overview", index: "01" },
    { id: "snapshot", label: "Snapshot", index: "02" },
  ];
  if (gallery && gallery.length > 0) {
    items.push({ id: "screenshots", label: "Screenshots", index: "03" });
    // Shift subsequent items
    items.push({ id: "challenge", label: "Challenge & Solution", index: "04" });
    items.push({ id: "tech-stack", label: "Tech stack", index: "05" });
    items.push({ id: "results", label: "Results", index: "06" });
    items.push({ id: "actions", label: "Explore", index: "07" });
  } else {
    items.push({ id: "challenge", label: "Challenge & Solution", index: "03" });
    items.push({ id: "tech-stack", label: "Tech stack", index: "04" });
    items.push({ id: "results", label: "Results", index: "05" });
    items.push({ id: "actions", label: "Explore", index: "06" });
  }
  return items;
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter();

  // Get related projects (same tag, different id)
  const relatedProjects = useMemo(() => {
    return projectsData
      .filter((p) => p.tag === project.tag && p.id !== project.id)
      .slice(0, 3);
  }, [project]);

  // Compute previous / next project (cyclic navigation across all projects)
  const { prevProject, nextProject } = useMemo(() => {
    const idx = projectsData.findIndex((p) => p.id === project.id);
    if (idx === -1) return { prevProject: undefined, nextProject: undefined };
    const prev = projectsData[(idx - 1 + projectsData.length) % projectsData.length];
    const next = projectsData[(idx + 1) % projectsData.length];
    return { prevProject: prev, nextProject: next };
  }, [project]);

  const readingTime = useMemo(() => estimateReadingTime(project), [project]);
  const tocItems = useMemo(() => buildToc(project.gallery), [project.gallery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Reading progress bar (sits below the fixed nav) */}
      <ReadingProgress />

      {/* Back-to-top floating button */}
      <BackToTopButton />

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
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-foreground/40 pr-2">
              <BookOpen className="w-3 h-3" />
              {readingTime} min read
            </div>
            <ThemeToggle />
          </div>
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

        {/* Quick Stats Ribbon — key metrics at a glance */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mb-8 sm:mb-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { icon: Building2, label: "Client", value: project.client },
            { icon: Clock, label: "Duration", value: project.duration },
            { icon: User, label: "Role", value: project.role },
            { icon: Calendar, label: "Year", value: project.year },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative rounded-xl border border-outline-2 bg-surface-2/40 hover:bg-surface-3/50 hover:border-outline-3 transition-all duration-300 p-3 sm:p-4 overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className="w-3.5 h-3.5 text-foreground/40 group-hover:text-emerald-500/70 transition-colors" />
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-foreground/40">
                    {stat.label}
                  </span>
                </div>
                <p className="text-foreground/90 text-xs sm:text-sm font-medium leading-snug">
                  {stat.value}
                </p>
                {/* hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent" />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Screenshots gallery — anchored to #screenshots */}
        {project.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            className="mb-8 sm:mb-12 scroll-mt-20"
            id="screenshots"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-foreground font-semibold text-sm sm:text-base flex items-center gap-2">
                <span className="w-1 h-5 bg-foreground/40 rounded-full" />
                Screenshots
                {project.gallery.length > 1 && (
                  <span className="text-[10px] font-mono text-foreground/45 ml-1">
                    · {project.gallery.length} screens
                  </span>
                )}
              </h3>
              <span className="text-[10px] font-mono text-foreground/45 hidden sm:block">
                Click image to expand
              </span>
            </div>
            <ProjectGallery
              key={project.id}
              title={project.title}
              images={project.gallery}
              resetKey={project.id}
            />
          </motion.div>
        )}

        {/* Two-column layout: main content + sticky TOC sidebar */}
        <div className="flex gap-8 mb-8 sm:mb-12">
          {/* Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex-1 min-w-0 rounded-[16px] sm:rounded-[20px] md:rounded-[28px] border border-white/[0.12] dark:border-white/[0.08] bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-2xl px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            {/* Title Block — anchors to #overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 sm:mb-10 scroll-mt-20"
              id="overview"
            >
              <p className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/70 mb-2 sm:mb-3 tracking-wider">
                / Case Study
              </p>
              <h1 className="section-title text-foreground font-medium text-xl sm:text-2xl md:text-3xl leading-tight mb-4">
                {project.title}
              </h1>
              <p className="text-foreground/60 text-sm sm:text-base leading-relaxed max-w-2xl">
                {project.overview}
              </p>
            </motion.div>

            {/* Snapshot — project at a glance summary banner */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mb-8 sm:mb-10 py-5 sm:py-6 border-y border-outline-1 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 scroll-mt-20"
              id="snapshot"
            >
              {[
                {
                  icon: Layers,
                  label: "Category",
                  value: project.tag,
                  accent: "text-emerald-500/70",
                },
                {
                  icon: Building2,
                  label: "Engagement",
                  value: project.client,
                  accent: "text-violet-500/70",
                },
                {
                  icon: Clock,
                  label: "Timeline",
                  value: project.duration,
                  accent: "text-amber-500/70",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg border border-outline-2 bg-surface-2/60 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${item.accent}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground/40 text-[10px] font-mono uppercase tracking-[0.15em] mb-1">
                        {item.label}
                      </p>
                      <p className="text-foreground/90 text-sm font-medium leading-snug truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Challenge & Solution */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 scroll-mt-20"
              id="challenge"
            >
              <div className="rounded-[14px] border border-outline-1 bg-surface-2/30 p-4 sm:p-5">
                <h3 className="text-foreground font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-rose-400/50 rounded-full" />
                  Challenge
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {project.challenge}
                </p>
              </div>
              <div className="rounded-[14px] border border-outline-1 bg-surface-2/30 p-4 sm:p-5">
                <h3 className="text-foreground font-semibold text-sm sm:text-base mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-emerald-400/50 rounded-full" />
                  Solution
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mb-8 sm:mb-10 scroll-mt-20"
              id="tech-stack"
            >
              <h3 className="text-foreground font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-foreground/40 rounded-full" />
                Tech stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono text-foreground/70 bg-surface-2 border border-outline-2 px-3.5 py-2 rounded-full hover:bg-surface-3 hover:border-emerald-400/30 hover:text-foreground transition-all duration-300"
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
              className="mb-8 sm:mb-10 scroll-mt-20"
              id="results"
            >
              <h3 className="text-foreground font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-foreground/40 rounded-full" />
                Results
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {project.results.map((r) => (
                  <div
                    key={r.label}
                    className="group rounded-[16px] border border-outline-2 bg-card p-4 sm:p-5 shadow-[var(--card-shadow)] hover:border-emerald-400/25 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <p className="text-foreground text-xl sm:text-2xl font-bold mb-1">
                      {r.value}
                    </p>
                    <p className="text-foreground/50 text-[10px] font-mono uppercase tracking-widest">
                      {r.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Actions + Share */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex flex-col gap-4 pt-6 sm:pt-8 border-t border-outline-1 scroll-mt-20"
              id="actions"
            >
              <div className="flex flex-wrap gap-3">
                {project.liveUrl && project.liveUrl !== "#" && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Live demo
                  </a>
                )}
                {project.repoUrl && project.repoUrl !== "#" && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 border border-outline-4 text-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-surface-3 transition-colors"
                  >
                    <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Source code
                  </a>
                )}
                {/* Browse all projects link */}
                <button
                  onClick={() => router.push("/projects")}
                  className="flex items-center gap-2 text-foreground/60 hover:text-foreground px-5 py-2.5 rounded-full font-medium text-sm transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  All projects
                </button>
              </div>

              {/* Share row */}
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <Hash className="w-3 h-3 text-foreground/30" />
                <ShareButtons
                  title={project.title}
                  description={project.description}
                  slug={project.id}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Sticky TOC sidebar (lg+ only) */}
          <TableOfContents items={tocItems} />
        </div>

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
                      <span className="text-[9px] font-mono uppercase tracking-wider text-white/70 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10 w-fit mb-2">
                        {relProject.tag}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-white mb-1 leading-snug line-clamp-1 group-hover:text-emerald-100 transition-colors duration-300">
                        {relProject.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-white/70 group-hover:text-emerald-300 transition-colors duration-300">
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

        {/* Prev / Next project navigation */}
        {prevProject && nextProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 sm:mb-12 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5"
          >
            {/* Previous project */}
            <button
              onClick={() => router.push(`/projects/${prevProject.id}`)}
              className="group relative text-left rounded-2xl border border-outline-2 bg-surface-2/30 hover:bg-surface-3/40 hover:border-outline-3 transition-all duration-300 p-4 sm:p-5 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-2">
                <ChevronLeft className="w-3.5 h-3.5 text-foreground/40 group-hover:-translate-x-0.5 group-hover:text-emerald-500/70 transition-all duration-300" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">
                  Previous project
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-10 rounded-md overflow-hidden flex-shrink-0">
                  <img src={prevProject.image} alt={prevProject.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground/85 group-hover:text-foreground transition-colors line-clamp-1">
                    {prevProject.title}
                  </p>
                  <p className="text-[10px] font-mono text-foreground/55 mt-0.5">
                    {prevProject.tag} · {prevProject.year}
                  </p>
                </div>
              </div>
              {/* hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
              </div>
            </button>

            {/* Next project */}
            <button
              onClick={() => router.push(`/projects/${nextProject.id}`)}
              className="group relative text-right rounded-2xl border border-outline-2 bg-surface-2/30 hover:bg-surface-3/40 hover:border-outline-3 transition-all duration-300 p-4 sm:p-5 overflow-hidden"
            >
              <div className="flex items-center justify-end gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">
                  Next project
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-foreground/40 group-hover:translate-x-0.5 group-hover:text-emerald-500/70 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-end gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground/85 group-hover:text-foreground transition-colors line-clamp-1">
                    {nextProject.title}
                  </p>
                  <p className="text-[10px] font-mono text-foreground/55 mt-0.5">
                    {nextProject.tag} · {nextProject.year}
                  </p>
                </div>
                <div className="relative w-14 h-10 rounded-md overflow-hidden flex-shrink-0">
                  <img src={nextProject.image} alt={nextProject.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-bl from-emerald-500/5 via-transparent to-transparent" />
              </div>
            </button>
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
            className="text-foreground/50 hover:text-foreground/80 transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to portfolio
          </button>
        </motion.div>
      </div>
    </div>
  );
}
