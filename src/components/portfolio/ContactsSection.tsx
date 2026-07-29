"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { SocialButtons } from "./SocialButtons";

export function ContactsSection() {
  return (
    <section id="contacts" className="py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-white/40 mb-8 tracking-wider"
      >
        ... / Contacts
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-12 lg:p-16 relative overflow-hidden"
      >
        {/* Decorative large circle */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full border border-white/[0.03] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-bold text-white leading-[0.95] tracking-[-0.02em] mb-6">
              Let&apos;s build
              <br />
              <span className="text-white/40">something</span>
              <br />
              together.
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-md mb-8">
              Open for new projects, freelance work, and interesting collaborations. Drop a line and I&apos;ll get back within 24 hours.
            </p>

            <motion.a
              href="mailto:hello@nikitakhvatov.dev"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-white text-[#0D0D0D] px-7 py-3.5 rounded-full font-semibold text-sm tracking-wide hover:bg-white/90 transition-colors group"
            >
              <Mail className="w-4 h-4" />
              hello@nikitakhvatov.dev
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/60 text-sm">
              <div className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white/50" />
              </div>
              <div>
                <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-0.5">Location</p>
                <p className="text-white/80">Remote / Worldwide</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white/60 text-sm">
              <div className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center">
                <Mail className="w-4 h-4 text-white/50" />
              </div>
              <div>
                <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-0.5">Email</p>
                <p className="text-white/80">hello@nikitakhvatov.dev</p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-white/[0.06]">
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">Follow</p>
              <SocialButtons />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
