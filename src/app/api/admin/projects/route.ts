import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects, stringifyJsonFields } from "@/lib/admin-helpers";

const JSON_FIELDS = ["gallery", "tech_stack", "results"];

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM projects ORDER BY sort_order ASC"
    );
    const projects = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][],
      JSON_FIELDS
    );
    return NextResponse.json({ ok: true, data: projects });
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = stringifyJsonFields(body, JSON_FIELDS);

    const id = sanitized.id || `proj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const title = sanitized.title || "";
    const description = sanitized.description || "";
    const image = sanitized.image || "/project-1.jpg";
    const gallery = sanitized.gallery || "[]";
    const tag = sanitized.tag || "Full-Stack";
    const year = sanitized.year || "2025";
    const client = sanitized.client || "";
    const duration = sanitized.duration || "";
    const role = sanitized.role || "Full-Stack Developer";
    const overview = sanitized.overview || "";
    const challenge = sanitized.challenge || "";
    const solution = sanitized.solution || "";
    const tech_stack = sanitized.tech_stack || "[]";
    const results = sanitized.results || "[]";
    const live_url = sanitized.live_url || "#";
    const repo_url = sanitized.repo_url || "#";
    const sort_order = sanitized.sort_order ?? 0;
    const published = sanitized.published ?? 1;

    await db.execute({
      sql: `INSERT INTO projects (id, title, description, image, gallery, tag, year, client, duration, role, overview, challenge, solution, tech_stack, results, live_url, repo_url, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, title, description, image, gallery, tag, year, client, duration,
        role, overview, challenge, solution, tech_stack, results, live_url,
        repo_url, sort_order as number, published as number,
      ],
    });

    return NextResponse.json({ ok: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create project." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Reorder mode ──
    // Body shape: { reorder: [{ id: string, sort_order: number }, ...] }
    if (Array.isArray(body?.reorder)) {
      const reorderItems = body.reorder as Array<{
        id: string;
        sort_order: number;
      }>;

      if (reorderItems.length === 0) {
        return NextResponse.json(
          { ok: false, error: "Reorder list cannot be empty." },
          { status: 400 }
        );
      }

      // Update sort_order for each project. Turso supports batch execution via multiple statements.
      for (const item of reorderItems) {
        if (!item.id || typeof item.sort_order !== "number") continue;
        await db.execute({
          sql: "UPDATE projects SET sort_order = ?, updated_at = datetime('now') WHERE id = ?",
          args: [item.sort_order, item.id],
        });
      }

      return NextResponse.json({ ok: true, updated: reorderItems.length });
    }

    // ── Single update mode ──
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Project id is required." },
        { status: 400 }
      );
    }

    const sanitized = stringifyJsonFields(updates, JSON_FIELDS);

    const fields: string[] = [];
    const values: (string | number)[] = [];

    for (const [key, value] of Object.entries(sanitized)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value as string | number);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No fields to update." },
        { status: 400 }
      );
    }

    values.push(id as string);
    await db.execute({
      sql: `UPDATE projects SET ${fields.join(", ")}, updated_at = datetime('now') WHERE id = ?`,
      args: values,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Projects PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update project." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Project id is required." },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "DELETE FROM projects WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Projects DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete project." },
      { status: 500 }
    );
  }
}
