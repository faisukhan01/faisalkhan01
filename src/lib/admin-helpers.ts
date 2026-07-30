/**
 * Helper utilities for admin API routes.
 * Handles JSON parsing/stringifying for fields stored as JSON strings in Turso DB.
 */

/** Fields that are stored as JSON strings in the database */
export const JSON_FIELDS: Record<string, string[]> = {
  projects: ["gallery", "tech_stack", "results"],
  articles: ["content"],
  services: ["features"],
  skills: ["technologies"],
};

/**
 * Parse JSON string fields back to objects/arrays for API responses.
 * Falls back to the raw value if parsing fails.
 */
export function parseJsonFields(
  row: Record<string, unknown>,
  fields: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...row };
  for (const field of fields) {
    if (typeof result[field] === "string") {
      try {
        result[field] = JSON.parse(result[field] as string);
      } catch {
        // Keep the raw string if parsing fails
      }
    }
  }
  return result;
}

/**
 * Stringify object/array fields for database storage.
 * Only stringifies if the value is not already a string.
 */
export function stringifyJsonFields(
  data: Record<string, unknown>,
  fields: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...data };
  for (const field of fields) {
    if (result[field] !== undefined && result[field] !== null && typeof result[field] !== "string") {
      result[field] = JSON.stringify(result[field]);
    }
  }
  return result;
}

/**
 * Convert a Turso row (which uses arrays for values) to a plain object.
 * Turso rows are returned as arrays of values with column names in the columns array.
 */
export function tursoRowToObject(
  columns: string[],
  values: unknown[]
): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = values[i];
  }
  return obj;
}

/**
 * Convert Turso result rows to an array of objects, with JSON field parsing.
 */
export function tursoRowsToObjects(
  columns: string[],
  rows: unknown[][],
  jsonFields: string[] = []
): Record<string, unknown>[] {
  return rows.map((row) => {
    const obj = tursoRowToObject(columns, row as unknown[]);
    return parseJsonFields(obj, jsonFields);
  });
}
