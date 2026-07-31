"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { Github } from "lucide-react";

// Generate deterministic pseudo-random contribution data for the last 26 weeks (Mon-Sun)
function generateContributions() {
  const weeks = 26;
  const days = 7;
  const data: { week: number; day: number; count: number }[] = [];

  // Use a simple seeded pseudo-random generator for stable output
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      // Weekends have less activity
      const isWeekend = d === 0 || d === 6;
      const base = isWeekend ? 0.2 : 0.6;
      const r = rand();
      // Some weeks are more active
      const burst = r > 0.85 ? 1.5 : 1;
      const count = Math.floor(r * base * burst * 8);
      data.push({ week: w, day: d, count });
    }
  }
  return data;
}

const levelColors = [
  "bg-surface-3",
  "bg-foreground/15",
  "bg-foreground/30",
  "bg-foreground/50",
  "bg-foreground/75",
  "bg-foreground",
];

function getLevel(count: number) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 6) return 3;
  if (count <= 8) return 4;
  return 5;
}

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ContributionGraph() {
  const data = useMemo(() => generateContributions(), []);

  // Group by week
  const weeks = useMemo(() => {
    const grouped: { week: number; day: number; count: number }[][] = [];
    for (let w = 0; w < 26; w++) {
      grouped.push(data.filter((d) => d.week === w).sort((a, b) => a.day - b.day));
    }
    return grouped;
  }, [data]);

  const totalCommits = data.reduce((sum, d) => sum + d.count, 0);
  const activeDays = data.filter((d) => d.count > 0).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-[22px] border border-outline-2 bg-card p-6 md:p-8 shadow-[var(--card-shadow)] overflow-hidden relative group hover:border-outline-3 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-3 border border-outline-3 flex items-center justify-center">
            <Github className="w-4 h-4 text-foreground/70" />
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">Coding activity</p>
            <p className="text-foreground/65 text-xs font-mono">{totalCommits} commits in the last 6 months</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <p className="text-foreground/50 text-[10px] uppercase tracking-widest">Active days</p>
            <p className="text-foreground/85">{activeDays}</p>
          </div>
          <div className="text-right">
            <p className="text-foreground/50 text-[10px] uppercase tracking-widest">Streak</p>
            <p className="text-foreground/85">12d</p>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex flex-col gap-2 min-w-max">
          {/* Month labels */}
          <div className="flex gap-[3px] pl-6 text-[10px] font-mono text-foreground/50">
            {monthLabels.slice(0, 6).map((m, i) => (
              <span key={m} className="w-[84px]">
                {m}
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[3px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] justify-around pr-1 text-[9px] font-mono text-foreground/50">
              <span className="h-[10px] leading-[10px]">Mon</span>
              <span className="h-[10px] leading-[10px]">Wed</span>
              <span className="h-[10px] leading-[10px]">Fri</span>
            </div>
            {/* Cells */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell) => {
                  const level = getLevel(cell.count);
                  return (
                    <motion.div
                      key={`${cell.week}-${cell.day}`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: (cell.week * 0.01) + (cell.day * 0.015),
                        duration: 0.2,
                      }}
                      whileHover={{ scale: 1.4, zIndex: 10 }}
                      className={`w-[10px] h-[10px] rounded-[2px] ${levelColors[level]} transition-colors`}
                      title={`${cell.count} contributions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-[10px] font-mono text-foreground/55">Less</span>
        <div className="flex gap-[3px]">
          {levelColors.map((c, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
          ))}
        </div>
        <span className="text-[10px] font-mono text-foreground/55">More</span>
      </div>

      {/* Corner glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-foreground/[0.03] blur-3xl pointer-events-none" />
    </motion.div>
  );
}
