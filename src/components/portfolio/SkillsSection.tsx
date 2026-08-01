"use client";

import { motion } from "framer-motion";
import { Code2, Server, Brain, Database, Smartphone } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

/* ── Elegant animated icon components ── */

function SkillIconFrontend() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
        <Code2 className="w-5 h-5 text-blue-500" />
      </div>
      {/* Subtle glow pulse */}
      <motion.div
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-xl bg-blue-500/10"
      />
    </div>
  );
}

function SkillIconBackend() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
        <Server className="w-5 h-5 text-emerald-500" />
      </div>
      <motion.div
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute inset-0 rounded-xl bg-emerald-500/10"
      />
    </div>
  );
}

function SkillIconAI() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center">
        <Brain className="w-5 h-5 text-violet-500" />
      </div>
      <motion.div
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute inset-0 rounded-xl bg-violet-500/10"
      />
    </div>
  );
}

function SkillIconDatabase() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
        <Database className="w-5 h-5 text-amber-500" />
      </div>
      <motion.div
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute inset-0 rounded-xl bg-amber-500/10"
      />
    </div>
  );
}

function SkillIconMobile() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">
        <Smartphone className="w-5 h-5 text-cyan-500" />
      </div>
      <motion.div
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="absolute inset-0 rounded-xl bg-cyan-500/10"
      />
    </div>
  );
}

const skillIcons = [SkillIconFrontend, SkillIconBackend, SkillIconAI, SkillIconDatabase];

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
  const SkillIcon = skillIcons[index % skillIcons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 sm:p-5 hover:bg-surface-3 transition-colors group"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <SkillIcon />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground/80">
              {title}
            </p>
            <span className="text-[10px] font-mono text-foreground/30 flex-shrink-0">{count} tech</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-block text-[10px] sm:text-[11px] font-mono text-foreground/50 bg-surface-1/80 px-1.5 py-0.5 rounded-md border border-outline-1/50 whitespace-nowrap"
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

      {/* Mobile Dev Card — shown on mobile/tablet */}
      <div className="lg:hidden mt-3 sm:mt-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 sm:p-5 hover:bg-surface-3 transition-colors group"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <SkillIconMobile />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground/80">Mobile Dev</p>
                <span className="text-[10px] font-mono text-foreground/30 flex-shrink-0">04 tech</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["Flutter", "Dart", "React Native", "Firebase"].map((tech) => (
                  <span
                    key={tech}
                    className="inline-block text-[10px] sm:text-[11px] font-mono text-foreground/50 bg-surface-1/80 px-1.5 py-0.5 rounded-md border border-outline-1/50 whitespace-nowrap"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
