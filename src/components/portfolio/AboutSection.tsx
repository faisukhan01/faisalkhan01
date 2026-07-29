"use client";

import { motion } from "framer-motion";
import { SkillsSection } from "./SkillsSection";

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-white/40 mb-8 tracking-wider"
      >
        ... / About me
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-14">
        {/* Left Column - Skills & About Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-white font-semibold text-2xl mb-3">About me</h2>
            <p className="text-white/60 text-base leading-relaxed max-w-lg">
              Hello! I&apos;m Nikita. I&apos;m a full-stack developer. More than 5 years experience in web development.
            </p>
          </motion.div>

          <SkillsSection />
        </div>

        {/* Right Column - Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex items-start"
        >
          <div className="rounded-[22px] overflow-hidden border border-white/[0.08] aspect-[4/5] w-full">
            <img
              src="/profile.jpg"
              alt="Nikita Khvatov - Full-stack Developer"
              className="w-full h-full object-cover grayscale"
            />
          </div>
          {/* Decorative play button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/[0.15] flex items-center justify-center bg-[#121212]/80 backdrop-blur-sm cursor-pointer hover:bg-white/[0.08] transition-colors"
          >
            <svg
              className="w-4 h-4 text-white/60 ml-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
