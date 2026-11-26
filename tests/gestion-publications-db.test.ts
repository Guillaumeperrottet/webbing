import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { mock, test } from "node:test";
import { Pool } from "pg";
import config from "../scripts/releases/projects.json";

createRequire(import.meta.url)("@next/env").loadEnvConfig(process.cwd());

test("publication requires an exact Git build, successful tests and a fresh one-use confirmation; uncertain promotions never repeat", { skip: process.env.WEBBING_OPS_DB_TEST !== "1" }, async () => {
  const url = new URL(process.env.WEBBING_OPS_DATABASE_URL!);
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) url.searchParams.delete(key);
  const admin = new Pool({ connectionString: url.toString(), ssl: { rejectUnauthorized: true, ca: readFileSync("config/webbing-ops-ca.crt", "utf8") }, max: 1 });
  const schema = "fixture_releases_" + randomUUID().replaceAll("-", "");
  await admin.query(`CREATE SCHEMA ${schema}`);
  for (const table of ["ops_release_connections", "ops_releases", "ops_release_mfa_attempts", "ops_release_mfa_codes", "ops_integrations", "ops_repositories", "ops_audit"]) await admin.query(`CREATE TABLE ${schema}.${table} (LIKE public.${table} INCLUDING ALL)`);
  const originalUrl = process.env.WEBBING_OPS_DATABASE_URL;
  url.searchParams.set("options", "-c search_path=" + schema); process.env.WEBBING_OPS_DATABASE_URL = url.toString();
  const { query, database } = await import("../src/lib/gestion/db");
  const { seal } = await import("../src/lib/gestion/vault");
  const { prepareRelease, confirmRelease, refreshReleaseProgress, recoverPublicationProtection } = await import("../src/lib/gestion/releases");
  const expected = config.projects.find(project => project.name === "webbing")!;
  const repository = `${config.owner}/${expected.repository}`, root = `/repos/${repository}`;
  const head = "a".repeat(40), previous = "b".repeat(40);
  const actor = { email: "publication-qa@webbing.invalid", sessionId: randomUUID() };
  let current = "dpl_previous", auto = false, sha = head, target = "production", ancestry = "ahead", runStatus = "success", steps = true, merged = true;
  let posts = 0, safetyWrites = 0, uncertain = false, rejectPromotion = false, failProtection = false, aliasDelayed = false;
  const deployment = (id: string) => ({ id, projectId: expected.id, target, readyState: "READY", readySubstate: id === "dpl_candidate" ? "STAGED" : "PROMOTED", url: "publication-fixture.vercel.app", meta: { githubDeployment: "1", githubCommitSha: id === "dpl_candidate" ? sha : previous, githubCommitRef: "main", githubCommitRepo: expected.repository, githubCommitOrg: config.owner } });
  const originalFetch = mock.method(globalThis, "fetch", async (input: unknown, options?: RequestInit) => {
    const url = new URL(String(input));
    assert.ok(["https://api.vercel.com", "https://api.github.com"].includes(url.origin));
    if (url.origin === "https://api.vercel.com") {
      assert.equal(url.searchParams.get("teamId"), config.teamId);
      assert.match(new Headers(options?.headers).get("authorization") || "", /fixture-only/);
      if (url.pathname.includes("/promote/")) {
        assert.equal(options?.method, "POST"); posts++;
        if (rejectPromotion) return Response.json({}, { status: 403 });
        current = "dpl_candidate"; auto = true;
        if (uncertain) throw new TypeError("response lost after promotion");
        return Response.json({});
      }
      if (options?.method === "PATCH") {
        assert.equal(url.pathname, "/v9/projects/" + expected.id);
        assert.deepEqual(JSON.parse(String(options.body)), { autoAssignCustomDomains: false });
        safetyWrites++;
        if (failProtection) return Response.json({}, { status: 503 });
        auto = false; return Response.json({});
      }
      assert.equal(options?.method, "GET");
      if (url.pathname === "/v9/projects/" + expected.id) return Response.json({ id: expected.id, accountId: config.teamId, name: expected.name, autoAssignCustomDomains: auto, link: { type: "github", org: config.owner, repo: expected.repository, productionBranch: "main" }, targets: { production: { id: current, readyState: "READY" } } });
      if (url.pathname.startsWith("/v13/deployments/")) return Response.json(deployment(url.pathname.split("/").at(-1)!));
      if (url.pathname === "/v6/deployments") return Response.json({ deployments: [{ uid: "dpl_candidate", state: "READY", meta: { githubCommitSha: head } }] });
      if (url.pathname.endsWith("/domains")) return Response.json({ domains: [{ name: "fixture.webbing.invalid" }, { name: "preview.webbing.invalid", gitBranch: "develop" }] });
      if (url.pathname.startsWith("/v4/aliases/")) return Response.json({ deploymentId: aliasDelayed ? "dpl_previous" : current });
    } else {
      assert.equal(options?.method, "GET", "publication never starts Actions or modifies GitHub");
      assert.ok(url.pathname === root || url.pathname.startsWith(root + "/"));
      if (url.pathname === root) return Response.json({ full_name: repository, default_branch: "main" });
      if (url.pathname.includes("/git/ref/heads/")) return Response.json({ object: { sha: head } });
      if (url.pathname.includes("/compare/")) return Response.json({ status: ancestry, behind_by: ancestry === "ahead" ? 0 : 2, base_commit: { sha: previous }, merge_base_commit: { sha: previous } });
      if (url.pathname.endsWith("/pulls")) return Response.json(merged ? [{ number: 123, merged_at: "2026-11-26", merge_commit_sha: head, base: { ref: "main", repo: { full_name: repository } } }] : []);
      if (url.pathname.endsWith("/runs")) return Response.json({ workflow_runs: [{ id: 777, event: "push", head_sha: head, status: "completed", conclusion: runStatus }] });
      if (url.pathname.endsWith("/jobs")) return Response.json({ total_count: 1, jobs: [{ name: "Webbing / Quality", status: "completed", conclusion: "success", steps: steps ? [{ name: "Locked dependencies, tests, build and startup", status: "completed", conclusion: "success" }] : [] }] });
    }
    throw new Error("Unexpected fixture path " + url.pathname);
  });
  const reset = async () => {
    await query("TRUNCATE ops_releases,ops_release_mfa_attempts,ops_release_mfa_codes");
    current = "dpl_previous"; auto = false; sha = head; target = "production"; ancestry = "ahead"; runStatus = "success"; steps = merged = true; uncertain = rejectPromotion = failProtection = aliasDelayed = false;
  };
  try {
    const id = randomUUID(), github = randomUUID();
    await query("INSERT INTO ops_release_connections(project_id,id,name,secret_cipher,token_id,expires_at) VALUES($1,$2,'Fixture',$3,'fixture',now()+interval '1 day')", [expected.id, id, seal("fixture-only-vercel-access", `${id}:vercel-release:${expected.id}`)]);
    await query("INSERT INTO ops_integrations(id,provider,name,secret_cipher) VALUES($1,'github','Fixture',$2)", [github, seal("fixture-only-github-access", `${github}:github`)]);
    await query("INSERT INTO ops_repositories(full_name,default_branch,integration_id) VALUES($1,'main',$2)", [repository, github]);
    await assert.rejects(() => prepareRelease(config.projects.find(p => p.name === "pattushotel")!.id, actor));
    await assert.rejects(() => prepareRelease("prj_untrusted", actor));
    for (const problem of ["preview", "history", "sha", "run", "not-started", "pull"]) {
      await reset();
      if (problem === "preview") target = "preview";
      if (problem === "history") ancestry = "diverged";
      if (problem === "sha") sha = "c".repeat(40);
      if (problem === "run") runStatus = "failure";
      if (problem === "not-started") steps = false;
      if (problem === "pull") merged = false;
      await assert.rejects(() => prepareRelease(expected.id, actor), /./, problem);
      assert.equal(posts, 0);
    }
    await reset();
    const ready = await prepareRelease(expected.id, actor);
    assert.equal(posts, 0); assert.equal(safetyWrites, 0, "preparation is entirely read-only");
    await assert.rejects(() => confirmRelease(ready.id, { ...actor, sessionId: randomUUID() }, "123456", async () => true), /autre session/);
    await assert.rejects(() => confirmRelease(ready.id, actor, "123456", async () => false), /incorrect/);
    const outcomes = await Promise.allSettled([confirmRelease(ready.id, actor, "123456", async () => true), confirmRelease(ready.id, actor, "123456", async () => true)]);
    assert.equal(outcomes.filter(r => r.status === "fulfilled").length, 1, JSON.stringify(outcomes.map(r => r.status === "rejected" ? r.reason.message : "ok")));
    assert.equal(posts, 1); assert.equal(auto, false); assert.equal((await query("SELECT status FROM ops_releases WHERE id=$1", [ready.id])).rows[0].status, "succeeded");
    await assert.rejects(() => confirmRelease(ready.id, actor, "654321", async () => true)); assert.equal(posts, 1);
    current = "dpl_previous";
    const replay = await prepareRelease(expected.id, actor);
    await assert.rejects(() => confirmRelease(replay.id, actor, "123456", async () => true), /déjà confirmé/);
    assert.equal(posts, 1, "a code cannot confirm another release during its validity window");

    await reset(); const expired = await prepareRelease(expected.id, actor);
    await query("UPDATE ops_releases SET expires_at=now()-interval '1 second' WHERE id=$1", [expired.id]);
    await assert.rejects(() => confirmRelease(expired.id, actor, "123456", async () => true), /expiré/); assert.equal(posts, 1);
    await reset(); const limited = await prepareRelease(expected.id, actor);
    for (let n = 0; n < 5; n++) await assert.rejects(() => confirmRelease(limited.id, actor, "123456", async () => false), /incorrect/);
    let verified = false;
    await assert.rejects(() => confirmRelease(limited.id, actor, "123456", async () => { verified = true; return true; }), /Trop de tentatives/);
    assert.equal(verified, false); assert.equal(posts, 1);

    await reset(); const changed = await prepareRelease(expected.id, actor); sha = "c".repeat(40);
    await confirmRelease(changed.id, actor, "123456", async () => true);
    assert.equal((await query("SELECT status FROM ops_releases WHERE id=$1", [changed.id])).rows[0].status, "failed"); assert.equal(posts, 1);

    await reset(); const lost = await prepareRelease(expected.id, actor); uncertain = true; aliasDelayed = true;
    await confirmRelease(lost.id, actor, "123456", async () => true);
    assert.equal(posts, 2); assert.equal(auto, false);
    await assert.rejects(() => confirmRelease(lost.id, actor, "654321", async () => true));
    await refreshReleaseProgress(actor.email); assert.equal(posts, 2);
    aliasDelayed = false; await refreshReleaseProgress(actor.email);
    assert.equal((await query("SELECT status FROM ops_releases WHERE id=$1", [lost.id])).rows[0].status, "succeeded");

    await reset(); const unprotected = await prepareRelease(expected.id, actor); failProtection = true;
    await confirmRelease(unprotected.id, actor, "123456", async () => true);
    assert.equal(auto, true); assert.equal((await query("SELECT status FROM ops_releases WHERE id=$1", [unprotected.id])).rows[0].status, "safety_error");
    await assert.rejects(() => prepareRelease(expected.id, actor), /publication attend/);
    await assert.rejects(() => recoverPublicationProtection(), /Protection de publication/);
    failProtection = false; await recoverPublicationProtection();
    assert.equal(auto, false); assert.equal(posts, 3); assert.equal((await query("SELECT status FROM ops_releases WHERE id=$1", [unprotected.id])).rows[0].status, "succeeded");
  } finally {
    originalFetch.mock.restore(); await database().end(); process.env.WEBBING_OPS_DATABASE_URL = originalUrl;
    await admin.query(`DROP SCHEMA ${schema} CASCADE`); await admin.end();
  }
});
