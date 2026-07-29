"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-outline-1" />
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full border border-outline-1" />
        <div className="absolute bottom-[20%] -left-40 w-[350px] h-[350px] rounded-full border border-outline-1" />
        <div className="absolute top-[30%] -left-20 w-[280px] h-[280px] rounded-full border border-outline-1" />
      </div>

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="mb-8"
        >
          <h1 className="text-[8rem] sm:text-[10rem] md:text-[12rem] font-bold text-foreground/[0.06] leading-none select-none">
            404
          </h1>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="w-16 h-px bg-outline-3 mx-auto mb-8"
        />

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-foreground font-semibold text-2xl md:text-3xl mb-4 tracking-tight"
        >
          Page not found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground text-base leading-relaxed mb-10 max-w-sm mx-auto"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 bg-primary text-primary-foreground pl-7 pr-2 py-2 rounded-full font-semibold text-sm tracking-wide overflow-hidden hover:opacity-90 transition-opacity"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Back home
            </span>
            <span className="relative z-10 w-9 h-9 rounded-full bg-primary-foreground text-primary flex items-center justify-center transition-transform group-hover:rotate-45">
              <ArrowLeft className="w-4 h-4" />
            </span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-3 text-muted-foreground text-sm font-medium hover:text-foreground hover:border-outline-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </motion.div>

        {/* Search suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 flex items-center justify-center gap-2 text-muted-foreground/60 text-xs font-mono"
        >
          <Search className="w-3 h-3" />
          <span>Try searching or navigate from the home page</span>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 flex items-center justify-center gap-1.5"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="w-1 h-1 rounded-full bg-foreground/20"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
