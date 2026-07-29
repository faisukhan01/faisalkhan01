"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { articlesData, useModalStore } from "@/lib/portfolio-data";

export function ArticlesSection() {
  const { setArticle } = useModalStore();

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
          <p className="font-mono text-xs text-foreground/40 mb-3 tracking-wider">
            ... / Articles
          </p>
          <h2 className="text-foreground font-semibold text-2xl md:text-3xl">
            Latest <span className="text-foreground/40">writing</span>
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
            whileHover={{ y: -4 }}
            className="group rounded-[22px] border border-outline-2 bg-card p-6 hover:bg-card-hover hover:border-outline-4 transition-all flex flex-col text-left shadow-[var(--card-shadow)]"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/60 bg-surface-3 px-2.5 py-1 rounded-full">
                {article.tag}
              </span>
              <motion.div
                whileHover={{ rotate: 45, scale: 1.1 }}
                className="w-9 h-9 rounded-full border border-outline-3 flex items-center justify-center text-foreground/40 group-hover:text-foreground group-hover:border-outline-5 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </div>

            <h3 className="text-foreground font-semibold text-base mb-2 leading-snug group-hover:text-foreground transition-colors">
              {article.title}
            </h3>
            <p className="text-sm text-foreground/50 leading-relaxed mb-6 flex-1">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-outline-1 text-xs text-foreground/30 font-mono">
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
