import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects, stringifyJsonFields } from "@/lib/admin-helpers";

const JSON_FIELDS = ["features"];

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM services ORDER BY sort_order ASC"
    );
    const services = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][],
      JSON_FIELDS
    );
    return NextResponse.json({ ok: true, data: services });
  } catch (error) {
    console.error("Services GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch services." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sanitized = stringifyJsonFields(body, JSON_FIELDS);

    const title = sanitized.title || "";
    const description = sanitized.description || "";
    const features = sanitized.features || "[]";
    const icon = sanitized.icon || "code";
    const sort_order = sanitized.sort_order ?? 0;
    const published = sanitized.published ?? 1;

    await db.execute({
      sql: `INSERT INTO services (title, description, features, icon, sort_order, published)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [title, description, features, icon, sort_order as number, published as number],
    });

    const result = await db.execute("SELECT last_insert_rowid() as id");
    const id = result.rows[0].id;

    return NextResponse.json({ ok: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error("Services POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create service." },
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
        { ok: false, error: "Service id is required." },
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

    values.push(id as number);
    await db.execute({
      sql: `UPDATE services SET ${fields.join(", ")}, updated_at = datetime('now') WHERE id = ?`,
      args: values,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Services PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update service." },
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
        { ok: false, error: "Service id is required." },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "DELETE FROM services WHERE id = ?",
      args: [Number(id)],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Services DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete service." },
      { status: 500 }
    );
  }
}
