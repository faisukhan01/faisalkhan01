import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

// Simple in-memory cache
let cache: { data: Record<string, unknown>; timestamp: number } | null = null;
const CACHE_TTL = 60_000; // 60 seconds

// Helper: safely parse a JSON string, returning fallback on failure
function safeParseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

// Helper: map a raw DB row to camelCase, parsing JSON fields
function mapProject(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    image: row.image as string,
    gallery: safeParseJSON<string[]>(row.gallery as string, []),
    tag: row.tag as string,
    year: row.year as string,
    client: row.client as string,
    duration: row.duration as string,
    role: row.role as string,
    overview: row.overview as string,
    challenge: row.challenge as string,
    solution: row.solution as string,
    techStack: safeParseJSON<string[]>(row.tech_stack as string, []),
    results: safeParseJSON<{ label: string; value: string }[]>(row.results as string, []),
    liveUrl: row.live_url as string,
    repoUrl: row.repo_url as string,
    sortOrder: row.sort_order as number,
  };
}

function mapArticle(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    content: safeParseJSON<string[]>(row.content as string, []),
    tag: row.tag as string,
    date: row.date as string,
    readTime: row.read_time as string,
    author: row.author as string,
    sortOrder: row.sort_order as number,
  };
}

function mapService(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    title: row.title as string,
    description: row.description as string,
    features: safeParseJSON<string[]>(row.features as string, []),
    icon: row.icon as string,
    sortOrder: row.sort_order as number,
  };
}

function mapTestimonial(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    author: row.author as string,
    role: row.role as string,
    quote: row.quote as string,
    avatar: row.avatar as string,
    sortOrder: row.sort_order as number,
  };
}

function mapWorkExperience(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    year: row.year as string,
    duration: row.duration as string,
    company: row.company as string,
    role: row.role as string,
    tech: row.tech as string,
    isOngoing: row.is_ongoing === 1,
    sortOrder: row.sort_order as number,
  };
}

function mapAchievement(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    value: row.value as string,
    label: row.label as string,
    detail: row.detail as string,
    sortOrder: row.sort_order as number,
  };
}

function mapSkill(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    category: row.category as string,
    count: row.count as string,
    proficiency: row.proficiency as number,
    technologies: safeParseJSON<string[]>(row.technologies as string, []),
    sortOrder: row.sort_order as number,
  };
}

function mapFaq(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    question: row.question as string,
    answer: row.answer as string,
    sortOrder: row.sort_order as number,
  };
}

function mapReadingList(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    title: row.title as string,
    author: row.author as string,
    progress: row.progress as number,
    gradient: row.gradient as string,
    accent: row.accent as string,
    sortOrder: row.sort_order as number,
  };
}

function mapNowPlaying(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    type: row.type as string,
    label: row.label as string,
    title: row.title as string,
    subtitle: row.subtitle as string,
    sortOrder: row.sort_order as number,
  };
}

function mapTechStack(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    name: row.name as string,
    icon: row.icon as string,
    sortOrder: row.sort_order as number,
  };
}

function mapSocialLink(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    name: row.name as string,
    platform: row.platform as string,
    url: row.url as string,
    icon: row.icon as string,
    sortOrder: row.sort_order as number,
  };
}

function mapProcessTimeline(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    step: row.step as number,
    title: row.title as string,
    description: row.description as string,
    sortOrder: row.sort_order as number,
  };
}

function mapSkillsRadar(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    skill: row.skill as string,
    value: row.value as number,
    sortOrder: row.sort_order as number,
  };
}

function mapTimezone(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    label: row.label as string,
    timezone: row.timezone as string,
    sortOrder: row.sort_order as number,
  };
}

function mapNewsletterStats(row: Record<string, unknown>) {
  return {
    id: row.id as number,
    statKey: row.stat_key as string,
    statValue: row.stat_value as string,
    sortOrder: row.sort_order as number,
  };
}

