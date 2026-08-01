"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { projectsData, articlesData } from "./portfolio-data";

// Types
export type ProjectDetail = {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  tag: string;
  year: string;
  client: string;
  duration: string;
  role: string;
  overview: string;
  challenge: string;
  solution: string;
  techStack: string[];
  results: { label: string; value: string }[];
  liveUrl: string;
  repoUrl: string;
};

export type ArticleDetail = {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  tag: string;
  date: string;
  readTime: string;
  author: string;
};

export type ServiceItem = {
  id: number;
  title: string;
  description: string;
  features: string[];
  icon: string;
  sortOrder: number;
  published: number;
};

export type TestimonialItem = {
  id: number;
  author: string;
  role: string;
  quote: string;
  avatar: string;
  sortOrder: number;
  published: number;
};

export type WorkExperienceItem = {
  id: number;
  year: string;
  duration: string;
  company: string;
  role: string;
  tech: string;
  isOngoing: number;
  sortOrder: number;
  published: number;
};

export type AchievementItem = {
  id: number;
  value: string;
  label: string;
  detail: string;
  sortOrder: number;
  published: number;
};

export type SkillItem = {
  id: number;
  category: string;
  count: string;
  proficiency: number;
  technologies: string[];
  sortOrder: number;
  published: number;
};

export type SkillRadarItem = {
  id: number;
  skill: string;
  value: number;
  sortOrder: number;
  published: number;
};

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  published: number;
};

export type ReadingListItem = {
  id: number;
  title: string;
  author: string;
  progress: number;
  gradient: string;
  accent: string;
  sortOrder: number;
  published: number;
};

export type NowPlayingItem = {
  id: number;
  type: string;
  label: string;
  title: string;
  subtitle: string;
  sortOrder: number;
  published: number;
};

export type TechStackItem = {
  id: number;
  name: string;
  icon: string;
  sortOrder: number;
  published: number;
};

export type SocialLinkItem = {
  id: number;
  name: string;
  platform: string;
  url: string;
  icon: string;
  sortOrder: number;
  published: number;
};

export type HeroRoleItem = {
  id: number;
  role: string;
  sortOrder: number;
  published: number;
};

export type ProcessTimelineItem = {
  id: number;
  step: number;
  title: string;
  description: string;
  sortOrder: number;
  published: number;
};

export type TimezoneItem = {
  id: number;
  label: string;
  timezone: string;
  sortOrder: number;
  published: number;
};

export type NewsletterStatItem = {
  id: number;
  statKey: string;
  statValue: string;
  sortOrder: number;
};

export type PortfolioData = {
  settings: Record<string, string>;
  heroRoles: string[];
  projects: ProjectDetail[];
  articles: ArticleDetail[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  workExperience: WorkExperienceItem[];
  achievements: AchievementItem[];
  skills: SkillItem[];
  skillsRadar: SkillRadarItem[];
  faq: FaqItem[];
  readingList: ReadingListItem[];
  nowPlaying: NowPlayingItem[];
  techStack: TechStackItem[];
  socialLinks: SocialLinkItem[];
  heroRolesList: HeroRoleItem[];
  processTimeline: ProcessTimelineItem[];
  timezones: TimezoneItem[];
  newsletterStats: NewsletterStatItem[];
};

const defaultData: PortfolioData = {
  settings: {
    site_name: "Faisal Khan",
    hero_name: "Faisal Khan",
    hero_title: "Full-stack Developer",
    about_text: "Full-Stack Software Engineer with hands-on experience building and shipping production web applications using Next.js, React, Node.js, Express.js, FastAPI, and PostgreSQL.",
    about_years: "1+",
    about_projects: "3+",
    about_technologies: "15+",
    contact_heading: "Let's build something together.",
    contact_subheading: "Open for new projects, freelance work, and interesting collaborations.",
    contact_location: "Lahore, Pakistan",
    contact_email: "faisalkhan544814@gmail.com",
    contact_response_time: "Within 24 hours",
    status_banner_text: "Available for freelance projects — Open to opportunities",
    nav_logo_first: "Faisal",
    nav_logo_last: "Khan",
  },
  heroRoles: ["Full-stack Developer", "Next.js Engineer", "AI Integration Specialist", "Three.js Enthusiast"],
  projects: projectsData.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image,
    gallery: p.gallery,
    tag: p.tag,
    year: p.year,
    client: p.client,
    duration: p.duration,
    role: p.role,
    overview: p.overview,
    challenge: p.challenge,
    solution: p.solution,
    techStack: p.techStack,
    results: p.results,
    liveUrl: p.liveUrl,
    repoUrl: p.repoUrl,
  })),
  articles: articlesData.map(a => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    tag: a.tag,
    date: a.date,
    readTime: a.readTime,
    author: a.author,
  })),
  services: [
    { id: 1, title: "Full-Stack Web Development", description: "Custom web applications built with Next.js, React, Node.js, and FastAPI", features: ["Next.js", "React", "TypeScript"], icon: "code", sortOrder: 0, published: 1 },
    { id: 2, title: "API & Backend Services", description: "Scalable REST APIs with Node.js, Express.js, and FastAPI", features: ["Node.js", "Express.js", "FastAPI"], icon: "server", sortOrder: 1, published: 1 },
    { id: 3, title: "Interactive UI & 3D", description: "Responsive interfaces with Three.js for interactive 3D web experiences", features: ["Three.js", "Tailwind CSS", "Responsive"], icon: "layout", sortOrder: 2, published: 1 },
    { id: 4, title: "AI Integration", description: "AI-powered features using GPT, Claude, and Gemini", features: ["GPT", "Claude", "Gemini"], icon: "brain", sortOrder: 3, published: 1 },
  ],
  testimonials: [
    { id: 1, author: "Alex Petrov", role: "CTO, ITHUB", quote: "Faisal shipped a complex microservices migration ahead of schedule with zero downtime. His code is some of the cleanest I've reviewed in 15 years.", avatar: "", sortOrder: 0, published: 1 },
    { id: 2, author: "Maria Schmidt", role: "Product Lead, VK Labs", quote: "Rare combination of strong engineering instincts and genuine product sense. He pushed back on scope and the result was far better for it.", avatar: "", sortOrder: 1, published: 1 },
    { id: 3, author: "Dmitri Volkov", role: "Engineering Manager, SN Inc.", quote: "The real-time dashboard he built handled 10x our expected traffic without breaking a sweat. Genuinely a senior-level engineer.", avatar: "", sortOrder: 2, published: 1 },
  ],
  workExperience: [
    { id: 1, year: "2024 — Present", duration: "Ongoing", company: "CodeSquad", role: "Associate Software Engineer", tech: "Next.js, Node.js, FastAPI", isOngoing: 1, sortOrder: 0, published: 1 },
    { id: 2, year: "2025 — Present", duration: "Ongoing", company: "Freelance", role: "Full-Stack Developer", tech: "Next.js, Express.js, FastAPI", isOngoing: 1, sortOrder: 1, published: 1 },
    { id: 3, year: "2024", duration: "5 months", company: "Apex Careers", role: "Recruitment Executive", tech: "MS Office, Sourcing", isOngoing: 0, sortOrder: 2, published: 1 },
  ],
  achievements: [
    { id: 1, value: "MS", label: "Microsoft Certified", detail: "Full-Stack Development", sortOrder: 0, published: 1 },
    { id: 2, value: "MERN", label: "MERN Stack", detail: "Packt Certified", sortOrder: 1, published: 1 },
    { id: 3, value: "3+", label: "Projects Built", detail: "Full-Stack", sortOrder: 2, published: 1 },
  ],
  skills: [],
  skillsRadar: [],
  faq: [],
  readingList: [],
  nowPlaying: [],
  techStack: [],
  socialLinks: [
    { id: 1, name: "Github", platform: "github", url: "https://github.com/faisukhan01", icon: "github", sortOrder: 0, published: 1 },
    { id: 2, name: "LinkedIn", platform: "linkedin", url: "https://linkedin.com/in/faisal-arslan-khan", icon: "linkedin", sortOrder: 1, published: 1 },
  ],
  heroRolesList: [],
  processTimeline: [],
  timezones: [],
  newsletterStats: [],
};

