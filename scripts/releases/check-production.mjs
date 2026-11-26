import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execute = promisify(execFile);
const shaPattern = /^[0-9a-f]{40}$/;

// Project IDs, owner and repository are pinned; a similarly named staging
// project must never be treated as a production release target.
export function inspectProduction(expected, project, owner) {
  const deployment = project.targets?.production;
  const meta = deployment?.meta;
  const errors = [];
  if (project.id !== expected.id || project.name !== expected.name) errors.push('Identité du projet incorrecte.');
  if (project.link?.type !== 'github' || project.link?.org !== owner || project.link?.repo !== expected.repository) errors.push('Dépôt GitHub incorrect.');
  if (project.autoAssignCustomDomains !== false) errors.push('La promotion automatique est active ou non vérifiable.');
  if (!deployment?.id || deployment.readyState !== 'READY') errors.push('Version en service non vérifiable.');
  if (meta?.githubDeployment !== '1' || !shaPattern.test(meta?.githubCommitSha ?? '')) errors.push('Version en service sans provenance GitHub vérifiable.');
  if (meta?.githubCommitRepo !== expected.repository || meta?.githubCommitOrg !== owner) errors.push('La version en service provient d’un autre dépôt.');
  return { project: expected.name, repository: `${owner}/${expected.repository}`, branch: project.link?.productionBranch, deployment: deployment?.id, sha: meta?.githubCommitSha, errors };
}

export function verifyHistory(result, repository, branch, comparison) {
  const errors = [...result.errors];
  if (repository.full_name !== result.repository || repository.default_branch !== result.branch) errors.push('Branche de production différente de la branche principale GitHub.');
  if (!shaPattern.test(branch.commit?.sha ?? '')) errors.push('Révision GitHub invalide.');
  if (!['ahead', 'identical'].includes(comparison.status) || comparison.behind_by !== 0 || comparison.base_commit?.sha !== result.sha || comparison.merge_base_commit?.sha !== result.sha) errors.push('La branche GitHub ne contient pas la version en service.');
  return { ...result, githubHead: branch.commit?.sha, errors, safe: errors.length === 0 };
}

async function jsonCommand(command, args) {
  // Credentials remain in the existing CLI sessions; never inspect token files
  // or print full API responses (project responses can contain environment data).
  const { stdout } = await execute(command, args, { timeout: 45_000, maxBuffer: 12_000_000 });
  return JSON.parse(stdout);
}

async function main() {
  if (process.argv.length !== 2) throw new Error('Usage : node scripts/releases/check-production.mjs (lecture seule).');
  const config = JSON.parse(await readFile(new URL('./projects.json', import.meta.url), 'utf8'));
  let failures = 0;
  for (const expected of config.projects) {
    try {
      const project = await jsonCommand('vercel', ['api', `/v9/projects/${expected.id}?teamId=${config.teamId}`, '--scope', config.scope, '--raw']);
      let result = inspectProduction(expected, project, config.owner);
      if (!result.errors.length) {
        const root = `/repos/${config.owner}/${expected.repository}`;
        const repository = await jsonCommand('gh', ['api', root]);
        const branch = await jsonCommand('gh', ['api', `${root}/branches/${encodeURIComponent(repository.default_branch)}`]);
        const comparison = await jsonCommand('gh', ['api', `${root}/compare/${result.sha}...${branch.commit.sha}`]);
        result = verifyHistory(result, repository, branch, comparison);
      }
      if (result.errors.length) failures++;
      console.log(JSON.stringify(result));
    } catch {
      // Do not leak CLI stderr or raw provider responses into a shared log.
      failures++;
      console.error(JSON.stringify({ project: expected.name, errors: ['Contrôle impossible ; vérifier les sessions Vercel et GitHub puis réessayer.'], safe: false }));
    }
  }
  if (failures) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
