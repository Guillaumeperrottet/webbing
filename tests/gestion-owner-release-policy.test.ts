import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { validateOwnerChanges, validateOwnerPush, validateOwnerRun, validGitHubSignature, type OwnerRule } from "../src/lib/gestion/owner-release-policy";

const owner = { id: 123, login: "Guillaumeperrottet", type: "User" };
const rule: OwnerRule = { repository: "Guillaumeperrottet/webbing", repository_id: "456", owner_id: "123", owner_login: owner.login, branch: "main", enabled_at: "2026-11-27T08:00:00Z", enabled: true };
const push = { repository: { full_name: rule.repository, id: 456 }, sender: owner, ref: "refs/heads/main", before: "b".repeat(40), after: "a".repeat(40), forced: false, deleted: false, created: false };

test("the hook authenticates the exact raw bytes with a repository-specific secret", () => {
  const body = Buffer.from(JSON.stringify(push)), key = "fixture-repository-hook-secret";
  const signature = "sha256=" + createHmac("sha256", key).update(body).digest("hex");
  assert.equal(validGitHubSignature(body, signature, key), true);
  assert.equal(validGitHubSignature(Buffer.concat([body, Buffer.from(" ")]), signature, key), false);
  assert.equal(validGitHubSignature(body, signature, "another-repository"), false);
  for (const invalid of [null, "", "sha256=abc", "sha1=" + "a".repeat(40)]) assert.equal(validGitHubSignature(body, invalid, key), false);
});

test("only an authenticated owner push to production qualifies; author names grant nothing", () => {
  assert.doesNotThrow(() => validateOwnerPush(push, rule));
  for (const event of [
    { ...push, sender: { ...owner, id: 999 } }, { ...push, sender: { ...owner, type: "Bot" } },
    { ...push, ref: "refs/heads/staging" }, { ...push, forced: true }, { ...push, deleted: true },
    { ...push, created: true }, { ...push, repository: { ...push.repository, id: 999 } },
    { ...push, before: "0".repeat(40) },
  ]) assert.throws(() => validateOwnerPush(event, rule));
  assert.throws(() => validateOwnerPush(push, { ...rule, enabled: false }));
});

test("old builds, manual dispatches and reruns by another account cannot auto-publish", () => {
  const run = { event: "push", head_sha: push.after, head_branch: "main", actor: owner, triggering_actor: owner, created_at: "2026-11-27T08:01:00Z" };
  assert.doesNotThrow(() => validateOwnerRun(run, rule, push.after));
  for (const invalid of [{ ...run, created_at: "2026-11-27T07:59:59Z" }, { ...run, event: "workflow_dispatch" }, { ...run, head_branch: "staging" }, { ...run, triggering_actor: { ...owner, id: 999 } }, { ...run, head_sha: push.before }]) assert.throws(() => validateOwnerRun(invalid, rule, push.after));
});

test("a human merge of Dependabot remains manual, including bot commits earlier in the range", () => {
  const commits = [{ sha: push.after, author: owner }], pull = { user: owner, head: { ref: "feature" }, labels: [] as { name: string }[] };
  assert.doesNotThrow(() => validateOwnerChanges(commits, 1, [[]], false, owner.login));
  assert.doesNotThrow(() => validateOwnerChanges(commits, 1, [[pull]], false, owner.login));
  for (const invalid of [{ ...pull, user: { ...owner, type: "Bot" } }, { ...pull, head: { ref: "dependabot/npm_and_yarn/batch" } }, { ...pull, labels: [{ name: "dependencies" }] }]) assert.throws(() => validateOwnerChanges(commits, 1, [[invalid]], false, owner.login));
  assert.throws(() => validateOwnerChanges(commits, 1, [[]], true, owner.login));
  assert.throws(() => validateOwnerChanges([{ sha: push.before, author: { ...owner, type: "Bot" } }, ...commits], 2, [[], []], false, owner.login));
  assert.throws(() => validateOwnerChanges(commits, 2, [[]], false, owner.login));
  assert.throws(() => validateOwnerChanges(commits, 51, [[]], false, owner.login));
});
