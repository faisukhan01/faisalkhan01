"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Code2, Rocket } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  PenTool,
  Code2,
  Rocket,
};

export function ProjectTimeline() {
  const { data } = usePortfolioData();

  const steps = data.processTimeline.length > 0
    ? data.processTimeline.map((item) => {
        const Icon = iconMap[item.title] || iconMap["Step"] || Search;
        return {
          number: String(item.step).padStart(2, "0"),
          title: item.title,
          description: item.description,
          icon: Icon,
        };
      })
    : [
        {
          number: "01",
          title: "Discovery",
          description: "Understanding your goals, audience, and requirements through research and strategic planning.",
          icon: Search,
        },
        {
          number: "02",
          title: "Design",
          description: "Crafting wireframes and high-fidelity prototypes that align with your brand and user needs.",
          icon: PenTool,
        },
        {
          number: "03",
          title: "Development",
          description: "Building clean, scalable code with modern frameworks and best engineering practices.",
          icon: Code2,
        },
        {
          number: "04",
          title: "Delivery",
          description: "Testing, deploying, and optimizing your product for a flawless launch and ongoing success.",
          icon: Rocket,
        },
      ];

  return (
    <section id="process" className="py-8 sm:py-16 md:py-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="font-mono text-[10px] sm:text-xs text-foreground/70 mb-3 tracking-wider">
          &middot; &middot; &middot; / Process
        </p>
        <h2 className="text-foreground font-semibold text-xl sm:text-2xl md:text-3xl">
          How I <span className="text-foreground/70">work</span>
        </h2>
      </motion.div>

      {/* Desktop: horizontal timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-14 left-0 right-0 h-px bg-outline-2" />

          {/* Animated dots along the line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-[22px] left-0 right-0 h-px origin-left bg-gradient-to-r from-emerald-500/60 via-emerald-500/30 to-transparent"
          />

          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Step dot on the line */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                    className="w-7 h-7 rounded-full border-2 border-emerald-500/60 bg-background flex items-center justify-center z-10 mb-4 relative"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </motion.div>

                  {/* Icon circle */}
                  <motion.div
                    whileHover={{ scale: 1.08, borderColor: "rgba(255,255,255,0.15)" }}
                    className="w-16 h-16 rounded-2xl border border-outline-3 bg-surface-2 flex items-center justify-center mb-5 transition-colors hover:border-emerald-500/30"
                  >
                    <Icon className="w-7 h-7 text-foreground/75" />
                  </motion.div>

                  {/* Step number */}
                  <span className="text-[10px] font-mono text-emerald-500/70 tracking-widest mb-2">
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="text-foreground font-semibold text-base mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-foreground/70 text-sm leading-relaxed max-w-[220px]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden">
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-outline-2" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-3 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-emerald-500/60 via-emerald-500/30 to-transparent"
          />

          <div className="flex flex-col gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Dot on the line */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.2, type: "spring", stiffness: 200 }}
                    className="absolute -left-5 top-1 w-5 h-5 rounded-full border-2 border-emerald-500/60 bg-background flex items-center justify-center z-10"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500/70" />
                  </motion.div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl border border-outline-3 bg-surface-2 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-foreground/75" />
                  </div>

                  {/* Content */}
                  <div>
                    <span className="text-[10px] font-mono text-emerald-500/70 tracking-widest">
                      {step.number}
                    </span>
                    <h3 className="text-foreground font-semibold text-base mb-1">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
