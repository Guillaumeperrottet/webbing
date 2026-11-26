import "server-only";
import { createHash, createHmac, randomUUID } from "node:crypto";
import { z } from "zod";
import config from "../../../scripts/releases/projects.json";
import { database, query } from "./db";
import { seal, unseal } from "./vault";
import { readDependencyApi } from "./github";
import { demand, validateDeployment, validateHistory, validateProject, validateQuality, type VercelDeployment, type VercelProject } from "./release-policy";
import { PublicationError, type ReleaseConnection, type ReleaseHistory, type ReleasePreview, type ReleaseProof } from "./release-state";

export type ReleaseActor = { email: string; sessionId: string };
export const publicationProjects = config.projects.filter(project => project.name !== "pattushotel");
const uuid = z.string().uuid();
function expectedProject(projectId: string) {
  const project = publicationProjects.find(project => project.id === projectId);
  demand(project, "Ce projet de production n’est pas autorisé à publier depuis Webbing.");
  return project;
}
async function vercel(token: string, path: string, method: "GET" | "POST" | "PATCH" = "GET", body?: unknown) {
  demand(/^\/v\d+\/[A-Za-z0-9_./%?=&-]+$/.test(path) && !path.includes(".."), "Requête Vercel invalide.");
  const url = new URL(path, "https://api.vercel.com"); url.searchParams.set("teamId", config.teamId);
  let response: Response;
  try { response = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000) }); }
  catch { throw new PublicationError("Vercel n’a pas confirmé la requête. Consulte le suivi avant toute nouvelle publication."); }
  if (!response.ok) throw new PublicationError(response.status === 401 || response.status === 403 ? "L’accès de publication Vercel a expiré ou ses droits sont insuffisants. Vérifie la connexion du projet." : "Vercel n’a pas confirmé la requête. Consulte le suivi avant toute nouvelle publication.");
  return response.status === 204 ? {} : response.json();
}
async function connection(projectId: string) {
  expectedProject(projectId);
  const row = (await query<{ id: string; secret_cipher: string }>("SELECT id,secret_cipher FROM ops_release_connections WHERE project_id=$1 AND expires_at>now()+interval '1 minute'", [projectId])).rows[0];
  demand(row, "Raccorde l’accès de publication Vercel de ce projet dans Connexions.");
  const token = unseal(row.secret_cipher, `${row.id}:vercel-release:${projectId}`);
  return (path: string, method?: "GET" | "POST" | "PATCH", body?: unknown) => vercel(token, path, method, body);
}
// Used by the owner-side provisioning command after Vercel issues a token for
// this single project. Never accept a user/team-wide CLI credential here.
export async function storeIssuedProjectToken(projectId: string, token: string, metadata: { id: string; expiresAt: number }, issuedForProject: string) {
  const expected = expectedProject(projectId);
  demand(issuedForProject === projectId && token.length >= 20 && metadata.id && metadata.expiresAt > Date.now() && metadata.expiresAt <= Date.now() + 91 * 86400_000, "Un jeton Vercel dédié au projet, avec expiration, est nécessaire.");
  const project = await vercel(token, `/v9/projects/${projectId}`);
  demand(project.id === projectId && project.accountId === config.teamId, "Projet ou équipe Vercel incorrects.");
  // Check the actual provider boundary, without reading another project's body.
  const other = publicationProjects.find(project => project.id !== projectId)!;
  const probe = await fetch(`https://api.vercel.com/v9/projects/${other.id}?teamId=${config.teamId}`, { headers: { Authorization: `Bearer ${token}` }, redirect: "error", cache: "no-store", signal: AbortSignal.timeout(10_000) });
  await probe.body?.cancel();
  demand(probe.status === 403 || probe.status === 404, "Le jeton Vercel doit être limité à un seul projet.");
  const id = randomUUID();
  await query(`INSERT INTO ops_release_connections(project_id,id,name,secret_cipher,token_id,expires_at) VALUES($1,$2,$3,$4,$5,$6)
    ON CONFLICT(project_id) DO UPDATE SET id=excluded.id,name=excluded.name,secret_cipher=excluded.secret_cipher,token_id=excluded.token_id,expires_at=excluded.expires_at,created_at=now()`, [projectId, id, expected.name, seal(token, `${id}:vercel-release:${projectId}`), metadata.id, new Date(metadata.expiresAt)]);
}
export async function releaseConnections(): Promise<ReleaseConnection[]> {
  const rows = (await query<ReleaseConnection>("SELECT project_id,name,expires_at FROM ops_release_connections ORDER BY name")).rows;
  return rows.map(row => ({ ...row, expires_at: new Date(row.expires_at).toISOString() }));
}
export async function removeReleaseConnection(projectId: string) {
  expectedProject(projectId);
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", ["webbing:release:" + projectId]);
    await client.query("DELETE FROM ops_release_connections WHERE project_id=$1 AND NOT EXISTS(SELECT 1 FROM ops_releases WHERE project_id=$1 AND status IN ('checking','publishing','safety_error'))", [projectId]);
    await client.query("COMMIT");
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}
export async function releaseHistory(email: string): Promise<ReleaseHistory[]> {
  return (await query<{ id: string; status: string; proof: ReleaseProof; error: string | null; requested_at: Date }>("SELECT id,status,proof,error,requested_at FROM ops_releases WHERE requested_by=$1 AND confirmed_at IS NOT NULL ORDER BY requested_at DESC LIMIT 12", [email])).rows.map(row => ({ id: row.id, status: row.status, proof: row.proof, error: row.error, requestedAt: new Date(row.requested_at).toISOString() }));
}

