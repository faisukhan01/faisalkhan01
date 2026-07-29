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
        <p className="font-mono text-xs text-white/40 mb-3 tracking-wider">
          ... / Testimonials
        </p>
        <h2 className="text-white font-semibold text-2xl md:text-3xl">
          What people <span className="text-white/40">say</span>
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
            whileHover={{ y: -4 }}
            className="group rounded-[22px] border border-white/[0.08] bg-[#121212] p-6 hover:bg-[#161616] hover:border-white/[0.14] transition-colors flex flex-col"
          >
            <Quote className="w-6 h-6 text-white/20 mb-4 group-hover:text-white/40 transition-colors" />
            <p className="text-white/70 text-sm leading-relaxed mb-6 flex-1">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <div className="w-9 h-9 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white/70 text-sm font-semibold">
                {t.initial}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{t.author}</p>
                <p className="text-white/40 text-xs font-mono">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
