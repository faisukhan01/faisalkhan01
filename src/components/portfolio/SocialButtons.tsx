"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Globe, Twitter } from "lucide-react";
import { usePortfolioData } from "@/lib/portfolio-context";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
  twitter: Twitter,
  Github: Github,
  LinkedIn: Linkedin,
  Website: Globe,
  Twitter: Twitter,
};

export function SocialButtons() {
  const { data } = usePortfolioData();

  const socials = (data.socialLinks.length > 0
    ? data.socialLinks.map((link) => {
        const Icon = iconMap[link.icon] || iconMap[link.platform] || Globe;
        return {
          name: link.name,
          icon: <Icon className="w-4 h-4" />,
          href: link.url,
        };
      })
    : [
        { name: "Github", icon: <Github className="w-4 h-4" />, href: "https://github.com/faisukhan01" },
        { name: "LinkedIn", icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com/in/faisal-arslan-khan" },
      ]
  ).filter((s) => s.name !== "Website");

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
          className="group flex items-center gap-2 px-3.5 py-2.5 sm:py-2 rounded-full border border-outline-3 bg-surface-2 hover:bg-surface-4 hover:border-outline-5 transition-all duration-200 min-h-[44px] sm:min-h-0"
          aria-label={social.name}
        >
          <span className="text-foreground/70 group-hover:text-foreground transition-colors">
            {social.icon}
          </span>
          <span className="text-[11px] font-medium text-foreground/60 group-hover:text-foreground transition-colors">
            {social.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
