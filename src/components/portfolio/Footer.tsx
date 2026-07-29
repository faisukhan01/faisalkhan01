"use client";

import { motion } from "framer-motion";

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
          {["About", "Projects", "Articles", "Contacts"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/35 text-xs hover:text-white/60 transition-colors"
            >
              {item}
            </a>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
