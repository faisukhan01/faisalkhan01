import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects } from "@/lib/admin-helpers";

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM process_timeline ORDER BY sort_order ASC"
    );
    const data = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][]
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Process timeline GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch process timeline." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const step = body.step ?? 1;
    const title = body.title || "";
    const description = body.description || "";
    const sort_order = body.sort_order ?? 0;
    const published = body.published ?? 1;

    await db.execute({
      sql: `INSERT INTO process_timeline (step, title, description, sort_order, published)
            VALUES (?, ?, ?, ?, ?)`,
      args: [step as number, title, description, sort_order as number, published as number],
    });

    const result = await db.execute("SELECT last_insert_rowid() as id");
    const id = result.rows[0].id;

    return NextResponse.json({ ok: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error("Process timeline POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create process timeline item." },
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
        { ok: false, error: "Process timeline item id is required." },
        { status: 400 }
      );
    }

    const fields: string[] = [];
    const values: (string | number)[] = [];

    for (const [key, value] of Object.entries(updates)) {
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
      sql: `UPDATE process_timeline SET ${fields.join(", ")}, updated_at = datetime('now') WHERE id = ?`,
      args: values,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Process timeline PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update process timeline item." },
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
        { ok: false, error: "Process timeline item id is required." },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "DELETE FROM process_timeline WHERE id = ?",
      args: [Number(id)],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Process timeline DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete process timeline item." },
      { status: 500 }
    );
  }
}
