import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects } from "@/lib/admin-helpers";

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const actionType = searchParams.get("action_type");
    const entityType = searchParams.get("entity_type");
    const limit = Math.min(Number(searchParams.get("limit") || 100), 500);

    let sql = "SELECT * FROM activity_log";
    const conditions: string[] = [];
    const args: (string | number)[] = [];

    if (actionType) {
      conditions.push("action_type = ?");
      args.push(actionType);
    }

    if (entityType) {
      conditions.push("entity_type = ?");
      args.push(entityType);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY created_at DESC LIMIT ?";
    args.push(limit);

    const result = await db.execute({ sql, args });
    const activities = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][]
    );

    // Get distinct action types and entity types for filters
    const actionTypesResult = await db.execute(
      "SELECT DISTINCT action_type FROM activity_log ORDER BY action_type"
    );
    const entityTypesResult = await db.execute(
      "SELECT DISTINCT entity_type FROM activity_log ORDER BY entity_type"
    );

    const actionTypes = actionTypesResult.rows.map((r) => String(r[0]));
    const entityTypes = entityTypesResult.rows.map((r) => String(r[0]));

    return NextResponse.json({
      ok: true,
      data: activities,
      filters: { actionTypes, entityTypes },
    });
  } catch (error) {
    console.error("Activity log GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch activity log." },
      { status: 500 }
    );
  }
}
