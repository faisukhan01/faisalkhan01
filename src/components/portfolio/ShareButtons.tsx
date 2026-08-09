"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Linkedin, Link2, Check, Share2 } from "lucide-react";

type ShareButtonsProps = {
  title: string;
  description?: string;
  /** slug of the project, used to build the share URL */
  slug: string;
};

/**
 * Social share buttons for a project case study.
 * - X (Twitter)
 * - LinkedIn
 * - Copy link (with success feedback)
 *
 * Falls back to the native Web Share API on supporting devices when the
 * user clicks the primary "Share" chip.
 */
export function ShareButtons({ title, description, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Build absolute URL (client-side). Falls back gracefully during SSR.
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/projects/${slug}`
      : `https://faisalkhan01.vercel.app/projects/${slug}`;

  const shareText = description
    ? `${title} — ${description}`
    : `${title} · Case study by Faisal Khan`;

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = shareUrl;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Silent failure — share is non-critical.
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({
        title,
        text: shareText,
        url: shareUrl,
      });
    } catch {
      // User cancelled — no-op.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-foreground/40 pr-1">
        <Share2 className="w-3 h-3" />
        Share
      </span>

      {/* X / Twitter */}
      <a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="group flex items-center justify-center w-9 h-9 rounded-full border border-outline-2 bg-surface-2/40 hover:bg-surface-3/60 hover:border-outline-3 transition-all duration-300"
      >
        <Twitter className="w-3.5 h-3.5 text-foreground/55 group-hover:text-foreground transition-colors" />
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="group flex items-center justify-center w-9 h-9 rounded-full border border-outline-2 bg-surface-2/40 hover:bg-surface-3/60 hover:border-outline-3 transition-all duration-300"
      >
        <Linkedin className="w-3.5 h-3.5 text-foreground/55 group-hover:text-foreground transition-colors" />
      </a>

      {/* Copy link */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link"
        className="group relative flex items-center justify-center w-9 h-9 rounded-full border border-outline-2 bg-surface-2/40 hover:bg-surface-3/60 hover:border-outline-3 transition-all duration-300"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            </motion.span>
          ) : (
            <motion.span
              key="link"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Link2 className="w-3.5 h-3.5 text-foreground/55 group-hover:text-foreground transition-colors" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Native share (only on devices that support it) */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="More sharing options"
          className="hidden xs:inline-flex sm:flex items-center gap-1.5 h-9 px-3 rounded-full border border-outline-2 bg-surface-2/40 hover:bg-surface-3/60 hover:border-outline-3 transition-all duration-300 text-[10px] font-mono uppercase tracking-wider text-foreground/55 hover:text-foreground"
        >
          <Share2 className="w-3 h-3" />
          More
        </button>
      )}

      {/* Copied confirmation toast */}
      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="ml-1 text-[10px] font-mono uppercase tracking-widest text-emerald-500"
          >
            Link copied
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
