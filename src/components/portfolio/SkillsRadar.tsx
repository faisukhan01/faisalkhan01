"use client";

import { motion } from "framer-motion";
import { Radar, Monitor, Server, Database, Boxes, Brain, ShieldCheck } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

type Skill = {
  name: string;
  value: number;
  icon: typeof Monitor;
};

const iconMap: Record<string, typeof Monitor> = {
  Monitor,
  Server,
  Database,
  Boxes,
  Brain,
  ShieldCheck,
  Frontend: Monitor,
  Backend: Server,
  AI: Brain,
  Database: Database,
  "3D / UI": Boxes,
  Practices: ShieldCheck,
};

const CENTER = 200;
const RADIUS = 130;
const GRID_LEVELS = [20, 40, 60, 80, 100];

/** Compute a vertex on the radar for axis `i` (0..5) at level percentage `levelPct`. */
function vertex(i: number, levelPct: number) {
  const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
  const r = (levelPct / 100) * RADIUS;
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
}

/** Build an SVG polygon `points` string for a hex grid ring at `levelPct`. */
function ringPoints(levelPct: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const { x, y } = vertex(i, levelPct);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

/** Build the data polygon `points` string from current skill values. */
function dataPointsString(skills: Skill[]) {
  return skills
    .map((s, i) => {
      const { x, y } = vertex(i, s.value);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function SkillsRadar() {
  const { data } = usePortfolioData();

  const skills: Skill[] = data.skillsRadar.length > 0
    ? data.skillsRadar.slice(0, 6).map((s) => ({
        name: s.skill,
        value: s.value,
        icon: iconMap[s.skill] || Monitor,
      }))
    : [
        { name: "Frontend", value: 90, icon: Monitor },
        { name: "Backend", value: 85, icon: Server },
        { name: "AI", value: 80, icon: Brain },
        { name: "Database", value: 75, icon: Database },
        { name: "3D / UI", value: 78, icon: Boxes },
        { name: "Practices", value: 82, icon: ShieldCheck },
      ];

  const dataPoints = skills.map((s, i) => vertex(i, s.value));
  // Place axis labels slightly beyond the outer ring (118% radius)
  const labelPositions = skills.map((_, i) => vertex(i, 118));

  return (
    <section id="skills-radar" className="py-16 md:py-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
      >
        <div>
          <p className="section-breadcrumb font-mono text-xs text-foreground/55 mb-3 tracking-wider">
            / Skill matrix
          </p>
          <h2 className="section-title text-foreground font-semibold text-2xl md:text-3xl">
            Where I <span className="text-foreground/55">excel</span>
          </h2>
          <p className="text-sm text-foreground/70 leading-relaxed mt-4 max-w-md">
            A radar view of my technical proficiency across key disciplines, calibrated by recent project work.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-surface-3 border border-outline-3 flex items-center justify-center">
            <Radar className="w-4 h-4 text-foreground/70" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[22px] border border-outline-2 bg-card p-6 md:p-8 shadow-[var(--card-shadow)] overflow-hidden relative group hover:border-outline-3 transition-colors"
        >
          {/* Corner glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-foreground/[0.03] blur-3xl pointer-events-none" />

          <div className="relative">
            <svg viewBox="-30 -20 460 440" className="w-full h-auto max-w-md mx-auto" role="img" aria-label="Skill proficiency radar chart">
              {/* Concentric hex grid rings (20, 40, 60, 80, 100) */}
              {GRID_LEVELS.map((lvl) => (
                <polygon
                  key={lvl}
                  points={ringPoints(lvl)}
                  fill="none"
                  className="stroke-foreground/10"
                  strokeWidth={1}
                />
              ))}

              {/* Axis lines from center to each outer vertex */}
              {skills.map((_, i) => {
                const { x, y } = vertex(i, 100);
                return (
                  <line
                    key={`axis-${i}`}
                    x1={CENTER}
                    y1={CENTER}
                    x2={x}
                    y2={y}
                    className="stroke-foreground/15"
                    strokeWidth={1}
                  />
                );
              })}

              {/* Axis labels positioned outside each vertex */}
              {skills.map((s, i) => {
                const { x, y } = labelPositions[i];
                const anchor =
                  Math.abs(x - CENTER) < 4 ? "middle" : x > CENTER ? "start" : "end";
                return (
                  <text
                    key={`label-${s.name}`}
                    x={x}
                    y={y}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    className="fill-foreground/75 font-mono uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.06em" }}
                  >
                    {s.name}
                  </text>
                );
              })}

              {/* Data polygon */}
              <motion.polygon
                points={dataPointsString(skills)}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="fill-foreground/10 stroke-foreground/80"
                strokeWidth={1.5}
              />

              {/* Data points (small circles, staggered scale-in + hover) */}
              {dataPoints.map((pt, i) => (
                <motion.circle
                  key={`pt-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={4}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ scale: 1.6 }}
                  className="fill-foreground"
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <title>{`${skills[i].name}: ${skills[i].value}%`}</title>
                </motion.circle>
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Legend card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[22px] border border-outline-2 bg-card p-6 md:p-8 shadow-[var(--card-shadow)] overflow-hidden relative group hover:border-outline-3 transition-colors"
        >
          {/* Corner glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-foreground/[0.03] blur-3xl pointer-events-none" />

          <div className="relative space-y-5">
            {skills.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.name} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-surface-3 border border-outline-3 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-foreground/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-foreground text-sm font-medium">{s.name}</span>
                      <span className="text-foreground text-sm font-mono tabular-nums">
                        {s.value}%
                      </span>
                    </div>
                    <div className="bg-surface-3 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.1 * i, ease: "easeInOut" }}
                        className="h-full bg-foreground rounded-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
