import assert from "node:assert/strict";
import { test } from "node:test";
import { applicationBackup, applicationCard, applicationHealth } from "../src/lib/gestion/presentation";
import type { Application } from "../src/lib/gestion/data";

const now = Date.parse("2026-11-27T09:00:00Z");
const recent = new Date(now - 60_000).toISOString();
const backup = { backup_reported_at: recent, backup_state: "ok", backup_at: recent, backup_max_hours: 36 };

test("a past healthy result cannot present an unverified application as responding", () => {
  assert.equal(applicationHealth({ health_state: "disponible", health_at: recent }, now).state, "disponible");
  for (const health_at of [null, "invalid", new Date(now - 46 * 60_000).toISOString()]) {
    assert.equal(applicationHealth({ health_state: "disponible", health_at }, now).state, "unknown");
  }
  assert.equal(applicationHealth({ health_state: "unexpected", health_at: recent }, now).state, "unknown");
});

test("backup freshness requires both a recent NAS report and a successful recent archive", () => {
  assert.equal(applicationBackup(backup, now).state, "disponible");
  assert.equal(applicationBackup({ ...backup, backup_reported_at: new Date(now - 61 * 60_000).toISOString() }, now).label, "Rapport manquant");
  assert.equal(applicationBackup({ ...backup, backup_at: new Date(now - 37 * 3_600_000).toISOString() }, now).label, "Sauvegarde ancienne");
  assert.equal(applicationBackup({ ...backup, backup_at: "invalid" }, now).state, "incident");
  assert.equal(applicationBackup({ ...backup, backup_state: "erreur" }, now).state, "incident");
  assert.equal(applicationBackup({ ...backup, backup_reported_at: null }, now).state, "unknown");
});

test("the application attention filter includes missing required backups but accepts protected access", () => {
  const app = {
    id: "qa", name: "Application QA", slug: "qa", environment: "production", url: "https://qa.example.com", admin_url: null,
    health_state: "protege", health_at: recent, ...backup, backup_required: false, backup_reported_at: null,
    current_deployment_at: null, supabase_ref: null,
  } as Application;
  assert.equal(applicationCard(app, now).needsAttention, false);
  assert.equal(applicationCard(app, now).backup, null);
  assert.equal(applicationCard({ ...app, backup_required: true }, now).needsAttention, true);
  assert.equal(applicationCard({ ...app, backup_required: true, ...backup }, now).needsAttention, false);
  const historic = { ...app, environment: "staging", backup_reported_at: new Date(now - 72 * 3_600_000).toISOString() };
  assert.equal(applicationCard(historic, now).needsAttention, false, "stopped staging backups remain history rather than active backup alerts");
  assert.equal(applicationCard(historic, now).backup?.label, "Historique");
});
