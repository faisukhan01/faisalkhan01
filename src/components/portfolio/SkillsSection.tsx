"use client";

import { motion } from "framer-motion";
import { Code2, Server, Brain, Database, Smartphone } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

/* ── Skill icon configs (only the icon is tinted — tags stay neutral) ── */
const iconConfig: Record<string, { icon: typeof Code2; color: string; bg: string }> = {
  "Frontend": { icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
  "Backend": { icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  "AI & Tools": { icon: Brain, color: "text-violet-500", bg: "bg-violet-500/10" },
  "Database & Practices": { icon: Database, color: "text-amber-500", bg: "bg-amber-500/10" },
  "Mobile Dev": { icon: Smartphone, color: "text-cyan-500", bg: "bg-cyan-500/10" },
};

const MAX_VISIBLE_TAGS = 6;

function SkillRow({
  title,
  count,
  technologies,
  delay,
}: {
  title: string;
  count: string;
  technologies: string[];
  delay: number;
}) {
  const config = iconConfig[title] || iconConfig["Frontend"];
  const Icon = config.icon;

  const visible = technologies.slice(0, MAX_VISIBLE_TAGS);
  const extra = technologies.length - visible.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.5 }}
      className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-4 sm:py-5 border-b border-outline-1/70 last:border-b-0"
    >
      {/* Category — icon + label */}
      <div className="flex items-center gap-3 sm:w-48 sm:shrink-0">
        <span
          className={`w-8 h-8 rounded-[10px] ${config.bg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
        </span>
        <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-foreground/70">
          {title}
        </p>
        <span className="text-[9px] font-mono text-foreground/35 sm:hidden ml-auto">
          {count}
        </span>
      </div>

      {/* Tags — one clean row of neutral pills + "+N" overflow chip */}
      <div className="flex flex-wrap items-center gap-1.5 flex-1">
        {visible.map((tech) => (
          <span
            key={tech}
            className="inline-block text-[11px] font-mono text-foreground/70 bg-surface-1/70 px-2 py-1 rounded-md border border-outline-1/60 whitespace-nowrap transition-colors duration-300 group-hover:text-foreground group-hover:border-outline-2"
          >
            {tech}
          </span>
        ))}
        {extra > 0 && (
          <span className="inline-block text-[11px] font-mono text-foreground/40 px-1.5 py-1">
            +{extra}
          </span>
        )}
      </div>
    </motion.div>
  );
}

const mobileDevSkill = {
  category: "Mobile Dev",
  count: "04",
  proficiency: 75,
  technologies: ["Flutter", "Dart", "React Native", "Firebase"],
};

const defaultSkills = [
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
    technologies: ["Node.js", "Express.js", "FastAPI", "Django", "REST API"],
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
    technologies: ["PostgreSQL", "Agile/Scrum", "Project Scoping", "Stakeholder Comm.", "REST APIs"],
  },
];

export function SkillsSection() {
  const { data } = usePortfolioData();

  // Always include Mobile Dev card alongside other skills
  const baseSkills = data.skills.length > 0 ? data.skills : defaultSkills;
  const hasMobileDev = baseSkills.some(s => s.category === "Mobile Dev");
  const skills = hasMobileDev ? baseSkills : [...baseSkills, mobileDevSkill];

  return (
    <div className="mt-2">
      {skills.map((skill, i) => (
        <SkillRow
          key={skill.category}
          title={skill.category}
          count={skill.count}
          technologies={skill.technologies}
          delay={i * 0.06}
        />
      ))}
    </div>
  );
}
