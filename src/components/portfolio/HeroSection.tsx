"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SocialButtons } from "./SocialButtons";

export function HeroSection() {
  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-28">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
        {/* Left Column */}
        <div className="flex flex-col flex-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed mb-10 md:mb-14"
          >
            My goal is to write maintainable, clean and understandable code to process development was enjoyable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="leading-[0.85] tracking-tight mb-10"
          >
            <span className="block text-[4rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold text-white leading-[0.85] tracking-[-0.02em]">
              Full-stack
            </span>
            <span className="block text-[4rem] sm:text-[5.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-bold text-white leading-[0.85] tracking-[-0.02em] md:pl-16 lg:pl-24">
              Developer
            </span>
          </motion.div>

          <SocialButtons />
        </div>

        {/* Right Column - CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-3 md:mt-16"
        >
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 bg-white text-[#0D0D0D] px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-white/90 transition-colors"
          >
            Projects
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/5 transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
