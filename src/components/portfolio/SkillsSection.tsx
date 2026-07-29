"use client";

import { motion } from "framer-motion";

const skills = [
  {
    title: "Front-end",
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
    title: "Styles",
    technologies: ["SCSS", "SASS", "PostCSS", "Ant.d", "MUI", "Material UI"],
  },
  {
    title: "Back-end",
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
    title: "DevOps",
    technologies: ["Nginx", "Docker", "Docker Compose", "CI/CD", "AWS", "Bash"],
  },
];

export function SkillsSection() {
  return (
    <div>
      {/* 2-column grid: Front-end | Back-end (top row), Styles | DevOps (bottom row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Front-end - top left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0, duration: 0.5 }}
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.04)" }}
          className="rounded-[22px] border border-white/[0.08] bg-[#121212] p-5 transition-colors"
        >
          <h4 className="text-white font-semibold text-base mb-3">Front-end</h4>
          <div className="flex flex-wrap gap-x-0.5 gap-y-1">
            {skills[0].technologies.map((tech, i) => (
              <span key={tech} className="text-[13px] text-white/50 font-mono leading-relaxed">
                {tech}
                {i < skills[0].technologies.length - 1 && (
                  <span className="text-white/20 mx-1.5">/</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Back-end - top right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.04)" }}
          className="rounded-[22px] border border-white/[0.08] bg-[#121212] p-5 transition-colors"
        >
          <h4 className="text-white font-semibold text-base mb-3">Back-end</h4>
          <div className="flex flex-wrap gap-x-0.5 gap-y-1">
            {skills[2].technologies.map((tech, i) => (
              <span key={tech} className="text-[13px] text-white/50 font-mono leading-relaxed">
                {tech}
                {i < skills[2].technologies.length - 1 && (
                  <span className="text-white/20 mx-1.5">/</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Styles - bottom left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.04)" }}
          className="rounded-[22px] border border-white/[0.08] bg-[#121212] p-5 transition-colors"
        >
          <h4 className="text-white font-semibold text-base mb-3">Styles</h4>
          <div className="flex flex-wrap gap-x-0.5 gap-y-1">
            {skills[1].technologies.map((tech, i) => (
              <span key={tech} className="text-[13px] text-white/50 font-mono leading-relaxed">
                {tech}
                {i < skills[1].technologies.length - 1 && (
                  <span className="text-white/20 mx-1.5">/</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* DevOps - bottom right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.04)" }}
          className="rounded-[22px] border border-white/[0.08] bg-[#121212] p-5 transition-colors"
        >
          <h4 className="text-white font-semibold text-base mb-3">DevOps</h4>
          <div className="flex flex-wrap gap-x-0.5 gap-y-1">
            {skills[3].technologies.map((tech, i) => (
              <span key={tech} className="text-[13px] text-white/50 font-mono leading-relaxed">
                {tech}
                {i < skills[3].technologies.length - 1 && (
                  <span className="text-white/20 mx-1.5">/</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <p className="text-[11px] text-white/30 font-mono mt-3">
        Some of my favorite technologies, tools, or tools that I worked with
      </p>
    </div>
  );
}
