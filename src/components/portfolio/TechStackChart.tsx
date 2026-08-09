"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { Cpu } from "lucide-react";
import type { ProjectDetail } from "@/lib/portfolio-data";

type TechStackChartProps = {
  projects: ProjectDetail[];
  /** Optional callback invoked when a tech pill is clicked. */
  onSelectTech?: (tech: string) => void;
  /** Currently-active tech (highlighted). */
  activeTech?: string;
};

/**
 * Horizontal bar chart visualizing how often each technology appears
 * across the full project portfolio.
 *
 * Features:
 *  - Auto-aggregates tech counts from the provided projects array
 *  - Sorted descending by frequency
 *  - Animated bar widths (framer-motion whileInView)
 *  - Each row is clickable (when onSelectTech provided) to filter the
 *    parent view by that tech
 *  - Active row highlighted with emerald accent + ring
 *  - Percentage + project count displayed at row end
 *  - Color-coded bar opacity by frequency tier (top 3 = brightest)
 *  - Compact, accessible, responsive (mobile stacks gracefully)
 *
 * Designed for the /projects page as a "tech stack overview" widget.
 */
export function TechStackChart({
  projects,
  onSelectTech,
  activeTech,
}: TechStackChartProps) {
  const techStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const t of p.techStack) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    const total = projects.length;
    return Array.from(counts.entries())
      .map(([tech, count]) => ({
        tech,
        count,
        pct: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [projects]);

  if (techStats.length === 0) return null;

  const maxCount = techStats[0].count;
  const interactive = typeof onSelectTech === "function";

  return (
    <div className="rounded-2xl border border-outline-2 bg-surface-2/30 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-semibold text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-500/70" />
          Tech stack distribution
        </h3>
        <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/45">
          {techStats.length} technologies · {projects.length} projects
        </span>
      </div>

      {/* Chart rows */}
      <div className="space-y-2.5">
        {techStats.map((stat, i) => {
          const widthPct = (stat.count / maxCount) * 100;
          const isActive = activeTech === stat.tech;
          const tier = i < 3 ? "tier-top" : "tier-rest";
          return (
            <button
              key={stat.tech}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onSelectTech?.(stat.tech)}
              className={`group w-full flex items-center gap-3 text-left ${
                interactive
                  ? "cursor-pointer hover:bg-surface-3/40 rounded-lg px-2 py-1 -mx-2 transition-colors"
                  : "cursor-default px-2 py-1 -mx-2"
              } ${isActive ? "bg-emerald-500/10 ring-1 ring-emerald-400/30 rounded-lg" : ""}`}
              aria-pressed={isActive}
            >
              {/* Label */}
              <span className="flex-shrink-0 w-28 sm:w-32 truncate text-xs font-mono text-foreground/70 group-hover:text-foreground transition-colors">
                {stat.tech}
              </span>

              {/* Bar track */}
              <span className="relative flex-1 h-6 rounded-md bg-surface-3/40 overflow-hidden">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: `${widthPct}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.05 + i * 0.03,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className={`absolute inset-y-0 left-0 rounded-md ${
                    isActive
                      ? "bg-emerald-500/60"
                      : tier === "tier-top"
                        ? "bg-emerald-500/40"
                        : "bg-foreground/25"
                  } group-hover:brightness-110 transition-all duration-300`}
                >
                  {/* Subtle inner highlight */}
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-md" />
                </motion.span>

                {/* Count badge inside bar */}
                <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-mono font-bold text-foreground/70">
                  {stat.count}
                </span>
              </span>

              {/* Percentage */}
              <span className="flex-shrink-0 w-9 text-right text-[10px] font-mono text-foreground/45">
                {stat.pct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      {interactive && (
        <p className="mt-3 pt-3 border-t border-outline-1 text-[10px] font-mono text-foreground/40">
          Click any row to filter projects by that technology
        </p>
      )}
    </div>
  );
}
