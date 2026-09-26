"use client";

import { useState } from "react";

/**
 * Maps a technology name to a locally-hosted brand SVG (public/tech-icons).
 * Icons were generated from the `simple-icons` package with brand colors,
 * baked at build time — no runtime CDN dependency.
 *
 * Technologies without an available brand icon fall back to a small
 * monogram chip so the layout never breaks.
 */

const nameToSlug: Record<string, string> = {
  // Frontend
  "react": "react",
  "react.js": "react",
  "reactjs": "react",
  "react.js/next.js": "react",
  "next.js": "nextdotjs",
  "nextjs": "nextdotjs",
  "typescript": "typescript",
  "javascript": "javascript",
  "tailwind css": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "tailwind": "tailwindcss",
  "three.js": "threedotjs",
  "threejs": "threedotjs",
  "html5": "html5",
  "html": "html5",
  "css3": "css",
  "css": "css",
  "greensock": "greensock",
  "gsap": "greensock",

  // Backend
  "node.js": "nodedotjs",
  "nodejs": "nodedotjs",
  "express.js": "express",
  "expressjs": "express",
  "express": "express",
  "fastapi": "fastapi",
  "django": "django",
  "python": "python",

  // Mobile
  "react native": "react",
  "react-native": "react",
  "reactnative": "react",
  "kotlin": "kotlin",
  "flutter": "flutter",
  "dart": "dart",
  "firebase": "firebase",
  "android": "android",

  // Game dev
  "unity": "unity",
  "unreal engine": "unrealengine",
  "unrealengine": "unrealengine",

  // Languages
  "c": "c",
  "c++": "cplusplus",
  "cplusplus": "cplusplus",

  // Data
  "postgresql": "postgresql",
  "postgres": "postgresql",
  "sqlite": "sqlite",
  "prisma": "prisma",

  // Tools
  "git": "git",
  "github": "github",
  "docker": "docker",
  "claude": "claude",
  "gemini": "googlegemini",
  "google gemini": "googlegemini",
};

/** Technologies with no brand icon available — shown as monogram chips. */
function monogram(name: string): string {
  const upper = name.toUpperCase().replace(/[^A-Z0-9+#. ]/g, "");
  if (upper.length <= 3) return upper;
  if (upper.includes("#")) return upper.split(" ")[0].slice(0, 2);
  return upper.slice(0, 2);
}

const isAppleLike = (name: string) => {
  const n = name.toLowerCase();
  return n === "ios" || n === "apple";
};

export function TechIcon({
  name,
  className = "w-[18px] h-[18px]",
}: {
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const key = name.toLowerCase().trim();
  const slug = nameToSlug[key];

  if (isAppleLike(name)) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center font-semibold text-foreground/70 ${className}`}
        style={{ fontSize: "0.7em" }}
      >
        
      </span>
    );
  }

  if (!slug || failed) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center rounded-[4px] bg-foreground/[0.07] font-mono font-semibold text-foreground/60 leading-none ${className}`}
        style={{ fontSize: "0.55em", letterSpacing: "-0.02em" }}
      >
        {monogram(name)}
      </span>
    );
  }

  return (
    <img
      src={`/tech-icons/${slug}.svg`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-contain shrink-0 ${className}`}
      draggable={false}
    />
  );
}
