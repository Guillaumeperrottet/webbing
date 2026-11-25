"use server";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/gestion/access";
import { query } from "@/lib/gestion/db";
import { probeApplications } from "@/lib/gestion/data";
import { tokenHash } from "@/lib/gestion/security";

export async function refreshHealth() {
  await requireAdmin();
  const lock = await query("INSERT INTO ops_jobs(name,last_run) VALUES('health',now()) ON CONFLICT(name) DO UPDATE SET last_run=now() WHERE ops_jobs.last_run < now()-interval '60 seconds' RETURNING name");
  if (lock.rowCount) await probeApplications();
  revalidatePath("/gestion");
}
export async function createCollector(name: string) {
  await requireAdmin();
  if (!name.trim() || name.length > 80) throw new Error("Nom invalide.");
  const token = randomBytes(32).toString("base64url");
  const result = await query("INSERT INTO ops_collectors(name,token_hash) VALUES($1,$2) RETURNING id", [name.trim(), tokenHash(token)]);
  await query("INSERT INTO ops_audit(kind,detail) VALUES('collecteur_cree',$1)", [name.trim()]);
  revalidatePath("/gestion");
  const sources = await query("SELECT application,directory,last_success,expected_project,max_age_hours FROM ops_nas_sources ORDER BY application");
  return { id: result.rows[0].id as string, config: {
    endpoint: "https://www.webbing.ch/api/gestion/collecte", token,
    backups: sources.rows.map((s) => ({ application: s.application, directory: s.directory, lastSuccess: s.last_success, expectedProject: s.expected_project, maxAgeHours: s.max_age_hours })),
  } };
}
export async function revokeCollector(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") || "");
  if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error("Identifiant invalide.");
  await query("UPDATE ops_collectors SET revoked_at=now() WHERE id=$1", [id]);
  await query("INSERT INTO ops_audit(kind,detail) VALUES('collecteur_revoque','Accès aux rapports supprimé')");
  revalidatePath("/gestion");
}
