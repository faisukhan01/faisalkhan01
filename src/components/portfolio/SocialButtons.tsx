"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Send, Facebook, Instagram } from "lucide-react";

const socials = [
  { name: "Github", icon: <Github className="w-4 h-4" />, href: "#" },
  { name: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, href: "#" },
  { name: "Telegram", icon: <Send className="w-4 h-4" />, href: "#" },
  { name: "Facebook", icon: <Facebook className="w-4 h-4" />, href: "#" },
  { name: "Instagram", icon: <Instagram className="w-4 h-4" />, href: "#" },
];

export function SocialButtons() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {socials.map((social, i) => (
        <motion.a
          key={social.name}
          href={social.href}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.05, duration: 0.4 }}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full border border-outline-3 bg-surface-1 hover:bg-surface-4 hover:border-outline-5 transition-all duration-200"
          aria-label={social.name}
        >
          <span className="text-foreground/60 group-hover:text-foreground transition-colors">
            {social.icon}
          </span>
          <span className="text-[11px] font-medium text-foreground/50 group-hover:text-foreground/80 transition-colors">
            {social.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
