"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarRange, Infinity as InfinityIcon, Flag } from "lucide-react";
import { projectsData, type ProjectDetail } from "@/lib/portfolio-data";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Parse a "Mon YYYY" string into a decimal year (e.g. Apr 2026 → 2026.25). */
function parseMonthYear(s: string): number | null {
  const m = s.trim().match(/^([A-Z][a-z]{2})\s+(\d{4})$/);
  if (!m) return null;
  const mi = MONTHS.indexOf(m[1]);
  if (mi < 0) return null;
  return Number(m[2]) + mi / 12;
}

type ParsedRange = {
  start: number | null;
  end: number | null;
  ongoing: boolean;
  raw: string;
};

/** Parse a project duration string into start/end decimal years. */
function parseDuration(duration: string, year: string): ParsedRange {
  const now = new Date();
  const nowYear = now.getFullYear() + now.getMonth() / 12;

  // "Ongoing" with no explicit range — use Jan of the project's year.
  if (/^ongoing$/i.test(duration.trim())) {
    const y = Number(year);
    if (!Number.isNaN(y)) {
      return { start: y, end: nowYear, ongoing: true, raw: duration };
    }
    return { start: null, end: null, ongoing: true, raw: duration };
  }

  // Split on en-dash or hyphen surrounded by spaces.
  const parts = duration.split(/\s+[–-]\s+/);
  if (parts.length !== 2) {
    return { start: null, end: null, ongoing: false, raw: duration };
  }

  const startStr = parts[0].trim();
  const endStr = parts[1].trim();

  const start = parseMonthYear(startStr);
  let end: number | null = null;
  let ongoing = false;

  if (/present|ongoing|current/i.test(endStr)) {
    end = nowYear;
    ongoing = true;
  } else {
    end = parseMonthYear(endStr);
  }

  return { start, end, ongoing, raw: duration };
}

/** Format a decimal year as "Mon YYYY". */
function formatDecimalYear(y: number): string {
  const year = Math.floor(y);
  const mi = Math.round((y - year) * 12);
  const monthIdx = mi >= 12 ? 11 : mi < 0 ? 0 : mi;
  return `${MONTHS[monthIdx]} ${year}`;
}

type ProjectDurationChartProps = {
  /** Slug of the project currently being viewed (highlighted). */
  currentSlug: string;
};

/**
 * Gantt-style horizontal timeline showing all 8 projects' engagement
 * durations relative to one another. The current project is highlighted
 * with an emerald bar; ongoing projects get a pulsing gradient cap.
 *
 * Renders a shared time axis (earliest start → latest end) with month/year
 * ticks, and one row per project sorted by start date.
 */