async function inspectRelease(projectId: string, selectedId?: string): Promise<ReleaseProof> {
  const expected = expectedProject(projectId), api = await connection(projectId);
  const repository = `${config.owner}/${expected.repository}`, root = `/repos/${repository}`;
  const github = await readDependencyApi(repository);
  const [project, repo] = await Promise.all([api(`/v9/projects/${projectId}`) as Promise<VercelProject>, github(root)]);
  validateProject(project, expected, config.owner, config.teamId);
  demand(repo.full_name === repository && repo.default_branch === project.link?.productionBranch, "La branche de production doit correspondre à la branche principale GitHub.");
  const branch = repo.default_branch as string;
  const [ref, previous, listed] = await Promise.all([
    github(`${root}/git/ref/heads/${encodeURIComponent(branch)}`),
    api(`/v13/deployments/${project.targets!.production!.id}`) as Promise<VercelDeployment>,
    selectedId ? Promise.resolve(null) : api(`/v6/deployments?projectId=${projectId}&target=production&limit=30`),
  ]);
  const previousSha = validateDeployment(previous, expected, config.owner), head = ref.object?.sha;
  demand(typeof head === "string" && /^[a-f0-9]{40}$/.test(head), "La révision GitHub est invalide.");
  const deploymentId = selectedId || listed?.deployments?.find((d: { uid: string; state: string; meta?: Record<string, string> }) => d.uid !== previous.id && d.state === "READY" && d.meta?.githubCommitSha === head)?.uid;
  demand(deploymentId && /^dpl_[A-Za-z0-9]+$/.test(deploymentId) && deploymentId !== previous.id, "Aucun nouveau build de production prêt ne correspond à la révision principale actuelle.");
  const [candidate, comparison, runs, pulls, domainList] = await Promise.all([
    api(`/v13/deployments/${deploymentId}`) as Promise<VercelDeployment>, github(`${root}/compare/${previousSha}...${head}`),
    github(`${root}/actions/workflows/webbing-application-checks.yml/runs?event=push&branch=${encodeURIComponent(branch)}&head_sha=${head}&per_page=30`),
    github(`${root}/commits/${head}/pulls?per_page=30`), api(`/v9/projects/${projectId}/domains?limit=100`),
  ]);
  const candidateSha = validateDeployment(candidate, expected, config.owner);
  demand(candidateSha === head && candidate.meta?.githubCommitRef === branch && candidate.readySubstate === "STAGED", "Ce build n’est plus la version de production prête à publier sur la branche principale.");
  validateHistory(comparison, previousSha);
  demand(!domainList.pagination?.next, "La liste des domaines est incomplète. Vérification manuelle requise.");
  const domains: string[] = domainList.domains?.filter((d: { gitBranch?: string; customEnvironmentId?: string; redirect?: string }) => !d.gitBranch && !d.customEnvironmentId && !d.redirect).map((d: { name: string }) => d.name).sort() || [];
  demand(domains.length > 0 && domains.length <= 20 && domains.every(domain => /^(?=.{1,253}$)[a-z0-9-]+(?:\.[a-z0-9-]+)+$/.test(domain)), "Les domaines de production ne peuvent pas être vérifiés.");
  const pull = Array.isArray(pulls) && pulls.find((pr: { merged_at?: string; merge_commit_sha?: string; base?: { ref: string; repo?: { full_name: string } } }) => pr.merged_at && pr.merge_commit_sha === head && pr.base?.ref === branch && pr.base.repo?.full_name === repository);
  demand(pull && Number.isSafeInteger(pull.number), "Cette révision finale n’est pas issue d’une PR fusionnée vérifiable.");
  const run = runs.workflow_runs?.find((r: { head_sha: string; event: string }) => r.head_sha === head && r.event === "push");
  demand(run && Number.isSafeInteger(run.id), "Les contrôles GitHub de la révision finale sont absents. Publication bloquée.");
  const jobs = await github(`${root}/actions/runs/${run.id}/jobs?per_page=100`);
  demand(jobs.total_count <= 100, "La liste des contrôles est incomplète. Publication bloquée.");
  validateQuality(runs.workflow_runs, jobs.jobs || [], head);
  await checkDomains(api, domains, previous.id);
  return { projectId, name: expected.name, repository, branch, deploymentId, sha: head, previousId: previous.id, previousSha, domains, url: `https://${candidate.url}`, runId: run.id, runUrl: `https://github.com/${repository}/actions/runs/${run.id}`, pullUrl: `https://github.com/${repository}/pull/${pull.number}` };
}
type Api = Awaited<ReturnType<typeof connection>>;
async function checkDomains(api: Api, domains: string[], id: string) {
  const aliases = await Promise.all(domains.map(domain => api(`/v4/aliases/${encodeURIComponent(domain)}`)));
  demand(aliases.every(alias => (alias.deploymentId || alias.deployment?.id) === id), "Les domaines ne pointent pas tous sur la version attendue. Consulte le suivi Vercel.");
}
function fingerprint(proof: ReleaseProof) { return createHash("sha256").update(JSON.stringify(proof, Object.keys(proof).sort())).digest("hex"); }
export async function prepareRelease(projectId: string, actor: ReleaseActor): Promise<ReleasePreview> {
  const active = await query("SELECT id FROM ops_releases WHERE project_id=$1 AND status IN ('checking','publishing','safety_error')", [projectId]);
  demand(!active.rowCount, "Une publication attend encore sa confirmation Vercel ou le rétablissement de sa protection. Actualise son suivi.");
  const proof = await inspectRelease(projectId), id = randomUUID();
  const row = (await query<{ expires_at: Date }>("INSERT INTO ops_releases(id,project_id,requested_by,session_id,proof) VALUES($1,$2,$3,$4,$5) RETURNING expires_at", [id, projectId, actor.email, actor.sessionId, JSON.stringify(proof)])).rows[0];
  return { ...proof, id, expiresAt: new Date(row.expires_at).toISOString() };
}

