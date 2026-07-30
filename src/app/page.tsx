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
import { ParallaxCircles } from "@/components/portfolio/ParallaxCircles";
import { ScrollToTopButton } from "@/components/portfolio/ScrollToTopButton";
import { StatusBanner } from "@/components/portfolio/StatusBanner";
import { ServicesSection } from "@/components/portfolio/ServicesSection";
import { TestimonialsSection } from "@/components/portfolio/TestimonialsSection";
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

      {/* Decorative Background Circles with parallax */}
      <ParallaxCircles />

      {/* Navigation - Outside the card, flush with top */}
      <div id="top" className="relative z-10 max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-16 pt-4 sm:pt-6 md:pt-8">
        <StatusBanner />
        <Navigation />
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
        className="relative z-10 max-w-[1200px] mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-16 flex-1 flex flex-col pb-4 sm:pb-6 md:pb-10"
      >
        <div id="main-content" className="animated-border-gradient rounded-[20px] sm:rounded-[28px] border border-outline-2 bg-background/80 backdrop-blur-sm p-4 sm:p-6 md:p-10 lg:p-14 flex-1 flex flex-col shadow-[var(--card-shadow)] card-inner-glow">
          <HeroSection />

          {/* Tech marquee sits between hero and projects, full-bleed-ish */}
          <div className="-mx-4 sm:-mx-6 md:-mx-10 lg:-mx-14 px-4 sm:px-6 md:px-10 lg:px-14">
            <TechMarquee />
          </div>

          <SectionSeparator />

          <AboutSection />

          <SectionSeparator />

          <ProjectCards />

          <SectionSeparator />

          <ServicesSection />

          <SectionSeparator />

          <TestimonialsSection />

          <SectionSeparator />

          <WorkExperience />

          <SectionSeparator />

          <ContactsSection />

          <Footer />
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
