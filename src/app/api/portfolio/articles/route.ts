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

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM articles WHERE published = 1 ORDER BY sort_order ASC"
    );

    const articles = result.rows.map(mapArticle);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("[/api/portfolio/articles] Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
