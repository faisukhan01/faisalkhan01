"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Standard client-mount detection pattern; setState here is intentional for SSR hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        {/* Mobile placeholder — icon button */}
        <button
          className="md:hidden w-8 h-8 rounded-lg bg-surface-1/80 border border-outline-2/60 flex items-center justify-center"
          aria-label="Toggle theme"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-foreground/15" />
        </button>
        {/* Desktop placeholder — toggle switch */}
        <button
          className="hidden md:flex w-[50px] h-[26px] rounded-full bg-surface-3 border border-outline-2 items-center px-1"
          aria-label="Toggle theme"
        >
          <div className="w-[18px] h-[18px] rounded-full bg-foreground/20" />
        </button>
      </>
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    // Add transition class for smooth theme change
    document.documentElement.classList.add("theme-transition");
    setTheme(isDark ? "light" : "dark");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 300);
  };

  return (
    <>
      {/* Mobile: Compact icon button */}
      <button
        onClick={toggleTheme}
        className="md:hidden w-8 h-8 rounded-lg bg-surface-1/80 border border-outline-2/60 flex items-center justify-center hover:bg-surface-2 hover:border-outline-3 transition-all active:scale-95"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="sun-mobile"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Sun className="w-3.5 h-3.5 text-foreground/70" />
            </motion.div>
          ) : (
            <motion.div
              key="moon-mobile"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Moon className="w-3.5 h-3.5 text-foreground/70" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Desktop: Toggle switch */}
      <button
        onClick={toggleTheme}
        className="hidden md:flex w-[50px] h-[26px] rounded-full bg-surface-3 border border-outline-2 items-center px-1 transition-colors hover:border-outline-3"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors ${
            isDark
              ? "bg-foreground ml-auto"
              : "bg-foreground/60 mr-auto"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Sun className="w-2.5 h-2.5 text-background" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Moon className="w-2.5 h-2.5 text-background" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>
    </>
  );
}