// Helper: safely execute a query, returning empty array on failure
async function safeQuery(sql: string): Promise<Record<string, unknown>[]> {
  try {
    const result = await db.execute(sql);
    return result.rows as Record<string, unknown>[];
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.data);
    }

    // Use sequential queries with safeQuery to avoid memory spikes
    const settingsRows = await safeQuery("SELECT key, value FROM site_settings");
    const heroRolesRows = await safeQuery("SELECT role FROM hero_roles WHERE published = 1 ORDER BY sort_order ASC");
    const projectsRows = await safeQuery("SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC");
    const articlesRows = await safeQuery("SELECT * FROM articles WHERE published = 1 ORDER BY sort_order ASC");
    const servicesRows = await safeQuery("SELECT * FROM services WHERE published = 1 ORDER BY sort_order ASC");
    const testimonialsRows = await safeQuery("SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order ASC");
    const workExperienceRows = await safeQuery("SELECT * FROM work_experience WHERE published = 1 ORDER BY sort_order ASC");
    const achievementsRows = await safeQuery("SELECT * FROM achievements WHERE published = 1 ORDER BY sort_order ASC");
    const skillsRows = await safeQuery("SELECT * FROM skills WHERE published = 1 ORDER BY sort_order ASC");
    const skillsRadarRows = await safeQuery("SELECT * FROM skills_radar WHERE published = 1 ORDER BY sort_order ASC");
    const faqRows = await safeQuery("SELECT * FROM faq WHERE published = 1 ORDER BY sort_order ASC");
    const readingListRows = await safeQuery("SELECT * FROM reading_list WHERE published = 1 ORDER BY sort_order ASC");
    const nowPlayingRows = await safeQuery("SELECT * FROM now_playing WHERE published = 1 ORDER BY sort_order ASC");
    const techStackRows = await safeQuery("SELECT * FROM tech_stack WHERE published = 1 ORDER BY sort_order ASC");
    const socialLinksRows = await safeQuery("SELECT * FROM social_links WHERE published = 1 ORDER BY sort_order ASC");
    const processTimelineRows = await safeQuery("SELECT * FROM process_timeline WHERE published = 1 ORDER BY sort_order ASC");
    const timezonesRows = await safeQuery("SELECT * FROM timezones WHERE published = 1 ORDER BY sort_order ASC");
    const newsletterStatsRows = await safeQuery("SELECT * FROM newsletter_stats ORDER BY sort_order ASC");

    // Build settings as key-value object
    const settings: Record<string, string> = {};
    for (const row of settingsRows) {
      settings[row.key as string] = row.value as string;
    }

    // Build hero roles as string array
    const heroRoles = heroRolesRows.map((row) => row.role as string);

    // Map all entities
    const data = {
      settings,
      heroRoles,
      projects: projectsRows.map(mapProject),
      articles: articlesRows.map(mapArticle),
      services: servicesRows.map(mapService),
      testimonials: testimonialsRows.map(mapTestimonial),
      workExperience: workExperienceRows.map(mapWorkExperience),
      achievements: achievementsRows.map(mapAchievement),
      skills: skillsRows.map(mapSkill),
      skillsRadar: skillsRadarRows.map(mapSkillsRadar),
      faq: faqRows.map(mapFaq),
      readingList: readingListRows.map(mapReadingList),
      nowPlaying: nowPlayingRows.map(mapNowPlaying),
      techStack: techStackRows.map(mapTechStack),
      socialLinks: socialLinksRows.map(mapSocialLink),
      processTimeline: processTimelineRows.map(mapProcessTimeline),
      timezones: timezonesRows.map(mapTimezone),
      newsletterStats: newsletterStatsRows.map(mapNewsletterStats),
    };

    // Update cache
    cache = { data, timestamp: Date.now() };

    return NextResponse.json(data);
  } catch (error) {
    console.error("[/api/portfolio] Error fetching portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
