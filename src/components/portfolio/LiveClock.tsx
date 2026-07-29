"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

const timezones = [
  { label: "Local", tz: "Europe/Istanbul", offset: "+03:00" },
  { label: "New York", tz: "America/New_York", offset: "-05:00" },
  { label: "London", tz: "Europe/London", offset: "+00:00" },
  { label: "Tokyo", tz: "Asia/Tokyo", offset: "+09:00" },
];

function formatTime(date: Date, tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(date);
  } catch {
    return "--:--:--";
  }
}

function formatDate(date: Date, tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: tz,
    }).format(date);
  } catch {
    return "";
  }
}

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [activeTz, setActiveTz] = useState(0);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const current = timezones[activeTz];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-[22px] border border-outline-2 bg-card p-6 shadow-[var(--card-shadow)] overflow-hidden relative group hover:border-outline-3 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-3 border border-outline-3 flex items-center justify-center group-hover:bg-surface-4 transition-colors">
            <Globe className="w-4 h-4 text-foreground/70 group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">Working hours</p>
            <p className="text-foreground/65 text-xs font-mono">Across timezones</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/70">Live</span>
        </div>
      </div>

      {/* Main time display */}
      <div className="text-center mb-6">
        <motion.p
          key={activeTz}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-foreground text-4xl md:text-5xl font-bold tabular-nums tracking-tight"
        >
          {now ? formatTime(now, current.tz) : "--:--:--"}
        </motion.p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="text-foreground/80 text-sm font-medium">{current.label}</span>
          <span className="text-foreground/50 text-xs font-mono">UTC{current.offset}</span>
        </div>
        {now && (
          <p className="text-foreground/55 text-xs font-mono mt-1">
            {formatDate(now, current.tz)}
          </p>
        )}
      </div>

      {/* Timezone selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {timezones.map((tz, i) => (
          <button
            key={tz.label}
            onClick={() => setActiveTz(i)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all ${
              i === activeTz
                ? "bg-foreground text-background border border-foreground"
                : "bg-surface-2 text-foreground/65 border border-outline-3 hover:text-foreground hover:border-outline-4"
            }`}
          >
            {tz.label}
          </button>
        ))}
      </div>

      {/* Decorative corner glow */}
      <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-foreground/[0.03] blur-3xl pointer-events-none" />
    </motion.div>
  );
}
