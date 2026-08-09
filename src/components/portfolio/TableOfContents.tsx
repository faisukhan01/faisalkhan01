"use client";

import { useEffect, useState } from "react";
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
 * - Hidden on screens below `lg` (where the layout collapses to a single
 *   column).
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

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
                className={`block pl-3 pr-2 py-1.5 text-[12px] leading-snug transition-colors ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-foreground/45 hover:text-foreground/70"
                }`}
              >
                {item.index && (
                  <span
                    className={`font-mono mr-2 text-[10px] ${
                      isActive ? "text-emerald-500/80" : "text-foreground/30"
                    }`}
                  >
                    {item.index}
                  </span>
                )}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
