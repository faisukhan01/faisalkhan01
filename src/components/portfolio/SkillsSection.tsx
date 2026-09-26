"use client";

import { motion } from "framer-motion";
import {
  Braces,
  Brain,
  Code2,
  Database,
  Gamepad2,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";
import { TechIcon } from "./TechIcon";

/* ── Category appearance: tinted icon chip + card accent ────────────────── */
type CategoryStyle = {
  icon: LucideIcon;
  chip: string; // icon chip background + icon color
  glow: string; // hover border accent
  span?: string; // bento span on lg
};

const categoryStyles: Record<string, CategoryStyle> = {
  "Frontend": {
    icon: Code2,
    chip: "bg-emerald-500/12 text-emerald-400",
    glow: "hover:border-emerald-400/25",
    span: "lg:col-span-2",
  },
  "Backend": {
    icon: Server,
    chip: "bg-violet-500/12 text-violet-400",
    glow: "hover:border-violet-400/25",
  },
  "Mobile Dev": {
    icon: Smartphone,
    chip: "bg-amber-500/12 text-amber-400",
    glow: "hover:border-amber-400/25",
  },
  "Mobile Development": {
    icon: Smartphone,
    chip: "bg-amber-500/12 text-amber-400",
    glow: "hover:border-amber-400/25",
  },
  "Game Development": {
    icon: Gamepad2,
    chip: "bg-rose-500/12 text-rose-400",
    glow: "hover:border-rose-400/25",
  },
  "Game Dev": {
    icon: Gamepad2,
    chip: "bg-rose-500/12 text-rose-400",
    glow: "hover:border-rose-400/25",
  },
  "Languages": {
    icon: Braces,
    chip: "bg-teal-500/12 text-teal-400",
    glow: "hover:border-teal-400/25",
  },
  "AI & Tools": {
    icon: Brain,
    chip: "bg-orange-500/12 text-orange-400",
    glow: "hover:border-orange-400/25",
  },
  "Database & Practices": {
    icon: Database,
    chip: "bg-cyan-500/12 text-cyan-400",
    glow: "hover:border-cyan-400/25",
  },
};

const fallbackStyle: CategoryStyle = {
  icon: Code2,
  chip: "bg-emerald-500/12 text-emerald-400",
  glow: "hover:border-emerald-400/25",
};

function SkillCard({
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
  const style = categoryStyles[title] || fallbackStyle;
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`group relative rounded-[18px] border border-outline-2 bg-surface-2/40 p-4 sm:p-5 transition-all duration-300 hover:bg-surface-3/50 hover:-translate-y-0.5 ${style.glow} ${style.span || ""}`}
    >
      {/* Category header */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className={`w-9 h-9 rounded-xl ${style.chip} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-foreground/80 truncate">
            {title}
          </p>
          <p className="text-[9px] font-mono text-foreground/35 mt-0.5">
            {count} {count === "01" ? "tool" : "technologies"}
          </p>
        </div>
        {/* corner counter — desktop */}
        <span className="ml-auto text-[9px] font-mono text-foreground/25 hidden sm:block group-hover:text-foreground/45 transition-colors">
          {count}
        </span>
      </div>

      {/* Technology grid with real brand icons */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-y-2.5">
        {technologies.map((tech) => (
          <div
            key={tech}
            className="flex items-center gap-2 min-w-0"
            title={tech}
          >
            <TechIcon
              name={tech}
              className="w-[17px] h-[17px]"
            />
            <span className="text-[11px] font-mono text-foreground/60 truncate hover:text-foreground transition-colors cursor-default">
              {tech}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Default skill set (used until real data loads from the DB) ─────────── */
const defaultSkills = [
  {
    category: "Frontend",
    count: "08",
    proficiency: 90,
    technologies: ["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Three.js", "HTML5", "CSS3"],
  },
  {
    category: "Backend",
    count: "05",
    proficiency: 85,
    technologies: ["Node.js", "Express.js", "FastAPI", "Django", "REST APIs"],
  },
  {
    category: "Mobile Development",
    count: "05",
    proficiency: 82,
    technologies: ["React Native", "Kotlin", "Flutter", "Dart", "Firebase"],
  },
  {
    category: "Game Development",
    count: "04",
    proficiency: 80,
    technologies: ["Unity", "Unreal Engine", "C#", "C++"],
  },
  {
    category: "Languages",
    count: "07",
    proficiency: 84,
    technologies: ["C", "C#", "C++", "Python", "JavaScript", "TypeScript", "Kotlin"],
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
    technologies: ["PostgreSQL", "SQLite", "Agile/Scrum", "Project Scoping", "CI/CD"],
  },
];

/** Category ordering for the bento grid — Frontend first, then everything else. */
const categoryOrder = [
  "Frontend",
  "Mobile Development",
  "Game Development",
  "Backend",
  "Languages",
  "AI & Tools",
  "Mobile Dev",
  "Game Dev",
  "Database & Practices",
];

export function SkillsSection() {
  const { data } = usePortfolioData();

  const baseSkills = data.skills.length > 0 ? data.skills : defaultSkills;

  // Sort into a stable, deliberate order; unknown categories keep relative order at the end
  const skills = [...baseSkills].sort((a, b) => {
    const ia = categoryOrder.indexOf(a.category);
    const ib = categoryOrder.indexOf(b.category);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
      {skills.map((skill, i) => (
        <SkillCard
          key={skill.category}
          title={skill.category}
          count={skill.count}
          technologies={skill.technologies}
          delay={Math.min(i * 0.05, 0.3)}
        />
      ))}
    </div>
  );
}
