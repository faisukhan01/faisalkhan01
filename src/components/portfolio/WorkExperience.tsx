"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const experiences = [
  {
    year: "2022",
    duration: "1 year 5 months",
    company: "ITHUB",
    role: "Frontend developer",
    tech: "React & Vue",
    highlight: false,
  },
  {
    year: "2021 — 2022",
    duration: "8 months",
    company: "VK Development Lab",
    role: "Frontend developer",
    tech: "React",
    highlight: true,
  },
  {
    year: "2020 — 2021",
    duration: "9 months",
    company: "SN Inc.",
    role: "Fullstack developer",
    tech: "JavaScript & Python",
    highlight: false,
  },
  {
    year: "2018 — 2020",
    duration: "1 year 10 months",
    company: "Business Up",
    role: "Fullstack developer",
    tech: "JavaScript & Python",
    highlight: false,
  },
];

export function WorkExperience() {
  return (
    <section className="py-16 md:py-24 relative">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-foreground/40 mb-8 tracking-wider"
      >
        ... / Work experience
      </motion.p>

      <div className="relative">
        {/* Large decorative "Work" title — positioned to the LEFT so it doesn't overlap table data */}
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          aria-hidden="true"
          className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-bold text-foreground/[0.03] leading-none absolute -top-12 md:-top-16 -left-2 md:left-0 select-none pointer-events-none whitespace-nowrap"
        >
          Experience
        </motion.h2>

        {/* Table */}
        <div className="relative z-10 mt-8 md:mt-12">
          {/* Header Row */}
          <div className="hidden md:grid md:grid-cols-[160px_1fr_1fr_1fr_40px] gap-4 pb-4 border-b border-outline-2">
            <span className="text-[10px] text-foreground/30 font-mono uppercase tracking-[0.15em]">Year</span>
            <span className="text-[10px] text-foreground/30 font-mono uppercase tracking-[0.15em]">Company</span>
            <span className="text-[10px] text-foreground/30 font-mono uppercase tracking-[0.15em]">Role</span>
            <span className="text-[10px] text-foreground/30 font-mono uppercase tracking-[0.15em]">Technology</span>
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
                exp.highlight ? "bg-surface-1" : ""
              } hover:border-outline-3`}
            >
              {/* Year */}
              <div className="flex md:block items-baseline gap-2">
                <span className="text-foreground font-semibold text-sm">{exp.year}</span>
                <span className="block text-foreground/50 text-xs mt-0.5">{exp.duration}</span>
              </div>

              {/* Company */}
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm font-medium group-hover:text-foreground transition-colors">
                  {exp.company}
                </span>
                {exp.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                )}
              </div>

              {/* Role */}
              <span className="text-foreground/70 text-sm group-hover:text-foreground transition-colors">
                {exp.role}
              </span>

              {/* Tech */}
              <span className="text-foreground/60 text-sm font-mono group-hover:text-foreground transition-colors">
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
              <p className="text-foreground/20 text-[10px] font-mono uppercase tracking-[0.15em] mb-1">Companies</p>
              <p className="text-foreground/70 text-lg font-mono">04</p>
            </div>
            <div>
              <p className="text-foreground/20 text-[10px] font-mono uppercase tracking-[0.15em] mb-1">Total</p>
              <p className="text-foreground/70 text-lg font-mono">~4 years 9 months</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-foreground/20 text-[10px] font-mono uppercase tracking-[0.15em]">Work experience</p>
            <p className="text-foreground/30 text-sm font-mono mt-1">Updated 2025</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
