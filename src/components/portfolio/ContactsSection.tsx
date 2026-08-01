"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, ArrowUpRight, Send, Clock, Check, Loader2 } from "lucide-react";
import { SocialButtons } from "./SocialButtons";
import { useModalStore } from "@/lib/portfolio-data";
import { usePortfolioSettings } from "@/lib/portfolio-context";
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
            ? "top-1.5 text-[10px] font-mono text-foreground/60"
            : "top-1/2 -translate-y-1/2 text-sm text-foreground/50"
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
            ? "top-1.5 text-[10px] font-mono text-foreground/60"
            : "top-5 text-sm text-foreground/50"
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
              : "text-foreground/45"
          }`}
        >
          {value.length}
        </span>
        <span className="text-[10px] font-mono text-foreground/40">/</span>
        <span className="text-[10px] font-mono text-foreground/45 tabular-nums">
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
        className="text-foreground/70 text-sm text-center"
      >
        I&apos;ll get back to you within 24 hours.
      </motion.p>
    </motion.div>
  );
}

/* ── Main ContactsSection ── */
export function ContactsSection() {
  const { setContact } = useModalStore();
  const settings = usePortfolioSettings();

  const contactHeading = settings.contact_heading || "Let's build";
  const contactSubheading = settings.contact_subheading || "Open for new projects, freelance work, and interesting collaborations. Drop a line and I'll get back within 24 hours.";
  const contactLocation = settings.contact_location || "Lahore, Pakistan";
  const contactEmail = settings.contact_email || "faisalkhan544814@gmail.com";
  const contactResponseTime = settings.contact_response_time || "Within 24 hours";

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
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setSent(true);
        } else {
          setErrors({ form: data.error || 'Something went wrong. Please try again.' });
        }
      } catch {
        setErrors({ form: 'Network error. Please try again.' });
      } finally {
        setSending(false);
      }
    },
    [validate, formData]
  );

  return (
    <section id="contacts" className="py-6 sm:py-16 md:py-24">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-mono text-[10px] sm:text-xs text-foreground/70 mb-5 sm:mb-8 tracking-wider"
      >
        ... / Contacts
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[12px] sm:rounded-[20px] md:rounded-[28px] border border-outline-3 bg-gradient-to-b from-surface-2 to-transparent p-3.5 sm:p-6 md:p-10 lg:p-16 relative overflow-hidden shadow-[var(--card-shadow)]"
      >
        {/* Decorative large circles */}
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full border border-[var(--decorative-circle)] pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full border border-[var(--decorative-circle)] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-[1.35rem] sm:text-[1.75rem] md:text-[2.5rem] lg:text-[3rem] font-medium text-foreground leading-[1.1] tracking-[-0.01em] mb-3 sm:mb-6" style={{ fontFamily: "var(--font-source-serif), Georgia, serif" }}>
              {contactHeading.includes("build") ? (
                <>
                  Let&apos;s build
                  <br />
                  <span className="text-foreground/40">something</span>
                  <br />
                  together.
                </>
              ) : (
                contactHeading
              )}
            </h2>
            <p className="text-foreground/75 text-sm sm:text-base leading-relaxed max-w-md mb-6 sm:mb-8">
              {contactSubheading}
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
                href={`mailto:${contactEmail}`}
                className="text-sm text-foreground/80 hover:text-foreground transition-colors animated-underline"
              >
                or email directly
              </a>
            </div>

            {/* Contact info — in a row */}
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="flex items-center gap-2.5 text-foreground/75 text-sm">
                <div className="w-9 h-9 rounded-full border border-outline-3 flex items-center justify-center bg-surface-2">
                  <MapPin className="w-3.5 h-3.5 text-foreground/80" />
                </div>
                <div>
                  <p className="text-foreground/60 text-[10px] font-mono uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-foreground/90 text-xs sm:text-sm">{contactLocation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-foreground/75 text-sm">
                <div className="w-9 h-9 rounded-full border border-outline-3 flex items-center justify-center bg-surface-2">
                  <Mail className="w-3.5 h-3.5 text-foreground/80" />
                </div>
                <div>
                  <p className="text-foreground/60 text-[10px] font-mono uppercase tracking-widest mb-0.5">Email</p>
                  <p className="text-foreground/90 text-xs sm:text-sm">{contactEmail}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-foreground/75 text-sm">
                <div className="w-9 h-9 rounded-full border border-outline-3 flex items-center justify-center bg-surface-2">
                  <Clock className="w-3.5 h-3.5 text-foreground/80" />
                </div>
                <div>
                  <p className="text-foreground/60 text-[10px] font-mono uppercase tracking-widest mb-0.5">Response</p>
                  <p className="text-foreground/90 text-xs sm:text-sm">{contactResponseTime}</p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-outline-1">
                <p className="text-foreground/60 text-xs font-mono uppercase tracking-widest mb-3">Follow</p>
                <SocialButtons />
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-outline-3 bg-surface-1/50 p-4 sm:p-6 md:p-8">
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

                  {errors.form && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500/80 text-xs font-mono text-center"
                    >
                      {errors.form}
                    </motion.p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
