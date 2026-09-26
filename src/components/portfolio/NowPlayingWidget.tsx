"use client";

import { motion } from "framer-motion";
import { BookOpen, Music, Headphones } from "lucide-react";
import { useState, useEffect } from "react";
import { usePortfolioData } from "@/lib/portfolio-context";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Music,
  Headphones,
  learning: BookOpen,
  listening: Music,
  reading: Headphones,
};

/** Three animated equalizer bars — the universal "currently playing" glyph. */
function Equalizer() {
  return (
    <span className="inline-flex items-end gap-[2px] h-2.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-emerald-400/90 eq-bar"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export function NowPlayingWidget({ bare = false }: { bare?: boolean }) {
  const { data } = usePortfolioData();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nowItems = data.nowPlaying.length > 0
    ? data.nowPlaying.map((item) => ({
        type: item.type,
        label: item.label,
        title: item.title,
        subtitle: item.subtitle,
        icon: iconMap[item.type] || iconMap[item.icon] || BookOpen,
      }))
    : [
        { type: "learning", label: "Currently learning", title: "Unreal Engine 5", subtitle: "Game development", icon: BookOpen },
        { type: "listening", label: "Now listening", title: "Lo-fi Beats", subtitle: "Coding playlist", icon: Music },
        { type: "reading", label: "Currently reading", title: "Clean Architecture", subtitle: "Robert C. Martin", icon: Headphones },
      ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % nowItems.length);
        setIsAnimating(false);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, [nowItems.length]);

  const item = nowItems[activeIndex];
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={
        bare
          ? "flex items-center gap-3"
          : "rounded-[16px] border border-outline-2 bg-surface-2 p-4 flex items-center gap-3 group hover:bg-surface-3 hover:border-outline-3 transition-colors"
      }
    >
      {/* Icon tile — matches the info card language */}
      <span className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-foreground/55" />
      </span>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <motion.div
          key={`label-${activeIndex}`}
          initial={{ opacity: 0, y: isAnimating ? -5 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <Equalizer />
          <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-foreground/40 truncate">
            {item.label}
          </p>
        </motion.div>
        <motion.p
          key={`title-${activeIndex}`}
          initial={{ opacity: 0, y: isAnimating ? -5 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-[12px] font-medium text-foreground/85 truncate mt-0.5"
        >
          {item.title}
        </motion.p>
        <motion.p
          key={`sub-${activeIndex}`}
          initial={{ opacity: 0, y: isAnimating ? -5 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-[10px] text-foreground/45 truncate"
        >
          {item.subtitle}
        </motion.p>
      </div>
    </motion.div>
  );
}
