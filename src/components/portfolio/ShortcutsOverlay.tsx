"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Command } from "lucide-react";
import { useEffect } from "react";
import { useModalStore } from "@/lib/portfolio-data";

const shortcuts = [
  { keys: ["↑", "↓"], action: "Navigate projects" },
  { keys: ["←", "→"], action: "Browse project gallery" },
  { keys: ["Esc"], action: "Close modal" },
  { keys: ["C"], action: "Open contact form" },
  { keys: ["?", "shift"], action: "Toggle this help" },
  { keys: ["T"], action: "Back to top" },
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
            className="relative z-10 w-full max-w-md rounded-[28px] border border-white/[0.1] bg-[#0D0D0D] p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Command className="w-4 h-4 text-white/60" />
                <h2 className="text-white font-semibold text-base">Keyboard shortcuts</h2>
              </div>
              <button
                onClick={() => setShortcuts(false)}
                className="w-9 h-9 rounded-full border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/[0.05] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {shortcuts.map((s) => (
                <div
                  key={s.action}
                  className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-white/60 text-sm">{s.action}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k, i) => (
                      <kbd
                        key={i}
                        className="min-w-[24px] h-7 px-2 inline-flex items-center justify-center rounded-[6px] bg-white/[0.06] border border-white/[0.1] text-white/70 text-xs font-mono"
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
