"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "HOME", href: "#top" },
  { label: "WORKS", href: "#projects" },
  { label: "ABOUT", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "CONTACT", href: "#contacts" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <nav className="flex items-center justify-between py-4 sm:py-5 md:py-6">
        {/* Logo — Single-line name */}
        <a
          href="#top"
          className="flex items-baseline gap-1.5 group"
        >
          <span
            className="text-foreground text-[18px] sm:text-[20px] font-semibold tracking-[-0.02em] transition-colors"
            style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
          >
            Faisal
          </span>
          <span
            className="text-foreground/80 text-[18px] sm:text-[20px] font-medium tracking-[-0.01em] transition-colors group-hover:text-foreground"
            style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
          >
            Khan
          </span>
        </a>

        {/* Desktop Nav — Centered uppercase with dot separators */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <div key={item.label} className="flex items-center gap-8">
                {i > 0 && (
                  <span className="text-foreground/15 text-[10px] select-none absolute">·</span>
                )}
                <a
                  href={item.href}
                  className={`nav-animated-underline text-[11px] font-medium tracking-[0.08em] uppercase transition-colors duration-200 py-1 ${
                    isActive
                      ? "text-foreground nav-active"
                      : "text-[#949494] hover:text-foreground/80"
                  }`}
                >
                  {item.label}
                </a>
              </div>
            );
          })}
        </div>

        {/* Right side — Dark mode indicator + Theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-[10px] font-mono text-foreground/25 tracking-[0.08em] uppercase">
            Dh
          </span>
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 flex items-center justify-center text-foreground rounded-xl hover:bg-surface-2 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — Full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 md:hidden bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header with close button */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
                <a
                  href="#top"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline gap-1.5"
                >
                  <span
                    className="text-foreground text-[18px] font-semibold tracking-[-0.02em]"
                    style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
                  >
                    Faisal
                  </span>
                  <span
                    className="text-foreground/80 text-[18px] font-medium tracking-[-0.01em]"
                    style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
                  >
                    Khan
                  </span>
                </a>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-foreground rounded-xl hover:bg-surface-2 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation items */}
              <div className="flex-1 flex flex-col justify-center px-6 sm:px-8">
                <div className="flex flex-col gap-2">
                  {navItems.map((item, i) => {
                    const isActive = activeSection === item.href.replace("#", "");
                    return (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.06, duration: 0.35 }}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-medium tracking-[0.04em] uppercase transition-all ${
                          isActive
                            ? "text-foreground bg-surface-2 border border-outline-2"
                            : "text-foreground/50 hover:text-foreground hover:bg-surface-1"
                        }`}
                      >
                        <span className="text-[10px] font-mono text-foreground/30 tabular-nums w-5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.label}
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Footer info */}
              <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-outline-1">
                <p className="text-foreground/40 text-xs font-mono">
                  Lahore, Pakistan
                </p>
                <p className="text-foreground/30 text-[10px] font-mono mt-1">
                  faisalkhan544814@gmail.com
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
