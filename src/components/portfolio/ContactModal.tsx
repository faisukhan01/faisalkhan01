"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Check, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useModalStore } from "@/lib/portfolio-data";

type Status = "idle" | "loading" | "success" | "error";

export function ContactModal() {
  const { contactOpen, setContact } = useModalStore();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    if (contactOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      // reset after close
      setTimeout(() => {
        setStatus("idle");
        setForm({ name: "", email: "", subject: "", message: "" });
      }, 300);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [contactOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContact(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Failed to send message.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {contactOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
          onClick={() => setContact(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg rounded-[20px] sm:rounded-[28px] border border-outline-3 bg-background p-5 sm:p-6 md:p-8 shadow-[var(--card-shadow)]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-xs text-foreground/40 mb-1 tracking-wider">
                  ... / Contact
                </p>
                <h2 className="text-foreground font-bold text-xl">Send a message</h2>
              </div>
              <button
                onClick={() => setContact(false)}
                className="w-10 h-10 rounded-full border border-outline-4 flex items-center justify-center text-foreground hover:bg-surface-3 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-10"
              >
                <div className="w-16 h-16 rounded-full bg-surface-3 border border-outline-3 flex items-center justify-center mb-5">
                  <Check className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-2">Message sent</h3>
                <p className="text-foreground/50 text-sm max-w-xs">
                  Thanks {form.name.split(" ")[0] || "there"}, your message has been received. I&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setContact(false)}
                  className="mt-6 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label="Name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="Your name"
                    required
                  />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <Field
                  label="Subject"
                  value={form.subject}
                  onChange={(v) => setForm({ ...form, subject: v })}
                  placeholder="What's this about?"
                />
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/40 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className="w-full bg-card border border-outline-3 rounded-[14px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-outline-5 transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400/80 text-sm bg-red-500/[0.08] border border-red-500/[0.15] px-3 py-2 rounded-[10px]"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
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
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/40 mb-2">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-card border border-outline-3 rounded-[14px] px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-outline-5 transition-colors"
      />
    </div>
  );
}
