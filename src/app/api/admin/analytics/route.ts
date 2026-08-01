import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function GET() {
  try {
    const tables = [
      { name: "projects", label: "Projects" },
      { name: "articles", label: "Articles" },
      { name: "services", label: "Services" },
      { name: "testimonials", label: "Testimonials" },
      { name: "skills", label: "Skills" },
      { name: "contacts", label: "Contacts" },
    ];

    const contentDistribution: { name: string; label: string; total: number; published: number; draft: number }[] = [];

    let totalPublished = 0;
    let totalDraft = 0;
    let lastUpdated: string | null = null;

    for (const table of tables) {
      try {
        const totalResult = await db.execute(`SELECT COUNT(*) as count FROM ${table.name}`);
        const total = Number(totalResult.rows[0][0]);

        let published = 0;
        let draft = 0;

        // Check if table has a published column
        try {
          const publishedResult = await db.execute(
            `SELECT COUNT(*) as count FROM ${table.name} WHERE published = 1`
          );
          published = Number(publishedResult.rows[0][0]);
          draft = total - published;
        } catch {
          // Table doesn't have published column, treat all as published
          published = total;
          draft = 0;
        }

        // Check for last updated_at
        try {
          const updatedResult = await db.execute(
            `SELECT MAX(updated_at) as last_updated FROM ${table.name}`
          );
          const updated = String(updatedResult.rows[0][0]);
          if (updated && updated !== "null" && (!lastUpdated || updated > lastUpdated)) {
            lastUpdated = updated;
          }
        } catch {
          // Table doesn't have updated_at column
        }

        // Check for last created_at as fallback
        try {
          const createdResult = await db.execute(
            `SELECT MAX(created_at) as last_created FROM ${table.name}`
          );
          const created = String(createdResult.rows[0][0]);
          if (created && created !== "null" && (!lastUpdated || created > lastUpdated)) {
            lastUpdated = created;
          }
        } catch {
          // Table doesn't have created_at column
        }

        contentDistribution.push({
          name: table.name,
          label: table.label,
          total,
          published,
          draft,
        });

        totalPublished += published;
        totalDraft += draft;
      } catch {
        // Table might not exist yet
        contentDistribution.push({
          name: table.name,
          label: table.label,
          total: 0,
          published: 0,
          draft: 0,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        contentDistribution,
        totalPublished,
        totalDraft,
        lastUpdated,
      },
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch analytics." },
      { status: 500 }
    );
  }
}
