import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  subject?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;
    const { name, email, message, subject } = body;

    // Basic validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { ok: false, error: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { ok: false, error: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // Insert into the contacts table
    const result = await db.execute({
      sql: `INSERT INTO contacts (name, email, message, subject) VALUES (?, ?, ?, ?)`,
      args: [name.trim(), email.trim(), message.trim(), subject?.trim() || null],
    });

    const id = String(result.lastInsertRowid);

    return NextResponse.json({
      ok: true,
      id,
      message: `Thanks ${name.split(" ")[0]}, your message has been received.`,
      receivedAt: new Date().toISOString(),
      payload: { name, email, subject: subject ?? "(no subject)" },
    });
  } catch (error) {
    console.error("Contact form submission failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
