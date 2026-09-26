"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { SkillsSection } from "./SkillsSection";
import { NowPlayingWidget } from "./NowPlayingWidget";
import { AnimatedCounter } from "./AnimatedCounter";
import { usePortfolioSettings } from "@/lib/portfolio-context";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("faisalkhan544814@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      title="Copy email"
      className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center shrink-0 hover:bg-surface-3 hover:border-emerald-500/30 transition-all"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-foreground/55" />
      )}
    </button>
  );
}

/** One aligned icon-tile row (label + value) used inside the profile card. */
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center shrink-0">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-foreground/40">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

export function AboutSection() {
  const settings = usePortfolioSettings();

  const aboutText = "Full-Stack Engineer crafting modern web apps with Next.js, React, and AI integrations. Microsoft-certified, focused on clean code and pixel-perfect interfaces.";
  const aboutTextSecondary = "From database schema to the last pixel, I own the full lifecycle — architecture, APIs, interfaces and the details most people skip. Currently focused on AI-powered products and fast, delightful user experiences.";
  const rawYears = settings.about_years || "2";
  const aboutYears = rawYears.startsWith("1") ? "2" : rawYears;
  const aboutProjects = settings.about_projects || "3";
  const aboutTechnologies = settings.about_technologies || "15";
  const aboutCvUrl = settings.about_cv_url || "/Faisal_Arslan_Khan_CV.docx";

  const stats = [
    { value: parseInt(aboutYears) || 2, suffix: "+", label: "Years experience" },
    { value: parseInt(aboutProjects) || 10, suffix: "+", label: "Projects completed" },
    { value: parseInt(aboutTechnologies) || 15, suffix: "+", label: "Technologies" },
  ];

  return (
    <section id="about" className="py-8 sm:py-16 md:py-24 scroll-mt-6">
      <motion.p
        {...fadeUp}
        transition={{ duration: 0.5 }}
        className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/55 mb-6 sm:mb-10 tracking-wider"
      >
        / About me
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
        {/* ── Left: narrative ─────────────────────────────────────────── */}
        <div>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-[1.65rem] sm:text-4xl md:text-[2.75rem] leading-[1.12] font-medium text-foreground tracking-[-0.02em] mb-5 sm:mb-7"
            style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
          >
            Code with clarity,
            <br />
            <span className="text-foreground/40">ship with confidence.</span>
          </motion.h2>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="space-y-4 max-w-xl"
          >
            <p className="text-foreground/80 text-[15px] sm:text-[17px] leading-relaxed">
              {aboutText}
            </p>
            <p className="text-foreground/55 text-[13px] sm:text-[15px] leading-relaxed">
              {aboutTextSecondary}
            </p>
          </motion.div>

          {/* Stats — clean hairline strip */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="flex flex-wrap items-stretch gap-y-5 mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-outline-1"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={i > 0 ? "pl-6 sm:pl-9 ml-6 sm:ml-9 border-l border-outline-1" : ""}
              >
                <p className="text-foreground text-2xl sm:text-[2rem] font-semibold leading-none mb-2 tabular-nums">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-foreground/55 text-[10px] font-mono uppercase tracking-[0.18em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8 sm:mt-10"
          >
            <a
              href={aboutCvUrl}
              className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-[13px] font-medium hover:opacity-85 active:scale-[0.98] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download CV
            </a>
            <a
              href="#contacts"
              className="inline-flex items-center gap-1 text-[13px] text-foreground/70 hover:text-foreground transition-colors animated-underline"
            >
              Get in touch
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>

        {/* ── Right: ONE unified profile card ─────────────────────────── */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="w-full max-w-[420px] mx-auto lg:max-w-none"
        >
          {/* Gradient-ring frame wraps the whole card (matches old portrait frame) */}
          <div className="rounded-[21px] p-px bg-gradient-to-b from-foreground/20 via-outline-2/50 to-outline-2/20">
            <div className="rounded-[20px] bg-surface-2 overflow-hidden shadow-[var(--card-shadow)]">
              {/* Portrait */}
              <div className="group relative h-[300px] sm:h-[360px] overflow-hidden">
                <img
                  src="/profile.png"
                  alt="Faisal Khan - Full-stack Developer"
                  className="w-full h-full object-cover object-[center_22%] group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                {/* Availability chip */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-emerald-400/30 rounded-full px-3 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-white/90 text-[9px] font-mono uppercase tracking-wider">
                    Available
                  </span>
                </div>

                {/* Name overlay */}
                <div className="absolute bottom-4 left-5 right-5">
                  <p
                    className="text-white font-medium text-lg"
                    style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}
                  >
                    Faisal Khan
                  </p>
                  <p className="text-white/60 text-[11px] font-mono mt-0.5">
                    Full-stack Developer
                  </p>
                </div>
              </div>

              {/* Info rows */}
              <div className="p-4 sm:p-5 space-y-4">
                <InfoRow icon={<MapPin className="w-3.5 h-3.5 text-foreground/55" />} label="Location">
                  <p className="text-[12px] font-mono text-foreground/80">
                    Lahore, Pakistan
                  </p>
                </InfoRow>
                <InfoRow icon={<Mail className="w-3.5 h-3.5 text-foreground/55" />} label="Email">
                  <div className="flex items-center gap-2">
                    <a
                      href="mailto:faisalkhan544814@gmail.com"
                      className="text-[12px] font-mono text-foreground/80 hover:text-foreground transition-colors truncate"
                    >
                      faisalkhan544814@gmail.com
                    </a>
                    <CopyEmailButton />
                  </div>
                </InfoRow>
              </div>

              {/* Socials + availability */}
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex items-center gap-2">
                <a
                  href="https://github.com/faisukhan01"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center hover:bg-surface-3 hover:border-emerald-500/30 transition-all group"
                >
                  <Github className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" />
                </a>
                <a
                  href="https://linkedin.com/in/faisal-arslan-khan"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center hover:bg-surface-3 hover:border-emerald-500/30 transition-all group"
                >
                  <Linkedin className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" />
                </a>
                <a
                  href="mailto:faisalkhan544814@gmail.com"
                  aria-label="Send email"
                  className="w-8 h-8 rounded-lg bg-surface-1 border border-outline-2/60 flex items-center justify-center hover:bg-surface-3 hover:border-emerald-500/30 transition-all group"
                >
                  <Mail className="w-3.5 h-3.5 text-foreground/70 group-hover:text-foreground transition-colors" />
                </a>
                <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                    <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="text-[9px] font-mono text-emerald-300/90 uppercase tracking-wider">
                    Open to work
                  </span>
                </span>
              </div>

              {/* Now playing — inline row, no separate box */}
              <div className="border-t border-outline-1/60 px-4 sm:px-5 py-3.5">
                <NowPlayingWidget bare />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Skills — clean editorial rows, full width ───────────────── */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6 }}
        className="mt-14 sm:mt-20"
      >
        <div className="flex items-baseline justify-between mb-1 sm:mb-2">
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-foreground/55">
            Technologies I work with
          </p>
          <p className="text-[10px] font-mono text-foreground/40 hidden sm:block">
            always learning more
          </p>
        </div>
        <SkillsSection />
      </motion.div>
    </section>
  );
}
