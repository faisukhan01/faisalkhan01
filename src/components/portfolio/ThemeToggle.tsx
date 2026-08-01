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
      <button
        className="w-[36px] h-[20px] sm:w-[50px] sm:h-[26px] rounded-full bg-surface-3 border border-outline-2 flex items-center px-0.5 sm:px-1"
        aria-label="Toggle theme"
      >
        <div className="w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-full bg-foreground/20" />
      </button>
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
    <button
      onClick={toggleTheme}
      className="w-[36px] h-[20px] sm:w-[50px] sm:h-[26px] rounded-full bg-surface-3 border border-outline-2 flex items-center px-0.5 sm:px-1 transition-colors hover:border-outline-3"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] rounded-full flex items-center justify-center transition-colors ${
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
              <Sun className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-background" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Moon className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-background" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
