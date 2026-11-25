import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { Pool } from "pg";

const globalDb = globalThis as unknown as { webbingOpsPool?: Pool };

export function database() {
  if (!process.env.WEBBING_OPS_DATABASE_URL) throw new Error("La base de gestion n’est pas configurée.");
  if (!globalDb.webbingOpsPool) {
    const url = new URL(process.env.WEBBING_OPS_DATABASE_URL);
    for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) url.searchParams.delete(key);
    globalDb.webbingOpsPool = new Pool({
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: true, ca: readFileSync(path.join(process.cwd(), "config/webbing-ops-ca.crt"), "utf8") },
      max: 4,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 8_000,
      statement_timeout: 15_000,
    });
  }
  return globalDb.webbingOpsPool;
}

export async function query<T extends import("pg").QueryResultRow = import("pg").QueryResultRow>(text: string, values: unknown[] = []) {
  return database().query<T>(text, values);
}
