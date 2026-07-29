"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const navItems = ["About", "Projects", "Articles", "Contacts"];

export function Footer() {
  return (
    <footer className="mt-auto pt-8 pb-2 border-t border-white/[0.06]">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-baseline gap-1.5"
        >
          <span className="text-white font-semibold text-sm tracking-wide">Nikita</span>
          <span className="text-white/40 text-sm">Khvatov</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-white/25 text-xs font-mono"
        >
          © 2024 All rights reserved
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-6"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/35 text-xs hover:text-white/60 transition-colors animated-underline"
            >
              {item}
            </a>
          ))}
        </motion.div>

        {/* Back to top */}
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-full border border-white/[0.12] flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/[0.05] transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      </div>
    </footer>
  );
}
