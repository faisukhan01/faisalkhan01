import { createClient, type Client } from "@libsql/client";

const TURSO_URL = process.env.TURSO_URL || "libsql://shopwithfaisu-faisukhan01.aws-ap-south-1.turso.io";
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODU0MTM2NDksImlkIjoiMDE5ZWNhZjUtYjQwMS03OWIxLWE0N2EtNzA2M2Q4MmFmZDA1Iiwia2lkIjoiZ3hzNkhTVnl4UkRzT04wdUNrY3FicElYQVMtcS0yRFFZVWVKUGNOZkZQSSIsInJpZCI6ImRiMDI3MzUwLTkxNTMtNGUzNy1hZmQ2LTU0MWZjNjJlNmI2OSJ9.fGSuMszouRyu7wXfET4iahPPW8cAbvSSI8IwHBPhUM2KZ9rmmaK56odjfUVixJVkqPJRXAqQZW9ik4eA8MJvDw";

let _db: Client | null = null;

export function getDb(): Client {
  if (!_db) {
    _db = createClient({
      url: TURSO_URL,
      authToken: TURSO_AUTH_TOKEN,
    });
  }
  return _db;
}

export const db = getDb();
