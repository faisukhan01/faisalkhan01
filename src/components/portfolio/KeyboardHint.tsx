"use client";

import { motion } from "framer-motion";
import { Keyboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useModalStore } from "@/lib/portfolio-data";

export function KeyboardHint() {
  const { setShortcuts } = useModalStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.5 }}
      onClick={() => setShortcuts(true)}
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full border border-outline-3 bg-background/80 backdrop-blur-md text-foreground/60 hover:text-foreground hover:border-outline-5 hover:bg-surface-2 transition-colors group shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
      aria-label="Keyboard shortcuts"
    >
      <Keyboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-medium tracking-wide hidden sm:inline whitespace-nowrap">
        Shortcuts
      </span>
      <kbd className="hidden sm:inline-flex min-w-[22px] h-[22px] px-1.5 items-center justify-center rounded bg-surface-3 border border-outline-3 text-foreground/80 text-xs font-mono font-semibold group-hover:bg-surface-4 transition-colors">
        ?
      </kbd>
    </motion.button>
  );
}
