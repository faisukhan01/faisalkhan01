"use client";

import { motion } from "framer-motion";
import { Preloader } from "@/components/portfolio/Preloader";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { CursorSpotlight } from "@/components/portfolio/CursorSpotlight";
import { Navigation } from "@/components/portfolio/Navigation";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectCards } from "@/components/portfolio/ProjectCards";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ArticlesSection } from "@/components/portfolio/ArticlesSection";
import { TestimonialsSection } from "@/components/portfolio/TestimonialsSection";
import { ContactsSection } from "@/components/portfolio/ContactsSection";
import { WorkExperience } from "@/components/portfolio/WorkExperience";
import { Footer } from "@/components/portfolio/Footer";
import { ProjectModal } from "@/components/portfolio/ProjectModal";
import { ArticleModal } from "@/components/portfolio/ArticleModal";
import { ContactModal } from "@/components/portfolio/ContactModal";
import { ShortcutsOverlay } from "@/components/portfolio/ShortcutsOverlay";
import { KeyboardHint } from "@/components/portfolio/KeyboardHint";
import { SectionSeparator } from "@/components/portfolio/SectionSeparator";
import { TechMarquee } from "@/components/portfolio/TechMarquee";
import { FaqSection } from "@/components/portfolio/FaqSection";
import { CommandPalette } from "@/components/portfolio/CommandPalette";
import { ParallaxCircles } from "@/components/portfolio/ParallaxCircles";
import { AchievementsSection } from "@/components/portfolio/AchievementsSection";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export default function Home() {
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      <Preloader />

      {/* Scroll Progress + Section Indicator */}
      <ScrollProgress />

      {/* Cursor spotlight */}
      <CursorSpotlight />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Decorative Background Circles with parallax */}
      <ParallaxCircles />

      {/* Top Section - Outside the card */}
      <div id="top" className="relative z-10 max-w-[1200px] mx-auto w-full px-6 md:px-10 lg:px-16 pt-6 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6"
        >
          <p className="font-mono text-xs text-foreground/40 tracking-wider whitespace-nowrap">
            ... / About project
          </p>
          <p className="text-foreground/50 text-sm leading-relaxed max-w-2xl">
            The task is to create a website portfolio for a Full-stack developer that is modern, functional, and visually appealing.
          </p>
        </motion.div>
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
        className="relative z-10 max-w-[1200px] mx-auto w-full px-6 md:px-10 lg:px-16 flex-1 flex flex-col pb-6 md:pb-10"
      >
        <div id="main-content" className="rounded-[28px] border border-outline-2 bg-background/80 backdrop-blur-sm p-6 md:p-10 lg:p-14 flex-1 flex flex-col shadow-[var(--card-shadow)] card-inner-glow">
          <Navigation />
          <HeroSection />
          {/* Tech marquee sits between hero and projects, full-bleed-ish */}
          <div className="-mx-6 md:-mx-10 lg:-mx-14 px-6 md:px-10 lg:px-14">
            <TechMarquee />
          </div>
          <SectionSeparator />
          <ProjectCards />
          <SectionSeparator />
          <AboutSection />
          <SectionSeparator />
          <AchievementsSection />
          <SectionSeparator />
          <ArticlesSection />
          <SectionSeparator />
          <TestimonialsSection />
          <SectionSeparator />
          <FaqSection />
          <SectionSeparator />
          <ContactsSection />
          <SectionSeparator />
          <WorkExperience />
          <Footer />
        </div>
      </motion.div>

      {/* Modals & overlays */}
      <ProjectModal />
      <ArticleModal />
      <ContactModal />
      <ShortcutsOverlay />
      <KeyboardHint />
    </div>
  );
}
