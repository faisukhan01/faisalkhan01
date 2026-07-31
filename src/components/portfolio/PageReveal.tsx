"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function PageReveal() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<"curtain" | "name" | "exit">("curtain");

  useEffect(() => {
    // Phase 1: curtain slides in (0-300ms)
    const t1 = setTimeout(() => setPhase("name"), 300);
    // Phase 2: name shows (300-800ms)
    const t2 = setTimeout(() => setPhase("exit"), 800);
    // Phase 3: curtain slides out (800-1200ms)
    const t3 = setTimeout(() => setVisible(false), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[250] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Curtain wipe from left to right */}
          <motion.div
            className="absolute inset-0 bg-foreground origin-left"
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: phase === "exit" ? [1, 1, 0] : 1,
              originX: phase === "exit" ? 1 : 0,
            }}
            transition={{
              duration: phase === "exit" ? 0.6 : 0.3,
              ease: [0.65, 0, 0.35, 1],
              times: phase === "exit" ? [0, 0.4, 1] : undefined,
            }}
          >
            {/* Name reveal during curtain */}
            <AnimatePresence>
              {phase === "name" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="text-background font-bold text-2xl md:text-4xl tracking-tight"
                    >
                      Faisal
                    </motion.span>
                    <motion.span
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                      className="text-background/40 text-2xl md:text-4xl tracking-tight"
                    >
                      Khan
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