export function ProjectDurationChart({ currentSlug }: ProjectDurationChartProps) {
  const { rows, minYear, maxYear, ticks, currentRow } = useMemo(() => {
    const parsed = projectsData
      .map((p: ProjectDetail) => ({
        project: p,
        range: parseDuration(p.duration, p.year),
      }))
      .filter((r) => r.range.start !== null && r.range.end !== null);

    if (!parsed.length) {
      return { rows: [], minYear: 0, maxYear: 0, ticks: [], currentRow: -1 };
    }

    const starts = parsed.map((p) => p.range.start as number);
    const ends = parsed.map((p) => p.range.end as number);
    const min = Math.min(...starts);
    const max = Math.max(...ends);
    // Pad by ~1 month on each side for breathing room.
    const span = Math.max(max - min, 1 / 12);
    const paddedMin = min - span * 0.04;
    const paddedMax = max + span * 0.04;

    // Sort by start date ascending (oldest first).
    const sorted = [...parsed].sort(
      (a, b) => (a.range.start as number) - (b.range.start as number)
    );

    // Build ~4-6 ticks across the span.
    const tickCount = Math.min(6, Math.max(3, Math.round(span * 12) + 1));
    const tickArr = Array.from({ length: tickCount }, (_, i) => {
      const t = paddedMin + (i * (paddedMax - paddedMin)) / (tickCount - 1);
      return t;
    });

    return {
      rows: sorted,
      minYear: paddedMin,
      maxYear: paddedMax,
      ticks: tickArr,
      currentRow: sorted.findIndex((r) => r.project.id === currentSlug),
    };
  }, [currentSlug]);

  if (!rows.length) return null;

  const span = maxYear - minYear || 1;
  const toPercent = (year: number) => ((year - minYear) / span) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl border border-outline-2 bg-surface-1/40 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-outline-1">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
            <CalendarRange className="w-4 h-4 text-emerald-500/80" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">
              Engagement timeline
            </h3>
            <p className="text-[11px] text-foreground/50 mt-0.5">
              {rows.length} projects · {formatDecimalYear(minYear)} — {formatDecimalYear(maxYear)}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-surface-2/60 border border-outline-1 text-[10px] font-mono uppercase tracking-wider text-foreground/55">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            This project
          </span>
          <span className="w-px h-3 bg-outline-2" />
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-foreground/40" />
            Other
          </span>
          <span className="w-px h-3 bg-outline-2" />
          <span className="flex items-center gap-1.5">
            <InfinityIcon className="w-3 h-3 text-amber-500/80" />
            Ongoing
          </span>
        </div>
      </div>

      {/* Chart body */}
      <div className="px-3 sm:px-5 py-5">
        {/* Time axis (top) */}
        <div className="relative h-5 mb-3 ml-[108px] sm:ml-[140px]">
          {ticks.map((t, i) => (
            <div
              key={i}
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${toPercent(t)}%` }}
            >
              <span className="text-[9px] font-mono uppercase tracking-wider text-foreground/60 whitespace-nowrap">
                {formatDecimalYear(t)}
              </span>
              <span className="w-px h-2 bg-foreground/30 mt-0.5" />
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2.5">
          {rows.map((row, idx) => {
            const isCurrent = row.project.id === currentSlug;
            const startPct = toPercent(row.range.start as number);
            const endPct = toPercent(row.range.end as number);
            const widthPct = Math.max(endPct - startPct, 1.5); // min visible width
            const isOngoing = row.range.ongoing;

            return (
              <div
                key={row.project.id}
                className={`group relative flex items-center gap-2 rounded-lg transition-colors ${
                  isCurrent ? "bg-emerald-500/[0.05]" : "hover:bg-surface-2/40"
                }`}
              >
                {/* Label */}
                <div className="flex-shrink-0 w-[100px] sm:w-[132px] pl-2 pr-1 py-1.5 truncate">
                  <a
                    href={`/projects/${row.project.id}`}
                    className={`block text-[11px] sm:text-xs font-medium truncate transition-colors ${
                      isCurrent
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                    title={row.project.title}
                  >
                    {row.project.title.split(" — ")[0].split(" —")[0]}
                  </a>
                  <span className="block text-[9px] font-mono uppercase tracking-wider text-foreground/35 mt-0.5">
                    {row.project.tag}
                  </span>
                </div>

                {/* Bar track */}
                <div className="relative flex-1 h-7">
                  {/* Dashed vertical gridlines aligned with axis ticks */}
                  {ticks.map((t, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-l border-dashed border-outline-1"
                      style={{ left: `${toPercent(t)}%` }}
                    />
                  ))}

                  {/* The bar */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    whileInView={{ width: `${widthPct}%`, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1 + idx * 0.06,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    style={{ left: `${startPct}%` }}
                    className={`absolute top-1/2 -translate-y-1/2 h-[18px] rounded-md flex items-center overflow-hidden transition-shadow ${
                      isCurrent
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_2px_8px_rgba(16,185,129,0.35),0_0_0_1px_rgba(16,185,129,0.3)]"
                        : "bg-gradient-to-r from-foreground/40 to-foreground/28 group-hover:from-foreground/55 group-hover:to-foreground/40 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
                    }`}
                  >
                    {/* Ongoing striped cap + shimmering infinity */}
                    {isOngoing && (
                      <span
                        className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(135deg, rgba(251,191,36,0.35) 0, rgba(251,191,36,0.35) 2px, transparent 2px, transparent 5px)",
                        }}
                      >
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                          className="text-[9px] flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-400/30 backdrop-blur-sm"
                        >
                          <InfinityIcon className="w-2 h-2 text-amber-100" />
                        </motion.span>
                      </span>
                    )}
                    {/* Current project flag */}
                    {isCurrent && (
                      <span className="absolute left-1 top-1/2 -translate-y-1/2">
                        <Flag className="w-2.5 h-2.5 text-white/90" />
                      </span>
                    )}
                  </motion.div>

                  {/* Duration tooltip on hover */}
                  <div className="absolute -top-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" style={{ left: `calc(${startPct + widthPct / 2}% )`, transform: "translateX(-50%)" }}>
                    <span className="block whitespace-nowrap text-[9px] font-mono uppercase tracking-wider text-foreground/70 bg-background/95 backdrop-blur px-2 py-0.5 rounded border border-outline-2 shadow-sm">
                      {row.range.raw}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer legend (mobile) */}
        <div className="flex sm:hidden items-center gap-3 mt-4 ml-2 px-3 py-1.5 rounded-full bg-surface-2/60 border border-outline-1 text-[9px] font-mono uppercase tracking-wider text-foreground/55 w-fit">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-emerald-500" />
            This project
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-foreground/40" />
            Other
          </span>
          <span className="flex items-center gap-1.5">
            <InfinityIcon className="w-2.5 h-2.5 text-amber-500/80" />
            Ongoing
          </span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
    </motion.section>
  );
}
