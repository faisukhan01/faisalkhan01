"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { useModalStore } from "@/lib/portfolio-data";

export function ArticleModal() {
  const { activeArticle, setArticle } = useModalStore();

  useEffect(() => {
    if (activeArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeArticle]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setArticle(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setArticle]);

  return (
    <AnimatePresence>
      {activeArticle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8"
          onClick={() => setArticle(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/[0.1] bg-[#0D0D0D]"
          >
            <style>{`
              .article-scroll::-webkit-scrollbar { width: 4px; }
              .article-scroll::-webkit-scrollbar-track { background: transparent; }
              .article-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
            `}</style>

            <div className="article-scroll max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 md:p-8 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/95 to-transparent">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/60 bg-white/[0.06] px-2.5 py-1 rounded-full border border-white/[0.08]">
                  {activeArticle.tag}
                </span>
                <button
                  onClick={() => setArticle(null)}
                  className="w-10 h-10 rounded-full border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/[0.05] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Article body */}
              <div className="px-6 md:px-10 pb-10 -mt-4">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
                  {activeArticle.title}
                </h2>

                {/* Meta */}
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white/70 text-xs font-semibold">
                      {activeArticle.author.charAt(0)}
                    </div>
                    <span className="text-white/60 text-sm">{activeArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs font-mono">
                    <Calendar className="w-3 h-3" />
                    {activeArticle.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs font-mono">
                    <Clock className="w-3 h-3" />
                    {activeArticle.readTime}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-5">
                  {activeArticle.content.map((paragraph, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                      className="text-white/70 text-[15px] leading-[1.8]"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-white/30 text-xs font-mono">
                    Article · {activeArticle.readTime} read
                  </span>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors animated-underline"
                  >
                    Share article
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
