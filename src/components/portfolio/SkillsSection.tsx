"use client";

import { motion } from "framer-motion";
import { Code2, Server, Brain, Database, Smartphone } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

/* ── Clean static icons per skill card ── */
const skillIcons = [Code2, Server, Brain, Database];

const iconColors = [
  "text-blue-500/70",
  "text-emerald-500/70",
  "text-violet-500/70",
  "text-amber-500/70",
];

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
  const Icon = skillIcons[index % skillIcons.length];
  const color = iconColors[index % iconColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 flex items-center gap-3 hover:bg-surface-3 transition-colors"
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>

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

      {/* Mobile Dev Card — clean static icon, no animations */}
      <div className="lg:hidden mt-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 flex items-center gap-3 hover:bg-surface-3 transition-colors shadow-[var(--card-shadow)]"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-cyan-500/70" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/40">04 technologies</p>
            <p className="text-sm font-medium text-foreground/80">Mobile Dev</p>
            <p className="text-xs text-foreground/50 leading-relaxed mt-0.5">Flutter · Dart · React Native · Firebase</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
