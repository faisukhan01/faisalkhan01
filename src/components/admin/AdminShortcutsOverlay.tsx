'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Command } from 'lucide-react';
import { useEffect } from 'react';

interface AdminShortcutsOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcutGroups = [
  {
    title: 'Navigation',
    items: [
      { keys: ['⌘', 'K'], action: 'Open command palette / global search' },
      { keys: ['↑', '↓'], action: 'Navigate sidebar items' },
      { keys: ['Enter'], action: 'Open focused sidebar item' },
      { keys: ['Esc'], action: 'Close dialog or sidebar' },
      { keys: ['?'], action: 'Toggle this help overlay' },
    ],
  },
  {
    title: 'Admin Pages',
    items: [
      { keys: ['g', 'd'], action: 'Go to Dashboard' },
      { keys: ['g', 'p'], action: 'Go to Projects' },
      { keys: ['g', 'c'], action: 'Go to Form Submissions' },
      { keys: ['g', 'a'], action: 'Go to Articles' },
      { keys: ['g', 's'], action: 'Go to Settings' },
    ],
  },
  {
    title: 'Data Table',
    items: [
      { keys: ['/'], action: 'Focus search filter' },
      { keys: ['n'], action: 'Create new item' },
      { keys: ['e'], action: 'Edit selected item' },
      { keys: ['Del'], action: 'Delete selected item' },
    ],
  },
];

export default function AdminShortcutsOverlay({ open, onOpenChange }: AdminShortcutsOverlayProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => onOpenChange(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.15] bg-[#0f1629] shadow-2xl shadow-black/50"
          >
            {/* Decorative gradient */}
            <div className="pointer-events-none absolute inset-0 -z-0">
              <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/[0.08] blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-500/[0.05] blur-3xl" />
            </div>

            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-white/[0.12] bg-white/[0.02] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
                  <Keyboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 id="shortcuts-title" className="text-base font-bold text-white">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-xs text-white/75">Press <kbd className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-white/90">Esc</kbd> to close</p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
                aria-label="Close shortcuts overlay"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="relative max-h-[60vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {shortcutGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                      <Command className="h-3 w-3" />
                      {group.title}
                    </h3>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item.action}
                          className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                        >
                          <span className="text-xs text-white/85">{item.action}</span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, i) => (
                              <kbd
                                key={i}
                                className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-white/[0.15] bg-white/[0.06] px-1.5 text-[10px] font-bold text-white shadow-sm"
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15">
                  <Command className="h-3 w-3 text-emerald-400" />
                </div>
                <p className="text-xs text-white/85">
                  Tip: Use <kbd className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-white">⌘K</kbd> anytime to quickly jump to any page or search all content.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
