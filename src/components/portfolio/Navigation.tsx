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

  return (
    <>
      <nav className="flex items-center justify-between py-6">
        {/* Logo — Two-line stacked name */}
        <a
          href="#top"
          className="flex flex-col leading-[1.15] group"
        >
          <span className="text-foreground text-[16px] font-bold tracking-[-0.02em] transition-colors">
            Nikita
          </span>
          <span className="text-foreground/40 text-[13px] font-light tracking-[-0.01em] transition-colors group-hover:text-foreground/60">
            Khvatov
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
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 py-4">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-3 py-2.5 text-[11px] font-medium tracking-[0.08em] uppercase text-[#949494] hover:text-foreground hover:bg-surface-2 rounded-lg transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
