import assert from "node:assert/strict";
import { test } from "node:test";
import { dependencyRunFailure, dependencyTestState } from "../src/lib/gestion/dependency-test-state";

const snapshot = { ready: false, head_sha: "a".repeat(40), base_sha: "b".repeat(40), test_head_sha: "a".repeat(40), test_base_sha: "b".repeat(40), test_status: "success" };

test("successful historical tests stop appearing current after either revision changes", () => {
  assert.equal(dependencyTestState(snapshot), "passed");
  assert.equal(dependencyTestState({ ...snapshot, base_sha: "c".repeat(40) }), "stale");
  assert.equal(dependencyTestState({ ...snapshot, head_sha: "d".repeat(40) }), "stale");
  assert.equal(dependencyTestState({ ...snapshot, head_sha: "d".repeat(40), test_status: "running" }), "pending");
});

test("a run that executed no steps is distinguished from application test failures", () => {
  const blocked = dependencyRunFailure("failure", [{ name: "quality", conclusion: "failure", steps: [] }]);
  assert.equal(blocked.kind, "not_started");
  assert.match(blocked.message, /quota/);
  assert.equal(dependencyRunFailure("failure", [{ name: "quality", conclusion: "failure", steps: [{ name: "Tests", conclusion: "failure" }] }]).kind, "checks_failed");
  assert.equal(dependencyRunFailure("failure").kind, "checks_failed");
  assert.equal(dependencyRunFailure("cancelled").kind, "canceled");
  assert.equal(dependencyTestState({ ...snapshot, test_status: "failed", test_failure_kind: blocked.kind }), "not_started");
});
