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
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.12] text-sm text-white/80 hover:text-white transition-colors"
        >
          <social.icon className="w-3.5 h-3.5" />
          <span className="font-medium">{social.name}</span>
        </motion.a>
      ))}
    </div>
  );
}
