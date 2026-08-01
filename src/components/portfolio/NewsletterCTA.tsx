"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type FormEvent, useEffect, useState } from "react";
import { Mail, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { usePortfolioData, usePortfolioSettings } from "@/lib/portfolio-context";

const perks = [
  { icon: Mail, text: "Bi-weekly issues" },
  { icon: Sparkles, text: "Early access to experiments" },
  { icon: CheckCircle2, text: "No spam, ever" },
];

// 8 confetti dots distributed evenly around a circle, flying outward.
const confettiDots = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * Math.PI * 2) / 8;
  const distance = 78;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    delay: i * 0.02,
  };
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterCTA() {
  const { data } = usePortfolioData();
  const settings = usePortfolioSettings();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Build stats from context data
  const newsletterStats = data.newsletterStats.length > 0
    ? data.newsletterStats
    : [
        { statKey: "subscribers", statValue: "2.4k" },
        { statKey: "issues", statValue: "14" },
        { statKey: "open_rate", statValue: "98%" },
      ];

  // Also check settings for individual values
  const statDisplay = newsletterStats.map((s) => {
    if (s.statKey === "subscribers") return { label: "Subscribers", value: s.statValue };
    if (s.statKey === "issues") return { label: "Issues", value: s.statValue };
    if (s.statKey === "open_rate") return { label: "Open rate", value: s.statValue };
    return { label: s.statKey, value: s.statValue };
  });

  // Fallback to settings if no context data
  const finalStats = statDisplay.length > 0
    ? statDisplay
    : [
        { label: "Subscribers", value: settings.newsletter_subscribers || "2.4k" },
        { label: "Issues", value: settings.newsletter_issues || "14" },
        { label: "Open rate", value: settings.newsletter_open_rate || "98%" },
      ];

  // Drive loading -> success -> idle transitions.
  useEffect(() => {
    if (status === "loading") {
      const t = setTimeout(() => setStatus("success"), 1200);
      return () => clearTimeout(t);
    }
    if (status === "success") {
      const t = setTimeout(() => {
        setStatus("idle");
        setEmail("");
        setError("");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    const value = email.trim();
    if (!emailRegex.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("loading");
  };

  return (
    <section id="newsletter" className="py-8 sm:py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
      >
        {/* Left: title + perks + stat strip */}
        <div className="flex flex-col h-full">
          <p className="section-breadcrumb font-mono text-[10px] sm:text-xs text-foreground/55 mb-3 tracking-wider">
            / Newsletter
          </p>
          <h2 className="section-title text-foreground font-semibold text-xl sm:text-2xl md:text-3xl">
            Stay in <span className="text-foreground/55">the loop</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground/75 leading-relaxed max-w-md">
            Occasional notes on web architecture, dev tools, and projects I&apos;m
            building. No spam, unsubscribe anytime.
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <li key={perk.text} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full border border-outline-3 bg-surface-2 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-foreground/75" />
                  </span>
                  <span className="text-sm text-foreground/85">{perk.text}</span>
                </li>
              );
            })}
          </ul>

          {/* Stats strip to balance column height with the form card on the right */}
          <div className="mt-auto pt-6 grid grid-cols-3 gap-3 border-t border-outline-1">
            {finalStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-foreground text-xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-foreground/55 text-[10px] font-mono uppercase tracking-widest mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative rounded-[16px] sm:rounded-[22px] border border-outline-2 bg-card p-4 sm:p-6 md:p-8 shadow-[var(--card-shadow)] overflow-hidden"
        >
          {/* Corner glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-foreground/[0.06] blur-3xl pointer-events-none" />

          <div className="relative min-h-[150px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex flex-col items-center justify-center text-center py-4"
                >
                  {/* Confetti burst — 8 dots flying outward from center */}
                  <div className="absolute left-1/2 top-1/2 pointer-events-none">
                    {confettiDots.map((dot, i) => (
                      <motion.span
                        key={i}
                        style={{ marginLeft: -3, marginTop: -3 }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{ x: dot.x, y: dot.y, opacity: 0, scale: 0.4 }}
                        transition={{
                          duration: 0.9,
                          ease: "easeOut",
                          delay: dot.delay,
                        }}
                        className="absolute w-1.5 h-1.5 rounded-full bg-foreground"
                      />
                    ))}
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Subscribed! Check your inbox.
                  </p>
                  <p className="text-xs text-foreground/70 mt-1">
                    You&apos;ll hear from me soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className={`w-full px-5 py-3 rounded-full border bg-surface-2 text-sm text-foreground placeholder:text-foreground/55 focus:outline-none focus:border-outline-5 focus:ring-2 focus:ring-foreground/10 transition-all ${
                        error ? "border-red-500/60" : "border-outline-4"
                      }`}
                    />
                    {error && (
                      <p className="mt-2 ml-4 text-xs text-red-400">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subscribing…
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
