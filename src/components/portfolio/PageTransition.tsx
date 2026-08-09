"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

/**
 * Wraps page content with a fade-in animation on route change.
 * Uses pathname as key to trigger animation on navigation.
 *
 * We skip the entrance animation on the very first render after hydration
 * to avoid a double-flash with the Preloader on initial load. To detect
 * "first client render" without violating React 19's rules (no set-state
 * in effect, no ref-mutation during render), we use `useSyncExternalStore`
 * which returns false during SSR+hydration and true thereafter.
 */
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    clientSnapshot,
    serverSnapshot
  );

  // On the first client render (matching SSR), skip animation.
  if (!isClient) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
