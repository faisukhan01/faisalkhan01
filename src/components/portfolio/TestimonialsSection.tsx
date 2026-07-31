"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Nikita shipped a complex microservices migration ahead of schedule with zero downtime. His code is some of the cleanest I've reviewed in 15 years.",
    author: "Alex Petrov",
    role: "CTO, ITHUB",
    initial: "A",
  },
  {
    quote:
      "Rare combination of strong engineering instincts and genuine product sense. He pushed back on scope and the result was far better for it.",
    author: "Maria Schmidt",
    role: "Product Lead, VK Labs",
    initial: "M",
  },
  {
    quote:
      "The real-time dashboard he built handled 10x our expected traffic without breaking a sweat. Genuinely a senior-level engineer.",
    author: "Dmitri Volkov",
    role: "Engineering Manager, SN Inc.",
    initial: "D",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="section-breadcrumb font-mono text-xs text-foreground/55 mb-3 tracking-wider">
          / Testimonials
        </p>
        <h2 className="section-title text-foreground font-semibold text-2xl md:text-3xl">
          What people <span className="text-foreground/55">say</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="gradient-border-hover group relative rounded-[22px] border border-outline-2 bg-card p-6 hover:bg-card-hover hover:border-outline-4 transition-all flex flex-col shadow-[var(--card-shadow)] overflow-hidden"
          >
            {/* Background decorative quote */}
            <Quote className="absolute -top-2 -right-2 w-20 h-20 text-foreground/[0.04] pointer-events-none" />
            <Quote className="relative w-6 h-6 text-foreground/55 mb-4 group-hover:text-foreground/80 transition-colors" />

            {/* Star rating */}
            <div className="relative flex items-center gap-0.5 mb-3">
              {[...Array(5)].map((_, si) => (
                <svg key={si} className="w-3.5 h-3.5 text-foreground/65 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <p className="relative text-foreground/90 text-sm leading-relaxed mb-6 flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="relative flex items-center gap-3 pt-4 border-t border-outline-1">
              <div className="w-9 h-9 rounded-full bg-surface-3 border border-outline-3 flex items-center justify-center text-foreground text-sm font-semibold group-hover:bg-surface-4 transition-colors">
                {t.initial}
              </div>
              <div>
                <p className="text-foreground text-sm font-medium">{t.author}</p>
                <p className="text-foreground/70 text-xs font-mono">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
