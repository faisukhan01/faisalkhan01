import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { tursoRowsToObjects } from "@/lib/admin-helpers";

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    const contacts = tursoRowsToObjects(
      result.columns,
      result.rows as unknown[][]
    );

    const unreadResult = await db.execute(
      "SELECT COUNT(*) as count FROM contacts WHERE is_read = 0"
    );
    const unreadCount = Number(unreadResult.rows[0].count);

    return NextResponse.json({ ok: true, data: contacts, unreadCount });
  } catch (error) {
    console.error("Contacts GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch contacts." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Contact id is required." },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "UPDATE contacts SET is_read = 1 WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contacts PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to mark contact as read." },
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
        { ok: false, error: "Contact id is required." },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "DELETE FROM contacts WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contacts DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete contact." },
      { status: 500 }
    );
  }
}
