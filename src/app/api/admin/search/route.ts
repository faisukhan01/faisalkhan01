import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/turso";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase();

    if (!q || q.length < 1) {
      return NextResponse.json({ ok: true, results: {} });
    }

    const results: Record<string, { id: string; title: string; subtitle?: string; href: string }[]> = {};

    // Search projects
    try {
      const projectsRes = await db.execute({
        sql: "SELECT id, title, tag, year FROM projects WHERE LOWER(title) LIKE ? OR LOWER(tag) LIKE ? OR LOWER(description) LIKE ? LIMIT 10",
        args: [`%${q}%`, `%${q}%`, `%${q}%`],
      });
      results.projects = projectsRes.rows.map((row) => ({
        id: String(row.id),
        title: String(row.title),
        subtitle: [row.tag, row.year].filter(Boolean).join(" · "),
        href: "/admin/dashboard/projects",
      }));
    } catch {
      // Table might not exist yet
    }

    // Search articles
    try {
      const articlesRes = await db.execute({
        sql: "SELECT id, title, tag, excerpt FROM articles WHERE LOWER(title) LIKE ? OR LOWER(tag) LIKE ? OR LOWER(excerpt) LIKE ? LIMIT 10",
        args: [`%${q}%`, `%${q}%`, `%${q}%`],
      });
      results.articles = articlesRes.rows.map((row) => ({
        id: String(row.id),
        title: String(row.title),
        subtitle: String(row.tag || ""),
        href: "/admin/dashboard/articles",
      }));
    } catch {
      // Table might not exist yet
    }

    // Search services
    try {
      const servicesRes = await db.execute({
        sql: "SELECT id, title, description FROM services WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? LIMIT 10",
        args: [`%${q}%`, `%${q}%`],
      });
      results.services = servicesRes.rows.map((row) => ({
        id: String(row.id),
        title: String(row.title),
        subtitle: String(row.description || "").slice(0, 80),
        href: "/admin/dashboard/services",
      }));
    } catch {
      // Table might not exist yet
    }

    // Search contacts
    try {
      const contactsRes = await db.execute({
        sql: "SELECT id, name, email, subject FROM contacts WHERE LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(subject) LIKE ? OR LOWER(message) LIKE ? LIMIT 10",
        args: [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`],
      });
      results.contacts = contactsRes.rows.map((row) => ({
        id: String(row.id),
        title: String(row.name),
        subtitle: String(row.email),
        href: "/admin/dashboard/contacts",
      }));
    } catch {
      // Table might not exist yet
    }

    // Search testimonials
    try {
      const testimonialsRes = await db.execute({
        sql: "SELECT id, name, company FROM testimonials WHERE LOWER(name) LIKE ? OR LOWER(company) LIKE ? LIMIT 10",
        args: [`%${q}%`, `%${q}%`],
      });
      results.testimonials = testimonialsRes.rows.map((row) => ({
        id: String(row.id),
        title: String(row.name),
        subtitle: String(row.company || ""),
        href: "/admin/dashboard/testimonials",
      }));
    } catch {
      // Table might not exist yet
    }

    // Search skills
    try {
      const skillsRes = await db.execute({
        sql: "SELECT id, name, category FROM skills WHERE LOWER(name) LIKE ? OR LOWER(category) LIKE ? LIMIT 10",
        args: [`%${q}%`, `%${q}%`],
      });
      results.skills = skillsRes.rows.map((row) => ({
        id: String(row.id),
        title: String(row.name),
        subtitle: String(row.category || ""),
        href: "/admin/dashboard/skills",
      }));
    } catch {
      // Table might not exist yet
    }

    // Search work experience
    try {
      const workRes = await db.execute({
        sql: "SELECT id, company, role FROM work_experience WHERE LOWER(company) LIKE ? OR LOWER(role) LIKE ? LIMIT 10",
        args: [`%${q}%`, `%${q}%`],
      });
      results.work = workRes.rows.map((row) => ({
        id: String(row.id),
        title: String(row.company),
        subtitle: String(row.role || ""),
        href: "/admin/dashboard/work-experience",
      }));
    } catch {
      // Table might not exist yet
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { ok: false, error: "Search failed." },
      { status: 500 }
    );
  }
}
