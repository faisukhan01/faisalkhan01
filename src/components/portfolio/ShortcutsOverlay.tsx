"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Command } from "lucide-react";
import { useEffect } from "react";
import { useModalStore } from "@/lib/portfolio-data";

const shortcuts = [
  { keys: ["⌘", "K"], action: "Open command palette" },
  { keys: ["↑", "↓"], action: "Navigate projects" },
  { keys: ["←", "→"], action: "Browse project gallery" },
  { keys: ["Esc"], action: "Close modal" },
  { keys: ["C"], action: "Open contact form" },
  { keys: ["T"], action: "Back to top" },
  { keys: ["?"], action: "Toggle this help" },
];

export function ShortcutsOverlay() {
  const { shortcutsOpen, setShortcuts } = useModalStore();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShortcuts(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setShortcuts]);

  return (
    <AnimatePresence>
      {shortcutsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[160] flex items-center justify-center p-4"
          onClick={() => setShortcuts(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md rounded-[20px] sm:rounded-[28px] border border-outline-3 bg-background p-5 sm:p-6 md:p-8 shadow-[var(--card-shadow)]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Command className="w-4 h-4 text-foreground/60" />
                <h2 className="text-foreground font-semibold text-base">Keyboard shortcuts</h2>
              </div>
              <button
                onClick={() => setShortcuts(false)}
                className="w-9 h-9 rounded-full border border-outline-4 flex items-center justify-center text-foreground hover:bg-surface-3 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {shortcuts.map((s) => (
                <div
                  key={s.action}
                  className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-surface-2 transition-colors"
                >
                  <span className="text-foreground/60 text-sm">{s.action}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="min-w-[24px] h-7 px-2 inline-flex items-center justify-center rounded-[6px] bg-surface-3 border border-outline-3 text-foreground/70 text-xs font-mono"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
