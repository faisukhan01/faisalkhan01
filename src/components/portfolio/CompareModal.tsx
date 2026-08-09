"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus, ArrowUpRight, Layers, Brain, Zap } from "lucide-react";
import type { ProjectDetail } from "@/lib/portfolio-data";

type CompareModalProps = {
  projects: ProjectDetail[];
  open: boolean;
  onClose: () => void;
};

const tagColors: Record<string, string> = {
  "Full-Stack": "text-blue-400",
  AI: "text-purple-400",
  Automation: "text-amber-400",
};

const tagIcons: Record<string, typeof Layers> = {
  "Full-Stack": Layers,
  AI: Brain,
  Automation: Zap,
};

/**
 * Side-by-side project comparison modal.
 *
 * Shows 2–3 projects in parallel columns with aligned rows for:
 *  - Category / Year / Client
 *  - Overview (truncated)
 *  - Challenge (truncated)
 *  - Solution (truncated)
 *  - Tech stack (pills)
 *  - Results (key→value pairs)
 *
 * Highlights differences: tech that only one project has gets a colored
 * accent, shared tech gets a neutral style.
 */
export function CompareModal({ projects, open, onClose }: CompareModalProps) {
  if (projects.length < 2) return null;

  // Compute shared vs unique tech across all projects
  const allTechSets = projects.map((p) => new Set(p.techStack));
  const sharedTech = projects[0].techStack.filter((t) =>
    allTechSets.every((s) => s.has(t))
  );
  const uniqueTech = projects.map((p) =>
    p.techStack.filter((t) => !sharedTech.includes(t))
  );

  const maxRows = Math.max(
    ...projects.map((p) => p.results.length),
    1
  );
  const paddedResults = projects.map((p) => {
    const r = [...p.results];
    while (r.length < maxRows) r.push({ label: "", value: "" });
    return r;
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Compare projects"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl my-8 rounded-2xl border border-white/[0.12] dark:border-white/[0.08] bg-background/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-1">
              <div>
                <h2 className="text-foreground font-semibold text-lg sm:text-xl">
                  Project Comparison
                </h2>
                <p className="text-foreground/55 text-xs font-mono mt-0.5">
                  {projects.length} projects · side by side
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close comparison"
                className="w-9 h-9 rounded-full border border-outline-2 bg-surface-2/40 hover:bg-surface-3/60 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comparison table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-1">
                    <th className="text-left px-4 sm:px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-foreground/45 w-28 sm:w-36">
                      Attribute
                    </th>
                    {projects.map((p) => (
                      <th
                        key={p.id}
                        className="text-left px-4 sm:px-6 py-3 min-w-[200px]"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="relative w-10 h-7 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={p.image}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                          </div>
                          <span className="text-foreground font-semibold text-xs sm:text-sm truncate">
                            {p.title.split("—")[0].trim()}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Category */}
                  <Row label="Category">
                    {projects.map((p) => {
                      const Icon = tagIcons[p.tag] ?? Layers;
                      return (
                        <td key={p.id} className="px-4 sm:px-6 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider ${tagColors[p.tag] ?? "text-foreground/70"}`}
                          >
                            <Icon className="w-3 h-3" />
                            {p.tag}
                          </span>
                        </td>
                      );
                    })}
                  </Row>

                  {/* Year */}
                  <Row label="Year">
                    {projects.map((p) => (
                      <td key={p.id} className="px-4 sm:px-6 py-2.5 text-foreground/80 font-mono text-xs">
                        {p.year}
                      </td>
                    ))}
                  </Row>

                  {/* Client */}
                  <Row label="Client">
                    {projects.map((p) => (
                      <td key={p.id} className="px-4 sm:px-6 py-2.5 text-foreground/80 text-xs">
                        {p.client}
                      </td>
                    ))}
                  </Row>

                  {/* Role */}
                  <Row label="Role">
                    {projects.map((p) => (
                      <td key={p.id} className="px-4 sm:px-6 py-2.5 text-foreground/80 text-xs">
                        {p.role}
                      </td>
                    ))}
                  </Row>

                  {/* Overview */}
                  <Row label="Overview">
                    {projects.map((p) => (
                      <td key={p.id} className="px-4 sm:px-6 py-2.5 text-foreground/65 text-xs leading-relaxed">
                        {p.overview.length > 140
                          ? p.overview.slice(0, 137) + "…"
                          : p.overview}
                      </td>
                    ))}
                  </Row>

                  {/* Tech Stack */}
                  <Row label="Tech stack">
                    {projects.map((p, i) => (
                      <td key={p.id} className="px-4 sm:px-6 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {sharedTech.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-600 dark:text-emerald-300"
                            >
                              {t}
                            </span>
                          ))}
                          {uniqueTech[i]?.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-2 border border-outline-2 text-foreground/60"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </Row>

                  {/* Results */}
                  <Row label="Results">
                    {projects.map((p, i) => (
                      <td key={p.id} className="px-4 sm:px-6 py-2.5">
                        <div className="space-y-1.5">
                          {paddedResults[i].map((r, ri) =>
                            r.label ? (
                              <div key={ri} className="flex items-baseline gap-2">
                                <span className="text-foreground font-bold text-xs">
                                  {r.value}
                                </span>
                                <span className="text-foreground/50 text-[10px] font-mono uppercase tracking-wider">
                                  {r.label}
                                </span>
                              </div>
                            ) : (
                              <div key={ri} className="h-4" />
                            )
                          )}
                        </div>
                      </td>
                    ))}
                  </Row>

                  {/* Actions */}
                  <Row label="Links">
                    {projects.map((p) => (
                      <td key={p.id} className="px-4 sm:px-6 py-2.5">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/projects/${p.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            View case study
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                    ))}
                  </Row>
                </tbody>
              </table>
            </div>

            {/* Shared tech legend */}
            {sharedTech.length > 0 && (
              <div className="px-6 py-3 border-t border-outline-1 flex items-center gap-2 text-[10px] font-mono text-foreground/45">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500/30 border border-emerald-400/30" />
                Shared tech across all selected projects
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============ Table Row helper ============ */
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-b border-outline-1 last:border-b-0 hover:bg-surface-2/20 transition-colors">
      <td className="px-4 sm:px-6 py-2.5 text-[10px] font-mono uppercase tracking-widest text-foreground/50 align-top whitespace-nowrap">
        {label}
      </td>
      {children}
    </tr>
  );
}
