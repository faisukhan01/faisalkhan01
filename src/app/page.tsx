"use client";

import { motion } from "framer-motion";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { Navigation } from "@/components/portfolio/Navigation";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ProjectCards } from "@/components/portfolio/ProjectCards";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { ArticlesSection } from "@/components/portfolio/ArticlesSection";
import { ContactsSection } from "@/components/portfolio/ContactsSection";
import { WorkExperience } from "@/components/portfolio/WorkExperience";
import { Footer } from "@/components/portfolio/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-hidden flex flex-col">
      {/* Scroll Progress + Section Indicator */}
      <ScrollProgress />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Decorative Background Circles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-white/[0.04]" />
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] rounded-full border border-white/[0.03]" />
        <div className="absolute top-[40%] -right-64 w-[700px] h-[700px] rounded-full border border-white/[0.03]" />
        <div className="absolute top-[60%] -right-32 w-[400px] h-[400px] rounded-full border border-white/[0.02]" />
        <div className="absolute bottom-[20%] -left-40 w-[350px] h-[350px] rounded-full border border-white/[0.02]" />
        <div className="absolute top-[30%] -left-20 w-[280px] h-[280px] rounded-full border border-white/[0.02]" />
      </div>

      {/* Top Section - Outside the card */}
      <div id="top" className="relative z-10 max-w-[1200px] mx-auto w-full px-6 md:px-10 lg:px-16 pt-6 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6"
        >
          <p className="font-mono text-xs text-white/40 tracking-wider whitespace-nowrap">
            ... / About project
          </p>
          <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
            The task is to create a website portfolio for a Full-stack developer that is modern, functional, and visually appealing.
          </p>
        </motion.div>
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-[1200px] mx-auto w-full px-6 md:px-10 lg:px-16 flex-1 flex flex-col pb-6 md:pb-10"
      >
        <div className="rounded-[28px] border border-white/[0.08] bg-[#0D0D0D]/80 backdrop-blur-sm p-6 md:p-10 lg:p-14 flex-1 flex flex-col">
          <Navigation />
          <HeroSection />
          <ProjectCards />
          <AboutSection />
          <ArticlesSection />
          <ContactsSection />
          <WorkExperience />
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}
