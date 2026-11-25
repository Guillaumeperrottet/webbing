"use server";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/gestion/access";
import { query } from "@/lib/gestion/db";
import { probeApplications } from "@/lib/gestion/data";
import { tokenHash } from "@/lib/gestion/security";
import { connectSupabase, syncSupabase } from "@/lib/gestion/providers";

export async function addSupabaseConnection(form: FormData) {
  await requireAdmin();
  try {
    const result = await connectSupabase(String(form.get("name") || ""), String(form.get("token") || "").trim(), form.getAll("refs").map(String));
    revalidatePath("/gestion");
    const missing=result.excludedRefs.length?(await query<{name:string}>("SELECT name FROM ops_supabase_projects WHERE ref=ANY($1::text[]) ORDER BY name",[result.excludedRefs])).rows.map(p=>p.name):[];
    return { ok: true, message: `${result.updated?'Connexion mise à jour. ':''}${result.connected} projet(s) raccordé(s).${result.excluded ? ` Accès manquant pour ${missing.join(', ') || `${result.excluded} projet(s)`} : ajouter un jeton autorisé pour ces projets.` : ""}` };
  } catch (error) {
    const message=error instanceof Error ? error.message : "";
    return { ok:false,message:/^(Utilise|Choisis|Accès refusé|Jeton refusé|Ce jeton|Supabase|Limite de requêtes)/.test(message)?message:"La connexion n’a pas pu être vérifiée. Réessaie dans un instant." };
  }
}
export async function refreshProviders() {
  await requireAdmin();
  const lock=await query("INSERT INTO ops_jobs(name,last_run) VALUES('providers',now()) ON CONFLICT(name) DO UPDATE SET last_run=now() WHERE ops_jobs.last_run < now()-interval '60 seconds' RETURNING name");
  if(lock.rowCount) await syncSupabase();
  revalidatePath("/gestion");
}
export async function disconnectProvider(form: FormData) {
  await requireAdmin();
  const id=String(form.get("id")||"");
  if(!/^[0-9a-f-]{36}$/.test(id)) throw new Error("Identifiant invalide.");
  await query(`WITH revoked AS (UPDATE ops_integrations SET revoked_at=now(),secret_cipher='' WHERE id=$1 AND provider='supabase' RETURNING id)
    UPDATE ops_supabase_projects SET integration_id=NULL WHERE integration_id IN (SELECT id FROM revoked)`,[id]);
  await query("INSERT INTO ops_audit(kind,detail) VALUES('connexion_supprimee','Accès de synchronisation retiré de Webbing')");
  revalidatePath("/gestion");
}

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
