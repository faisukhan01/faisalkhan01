"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { SkillsSection } from "./SkillsSection";
import { NowPlayingWidget } from "./NowPlayingWidget";

const stats = [
  { value: "5+", label: "Years experience" },
  { value: "40+", label: "Projects completed" },
  { value: "20+", label: "Technologies" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-foreground/40 mb-8 tracking-wider"
      >
        ... / About me
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-14">
        {/* Left Column - Skills & About Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-foreground font-semibold text-3xl md:text-4xl mb-4 tracking-tight">
              About me
            </h2>
            <p className="text-foreground/60 text-base leading-relaxed max-w-lg mb-6">
              Hello! I&apos;m Nikita. I&apos;m a full-stack developer. More than 5 years experience in web development. I create modern, functional, and visually appealing web applications with attention to detail.
            </p>

            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-outline-1">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <p className="text-foreground text-2xl font-semibold mb-1">{stat.value}</p>
                  <p className="text-foreground/40 text-xs font-mono uppercase tracking-widest">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Download CV button */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 mt-6 text-sm text-foreground/70 hover:text-foreground transition-colors animated-underline"
            >
              <Download className="w-4 h-4" />
              Download CV
            </motion.a>

            {/* Now Playing Widget */}
            <div className="mt-6">
              <NowPlayingWidget />
            </div>
          </motion.div>

          <SkillsSection />
        </div>

        {/* Right Column - Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex items-start lg:sticky lg:top-8"
        >
          <div className="rounded-[22px] overflow-hidden border border-outline-2 aspect-[4/5] w-full relative group shadow-[var(--card-shadow)]">
            <img
              src="/profile.jpg"
              alt="Nikita Khvatov - Full-stack Developer"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-white font-semibold text-sm">Nikita Khvatov</p>
                <p className="text-white/60 text-xs font-mono mt-0.5">Full-stack Developer</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
            </div>
          </div>
          {/* Decorative play button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-outline-4 flex items-center justify-center bg-card/80 backdrop-blur-sm cursor-pointer hover:bg-surface-4 hover:border-outline-5 transition-colors"
          >
            <svg className="w-4 h-4 text-foreground/60 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
