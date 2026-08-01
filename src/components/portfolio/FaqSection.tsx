"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";
import type { FaqItem as FaqItemType } from "@/lib/portfolio-context";

function FaqItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: { id: string | number; question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className={`rounded-2xl border transition-colors overflow-hidden ${
        isOpen
          ? "border-outline-4 bg-surface-2"
          : "border-outline-2 bg-card hover:border-outline-3"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-[10px] font-mono text-foreground/50 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm md:text-base font-medium text-foreground">
            {faq.question}
          </span>
        </div>
        <span
          className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border transition-colors ${
            isOpen
              ? "bg-foreground text-background border-foreground"
              : "border-outline-3 text-foreground/60 group-hover:border-outline-4"
          }`}
        >
          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 md:px-6 md:pb-6 pl-12 md:pl-16 text-sm text-foreground/70 leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const { data } = usePortfolioData();
  const [openId, setOpenId] = useState<string | number | null>("faq-1");

  const faqs = data.faq.length > 0
    ? data.faq.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))
    : [
        { id: "faq-1", question: "What is your typical project timeline?", answer: "Most projects range from 4 to 16 weeks depending on scope. A typical microservice build is 6–8 weeks, while a full platform with auth, billing, and dashboards usually takes 10–14 weeks. I always start with a discovery call to align on milestones before committing to a deadline." },
        { id: "faq-2", question: "Do you work with existing codebases?", answer: "Yes — about 40% of my work is inheriting existing code. I begin with an audit covering architecture, test coverage, and tech debt, then propose a refactor plan. I can work in small, reversible steps so shipping velocity is never blocked." },
        { id: "faq-3", question: "What is your preferred tech stack?", answer: "For frontend: React or Next.js with TypeScript and Tailwind. For backend: Golang for performance-critical services, Nest.js for rapid feature development, and PostgreSQL as the default database. I'm pragmatic — the stack should serve the product, not the other way around." },
        { id: "faq-4", question: "How do you handle communication during a project?", answer: "I provide a written update at least twice a week, with a live demo every Friday. For active sprints I'm available on Slack or Telegram during working hours. All code is pushed to a shared repo so you can review progress at any time." },
        { id: "faq-5", question: "Do you offer post-launch maintenance?", answer: "Yes. I offer monthly retainers covering bug fixes, dependency updates, performance monitoring, and small feature work. Most clients keep me on for 3–6 months after launch to stabilize before handing off to an in-house team." },
        { id: "faq-6", question: "What is your availability and timezone?", answer: "I'm currently based in Europe (UTC+3) and work remotely with teams worldwide. I overlap 4+ hours with US East Coast mornings and 6+ hours with European workdays. I take on one major project at a time to ensure focused delivery." },
      ];

  return (
    <section id="faq" className="py-8 sm:py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
      >
        <div>
          <p className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/55 mb-3 tracking-wider">
            / FAQ
          </p>
          <h2 className="section-title text-foreground font-semibold text-xl sm:text-2xl md:text-3xl">
            Frequently asked <span className="text-foreground/55">questions</span>
          </h2>
        </div>
        <p className="text-sm text-foreground/70 max-w-sm">
          Common questions about working with me. Can&apos;t find what you&apos;re looking for?{" "}
          <a href="#contacts" className="text-foreground underline underline-offset-4 hover:text-foreground/80">
            Get in touch
          </a>
          .
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              index={i}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>

        {/* Side card with CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col justify-between rounded-2xl border border-outline-2 bg-gradient-to-br from-surface-2 to-transparent p-6 sticky top-8 h-fit"
        >
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-foreground/55 mb-4">
              Still curious?
            </p>
            <p className="text-foreground text-lg font-medium leading-snug mb-3">
              Have a specific question about your project?
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              I&apos;m happy to hop on a 30-minute discovery call — no strings attached.
            </p>
          </div>
          <a
            href="#contacts"
            className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Book a call
          </a>
        </motion.div>
      </div>
    </section>
  );
}
