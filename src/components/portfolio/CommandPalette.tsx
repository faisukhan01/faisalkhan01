"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Search,
  ArrowUpRight,
  FileText,
  Briefcase,
  Mail,
  Home,
  User,
  Code,
  CornerDownLeft,
} from "lucide-react";
import { useModalStore } from "@/lib/portfolio-data";
import { useProjects, useArticles } from "@/lib/portfolio-context";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  group: "Navigation" | "Projects" | "Articles" | "Actions";
  action: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { setProject, setArticle, setContact } = useModalStore();
  const projectsData = useProjects();
  const articlesData = useArticles();

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            // Reset state when opening
            setQuery("");
            setActiveIndex(0);
            // Focus input on next tick
            setTimeout(() => inputRef.current?.focus(), 50);
          }
          return !prev;
        });
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const commands = useMemo<CommandItem[]>(() => {
    const close = () => setOpen(false);
    return [
      {
        id: "nav-home",
        label: "Go to top",
        hint: "Home",
        icon: <Home className="w-4 h-4" />,
        group: "Navigation",
        action: () => {
          close();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
      {
        id: "nav-about",
        label: "About me",
        hint: "Section",
        icon: <User className="w-4 h-4" />,
        group: "Navigation",
        action: () => {
          close();
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "nav-projects",
        label: "Projects",
        hint: "Section",
        icon: <Code className="w-4 h-4" />,
        group: "Navigation",
        action: () => {
          close();
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "nav-articles",
        label: "Articles",
        hint: "Section",
        icon: <FileText className="w-4 h-4" />,
        group: "Navigation",
        action: () => {
          close();
          document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
        },
      },
      {
        id: "nav-contacts",
        label: "Contacts",
        hint: "Section",
        icon: <Mail className="w-4 h-4" />,
        group: "Navigation",
        action: () => {
          close();
          document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
        },
      },
      ...projectsData.map((p) => ({
        id: `proj-${p.id}`,
        label: p.title,
        hint: p.tag,
        icon: <Briefcase className="w-4 h-4" />,
        group: "Projects" as const,
        action: () => {
          close();
          setProject(p);
        },
      })),
      ...articlesData.map((a) => ({
        id: `art-${a.id}`,
        label: a.title,
        hint: a.tag,
        icon: <FileText className="w-4 h-4" />,
        group: "Articles" as const,
        action: () => {
          close();
          setArticle(a);
        },
      })),
      {
        id: "act-contact",
        label: "Open contact form",
        hint: "Action",
        icon: <Mail className="w-4 h-4" />,
        group: "Actions",
        action: () => {
          close();
          setContact(true);
        },
      },
      {
        id: "act-top",
        label: "Scroll back to top",
        hint: "Action",
        icon: <ArrowUpRight className="w-4 h-4" />,
        group: "Actions",
        action: () => {
          close();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      },
    ];
  }, [setProject, setArticle, setContact, projectsData, articlesData]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Group filtered results
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((c) => {
      const arr = map.get(c.group) || [];
      arr.push(c);
      map.set(c.group, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Reset active index when query changes (handled in onChange handler instead of effect)

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.action();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-xl rounded-2xl border border-outline-3 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-2">
              <Search className="w-4 h-4 text-foreground/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search sections, projects, articles..."
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-foreground/50"
              />
              <kbd className="text-[10px] font-mono text-foreground/40 border border-outline-3 rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
              {grouped.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-foreground/40">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
              {grouped.map(([group, items]) => (
                <div key={group} className="mb-1">
                  <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest text-foreground/30">
                    {group}
                  </div>
                  {items.map((item) => {
                    const idx = filtered.indexOf(item);
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        data-idx={idx}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={item.action}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive ? "bg-surface-3" : "hover:bg-surface-2"
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center border ${
                            isActive
                              ? "border-outline-4 bg-surface-4 text-foreground"
                              : "border-outline-2 text-foreground/50"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm text-foreground truncate">
                            {item.label}
                          </span>
                          {item.hint && (
                            <span className="block text-[11px] text-foreground/40 font-mono">
                              {item.hint}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <CornerDownLeft className="w-3.5 h-3.5 text-foreground/40" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-outline-2 text-[10px] font-mono text-foreground/40">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="border border-outline-3 rounded px-1 py-0.5">↑</kbd>
                  <kbd className="border border-outline-3 rounded px-1 py-0.5">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="border border-outline-3 rounded px-1 py-0.5">↵</kbd>
                  select
                </span>
              </div>
              <span>{filtered.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
