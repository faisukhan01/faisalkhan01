"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Layers,
  LayoutGrid,
  List,
  Code2,
  Brain,
  Zap,
  Search,
  X,
  SlidersHorizontal,
  ArrowDownAZ,
  Calendar,
  Sparkles,
  RotateCcw,
  Check,
  GitCompare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { projectsData, type ProjectDetail } from "@/lib/portfolio-data";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";
import { ReadingProgress } from "@/components/portfolio/ReadingProgress";
import { CompareModal } from "@/components/portfolio/CompareModal";
import { TechStackChart } from "@/components/portfolio/TechStackChart";
import { BackToHomePill } from "@/components/portfolio/BackToHomePill";

type ViewMode = "grid" | "list";
type SortKey = "featured" | "newest" | "oldest" | "az";

const tagColors: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    glow: string;
    icon: typeof Code2;
  }
> = {
  "Full-Stack": {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-400/20",
    dot: "bg-blue-400",
    glow: "shadow-[0_0_12px_rgba(59,130,246,0.15)]",
    icon: Code2,
  },
  AI: {
    bg: "bg-purple-500/15",
    text: "text-purple-300",
    border: "border-purple-400/20",
    dot: "bg-purple-400",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.15)]",
    icon: Brain,
  },
  Automation: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    icon: Zap,
  },
};

const sortOptions: { key: SortKey; label: string; icon: typeof SlidersHorizontal }[] = [
  { key: "featured", label: "Featured first", icon: Sparkles },
  { key: "newest", label: "Newest", icon: Calendar },
  { key: "oldest", label: "Oldest", icon: Calendar },
  { key: "az", label: "A → Z", icon: ArrowDownAZ },
];

