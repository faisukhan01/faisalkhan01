"use client";

import { motion } from "framer-motion";
import { Trophy, Star, GitBranch, Zap, Award, BookOpen } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Star,
  Trophy,
  GitBranch,
  Zap,
  BookOpen,
};

export function AchievementsSection() {
  const { data } = usePortfolioData();

  const achievements = data.achievements.length > 0
    ? data.achievements.map((item) => {
        const Icon = iconMap[item.label] || Award;
        return {
          icon: <Icon className="w-4 h-4" />,
          value: item.value,
          label: item.label,
          detail: item.detail,
        };
      })
    : [
        { icon: <Award className="w-4 h-4" />, value: "MS", label: "Microsoft Certified", detail: "Full-Stack Development" },
        { icon: <Star className="w-4 h-4" />, value: "MERN", label: "MERN Stack", detail: "Packt Certified" },
        { icon: <Trophy className="w-4 h-4" />, value: "Google", label: "Google Ads", detail: "Certified" },
        { icon: <GitBranch className="w-4 h-4" />, value: "3+", label: "Projects Built", detail: "Full-Stack" },
        { icon: <Zap className="w-4 h-4" />, value: "AI", label: "AI Integration", detail: "GPT, Claude, Gemini" },
        { icon: <BookOpen className="w-4 h-4" />, value: "BS", label: "Software Engineering", detail: "UCP Lahore" },
      ];

  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <p className="section-breadcrumb font-mono text-xs text-foreground/55 mb-3 tracking-wider">
            / Achievements
          </p>
          <h2 className="section-title text-foreground font-semibold text-2xl md:text-3xl">
            Numbers & <span className="text-foreground/55">milestones</span>
          </h2>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {achievements.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative rounded-2xl border border-outline-2 bg-card p-4 md:p-5 hover:bg-card-hover hover:border-outline-4 transition-all text-center shadow-[var(--card-shadow)] overflow-hidden"
          >
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-foreground/[0.04] blur-2xl" />
            </div>

            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-surface-3 border border-outline-2 flex items-center justify-center mx-auto mb-3 text-foreground/60 group-hover:text-foreground group-hover:bg-surface-4 group-hover:border-outline-3 transition-colors">
                {item.icon}
              </div>
              <p className="text-foreground text-xl md:text-2xl font-bold mb-1 tabular-nums">
                {item.value}
              </p>
              <p className="text-foreground/70 text-xs font-medium leading-snug mb-1">
                {item.label}
              </p>
              <p className="text-foreground/55 text-[10px] font-mono">
                {item.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
