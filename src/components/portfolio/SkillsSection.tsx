"use client";

import { motion } from "framer-motion";
import { Code2, Server, Brain, Database, Smartphone } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

/* ── Skill icon configs ── */
const iconConfig: Record<string, { 
  icon: typeof Code2; 
  color: string; 
  bg: string; 
  pulse: string;
}> = {
  "Frontend": { 
    icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10", pulse: "bg-blue-400"
  },
  "Backend": { 
    icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10", pulse: "bg-emerald-400"
  },
  "AI & Tools": { 
    icon: Brain, color: "text-violet-500", bg: "bg-violet-500/10", pulse: "bg-violet-400"
  },
  "Database & Practices": { 
    icon: Database, color: "text-amber-500", bg: "bg-amber-500/10", pulse: "bg-amber-400"
  },
  "Mobile Dev": { 
    icon: Smartphone, color: "text-cyan-500", bg: "bg-cyan-500/10", pulse: "bg-cyan-400"
  },
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
  const config = iconConfig[title] || iconConfig["Frontend"];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 flex items-center gap-3 group hover:bg-surface-3 transition-colors"
    >
      {/* Icon with pulsing indicator — matches NowPlayingWidget */}
      <div className="relative flex-shrink-0">
        <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        {/* Pulsing indicator */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: delay }}
          className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${config.pulse}`}
        />
      </div>

      {/* Text content — matches NowPlayingWidget layout */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/40">
          {title}
        </p>
        <p className="text-sm font-medium text-foreground/80">
          {count} technologies
        </p>
        <p className="text-xs text-foreground/50 font-mono truncate">
          {technologies.join(" · ")}
        </p>
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
    <div className="flex flex-col gap-3">
      {skills.map((skill, i) => (
        <SkillCard
          key={skill.category}
          title={skill.category}
          count={skill.count}
          proficiency={skill.proficiency}
          technologies={skill.technologies}
          delay={i * 0.1}
        />
      ))}
    </div>
  );
}
