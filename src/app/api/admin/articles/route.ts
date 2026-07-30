import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects, stringifyJsonFields } from "@/lib/admin-helpers";

const JSON_FIELDS = ["content"];

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM articles ORDER BY sort_order ASC"
    );
    const articles = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][],
      JSON_FIELDS
    );
    return NextResponse.json({ ok: true, data: articles });
  } catch (error) {
    console.error("Articles GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch articles." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = stringifyJsonFields(body, JSON_FIELDS);

    const id = sanitized.id || `art_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const title = sanitized.title || "";
    const excerpt = sanitized.excerpt || "";
    const content = sanitized.content || "[]";
    const tag = sanitized.tag || "General";
    const date = sanitized.date || "";
    const read_time = sanitized.read_time || "5 min";
    const author = sanitized.author || "Faisal Khan";
    const sort_order = sanitized.sort_order ?? 0;
    const published = sanitized.published ?? 1;

    await db.execute({
      sql: `INSERT INTO articles (id, title, excerpt, content, tag, date, read_time, author, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, title, excerpt, content, tag, date, read_time, author,
        sort_order as number, published as number,
      ],
    });

    return NextResponse.json({ ok: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error("Articles POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create article." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Article id is required." },
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
      sql: `UPDATE articles SET ${fields.join(", ")}, updated_at = datetime('now') WHERE id = ?`,
      args: values,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Articles PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update article." },
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
        { ok: false, error: "Article id is required." },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "DELETE FROM articles WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Articles DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete article." },
      { status: 500 }
    );
  }
}
