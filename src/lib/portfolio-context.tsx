"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

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
  settings: {},
  heroRoles: ["Full-stack Developer"],
  projects: [],
  articles: [],
  services: [],
  testimonials: [],
  workExperience: [],
  achievements: [],
  skills: [],
  skillsRadar: [],
  faq: [],
  readingList: [],
  nowPlaying: [],
  techStack: [],
  socialLinks: [],
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

      setData(mapped);
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
