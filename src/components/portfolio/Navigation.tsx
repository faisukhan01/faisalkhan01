"use client";

import { motion } from "framer-motion";

const navItems = ["About", "Projects", "Articles", "Contacts"];

export function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between py-5 border-b border-white/[0.06]"
    >
      <div className="flex items-baseline gap-1.5">
        <span className="text-white font-semibold text-lg tracking-wide">Nikita</span>
        <span className="text-white/50 text-lg tracking-wide">Khvatov</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[13px] text-white/70 hover:text-white transition-colors font-medium tracking-wide"
          >
            {item}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-sm font-mono">
        <button className="text-white font-medium px-1.5 py-0.5 hover:text-white/80 transition-colors">En</button>
        <span className="text-white/20">/</span>
        <button className="text-white/40 px-1.5 py-0.5 hover:text-white/60 transition-colors">Ge</button>
      </div>
    </motion.nav>
  );
}
