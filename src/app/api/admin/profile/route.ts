import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function GET() {
  try {
    const result = await db.execute(
      "SELECT id, username, created_at FROM admin_users LIMIT 1"
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No admin user found." },
        { status: 404 }
      );
    }

    const user = result.rows[0];
    return NextResponse.json({
      ok: true,
      data: {
        id: user.id,
        username: user.username,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { ok: false, error: "Current password is required." },
        { status: 400 }
      );
    }

    // Verify current password
    const verifyResult = await db.execute({
      sql: "SELECT id, username, password_hash FROM admin_users WHERE password_hash = ?",
      args: [currentPassword],
    });

    if (verifyResult.rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const user = verifyResult.rows[0];
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (newUsername && newUsername.trim()) {
      // Check if username is already taken (by another user)
      const existingUser = await db.execute({
        sql: "SELECT id FROM admin_users WHERE username = ? AND id != ?",
        args: [newUsername.trim(), user.id as number],
      });

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { ok: false, error: "Username is already taken." },
          { status: 409 }
        );
      }

      updates.push("username = ?");
      values.push(newUsername.trim());
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 4) {
        return NextResponse.json(
          { ok: false, error: "New password must be at least 4 characters." },
          { status: 400 }
        );
      }
      updates.push("password_hash = ?");
      values.push(newPassword.trim());
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No changes provided." },
        { status: 400 }
      );
    }

    values.push(user.id as number);
    await db.execute({
      sql: `UPDATE admin_users SET ${updates.join(", ")} WHERE id = ?`,
      args: values,
    });

    return NextResponse.json({
      ok: true,
      data: {
        username: newUsername?.trim() || user.username,
      },
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
