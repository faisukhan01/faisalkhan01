import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects } from "@/lib/admin-helpers";

export async function GET() {
  try {
    // Ensure the activity_log table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_name TEXT NOT NULL,
        details TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    const result = await db.execute(
      "SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 50"
    );
    const activities = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][]
    );

    return NextResponse.json({ ok: true, data: activities });
  } catch (error) {
    console.error("Activity log GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch activity log." },
      { status: 500 }
    );
  }
}
