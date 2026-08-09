"use client";

import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { SkillsSection } from "./SkillsSection";
import { NowPlayingWidget } from "./NowPlayingWidget";
import { AnimatedCounter } from "./AnimatedCounter";
import { usePortfolioData, usePortfolioSettings } from "@/lib/portfolio-context";

export function AboutSection() {
  const { data } = usePortfolioData();
  const settings = usePortfolioSettings();

  const aboutText = "Full-Stack Engineer crafting modern web apps with Next.js, React, and AI integrations. Microsoft-certified, focused on clean code and pixel-perfect interfaces.";
  const rawYears = settings.about_years || "2";
  const aboutYears = rawYears.startsWith("1") ? "2" : rawYears;
  const aboutProjects = settings.about_projects || "3";
  const aboutTechnologies = settings.about_technologies || "15";
  const aboutCvUrl = settings.about_cv_url || "/Faisal_Arslan_Khan_CV.docx";

  const stats = [
    { value: parseInt(aboutYears) || 2, suffix: "+", label: "Years experience" },
    { value: parseInt(aboutProjects) || 3, suffix: "+", label: "Projects completed" },
    { value: parseInt(aboutTechnologies) || 15, suffix: "+", label: "Technologies" },
  ];

  return (
    <section id="about" className="py-8 sm:py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/55 mb-5 sm:mb-8 tracking-wider"
      >
        / About me
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] 2xl:grid-cols-[1fr_460px] gap-6 lg:gap-14">
        {/* Right Column - Profile Image (shown first on mobile for visual impact) */}
        <div className="order-first lg:order-last flex flex-col gap-4 max-w-[180px] sm:max-w-[260px] md:max-w-[320px] mx-auto lg:max-w-none lg:sticky lg:top-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex items-start"
          >
            <div className="rounded-[18px] sm:rounded-[22px] overflow-hidden border border-outline-2 aspect-[4/5] w-full relative group shadow-[var(--card-shadow)]">
              <img
                src="/profile.png"
                alt="Faisal Khan - Full-stack Developer"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* Top-right availability badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-emerald-400/30 rounded-full px-2.5 py-1 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-white/90 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider">Available</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between">
                <div>
                  <p className="text-white font-medium text-sm" style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}>Faisal Khan</p>
                  <p className="text-white/60 text-xs font-mono mt-0.5">Full-stack Developer</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
                </div>
              </div>
            </div>
            {/* Decorative year/experience badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-2 -right-1 sm:-right-3 md:-right-5 px-2.5 py-1.5 sm:py-3 rounded-lg sm:rounded-2xl border border-outline-4 flex items-center gap-1.5 sm:gap-3 bg-card/95 backdrop-blur-md shadow-[var(--card-shadow)]"
            >
              <span className="text-lg sm:text-2xl font-bold text-foreground leading-none">{aboutYears}+</span>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-foreground/60 leading-tight">
                years
                <br />
                experience
              </span>
            </motion.div>
          </motion.div>

          {/* Social & Contact Card — Desktop only, fills space under profile */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-[16px] border border-outline-2 bg-surface-2 p-4 shadow-[var(--card-shadow)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-3.5 h-3.5 text-foreground/60" />
                <span className="text-[11px] font-mono text-foreground/70">Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-3.5 h-3.5 text-foreground/60" />
                <span className="text-[11px] font-mono text-foreground/70">faisalkhan544814@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5 pt-3 border-t border-outline-1/60">
                <a
                  href="https://github.com/faisukhan01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center hover:bg-surface-3 hover:border-emerald-500/30 transition-all group"
                >
                  <Github className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" />
                </a>
                <a
                  href="https://linkedin.com/in/faisal-arslan-khan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center hover:bg-surface-3 hover:border-emerald-500/30 transition-all group"
                >
                  <Linkedin className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" />
                </a>
                <a
                  href="mailto:faisalkhan544814@gmail.com"
                  className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center hover:bg-surface-3 hover:border-emerald-500/30 transition-all group"
                >
                  <Mail className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" />
                </a>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-mono text-foreground/55 uppercase tracking-wider">Available</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Left Column - Skills & About Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-10"
          >
            <h2 className="section-title text-foreground font-medium text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 tracking-tight">
              About me
            </h2>
            <p className="text-foreground/75 text-[13px] sm:text-base leading-relaxed max-w-lg mb-5">
              {aboutText}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-8 pt-3 border-t border-outline-1">
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
                  <p className="text-foreground/70 text-xs font-mono uppercase tracking-widest">
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
              className="inline-flex items-center gap-2 mt-6 text-sm text-foreground/80 hover:text-foreground transition-colors animated-underline"
            >
              <Download className="w-4 h-4" />
              Download CV
            </motion.a>
          </motion.div>

          {/* Now Playing Widget — Currently learning card */}
          <div className="mt-6">
            <NowPlayingWidget />
          </div>

          {/* Tagline after Currently learning card */}
          <p className="text-[11px] text-foreground/60 font-mono mt-6 sm:mt-8 mb-6 sm:mb-8">
            Some of my favorite technologies & tools I work with
          </p>

          <SkillsSection />
        </div>

      </div>
    </section>
  );
}
