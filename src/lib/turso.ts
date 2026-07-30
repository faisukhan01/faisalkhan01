import { createClient, type Client } from "@libsql/client";

let _db: Client | null = null;

export function getDb(): Client {
  if (!_db) {
    const url = process.env.TURSO_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
      throw new Error("TURSO_URL and TURSO_AUTH_TOKEN environment variables must be set");
    }

    _db = createClient({ url, authToken });
  }
  return _db;
}
