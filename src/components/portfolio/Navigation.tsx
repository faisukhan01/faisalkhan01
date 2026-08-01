"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "WORKS", href: "#projects" },
  { label: "ABOUT", href: "#about" },
  { label: "CONTACT", href: "#contacts" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["top", "projects", "about", "services", "contacts"];
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          current = id;
        }
      }
      setActiveSection(current);
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="flex items-center justify-between py-2.5 sm:py-5 md:py-6 transition-all duration-300 md:transition-none">
        {/* Logo — Greeting style */}
        <a
          href="#top"
          className="flex items-center gap-2 group"
        >
          <span className="text-foreground/55 text-[13px] sm:text-[15px] font-mono">Hi, I am</span>
          <span
            className="text-foreground text-[15px] sm:text-[20px] font-semibold tracking-[-0.02em] transition-colors"
            style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
          >
            Faisal
          </span>
          <span className="w-1 h-1 rounded-full bg-emerald-400/80 animate-pulse" />
        </a>

        {/* Desktop Nav — Minimal with dot separators */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item, i) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <div key={item.label} className="flex items-center">
                {i > 0 && (
                  <span className="text-foreground/30 text-[10px] select-none mx-2">·</span>
                )}
                <a
                  href={item.href}
                  className={`nav-animated-underline text-[11px] font-medium tracking-[0.08em] uppercase transition-colors duration-200 py-1 ${
                    isActive
                      ? "text-foreground nav-active"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </a>
              </div>
            );
          })}
        </div>

        {/* Right side — Theme toggle (desktop only) */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] font-mono text-foreground/55 tracking-[0.12em] uppercase">
            Theme
          </span>
          <ThemeToggle />
        </div>

        {/* Mobile menu button — compact */}
        <div className="md:hidden flex items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative w-9 h-9 flex items-center justify-center text-foreground rounded-xl bg-surface-1/80 border border-outline-2/60 backdrop-blur-sm hover:bg-surface-2 hover:border-outline-3 transition-all active:scale-95"
            aria-label="Toggle menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Menu className={`w-[18px] h-[18px] absolute transition-all duration-300 ${mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
              <X className={`w-[18px] h-[18px] absolute transition-all duration-300 ${mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu — Premium full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 md:hidden bg-background/98 backdrop-blur-2xl"
          >
            {/* Subtle gradient mesh behind menu */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06] blur-[100px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-purple-500/[0.03] dark:bg-purple-500/[0.05] blur-[100px]" />
            </div>

            <div className="relative flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-5">
                <a
                  href="#top"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2"
                >
                  <span className="text-foreground/55 text-[13px] font-mono">Hi, I am</span>
                  <span
                    className="text-foreground text-[15px] font-semibold tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
                  >
                    Faisal
                  </span>
                </a>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-foreground rounded-xl bg-surface-1/80 border border-outline-2/60 backdrop-blur-sm hover:bg-surface-2 transition-all active:scale-95"
                  aria-label="Close menu"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Navigation items — Premium staggered animation */}
              <div className="flex-1 flex flex-col justify-center px-4 sm:px-8">
                <div className="flex flex-col gap-0.5">
                  {navItems.map((item, i) => {
                    const isActive = activeSection === item.href.replace("#", "");
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ delay: 0.05 + i * 0.07, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className={`group flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[15px] font-medium tracking-[0.06em] uppercase transition-all duration-200 ${
                          isActive
                            ? "text-foreground bg-surface-2/80 border border-outline-2/60 backdrop-blur-sm"
                            : "text-foreground/65 hover:text-foreground hover:bg-surface-1/60"
                        }`}
                      >
                        <span className="text-[10px] font-mono text-foreground/45 tabular-nums w-6">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-foreground/40 group-hover:text-foreground/70 transition-colors" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Footer info — Premium mobile menu footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="px-4 sm:px-8 pb-5 pt-4 border-t border-outline-1/60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/70 text-[11px] font-mono tracking-wide">
                      Lahore, Pakistan
                    </p>
                    <p className="text-foreground/50 text-[10px] font-mono mt-1">
                      faisalkhan544814@gmail.com
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                    <span className="text-[10px] font-mono text-foreground/55 uppercase tracking-wider">Available</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
