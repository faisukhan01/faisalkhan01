"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
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

  if (featuredProjects.length === 0) return null;

  return (
    <section id="projects" className="py-8 sm:py-16 md:py-24">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8 sm:mb-12"
      >
        <p className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/70 mb-2 sm:mb-3 tracking-wider">
          / Projects
        </p>
        <h2 className="section-title text-foreground font-medium text-xl sm:text-2xl md:text-3xl">
          Featured <span className="text-foreground/70">work</span>
        </h2>
      </motion.div>

      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => router.push(`/projects/${project.id}`)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] sm:rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/[0.08] dark:border-white/[0.06]">
              {/* Image */}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>

              {/* Top badges */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/15">
                  {project.year}
                </span>
              </div>

              {/* Featured badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-emerald-300/90 bg-emerald-500/20 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-emerald-400/20">
                  Featured
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                {/* Tag */}
                <div className="mb-2 sm:mb-3">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] text-white/70 bg-black/30 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10">
                    {project.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1.5 sm:mb-2 leading-snug line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-emerald-100 transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-2 mb-3 sm:mb-4 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
                  {project.description}
                </p>

                {/* Tech stack preview */}
                <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                  {project.techStack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[8px] sm:text-[9px] font-mono text-white/60 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-white/[0.08]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white/80 group-hover:text-emerald-300 transition-colors duration-300">
                  <span>View project</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
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
        className="mt-8 sm:mt-12 flex justify-center"
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
      </motion.div>
    </section>
  );
}