export default function AllProjectsPage() {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [activeTech, setActiveTech] = useState<string | undefined>(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allTags = useMemo(
    () => Array.from(new Set(projectsData.map((p) => p.tag))),
    []
  );

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projectsData.forEach((p) => {
      counts[p.tag] = (counts[p.tag] || 0) + 1;
    });
    return counts;
  }, []);

  const uniqueTechCount = useMemo(() => {
    const techs = new Set<string>();
    projectsData.forEach((p) => p.techStack.forEach((t) => techs.add(t)));
    return techs.size;
  }, []);

  const techStats = useMemo(() => {
    const counts: Record<string, number> = {};
    projectsData.forEach((p) => {
      p.techStack.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, []);

  // Combined filter: tag + search query
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let result = projectsData;

    if (activeTag !== null) {
      result = result.filter((p) => p.tag === activeTag);
    }

    if (q.length > 0) {
      result = result.filter((p) => {
        const haystack = [
          p.title,
          p.description,
          p.overview,
          p.tag,
          p.client,
          p.role,
          ...p.techStack,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    // Sort
    const sorted = [...result];
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => Number(b.year) - Number(a.year));
        break;
      case "oldest":
        sorted.sort((a, b) => Number(a.year) - Number(b.year));
        break;
      case "az":
        sorted.sort((a, b) =>
          a.title.localeCompare(b.title, "en", { sensitivity: "base" })
        );
        break;
      case "featured":
      default:
        sorted.sort((a, b) => {
          const fa = a.featured ? 1 : 0;
          const fb = b.featured ? 1 : 0;
          if (fa !== fb) return fb - fa;
          // Within same featured-group, keep data order
          return 0;
        });
        break;
    }
    return sorted;
  }, [activeTag, searchQuery, sortBy]);

  const handleTagChange = (tag: string) => {
    setActiveTag(activeTag === tag ? null : tag);
    setFocusedIndex(0);
  };

  const hasActiveFilters = activeTag !== null || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setActiveTag(null);
    setSearchQuery("");
    setSortBy("featured");
    setFocusedIndex(0);
    setCompareIds(new Set());
    setActiveTech(undefined);
  };

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  };

  const compareProjects = useMemo(
    () => projectsData.filter((p) => compareIds.has(p.id)),
    [compareIds]
  );

  // Keyboard navigation: arrow keys + Enter (disabled when search is focused)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("contenteditable") === "true";
      if (isTyping) return;

      const count = filteredProjects.length;
      if (count === 0) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % count);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + count) % count);
      } else if (e.key === "Enter" && filteredProjects[focusedIndex]) {
        e.preventDefault();
        router.push(`/projects/${filteredProjects[focusedIndex].id}`);
      } else if (e.key === "/" && !isTyping) {
        e.preventDefault();
        document.getElementById("projects-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [filteredProjects, focusedIndex, router]);

  const currentSort = sortOptions.find((o) => o.key === sortBy) ?? sortOptions[0];
  const CurrentSortIcon = currentSort.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Reading progress bar */}
      <ReadingProgress />

      {/* Sticky back-to-home pill (appears after scroll) */}
      <BackToHomePill />

      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
      >
        <div className="max-w-[1440px] mx-auto w-full px-3.5 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-28 h-14 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to portfolio</span>
            <span className="sm:hidden">Back</span>
          </button>
          <span className="text-xs font-mono text-foreground/50 uppercase tracking-wider">
            All Projects
          </span>
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-14 max-w-[1440px] mx-auto w-full px-3.5 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-28 py-8 sm:py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10"
        >
          <p className="font-mono text-[10px] sm:text-xs text-foreground/60 mb-2 tracking-wider">
            / Projects
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-foreground font-medium text-2xl sm:text-3xl md:text-4xl mb-2">
                All <span className="text-foreground/70">projects</span>
              </h1>
              <p className="text-foreground/55 text-sm sm:text-base max-w-xl">
                A collection of full-stack applications, AI-powered platforms,
                and automation systems I&apos;ve designed and built.
              </p>
            </div>
            {/* Project count badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-2 bg-surface-2/50 backdrop-blur-sm"
            >
              <Layers className="w-4 h-4 text-foreground/55" />
              <span className="text-sm font-mono text-foreground/65">
                Showing{" "}
                <span className="text-foreground font-semibold">
                  {filteredProjects.length}
                </span>{" "}
                of {projectsData.length}
              </span>
              {activeTag && (
                <span className="ml-1 text-[10px] font-mono text-emerald-500/80 uppercase tracking-wider">
                  · {activeTag}
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10"
        >
          {allTags.map((tag) => {
            const colors = tagColors[tag];
            const Icon = colors?.icon || Code2;
            return (
              <motion.button
                key={tag}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTagChange(tag)}
                className={`relative overflow-hidden rounded-xl border p-3 sm:p-4 transition-all duration-300 text-left ${
                  activeTag === tag
                    ? `${colors.bg} ${colors.border} ${colors.glow}`
                    : "border-outline-2 bg-surface-2/30 hover:bg-surface-2/60 hover:border-outline-3 hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon
                    className={`w-4 h-4 ${
                      activeTag === tag ? colors.text : "text-foreground/55"
                    }`}
                  />
                  <span
                    className={`text-xs font-mono uppercase tracking-wider ${
                      activeTag === tag ? colors.text : "text-foreground/55"
                    }`}
                  >
                    {tag}
                  </span>
                </div>
                <p
                  className={`text-lg sm:text-xl font-bold ${
                    activeTag === tag
                      ? "text-foreground"
                      : "text-foreground/80"
                  }`}
                >
                  {tagCounts[tag] || 0}
                </p>
                <p className="text-[10px] text-foreground/55 font-mono font-medium tracking-wider uppercase">
                  projects
                </p>
                {/* Active indicator */}
                {activeTag === tag && (
                  <motion.div
                    layoutId="activeTagIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Tech Stack Overview + Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="mb-8 sm:mb-10 grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5"
        >
          {/* Tech pills — clickable to filter */}
          <div className="lg:col-span-3 p-4 sm:p-5 rounded-xl border border-outline-2 bg-surface-2/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-foreground/55 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" />
                Most used technologies
              </h3>
              <span className="text-[10px] font-mono text-foreground/45">
                {uniqueTechCount} unique tools
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {techStats.map(([tech, count], i) => {
                const isActive = activeTech === tech;
                return (
                  <motion.button
                    key={tech}
                    onClick={() => {
                      setActiveTech(isActive ? undefined : tech);
                      setSearchQuery(isActive ? "" : tech);
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.03 }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all duration-300 group/tech ${
                      isActive
                        ? "bg-emerald-500/15 border-emerald-400/40 text-foreground"
                        : "border-outline-2 bg-surface-2/40 hover:bg-surface-3/60 hover:border-emerald-400/30 hover:-translate-y-0.5"
                    }`}
                    title={`Filter by ${tech}`}
                    aria-pressed={isActive}
                  >
                    <span className="text-xs font-medium text-foreground/75 group-hover/tech:text-foreground transition-colors">
                      {tech}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors ${isActive ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300" : "text-foreground/45 bg-foreground/5 group-hover/tech:text-emerald-500/80"}`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <p className="mt-3 pt-3 border-t border-outline-1 text-[10px] font-mono text-foreground/40">
              Click any pill to filter projects by that technology
            </p>
          </div>

          {/* Tech stack distribution chart */}
          <div className="lg:col-span-2">
            <TechStackChart
              projects={projectsData}
              activeTech={activeTech}
              onSelectTech={(t) => {
                const isCurrentlyActive = activeTech === t;
                setActiveTech(isCurrentlyActive ? undefined : t);
                setSearchQuery(isCurrentlyActive ? "" : t);
              }}
            />
          </div>
        </motion.div>

        {/* Search + Sort + Filter + View Toggle Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Search input */}
            <div className="relative flex-1 sm:flex-none sm:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40 group-focus-within:text-foreground/70 transition-colors pointer-events-none" />
              <input
                id="projects-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFocusedIndex(0);
                }}
                placeholder="Search projects, tech…"
                aria-label="Search projects"
                className="w-full sm:w-64 pl-9 pr-9 py-2 rounded-lg border border-outline-2 bg-surface-2/40 backdrop-blur-sm text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-emerald-400/40 focus:bg-surface-2/70 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-surface-3 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <kbd className="hidden sm:flex absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-outline-2 bg-surface-2/50 text-[9px] font-mono text-foreground/45 pointer-events-none items-center gap-0.5">
                /
              </kbd>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((v) => !v)}
                onBlur={() => setTimeout(() => setSortOpen(false), 150)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-2 bg-surface-2/40 hover:bg-surface-2/70 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Sort projects"
                aria-haspopup="menu"
                aria-expanded={sortOpen}
              >
                <CurrentSortIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentSort.label}</span>
                <span className="sm:hidden">Sort</span>
                <SlidersHorizontal className="w-3 h-3 opacity-60" />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    role="menu"
                    className="absolute top-full left-0 mt-1.5 w-44 rounded-xl border border-outline-2 bg-background/95 backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.55)] overflow-hidden z-30 p-1"
                  >
                    {sortOptions.map((opt) => {
                      const OptIcon = opt.icon;
                      const isActive = sortBy === opt.key;
                      return (
                        <button
                          key={opt.key}
                          role="menuitem"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSortBy(opt.key);
                            setSortOpen(false);
                            setFocusedIndex(0);
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                              : "text-foreground/70 hover:bg-surface-3 hover:text-foreground"
                          }`}
                        >
                          <OptIcon className="w-3.5 h-3.5" />
                          {opt.label}
                          {isActive && (
                            <span className="ml-auto text-[10px] font-mono opacity-70">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reset filters button — only shown when active */}
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-2 bg-surface-2/40 hover:bg-surface-2/70 text-xs font-medium text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </motion.button>
            )}

            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTag(null);
                  setFocusedIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all duration-200 border ${
                  activeTag === null
                    ? "bg-foreground/10 text-foreground border-foreground/15"
                    : "bg-surface-2 text-foreground/55 hover:text-foreground/80 border-transparent"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => {
                const colors = tagColors[tag] || {
                  bg: "bg-surface-2",
                  text: "text-foreground/55",
                  border: "border-outline-2",
                  dot: "bg-foreground/30",
                  glow: "",
                };
                const isActive = activeTag === tag;
                return (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTagChange(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1.5 border ${
                      isActive
                        ? `${colors.bg} ${colors.text} ${colors.border} ${colors.glow}`
                        : "bg-surface-2 text-foreground/55 hover:text-foreground/80 border-transparent"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isActive ? colors.dot : "bg-foreground/20"
                      }`}
                    />
                    {tag}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* View mode toggle + keyboard hint */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-foreground/45 hidden md:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-outline-2 bg-surface-2/50 text-foreground/60">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-outline-2 bg-surface-2/50 text-foreground/60">
                →
              </kbd>
              <span className="ml-1">navigate</span>
              <kbd className="ml-2 px-1.5 py-0.5 rounded border border-outline-2 bg-surface-2/50 text-foreground/60">
                ↵
              </kbd>
              <span className="ml-1">open</span>
            </span>
            <div className="flex items-center border border-outline-2 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-surface-3 text-foreground"
                    : "text-foreground/45 hover:text-foreground/75"
                }`}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-surface-3 text-foreground"
                    : "text-foreground/45 hover:text-foreground/75"
                }`}
                aria-label="List view"
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid/List with AnimatePresence */}
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            viewMode === "grid" ? (
              <motion.div
                key={`grid-${activeTag || "all"}-${searchQuery}-${sortBy}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
              >
                {filteredProjects.map((project, index) => (
                  <ProjectGridCard
                    key={project.id}
                    project={project}
                    index={index}
                    isFocused={focusedIndex === index}
                    isCompareSelected={compareIds.has(project.id)}
                    onToggleCompare={() => toggleCompare(project.id)}
                    onClick={() => router.push(`/projects/${project.id}`)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-${activeTag || "all"}-${searchQuery}-${sortBy}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-3 sm:gap-4"
              >
                {filteredProjects.map((project, index) => (
                  <ProjectListCard
                    key={project.id}
                    project={project}
                    index={index}
                    isFocused={focusedIndex === index}
                    isCompareSelected={compareIds.has(project.id)}
                    onToggleCompare={() => toggleCompare(project.id)}
                    onClick={() => router.push(`/projects/${project.id}`)}
                  />
                ))}
              </motion.div>
            )
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center text-center py-16 sm:py-24"
            >
              <div className="w-16 h-16 rounded-full bg-surface-2/60 border border-outline-2 flex items-center justify-center mb-5">
                <Search className="w-7 h-7 text-foreground/40" />
              </div>
              <h3 className="text-foreground font-medium text-lg sm:text-xl mb-2">
                No projects match your filters
              </h3>
              <p className="text-foreground/55 text-sm max-w-md mb-6">
                {searchQuery
                  ? `Nothing matched "${searchQuery}"`
                  : "Try a different category or search term."}
                {activeTag && (
                  <>
                    {" "}
                    under{" "}
                    <span className="text-foreground font-mono text-xs">
                      {activeTag}
                    </span>
                    .
                  </>
                )}
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center py-10 sm:py-14"
        >
          <button
            onClick={() => router.push("/")}
            className="text-foreground/55 hover:text-foreground/80 transition-colors text-sm flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to portfolio
          </button>
        </motion.div>
      </div>

      {/* Floating Compare Bar — shown when 2+ projects selected */}
      <AnimatePresence>
        {compareIds.size >= 2 && !compareOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-background/95 backdrop-blur-xl border border-outline-2 shadow-[0_8px_28px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.55)]"
          >
            <GitCompare className="w-4 h-4 text-emerald-500/80" />
            <span className="text-sm font-medium text-foreground">
              {compareIds.size} projects selected
            </span>
            <button
              onClick={() => setCompareOpen(true)}
              className="ml-1 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Compare
            </button>
            <button
              onClick={() => setCompareIds(new Set())}
              className="px-3 py-1.5 rounded-full border border-outline-2 text-foreground/60 text-xs font-medium hover:bg-surface-3 transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Modal */}
      <CompareModal
        projects={compareProjects}
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
      />
    </div>
  );
}

/* ============ Grid Card ============ */
function ProjectGridCard({
  project,
  index,
  isFocused,
  isCompareSelected,
  onToggleCompare,
  onClick,
}: {
  project: ProjectDetail;
  index: number;
  isFocused?: boolean;
  isCompareSelected?: boolean;
  onToggleCompare?: () => void;
  onClick: () => void;
}) {
  const colors =
    tagColors[project.tag] || {
      bg: "bg-surface-2",
      text: "text-foreground/55",
      border: "border-outline-2",
      dot: "bg-foreground/30",
      glow: "",
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      className={`group cursor-pointer transition-transform duration-200 ${
        isFocused ? "scale-[1.03]" : "scale-100"
      }`}
    >
      <div
        className={`relative aspect-[4/3] overflow-hidden rounded-[14px] sm:rounded-[18px] shadow-[0_6px_24px_rgba(0,0,0,0.10)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.35)] border ${
          isFocused
            ? "border-emerald-400/40 ring-2 ring-emerald-400/20"
            : "border-white/[0.08] dark:border-white/[0.06]"
        }`}
      >
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-transparent" />
        <div className="absolute inset-0 rounded-[14px] sm:rounded-[18px] border border-emerald-400/0 group-hover:border-emerald-400/15 transition-all duration-500" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out" />
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-white/80 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
            {project.year}
          </span>
          {project.featured && (
            <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/25 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-400/25">
              ★
            </span>
          )}
          {/* Compare checkbox */}
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare();
              }}
              aria-label={isCompareSelected ? "Remove from comparison" : "Add to comparison"}
              className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${
                isCompareSelected
                  ? "bg-emerald-500/30 border-emerald-400/50 text-emerald-300"
                  : "bg-black/40 border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              <Check className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span
            className={`text-[9px] font-mono uppercase tracking-wider ${colors.text} ${colors.bg} backdrop-blur-md px-2 py-0.5 rounded-full border ${colors.border}`}
          >
            {project.tag}
          </span>
        </div>
        <div className="absolute inset-0 p-3.5 sm:p-4 flex flex-col justify-end">
          <h3 className="text-xs sm:text-sm font-semibold text-white mb-1.5 leading-snug line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] group-hover:text-emerald-100 transition-colors duration-300">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-1 mb-2.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[8px] font-mono text-white/55 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/[0.06]"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-white/90 group-hover:text-emerald-300 transition-colors duration-300">
              View project
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
            <div className="w-7 h-7 rounded-full bg-white/[0.06] backdrop-blur-sm flex items-center justify-center border border-white/[0.08] group-hover:bg-emerald-500/15 group-hover:border-emerald-400/15 transition-all duration-300">
              <ArrowUpRight className="w-2.5 h-2.5 text-white/35 group-hover:text-emerald-300 transition-colors duration-300" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ============ List Card ============ */
function ProjectListCard({
  project,
  index,
  isFocused,
  isCompareSelected,
  onToggleCompare,
  onClick,
}: {
  project: ProjectDetail;
  index: number;
  isFocused?: boolean;
  isCompareSelected?: boolean;
  onToggleCompare?: () => void;
  onClick: () => void;
}) {
  const colors =
    tagColors[project.tag] || {
      bg: "bg-surface-2",
      text: "text-foreground/55",
      border: "border-outline-2",
      dot: "bg-foreground/30",
      glow: "",
    };
  const Icon = colors.icon || Code2;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className={`group cursor-pointer ${
        isFocused ? "scale-[1.01]" : "scale-100"
      }`}
    >
      <div
        className={`flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-xl border transition-all duration-300 ${
          isFocused
            ? "border-emerald-400/30 bg-surface-2/50 ring-1 ring-emerald-400/15"
            : "border-outline-2 bg-surface-2/20 hover:bg-surface-2/40 hover:border-outline-3"
        }`}
      >
        {/* Thumbnail */}
        <div className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${colors.text}`} />
            <h3 className="text-sm sm:text-base font-medium text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors duration-200">
              {project.title}
            </h3>
          </div>
          <p className="text-xs text-foreground/55 line-clamp-1 hidden sm:block">
            {project.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span
            className={`text-[9px] font-mono uppercase tracking-wider ${colors.text} ${colors.bg} px-2 py-0.5 rounded-full border ${colors.border} hidden sm:block`}
          >
            {project.tag}
          </span>
          <span className="text-[10px] font-mono text-foreground/45 hidden md:block">
            {project.year}
          </span>
          {project.featured && (
            <span className="text-[9px] text-emerald-400/85">★</span>
          )}
          <ArrowUpRight className="w-3.5 h-3.5 text-foreground/30 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </div>
      </div>
    </motion.div>
  );
}
