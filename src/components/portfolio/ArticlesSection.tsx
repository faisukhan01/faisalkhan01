"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";

const articles = [
  {
    title: "The simplest example is kafka + golang",
    excerpt:
      "This article presents a simple way to implement a microservice architecture using Kafka, Golang and Docker.",
    tag: "Microservices",
    date: "Mar 14, 2024",
    readTime: "8 min",
  },
  {
    title: "Why I switched from REST to gRPC for internal services",
    excerpt:
      "A practical comparison between REST and gRPC, and how protocol buffers transformed our service-to-service communication.",
    tag: "Backend",
    date: "Jan 22, 2024",
    readTime: "12 min",
  },
  {
    title: "State management in 2024: Redux Toolkit vs Zustand",
    excerpt:
      "An in-depth look at modern state management solutions for React applications and when to choose each one.",
    tag: "Frontend",
    date: "Nov 05, 2023",
    readTime: "10 min",
  },
];

export function ArticlesSection() {
  return (
    <section id="articles" className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <p className="font-mono text-xs text-white/40 mb-3 tracking-wider">
            ... / Articles
          </p>
          <h2 className="text-white font-semibold text-2xl md:text-3xl">
            Latest <span className="text-white/40">writing</span>
          </h2>
        </div>
        <motion.a
          href="#articles"
          whileHover={{ scale: 1.03 }}
          className="hidden md:flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group"
        >
          View all
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <motion.a
            key={article.title}
            href="#articles"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group rounded-[22px] border border-white/[0.08] bg-[#121212] p-6 hover:bg-[#161616] hover:border-white/[0.14] transition-all flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/60 bg-white/[0.06] px-2.5 py-1 rounded-full">
                {article.tag}
              </span>
              <motion.div
                whileHover={{ rotate: 45, scale: 1.1 }}
                className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </div>

            <h3 className="text-white font-semibold text-base mb-2 leading-snug group-hover:text-white transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06] text-xs text-white/30 font-mono">
              <span>{article.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
