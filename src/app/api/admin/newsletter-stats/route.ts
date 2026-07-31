import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects } from "@/lib/admin-helpers";

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM newsletter_stats ORDER BY sort_order ASC"
    );
    const data = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][]
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Newsletter stats GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch newsletter stats." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const stat_key = body.stat_key || "";
    const stat_value = body.stat_value || "";
    const sort_order = body.sort_order ?? 0;

    await db.execute({
      sql: `INSERT INTO newsletter_stats (stat_key, stat_value, sort_order)
            VALUES (?, ?, ?)`,
      args: [stat_key, stat_value, sort_order as number],
    });

    const result = await db.execute("SELECT last_insert_rowid() as id");
    const id = result.rows[0].id;

    return NextResponse.json({ ok: true, data: { id } }, { status: 201 });
  } catch (error) {
    console.error("Newsletter stats POST error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create newsletter stat." },
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
        { ok: false, error: "Newsletter stat id is required." },
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
      sql: `UPDATE newsletter_stats SET ${fields.join(", ")} WHERE id = ?`,
      args: values,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter stats PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update newsletter stat." },
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
        { ok: false, error: "Newsletter stat id is required." },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "DELETE FROM newsletter_stats WHERE id = ?",
      args: [Number(id)],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter stats DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete newsletter stat." },
      { status: 500 }
    );
  }
}
