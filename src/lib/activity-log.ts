import { db } from "@/lib/turso";

/**
 * Log an activity to the activity_log table.
 * This helper can be called from any API route to record admin actions.
 *
 * @param actionType - The type of action: 'create', 'update', or 'delete'
 * @param entityType - The type of entity: 'project', 'article', 'service', 'contact', etc.
 * @param entityName - The name/title of the entity being acted upon
 * @param details - Optional additional details about the action
 */
export async function logActivity(
  actionType: "create" | "update" | "delete",
  entityType: string,
  entityName: string,
  details: string = ""
): Promise<void> {
  try {
    // Ensure the activity_log table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_name TEXT NOT NULL,
        details TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    await db.execute({
      sql: "INSERT INTO activity_log (action_type, entity_type, entity_name, details) VALUES (?, ?, ?, ?)",
      args: [actionType, entityType, entityName, details],
    });
  } catch (error) {
    // Log the error but don't throw — activity logging should not break the main operation
    console.error("Failed to log activity:", error);
  }
}
