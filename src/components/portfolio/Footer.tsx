"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart, Globe, Code2, Mail, MapPin } from "lucide-react";

const navItems = ["About", "Projects", "Articles", "Contacts"];

export function Footer() {
  return (
    <footer className="footer-gradient-line mt-auto pt-8 pb-4 sm:pb-2 border-t border-outline-1">
      <div className="flex flex-col gap-6 sm:gap-6">
        {/* Top row — Mobile: stacked, Desktop: row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
          {/* Name + location on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-foreground font-medium text-sm tracking-wide" style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}>Faisal</span>
              <span className="text-foreground/55 text-sm">Khan</span>
              <span className="ml-1 w-1 h-1 rounded-full bg-emerald-400/60" />
            </div>
            {/* Mobile-only: location info */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <MapPin className="w-3 h-3 text-foreground/30" />
              <span className="text-foreground/35 text-[10px] font-mono">Lahore, PK</span>
            </div>
          </motion.div>

          {/* Nav links — mobile pill style */}
          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-6"
            aria-label="Footer navigation"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-foreground/55 text-xs hover:text-foreground/85 transition-colors animated-underline px-2.5 py-1.5 sm:px-0 sm:py-0 rounded-lg sm:rounded-none hover:bg-surface-1/60 sm:hover:bg-transparent"
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
            className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border border-outline-4 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-outline-5 hover:bg-surface-3 transition-all active:scale-95"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-outline-1">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-foreground/45 text-xs font-mono text-center sm:text-left"
          >
            © {new Date().getFullYear()} All rights reserved · Made with ❤️ and ☕
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-3 sm:gap-4 text-foreground/40 text-[10px] font-mono flex-wrap justify-center"
          >
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              Next.js 16
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              TypeScript
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              Clean Code
            </span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
