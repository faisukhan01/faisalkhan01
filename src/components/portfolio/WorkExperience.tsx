"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const experiences = [
  {
    year: "2022",
    duration: "1 year 5 months",
    company: "ITHUB",
    role: "Frontend developer | React & Vue",
    highlight: false,
  },
  {
    year: "2021 — 2022",
    duration: "8 months",
    company: "VK Development Lab",
    role: "Frontend developer | React",
    highlight: true,
  },
  {
    year: "2020 — 2021",
    duration: "9 months",
    company: "SN Inc.",
    role: "Fullstack developer | JavaScript & Python",
    highlight: false,
  },
  {
    year: "2018 — 2020",
    duration: "1 year 10 months",
    company: "Business Up",
    role: "Fullstack developer | JavaScript & Python",
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
        className="font-mono text-xs text-white/40 mb-8 tracking-wider"
      >
        ... / Work experience
      </motion.p>

      <div className="relative">
        {/* Large decorative "Work" title */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[5rem] sm:text-[7rem] md:text-[9rem] font-bold text-white/[0.04] leading-none absolute -top-4 md:-top-8 right-0 select-none pointer-events-none"
        >
          Work
        </motion.h2>

        {/* Table */}
        <div className="relative z-10">
          {/* Header Row */}
          <div className="hidden md:grid md:grid-cols-[140px_1fr_1fr_40px] gap-4 pb-4 border-b border-white/[0.08]">
            <span className="text-[10px] text-white/30 font-mono uppercase tracking-[0.15em]">Year</span>
            <span className="text-[10px] text-white/30 font-mono uppercase tracking-[0.15em]">Company</span>
            <span className="text-[10px] text-white/30 font-mono uppercase tracking-[0.15em]">Role</span>
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
              className={`group grid grid-cols-1 md:grid-cols-[140px_1fr_1fr_40px] gap-2 md:gap-4 py-5 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors cursor-pointer rounded-lg px-3 -mx-3 ${
                exp.highlight ? "bg-white/[0.015]" : ""
              }`}
            >
              {/* Year */}
              <div>
                <span className="text-white font-semibold text-sm">{exp.year}</span>
                <span className="block text-white/30 text-xs mt-0.5">{exp.duration}</span>
              </div>

              {/* Company */}
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm font-medium">{exp.company}</span>
                {exp.highlight && (
                  <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" />
                )}
              </div>

              {/* Role & Tech */}
              <span className="text-white/50 text-sm font-mono">{exp.role}</span>

              {/* Hover arrow */}
              <div className="hidden md:flex items-center justify-end">
                <ArrowUpRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/30 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="flex justify-end mt-6">
          <div className="text-right">
            <p className="text-white/20 text-xs font-mono tracking-wide">Work experience</p>
            <p className="text-white/30 text-sm font-mono mt-0.5">~4 years 9 months</p>
          </div>
        </div>
      </div>
    </section>
  );
}
