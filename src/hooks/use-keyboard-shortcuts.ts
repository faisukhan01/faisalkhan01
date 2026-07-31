"use client";

import { useEffect } from "react";
import { useModalStore } from "@/lib/portfolio-data";

export function useKeyboardShortcuts() {
  const { setContact, setShortcuts } = useModalStore();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setShortcuts(true);
      } else if (e.key.toLowerCase() === "c" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setContact(true);
      } else if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setContact, setShortcuts]);
}
