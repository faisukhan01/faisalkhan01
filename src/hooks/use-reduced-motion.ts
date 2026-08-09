"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Detects the user's `prefers-reduced-motion` setting and stays in sync
 * if they change it while the page is open.
 *
 * Returns `false` during SSR and the first client render (so server and
 * client markup match), then resolves to the real media-query value
 * after mount via `useSyncExternalStore` (lint-clean — no setState in
 * effect).
 *
 * Use this to gate heavy animations (confetti, parallax, spring physics)
 * so users who request reduced motion get a calmer experience.
 *
 * @example
 * const reduced = useReducedMotion();
 * <Confetti fire={reduced ? 0 : burst} />
 */
export function useReducedMotion(): boolean {
  const reduced = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return reduced;
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(QUERY);
  const handler = () => callback();
  // Modern browsers.
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }
  // Safari < 14 fallback.
  mql.addListener(handler);
  return () => mql.removeListener(handler);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}
