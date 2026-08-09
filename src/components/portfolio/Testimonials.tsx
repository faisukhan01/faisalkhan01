"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/portfolio-data";

type TestimonialsProps = {
  testimonials: Testimonial[];
};

/**
 * Testimonials section for project detail pages.
 *
 * Renders 1–2 client quotes in a responsive grid with:
 *  - Large quote mark watermark
 *  - Avatar with initials + emerald accent ring
 *  - Quote body with proper typography (leading-relaxed)
 *  - Author / role / company attribution
 *  - Hover lift + emerald border accent
 *  - Staggered entrance animation via framer-motion
 *
 * Designed to slot in between the "Results" and "Actions" sections,
 * giving the case study a social-proof payoff before the CTA.
 */
export function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-8 sm:mb-10 scroll-mt-20"
      id="testimonials"
    >
      <h3 className="text-foreground font-semibold text-sm sm:text-base mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-foreground/40 rounded-full" />
        Client testimonials
        {testimonials.length > 1 && (
          <span className="text-[10px] font-mono text-foreground/45 ml-1">
            · {testimonials.length} quotes
          </span>
        )}
      </h3>

      <div
        className={`grid gap-4 sm:gap-5 ${
          testimonials.length > 1
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 max-w-2xl"
        }`}
      >
        {testimonials.map((t, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
            className="group relative rounded-[16px] border border-outline-2 bg-card p-5 sm:p-6 shadow-[var(--card-shadow)] hover:border-emerald-400/40 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(16,185,129,0.08)] dark:hover:shadow-[0_12px_36px_rgba(16,185,129,0.12)] transition-all duration-300 overflow-hidden"
          >
            {/* Top emerald accent line — appears on hover */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400/0 via-emerald-400/60 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Watermark quote icon */}
            <Quote
              className="absolute top-3 right-3 w-10 h-10 text-foreground/[0.05] group-hover:text-emerald-500/15 transition-colors duration-500"
              strokeWidth={1.5}
              aria-hidden
            />

            {/* 5-star rating accent */}
            <div className="relative flex items-center gap-0.5 mb-3" aria-hidden>
              {Array.from({ length: 5 }).map((_, si) => (
                <span
                  key={si}
                  className="text-emerald-500/70 text-xs"
                  style={{ animationDelay: `${si * 80}ms` }}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Quote body */}
            <blockquote className="relative">
              <p className="text-foreground/85 text-sm sm:text-[15px] leading-[1.75] font-medium italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </blockquote>

            {/* Attribution */}
            <figcaption className="relative mt-4 pt-4 border-t border-outline-1 flex items-center gap-3">
              {/* Avatar with initials */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/25 to-emerald-500/5 border border-emerald-400/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-300 tracking-wider">
                  {t.initials}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-foreground text-sm font-semibold leading-tight truncate">
                  {t.author}
                </p>
                <p className="text-foreground/60 text-xs font-mono mt-0.5 truncate">
                  {t.role} · {t.company}
                </p>
              </div>
            </figcaption>

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute -inset-px rounded-[16px] bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-transparent" />
            </div>
          </motion.figure>
        ))}
      </div>
    </motion.div>
  );
}
