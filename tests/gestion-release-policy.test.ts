import assert from "node:assert/strict";
import { test } from "node:test";
import { validateDeployment, validateHistory, validateProject, validateQuality } from "../src/lib/gestion/release-policy";

const expected = { id: "prj_fixture", name: "fixture", repository: "fixture" };
const head = "a".repeat(40);
test("only the fixed team, project, GitHub source and production artifact are publishable", () => {
  const project = { id: expected.id, name: expected.name, accountId: "team_fixture", autoAssignCustomDomains: false, link: { type: "github", org: "fixture-owner", repo: expected.repository }, targets: { production: { id: "dpl_fixture", readyState: "READY" } } };
  validateProject(project, expected, "fixture-owner", "team_fixture");
  for (const patch of [{ accountId: "team_other" }, { autoAssignCustomDomains: true }, { link: { type: "github", org: "other", repo: expected.repository } }, { id: "prj_staging" }]) assert.throws(() => validateProject({ ...project, ...patch }, expected, "fixture-owner", "team_fixture"));
  const deployment = { id: "dpl_fixture", projectId: expected.id, target: "production", readyState: "READY", url: "fixture.vercel.app", meta: { githubDeployment: "1", githubCommitSha: head, githubCommitRepo: expected.repository, githubCommitOrg: "fixture-owner" } };
  assert.equal(validateDeployment(deployment, expected, "fixture-owner"), head);
  for (const patch of [{ target: "preview" }, { readyState: "BUILDING" }, { projectId: "prj_staging" }, { meta: { ...deployment.meta, githubDeployment: "0" } }, { url: "fixture.vercel.app.evil.invalid" }]) assert.throws(() => validateDeployment({ ...deployment, ...patch }, expected, "fixture-owner"));
});
test("skipped jobs, budget failures, stale runs and divergent Git history never count as release evidence", () => {
  const run = { id: 123, head_sha: head, event: "push", status: "completed", conclusion: "success", html_url: "https://github.com/fixture/actions/runs/123" };
  const job = { name: "Webbing / Quality", status: "completed", conclusion: "success", steps: [{ name: "Locked dependencies, tests, build and startup", status: "completed", conclusion: "success" }] };
  assert.equal(validateQuality([run], [job], head).id, 123);
  assert.throws(() => validateQuality([{ ...run, head_sha: "b".repeat(40) }], [job], head));
  assert.throws(() => validateQuality([{ ...run, conclusion: "failure" }, run], [job], head), /doivent avoir réussi/);
  assert.throws(() => validateQuality([run], [{ ...job, steps: [] }], head), /réellement/);
  assert.throws(() => validateQuality([run], [{ ...job, conclusion: "skipped" }], head));
  assert.throws(() => validateQuality([run], [{ ...job, name: "Webbing / Await manual dependency tests" }], head));
  validateHistory({ status: "ahead", behind_by: 0, base_commit: { sha: head }, merge_base_commit: { sha: head } }, head);
  assert.throws(() => validateHistory({ status: "diverged", behind_by: 1, base_commit: { sha: head }, merge_base_commit: { sha: head } }, head));
});
