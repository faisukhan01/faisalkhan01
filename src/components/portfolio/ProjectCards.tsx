"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/portfolio-context";
import { useMemo } from "react";

export function ProjectCards() {
  const router = useRouter();
  const allProjects = useProjects();

  const featuredProjects = useMemo(
    () => allProjects.filter((p) => p.featured),
    [allProjects]
  );

  const totalProjects = allProjects.length;

  if (featuredProjects.length === 0) return null;

  return (
    <section id="projects" className="py-8 sm:py-16 md:py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8 sm:mb-12"
      >
        <div>
          <p className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/70 mb-2 sm:mb-3 tracking-wider">
            / Projects
          </p>
          <h2 className="section-title text-foreground font-medium text-xl sm:text-2xl md:text-3xl">
            Featured <span className="text-foreground/70">work</span>
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-foreground/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-xs font-mono">{featuredProjects.length} of {totalProjects}</span>
        </div>
      </motion.div>

      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            onClick={() => router.push(`/projects/${project.id}`)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] sm:rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/[0.08] dark:border-white/[0.06]">
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />

              {/* Multi-layer gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-[16px] sm:rounded-[20px] border border-emerald-400/0 group-hover:border-emerald-400/20 transition-all duration-500" />

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out" />
              </div>

              {/* Top badges */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-mono text-white/80 bg-black/50 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/15">
                  {project.year}
                </span>
              </div>

              {/* Featured badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/25 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-400/25 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                  ★ Featured
                </span>
              </div>

              {/* Project number indicator */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] sm:text-xs font-mono text-white/20 font-bold">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                {/* Tag */}
                <div className="mb-2 sm:mb-2.5">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] text-white/60 bg-black/40 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10">
                    {project.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1.5 sm:mb-2 leading-snug line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-emerald-100 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-sm text-white/50 leading-relaxed line-clamp-2 mb-3 sm:mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                  {project.description}
                </p>

                {/* Tech stack preview + Results */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[8px] sm:text-[9px] font-mono text-white/50 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/[0.08]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.results.length > 0 && (
                    <span className="text-[8px] sm:text-[9px] font-mono text-emerald-300/60 ml-auto">
                      {project.results.length} results
                    </span>
                  )}
                </div>

                {/* CTA with animated arrow */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/70 group-hover:text-emerald-300 transition-colors duration-300">
                    View project
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </span>
                  {/* Hover action circle */}
                  <motion.div
                    className="w-8 h-8 rounded-full bg-white/[0.06] backdrop-blur-sm flex items-center justify-center border border-white/[0.08] group-hover:bg-emerald-500/20 group-hover:border-emerald-400/20 transition-all duration-300"
                  >
                    <ArrowUpRight className="w-3 h-3 text-white/40 group-hover:text-emerald-300 transition-colors duration-300" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Projects Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 sm:mt-12 flex flex-col items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/projects")}
          className="group flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 rounded-full border border-outline-3 bg-surface-2/50 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:border-foreground/20 hover:bg-surface-3/50 transition-all duration-300 text-sm font-medium"
        >
          <span>View all projects</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.button>
        <span className="text-[10px] sm:text-xs font-mono text-foreground/30">
          {totalProjects} projects total
        </span>
      </motion.div>
    </section>
  );
}
