"use client";

import { motion } from "framer-motion";
import { Code2, Server, Brain, Database, Smartphone } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

/* ── Unique animated icon per skill card ── */
function AnimatedIconFrontend() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
        <Code2 className="w-4 h-4 text-foreground/60" />
      </div>
      {/* Orbiting dot */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
        style={{ transformOrigin: "center center" }}
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400" />
      </motion.div>
    </div>
  );
}

function AnimatedIconBackend() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
        <Server className="w-4 h-4 text-foreground/60" />
      </div>
      {/* Spinning ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-3px] rounded-full border border-dashed border-emerald-400/40"
      />
    </div>
  );
}

function AnimatedIconAI() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
        <Brain className="w-4 h-4 text-foreground/60" />
      </div>
      {/* Pulsing sparkles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [0, 1.2, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
          className="absolute w-1.5 h-1.5 rounded-full bg-violet-400"
          style={{
            top: i === 0 ? "-4px" : i === 1 ? "50%" : "auto",
            bottom: i === 2 ? "-4px" : "auto",
            right: i === 1 ? "-4px" : "50%",
            transform: i !== 1 ? "translateX(-50%)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function AnimatedIconDatabase() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
        <Database className="w-4 h-4 text-foreground/60" />
      </div>
      {/* Stacking layers animation */}
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -3, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-amber-400/50"
          style={{ bottom: `${-6 - i * 4}px` }}
        />
      ))}
    </div>
  );
}

const animatedIcons = [AnimatedIconFrontend, AnimatedIconBackend, AnimatedIconAI, AnimatedIconDatabase];

function SkillCard({
  title,
  count,
  technologies,
  delay,
  index,
}: {
  title: string;
  count: string;
  technologies: string[];
  delay: number;
  index: number;
}) {
  const AnimatedIcon = animatedIcons[index % animatedIcons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 flex items-center gap-3 hover:bg-surface-3 transition-colors"
    >
      <AnimatedIcon />

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/40">
          {count} technologies
        </p>
        <p className="text-sm font-medium text-foreground/80">
          {title}
        </p>
        <p className="text-xs text-foreground/50 leading-relaxed mt-0.5">
          {technologies.join(" · ")}
        </p>
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  const { data } = usePortfolioData();

  const skills = data.skills.length > 0
    ? data.skills
    : [
        {
          category: "Frontend",
          count: "08",
          proficiency: 90,
          technologies: ["React.js", "Next.js", "Three.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
        },
        {
          category: "Backend",
          count: "05",
          proficiency: 85,
          technologies: ["Node.js", "Express.js", "FastAPI", "Django", "REST API Design"],
        },
        {
          category: "AI & Tools",
          count: "06",
          proficiency: 80,
          technologies: ["Prompt Engineering", "GPT Integration", "Claude", "Gemini", "Git", "GitHub"],
        },
        {
          category: "Database & Practices",
          count: "05",
          proficiency: 78,
          technologies: ["PostgreSQL", "Agile/Scrum", "Project Scoping", "Stakeholder Communication", "REST APIs"],
        },
      ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {skills.map((skill, i) => (
          <SkillCard
            key={skill.category}
            title={skill.category}
            count={skill.count}
            proficiency={skill.proficiency}
            technologies={skill.technologies}
            delay={i * 0.1}
            index={i}
          />
        ))}
      </div>

      {/* Mobile Dev Card — shown on mobile/tablet before the tagline, on desktop it's under profile picture */}
      <div className="lg:hidden mt-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 flex items-center gap-3 hover:bg-surface-3 transition-colors shadow-[var(--card-shadow)]"
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-foreground/60" />
            </div>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.8 + i * 0.3, 2.5 + i * 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-cyan-400/40"
              />
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/40">04 technologies</p>
            <p className="text-sm font-medium text-foreground/80">Mobile Dev</p>
            <p className="text-xs text-foreground/50 leading-relaxed mt-0.5">Flutter · Dart · React Native · Firebase</p>
          </div>
        </motion.div>
      </div>

      <p className="text-[11px] text-foreground/40 font-mono mt-3">
        Some of my favorite technologies, tools, or tools that I worked with
      </p>
    </div>
  );
}
