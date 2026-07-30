"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { usePortfolioData, usePortfolioSettings } from "@/lib/portfolio-context";

export function WorkExperience() {
  const { data } = usePortfolioData();
  const settings = usePortfolioSettings();

  const workSummaryCompanies = settings.work_summary_companies || "03";
  const workSummaryTotal = settings.work_summary_total || "~1 year+";

  const experiences = data.workExperience.length > 0
    ? data.workExperience.map((exp) => ({
        year: exp.year,
        duration: exp.duration,
        company: exp.company,
        role: exp.role,
        tech: exp.tech,
        highlight: exp.isOngoing === 1,
      }))
    : [
        {
          year: "2024 — Present",
          duration: "Ongoing",
          company: "CodeSquad",
          role: "Associate Software Engineer",
          tech: "Next.js, Node.js, FastAPI",
          highlight: true,
        },
        {
          year: "2025 — Present",
          duration: "Ongoing",
          company: "Freelance",
          role: "Full-Stack Developer",
          tech: "Next.js, Express.js, FastAPI",
          highlight: false,
        },
        {
          year: "2024",
          duration: "5 months",
          company: "Apex Careers",
          role: "Recruitment Executive",
          tech: "MS Office, Sourcing",
          highlight: false,
        },
      ];

  return (
    <section className="py-16 md:py-24 relative">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-breadcrumb font-mono text-xs text-foreground/55 mb-8 tracking-wider"
      >
        / Work experience
      </motion.p>

      <div className="relative">
        {/* Large decorative "Experience" watermark — centered behind table */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
          className="text-[5rem] sm:text-[7rem] md:text-[9rem] font-bold text-foreground/[0.01] leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none whitespace-nowrap tracking-tight"
        >
          Experience
        </motion.h2>

        {/* Table */}
        <div className="relative z-10">
          {/* Header Row */}
          <div className="hidden md:grid md:grid-cols-[160px_1fr_1fr_1fr_40px] gap-4 pb-4 border-b border-outline-2">
            <span className="text-[10px] text-foreground/65 font-mono uppercase tracking-[0.15em]">Year</span>
            <span className="text-[10px] text-foreground/65 font-mono uppercase tracking-[0.15em]">Company</span>
            <span className="text-[10px] text-foreground/65 font-mono uppercase tracking-[0.15em]">Role</span>
            <span className="text-[10px] text-foreground/65 font-mono uppercase tracking-[0.15em]">Technology</span>
            <span />
          </div>

          {/* Experience Rows */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className={`group grid grid-cols-1 md:grid-cols-[160px_1fr_1fr_1fr_40px] gap-2 md:gap-4 py-5 border-b border-outline-1 hover:bg-surface-2 transition-all duration-300 cursor-pointer rounded-lg px-3 -mx-3 ${
                exp.highlight ? "bg-surface-1 border-l-2 border-l-emerald-400/60" : ""
              } hover:border-outline-3`}
            >
              {/* Year */}
              <div className="flex md:block items-baseline gap-2">
                <span className="text-foreground font-semibold text-sm">{exp.year}</span>
                <span className="block text-foreground/70 text-xs mt-0.5">{exp.duration}</span>
              </div>

              {/* Mobile: Company + Role + Tech in a compact layout */}
              <div className="md:hidden flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground text-sm font-medium">{exp.company}</span>
                  {exp.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                  )}
                </div>
                <span className="text-foreground/80 text-sm">{exp.role}</span>
                <span className="text-foreground/70 text-xs font-mono">{exp.tech}</span>
              </div>

              {/* Desktop: Company */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-foreground text-sm font-medium group-hover:text-foreground transition-colors">
                  {exp.company}
                </span>
                {exp.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                )}
              </div>

              {/* Desktop: Role */}
              <span className="hidden md:block text-foreground/80 text-sm group-hover:text-foreground transition-colors">
                {exp.role}
              </span>

              {/* Desktop: Tech */}
              <span className="hidden md:block text-foreground/70 text-sm font-mono group-hover:text-foreground transition-colors">
                {exp.tech}
              </span>

              {/* Hover arrow */}
              <div className="hidden md:flex items-center justify-end">
                <ArrowUpRight className="w-3.5 h-3.5 text-foreground/0 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mt-8 gap-4"
        >
          <div className="flex gap-8">
            <div>
              <p className="text-foreground/55 text-[10px] font-mono uppercase tracking-[0.15em] mb-1">Companies</p>
              <p className="text-foreground/85 text-lg font-mono">{workSummaryCompanies}</p>
            </div>
            <div>
              <p className="text-foreground/55 text-[10px] font-mono uppercase tracking-[0.15em] mb-1">Total</p>
              <p className="text-foreground/85 text-lg font-mono">{workSummaryTotal}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-foreground/55 text-[10px] font-mono uppercase tracking-[0.15em]">Work experience</p>
            <p className="text-foreground/65 text-sm font-mono mt-1">Updated 2025</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
