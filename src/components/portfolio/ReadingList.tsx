"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { usePortfolioData } from "@/lib/portfolio-context";

export function ReadingList() {
  const { data } = usePortfolioData();
  const [activeIndex, setActiveIndex] = useState(0);

  const books = data.readingList.length > 0
    ? data.readingList.map((item) => ({
        title: item.title,
        author: item.author,
        progress: item.progress,
        gradient: item.gradient || "from-emerald-700/40 to-teal-900/40",
        accent: item.accent || "bg-emerald-500/60",
      }))
    : [
        { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", progress: 72, gradient: "from-emerald-700/40 to-teal-900/40", accent: "bg-emerald-500/60" },
        { title: "Clean Architecture", author: "Robert C. Martin", progress: 45, gradient: "from-amber-700/40 to-orange-900/40", accent: "bg-amber-500/60" },
        { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt", progress: 88, gradient: "from-violet-700/40 to-purple-900/40", accent: "bg-violet-500/60" },
      ];

  const nextBook = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % books.length);
  }, [books.length]);

  useEffect(() => {
    const interval = setInterval(nextBook, 5000);
    return () => clearInterval(interval);
  }, [nextBook]);

  const activeBook = books[activeIndex];

  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="font-mono text-xs text-foreground/50 mb-3 tracking-wider">
          ... / Reading
        </p>
        <h2 className="text-foreground font-semibold text-2xl md:text-3xl">
          Currently <span className="text-foreground/55">reading</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Book cover display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[22px] border border-outline-2 overflow-hidden shadow-[var(--card-shadow)] aspect-[3/4] max-h-[340px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`absolute inset-0 bg-gradient-to-br ${activeBook.gradient} flex flex-col items-center justify-center p-8`}
            >
              {/* Book spine */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20" />

              <BookOpen className="w-10 h-10 text-white/40 mb-4" />
              <p className="text-white/90 font-semibold text-lg text-center leading-snug mb-2">
                {activeBook.title}
              </p>
              <p className="text-white/50 text-xs font-mono text-center">
                {activeBook.author}
              </p>

              {/* Progress ring */}
              <div className="mt-6 relative w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2.5"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${activeBook.progress} 100`}
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray: `${activeBook.progress} 100` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white/80 text-xs font-mono font-semibold">
                  {activeBook.progress}%
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Currently reading badge */}
          <div className="absolute top-3 left-5 flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 z-10">
            <BookOpen className="w-3 h-3 text-white/70" />
            <span className="text-white/80 text-[9px] font-mono uppercase tracking-wider">
              Reading
            </span>
          </div>
        </motion.div>

        {/* Book cards list */}
        <div className="flex flex-col gap-3">
          {books.map((book, i) => (
            <motion.div
              key={book.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => setActiveIndex(i)}
              className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${
                i === activeIndex
                  ? "border-outline-4 bg-card-hover"
                  : "border-outline-2 bg-card hover:bg-card-hover hover:border-outline-3"
              } shadow-[var(--card-shadow)]`}
            >
              <div className="flex items-center gap-4">
                {/* Mini book cover */}
                <div
                  className={`w-12 h-16 rounded-lg bg-gradient-to-br ${book.gradient} flex items-center justify-center flex-shrink-0 border border-outline-2`}
                >
                  <BookOpen className="w-4 h-4 text-white/40" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-foreground text-sm font-semibold truncate">
                      {book.title}
                    </h3>
                    {i === activeIndex && (
                      <motion.div
                        layoutId="active-book-indicator"
                        className={`w-1.5 h-1.5 rounded-full ${book.accent} flex-shrink-0`}
                      />
                    )}
                  </div>
                  <p className="text-foreground/55 text-xs font-mono mb-3">
                    {book.author}
                  </p>

                  {/* Progress bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${book.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full ${book.accent}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-foreground/55 tabular-nums w-8 text-right">
                      {book.progress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-foreground/[0.03] blur-2xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