export async function confirmRelease(id: string, actor: ReleaseActor, code: string, verifiedCode: () => Promise<boolean>) {
  uuid.parse(id);
  demand(/^\d{6}$/.test(code), "Saisis le code à six chiffres de ton application d’authentification.");
  const saved = (await query<{ proof: ReleaseProof; status: string; expired: boolean }>("SELECT proof,status,(expires_at<now()) AS expired FROM ops_releases WHERE id=$1 AND requested_by=$2 AND session_id=$3", [id, actor.email, actor.sessionId])).rows[0];
  demand(saved && saved.status === "prepared" && !saved.expired, "Cette confirmation a expiré, a déjà été utilisée ou appartient à une autre session. Consulte le suivi avant de préparer à nouveau.");
  // Attempts are committed before verifying: an invalid code or a rolled-back
  // publication cannot erase the per-account limit (including other sessions).
  const attempt = await database().connect();
  try {
    await attempt.query("BEGIN"); await attempt.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", ["webbing:release-mfa:" + actor.email]);
    const n = (await attempt.query("SELECT count(*)::int AS n FROM ops_release_mfa_attempts WHERE actor=$1 AND attempted_at>now()-interval '5 minutes'", [actor.email])).rows[0].n;
    demand(n < 5, "Trop de tentatives de confirmation. Attends cinq minutes avant de saisir un nouveau code.");
    await attempt.query("INSERT INTO ops_release_mfa_attempts(actor) VALUES($1)", [actor.email]);
    await attempt.query("DELETE FROM ops_release_mfa_attempts WHERE attempted_at<now()-interval '1 day'");
    await attempt.query("COMMIT");
  } catch (error) { await attempt.query("ROLLBACK"); throw error; } finally { attempt.release(); }
  demand(await verifiedCode(), "Code 2FA incorrect ou expiré. La publication n’a pas démarré.");
  const secret = process.env.WEBBING_OPS_SECRET;
  demand(secret && secret.length >= 40, "La confirmation sécurisée est indisponible.");
  const digest = createHmac("sha256", secret).update(`webbing:release-totp:v1:${actor.email}:${code}`).digest("hex");
  const client = await database().connect();
  try {
    await client.query("BEGIN"); await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", ["webbing:release:" + saved.proof.projectId]);
    await client.query("DELETE FROM ops_release_mfa_codes WHERE used_at<now()-interval '2 minutes'");
    const used = await client.query("INSERT INTO ops_release_mfa_codes(digest) VALUES($1) ON CONFLICT DO NOTHING RETURNING digest", [digest]);
    demand(used.rowCount, "Ce code a déjà confirmé une publication. Attends le prochain code de ton application.");
    const busy = await client.query("SELECT id FROM ops_releases WHERE project_id=$1 AND status IN ('checking','publishing','safety_error')", [saved.proof.projectId]);
    demand(!busy.rowCount, "Une publication de ce projet est déjà en cours. Consulte son suivi.");
    const claimed = await client.query("UPDATE ops_releases SET status='checking',confirmed_at=now() WHERE id=$1 AND status='prepared' AND expires_at>now() RETURNING id", [id]);
    demand(claimed.rowCount, "Cette confirmation a déjà été utilisée ou a expiré.");
    await client.query("INSERT INTO ops_audit(kind,detail) VALUES('publication_confirmee',$1)", [`${saved.proof.name} · ${saved.proof.sha.slice(0,7)} · confirmation et 2FA · ${actor.email}`]);
    await client.query("COMMIT");
  } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }

  let dispatched = false, protectionRestored = false;
  try {
    const proof = await inspectRelease(saved.proof.projectId, saved.proof.deploymentId);
    demand(fingerprint(proof) === fingerprint(saved.proof), "La version, ses contrôles ou les domaines ont changé. Prépare une nouvelle publication.");
    const api = await connection(proof.projectId);
    await query("UPDATE ops_releases SET status='publishing' WHERE id=$1 AND status='checking'", [id]);
    // The reservation is durable BEFORE the single promotion POST. A lost
    // response is reconciled with GETs; it is never an invitation to retry POST.
    dispatched = true;
    try { await api(`/v10/projects/${proof.projectId}/promote/${proof.deploymentId}`, "POST"); }
    catch { /* Keep publishing until the actual provider state is known. */ }
    finally { await restoreProtection(api, proof.projectId); protectionRestored = true; }
    await reconcileRelease(id, proof);
  } catch (error) {
    if (dispatched) {
      await query("UPDATE ops_releases SET status=$2,error=$3 WHERE id=$1 AND status IN ('publishing','safety_error')", [id, protectionRestored ? "publishing" : "safety_error", protectionRestored ? "La protection est confirmée ; les domaines attendent encore leur vérification. Actualise le suivi sans renvoyer la publication." : "La promotion a été demandée, mais sa protection n’est pas confirmée. Vérifie Vercel et actualise le suivi. Aucun nouvel envoi automatique."]);
    } else await query("UPDATE ops_releases SET status='failed',finished_at=now(),error=$2 WHERE id=$1", [id, error instanceof PublicationError ? error.message : "La vérification finale a échoué avant la demande de publication."]);
  }
}
async function restoreProtection(api: Api, projectId: string) {
  // Idempotent safety writes may be repeated; the promotion POST may not.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await api(`/v9/projects/${projectId}`, "PATCH", { autoAssignCustomDomains: false });
      const project = await api(`/v9/projects/${projectId}`);
      if (project.autoAssignCustomDomains === false) return;
    } catch { /* bounded retry of protection only */ }
  }
  throw new PublicationError("La désactivation de la promotion automatique n’a pas été confirmée.");
}
async function reconcileRelease(id: string, proof: ReleaseProof) {
  const api = await connection(proof.projectId), project = await api(`/v9/projects/${proof.projectId}`) as VercelProject;
  if (project.autoAssignCustomDomains !== false) {
    await query("UPDATE ops_releases SET status='safety_error',error='La promotion automatique doit être désactivée dans Vercel.' WHERE id=$1", [id]); return;
  }
  const current = project.targets?.production?.id;
  if (current !== proof.deploymentId) return;
  await checkDomains(api, proof.domains, proof.deploymentId);
  await query(`WITH completed AS (UPDATE ops_releases SET status='succeeded',error=NULL,finished_at=now() WHERE id=$1 AND status IN ('publishing','safety_error') RETURNING id)
    INSERT INTO ops_audit(kind,detail) SELECT 'publication_en_ligne',$2 FROM completed`, [id, `${proof.name} · ${proof.sha.slice(0,7)} · domaines vérifiés · promotion automatique désactivée`]);
}
export async function refreshReleaseProgress(email: string) {
  const rows = (await query<{ id: string; proof: ReleaseProof }>("SELECT id,proof FROM ops_releases WHERE requested_by=$1 AND status IN ('publishing','safety_error') ORDER BY requested_at LIMIT 3", [email])).rows;
  for (const row of rows) {
    try { await reconcileRelease(row.id, row.proof); }
    catch { /* GETs only. Preserve an uncertain result and never repeat promotion. */ }
  }
}

