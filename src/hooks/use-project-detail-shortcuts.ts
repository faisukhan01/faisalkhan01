"use client";

import { useEffect, useRef } from "react";

type KeyboardShortcutOptions = {
  /** Slug of the previous project (wraps around). */
  prevSlug?: string;
  /** Slug of the next project (wraps around). */
  nextSlug?: string;
  /** Current path. Used to scope shortcuts to detail pages. */
  enabled?: boolean;
};

/**
 * Keyboard shortcuts for the project detail page.
 *
 * Shortcuts (only active when not typing in an input/textarea/contentEditable
 * and no modifier keys are held):
 *
 *   p      → navigate to previous project
 *   n      → navigate to next project
 *   g p    → navigate to /projects (chord: press g, then p within 800ms)
 *   g h    → navigate to / (chord: press g, then h within 800ms)
 *   Escape → scroll to top of current page (handy for long case studies)
 *
 * Uses Next.js router via window.location for cross-route navigation,
 * keeping this hook framework-agnostic. The router push happens on
 * `keydown` for snappy response.
 *
 * The "g" chord uses a ref-based pending-state pattern (no setState in
 * effect) so it's lint-clean under react-hooks rules.
 */
export function useProjectDetailShortcuts({
  prevSlug,
  nextSlug,
  enabled = true,
}: KeyboardShortcutOptions) {
  // Ref to track the pending "g" chord — avoids setState-in-effect lint issue.
  const pendingG = useRef(false);
  const gTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const isTypingTarget = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return true;
      if (el.isContentEditable) return true;
      // Skip if any modifier key held — let browser shortcuts win.
      return false;
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      const key = e.key.toLowerCase();

      // "g" chord: arm a pending state, wait for the next key.
      if (key === "g") {
        pendingG.current = true;
        if (gTimer.current) clearTimeout(gTimer.current);
        gTimer.current = setTimeout(() => {
          pendingG.current = false;
        }, 800);
        return;
      }

      // If we have a pending "g", check for the second key in the chord.
      if (pendingG.current) {
        pendingG.current = false;
        if (gTimer.current) clearTimeout(gTimer.current);

        if (key === "p") {
          e.preventDefault();
          window.location.href = "/projects";
          return;
        }
        if (key === "h") {
          e.preventDefault();
          window.location.href = "/";
          return;
        }
        // Fall through if it wasn't a known chord second-key.
      }

      // Single-key shortcuts.
      if (key === "p" && prevSlug) {
        e.preventDefault();
        window.location.href = `/projects/${prevSlug}`;
        return;
      }
      if (key === "n" && nextSlug) {
        e.preventDefault();
        window.location.href = `/projects/${nextSlug}`;
        return;
      }
      if (key === "escape") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      if (gTimer.current) clearTimeout(gTimer.current);
    };
  }, [enabled, prevSlug, nextSlug]);
}
