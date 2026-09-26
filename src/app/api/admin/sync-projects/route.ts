import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { projectsData } from "@/lib/portfolio-data";

/**
 * One-time (re-runnable) sync endpoint that pushes the hardcoded local data
 * to the production Turso database:
 *
 *  - Projects: inserts new ones, updates existing ones, deletes stale ones,
 *    and maintains `featured` + `sort_order` from the local data ordering.
 *  - Skills: upserts every category from the local default set and removes
 *    categories that no longer exist locally.
 */

// Keep this list in sync with the defaults in SkillsSection.tsx
const skillsData = [
  { category: "Frontend", count: "08", proficiency: 90, technologies: ["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Three.js", "HTML5", "CSS3"] },
  { category: "Mobile Development", count: "05", proficiency: 82, technologies: ["React Native", "Kotlin", "Flutter", "Dart", "Firebase"] },
  { category: "Game Development", count: "04", proficiency: 80, technologies: ["Unity", "Unreal Engine", "C#", "C++"] },
  { category: "Backend", count: "05", proficiency: 85, technologies: ["Node.js", "Express.js", "FastAPI", "Django", "REST APIs"] },
  { category: "Languages", count: "07", proficiency: 84, technologies: ["C", "C#", "C++", "Python", "JavaScript", "TypeScript", "Kotlin"] },
  { category: "AI & Tools", count: "06", proficiency: 80, technologies: ["Prompt Engineering", "GPT Integration", "Claude", "Gemini", "Git", "GitHub"] },
  { category: "Database & Practices", count: "05", proficiency: 78, technologies: ["PostgreSQL", "SQLite", "Agile/Scrum", "Project Scoping", "CI/CD"] },
];

export async function POST() {
  try {
    const results: { id: string; action: string }[] = [];

    // ── 1. Ensure the `featured` column exists ────────────────────────────
    try {
      await db.execute(`ALTER TABLE projects ADD COLUMN featured INTEGER NOT NULL DEFAULT 0`);
      results.push({ id: "projects.featured", action: "column-added" });
    } catch {
      // Column already exists — safe to ignore
    }

    // ── 2. Sync projects ──────────────────────────────────────────────────
    for (let i = 0; i < projectsData.length; i++) {
      const project = projectsData[i];
      const id = project.id;
      const title = project.title;
      const description = project.description;
      const image = project.image;
      const gallery = JSON.stringify(project.gallery);
      const tag = project.tag;
      const year = project.year;
      const client = project.client;
      const duration = project.duration;
      const role = project.role;
      const overview = project.overview;
      const challenge = project.challenge;
      const solution = project.solution;
      const tech_stack = JSON.stringify(project.techStack);
      const results_json = JSON.stringify(project.results);
      const live_url = project.liveUrl;
      const repo_url = project.repoUrl;
      const sort_order = i;
      const featured = project.featured ? 1 : 0;

      // Check if project exists
      const existing = await db.execute({
        sql: "SELECT id FROM projects WHERE id = ?",
        args: [id],
      });

      if (existing.rows.length > 0) {
        // Update existing project
        await db.execute({
          sql: `UPDATE projects SET title = ?, description = ?, image = ?, gallery = ?, tag = ?, year = ?, client = ?, duration = ?, role = ?, overview = ?, challenge = ?, solution = ?, tech_stack = ?, results = ?, live_url = ?, repo_url = ?, sort_order = ?, featured = ?, updated_at = datetime('now') WHERE id = ?`,
          args: [title, description, image, gallery, tag, year, client, duration, role, overview, challenge, solution, tech_stack, results_json, live_url, repo_url, sort_order, featured, id],
        });
        results.push({ id, action: "updated" });
      } else {
        // Insert new project
        await db.execute({
          sql: `INSERT INTO projects (id, title, description, image, gallery, tag, year, client, duration, role, overview, challenge, solution, tech_stack, results, live_url, repo_url, sort_order, featured, published)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [id, title, description, image, gallery, tag, year, client, duration, role, overview, challenge, solution, tech_stack, results_json, live_url, repo_url, sort_order, featured, 1],
        });
        results.push({ id, action: "inserted" });
      }
    }

    // Delete old projects that are no longer in the hardcoded data
    const validIds = projectsData.map((p) => p.id);
    const allProjects = await db.execute("SELECT id FROM projects");
    for (const row of allProjects.rows) {
      const rowId = row.id as string;
      if (!validIds.includes(rowId)) {
        await db.execute({
          sql: "DELETE FROM projects WHERE id = ?",
          args: [rowId],
        });
        results.push({ id: rowId, action: "deleted" });
      }
    }

    // ── 3. Sync skills (upsert by category) ───────────────────────────────
    for (let i = 0; i < skillsData.length; i++) {
      const s = skillsData[i];
      const technologies = JSON.stringify(s.technologies);

      const existing = await db.execute({
        sql: "SELECT id FROM skills WHERE category = ?",
        args: [s.category],
      });

      if (existing.rows.length > 0) {
        const rowId = existing.rows[0].id as number;
        await db.execute({
          sql: `UPDATE skills SET count = ?, proficiency = ?, technologies = ?, sort_order = ?, published = 1, updated_at = datetime('now') WHERE id = ?`,
          args: [s.count, s.proficiency, technologies, i, rowId],
        });
        results.push({ id: `skill:${s.category}`, action: "updated" });
      } else {
        await db.execute({
          sql: `INSERT INTO skills (category, count, proficiency, technologies, sort_order, published) VALUES (?, ?, ?, ?, ?, 1)`,
          args: [s.category, s.count, s.proficiency, technologies, i],
        });
        results.push({ id: `skill:${s.category}`, action: "inserted" });
      }
    }

    // Delete skill categories that are no longer in the local set
    const validCategories = skillsData.map((s) => s.category);
    const allSkills = await db.execute("SELECT id, category FROM skills");
    for (const row of allSkills.rows) {
      const category = row.category as string;
      if (!validCategories.includes(category)) {
        await db.execute({
          sql: "DELETE FROM skills WHERE id = ?",
          args: [row.id as number],
        });
        results.push({ id: `skill:${category}`, action: "deleted" });
      }
    }

    // ── 4. Sync key settings (counts reflect the current project list) ────
    const settingsSync: Record<string, string> = {
      about_projects: `${projectsData.length}+`,
      about_technologies: "15+",
    };
    for (const [key, value] of Object.entries(settingsSync)) {
      await db.execute({
        sql: `INSERT INTO site_settings (key, value, category, updated_at) VALUES (?, ?, 'about', datetime('now'))
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
        args: [key, value],
      });
      results.push({ id: `setting:${key}`, action: "upserted" });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Sync projects error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to sync data." },
      { status: 500 }
    );
  }
}
