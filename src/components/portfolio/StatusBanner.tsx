"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";

export function StatusBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner after a brief delay (after preloader)
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="relative flex items-center justify-center gap-3 px-4 py-2 text-center">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.1em] text-foreground/85">
              Available for new projects
              <span className="hidden sm:inline text-foreground/55"> — Q3 2025 booking now</span>
            </p>
            <Sparkles className="w-3 h-3 text-foreground/55 hidden sm:block" />
            <button
              onClick={() => setVisible(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/80 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
