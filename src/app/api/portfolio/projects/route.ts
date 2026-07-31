import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

function safeParseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

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

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM projects WHERE published = 1 ORDER BY sort_order ASC"
    );

    const projects = result.rows.map(mapProject);

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("[/api/portfolio/projects] Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