export async function recoverPublicationProtection() {
  // A process killed between promotion and finally must not leave automatic
  // promotion enabled. This job can only disable that setting and read state.
  await query("UPDATE ops_releases SET status='failed',finished_at=now(),error='La vérification a été interrompue avant la demande de publication. Prépare une nouvelle confirmation.' WHERE status='checking' AND confirmed_at<now()-interval '5 minutes'");
  const pending = (await query<{ id: string; proof: ReleaseProof }>("SELECT id,proof FROM ops_releases WHERE status IN ('publishing','safety_error') ORDER BY requested_at LIMIT 3")).rows;
  const results = await Promise.allSettled(pending.map(async row => {
    try {
      const api = await connection(row.proof.projectId);
      await restoreProtection(api, row.proof.projectId);
      await reconcileRelease(row.id, row.proof);
    } catch {
      await query("UPDATE ops_releases SET status='safety_error',error='Le contrôle périodique ne peut pas confirmer la protection. Vérifie Vercel et l’accès de publication du projet.' WHERE id=$1 AND status IN ('publishing','safety_error')", [row.id]);
      throw new PublicationError("Protection de publication non confirmée.");
    }
  }));
  if (results.some(result => result.status === "rejected")) throw new PublicationError("Protection de publication non confirmée.");
  return results.filter(result => result.status === "fulfilled").length;
}
