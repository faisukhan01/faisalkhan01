"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Send, Facebook, Instagram } from "lucide-react";

const socials = [
  { name: "Github", icon: Github, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Telegram", icon: Send, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
];

export function SocialButtons() {
  return (
    <div className="flex flex-wrap gap-3 mt-8">
      {socials.map((social, i) => (
        <motion.a
          key={social.name}
          href={social.href}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.08, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border border-outline-4 bg-surface-1 hover:bg-surface-4 hover:border-outline-5 transition-colors"
        >
          <social.icon className="w-3.5 h-3.5 text-foreground/60 group-hover:text-foreground transition-colors" />
          <span className="text-sm text-foreground/80 group-hover:text-foreground font-medium transition-colors">
            {social.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
