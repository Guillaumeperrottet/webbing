import "server-only";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { database, query } from "./db";
import { readDependencyApi, sendReservedDependencyTests, reconcileDependencyTests, settleDependencyBatches, syncGitHub } from "./github";
import { resolveDependencyCheck } from "../../../scripts/dependencies/policy.mjs";
import { MAX_MANUAL_TESTS, type BatchItem, type BatchPreview, type BatchResult, type BatchSelection } from "./dependency-test-state";

const selectionSchema = z.array(z.object({
  repository: z.string().regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/),
  number: z.number().int().positive(), head: z.string().regex(/^[a-f0-9]{40}$/), base: z.string().regex(/^[a-f0-9]{40}$/),
})).min(1).max(MAX_MANUAL_TESTS);
const uuid = z.string().uuid();
type Actor = { email: string; sessionId: string };

export async function prepareDependencyBatch(selections: BatchSelection[], actor: Actor): Promise<BatchPreview> {
  const selected = selectionSchema.safeParse(selections);
  if (!selected.success || new Set(selected.data.map(item => item.repository)).size !== selected.data.length) throw new Error("Choisis un à trois dépôts, avec une seule proposition par dépôt.");
  const items: BatchItem[] = [];
  // All calls in preparation are GETs. Nothing can consume Actions minutes.
  for (const item of selected.data) {
    const saved = (await query<{ title: string; update_type: string }>("SELECT title,update_type FROM ops_dependency_updates WHERE repository=$1 AND number=$2 AND state='open' AND head_sha=$3 AND base_sha=$4", [item.repository, item.number, item.head, item.base])).rows[0];
    if (!saved) throw new Error("La proposition a changé ou n’est plus disponible. Actualise les mises à jour.");
    const api = await readDependencyApi(item.repository);
    await resolveDependencyCheck(api, item.repository, item.number, { expectedHead: item.head, expectedBase: item.base });
    const repository = await api(`/repos/${item.repository}`);
    items.push({ ...item, requestId: randomUUID(), title: saved.title, updateType: saved.update_type, private: repository.private !== false });
  }
  const id = randomUUID();
  const row = (await query<{ expires_at: Date }>("INSERT INTO ops_dependency_batches(id,requested_by,session_id,items) VALUES($1,$2,$3,$4) RETURNING expires_at", [id, actor.email, actor.sessionId, JSON.stringify(items)])).rows[0];
  return { id, items, expiresAt: new Date(row.expires_at).toISOString() };
}

