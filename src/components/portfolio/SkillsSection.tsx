"use client";

import { motion } from "framer-motion";

const skills = [
  {
    title: "Front-end",
    count: "12",
    technologies: [
      "Typescript",
      "React",
      "Vue",
      "Vuex",
      "Redux Toolkit",
      "Next.js",
      "MUI",
      "Jest",
      "GraphQL",
      "React Native",
      "Puppeteer",
      "Enzyme",
    ],
  },
  {
    title: "Back-end",
    count: "13",
    technologies: [
      "Golang",
      "Gin",
      "GORM",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "gRPC",
      "Redis",
      "Kafka",
      "Node.js",
      "Nest",
      "TypeORM",
      "Microservices",
    ],
  },
  {
    title: "Styles",
    count: "06",
    technologies: ["SCSS", "SASS", "PostCSS", "Ant.d", "MUI", "Material UI"],
  },
  {
    title: "DevOps",
    count: "06",
    technologies: ["Nginx", "Docker", "Docker Compose", "CI/CD", "AWS", "Bash"],
  },
];

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -3 }}
      className="group relative rounded-[22px] border border-outline-2 bg-card p-5 hover:bg-card-hover hover:border-outline-4 transition-all shadow-[var(--card-shadow)] overflow-hidden"
    >
      {/* Hover gradient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-foreground/[0.04] blur-3xl" />
      </div>

      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 group-hover:bg-foreground transition-colors" />
          <h4 className="text-foreground font-semibold text-base">{title}</h4>
        </div>
        <span className="text-[10px] font-mono text-foreground/40 tabular-nums px-2 py-0.5 rounded-full border border-outline-2 bg-surface-2">
          {count}
        </span>
      </div>
      <div className="relative flex flex-wrap gap-x-1 gap-y-1.5">
        {technologies.map((tech, i) => (
          <span
            key={tech}
            className="text-[12px] text-foreground/60 font-mono leading-relaxed transition-colors hover:text-foreground cursor-default"
          >
            {tech}
            {i < technologies.length - 1 && (
              <span className="text-foreground/25 ml-1">/</span>
            )}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SkillCard
          title="Front-end"
          count="12"
          technologies={skills[0].technologies}
          delay={0}
        />
        <SkillCard
          title="Back-end"
          count="13"
          technologies={skills[1].technologies}
          delay={0.1}
        />
        <SkillCard
          title="Styles"
          count="06"
          technologies={skills[2].technologies}
          delay={0.2}
        />
        <SkillCard
          title="DevOps"
          count="06"
          technologies={skills[3].technologies}
          delay={0.3}
        />
      </div>

      <p className="text-[11px] text-foreground/30 font-mono mt-3">
        Some of my favorite technologies, tools, or tools that I worked with
      </p>
    </div>
  );
}
