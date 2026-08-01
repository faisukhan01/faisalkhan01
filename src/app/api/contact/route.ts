import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  subject?: string;
};

const RATE_LIMIT_MAX = 3; // max submissions per IP per hour
const RATE_LIMIT_WINDOW_HOURS = 1;

async function ensureRateLimitTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_rate_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 1,
      last_request TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  await ensureRateLimitTable();

  // Clean up entries older than the window
  const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);

  await db.execute({
    sql: `DELETE FROM contact_rate_limits WHERE last_request < ?`,
    args: [cutoff],
  });

  // Check current rate for this IP
  const existing = await db.execute({
    sql: `SELECT count, last_request FROM contact_rate_limits WHERE ip = ?`,
    args: [ip],
  });

  if (existing.rows.length === 0) {
    // First request from this IP in the window
    await db.execute({
      sql: `INSERT INTO contact_rate_limits (ip, count, last_request) VALUES (?, 1, datetime('now'))`,
      args: [ip],
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  const currentCount = Number(existing.rows[0][0]);
  const lastRequest = String(existing.rows[0][1]);

  // Check if the window has expired since last request
  const lastTime = new Date(lastRequest + "Z").getTime();
  const now = Date.now();
  const hoursSinceLast = (now - lastTime) / (1000 * 60 * 60);

  if (hoursSinceLast >= RATE_LIMIT_WINDOW_HOURS) {
    // Window expired, reset counter
    await db.execute({
      sql: `UPDATE contact_rate_limits SET count = 1, last_request = datetime('now') WHERE ip = ?`,
      args: [ip],
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (currentCount >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  // Increment counter
  await db.execute({
    sql: `UPDATE contact_rate_limits SET count = count + 1, last_request = datetime('now') WHERE ip = ?`,
    args: [ip],
  });

  return { allowed: true, remaining: RATE_LIMIT_MAX - currentCount - 1 };
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const rateCheck = await checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many messages. Please wait an hour before sending another message.",
          retryAfter: RATE_LIMIT_WINDOW_HOURS * 60 * 60,
        },
        { status: 429 }
      );
    }

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
