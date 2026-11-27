import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import config from "../../../scripts/releases/projects.json";
import { database, query } from "./db";
import { unseal } from "./vault";
import { validGitHubSignature, validateOwnerPush, type OwnerRule } from "./owner-release-policy";
import { dispatchReservedRelease, inspectRelease } from "./releases";
import { demand } from "./release-policy";
import { releaseError } from "./release-state";

const identity = z.object({ id: z.number().int().positive(), login: z.string().max(100), type: z.string().max(50) });
const envelope = z.object({ repository: z.object({ id: z.number().int().positive(), full_name: z.string().max(200) }), sender: identity });
const pushEvent = envelope.extend({ ref: z.string(), before: z.string(), after: z.string(), forced: z.boolean(), deleted: z.boolean(), created: z.boolean() });
const workflowEvent = envelope.extend({ action: z.literal("completed"), workflow_run: z.object({ event: z.literal("push"), head_sha: z.string().regex(/^[a-f0-9]{40}$/), head_branch: z.string(), path: z.literal(".github/workflows/webbing-application-checks.yml") }) });
type Push = { id: string; repository: string; head_sha: string; received_at: string };

export async function ownerPublicationRules() {
  return (await query<{ repository: string; owner_login: string; branch: string; enabled: boolean; enabled_at: string; last_error: string | null; state: string | null }>(`SELECT r.repository,r.owner_login,r.branch,r.enabled,r.enabled_at,coalesce(p.last_error,r.blocked_reason) AS last_error,p.state
    FROM ops_owner_release_rules r LEFT JOIN LATERAL (SELECT state,last_error FROM ops_owner_pushes WHERE repository=r.repository ORDER BY received_at DESC LIMIT 1) p ON true ORDER BY r.repository`)).rows;
}

export async function receiveOwnerEvent(body: Buffer, signature: string | null, delivery: string, event: string) {
  demand(/^[a-f0-9-]{36}$/.test(delivery), "Identifiant GitHub invalide.");
  const input: unknown = JSON.parse(body.toString("utf8"));
  const base = envelope.parse(input);
  const rule = (await query<OwnerRule & { secret_cipher: string }>("SELECT * FROM ops_owner_release_rules WHERE repository=$1 AND enabled", [base.repository.full_name])).rows[0];
  demand(rule && validGitHubSignature(body, signature, unseal(rule.secret_cipher, `owner-release:${rule.repository}`)), "Signature GitHub refusée.");
  demand(String(base.repository.id) === String(rule.repository_id), "Dépôt GitHub incorrect.");
  // pg returns bigint as strings; normalize configuration before comparison.
  rule.owner_id = String(rule.owner_id); rule.repository_id = String(rule.repository_id);
  if (event === "ping") return { accepted: true, repository: rule.repository, process: false };
  if (event === "push") {
    const push = pushEvent.parse(input);
    try { validateOwnerPush(push, rule); } catch { return { accepted: false, repository: rule.repository, process: false }; }
    const inserted = await query("INSERT INTO ops_owner_pushes(id,delivery_id,repository,before_sha,head_sha) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING RETURNING id", [randomUUID(), delivery, rule.repository, push.before, push.after]);
    return { accepted: true, repository: rule.repository, process: !!inserted.rowCount };
  }
  if (event === "workflow_run") {
    const workflow = workflowEvent.safeParse(input);
    return { accepted: !!workflow.success, repository: rule.repository, process: !!workflow.success && workflow.data.workflow_run.head_branch === rule.branch };
  }
  return { accepted: false, repository: rule.repository, process: false };
}

