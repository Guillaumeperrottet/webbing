import assert from 'node:assert/strict';
import { test } from 'node:test';
import { inspectProduction, verifyHistory } from '../scripts/releases/check-production.mjs';

const sha = 'a'.repeat(40);
const expected = { id: 'prj_production', name: 'hotel', repository: 'hotel' };
function project() {
  return { ...expected, autoAssignCustomDomains: false, link: { type: 'github', org: 'owner', repo: 'hotel', productionBranch: 'main' }, targets: { production: { id: 'dpl_live', readyState: 'READY', meta: { githubDeployment: '1', githubCommitSha: sha, githubCommitRepo: 'hotel', githubCommitOrg: 'owner' } } } };
}

test('a CLI upload carrying a plausible Git SHA is not accepted as a GitHub deployment', () => {
  const p = project();
  delete p.targets.production.meta.githubDeployment;
  assert.ok(inspectProduction(expected, p, 'owner').errors.some(error => error.includes('provenance')));
});

test('unknown settings and staging identities cannot silently pass the production audit', () => {
  for (const value of [true, undefined, null]) {
    const p = project(); p.autoAssignCustomDomains = value;
    assert.ok(inspectProduction(expected, p, 'owner').errors.length > 0);
  }
  const p = project(); p.id = 'prj_staging';
  assert.ok(inspectProduction(expected, p, 'owner').errors.length > 0);
});

test('an unrelated GitHub history cannot erase previously published features', () => {
  const result = inspectProduction(expected, project(), 'owner');
  const repo = { full_name: 'owner/hotel', default_branch: 'main' };
  const branch = { commit: { sha: 'b'.repeat(40) } };
  const proof = { status: 'ahead', behind_by: 0, base_commit: { sha }, merge_base_commit: { sha } };
  assert.equal(verifyHistory(result, repo, branch, proof).safe, true);
  assert.equal(verifyHistory(result, repo, branch, { ...proof, status: 'diverged', behind_by: 2 }).safe, false);
  assert.equal(verifyHistory(result, repo, branch, { ...proof, merge_base_commit: { sha: 'c'.repeat(40) } }).safe, false);
  assert.equal(verifyHistory(result, { ...repo, default_branch: 'other' }, branch, proof).safe, false);
});
