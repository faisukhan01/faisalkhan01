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

// Lazy initialization — only throws when actually used, not at import time
let _dbInstance: Client | null = null;

export function getDbSafe(): Client {
  if (!_dbInstance) {
    const url = process.env.TURSO_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
      throw new Error("TURSO_URL and TURSO_AUTH_TOKEN environment variables must be set");
    }

    _dbInstance = createClient({ url, authToken });
  }
  return _dbInstance;
}

// Named export that's safe to import at module level — doesn't throw at build time
export const db = new Proxy({} as Client, {
  get(_target, prop) {
    if (prop === "then") return undefined; // not a thenable
    const actualDb = getDbSafe();
    const value = (actualDb as Record<string, unknown>)[prop as string];
    return typeof value === "function" ? value.bind(actualDb) : value;
  },
});
