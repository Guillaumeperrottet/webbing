import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { mock, test } from "node:test";
import { Pool } from "pg";

createRequire(import.meta.url)("@next/env").loadEnvConfig(process.cwd());

test("confirmed batches are bounded, session-bound and never redispatched after an uncertain response", { skip: process.env.WEBBING_OPS_DB_TEST !== "1" }, async () => {
  // The fixture has its own schema and no application data. Provider requests
  // are mocked and restricted to fixture repositories, including every POST.
  const url = new URL(process.env.WEBBING_OPS_DATABASE_URL!);
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) url.searchParams.delete(key);
  const admin = new Pool({ connectionString: url.toString(), ssl: { rejectUnauthorized: true, ca: readFileSync("config/webbing-ops-ca.crt", "utf8") }, max: 1 });
  const schema = "fixture_batches_" + randomUUID().replaceAll("-", "");
  await admin.query(`CREATE SCHEMA ${schema}`);
  for (const table of ["ops_integrations", "ops_repositories", "ops_dependency_updates", "ops_dependency_batches", "ops_dependency_tests", "ops_audit", "ops_jobs"]) await admin.query(`CREATE TABLE ${schema}.${table} (LIKE public.${table} INCLUDING ALL)`);
  const originalUrl = process.env.WEBBING_OPS_DATABASE_URL;
  url.searchParams.set("options", "-c search_path=" + schema);
  process.env.WEBBING_OPS_DATABASE_URL = url.toString();
  const { query, database } = await import("../src/lib/gestion/db");
  const { seal } = await import("../src/lib/gestion/vault");
  const { prepareDependencyBatch, confirmDependencyBatch, dependencyBatchData } = await import("../src/lib/gestion/dependency-batches");
  const { requestDependencyTests, reconcileDependencyTests, settleDependencyBatches } = await import("../src/lib/gestion/github");
  const actor = { email: "qa-batches@webbing.invalid", sessionId: randomUUID() };
  const repositories = ["fixture-owner/lot-a", "fixture-owner/lot-b", "fixture-owner/lot-c"];
  const head = "a".repeat(40), base = "b".repeat(40);
  const selections = repositories.map(repository => ({ repository, number: 7, head, base }));
  const heads = new Map(repositories.map(repository => [repository, head]));
  const requests = new Map<string, string>();
  const outcomes = new Map<string, "blocked" | "success" | "failure">();
  let writes = 0, uncertain = false;
  const pr = (repository: string) => ({ state: "open", draft: false, user: { login: "dependabot[bot]", type: "Bot" }, changed_files: 1, head: { sha: heads.get(repository), ref: "dependabot/npm/next", repo: { full_name: repository } }, base: { ref: "main", repo: { full_name: repository } } });
  const fetch = mock.method(globalThis, "fetch", async (input: unknown, options?: RequestInit) => {
    const target = new URL(String(input));
    assert.equal(target.origin, "https://api.github.com");
    const repository = repositories.find(repository => target.pathname === "/repos/" + repository || target.pathname.startsWith("/repos/" + repository + "/"));
    assert.ok(repository, "only isolated fixture repositories may be requested");
    const root = "/repos/" + repository;
    if (options?.method === "POST") {
      assert.equal(target.pathname, root + "/actions/workflows/webbing-dependency-checks.yml/dispatches");
      const body = JSON.parse(String(options.body));
      assert.equal(body.inputs.approve_manual, undefined); assert.equal(body.inputs.expected_head, head); assert.equal(body.inputs.expected_base, base);
      requests.set(repository, body.inputs.request_id); writes++;
      if (uncertain) { uncertain = false; throw new TypeError("Simulated response lost after accepting the dispatch"); }
      return new Response(null, { status: 204 });
    }
    assert.equal(options?.method, "GET");
    if (target.pathname === root) return Response.json({ full_name: repository, default_branch: "main", private: false });
    if (target.pathname.endsWith("/pulls/7")) return Response.json(pr(repository));
    if (target.pathname.endsWith("/git/ref/heads/main")) return Response.json({ object: { sha: base } });
    if (target.pathname.endsWith("/files")) return Response.json([{ filename: "package.json" }]);
    if (target.pathname.includes("/actions/workflows/") && target.pathname.endsWith("/runs")) return Response.json({ workflow_runs: outcomes.has(repository) ? [{ id: 123, display_title: `Webbing tests ${requests.get(repository)} · #7`, status: "completed", conclusion: outcomes.get(repository) === "success" ? "success" : "failure", html_url: `https://github.com/${repository}/actions/runs/123` }] : [] });
    if (target.pathname.endsWith("/jobs")) return Response.json({ jobs: [{ name: "Webbing / Manual application tests", conclusion: "failure", steps: outcomes.get(repository) === "blocked" ? [] : [{ name: "Tests", conclusion: "failure" }] }] });
    if (target.pathname.endsWith("/statuses")) return Response.json([{ context: "Webbing / Base testée", state: "success", description: "base:" + base, creator: { login: "github-actions[bot]" }, target_url: `https://github.com/${repository}/actions/runs/123` }]);
    throw new Error("Unexpected fixture path " + target.pathname);
  });
  try {
    for (const repository of repositories) {
      const id = randomUUID();
      await query("INSERT INTO ops_integrations(id,provider,name,secret_cipher,config) VALUES($1,'github',$2,$3,'{}')", [id, repository, seal("github_pat_fixture_only", `${id}:github`)]);
      await query("INSERT INTO ops_repositories(full_name,default_branch,integration_id) VALUES($1,'main',$2)", [repository, id]);
      await query("INSERT INTO ops_dependency_updates(repository,number,title,url,head_sha,base_sha,reason,updated_at) VALUES($1,7,'Fixture','https://github.com/fixture', $2,$3,'Fixture',now())", [repository, head, base]);
    }
    await assert.rejects(() => prepareDependencyBatch([...selections, selections[0]], actor), /un à trois/);
    await assert.rejects(() => prepareDependencyBatch([selections[0], selections[0]], actor), /un à trois/);
    const prepared = await prepareDependencyBatch(selections, actor);
    assert.equal(writes, 0, "preparation never starts a workflow");
    await assert.rejects(() => confirmDependencyBatch(prepared.id, { ...actor, sessionId: randomUUID() }), /autre session/);
    await Promise.all([confirmDependencyBatch(prepared.id, actor), confirmDependencyBatch(prepared.id, actor)]);
    assert.equal(writes, 3, "concurrent confirmations dispatch each item once");
    await assert.rejects(() => requestDependencyTests(repositories[0], 8, head, base, actor.email), /déjà en cours/);
    const second = await prepareDependencyBatch([selections[0]], actor);
    await assert.rejects(() => confirmDependencyBatch(second.id, actor), /lot est déjà en cours/);
    outcomes.set(repositories[0], "blocked"); outcomes.set(repositories[1], "success"); outcomes.set(repositories[2], "failure");
    const { readDependencyApi } = await import("../src/lib/gestion/github");
    for (const repository of repositories) await reconcileDependencyTests(await readDependencyApi(repository), repository);
    await settleDependencyBatches();
    const history = await dependencyBatchData(actor.email);
    assert.equal(history[0].status, "failed");
    assert.deepEqual(history[0].items.map(item => [item.status, item.failureKind]), [["failed", "not_started"], ["success", null], ["failed", "checks_failed"]]);
    assert.equal(writes, 3);

    const stale = await prepareDependencyBatch([selections[0], selections[2]], actor);
    heads.set(repositories[2], "c".repeat(40));
    await assert.rejects(() => confirmDependencyBatch(stale.id, actor), /changé/);
    assert.equal(writes, 3, "one stale item prevents every dispatch in the batch");
    heads.set(repositories[2], head);
    const expired = await prepareDependencyBatch([selections[0]], actor);
    await query("UPDATE ops_dependency_batches SET expires_at=now()-interval '1 second' WHERE id=$1", [expired.id]);
    await assert.rejects(() => confirmDependencyBatch(expired.id, actor), /expiré/);

    await query("UPDATE ops_dependency_tests SET requested_at=now()-interval '2 minutes'");
    const ambiguous = await prepareDependencyBatch([selections[0]], actor);
    uncertain = true;
    await confirmDependencyBatch(ambiguous.id, actor);
    await confirmDependencyBatch(ambiguous.id, actor);
    await requestDependencyTests(repositories[0], 7, head, base, actor.email);
    assert.equal(writes, 4, "a lost response cannot cause a repeated paid request");
    const pending = (await query("SELECT status,failure_kind FROM ops_dependency_tests WHERE batch_id=$1", [ambiguous.id])).rows[0];
    assert.equal(pending.status, "requested"); assert.equal(pending.failure_kind, "dispatch_unknown");
    assert.equal((await query("SELECT count(*)::int AS n FROM ops_dependency_tests")).rows[0].n, 4);
  } finally {
    fetch.mock.restore();
    await database().end();
    process.env.WEBBING_OPS_DATABASE_URL = originalUrl;
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
});
