import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { projectsData } from "@/lib/portfolio-data";

export async function POST() {
  try {
    const results: { id: string; action: string }[] = [];

    for (const project of projectsData) {
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

      // Check if project exists
      const existing = await db.execute({
        sql: "SELECT id FROM projects WHERE id = ?",
        args: [id],
      });

      if (existing.rows.length > 0) {
        // Update existing project
        await db.execute({
          sql: `UPDATE projects SET title = ?, description = ?, image = ?, gallery = ?, tag = ?, year = ?, client = ?, duration = ?, role = ?, overview = ?, challenge = ?, solution = ?, tech_stack = ?, results = ?, live_url = ?, repo_url = ?, updated_at = datetime('now') WHERE id = ?`,
          args: [title, description, image, gallery, tag, year, client, duration, role, overview, challenge, solution, tech_stack, results_json, live_url, repo_url, id],
        });
        results.push({ id, action: "updated" });
      } else {
        // Insert new project
        await db.execute({
          sql: `INSERT INTO projects (id, title, description, image, gallery, tag, year, client, duration, role, overview, challenge, solution, tech_stack, results, live_url, repo_url, sort_order, published)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [id, title, description, image, gallery, tag, year, client, duration, role, overview, challenge, solution, tech_stack, results_json, live_url, repo_url, results.length, 1],
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

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    console.error("Sync projects error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to sync projects." },
      { status: 500 }
    );
  }
}
