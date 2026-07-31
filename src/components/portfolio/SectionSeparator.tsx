"use client";

import { motion } from "framer-motion";

export function SectionSeparator() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex items-center gap-4 py-1 sm:py-2"
    >
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-2 to-transparent" />
      <div className="flex items-center gap-1.5">
        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-foreground/10" />
        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-foreground/15" />
        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-foreground/10" />
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-outline-2 to-transparent" />
    </motion.div>
  );
}
