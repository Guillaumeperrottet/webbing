import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { existsSync,readFileSync } from "node:fs";
import path from "node:path";
const require=createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

type Deployment={id?:string;uid?:string;url?:string;target?:string|null;readyState?:string;state?:string;createdAt?:number;created?:number;meta?:Record<string,string>};
async function main(){
  const {database}=await import("../../src/lib/gestion/db");
  const {deploymentUrl}=await import("../../src/lib/gestion/vercel-events");
  const db=database();
  const data=JSON.parse(execFileSync('vercel',['api','/v9/projects?limit=100','--scope','team_HMC6tPegXy4EJfpqbNRboiB3','--raw'],{encoding:'utf8',maxBuffer:12_000_000}));
  let count=0;
  for(const p of data.projects){
    const app=(await db.query('SELECT id,slug FROM ops_applications WHERE vercel_id=$1',[p.id])).rows[0];if(!app)continue;
    const list:Deployment[]=[...(p.latestDeployments||[]),...(p.targets?.production?[p.targets.production]:[])];
    const seen=new Set<string>();
    for(const d of list){
      const id=d.id||d.uid;if(!id||seen.has(id))continue;seen.add(id);
      const created=d.createdAt||d.created;if(!created)continue;
      await db.query(`INSERT INTO ops_deployments(deployment_id,application_id,target,state,url,branch,commit_sha,created_at,event_at)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,now()) ON CONFLICT(deployment_id) DO UPDATE SET target=excluded.target,state=excluded.state,url=excluded.url,branch=excluded.branch,commit_sha=excluded.commit_sha,event_at=now(),observed_at=now()`,[id,app.id,id===p.targets?.production?.id?'production':d.target||'preview',d.readyState||d.state||'UNKNOWN',deploymentUrl(d.url),d.meta?.githubCommitRef||null,d.meta?.githubCommitSha||null,new Date(created)]);count++;
    }
    const live=p.targets?.production;
    if(live?.id)await db.query('UPDATE ops_applications SET current_deployment_id=$1,current_deployment_at=now(),provider_synced_at=now() WHERE id=$2',[live.id,app.id]);
    const root=path.join(process.env.HOME!,'code/Guillaumeperrottet');
    const dirs:Record<string,string>={webbing:process.cwd(),mypapers:path.join(root,'plannikeeper'),touille:path.join(process.env.HOME!,"Documents/ChatGPT/Application de cuisine"),'tempo-timbrage-staging':path.join(process.env.HOME!,"Documents/ChatGPT/Timbrage d'heures 2/application"),'selfcamp-camping-staging':path.join(root,'selfkey/apps/camping'),'campus-gerance-portal':path.join(root,'campus-gerance/portal'),'popliving-v2':path.join(root,'popliving_v2')};
    const dir=dirs[app.slug]||path.join(root,app.slug.replace(/-staging$/,''));
    if(existsSync(path.join(dir,'package.json'))){
      const pkg=JSON.parse(readFileSync(path.join(dir,'package.json'),'utf8'));const deps={...pkg.dependencies,...pkg.devDependencies};
      const required=!!(deps.pg||deps['@prisma/client']||deps['@supabase/supabase-js']);
      let provider=deps['@supabase/supabase-js']?'Supabase':required?'PostgreSQL':null;
      if(['wisp','wisp-staging','selfkey'].includes(app.slug))provider=app.slug==='wisp-staging'?'Neon':'Exoscale';
      if(['publio','chaff'].includes(app.slug))provider='Neon';
      if(app.slug==='webbing')provider='Exoscale';
      await db.query('UPDATE ops_applications SET backup_required=$1,database_provider=$2 WHERE id=$3',[required,provider,app.id]);
    }
  }
  const file=path.join(process.cwd(),'.vercel/initial-supabase.json');
  if(existsSync(file))for(const p of JSON.parse(readFileSync(file,'utf8')))await db.query(`INSERT INTO ops_supabase_projects(ref,name,region,status,checked_at) VALUES($1,$2,$3,$4,now()) ON CONFLICT(ref) DO UPDATE SET name=excluded.name,region=excluded.region,status=CASE WHEN ops_supabase_projects.integration_id IS NULL THEN excluded.status ELSE ops_supabase_projects.status END`,[p.ref,p.name,p.region,p.status]);
  await db.query("INSERT INTO ops_audit(kind,detail) VALUES('inventaire',$1)",[`${count} déploiements Vercel synchronisés`]);
  console.log(`${count} déploiements importés. Projets Supabase et besoins de sauvegarde identifiés.`);
  await db.end();
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
