import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

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

export async function GET() {
  try {
    // Run all queries in parallel for maximum performance
    const [
      settingsRes,
      heroRolesRes,
      projectsRes,
      articlesRes,
      servicesRes,
      testimonialsRes,
      workExperienceRes,
      achievementsRes,
      skillsRes,
      skillsRadarRes,
      faqRes,
      readingListRes,
      nowPlayingRes,
      techStackRes,
      socialLinksRes,
      processTimelineRes,
      timezonesRes,
      newsletterStatsRes,
    ] = await Promise.all([
      db.execute("SELECT key, value FROM site_settings"),
      db.execute("SELECT role FROM hero_roles WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM articles WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM services WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM testimonials WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM work_experience WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM achievements WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM skills WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM skills_radar WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM faq WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM reading_list WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM now_playing WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM tech_stack WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM social_links WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM process_timeline WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM timezones WHERE published = 1 ORDER BY sort_order ASC"),
      db.execute("SELECT * FROM newsletter_stats ORDER BY sort_order ASC"),
    ]);

    // Build settings as key-value object
    const settings: Record<string, string> = {};
    for (const row of settingsRes.rows) {
      settings[row.key as string] = row.value as string;
    }

    // Build hero roles as string array
    const heroRoles = heroRolesRes.rows.map((row) => row.role as string);

    // Map all entities
    const projects = projectsRes.rows.map(mapProject);
    const articles = articlesRes.rows.map(mapArticle);
    const services = servicesRes.rows.map(mapService);
    const testimonials = testimonialsRes.rows.map(mapTestimonial);
    const workExperience = workExperienceRes.rows.map(mapWorkExperience);
    const achievements = achievementsRes.rows.map(mapAchievement);
    const skills = skillsRes.rows.map(mapSkill);
    const skillsRadar = skillsRadarRes.rows.map(mapSkillsRadar);
    const faq = faqRes.rows.map(mapFaq);
    const readingList = readingListRes.rows.map(mapReadingList);
    const nowPlaying = nowPlayingRes.rows.map(mapNowPlaying);
    const techStack = techStackRes.rows.map(mapTechStack);
    const socialLinks = socialLinksRes.rows.map(mapSocialLink);
    const processTimeline = processTimelineRes.rows.map(mapProcessTimeline);
    const timezones = timezonesRes.rows.map(mapTimezone);
    const newsletterStats = newsletterStatsRes.rows.map(mapNewsletterStats);

    return NextResponse.json({
      settings,
      heroRoles,
      projects,
      articles,
      services,
      testimonials,
      workExperience,
      achievements,
      skills,
      skillsRadar,
      faq,
      readingList,
      nowPlaying,
      techStack,
      socialLinks,
      processTimeline,
      timezones,
      newsletterStats,
    });
  } catch (error) {
    console.error("[/api/portfolio] Error fetching portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
