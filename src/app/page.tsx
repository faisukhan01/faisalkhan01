"use client";

import { motion } from "framer-motion";
import { Preloader } from "@/components/portfolio/Preloader";
import { CursorSpotlight } from "@/components/portfolio/CursorSpotlight";
import { Navigation } from "@/components/portfolio/Navigation";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectCards } from "@/components/portfolio/ProjectCards";
import { AboutSection } from "@/components/portfolio/AboutSection";
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
import { CommandPalette } from "@/components/portfolio/CommandPalette";
import { NetworkBackground } from "@/components/portfolio/NetworkBackground";
import { ScrollToTopButton } from "@/components/portfolio/ScrollToTopButton";
import { StatusBanner } from "@/components/portfolio/StatusBanner";
import { ServicesSection } from "@/components/portfolio/ServicesSection";

import { PageReveal } from "@/components/portfolio/PageReveal";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { PortfolioProvider } from "@/lib/portfolio-context";

export default function Home() {
  useKeyboardShortcuts();

  return (
    <PortfolioProvider>
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      <PageReveal />
      <Preloader />



      {/* Cursor spotlight */}
      <CursorSpotlight />

      {/* Command Palette (Cmd+K) */}
      <CommandPalette />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Navigation - Outside the card, flush with top */}
      <div id="top" className="relative z-10 max-w-[1200px] mx-auto w-full px-3.5 sm:px-6 md:px-10 lg:px-16 pt-1.5 sm:pt-5 md:pt-8">
        <StatusBanner />
        <Navigation />
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
        className="relative z-10 max-w-[1200px] mx-auto w-full px-2.5 sm:px-6 md:px-10 lg:px-16 flex-1 flex flex-col pb-2 sm:pb-6 md:pb-10"
      >
        <div id="main-content" className="animated-border-gradient rounded-[10px] sm:rounded-[20px] md:rounded-[28px] border border-white/[0.12] dark:border-white/[0.08] bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-2xl px-3.5 py-3.5 sm:p-6 md:p-10 lg:p-14 flex-1 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] card-inner-glow glass-card">
          {/* 3D Animated Networking Background inside the card */}
          <NetworkBackground />

          {/* Content wrapper - above canvas */}
          <div className="glass-card-content flex-1 flex flex-col">
          <HeroSection />

          {/* Tech marquee sits between hero and projects, full-bleed-ish */}
          <div className="-mx-3.5 sm:-mx-6 md:-mx-10 lg:-mx-14 px-3.5 sm:px-6 md:px-10 lg:px-14 pt-3 pb-2 sm:py-12 md:py-16">
            <TechMarquee />
          </div>

          <SectionSeparator />

          <AboutSection />

          <SectionSeparator />

          <ProjectCards />

          <SectionSeparator />

          <ServicesSection />

          <SectionSeparator />

          <WorkExperience />

          <SectionSeparator />

          <ContactsSection />

          <Footer />
          </div>
        </div>
      </motion.div>

      {/* Modals & overlays */}
      <ProjectModal />
      <ArticleModal />
      <ContactModal />
      <ShortcutsOverlay />
      <KeyboardHint />
      <ScrollToTopButton />
    </div>
    </PortfolioProvider>
  );
}