type PortfolioContextType = {
  data: PortfolioData;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const PortfolioContext = createContext<PortfolioContextType>({
  data: defaultData,
  loading: true,
  error: null,
  refetch: () => {},
});

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error("Failed to fetch portfolio data");
      const json = await res.json();

      // Map the API response to our types
      const mapped: PortfolioData = {
        settings: json.settings || {},
        heroRoles: json.heroRoles || ["Full-stack Developer"],
        projects: (json.projects || []).map((p: Record<string, unknown>) => ({
          id: p.id as string,
          title: p.title as string,
          description: p.description as string,
          image: p.image as string,
          gallery: p.gallery as string[],
          tag: p.tag as string,
          year: p.year as string,
          client: p.client as string,
          duration: p.duration as string,
          role: p.role as string,
          overview: p.overview as string,
          challenge: p.challenge as string,
          solution: p.solution as string,
          techStack: p.techStack as string[],
          results: p.results as { label: string; value: string }[],
          liveUrl: p.liveUrl as string,
          repoUrl: p.repoUrl as string,
        })),
        articles: (json.articles || []).map((a: Record<string, unknown>) => ({
          id: a.id as string,
          title: a.title as string,
          excerpt: a.excerpt as string,
          content: a.content as string[],
          tag: a.tag as string,
          date: a.date as string,
          readTime: a.readTime as string,
          author: a.author as string,
        })),
        services: json.services || [],
        testimonials: json.testimonials || [],
        workExperience: json.workExperience || [],
        achievements: json.achievements || [],
        skills: json.skills || [],
        skillsRadar: json.skillsRadar || [],
        faq: json.faq || [],
        readingList: json.readingList || [],
        nowPlaying: json.nowPlaying || [],
        techStack: json.techStack || [],
        socialLinks: json.socialLinks || [],
        heroRolesList: json.heroRolesList || [],
        processTimeline: json.processTimeline || [],
        timezones: json.timezones || [],
        newsletterStats: json.newsletterStats || [],
      };

      // Merge with default data: if API returned empty values, fall back to defaults
      const isEmpty = (val: unknown): boolean => {
        if (Array.isArray(val)) return val.length === 0;
        if (val && typeof val === "object") return Object.keys(val).length === 0;
        return val == null || val === "";
      };

      const merged: PortfolioData = Object.fromEntries(
        (Object.keys(mapped) as (keyof PortfolioData)[]).map((key) => [
          key,
          isEmpty(mapped[key]) ? defaultData[key] : mapped[key],
        ])
      ) as PortfolioData;

      setData(merged);
    } catch (err) {
      console.error("Failed to fetch portfolio data:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioData() {
  return useContext(PortfolioContext);
}

export function usePortfolioSettings() {
  const { data } = usePortfolioData();
  return data.settings;
}

export function useProjects() {
  const { data } = usePortfolioData();
  return data.projects;
}

export function useArticles() {
  const { data } = usePortfolioData();
  return data.articles;
}
