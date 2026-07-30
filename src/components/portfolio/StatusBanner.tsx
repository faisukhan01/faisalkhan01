"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { usePortfolioSettings } from "@/lib/portfolio-context";

// localStorage key used to remember when a visitor has dismissed the status
// banner so it does not re-appear on subsequent page loads.
const DISMISS_KEY = "status-banner-dismissed";

export function StatusBanner() {
  const settings = usePortfolioSettings();
  const bannerText = settings.status_banner_text || "Available for freelance projects";

  // Initial render MUST be `visible=false` to avoid SSR/hydration mismatches.
  // We resolve whether the banner should show inside a useEffect (client-only).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check localStorage on mount only — wrapped in try/catch because
    // localStorage can throw in private browsing / SSR / disabled storage.
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "true";
    } catch {
      // Storage unavailable — treat as not dismissed so the banner can show.
      dismissed = false;
    }

    // If the user has already dismissed the banner, never show it again.
    if (dismissed) return;

    // Otherwise show the banner after a brief delay (after preloader).
    const timer = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    // Persist dismissal BEFORE hiding so the banner won't reappear next visit.
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // Ignore storage errors (private browsing, quota, etc).
    }
    setVisible(false);
  };

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
            <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.1em] text-foreground">
              {bannerText}
            </p>
            <Sparkles className="w-3 h-3 text-foreground/55 hidden sm:block" />
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
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
