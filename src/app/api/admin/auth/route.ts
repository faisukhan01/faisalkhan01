import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const result = await db.execute({
      sql: "SELECT * FROM admin_users WHERE username = ? AND password_hash = ?",
      args: [username, password],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    return NextResponse.json({
      ok: true,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { ok: false, error: "Authentication failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await db.execute("SELECT COUNT(*) as count FROM admin_users");
    const count = result.rows[0].count;
    return NextResponse.json({
      ok: true,
      configured: Number(count) > 0,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to check auth status." },
      { status: 500 }
    );
  }
}
