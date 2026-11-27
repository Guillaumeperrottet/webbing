import assert from "node:assert/strict";
import { randomUUID, createHmac } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { mock, test } from "node:test";
import { Pool } from "pg";
import config from "../scripts/releases/projects.json";

createRequire(import.meta.url)("@next/env").loadEnvConfig(process.cwd());
test("owner push publication waits for real checks, blocks dependencies and never repeats an uncertain promotion", { skip: process.env.WEBBING_OPS_DB_TEST !== "1" }, async () => {
  const url = new URL(process.env.WEBBING_OPS_DATABASE_URL!); for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) url.searchParams.delete(key);
  const admin = new Pool({ connectionString: url.toString(), ssl: { rejectUnauthorized: true, ca: readFileSync("config/webbing-ops-ca.crt", "utf8") }, max: 1 });
  const schema = "fixture_owner_release_" + randomUUID().replaceAll("-", "");
  const client = await admin.connect();
  await client.query(`CREATE SCHEMA ${schema}`);
  for (const table of ["ops_release_connections", "ops_releases", "ops_integrations", "ops_repositories", "ops_dependency_updates", "ops_audit"]) await client.query(`CREATE TABLE ${schema}.${table} (LIKE public.${table} INCLUDING ALL)`);
  await client.query(`SET search_path TO ${schema}`); await client.query(readFileSync("scripts/gestion/migrations/004-owner-publications.sql", "utf8")); client.release();
  const original = process.env.WEBBING_OPS_DATABASE_URL; url.searchParams.set("options", "-c search_path=" + schema); process.env.WEBBING_OPS_DATABASE_URL = url.toString();
  const { database, query } = await import("../src/lib/gestion/db"), { seal } = await import("../src/lib/gestion/vault");
  const { receiveOwnerEvent, processOwnerPublications } = await import("../src/lib/gestion/owner-releases");
  const { refreshReleaseProgress, dispatchReservedRelease } = await import("../src/lib/gestion/releases");
  const expected = config.projects.find(p => p.name === "webbing")!, repository = `${config.owner}/${expected.repository}`, root = `/repos/${repository}`;
  const owner = { id: 123, login: config.owner, type: "User" }, head = "a".repeat(40), previous = "b".repeat(40), secret = "fixture-hook-only";
  let current = "dpl_previous", auto = false, checks = "in_progress", conclusion = "", bot = false, delayed = true, posts = 0, pushId = "";
  const deployment = (id: string) => ({ id, projectId: expected.id, target: "production", readyState: "READY", readySubstate: id === "dpl_candidate" ? "STAGED" : "PROMOTED", url: "owner-fixture.vercel.app", meta: { githubDeployment: "1", githubCommitSha: id === "dpl_candidate" ? head : previous, githubCommitRef: "main", githubCommitRepo: expected.repository, githubCommitOrg: config.owner } });
  const f = mock.method(globalThis, "fetch", async (input: unknown, options?: RequestInit) => {
    const u = new URL(String(input)), method = options?.method || "GET";
    if (u.hostname === "api.vercel.com") {
      if (method === "POST") { assert.equal(u.pathname, `/v10/projects/${expected.id}/promote/dpl_candidate`); posts++; current = "dpl_candidate"; auto = true; throw Error("Simulated response loss after provider accepted promotion"); }
      if (method === "PATCH") { assert.deepEqual(JSON.parse(String(options?.body)), { autoAssignCustomDomains: false }); auto = false; return Response.json({}); }
      assert.equal(method, "GET");
      if (u.pathname === `/v9/projects/${expected.id}`) return Response.json({ id: expected.id, accountId: config.teamId, name: expected.name, autoAssignCustomDomains: auto, link: { type: "github", org: config.owner, repo: expected.repository, productionBranch: "main" }, targets: { production: { id: current, readyState: "READY" } } });
      if (u.pathname.startsWith("/v13/deployments/")) return Response.json(deployment(u.pathname.split("/").pop()!));
      if (u.pathname === "/v6/deployments") return Response.json({ deployments: [{ uid: "dpl_candidate", state: "READY", meta: { githubCommitSha: head } }] });
      if (u.pathname.endsWith("/domains")) return Response.json({ domains: [{ name: "www.webbing.ch" }] });
      if (u.pathname.startsWith("/v4/aliases/")) return Response.json({ deploymentId: delayed ? "dpl_previous" : current });
    }
    if (u.hostname === "api.github.com") {
      assert.equal(method, "GET");
      const run = { id: 777, event: "push", head_sha: head, head_branch: "main", status: checks, conclusion, actor: owner, triggering_actor: owner, created_at: new Date().toISOString() };
      if (u.pathname === root) return Response.json({ full_name: repository, default_branch: "main" });
      if (u.pathname.endsWith("/git/ref/heads/main")) return Response.json({ object: { sha: head } });
      if (u.pathname.includes("/compare/")) return Response.json({ status: "ahead", behind_by: 0, base_commit: { sha: previous }, merge_base_commit: { sha: previous }, total_commits: 1, commits: [{ sha: head, author: owner }] });
      if (u.pathname.endsWith("/pulls")) return Response.json(bot ? [{ number: 10, merged_at: new Date().toISOString(), merge_commit_sha: head, base: { ref: "main", repo: { full_name: repository } }, user: { ...owner, login: "dependabot[bot]", type: "Bot" }, head: { ref: "dependabot/batch" }, labels: [{ name: "dependencies" }] }] : []);
      if (u.pathname.endsWith("/runs")) return Response.json({ workflow_runs: [run] });
      if (u.pathname.endsWith("/runs/777")) return Response.json(run);
      if (u.pathname.endsWith("/jobs")) return Response.json({ total_count: 1, jobs: [{ name: "Webbing / Quality", status: checks, conclusion, steps: [{ name: "Locked dependencies, tests, build and startup", status: checks, conclusion }] }] });
    }
    throw Error("Unexpected provider call: " + method + " " + u.pathname);
  });
  const send = async (sender = owner, after = head) => {
    const body = Buffer.from(JSON.stringify({ repository: { id: 456, full_name: repository }, sender, ref: "refs/heads/main", before: previous, after, forced: false, deleted: false, created: false }));
    return receiveOwnerEvent(body, "sha256=" + createHmac("sha256", secret).update(body).digest("hex"), randomUUID(), "push");
  };
  try {
    const id = randomUUID(), gh = randomUUID();
    await query("INSERT INTO ops_release_connections(project_id,id,name,secret_cipher,token_id,expires_at) VALUES($1,$2,$3,$4,'fixture',now()+interval '1 day')", [expected.id, id, expected.name, seal("fixture-vercel", `${id}:vercel-release:${expected.id}`)]);
    await query("INSERT INTO ops_integrations(id,provider,name,secret_cipher) VALUES($1,'github','fixture',$2)", [gh, seal("fixture-github", `${gh}:github`)]);
    await query("INSERT INTO ops_repositories(full_name,default_branch,integration_id) VALUES($1,'main',$2)", [repository, gh]);
    await query("INSERT INTO ops_owner_release_rules(repository,repository_id,owner_id,owner_login,branch,secret_cipher,enabled,enabled_at) VALUES($1,456,123,$2,'main',$3,true,now()-interval '1 minute')", [repository, owner.login, seal(secret, `owner-release:${repository}`)]);
    assert.equal((await send({ ...owner, id: 999 })).accepted, false); assert.equal((await query("SELECT * FROM ops_owner_pushes")).rowCount, 0);
    assert.equal((await send()).process, true); assert.equal((await send()).process, false); assert.equal((await query("SELECT * FROM ops_owner_pushes")).rowCount, 1);
    await processOwnerPublications(repository); assert.equal(posts, 0); assert.equal((await query("SELECT * FROM ops_releases")).rowCount, 0, "pending checks cannot reserve a promotion");
    checks = "completed"; conclusion = "success"; bot = true;
    await processOwnerPublications(repository); assert.equal(posts, 0); assert.match((await query("SELECT last_error FROM ops_owner_pushes")).rows[0].last_error, /dépendances/);
    bot = false;
    const manual = randomUUID();
    await query("INSERT INTO ops_releases(id,project_id,requested_by,session_id,proof,status,confirmed_at) VALUES($1,$2,'fixture@webbing.invalid','fixture','{}','checking',now())", [manual, expected.id]);
    await processOwnerPublications(repository); assert.equal(posts, 0, "a manual publication holds the same project lock");
    await query("DELETE FROM ops_releases WHERE id=$1", [manual]);
    await Promise.all([processOwnerPublications(repository), processOwnerPublications(repository)]); assert.equal(posts, 1); assert.equal(auto, false);
    const release = (await query("SELECT * FROM ops_releases")).rows[0]; pushId = release.proof.pushId;
    assert.equal(release.status, "publishing"); assert.equal(release.proof.source, "owner-push"); assert.equal((await query("SELECT * FROM ops_owner_release_attempts")).rowCount, 1);
    await processOwnerPublications(repository); assert.equal(posts, 1, "uncertain promotions never repeat");
    delayed = false; await refreshReleaseProgress(process.env.WEBBING_OPS_ADMIN_EMAIL!.trim().toLowerCase());
    assert.equal((await query("SELECT status FROM ops_releases")).rows[0].status, "succeeded"); assert.equal(posts, 1);
    await assert.rejects(() => dispatchReservedRelease(randomUUID(), release.proof, async () => release.proof), /réservée/);
    assert.ok(pushId);
  } finally {
    f.mock.restore(); await database().end(); process.env.WEBBING_OPS_DATABASE_URL = original;
    await admin.query(`DROP SCHEMA ${schema} CASCADE`); await admin.end();
  }
});
