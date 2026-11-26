"use server";
import { randomBytes } from "node:crypto";
import { after } from "next/server";
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

export async function addGitHubConnection(form: FormData) {
  await requireAdmin();
  try {
    const {connectGitHub,syncGitHub}=await import('@/lib/gestion/github');
    const result=await connectGitHub(String(form.get('name')||''),String(form.get('token')||'').trim(),form.getAll('repos').map(String));
    after(async()=>{await syncGitHub();});
    revalidatePath('/gestion');
    return {ok:true,message:`${result.connected} dépôt(s) raccordé(s).${result.excluded?` ${result.excluded} dépôt(s) restent à autoriser dans le jeton.`:''}`};
  }catch(error){const message=error instanceof Error?error.message:'';return {ok:false,message:/^(Utilise|Choisis|Ce jeton|Le jeton|Jeton GitHub|Droits GitHub|GitHub)/.test(message)?message:'Le raccordement GitHub n’a pas pu être vérifié.'};}
}
export async function refreshDependencies(){
  await requireAdmin();
  const lock=await query("INSERT INTO ops_jobs(name,last_run) VALUES('github',now()) ON CONFLICT(name) DO UPDATE SET last_run=now() WHERE ops_jobs.last_run<now()-interval '60 seconds' RETURNING name");
  if(lock.rowCount){const {syncGitHub}=await import('@/lib/gestion/github');await syncGitHub();}
  revalidatePath('/gestion');
}
export async function approveDependencyUpdate(form:FormData){
  const admin=await requireAdmin();
  const repository=String(form.get('repository')||''),number=Number(form.get('number'));
  if(!Number.isSafeInteger(number)||number<1)return {ok:false,message:'Proposition invalide.'};
  try{
    const {approveDependency}=await import('@/lib/gestion/github');
    await approveDependency(repository,number,String(form.get('head')||''),String(form.get('base')||''),admin.user.email);
    revalidatePath('/gestion');return {ok:true,message:'Validation transmise à GitHub. Les contrôles seront relus avant la fusion ; son résultat apparaîtra après synchronisation.'};
  }catch(error){const message=error instanceof Error?error.message:'';return {ok:false,message:/^(La proposition|Les vérifications|Un contrôle|Cette mise|Cette proposition|GitHub|Droits GitHub|Jeton GitHub|Raccorder|La branche)/.test(message)?message:'La mise à jour n’a pas pu être validée. Actualise les contrôles avant de réessayer.'};}
}
export async function disconnectGitHub(form:FormData){
  await requireAdmin();const id=String(form.get('id')||'');if(!/^[0-9a-f-]{36}$/.test(id))throw new Error('Identifiant invalide.');
  await query(`WITH removed AS (UPDATE ops_integrations SET revoked_at=now(),secret_cipher='' WHERE id=$1 AND provider='github' RETURNING id) UPDATE ops_repositories SET integration_id=NULL WHERE integration_id IN (SELECT id FROM removed)`,[id]);
  await query("INSERT INTO ops_audit(kind,detail) VALUES('connexion_supprimee','Accès GitHub retiré de Webbing')");revalidatePath('/gestion');
}

export async function launchDependencyTests(form:FormData){
 const admin=await requireAdmin();
 const repository=String(form.get('repository')||''),number=Number(form.get('number'));
 if(!Number.isSafeInteger(number)||number<1)return {ok:false,message:'Proposition invalide.'};
 try{
  const {requestDependencyTests}=await import('@/lib/gestion/github');
  await requestDependencyTests(repository,number,String(form.get('head')||''),String(form.get('base')||''),admin.user.email);
  revalidatePath('/gestion');return {ok:true,message:'Tests demandés à GitHub pour ce lot. Aucune mise à jour n’est validée par ce lancement.'};
 }catch(error){const message=error instanceof Error?error.message:'';return {ok:false,message:/^(La proposition|Cette proposition|Des tests|GitHub|Droits GitHub|Jeton GitHub|Raccorder|Attends)/.test(message)?message:'Les tests n’ont pas pu être demandés. Vérifie le workflow et le budget Actions avant de réessayer.'};}
}

