import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { database, query } from "./db";
import { seal, unseal } from "./vault";
import { deploymentState, deploymentUrl, eventDate, vercelEventSchema } from "./vercel-events";

export type Integration = { id: string; provider: "vercel" | "supabase"; name: string; config: Record<string, unknown>; last_sync_at: string | null; last_attempt_at: string | null; last_error: string | null; created_at: string };
export async function integrations() {
  return (await query<Integration>("SELECT id,provider,name,config,last_sync_at,last_attempt_at,last_error,created_at FROM ops_integrations WHERE revoked_at IS NULL ORDER BY provider,name")).rows;
}
export async function receiveVercelEvent(input: unknown, integrationId: string, teamId: string) {
  const event = vercelEventSchema.parse(input);
  if (event.payload.team?.id !== teamId) throw new Error("Équipe non autorisée.");
  const timestamp = eventDate(event.createdAt);
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    const inserted = await client.query("INSERT INTO ops_provider_events(event_id,integration_id,event_type,event_at) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING event_id", [event.id,integrationId,event.type,timestamp]);
    if (!inserted.rowCount) { await client.query("COMMIT"); return { duplicate: true }; }
    const p = event.payload.project;
    let app = (await client.query("SELECT id,current_deployment_at FROM ops_applications WHERE vercel_id=$1 FOR UPDATE", [p.id])).rows[0];
    if (!app && event.type !== "project.removed") {
      const name = p.name || event.payload.deployment?.name || p.id;
      const slug = `${name.toLowerCase().replace(/[^a-z0-9-]/g,"-").slice(0,90)}-${p.id.slice(-8)}`;
      app = (await client.query("INSERT INTO ops_applications(slug,name,vercel_id,environment,url,provider_synced_at) VALUES($1,$2,$3,$4,$5,now()) RETURNING id,current_deployment_at", [slug,name,p.id,name.includes("staging") ? "staging" : "production",deploymentUrl(event.payload.deployment?.url || "")])).rows[0];
    }
    if (app) {
      if (event.type === "project.removed") await client.query("UPDATE ops_applications SET archived_at=$1,provider_synced_at=now() WHERE id=$2",[timestamp,app.id]);
      else if (event.type === "project.renamed" && p.name) await client.query("UPDATE ops_applications SET name=$1,provider_synced_at=now() WHERE id=$2",[p.name,app.id]);
      const deployment = event.payload.deployment;
      const state = deploymentState(event.type);
      if (deployment && state) {
        const meta = deployment.meta || {};
        const text = (value: unknown, max: number) => typeof value === "string" ? value.slice(0,max) : null;
        const createdAt = deployment.createdAt ? new Date(deployment.createdAt) : timestamp;
        await client.query(`INSERT INTO ops_deployments(deployment_id,application_id,target,state,url,branch,commit_sha,created_at,event_at)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(deployment_id) DO UPDATE SET
          state=excluded.state,event_at=excluded.event_at,observed_at=now(),branch=coalesce(excluded.branch,ops_deployments.branch),commit_sha=coalesce(excluded.commit_sha,ops_deployments.commit_sha)
          WHERE ops_deployments.event_at<=excluded.event_at`,
          [deployment.id,app.id,event.payload.target || deployment.target || "preview",state,deploymentUrl(deployment.url),text(meta.githubCommitRef || meta.gitlabCommitRef || meta.bitbucketCommitRef,200),text(meta.githubCommitSha || meta.gitlabCommitSha || meta.bitbucketCommitSha,80),createdAt,timestamp]);
        if (event.type === "deployment.promoted") await client.query("UPDATE ops_applications SET current_deployment_id=$1,current_deployment_at=$2,rollback_pending=false WHERE id=$3 AND (current_deployment_at IS NULL OR current_deployment_at<=$2)",[deployment.id,timestamp,app.id]);
      }
      if (event.type === "deployment.rollback") await client.query("UPDATE ops_applications SET rollback_pending=true,provider_synced_at=now() WHERE id=$1",[app.id]);
      await client.query("UPDATE ops_applications SET provider_synced_at=now() WHERE id=$1",[app.id]);
    }
    await client.query("UPDATE ops_integrations SET last_sync_at=now(),last_attempt_at=now(),last_error=NULL WHERE id=$1",[integrationId]);
    await client.query("INSERT INTO ops_audit(kind,detail) VALUES('vercel_evenement',$1)",[`${event.type} · ${p.name || event.payload.deployment?.name || p.id}`]);
    await client.query("COMMIT");
    return { duplicate: false };
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}