async function processPush(push: Push, project: { id: string; name: string }) {
  const rule = (await query<OwnerRule>("SELECT repository,repository_id,owner_id,owner_login,branch,enabled_at::text AS enabled_at,enabled FROM ops_owner_release_rules WHERE repository=$1 AND enabled", [push.repository])).rows[0];
  if (!rule) return;
  rule.owner_id = String(rule.owner_id); rule.repository_id = String(rule.repository_id);
  if ((await query("SELECT release_id FROM ops_owner_release_attempts WHERE push_id=$1 AND project_id=$2", [push.id, project.id])).rowCount) return;
  const owner = { rule, head: push.head_sha, pushId: push.id };
  try {
    const proof = await inspectRelease(project.id, undefined, owner);
    const actor = process.env.WEBBING_OPS_ADMIN_EMAIL?.trim().toLowerCase();
    demand(actor, "Compte de gestion manquant.");
    const client = await database().connect(), releaseId = randomUUID(); let reserved = false;
    try {
      await client.query("BEGIN");
      await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", ["webbing:release:" + project.id]);
      const active = await client.query("SELECT id FROM ops_releases WHERE project_id=$1 AND status IN ('checking','publishing','safety_error')", [project.id]);
      const existing = await client.query("SELECT release_id FROM ops_owner_release_attempts WHERE push_id=$1 AND project_id=$2", [push.id, project.id]);
      const currentRule = await client.query("SELECT repository FROM ops_owner_release_rules WHERE repository=$1 AND enabled AND enabled_at=$2", [rule.repository, rule.enabled_at]);
      if (!active.rowCount && !existing.rowCount && currentRule.rowCount) {
        await client.query("INSERT INTO ops_releases(id,project_id,requested_by,session_id,proof,status,confirmed_at) VALUES($1,$2,$3,$4,$5,'checking',now())", [releaseId, project.id, actor, "owner-push:" + push.id, JSON.stringify(proof)]);
        await client.query("INSERT INTO ops_owner_release_attempts(push_id,project_id,release_id) VALUES($1,$2,$3)", [push.id, project.id, releaseId]);
        await client.query("INSERT INTO ops_audit(kind,detail) VALUES('publication_personnelle',$1)", [`${project.name} · ${proof.sha.slice(0,7)} · push ${rule.owner_login} · contrôles réussis`]);
        reserved = true;
      }
      await client.query("COMMIT");
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
    if (reserved) {
      await dispatchReservedRelease(releaseId, proof, async () => {
        const current = (await query<OwnerRule>("SELECT repository,repository_id,owner_id,owner_login,branch,enabled_at::text AS enabled_at,enabled FROM ops_owner_release_rules WHERE repository=$1 AND enabled AND enabled_at=$2", [rule.repository, rule.enabled_at])).rows[0];
        demand(current, "La publication personnelle a été désactivée.");
        current.owner_id = String(current.owner_id); current.repository_id = String(current.repository_id);
        return inspectRelease(project.id, proof.deploymentId, { ...owner, rule: current });
      });
      await query("UPDATE ops_owner_pushes SET last_error=NULL,checked_at=now() WHERE id=$1", [push.id]);
    }
  } catch (error) {
    await query("UPDATE ops_owner_pushes SET last_error=$2,checked_at=now() WHERE id=$1 AND NOT EXISTS(SELECT 1 FROM ops_owner_release_attempts WHERE push_id=$1 AND project_id=$3)", [push.id, releaseError(error), project.id]);
  }
}

export async function processOwnerPublications(repository?: string, projectId?: string) {
  const pushes = (await query<Push>(`SELECT p.id,p.repository,p.head_sha,p.received_at FROM ops_owner_pushes p JOIN ops_owner_release_rules r ON r.repository=p.repository AND r.enabled
    WHERE p.state='waiting' AND ($1::text IS NULL OR p.repository=$1) AND p.received_at=(SELECT max(x.received_at) FROM ops_owner_pushes x WHERE x.repository=p.repository)
    ORDER BY p.checked_at NULLS FIRST,p.received_at DESC LIMIT 2`, [repository || null])).rows;
  for (const push of pushes) {
    const projects = config.projects.filter(project => `${config.owner}/${project.repository}` === push.repository && (!projectId || project.id === projectId));
    for (const project of projects) await processPush(push, project);
    const totalProjects = config.projects.filter(project => `${config.owner}/${project.repository}` === push.repository).length;
    const attempted = await query("SELECT project_id FROM ops_owner_release_attempts WHERE push_id=$1", [push.id]);
    if (attempted.rowCount === totalProjects) await query("UPDATE ops_owner_pushes SET state='handled',checked_at=now() WHERE id=$1", [push.id]);
    await query("UPDATE ops_owner_pushes SET state='superseded',checked_at=now() WHERE repository=$1 AND state='waiting' AND received_at<$2", [push.repository, push.received_at]);
  }
  return pushes.length;
}