function batchError(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return /^(Choisis|La proposition|Cette proposition|Cette préparation|Cette mise|Des tests|Un lot|La branche|GitHub|Droits GitHub|Jeton GitHub|Raccorder|Attends)/.test(message) ? message : "Le lot n’a pas pu être préparé ou lancé. Actualise les résultats et vérifie l’accès GitHub avant de réessayer.";
}

export async function prepareTestsBatch(form: FormData) {
  const admin = await requireAdmin();
  try {
    const raw = String(form.get("selection") || "");
    if (raw.length > 5000) return { ok: false as const, message: "Choisis au maximum trois dépôts." };
    const { prepareDependencyBatch } = await import("@/lib/gestion/dependency-batches");
    const preview = await prepareDependencyBatch(JSON.parse(raw), { email: admin.user.email, sessionId: admin.session.id });
    return { ok: true as const, preview };
  } catch (error) { return { ok: false as const, message: batchError(error) }; }
}

export async function confirmTestsBatch(form: FormData) {
  const admin = await requireAdmin();
  try {
    const { confirmDependencyBatch } = await import("@/lib/gestion/dependency-batches");
    await confirmDependencyBatch(String(form.get("batch") || ""), { email: admin.user.email, sessionId: admin.session.id });
    revalidatePath("/gestion");
    return { ok: true, message: "Lot confirmé. Le suivi indique les demandes envoyées, refusées ou en attente de confirmation. Aucune proposition n’est fusionnée." };
  } catch (error) { return { ok: false, message: batchError(error) }; }
}

export async function refreshTestsProgress() {
  await requireAdmin();
  const { refreshDependencyProgress } = await import("@/lib/gestion/dependency-batches");
  await refreshDependencyProgress();
  revalidatePath("/gestion");
}

export async function preparePublication(form: FormData) {
  const admin = await requireAdmin();
  const { releaseError } = await import("@/lib/gestion/release-state");
  try {
    const { prepareRelease } = await import("@/lib/gestion/releases");
    const preview = await prepareRelease(String(form.get("project") || ""), { email: admin.user.email, sessionId: admin.session.id });
    return { ok: true as const, preview };
  } catch (error) { return { ok: false as const, message: releaseError(error) }; }
}

export async function confirmPublication(form: FormData) {
  const admin = await requireAdmin();
  const { releaseError, PublicationError } = await import("@/lib/gestion/release-state");
  try {
    if (form.get("reviewed") !== "yes") throw new PublicationError("Confirme la vérification des parcours importants et des changements inclus avant de publier.");
    const { headers } = await import("next/headers");
    const { auth } = await import("@/lib/gestion/auth");
    const { confirmRelease } = await import("@/lib/gestion/releases");
    const requestHeaders = await headers(), code = String(form.get("code") || "").trim();
    await confirmRelease(String(form.get("release") || ""), { email: admin.user.email, sessionId: admin.session.id }, code, async () => {
      try {
        // Discard the authentication response, which contains a session token.
        // Only the boolean result enters the publication service.
        await auth().api.verifyTOTP({ headers: requestHeaders, body: { code, trustDevice: false } });
        return true;
      } catch { return false; }
    });
    revalidatePath("/gestion");
    return { ok: true, message: "Confirmation traitée. Le suivi ci-dessous indique si les domaines servent effectivement cette version. En cas d’attente, actualise le suivi avant toute nouvelle demande." };
  } catch (error) { return { ok: false, message: releaseError(error) }; }
}

export async function refreshPublications() {
  const admin = await requireAdmin();
  const { refreshReleaseProgress } = await import("@/lib/gestion/releases");
  await refreshReleaseProgress(admin.user.email);
  revalidatePath("/gestion");
}

export async function disconnectPublication(form: FormData) {
  await requireAdmin();
  const project = String(form.get("project") || "");
  const { removeReleaseConnection } = await import("@/lib/gestion/releases");
  await removeReleaseConnection(project);
  revalidatePath("/gestion");
}
