"use client";

import { motion } from "framer-motion";
import { Code2, Server, Brain, Database } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Frontend: Code2,
  Backend: Server,
  "AI & Tools": Brain,
  "Database & Practices": Database,
};

function SkillCard({
  title,
  count,
  proficiency,
  technologies,
  delay,
  index,
}: {
  title: string;
  count: string;
  proficiency: number;
  technologies: string[];
  delay: number;
  index: number;
}) {
  const Icon = categoryIcons[title] || Code2;

  // Different bar configs per card for visual variety
  const barConfigs = [
    ["4px", "14px", "8px", "16px", "6px", "4px"],
    ["6px", "10px", "14px", "6px", "12px", "8px"],
    ["10px", "6px", "16px", "8px", "4px", "12px"],
    ["8px", "12px", "4px", "14px", "10px", "6px"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group rounded-[16px] border border-outline-2 bg-surface-2 p-4 flex items-center gap-3 hover:bg-surface-3 transition-colors"
    >
      {/* Icon — same style as NowPlayingWidget */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-surface-4 flex items-center justify-center">
          <Icon className="w-4 h-4 text-foreground/60" />
        </div>
        {/* Pulsing indicator */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400"
        />
      </div>

      {/* Text content — same layout as NowPlayingWidget */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/40">
          {count} technologies
        </p>
        <p className="text-sm font-medium text-foreground/80 truncate">
          {title}
        </p>
        <p className="text-xs text-foreground/50 truncate">
          {technologies.join(" · ")}
        </p>
      </div>

      {/* Wavy equalizer bars — same as NowPlayingWidget */}
      <div className="flex items-end gap-[2px] h-5 flex-shrink-0">
        {[0, 1, 2, 3, 5].map((i) => (
          <motion.div
            key={i}
            animate={{
              height: barConfigs[index % barConfigs.length],
            }}
            transition={{
              duration: 1.4 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
            className="w-[3px] rounded-full bg-foreground/25 group-hover:bg-foreground/45 transition-colors"
          />
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  const { data } = usePortfolioData();

  const skills =
    data.skills.length > 0
      ? data.skills
      : [
          {
            category: "Frontend",
            count: "08",
            proficiency: 90,
            technologies: [
              "React.js",
              "Next.js",
              "Three.js",
              "JavaScript",
              "TypeScript",
              "HTML5",
              "CSS3",
              "Tailwind CSS",
            ],
          },
          {
            category: "Backend",
            count: "05",
            proficiency: 85,
            technologies: [
              "Node.js",
              "Express.js",
              "FastAPI",
              "Django",
              "REST API Design",
            ],
          },
          {
            category: "AI & Tools",
            count: "06",
            proficiency: 80,
            technologies: [
              "Prompt Engineering",
              "GPT Integration",
              "Claude",
              "Gemini",
              "Git",
              "GitHub",
            ],
          },
          {
            category: "Database & Practices",
            count: "05",
            proficiency: 78,
            technologies: [
              "PostgreSQL",
              "Agile/Scrum",
              "Project Scoping",
              "Stakeholder Communication",
              "REST APIs",
            ],
          },
        ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
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

      <p className="text-[11px] text-foreground/40 font-mono mt-3">
        Some of my favorite technologies, tools, or tools that I worked with
      </p>
    </div>
  );
}
