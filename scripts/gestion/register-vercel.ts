import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
const require=createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
async function main(){
  const {database}=await import("../../src/lib/gestion/db");
  const {seal}=await import("../../src/lib/gestion/vault");
  const {vercelEvents}=await import("../../src/lib/gestion/vercel-events");
  const db=database();const existing=await db.query("SELECT id FROM ops_integrations WHERE provider='vercel' AND revoked_at IS NULL");
  if(existing.rowCount){console.log('Réception Vercel déjà raccordée.');await db.end();return;}
  const teamId='team_HMC6tPegXy4EJfpqbNRboiB3';
  const response=execFileSync('vercel',['api','/v1/webhooks','--scope',teamId,'--method','POST','--input','-','--raw'],{input:JSON.stringify({url:'https://www.webbing.ch/api/gestion/vercel',events:vercelEvents}),encoding:'utf8',maxBuffer:2_000_000});
  const hook=JSON.parse(response);
  if(typeof hook.secret!=='string'||typeof hook.id!=='string')throw new Error('Vercel n’a pas retourné la clé de signature attendue. Vérifier le webhook avant tout nouvel essai.');
  const id=randomUUID();
  await db.query("INSERT INTO ops_integrations(id,provider,name,secret_cipher,config) VALUES($1,'vercel','Équipe Webbing',$2,$3)",[id,seal(hook.secret,`${id}:vercel`),JSON.stringify({teamId,webhookId:hook.id,events:vercelEvents})]);
  console.log('Réception Vercel signée raccordée à tous les projets de l’équipe. Clé conservée chiffrée.');
  await db.end();
}
main().catch(()=>{console.error('Le raccordement Vercel a échoué. Vérifier le webhook et les droits avant de réessayer.');process.exitCode=1;});
