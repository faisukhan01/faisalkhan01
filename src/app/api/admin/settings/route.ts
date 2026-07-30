import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects } from "@/lib/admin-helpers";

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM site_settings ORDER BY category ASC, key ASC"
    );
    const rows = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][]
    );

    // Convert to key-value object
    const settings: Record<string, string> = {};
    for (const row of rows) {
      const key = row.key as string;
      const value = row.value as string;
      settings[key] = value;
    }

    return NextResponse.json({ ok: true, data: settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch settings." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { ok: false, error: "Request body must be a key-value object." },
        { status: 400 }
      );
    }

    for (const [key, value] of Object.entries(body)) {
      if (typeof value !== "string") continue;

      await db.execute({
        sql: `INSERT INTO site_settings (key, value, category, updated_at) VALUES (?, ?, 'general', datetime('now'))
              ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = datetime('now')`,
        args: [key, value, value],
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update settings." },
      { status: 500 }
    );
  }
}