const refSchema = z.string().regex(/^[a-z0-9]{15,32}$/);
const projectSchema = z.object({ id: refSchema.optional(), ref: refSchema.optional(), name: z.string().max(200), status: z.string().max(80), region: z.string().max(80).optional() });
const servicesSchema = z.array(z.object({ name: z.string().max(60), status: z.string().max(60), healthy: z.boolean().optional() })).max(30);
class ProviderError extends Error { constructor(public status: number) { super(status === 401 || status === 403 ? "Accès refusé : vérifier le jeton et ses permissions de lecture." : status === 429 ? "Limite de requêtes Supabase atteinte." : "Supabase est momentanément indisponible."); } }
async function supabaseRequest(token: string, path: string) {
  let response: Response;
  try { response = await fetch(`https://api.supabase.com/v1${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000) }); }
  catch { throw new Error("Supabase n’est pas joignable."); }
  if (!response.ok) throw new ProviderError(response.status);
  return response.json();
}
export async function readSupabaseProject(token: string, ref: string) {
  refSchema.parse(ref);
  const project = projectSchema.parse(await supabaseRequest(token, `/projects/${ref}`));
  if ((project.id || project.ref) !== ref) throw new Error("Supabase a retourné un projet différent du projet demandé.");
  let services: z.infer<typeof servicesSchema> = []; let servicesError: string | null = null;
  if (project.status === "ACTIVE_HEALTHY") {
    try { services = servicesSchema.parse(await supabaseRequest(token, `/projects/${ref}/health?services=auth,db,rest,storage,realtime&timeout_ms=4000`)); }
    catch (error) { servicesError = error instanceof ProviderError ? error.message : "Les états des services ne sont pas disponibles."; }
  }
  return { project, services, servicesError };
}
export async function connectSupabase(name: string, token: string, refs: string[]) {
  if (!/^sbp_fc[A-Za-z0-9_-]{20,}$/.test(token) || token.length>2048) throw new Error("Utilise un jeton Supabase à permissions limitées (préfixe sbp_fc), avec Project Settings en lecture.");
  if (!name.trim() || name.length>80 || !refs.length || refs.length>25) throw new Error("Choisis un nom et les projets à raccorder.");
  const unique = [...new Set(refs.map((ref) => refSchema.parse(ref)))];
  const id = randomUUID();
  const results: {ref: string; value: Awaited<ReturnType<typeof readSupabaseProject>>}[]=[];
  for (let i=0;i<unique.length;i+=4) {
    const batch=await Promise.allSettled(unique.slice(i,i+4).map(async(ref)=>({ref,value:await readSupabaseProject(token,ref)})));
    for(const item of batch){
      if(item.status==='fulfilled')results.push(item.value);
      else if(!(item.reason instanceof ProviderError&&item.reason.status===403)) throw item.reason;
    }
  }
  if (!results.length) throw new Error("Ce jeton n’a accès à aucun des projets sélectionnés.");
  const client=await database().connect();
  try {
    await client.query("BEGIN");
    await client.query("INSERT INTO ops_integrations(id,provider,name,secret_cipher,config,last_sync_at,last_attempt_at) VALUES($1,'supabase',$2,$3,$4,now(),now())",[id,name.trim(),seal(token,`${id}:supabase`),JSON.stringify({refs:results.map((r)=>r.ref)})]);
    for (const r of results) await storeSupabase(client,r.ref,id,r.value);
    await client.query("INSERT INTO ops_audit(kind,detail) VALUES('supabase_connexion',$1)",[`${name.trim()} · ${results.length} projet(s)`]);
    await client.query("COMMIT");
  } catch(error) { await client.query("ROLLBACK"); throw error; } finally {client.release();}
  return { connected: results.length, excluded: unique.length-results.length };
}
async function storeSupabase(client: Pick<import("pg").PoolClient,"query">,ref: string,id: string,value: Awaited<ReturnType<typeof readSupabaseProject>>) {
  await client.query(`INSERT INTO ops_supabase_projects(ref,name,region,status,services,services_error,integration_id,checked_at,attempted_at,last_error)
    VALUES($1,$2,$3,$4,$5,$6,$7,now(),now(),NULL) ON CONFLICT(ref) DO UPDATE SET name=excluded.name,region=excluded.region,status=excluded.status,services=excluded.services,services_error=excluded.services_error,integration_id=excluded.integration_id,checked_at=now(),attempted_at=now(),last_error=NULL`,[ref,value.project.name,value.project.region || null,value.project.status,JSON.stringify(value.services),value.servicesError,id]);
}
export async function syncSupabase() {
  const connections = (await query<{id:string;secret_cipher:string;config:{refs:string[]}}>("SELECT id,secret_cipher,config FROM ops_integrations WHERE provider='supabase' AND revoked_at IS NULL ORDER BY created_at")).rows;
  let checked=0;
  for (const connection of connections) {
    let failures=0; let failureMessage: string | null=null;
    let token:string;
    try { token=unseal(connection.secret_cipher,`${connection.id}:supabase`); }
    catch {
      const message='La clé de connexion ne peut pas être déchiffrée. Raccorder de nouveau ce compte.';
      await query("UPDATE ops_integrations SET last_attempt_at=now(),last_error=$1 WHERE id=$2",[message,connection.id]);
      await query("UPDATE ops_supabase_projects SET attempted_at=now(),last_error=$1 WHERE integration_id=$2",[message,connection.id]);
      continue;
    }
    for (let i=0;i<connection.config.refs.length;i+=4) {
      await Promise.all(connection.config.refs.slice(i,i+4).map(async(ref)=>{
        try { await storeSupabase(database(),ref,connection.id,await readSupabaseProject(token,ref)); checked++; }
        catch(error){ failures++;failureMessage=error instanceof Error?error.message:"Vérification impossible.";await query("UPDATE ops_supabase_projects SET attempted_at=now(),last_error=$1 WHERE ref=$2 AND integration_id=$3",[failureMessage,ref,connection.id]); }
      }));
    }
    await query("UPDATE ops_integrations SET last_attempt_at=now(),last_sync_at=CASE WHEN $1=0 THEN now() ELSE last_sync_at END,last_error=$2 WHERE id=$3",[failures,failureMessage,connection.id]);
  }
  return checked;
}
