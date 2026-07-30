"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { useModalStore } from "@/lib/portfolio-data";
import { useArticles } from "@/lib/portfolio-context";

export function ArticlesSection() {
  const { setArticle } = useModalStore();
  const articlesData = useArticles();

  if (articlesData.length === 0) return null;

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
          <p className="section-breadcrumb font-mono text-xs text-foreground/55 mb-3 tracking-wider">
            / Articles
          </p>
          <h2 className="section-title text-foreground font-semibold text-2xl md:text-3xl">
            Latest <span className="text-foreground/55">writing</span>
          </h2>
        </div>
        <motion.a
          href="#articles"
          whileHover={{ scale: 1.03 }}
          className="hidden md:flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors group"
        >
          View all
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </motion.a>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articlesData.map((article, index) => (
          <motion.button
            key={article.id}
            onClick={() => setArticle(article)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="shimmer-on-hover group relative rounded-[22px] border border-outline-2 bg-card p-6 hover:bg-card-hover hover:border-outline-4 transition-all flex flex-col text-left shadow-[var(--card-shadow)] overflow-hidden"
          >
            {/* Number indicator */}
            <span className="absolute top-4 left-4 text-[10px] font-mono text-foreground/40 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Top gradient line that animates on hover */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Corner glow */}
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-foreground/[0.04] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative flex items-center justify-between mb-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/80 bg-surface-3 px-2.5 py-1 rounded-full border border-outline-2">
                {article.tag}
              </span>
              <motion.div
                whileHover={{ rotate: 45, scale: 1.1 }}
                className="w-9 h-9 rounded-full border border-outline-3 flex items-center justify-center text-foreground/50 group-hover:text-foreground group-hover:border-outline-5 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </div>

            <h3 className="relative text-foreground font-semibold text-base mb-2 leading-snug group-hover:text-foreground transition-colors">
              {article.title}
            </h3>
            <p className="relative text-sm text-foreground/60 leading-relaxed mb-6 flex-1">
              {article.excerpt}
            </p>

            <div className="relative flex items-center gap-4 pt-4 border-t border-outline-1 text-xs text-foreground/60 font-mono">
              <span>{article.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
