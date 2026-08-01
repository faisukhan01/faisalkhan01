"use client";

import { motion } from "framer-motion";
import { Code2, Server, Brain, Database, Smartphone } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

/* ── Skill icon configs with gradient colors ── */
const iconConfig: Record<string, { 
  icon: typeof Code2; 
  color: string; 
  bg: string; 
  glowDelay: number;
  hoverBorder: string;
  tagBg: string;
}> = {
  "Frontend": { 
    icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10", glowDelay: 0,
    hoverBorder: "group-hover:border-blue-500/20", tagBg: "group-hover:bg-blue-500/5"
  },
  "Backend": { 
    icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10", glowDelay: 0.5,
    hoverBorder: "group-hover:border-emerald-500/20", tagBg: "group-hover:bg-emerald-500/5"
  },
  "AI & Tools": { 
    icon: Brain, color: "text-violet-500", bg: "bg-violet-500/10", glowDelay: 1,
    hoverBorder: "group-hover:border-violet-500/20", tagBg: "group-hover:bg-violet-500/5"
  },
  "Database & Practices": { 
    icon: Database, color: "text-amber-500", bg: "bg-amber-500/10", glowDelay: 1.5,
    hoverBorder: "group-hover:border-amber-500/20", tagBg: "group-hover:bg-amber-500/5"
  },
  "Mobile Dev": { 
    icon: Smartphone, color: "text-cyan-500", bg: "bg-cyan-500/10", glowDelay: 0.8,
    hoverBorder: "group-hover:border-cyan-500/20", tagBg: "group-hover:bg-cyan-500/5"
  },
};

function SkillIcon({ category }: { category: string }) {
  const config = iconConfig[category] || iconConfig["Frontend"];
  const Icon = config.icon;

  return (
    <div className="relative flex-shrink-0">
      <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
        <Icon className={`w-5 h-5 ${config.color} transition-transform duration-300 group-hover:scale-110`} />
      </div>
      {/* Subtle glow pulse */}
      <motion.div
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: config.glowDelay }}
        className={`absolute inset-0 rounded-xl ${config.bg}`}
      />
    </div>
  );
}

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`rounded-[16px] border border-outline-2 bg-surface-2 p-4 sm:p-5 hover:bg-surface-3 transition-all duration-300 group ${config.hoverBorder} hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]`}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <SkillIcon category={title} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors duration-300">
              {title}
            </p>
            <span className="text-[10px] font-mono text-foreground/30 flex-shrink-0 group-hover:text-foreground/50 transition-colors duration-300">{count} tech</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {technologies.map((tech) => (
              <span
                key={tech}
                className={`inline-block text-[10px] sm:text-[11px] font-mono text-foreground/50 bg-surface-1/80 px-1.5 py-0.5 rounded-md border border-outline-1/50 whitespace-nowrap transition-all duration-300 ${config.tagBg} group-hover:text-foreground/60 group-hover:border-outline-2/60`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
