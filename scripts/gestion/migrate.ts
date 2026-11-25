import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

async function main() {
  const { auth } = await import("../../src/lib/gestion/auth");
  const { database } = await import("../../src/lib/gestion/db");
  const { getMigrations } = await import("better-auth/db/migration");
  const plan = await getMigrations(auth().options);
  const compiled = await plan.compileMigrations();
  if (compiled.trim()) {
    mkdirSync("scripts/gestion/migrations", { recursive: true });
    writeFileSync("scripts/gestion/migrations/001-auth.sql", compiled);
  }
  await plan.runMigrations();
  await database().query(readFileSync("scripts/gestion/schema.sql", "utf8"));
  console.log("Schéma de gestion et authentification vérifiés.");
  await database().end();
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
