"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = ["About", "Projects", "Articles", "Contacts"];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = navItems.map((item) => item.toLowerCase());
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const id of sections) {
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
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`flex items-center justify-between py-5 border-b border-white/[0.06] transition-colors duration-300 ${
          scrolled ? "mb-0" : ""
        }`}
      >
        {/* Logo */}
        <a href="#top" className="flex items-baseline gap-1.5 group">
          <span className="text-white font-semibold text-lg tracking-wide transition-colors">
            Nikita
          </span>
          <span className="text-white/50 text-lg tracking-wide transition-colors group-hover:text-white/70">
            Khvatov
          </span>
          <span className="ml-1 w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors" />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.toLowerCase();
            return (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors group"
              >
                <span
                  className={`relative z-10 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.08]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Language switcher */}
        <div className="hidden md:flex items-center gap-1.5 text-sm font-mono">
          <button className="text-white font-medium px-1.5 py-0.5 hover:text-white/80 transition-colors relative">
            En
            <span className="absolute -bottom-0.5 left-1.5 right-1.5 h-px bg-white/60" />
          </button>
          <span className="text-white/20">/</span>
          <button className="text-white/40 px-1.5 py-0.5 hover:text-white/60 transition-colors">
            Ge
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

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
            <div className="flex flex-col gap-1 py-4 border-b border-white/[0.06]">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors font-medium tracking-wide"
                >
                  {item}
                </motion.a>
              ))}
              <div className="flex items-center gap-1.5 text-sm font-mono px-3 pt-3">
                <button className="text-white font-medium px-1.5 py-0.5">En</button>
                <span className="text-white/20">/</span>
                <button className="text-white/40 px-1.5 py-0.5">Ge</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
