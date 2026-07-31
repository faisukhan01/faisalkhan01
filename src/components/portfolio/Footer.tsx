"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart, Globe, Code2, Mail, MapPin } from "lucide-react";

const navItems = ["About", "Projects", "Articles", "Contacts"];

export function Footer() {
  return (
    <footer className="footer-gradient-line mt-auto pt-6 pb-3 sm:pb-2 border-t border-outline-1">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Top row — Mobile: stacked compact, Desktop: row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Name + location on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-foreground font-medium text-[13px] sm:text-sm tracking-wide" style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}>Faisal</span>
              <span className="text-foreground/55 text-[13px] sm:text-sm">Khan</span>
              <span className="ml-0.5 w-1 h-1 rounded-full bg-emerald-400/60" />
            </div>
            {/* Mobile-only: location info */}
            <div className="flex items-center gap-1 sm:hidden">
              <MapPin className="w-2.5 h-2.5 text-foreground/30" />
              <span className="text-foreground/35 text-[10px] font-mono">Lahore, PK</span>
            </div>
          </motion.div>

          {/* Nav links — mobile pill style, properly spaced */}
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center justify-center gap-1 sm:gap-6"
            aria-label="Footer navigation"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-foreground/55 text-[11px] sm:text-xs hover:text-foreground/85 transition-colors animated-underline px-2.5 py-1.5 sm:px-0 sm:py-0 rounded-lg sm:rounded-none hover:bg-surface-1/60 sm:hover:bg-transparent"
              >
                {item}
              </a>
            ))}
          </motion.nav>

          {/* Back to top */}
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="w-9 h-9 sm:w-9 sm:h-9 rounded-full border border-outline-4 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-outline-5 hover:bg-surface-3 transition-all active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-outline-1">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-foreground/45 text-[10px] sm:text-xs font-mono text-center sm:text-left"
          >
            © {new Date().getFullYear()} All rights reserved
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-4 text-foreground/40 text-[10px] font-mono justify-center"
          >
            <span className="flex items-center gap-1">
              <Code2 className="w-2.5 h-2.5" />
              <span className="hidden sm:inline">Next.js 16</span>
              <span className="sm:hidden">Next.js</span>
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" />
              TypeScript
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Heart className="w-3 h-3" />
              Clean Code
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
