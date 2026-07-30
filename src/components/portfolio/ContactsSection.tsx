"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, ArrowUpRight, Send, Clock, Check, Loader2 } from "lucide-react";
import { SocialButtons } from "./SocialButtons";
import { useModalStore } from "@/lib/portfolio-data";
import { useState, useCallback } from "react";

/* ── Floating label input ── */
function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  maxLength,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={maxLength}
        className={`peer w-full bg-transparent border rounded-xl px-4 pt-5 pb-2 text-foreground text-sm outline-none transition-colors duration-200 ${
          error
            ? "border-red-500/60 focus:border-red-500/80"
            : "border-outline-3 focus:border-outline-5"
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isActive
            ? "top-1.5 text-[10px] font-mono text-foreground/40"
            : "top-1/2 -translate-y-1/2 text-sm text-foreground/30"
        }`}
      >
        {label}
      </label>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500/80 text-[10px] font-mono mt-1.5 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ── Floating label textarea ── */
function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  error,
  maxLength = 500,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={maxLength}
        rows={4}
        className={`peer w-full bg-transparent border rounded-xl px-4 pt-5 pb-2 text-foreground text-sm outline-none resize-none transition-colors duration-200 ${
          error
            ? "border-red-500/60 focus:border-red-500/80"
            : "border-outline-3 focus:border-outline-5"
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          isActive
            ? "top-1.5 text-[10px] font-mono text-foreground/40"
            : "top-5 text-sm text-foreground/30"
        }`}
      >
        {label}
      </label>
      {/* Character count */}
      <div className="absolute bottom-2 right-3 flex items-center gap-1">
        <span
          className={`text-[10px] font-mono tabular-nums ${
            value.length > maxLength * 0.9
              ? "text-amber-500/70"
              : "text-foreground/20"
          }`}
        >
          {value.length}
        </span>
        <span className="text-[10px] font-mono text-foreground/15">/</span>
        <span className="text-[10px] font-mono text-foreground/20 tabular-nums">
          {maxLength}
        </span>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500/80 text-[10px] font-mono mt-1.5 ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ── Confetti particles ── */
function ConfettiParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: -(Math.random() * 120 + 40),
    rotate: Math.random() * 360,
    scale: Math.random() * 0.6 + 0.4,
    color: [
      "bg-emerald-500/70",
      "bg-amber-500/70",
      "bg-violet-500/70",
      "bg-rose-500/70",
      "bg-cyan-500/70",
    ][i % 5],
    delay: Math.random() * 0.2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, rotate: 0, scale: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            rotate: p.rotate,
            scale: p.scale,
            opacity: 0,
          }}
          transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
          className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${p.color}`}
        />
      ))}
    </div>
  );
}

/* ── Success animation ── */
function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center py-12 relative"
    >
      <ConfettiParticles />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4"
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <Check className="w-8 h-8 text-emerald-500" />
        </motion.div>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-foreground font-semibold text-lg mb-1"
      >
        Message sent!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-foreground/50 text-sm text-center"
      >
        I&apos;ll get back to you within 24 hours.
      </motion.p>
    </motion.div>
  );
}

/* ── Main ContactsSection ── */
export function ContactsSection() {
  const { setContact } = useModalStore();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message is too short (min 10 characters)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setSending(true);
      // Simulate sending
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSending(false);
      setSent(true);
    },
    [validate]
  );

  return (
    <section id="contacts" className="py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-mono text-xs text-foreground/50 mb-8 tracking-wider"
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

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] font-medium text-foreground leading-[1.1] tracking-[-0.01em] mb-6" style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}>
              Let&apos;s build
              <br />
              <span className="text-foreground/40">something</span>
              <br />
              together.
            </h2>
            <p className="text-foreground/70 text-base leading-relaxed max-w-md mb-8">
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
                href="mailto:hello@faisalkhan.dev"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors animated-underline"
              >
                or email directly
              </a>
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-3 text-foreground/60 text-sm">
                <div className="w-10 h-10 rounded-full border border-outline-3 flex items-center justify-center bg-surface-2">
                  <MapPin className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs font-mono uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-foreground/90">Remote / Worldwide</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-foreground/60 text-sm">
                <div className="w-10 h-10 rounded-full border border-outline-3 flex items-center justify-center bg-surface-2">
                  <Mail className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs font-mono uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-foreground/90">hello@faisalkhan.dev</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-foreground/60 text-sm">
                <div className="w-10 h-10 rounded-full border border-outline-3 flex items-center justify-center bg-surface-2">
                  <Clock className="w-4 h-4 text-foreground/70" />
                </div>
                <div>
                  <p className="text-foreground/40 text-xs font-mono uppercase tracking-widest mb-0.5">Response</p>
                  <p className="text-foreground/90">Within 24 hours</p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-outline-1">
                <p className="text-foreground/40 text-xs font-mono uppercase tracking-widest mb-3">Follow</p>
                <SocialButtons />
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-outline-2 bg-surface-1/50 p-6 md:p-8">
            <AnimatePresence mode="wait">
              {sent ? (
                <SuccessAnimation key="success" />
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <FloatingInput
                    id="contact-name"
                    label="Your name"
                    value={formData.name}
                    onChange={(v) => {
                      setFormData((d) => ({ ...d, name: v }));
                      if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                    }}
                    error={errors.name}
                  />

                  <FloatingInput
                    id="contact-email"
                    label="Email address"
                    type="email"
                    value={formData.email}
                    onChange={(v) => {
                      setFormData((d) => ({ ...d, email: v }));
                      if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                    }}
                    error={errors.email}
                  />

                  <FloatingTextarea
                    id="contact-message"
                    label="Your message"
                    value={formData.message}
                    onChange={(v) => {
                      setFormData((d) => ({ ...d, message: v }));
                      if (errors.message) setErrors((e) => ({ ...e, message: "" }));
                    }}
                    error={errors.message}
                    maxLength={500}
                  />

                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={{ scale: sending ? 1 : 1.02 }}
                    whileTap={{ scale: sending ? 1 : 0.98 }}
                    className="group flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send message
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
