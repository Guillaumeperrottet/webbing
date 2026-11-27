// Owner-side setup. GitHub/CLI sessions stay on the Mac. Only repository hook
// secrets are sent to GitHub and stored encrypted in Webbing; never printed.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url); require('@next/env').loadEnvConfig(process.cwd());
const config = JSON.parse(readFileSync('scripts/releases/projects.json', 'utf8'));
const callback = 'https://www.webbing.ch/api/gestion/github-publications';
const db = await import('../../src/lib/gestion/db.ts'), vault = await import('../../src/lib/gestion/vault.ts');
const { query, database } = db.default || db, { seal } = vault.default || vault;
const gh = (path, method = 'GET', body) => {
  const args = ['api', path, '--method', method]; if (body) args.push('--input', '-');
  const value = execFileSync('gh', args, { input: body ? JSON.stringify(body) : undefined, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000 });
  return value.trim() ? JSON.parse(value) : {};
};
try {
  const user = gh('user'); if (user.login !== config.owner || user.type !== 'User') throw Error('La session GitHub doit être celle du propriétaire.');
  const names = [...new Set(config.projects.map(p => p.repository))];
  for (const name of names) {
    const repository = `${config.owner}/${name}`, repo = gh(`repos/${repository}`);
    if (repo.full_name !== repository || repo.owner.id !== user.id) throw Error('Identité du dépôt incorrecte.');
    const projects = config.projects.filter(p => p.repository === name);
    let baselineKnown = true;
    for (const expected of projects) {
      const p = JSON.parse(execFileSync('vercel', ['api', `/v9/projects/${expected.id}?teamId=${config.teamId}`, '--scope', config.scope, '--raw'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 }));
      if (p.id !== expected.id || p.name !== expected.name || p.accountId !== config.teamId || p.autoAssignCustomDomains !== false || p.link?.repo !== name || p.link?.org !== config.owner || p.link?.productionBranch !== repo.default_branch) throw Error('Projet ou protection Vercel incorrects.');
      const current = p.targets?.production;
      if (current?.readyState !== 'READY' || current.meta?.githubDeployment !== '1' || !/^[a-f0-9]{40}$/.test(current.meta?.githubCommitSha || '') || current.meta?.githubCommitOrg !== config.owner || current.meta?.githubCommitRepo !== name) baselineKnown = false;
      if (!(await query("SELECT project_id FROM ops_release_connections WHERE project_id=$1 AND expires_at>now()+interval '1 day'", [p.id])).rowCount) throw Error('Raccorder d’abord la publication du projet ' + expected.name);
    }
    const prior = (await query('SELECT repository,webhook_id,enabled FROM ops_owner_release_rules WHERE repository=$1', [repository])).rows[0];
    if (process.argv.includes('--disable')) {
      await query('UPDATE ops_owner_release_rules SET enabled=false WHERE repository=$1', [repository]);
      if (prior?.webhook_id) gh(`repos/${repository}/hooks/${prior.webhook_id}`, 'PATCH', { active: false });
      console.log(JSON.stringify({ repository, enabled: false })); continue;
    }
    if (!baselineKnown) {
      if (process.argv.includes('--enable')) {
        await query(`INSERT INTO ops_owner_release_rules(repository,repository_id,owner_id,owner_login,branch,secret_cipher,enabled,blocked_reason) VALUES($1,$2,$3,$4,$5,'',false,$6)
          ON CONFLICT(repository) DO UPDATE SET enabled=false,blocked_reason=excluded.blocked_reason`, [repository,repo.id,user.id,user.login,repo.default_branch,'La version en service doit être réconciliée avec GitHub avant la publication personnelle.']);
        if (prior?.webhook_id) gh(`repos/${repository}/hooks/${prior.webhook_id}`, 'PATCH', { active: false });
      }
      console.log(JSON.stringify({repository,enabled:false,reason:'Production sans provenance GitHub vérifiable',changed:process.argv.includes('--enable')}));continue;
    }
    if (!process.argv.includes('--enable')) { console.log(JSON.stringify({ repository, projectCount: projects.length, ready: true, changed: false })); continue; }
    if (prior?.enabled && prior.webhook_id) {
      const hook = gh(`repos/${repository}/hooks/${prior.webhook_id}`);
      if (hook.active && hook.config.url === callback && hook.config.insecure_ssl === '0' && ['push', 'workflow_run'].every(e => hook.events.includes(e))) { console.log(JSON.stringify({ repository, enabled: true, unchanged: true })); continue; }
      throw Error('Le webhook existant a changé. Vérifier sa configuration avant réactivation.');
    }
    const secret = randomBytes(32).toString('base64url');
    await query(`INSERT INTO ops_owner_release_rules(repository,repository_id,owner_id,owner_login,branch,secret_cipher) VALUES($1,$2,$3,$4,$5,$6)
      ON CONFLICT(repository) DO UPDATE SET repository_id=excluded.repository_id,owner_id=excluded.owner_id,owner_login=excluded.owner_login,branch=excluded.branch,secret_cipher=excluded.secret_cipher,enabled=false`, [repository, repo.id, user.id, user.login, repo.default_branch, seal(secret, `owner-release:${repository}`)]);
    let existingId = prior?.webhook_id;
    if (!existingId) {
      const hooks = gh(`repos/${repository}/hooks?per_page=100`);
      if (hooks.length >= 100) throw Error('La liste des webhooks est incomplète.');
      const matching = hooks.filter(h => h.config?.url === callback);
      if (matching.length > 1) throw Error('Plusieurs webhooks de publication existent ; vérifier avant activation.');
      existingId = matching[0]?.id;
    }
    const body = { ...(existingId ? {} : { name: 'web' }), active: true, events: ['push', 'workflow_run'], config: { url: callback, content_type: 'json', insecure_ssl: '0', secret } };
    const hook = gh(`repos/${repository}/hooks${existingId ? '/' + existingId : ''}`, existingId ? 'PATCH' : 'POST', body);
    if (!Number.isSafeInteger(hook.id) || hook.config.url !== callback) throw Error('Webhook GitHub non confirmé.');
    await query('UPDATE ops_owner_release_rules SET webhook_id=$2,enabled=true,enabled_at=now(),blocked_reason=NULL WHERE repository=$1', [repository, hook.id]);
    gh(`repos/${repository}/hooks/${hook.id}/pings`, 'POST');
    console.log(JSON.stringify({ repository, projectCount: projects.length, enabled: true }));
  }
} catch (error) { console.error(error instanceof Error && !('stderr' in error) ? error.message : 'Configuration interrompue. Vérifier les droits GitHub et Vercel ; aucune clé n’est affichée.'); process.exitCode = 1; }
finally { await database().end(); }
