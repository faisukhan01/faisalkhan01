"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight, Send, Clock } from "lucide-react";
import { SocialButtons } from "./SocialButtons";
import { useModalStore } from "@/lib/portfolio-data";

export function ContactsSection() {
  const { setContact } = useModalStore();

  return (
    <section id="contacts" className="py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-foreground/40 mb-8 tracking-wider"
      >
        ... / Contacts
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] border border-outline-2 bg-gradient-to-b from-surface-2 to-transparent p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-[var(--card-shadow)]"
      >
        {/* Decorative large circles */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full border border-[var(--decorative-circle)] pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full border border-[var(--decorative-circle)] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] font-bold text-foreground leading-[0.95] tracking-[-0.02em] mb-6">
              Let&apos;s build
              <br />
              <span className="text-foreground/40">something</span>
              <br />
              together.
            </h2>
            <p className="text-foreground/50 text-base leading-relaxed max-w-md mb-8">
              Open for new projects, freelance work, and interesting collaborations. Drop a line and I&apos;ll get back within 24 hours.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                onClick={() => setContact(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 bg-primary text-primary-foreground pl-7 pr-2 py-2 rounded-full font-semibold text-sm tracking-wide overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Start a project
                </span>
                <span className="relative z-10 w-9 h-9 rounded-full bg-primary-foreground flex items-center justify-center text-primary transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </motion.button>
              <a
                href="mailto:hello@nikitakhvatov.dev"
                className="text-sm text-foreground/60 hover:text-foreground transition-colors animated-underline"
              >
                or email directly
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-foreground/60 text-sm">
              <div className="w-10 h-10 rounded-full border border-outline-3 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-foreground/50" />
              </div>
              <div>
                <p className="text-foreground/30 text-xs font-mono uppercase tracking-widest mb-0.5">Location</p>
                <p className="text-foreground/80">Remote / Worldwide</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-foreground/60 text-sm">
              <div className="w-10 h-10 rounded-full border border-outline-3 flex items-center justify-center">
                <Mail className="w-4 h-4 text-foreground/50" />
              </div>
              <div>
                <p className="text-foreground/30 text-xs font-mono uppercase tracking-widest mb-0.5">Email</p>
                <p className="text-foreground/80">hello@nikitakhvatov.dev</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-foreground/60 text-sm">
              <div className="w-10 h-10 rounded-full border border-outline-3 flex items-center justify-center">
                <Clock className="w-4 h-4 text-foreground/50" />
              </div>
              <div>
                <p className="text-foreground/30 text-xs font-mono uppercase tracking-widest mb-0.5">Response</p>
                <p className="text-foreground/80">Within 24 hours</p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-outline-1">
              <p className="text-foreground/30 text-xs font-mono uppercase tracking-widest mb-3">Follow</p>
              <SocialButtons />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
