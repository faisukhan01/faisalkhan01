"use client";

import { motion } from "framer-motion";
import { Code2, Server, Palette, Cloud, Gauge, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Application Development",
    description: "Custom web apps built with React, Next.js, and TypeScript. From SaaS dashboards to customer portals.",
    features: ["React / Next.js", "TypeScript", "Real-time features"],
    accent: "from-foreground/[0.06] to-transparent",
    span: "lg:col-span-2",
  },
  {
    icon: Server,
    title: "API & Backend",
    description: "Scalable REST and gRPC APIs in Golang and Node.js.",
    features: ["Golang", "PostgreSQL", "Microservices"],
    accent: "from-foreground/[0.04] to-transparent",
    span: "",
  },
  {
    icon: Palette,
    title: "UI/UX Engineering",
    description: "Pixel-perfect, accessible interfaces with design systems.",
    features: ["Tailwind CSS", "Design systems", "a11y"],
    accent: "from-foreground/[0.04] to-transparent",
    span: "",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "CI/CD pipelines, Docker containerization, and AWS infrastructure setup for reliable deployments.",
    features: ["Docker", "AWS", "GitHub Actions"],
    accent: "from-foreground/[0.06] to-transparent",
    span: "lg:col-span-2",
  },
];

const metrics = [
  { icon: Gauge, label: "Avg. Lighthouse score", value: "98" },
  { icon: ShieldCheck, label: "Uptime guarantee", value: "99.9%" },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
      >
        <div>
          <p className="section-breadcrumb font-mono text-xs text-foreground/50 mb-3 tracking-wider">
            / Services
          </p>
          <h2 className="section-title text-foreground font-semibold text-2xl md:text-3xl">
            What I <span className="text-foreground/40">do</span>
          </h2>
        </div>
        <div className="flex items-center gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-outline-3 bg-surface-2 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-foreground/60" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold tabular-nums">{m.value}</p>
                  <p className="text-foreground/40 text-[10px] font-mono uppercase tracking-widest">{m.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`group relative rounded-[22px] border border-outline-2 bg-card p-6 md:p-7 hover:bg-card-hover hover:border-outline-4 transition-all shadow-[var(--card-shadow)] overflow-hidden ${service.span}`}
            >
              {/* Gradient accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Corner glow */}
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-foreground/[0.04] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative">
                {/* Icon */}
                <div className="w-11 h-11 rounded-2xl border border-outline-3 bg-surface-2 flex items-center justify-center mb-5 group-hover:border-outline-4 group-hover:bg-surface-3 transition-colors">
                  <Icon className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                </div>

                <h3 className="text-foreground font-semibold text-lg mb-2 leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-foreground/60 leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-1.5">
                  {service.features.map((feat) => (
                    <span
                      key={feat}
                      className="text-[10px] font-mono uppercase tracking-wider text-foreground/70 bg-surface-3 px-2 py-1 rounded-full border border-outline-2"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Number badge */}
              <span className="absolute top-6 right-6 text-[10px] font-mono text-foreground/20 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