export async function confirmDependencyBatch(id: string, actor: Actor) {
  uuid.parse(id);
  // Claim once before any network operation. A second click or a resumed HTTP
  // request reads the existing batch and cannot dispatch a second workflow.
  const client = await database().connect();
  let items: BatchItem[];
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended('webbing:manual-test-capacity',0))");
    const batch = (await client.query<{ status: string; items: BatchItem[]; expired: boolean }>("SELECT status,items,(expires_at<now()) AS expired FROM ops_dependency_batches WHERE id=$1 AND requested_by=$2 AND session_id=$3 FOR UPDATE", [id, actor.email, actor.sessionId])).rows[0];
    if (!batch) throw new Error("Cette préparation appartient à une autre session. Prépare un nouveau lot.");
    if (["checking", "running", "completed", "failed"].includes(batch.status)) {
      await client.query("COMMIT");
      return { queued: true, duplicate: true };
    }
    if (batch.status !== "prepared" || batch.expired) throw new Error("Cette préparation a expiré. Prépare un nouveau lot avant de confirmer.");
    const active = await client.query("SELECT id FROM ops_dependency_batches WHERE status IN ('checking','running')");
    if (active.rowCount) throw new Error("Un lot est déjà en cours. Attends son résultat avant d’en lancer un autre.");
    await client.query("UPDATE ops_dependency_batches SET status='checking',confirmed_at=now() WHERE id=$1", [id]);
    items = batch.items;
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }

  try {
    const apis = new Map<string, Awaited<ReturnType<typeof readDependencyApi>>>();
    // Validate every selected revision before reserving or dispatching any.
    for (const item of items) {
      const api = await readDependencyApi(item.repository);
      await resolveDependencyCheck(api, item.repository, item.number, { expectedHead: item.head, expectedBase: item.base });
      apis.set(item.repository, api);
    }

    const transaction = await database().connect();
    try {
      await transaction.query("BEGIN");
      await transaction.query("SELECT pg_advisory_xact_lock(hashtextextended('webbing:manual-test-capacity',0))");
      for (const repository of items.map(item => item.repository).sort()) await transaction.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", ["webbing:dependency-tests:" + repository]);
      const total = (await transaction.query("SELECT count(*)::int AS n FROM ops_dependency_tests WHERE status IN ('requested','running')")).rows[0].n;
      if (total + items.length > MAX_MANUAL_TESTS) throw new Error("Des tests sont déjà en cours. Trois dépôts au maximum peuvent être testés à la fois.");
      for (const item of items) {
        const busy = await transaction.query("SELECT id FROM ops_dependency_tests WHERE repository=$1 AND (status IN ('requested','running') OR requested_at>now()-interval '60 seconds')", [item.repository]);
        if (busy.rowCount) throw new Error("Des tests sont déjà en cours ou viennent d’être demandés pour " + item.repository.split("/")[1] + ". Attends avant de préparer un nouveau lot.");
        await transaction.query("INSERT INTO ops_dependency_tests(id,repository,number,head_sha,base_sha,requested_by,batch_id) VALUES($1,$2,$3,$4,$5,$6,$7)", [item.requestId, item.repository, item.number, item.head, item.base, actor.email, id]);
      }
      // Persist every request before the first POST. A crash leaves requests to
      // reconcile, never a reason to retry a potentially paid POST automatically.
      await transaction.query("UPDATE ops_dependency_batches SET status='running' WHERE id=$1 AND status='checking'", [id]);
      await transaction.query("INSERT INTO ops_audit(kind,detail) VALUES('lot_tests_confirme',$1)", [`${items.length} dépôt(s) · ${items.map(item => item.repository.split("/")[1] + " #" + item.number).join(", ")} · ${actor.email}`]);
      await transaction.query("COMMIT");
    } catch (error) {
      await transaction.query("ROLLBACK"); throw error;
    } finally { transaction.release(); }

    for (const item of items) {
      try { await sendReservedDependencyTests(item.requestId, item.repository, item.number, item.head, item.base, actor.email, apis.get(item.repository)!); }
      catch { /* The individual request stores the refusal; continue only the confirmed batch. */ }
    }
    await settleDependencyBatches();
    return { queued: true, duplicate: false };
  } catch (error) {
    await query("UPDATE ops_dependency_batches SET status='failed',finished_at=now(),error=$2 WHERE id=$1 AND status='checking'", [id, "Le lot n’a pas démarré. Une proposition, un accès ou la capacité disponible a changé. Actualise avant de préparer un nouveau lot."]);
    throw error;
  }
}

export async function dependencyBatchData(requestedBy: string): Promise<BatchResult[]> {
  const batches = (await query<{ id: string; status: string; items: BatchItem[]; requested_at: Date; finished_at: Date | null; error: string | null }>("SELECT id,status,items,requested_at,finished_at,error FROM ops_dependency_batches WHERE requested_by=$1 AND confirmed_at IS NOT NULL ORDER BY requested_at DESC LIMIT 6", [requestedBy])).rows;
  if (!batches.length) return [];
  const tests = (await query<{ id: string; status: string; run_url: string | null; error: string | null; failure_kind: string | null }>("SELECT id,status,run_url,error,failure_kind FROM ops_dependency_tests WHERE batch_id=ANY($1::uuid[])", [batches.map(batch => batch.id)])).rows;
  const byId = new Map(tests.map(test => [test.id, test]));
  return batches.map(batch => ({ id: batch.id, status: batch.status, requestedAt: new Date(batch.requested_at).toISOString(), finishedAt: batch.finished_at ? new Date(batch.finished_at).toISOString() : null, error: batch.error, items: batch.items.map(item => {
    const test = byId.get(item.requestId);
    return { ...item, status: test?.status ?? null, runUrl: test?.run_url ?? null, error: test?.error ?? null, failureKind: test?.failure_kind ?? null };
  }) }));
}

export async function refreshDependencyProgress() {
  const lock = await query("INSERT INTO ops_jobs(name,last_run) VALUES('dependency-progress',now()) ON CONFLICT(name) DO UPDATE SET last_run=now() WHERE ops_jobs.last_run<now()-interval '30 seconds' RETURNING name");
  if (!lock.rowCount) return;
  const active = (await query<{ repository: string }>("SELECT DISTINCT repository FROM ops_dependency_tests WHERE status IN ('requested','running') ORDER BY repository LIMIT 6")).rows;
  for (const { repository } of active) {
    try {
      await reconcileDependencyTests(await readDependencyApi(repository), repository);
      const pending = await query("SELECT id FROM ops_dependency_tests WHERE repository=$1 AND status IN ('requested','running')", [repository]);
      if (!pending.rowCount) await syncGitHub({ repositories: [repository] });
    } catch { /* Keep the previous result and retry only this read on the next refresh. */ }
  }
  await settleDependencyBatches();
}
