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
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full border border-outline-3 bg-background/80 backdrop-blur-sm text-foreground/50 hover:text-foreground hover:border-outline-5 transition-colors group"
      aria-label="Keyboard shortcuts"
    >
      <Keyboard className="w-3.5 h-3.5" />
      <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline whitespace-nowrap">
        Press
      </span>
      <kbd className="hidden sm:inline-flex min-w-[20px] h-5 px-1 items-center justify-center rounded bg-surface-3 border border-outline-3 text-foreground/70 text-[10px] font-mono">
        ?
      </kbd>
    </motion.button>
  );
}
