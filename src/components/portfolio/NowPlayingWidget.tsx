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

export function NowPlayingWidget() {
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
        { type: "learning", label: "Currently learning", title: "Rust & WebAssembly", subtitle: "Systems programming for the web", icon: BookOpen },
        { type: "listening", label: "Now listening", title: "Lo-fi Beats", subtitle: "Coding playlist", icon: Music },
        { type: "reading", label: "Currently reading", title: "Designing Data-Intensive Applications", subtitle: "Martin Kleppmann", icon: Headphones },
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
      className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 flex items-center gap-3 group hover:bg-surface-3 transition-colors"
    >
      {/* Animated icon */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
          <Icon className="w-4 h-4 text-foreground/60" />
        </div>
        {/* Pulsing indicator */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400"
        />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <motion.p
          key={`label-${activeIndex}`}
          initial={{ opacity: 0, y: isAnimating ? -5 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/60"
        >
          {item.label}
        </motion.p>
        <motion.p
          key={`title-${activeIndex}`}
          initial={{ opacity: 0, y: isAnimating ? -5 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="text-sm font-medium text-foreground/80"
        >
          {item.title}
        </motion.p>
        <motion.p
          key={`sub-${activeIndex}`}
          initial={{ opacity: 0, y: isAnimating ? -5 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-xs text-muted-foreground/60"
        >
          {item.subtitle}
        </motion.p>
      </div>

      {/* Equalizer bars animation */}
      <div className="flex items-end gap-[2px] h-5 flex-shrink-0">
        {[0, 1, 2, 3, 5].map((i) => (
          <motion.div
            key={i}
            animate={{
              height: ["4px", "14px", "8px", "16px", "6px", "4px"],
            }}
            transition={{
              duration: 1.4 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
            className="w-[3px] rounded-full bg-foreground/30 group-hover:bg-foreground/50 transition-colors"
          />
        ))}
      </div>
    </motion.div>
  );
}
