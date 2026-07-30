import { NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function GET() {
  try {
    const result = await db.execute("SELECT key, value FROM site_settings");

    const settings: Record<string, string> = {};
    for (const row of result.rows) {
      settings[row.key as string] = row.value as string;
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[/api/portfolio/settings] Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
