"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/portfolio-context";
import { useMemo } from "react";

/**
 * Compact "Recent projects" strip for the homepage.
 *
 * Sits below the featured-projects section as a secondary discovery
 * surface — shows the latest 3 non-featured projects sorted by year
 * descending, in a slim horizontal row of cards.
 *
 * Visual treatment:
 *  - Smaller card height than featured (aspect-[5/4])
 *  - Year badge prominently displayed
 *  - Tag pill + tech stack preview
 *  - Hover: image zoom + emerald border glow + arrow circle
 *  - "View all" CTA at the end of the row (desktop) / below (mobile)
 *
 * This gives the homepage a richer project surface without
 * overwhelming the featured section.
 */
export function RecentProjects() {
  const router = useRouter();
  const allProjects = useProjects();

  const recentProjects = useMemo(() => {
    // Get non-featured projects, sorted by year desc (treat "Ongoing" as latest)
    return allProjects
      .filter((p) => !p.featured)
      .sort((a, b) => {
        const av = a.duration === "Ongoing" ? 9999 : Number(a.year);
        const bv = b.duration === "Ongoing" ? 9999 : Number(b.year);
        return bv - av;
      })
      .slice(0, 3);
  }, [allProjects]);

  if (recentProjects.length === 0) return null;

  return (
    <section id="recent-projects" className="py-8 sm:py-12 md:py-16">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-6 sm:mb-8"
      >
        <div>
          <p className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/70 mb-2 tracking-wider">
            / Recent
          </p>
          <h2 className="section-title text-foreground font-medium text-lg sm:text-xl md:text-2xl flex items-center gap-2">
            More <span className="text-foreground/70">projects</span>
            <Clock className="w-4 h-4 text-foreground/40" />
          </h2>
        </div>
        <button
          onClick={() => router.push("/projects")}
          className="group flex items-center gap-1.5 text-xs font-mono text-foreground/50 hover:text-foreground transition-colors"
          aria-label="View all projects"
        >
          <span className="hidden sm:inline">View all</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </motion.div>

      {/* Compact project cards in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {recentProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onClick={() => router.push(`/projects/${project.id}`)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[5/4] overflow-hidden rounded-[14px] shadow-[0_6px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.35)] border border-white/[0.08] dark:border-white/[0.06] hover:border-emerald-400/30 transition-all duration-300">
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
              {/* Multi-layer gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent transition-all duration-500" />

              {/* Top row: tag + year */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-wider text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/10">
                  {project.tag}
                </span>
                <span className="text-[9px] font-mono text-white/60 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/[0.08]">
                  {project.year}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-end">
                <h3 className="text-xs sm:text-sm font-semibold text-white mb-1.5 leading-snug line-clamp-2 group-hover:text-emerald-100 transition-colors duration-300">
                  {project.title}
                </h3>
                {/* Tech preview */}
                <div className="flex items-center gap-1 mb-2">
                  {project.techStack.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-mono text-white/55 bg-white/5 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/[0.06]"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 2 && (
                    <span className="text-[9px] font-mono text-white/40">
                      +{project.techStack.length - 2}
                    </span>
                  )}
                </div>
                {/* View project CTA */}
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/65 group-hover:text-emerald-300 transition-colors duration-300">
                  <span>View case study</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>

              {/* Hover arrow circle */}
              <div className="absolute top-3 right-3 sm:top-3 sm:right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile "view all" CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        onClick={() => router.push("/projects")}
        className="sm:hidden mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-outline-2 bg-surface-2/40 text-xs font-mono text-foreground/65 hover:text-foreground hover:border-emerald-400/30 transition-colors"
      >
        <Layers className="w-3.5 h-3.5" />
        View all {allProjects.length} projects
      </motion.button>
    </section>
  );
}
