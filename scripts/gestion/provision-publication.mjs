// Owner-side setup only. Existing CLI authentication never leaves the CLI.
// Newly issued project tokens are captured in memory and immediately sealed.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd());
const config = JSON.parse(readFileSync('scripts/releases/projects.json', 'utf8'));
const name = process.argv[2];
const project = config.projects.find(project => project.name === name && (name !== 'pattushotel' || process.argv.includes('--owner-push')));
if (!project) throw new Error('Indiquer un projet de production autorisé.');
const module = await import('../../src/lib/gestion/releases.ts');
const { storeIssuedProjectToken } = module.default || module;
const db = await import('../../src/lib/gestion/db.ts');
const { database } = db.default || db;
let issued;
try {
  const expiresAt = Date.now() + 90 * 86400_000;
  const output = execFileSync('vercel', ['api', `/v3/user/tokens?teamId=${config.teamId}`, '--scope', config.scope, '--method', 'POST', '--input', '-', '--raw'], { input: JSON.stringify({ name: `Webbing publication ${name}`, projectId: project.id, expiresAt }), encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000 });
  issued = JSON.parse(output);
  await storeIssuedProjectToken(project.id, issued.bearerToken, { id: issued.token.id, expiresAt: issued.token.expiresAt || expiresAt }, project.id);
  console.log(JSON.stringify({ project: name, encryptedConnectionSaved: true, expiresAt: new Date(expiresAt).toISOString() }));
} catch {
  if (issued?.token?.id) {
    try { execFileSync('vercel', ['api', `/v3/user/tokens/${encodeURIComponent(issued.token.id)}`, '--scope', config.scope, '--method', 'DELETE', '--raw'], { stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 }); }
    catch { console.error('La connexion a échoué. Révoquer dans Vercel le nouveau jeton Webbing publication de ce projet.'); }
  }
  console.error('Connexion non enregistrée : vérifier les droits de création de jetons Vercel limités au projet.');
  process.exitCode = 1;
} finally { await database().end(); }
