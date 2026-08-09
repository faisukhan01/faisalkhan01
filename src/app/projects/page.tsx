"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { projectsData, type ProjectDetail } from "@/lib/portfolio-data";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";

const tagColors: Record<string, { bg: string; text: string; border: string; dot: string; glow: string }> = {
  "Full-Stack": { bg: "bg-blue-500/15", text: "text-blue-300", border: "border-blue-400/20", dot: "bg-blue-400", glow: "shadow-[0_0_12px_rgba(59,130,246,0.15)]" },
  AI: { bg: "bg-purple-500/15", text: "text-purple-300", border: "border-purple-400/20", dot: "bg-purple-400", glow: "shadow-[0_0_12px_rgba(168,85,247,0.15)]" },
  Automation: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-400/20", dot: "bg-amber-400", glow: "shadow-[0_0_12px_rgba(245,158,11,0.15)]" },
};

export default function AllProjectsPage() {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allTags = useMemo(
    () => Array.from(new Set(projectsData.map((p) => p.tag))),
    []
  );

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projectsData.forEach((p) => {
      counts[p.tag] = (counts[p.tag] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredProjects = useMemo(
    () =>
      activeTag === null
        ? projectsData
        : projectsData.filter((p) => p.tag === activeTag),
    [activeTag]
  );

  const handleTagChange = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
  };

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
          <span className="text-xs font-mono text-foreground/40 uppercase tracking-wider">
            All Projects
          </span>
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-14 max-w-[1440px] mx-auto w-full px-3.5 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-28 py-8 sm:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10"
        >
          <p className="font-mono text-[10px] sm:text-xs text-foreground/50 mb-2 tracking-wider">
            / Projects
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-foreground font-medium text-2xl sm:text-3xl md:text-4xl mb-2">
                All <span className="text-foreground/70">projects</span>
              </h1>
              <p className="text-foreground/40 text-sm sm:text-base max-w-xl">
                A collection of full-stack applications, AI-powered platforms, and automation systems I&apos;ve designed and built.
              </p>
            </div>
            {/* Project count badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-2 bg-surface-2/50 backdrop-blur-sm"
            >
              <Layers className="w-4 h-4 text-foreground/40" />
              <span className="text-sm font-mono text-foreground/50">
                <span className="text-foreground font-semibold">{filteredProjects.length}</span> projects
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Filter Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10"
        >
          {allTags.map((tag) => {
            const colors = tagColors[tag] || { bg: "bg-surface-2", text: "text-foreground/50", border: "border-outline-2", dot: "bg-foreground/30", glow: "" };
            const isActive = activeTag === tag;
            return (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTagChange(tag)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 flex items-center gap-2 border ${
                  isActive
                    ? `${colors.bg} ${colors.text} ${colors.border} ${colors.glow}`
                    : "bg-surface-2 text-foreground/50 hover:text-foreground hover:bg-surface-2/80 border-transparent"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? colors.dot : "bg-foreground/20"}`} />
                {tag}
                <span className={`text-[10px] font-mono ml-0.5 ${isActive ? "opacity-70" : "opacity-40"}`}>
                  {tagCounts[tag] || 0}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Projects Grid with AnimatePresence for filter transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTag || "all"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
          >
            {filteredProjects.map((project, index) => (
              <ProjectGridCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => router.push(`/projects/${project.id}`)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-foreground/40 text-sm">No projects found for this category.</p>
          </div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-10 sm:py-14"
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

function ProjectGridCard({
  project,
  index,
  onClick,
}: {
  project: ProjectDetail;
  index: number;
  onClick: () => void;
}) {
  const colors = tagColors[project.tag] || { bg: "bg-surface-2", text: "text-foreground/50", border: "border-outline-2", dot: "bg-foreground/30", glow: "" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] sm:rounded-[18px] shadow-[0_6px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.35)] border border-white/[0.08] dark:border-white/[0.06]">
        {/* Image */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent" />

        {/* Hover border glow */}
        <div className="absolute inset-0 rounded-[14px] sm:rounded-[18px] border border-emerald-400/0 group-hover:border-emerald-400/15 transition-all duration-500" />

        {/* Hover shimmer */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out" />
        </div>

        {/* Top badges */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-white/70 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            {project.year}
          </span>
          {project.featured && (
            <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/25 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-400/25">
              ★
            </span>
          )}
        </div>

        {/* Tag badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[9px] font-mono uppercase tracking-wider ${colors.text} ${colors.bg} backdrop-blur-md px-2 py-0.5 rounded-full border ${colors.border}`}>
            {project.tag}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-end">
          <h3 className="text-xs sm:text-sm font-semibold text-white mb-1.5 leading-snug line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-emerald-100 transition-colors duration-300">
            {project.title}
          </h3>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[8px] font-mono text-white/50 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/[0.06]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA with hover action circle */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-white/60 group-hover:text-emerald-300 transition-colors duration-300">
              View project
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
            <div className="w-7 h-7 rounded-full bg-white/[0.06] backdrop-blur-sm flex items-center justify-center border border-white/[0.08] group-hover:bg-emerald-500/15 group-hover:border-emerald-400/15 transition-all duration-300">
              <ArrowUpRight className="w-2.5 h-2.5 text-white/30 group-hover:text-emerald-300 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
