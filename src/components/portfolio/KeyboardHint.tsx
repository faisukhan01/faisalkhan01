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
      className="hidden sm:flex fixed bottom-4 left-4 z-40 items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-outline-3 bg-surface-2/90 backdrop-blur-md shadow-sm text-foreground/70 hover:text-foreground hover:bg-surface-3 hover:border-emerald-500/30 transition-all group"
      aria-label="Keyboard shortcuts"
    >
      <Keyboard className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
      <kbd className="inline-flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded bg-surface-3 border border-outline-3 text-foreground/80 text-[10px] font-mono font-semibold group-hover:bg-surface-4 group-hover:border-emerald-500/30 transition-colors">
        ?
      </kbd>
    </motion.button>
  );
}
