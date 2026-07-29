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
      whileHover={{ y: -2 }}
      className="group rounded-[22px] border border-white/[0.08] bg-[#121212] p-5 hover:bg-[#161616] hover:border-white/[0.14] transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-semibold text-base">{title}</h4>
        <span className="text-[10px] font-mono text-white/30 tabular-nums">
          {count}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-0.5 gap-y-1">
        {technologies.map((tech, i) => (
          <span
            key={tech}
            className="text-[13px] text-white/50 font-mono leading-relaxed transition-colors hover:text-white/80"
          >
            {tech}
            {i < technologies.length - 1 && (
              <span className="text-white/20 mx-1.5">/</span>
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

      <p className="text-[11px] text-white/30 font-mono mt-3">
        Some of my favorite technologies, tools, or tools that I worked with
      </p>
    </div>
  );
}
