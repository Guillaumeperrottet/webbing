import "server-only";
import {randomUUID} from "node:crypto";
import {z} from "zod";
import {database,query} from "./db";
import {seal,unseal} from "./vault";
import {tokensEqual} from "./security";
import {githubApi,dependencyMetadata,allowedDependencyFiles,gatewayReadiness,dispatchApproval} from "../../../scripts/dependencies/policy.mjs";

export type Repository={full_name:string;default_branch:string;setup_pr_url:string|null;setup_state:string;ci_configured:boolean;auto_merge_enabled:boolean;integration_id:string|null;last_sync_at:string|null;last_error:string|null};
export type DependencyUpdate={repository:string;number:number;title:string;url:string;head_sha:string;base_sha:string;update_type:string;dependencies:{name:string;type:string;version:string|null}[];checks:{name:string;status:string;conclusion:string|null;url:string|null}[];ready:boolean;auto_eligible:boolean;reason:string;checked_at:string;updated_at:string;approval_status:string|null;approval_error:string|null;approval_url:string|null};
export async function dependencyData(){const [repos,updates]=await Promise.all([query<Repository>('SELECT * FROM ops_repositories ORDER BY full_name'),query<DependencyUpdate>("SELECT u.*,a.status AS approval_status,a.error AS approval_error,a.run_url AS approval_url FROM ops_dependency_updates u LEFT JOIN LATERAL (SELECT status,error,run_url FROM ops_dependency_approvals WHERE repository=u.repository AND number=u.number AND head_sha=u.head_sha AND base_sha=u.base_sha ORDER BY requested_at DESC LIMIT 1) a ON true WHERE u.state='open' ORDER BY u.ready DESC,u.repository,u.number DESC")]);return {repositories:repos.rows,updates:updates.rows};}
const sha=z.string().regex(/^[0-9a-f]{40}$/);
const metadataSchema=z.object({type:z.enum(['unknown','patch','minor','major']),dependencies:z.array(z.object({name:z.string(),type:z.string(),version:z.string().nullable()}))});
const actorSchema=z.object({login:z.string(),__typename:z.string()});
export function githubActorLogin(actor:{login:string;__typename:string}|null){return actor?actor.__typename==='Bot'&&!actor.login.endsWith('[bot]')?`${actor.login}[bot]`:actor.login:null;}
const statusSchema=z.object({__typename:z.literal('StatusContext'),context:z.string(),description:z.string().nullable(),state:z.string(),creator:actorSchema.nullable(),targetUrl:z.string().nullable()});
const prSchema=z.object({number:z.number().int().positive(),title:z.string(),url:z.string().url(),headRefOid:sha,baseRefName:z.string(),mergeable:z.string(),isDraft:z.boolean(),updatedAt:z.string(),author:actorSchema.nullable(),files:z.object({nodes:z.array(z.object({path:z.string()})),totalCount:z.number()}),commits:z.object({nodes:z.array(z.object({commit:z.object({status:z.object({contexts:z.array(statusSchema)}).nullable()})}))})});
const repoSchema=z.object({nameWithOwner:z.string(),defaultBranchRef:z.object({name:z.string(),target:z.object({oid:sha})}),ci:z.object({oid:z.string()}).nullable(),pullRequests:z.object({nodes:z.array(prSchema),pageInfo:z.object({hasNextPage:z.boolean()})})});
export async function readGitHubRepositories(token:string,repositories:string[]):Promise<Record<string,unknown>>{
 const api=githubApi(token),result:Record<string,unknown>={};
 for(let offset=0;offset<repositories.length;offset+=4)await Promise.all(repositories.slice(offset,offset+4).map(async(repository,index)=>{
  const root=`/repos/${repository}`,meta=await api(root);
  if(meta.full_name!==repository)throw new Error('GitHub a retourné un dépôt différent de celui demandé.');
  const [branch,open,ci]=await Promise.all([
   api(`${root}/git/ref/heads/${encodeURIComponent(meta.default_branch)}`),
   api(`${root}/pulls?state=open&sort=updated&direction=desc&per_page=30`),
   api(`${root}/contents/.github/webbing-ci.json`).catch(error=>{if(error instanceof Error&&'status' in error&&error.status===404)return null;throw error;}),
  ]);
  const base=branch.object.sha,nodes=[];
  const bots=open.filter((pr:{user:{login:string;type:string}})=>pr.user?.login==='dependabot[bot]'&&pr.user?.type==='Bot');
  for(let i=0;i<bots.length;i+=4){
   const batch=await Promise.all(bots.slice(i,i+4).map(async(pr:{number:number;title:string;html_url:string;head:{sha:string};base:{ref:string};draft:boolean;updated_at:string})=>{
    const [files,statuses]=await Promise.all([api(`${root}/pulls/${pr.number}/files?per_page=100`),api(`${root}/commits/${pr.head.sha}/statuses?per_page=100`)]);
    const verdict=gatewayReadiness(statuses,base),detail=verdict.ok?await api(`${root}/pulls/${pr.number}`):null;
    return {number:pr.number,title:pr.title,url:pr.html_url,headRefOid:pr.head.sha,baseRefName:pr.base.ref,mergeable:detail?.mergeable===true?'MERGEABLE':detail?.mergeable===false?'CONFLICTING':'UNKNOWN',isDraft:pr.draft,updatedAt:pr.updated_at,author:{login:'dependabot',__typename:'Bot'},files:{nodes:files.map((f:{filename:string})=>({path:f.filename})),totalCount:files.length>=100?101:files.length},commits:{nodes:[{commit:{status:{contexts:statuses.map((s:{context:string;description:string|null;state:string;creator:{login:string;type:string}|null;target_url:string|null})=>({__typename:'StatusContext',context:s.context,description:s.description??null,state:s.state.toUpperCase(),creator:s.creator?{login:s.creator.login,__typename:s.creator.type==='Bot'?'Bot':'User'}:null,targetUrl:s.target_url??null}))}}}]}};
   }));nodes.push(...batch);
  }
  result[`r${offset+index}`]={nameWithOwner:meta.full_name,defaultBranchRef:{name:meta.default_branch,target:{oid:base}},ci:ci?{oid:ci.sha}:null,pullRequests:{nodes,pageInfo:{hasNextPage:open.length>=30}}};
 }));
 return result;
}
export async function connectGitHub(name:string,token:string,names:string[]){
 if(!/^github_pat_[A-Za-z0-9_]{30,}$/.test(token)||token.length>512)throw new Error('Utilise un jeton GitHub à permissions limitées commençant par github_pat_.');
 const known=(await query<Repository>('SELECT * FROM ops_repositories')).rows;
 const selected=[...new Set(names)];if(!name.trim()||name.length>80||!selected.length||selected.some(n=>!known.some(r=>r.full_name===n)))throw new Error('Choisis un nom et les dépôts à raccorder.');
 const api=githubApi(token);const accessible:string[]=[];
 for(let i=0;i<selected.length;i+=4){const batch=await Promise.allSettled(selected.slice(i,i+4).map(async repository=>{const value=await api(`/repos/${repository}`);if(value.full_name!==repository)throw new Error('Identité du dépôt différente.');await Promise.all([['Pull requests',`/repos/${repository}/pulls?state=open&per_page=1`],['Commit statuses',`/repos/${repository}/commits/${encodeURIComponent(value.default_branch)}/statuses?per_page=1`],['Actions',`/repos/${repository}/actions/runs?per_page=1`]].map(async([permission,path])=>{try{await api(path);}catch(error){if(error instanceof Error&&'status' in error&&error.status===403)throw new Error(`Droits GitHub insuffisants : autoriser ${permission} en lecture pour ${repository.split('/')[1]}.`);throw error;}}));return repository;}));for(const result of batch){if(result.status==='fulfilled')accessible.push(result.value);else if(result.reason instanceof Error&&/expiré|révoqué/.test(result.reason.message))throw result.reason;}}
 if(!accessible.length)throw new Error('Ce jeton GitHub n’a accès à aucun des dépôts sélectionnés.');
 const client=await database().connect();let id:string=randomUUID();
 try{await client.query('BEGIN');await client.query("SELECT pg_advisory_xact_lock(hashtextextended('webbing:github-connections',0))");
 const existing=(await client.query<{id:string;secret_cipher:string;config:{repos:string[]}}>("SELECT id,secret_cipher,config FROM ops_integrations WHERE provider='github' AND revoked_at IS NULL ORDER BY created_at DESC FOR UPDATE")).rows;
 const same=existing.filter(c=>{try{return tokensEqual(unseal(c.secret_cipher,`${c.id}:github`),token);}catch{return false;}});
 if(same.length){id=same[0].id;const repos=[...new Set([...same.flatMap(c=>c.config.repos),...accessible])];await client.query("UPDATE ops_integrations SET name=$1,config=$2,last_error=NULL WHERE id=$3",[name.trim(),JSON.stringify({repos}),id]);const duplicates=same.slice(1).map(c=>c.id);if(duplicates.length){await client.query('UPDATE ops_repositories SET integration_id=$1 WHERE integration_id=ANY($2::uuid[])',[id,duplicates]);await client.query("UPDATE ops_integrations SET revoked_at=now(),secret_cipher='' WHERE id=ANY($1::uuid[])",[duplicates]);}}
 else await client.query("INSERT INTO ops_integrations(id,provider,name,secret_cipher,config) VALUES($1,'github',$2,$3,$4)",[id,name.trim(),seal(token,`${id}:github`),JSON.stringify({repos:accessible})]);
 await client.query('UPDATE ops_repositories SET integration_id=$1,last_error=NULL WHERE full_name=ANY($2::text[])',[id,accessible]);
 await client.query("INSERT INTO ops_audit(kind,detail) VALUES('github_connexion',$1)",[`${name.trim()} · ${accessible.length} dépôt(s)`]);await client.query('COMMIT');
 }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
 return {connected:accessible.length,excluded:selected.length-accessible.length};
}
export async function syncGitHub(){
 const connections=(await query<{id:string;secret_cipher:string;repos:string[]}>(`SELECT i.id,i.secret_cipher,array_agg(r.full_name ORDER BY r.full_name) AS repos FROM ops_integrations i JOIN ops_repositories r ON r.integration_id=i.id WHERE i.provider='github' AND i.revoked_at IS NULL GROUP BY i.id ORDER BY i.created_at`)).rows;
 let checked=0;
 for(const connection of connections){
  try{
   const token=unseal(connection.secret_cipher,`${connection.id}:github`),api=githubApi(token),data=await readGitHubRepositories(token,connection.repos);
   for(let index=0;index<connection.repos.length;index++){
    const repository=connection.repos[index],parsed=repoSchema.safeParse(data[`r${index}`]);
    if(!parsed.success||parsed.data.nameWithOwner!==repository){await query('UPDATE ops_repositories SET last_error=$1 WHERE full_name=$2',['Le dépôt ne peut pas être lu avec cet accès.',repository]);continue;}
    const repo=parsed.data,base=repo.defaultBranchRef.target.oid;await reconcileApprovals(api,repository);const pulls=repo.pullRequests.nodes.filter(pr=>pr.author?.__typename==='Bot'&&githubActorLogin(pr.author)==='dependabot[bot]'&&pr.baseRefName===repo.defaultBranchRef.name);
    for(let i=0;i<pulls.length;i+=4)await Promise.all(pulls.slice(i,i+4).map(async pr=>{
     const previous=(await query<{head_sha:string;update_type:string;dependencies:unknown}>('SELECT head_sha,update_type,dependencies FROM ops_dependency_updates WHERE repository=$1 AND number=$2',[repository,pr.number])).rows[0];
     const metadata=previous&&previous.head_sha===pr.headRefOid&&previous.update_type?metadataSchema.parse({type:previous.update_type,dependencies:previous.dependencies}):metadataSchema.parse(dependencyMetadata(await api(`/repos/${repository}/pulls/${pr.number}/commits?per_page=100`)));
     const statuses=(pr.commits.nodes[0]?.commit.status?.contexts||[]).map(s=>({...s,creator:s.creator?{login:githubActorLogin(s.creator)!}:null,state:s.state.toLowerCase()}));
     const latestStatuses=new Map<string,(typeof statuses)[number]>();for(const status of statuses)if(!latestStatuses.has(status.context))latestStatuses.set(status.context,status);
     const checks=[...latestStatuses.values()].map((s,index)=>({id:index+1,name:s.context,status:s.state==='pending'?'in_progress':'completed',conclusion:s.state==='success'?'success':s.state==='pending'?null:'failure',url:s.targetUrl}));
     const decision=gatewayReadiness(statuses,base),files=pr.files.nodes.map(f=>({filename:f.path}));
     const eligible=allowedDependencyFiles(files)&&pr.files.totalCount<=100&&!pr.isDraft;
     const ready=eligible&&decision.ok&&pr.mergeable==='MERGEABLE';
     const critical=files.some(f=>/\.github\/workflows\/webbing-dependency-(checks|policy)\.yml$/.test(f.filename));
     const reason=!eligible?'Examen des fichiers dans GitHub requis.':!decision.ok?decision.reason:pr.mergeable!=='MERGEABLE'?'GitHub doit confirmer la possibilité de fusion.':critical?'La configuration des contrôles nécessite une validation.':decision.reason;
     await query(`INSERT INTO ops_dependency_updates(repository,number,title,url,head_sha,base_sha,update_type,dependencies,checks,ready,auto_eligible,reason,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT(repository,number) DO UPDATE SET title=excluded.title,url=excluded.url,state='open',head_sha=excluded.head_sha,base_sha=excluded.base_sha,update_type=excluded.update_type,dependencies=excluded.dependencies,checks=excluded.checks,ready=excluded.ready,auto_eligible=excluded.auto_eligible,reason=excluded.reason,updated_at=excluded.updated_at,checked_at=now()`,[repository,pr.number,pr.title,pr.url,pr.headRefOid,base,metadata.type,JSON.stringify(metadata.dependencies),JSON.stringify(checks.map(c=>({name:c.name,status:c.status,conclusion:c.conclusion,url:c.url}))),ready,['patch','minor'].includes(metadata.type)&&!critical,reason,pr.updatedAt]);
    }));
    if(!repo.pullRequests.pageInfo.hasNextPage)await query("UPDATE ops_dependency_updates SET state='closed' WHERE repository=$1 AND state='open' AND NOT(number=ANY($2::int[]))",[repository,pulls.map(pr=>pr.number)]);
    await query('UPDATE ops_repositories SET ci_configured=$1,default_branch=$2,last_sync_at=now(),last_error=$3 WHERE full_name=$4',[!!repo.ci,repo.defaultBranchRef.name,repo.pullRequests.pageInfo.hasNextPage?'La liste des propositions est partielle : consulter GitHub.':null,repository]);checked++;
   }
   await query('UPDATE ops_integrations SET last_sync_at=now(),last_attempt_at=now(),last_error=NULL WHERE id=$1',[connection.id]);
  }catch(error){const message=error instanceof Error&&/^(Jeton GitHub|GitHub|Le jeton GitHub)/.test(error.message)?error.message:'Synchronisation GitHub momentanément indisponible.';await query('UPDATE ops_integrations SET last_attempt_at=now(),last_error=$1 WHERE id=$2',[message,connection.id]);await query('UPDATE ops_repositories SET last_error=$1 WHERE integration_id=$2',[message,connection.id]);}
 }
 return checked;
}
export async function reconcileApprovals(api:ReturnType<typeof githubApi>,repository:string){
 const requests=(await query<{id:string;number:number;head_sha:string;requested_by:string}>("SELECT id,number,head_sha,requested_by FROM ops_dependency_approvals WHERE repository=$1 AND status='requested'",[repository])).rows;
 if(!requests.length)return;
 const runs=await api(`/repos/${repository}/actions/workflows/webbing-dependency-policy.yml/runs?event=workflow_dispatch&per_page=100`);
 for(const request of requests){
  const pr=await api(`/repos/${repository}/pulls/${request.number}`);
  if(pr.merged&&pr.head.sha===request.head_sha){
   const changed=await query("UPDATE ops_dependency_approvals SET status='merged',merged_sha=$1,finished_at=now() WHERE id=$2 AND status='requested' RETURNING id",[pr.merge_commit_sha,request.id]);
   if(changed.rowCount){await query("UPDATE ops_dependency_updates SET state='merged',merged_sha=$1,ready=false WHERE repository=$2 AND number=$3",[pr.merge_commit_sha,repository,request.number]);await query("INSERT INTO ops_audit(kind,detail) VALUES('dependance_validee',$1)",[`${repository} #${request.number} · ${request.head_sha.slice(0,7)} → ${pr.merge_commit_sha.slice(0,7)} · ${request.requested_by}`]);}
   continue;
  }
  const run=runs.workflow_runs.find((r:{display_title:string})=>r.display_title===`Webbing validation ${request.id}`);
  if(run)await query('UPDATE ops_dependency_approvals SET run_url=$1 WHERE id=$2',[run.html_url,request.id]);
  if(pr.state==='closed'||pr.head.sha!==request.head_sha||(run?.status==='completed'&&run.conclusion!=='success'))await query("UPDATE ops_dependency_approvals SET status='failed',finished_at=now(),error=$1 WHERE id=$2 AND status='requested'",['GitHub a refusé la fusion ou la proposition a changé. Actualise les contrôles avant de réessayer.',request.id]);
 }
}
export async function approveDependency(repository:string,number:number,expectedHead:string,expectedBase:string,requestedBy:string){
 sha.parse(expectedHead);sha.parse(expectedBase);
 const connection=(await query<{id:string;secret_cipher:string}>(`SELECT i.id,i.secret_cipher FROM ops_repositories r JOIN ops_integrations i ON i.id=r.integration_id WHERE r.full_name=$1 AND i.provider='github' AND i.revoked_at IS NULL`,[repository])).rows[0];
 if(!connection)throw new Error('Raccorder ce dépôt à GitHub avant de valider.');
 const id=randomUUID();
 const inserted=await query("INSERT INTO ops_dependency_approvals(id,repository,number,head_sha,base_sha,requested_by) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING id",[id,repository,number,expectedHead,expectedBase,requestedBy]);
 if(!inserted.rowCount)return {queued:true};
 try{
  await dispatchApproval(githubApi(unseal(connection.secret_cipher,`${connection.id}:github`)),repository,number,{expectedHead,expectedBase,approvalId:id});
  await query("INSERT INTO ops_audit(kind,detail) VALUES('dependance_demandee',$1)",[`${repository} #${number} · ${expectedHead.slice(0,7)} · ${requestedBy}`]);
  return {queued:true};
 }catch(error){await query("UPDATE ops_dependency_approvals SET status='failed',finished_at=now(),error=$1 WHERE id=$2",['La validation n’a pas été transmise. Actions doit être autorisé en lecture et écriture dans le jeton GitHub.',id]);throw error;}
}
