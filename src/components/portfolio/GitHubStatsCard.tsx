"use client";

import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  GitPullRequest,
  Users,
  BookMarked,
  Calendar,
  ArrowRight,
} from "lucide-react";

type Stat = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

const stats: Stat[] = [
  { label: "Stars earned", value: "248", icon: Star },
  { label: "Public repos", value: "47", icon: BookMarked },
  { label: "Contributions merged", value: "12", icon: Calendar },
  { label: "Followers", value: "1.2k", icon: Users },
  { label: "PRs reviewed", value: "89", icon: GitPullRequest },
  { label: "Repositories forked", value: "6", icon: GitFork },
];

type PinnedRepo = {
  name: string;
  stars: number;
  language: string;
  color: string;
};

const pinnedRepos: PinnedRepo[] = [
  { name: "astrolite-ui", stars: 124, language: "TypeScript", color: "#3178c6" },
  { name: "edge-fwd", stars: 67, language: "Go", color: "#00ADD8" },
  { name: "tokio-bench", stars: 45, language: "Rust", color: "#dea584" },
];

export function GitHubStatsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-[22px] border border-outline-2 bg-card p-6 shadow-[var(--card-shadow)] overflow-hidden relative group hover:border-outline-3 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-3 border border-outline-3 flex items-center justify-center group-hover:bg-surface-4 transition-colors">
            <Github className="w-4 h-4 text-foreground/80" />
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">Open source</p>
            <p className="text-foreground/65 text-xs font-mono">GitHub stats</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/55" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/65">
            @faisalkhan
          </span>
        </div>
      </div>

      {/* 2x3 stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
              className="relative rounded-xl border border-outline-2 bg-surface-2 p-3.5 hover:border-outline-3 hover:bg-surface-3 transition-colors"
            >
              {/* Icon top-right */}
              <Icon className="absolute top-3 right-3 w-3.5 h-3.5 text-foreground/50" />

              {/* Label */}
              <p className="text-[9px] font-mono uppercase tracking-widest text-foreground/65 mb-1.5 pr-5">
                {stat.label}
              </p>

              {/* Value */}
              <p className="text-foreground text-2xl font-bold tabular-nums tracking-tight">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Pinned repos */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/55">
            Pinned repos
          </p>
          <BookMarked className="w-3 h-3 text-foreground/45" />
        </div>
        <div className="flex flex-col gap-1">
          {pinnedRepos.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + 0.05 * i }}
              className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 hover:bg-surface-2 transition-colors group/repo"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: repo.color }}
                  aria-hidden="true"
                />
                <span className="text-foreground/85 text-sm font-medium truncate group-hover/repo:text-foreground transition-colors">
                  {repo.name}
                </span>
                <span className="text-[10px] font-mono text-foreground/45 shrink-0 hidden sm:inline">
                  {repo.language}
                </span>
              </div>
              <div className="flex items-center gap-1 text-foreground/65 shrink-0">
                <Star className="w-3 h-3 fill-current text-foreground/55" />
                <span className="text-xs font-mono tabular-nums">{repo.stars}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="flex justify-end">
        <a
          href="https://github.com/faisalkhan"
          target="_blank"
          rel="noopener noreferrer"
          className="animated-underline inline-flex items-center gap-1.5 text-xs font-mono text-foreground/70 hover:text-foreground transition-colors"
        >
          View GitHub profile
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Corner glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-foreground/[0.03] blur-3xl pointer-events-none" />
    </motion.div>
  );
}
