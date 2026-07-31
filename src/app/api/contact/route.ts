import { NextRequest, NextResponse } from "next/server";

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

    // Simulate async persistence (in production: forward to email service / DB)
    await new Promise((resolve) => setTimeout(resolve, 700));

    const id = `msg_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    return NextResponse.json({
      ok: true,
      id,
      message: `Thanks ${name.split(" ")[0]}, your message has been received.`,
      receivedAt: new Date().toISOString(),
      payload: { name, email, subject: subject ?? "(no subject)" },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
