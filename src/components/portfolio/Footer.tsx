"use client";

import { motion } from "framer-motion";
import { ArrowUp, Heart, Globe, Code2 } from "lucide-react";

const navItems = ["About", "Projects", "Articles", "Contacts"];

export function Footer() {
  return (
    <footer className="footer-gradient-line mt-auto pt-8 pb-2 border-t border-outline-1">
      <div className="flex flex-col gap-6">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5"
          >
            <span className="text-foreground font-semibold text-sm tracking-wide">Nikita</span>
            <span className="text-foreground/40 text-sm">Khvatov</span>
            <span className="ml-1 w-1 h-1 rounded-full bg-foreground/30" />
          </motion.div>

          <motion.nav
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-6"
            aria-label="Footer navigation"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-foreground/40 text-xs hover:text-foreground/70 transition-colors animated-underline"
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
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-full border border-outline-4 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-outline-5 hover:bg-surface-3 transition-colors"
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
            className="text-foreground/25 text-xs font-mono"
          >
            © {new Date().getFullYear()} All rights reserved · Made with ❤️ and ☕
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-4 text-foreground/20 text-[10px] font-mono"
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
