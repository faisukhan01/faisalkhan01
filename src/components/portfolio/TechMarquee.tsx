"use client";

import { motion } from "framer-motion";

const techStack = [
  { name: "TypeScript", icon: "TS" },
  { name: "React", icon: "⚛" },
  { name: "Next.js", icon: "N" },
  { name: "Vue", icon: "V" },
  { name: "Golang", icon: "Go" },
  { name: "Node.js", icon: "⬡" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Redis", icon: "◆" },
  { name: "Docker", icon: "🐳" },
  { name: "Kafka", icon: "⚡" },
  { name: "GraphQL", icon: "◈" },
  { name: "gRPC", icon: "▸" },
  { name: "MongoDB", icon: "🍃" },
  { name: "Nest.js", icon: "🐱" },
  { name: "Tailwind", icon: "≈" },
  { name: "AWS", icon: "☁" },
];

export function TechMarquee() {
  // Duplicate the list to create seamless loop
  const doubled = [...techStack, ...techStack];

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-6"
      >
        <p className="section-breadcrumb font-mono text-xs text-foreground/55 tracking-wider">
          / Tech stack
        </p>
        <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/55 hidden md:block">
          {techStack.length} technologies
        </p>
      </motion.div>

      <div className="relative">
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Marquee track */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex gap-3"
          style={{ width: "fit-content" }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-3"
          >
            {doubled.map((tech, i) => (
              <div
                key={`${tech.name}-${i}`}
                className="group flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-outline-2 bg-card hover:bg-card-hover hover:border-outline-4 transition-colors cursor-default"
              >
                <span className="w-7 h-7 rounded-full bg-surface-3 group-hover:bg-surface-5 flex items-center justify-center text-xs font-bold text-foreground/85 group-hover:text-foreground transition-colors">
                  {tech.icon}
                </span>
                <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground whitespace-nowrap transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
