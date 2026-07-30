"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { SkillsSection } from "./SkillsSection";
import { NowPlayingWidget } from "./NowPlayingWidget";
import { AnimatedCounter } from "./AnimatedCounter";
import { usePortfolioData, usePortfolioSettings } from "@/lib/portfolio-context";

export function AboutSection() {
  const { data } = usePortfolioData();
  const settings = usePortfolioSettings();

  const aboutText = settings.about_text || "Full-Stack Software Engineer with hands-on experience building and shipping production web applications using Next.js, React, Node.js, Express.js, FastAPI, and PostgreSQL. Skilled in developing responsive, scalable interfaces and integrating AI-driven features, REST APIs, and 3D/interactive experiences with Three.js. Microsoft-certified in Full-Stack Development, with a track record of delivering client and academic projects end-to-end.";
  const aboutYears = settings.about_years || "1";
  const aboutProjects = settings.about_projects || "3";
  const aboutTechnologies = settings.about_technologies || "15";
  const aboutCvUrl = settings.about_cv_url || "/Faisal_Arslan_Khan_CV.docx";

  const stats = [
    { value: parseInt(aboutYears) || 1, suffix: "+", label: "Years experience" },
    { value: parseInt(aboutProjects) || 3, suffix: "+", label: "Projects completed" },
    { value: parseInt(aboutTechnologies) || 15, suffix: "+", label: "Technologies" },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-breadcrumb font-mono text-xs text-foreground/55 mb-8 tracking-wider"
      >
        / About me
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-14">
        {/* Right Column - Profile Image (shown first on mobile for visual impact) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative flex items-start lg:sticky lg:top-8 order-first lg:order-last max-w-[200px] sm:max-w-[260px] md:max-w-[320px] mx-auto lg:max-w-none"
        >
          <div className="rounded-[22px] overflow-hidden border border-outline-2 aspect-[4/5] w-full relative group shadow-[var(--card-shadow)]">
            <img
              src="/profile.png"
              alt="Faisal Khan - Full-stack Developer"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            {/* Top-right availability badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/90 text-[10px] font-mono uppercase tracking-wider">Available</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-white font-medium text-sm" style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}>Faisal Khan</p>
                <p className="text-white/60 text-xs font-mono mt-0.5">Full-stack Developer</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
              </div>
            </div>
          </div>
          {/* Decorative year/experience badge — integrated, not floating */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -bottom-3 -right-2 sm:-right-3 md:-right-5 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-outline-4 flex items-center gap-2 sm:gap-3 bg-card/95 backdrop-blur-md shadow-[var(--card-shadow)]"
          >
            <span className="text-xl sm:text-2xl font-bold text-foreground leading-none">{aboutYears}+</span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-foreground/60 leading-tight">
              years
              <br />
              experience
            </span>
          </motion.div>
        </motion.div>
        {/* Left Column - Skills & About Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="section-title text-foreground font-medium text-2xl md:text-3xl mb-4 tracking-tight">
              About me
            </h2>
            <p className="text-foreground/60 text-base leading-relaxed max-w-lg mb-6">
              {aboutText}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 pt-4 border-t border-outline-1">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <p className="text-foreground text-2xl font-semibold mb-1 tabular-nums">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-foreground/50 text-xs font-mono uppercase tracking-widest">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Download CV button */}
            <motion.a
              href={aboutCvUrl}
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
      </div>
    </section>
  );
}
