'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, ArrowLeft, FolderKanban, Mail, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickLinks = [
  { label: 'Projects', href: '/admin/dashboard/projects', icon: FolderKanban },
  { label: 'Contacts', href: '/admin/dashboard/contacts', icon: Mail },
  { label: 'Settings', href: '/admin/dashboard/settings', icon: Settings },
];

export default function NotFound() {
  const triggerSearch = () => {
    // Dispatch the global Cmd+K / Ctrl+K keydown event used by SearchCommand
    const evt = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      ctrlKey: false,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(evt);
  };

  return (
    <div className="relative min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center overflow-hidden bg-[#0a0f1a] px-6 py-16">
      {/* Decorative grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(52,211,153,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(52,211,153,0.4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative emerald circles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-lg text-center">
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="mb-6"
        >
          <h1 className="select-none text-[7rem] font-bold leading-none text-white/[0.08] sm:text-[9rem]">
            404
          </h1>
        </motion.div>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-6 h-px w-16 bg-emerald-400/60"
        />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-3 text-2xl font-semibold tracking-tight text-white md:text-3xl"
        >
          Page not found
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mx-auto mb-8 max-w-sm text-base leading-relaxed text-white/75"
        >
          The admin page you&apos;re looking for doesn&apos;t exist.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link href="/admin/dashboard">
            <Button className="gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-400 hover:to-emerald-500">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <button
            onClick={triggerSearch}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.15] bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <Search className="h-4 w-4" />
            Search
            <kbd className="ml-1 hidden rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-white/75 sm:inline-block">
              ⌘K
            </kbd>
          </button>
        </motion.div>

        {/* Quick destination icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12"
        >
          <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-white/60">
            Common destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.href}
                  href={q.href}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/[0.06] hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5 text-emerald-400/80" />
                  {q.label}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
