"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export type TocItem = {
  id: string;
  label: string;
  /** optional numeric prefix, e.g. "01" */
  index?: string;
};

type TableOfContentsProps = {
  items: TocItem[];
};

/**
 * Sticky table of contents for project detail pages.
 *
 * - Tracks scroll position via IntersectionObserver to highlight the
 *   currently-visible section.
 * - Smooth-scrolls to a section on click.
 * - Shows a per-section reading-progress fill (0–100%) next to the
 *   active item, so the user can see how far through the current
 *   section they are.
 * - Hidden on screens below `lg` (where the layout collapses to a single
 *   column).
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  // 0–1 progress through the active section.
  const [activeProgress, setActiveProgress] = useState(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that's currently visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when the section's top enters the middle band of the screen.
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  // Track per-section scroll progress for the active section.
  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const el = document.getElementById(activeId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight || 1;
          // Progress = how much of the section has passed the viewport top
          // anchor (at 30% from top). 0 when section just entered, 1 when
          // fully scrolled past.
          const anchor = vh * 0.3;
          const scrolled = anchor - rect.top;
          const total = rect.height + vh * 0.3;
          const p = Math.max(0, Math.min(1, scrolled / total));
          setActiveProgress(p);
        }
        tickingRef.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeId]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      // Offset by nav height (h-14 = 56px) plus a small breathing gap.
      const top = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: "smooth" });
      // Update hash without triggering a native jump.
      history.replaceState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  if (!items.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="hidden lg:block sticky top-20 self-start w-[220px] flex-shrink-0"
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/30 mb-3 pl-3">
        On this page
      </p>
      <ul className="space-y-0.5 border-l border-outline-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-active"
                  className="absolute left-[-1px] top-0 bottom-0 w-px bg-emerald-500/80"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 32,
                  }}
                />
              )}
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`flex items-start gap-2 pl-3 pr-2 py-1.5 text-[12px] leading-snug transition-colors ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-foreground/45 hover:text-foreground/70"
                }`}
              >
                {item.index && (
                  <span
                    className={`font-mono text-[10px] mt-px ${
                      isActive ? "text-emerald-500/80" : "text-foreground/30"
                    }`}
                  >
                    {item.index}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {/* Active-section progress mini-ring */}
                {isActive && (
                  <span className="mt-px flex-shrink-0 w-9 h-[3px] rounded-full bg-foreground/10 overflow-hidden">
                    <motion.span
                      className="block h-full bg-emerald-500/80 rounded-full"
                      animate={{ width: `${Math.round(activeProgress * 100)}%` }}
                      transition={{ duration: 0.15, ease: "linear" }}
                    />
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Overall reading progress footer */}
      <div className="mt-4 pl-3 pr-2">
        <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-foreground/35 mb-1.5">
          <span>Section progress</span>
          <span className="text-emerald-500/70">{Math.round(activeProgress * 100)}%</span>
        </div>
        <div className="h-[3px] rounded-full bg-foreground/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500/70 to-emerald-400 rounded-full"
            animate={{ width: `${Math.round(activeProgress * 100)}%` }}
            transition={{ duration: 0.15, ease: "linear" }}
          />
        </div>
      </div>
    </nav>
  );
}
