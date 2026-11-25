import "server-only";
import {randomUUID} from "node:crypto";
import {z} from "zod";
import {database,query} from "./db";
import {seal,unseal} from "./vault";
import {tokensEqual} from "./security";
import {githubApi,dependencyMetadata,evaluateChecks,allowedDependencyFiles,mergeUpdate} from "../../../scripts/dependencies/policy.mjs";

export type Repository={full_name:string;default_branch:string;setup_pr_url:string|null;setup_state:string;ci_configured:boolean;auto_merge_enabled:boolean;integration_id:string|null;last_sync_at:string|null;last_error:string|null};
export type DependencyUpdate={repository:string;number:number;title:string;url:string;head_sha:string;base_sha:string;update_type:string;dependencies:{name:string;type:string;version:string|null}[];checks:{name:string;status:string;conclusion:string|null;url:string|null}[];ready:boolean;auto_eligible:boolean;reason:string;checked_at:string;updated_at:string};
export async function dependencyData(){const [repos,updates]=await Promise.all([query<Repository>('SELECT * FROM ops_repositories ORDER BY full_name'),query<DependencyUpdate>("SELECT * FROM ops_dependency_updates WHERE state='open' ORDER BY ready DESC,repository,number DESC")]);return {repositories:repos.rows,updates:updates.rows};}
const sha=z.string().regex(/^[0-9a-f]{40}$/);
const metadataSchema=z.object({type:z.enum(['unknown','patch','minor','major']),dependencies:z.array(z.object({name:z.string(),type:z.string(),version:z.string().nullable()}))});
const actorSchema=z.object({login:z.string(),__typename:z.string()});
export function githubActorLogin(actor:{login:string;__typename:string}|null){return actor?actor.__typename==='Bot'&&!actor.login.endsWith('[bot]')?`${actor.login}[bot]`:actor.login:null;}
const statusSchema=z.object({__typename:z.literal('StatusContext'),context:z.string(),description:z.string().nullable(),state:z.string(),creator:actorSchema.nullable(),targetUrl:z.string().nullable()});
const checkSchema=z.object({__typename:z.literal('CheckRun'),name:z.string(),status:z.string(),conclusion:z.string().nullable(),detailsUrl:z.string().nullable(),checkSuite:z.object({app:z.object({databaseId:z.number(),slug:z.string().nullable()}).nullable()})});
const prSchema=z.object({number:z.number().int().positive(),title:z.string(),url:z.string().url(),headRefOid:sha,baseRefName:z.string(),mergeable:z.string(),isDraft:z.boolean(),updatedAt:z.string(),author:actorSchema.nullable(),files:z.object({nodes:z.array(z.object({path:z.string()})),totalCount:z.number()}),commits:z.object({nodes:z.array(z.object({commit:z.object({statusCheckRollup:z.object({contexts:z.object({nodes:z.array(z.unknown()),totalCount:z.number()})}).nullable()})}))})});
const repoSchema=z.object({nameWithOwner:z.string(),defaultBranchRef:z.object({name:z.string(),target:z.object({oid:sha})}),ci:z.object({oid:z.string()}).nullable(),pullRequests:z.object({nodes:z.array(prSchema),pageInfo:z.object({hasNextPage:z.boolean()})})});
const fields=`nameWithOwner defaultBranchRef{name target{oid}} ci:object(expression:"HEAD:.github/webbing-ci.json"){oid} pullRequests(first:30,states:OPEN,orderBy:{field:UPDATED_AT,direction:DESC}){pageInfo{hasNextPage} nodes{number title url headRefOid baseRefName mergeable isDraft updatedAt author{login __typename} files(first:100){totalCount nodes{path}} commits(last:1){nodes{commit{statusCheckRollup{contexts(first:100){totalCount nodes{__typename ...on CheckRun{name status conclusion detailsUrl checkSuite{app{databaseId slug}}} ...on StatusContext{context description state creator{login __typename} targetUrl}}}}}}}}}`;
export async function readGitHubRepositories(token:string,repositories:string[]){
 const selections=repositories.map((name,i)=>{const [owner,repo]=name.split('/');return `r${i}:repository(owner:${JSON.stringify(owner)},name:${JSON.stringify(repo)}){${fields}}`;}).join(' ');
 const response=await fetch('https://api.github.com/graphql',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json','User-Agent':'Webbing-gestion'},body:JSON.stringify({query:`{${selections}}`}),cache:'no-store',redirect:'error',signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error(response.status===401?'Jeton GitHub expiré ou révoqué.':'GitHub n’est pas disponible pour la synchronisation.');
 const result=await response.json() as {data?:Record<string,unknown>;errors?:unknown[]};
 if(result.errors?.length||!result.data)throw new Error('Le jeton GitHub ne permet pas de lire tous les contrôles. Vérifier les droits de lecture Checks, Actions et Commit statuses.');
 return result.data;
}
export async function connectGitHub(name:string,token:string,names:string[]){
 if(!/^github_pat_[A-Za-z0-9_]{30,}$/.test(token)||token.length>512)throw new Error('Utilise un jeton GitHub à permissions limitées commençant par github_pat_.');
 const known=(await query<Repository>('SELECT * FROM ops_repositories')).rows;
 const selected=[...new Set(names)];if(!name.trim()||name.length>80||!selected.length||selected.some(n=>!known.some(r=>r.full_name===n)))throw new Error('Choisis un nom et les dépôts à raccorder.');
 const api=githubApi(token);const accessible:string[]=[];
 for(let i=0;i<selected.length;i+=4){const batch=await Promise.allSettled(selected.slice(i,i+4).map(async repository=>{const value=await api(`/repos/${repository}`);if(value.full_name!==repository)throw new Error('Identité du dépôt différente.');await api(`/repos/${repository}/pulls?state=open&per_page=1`);return repository;}));for(const result of batch){if(result.status==='fulfilled')accessible.push(result.value);else if(result.reason instanceof Error&&/expiré|révoqué/.test(result.reason.message))throw result.reason;}}
 if(!accessible.length)throw new Error('Ce jeton GitHub n’a accès à aucun des dépôts sélectionnés.');
 await readGitHubRepositories(token,accessible);
 const client=await database().connect();let id:string=randomUUID();
 try{await client.query('BEGIN');await client.query("SELECT pg_advisory_xact_lock(hashtextextended('webbing:github-connections',0))");
 const existing=(await client.query<{id:string;secret_cipher:string;config:{repos:string[]}}>("SELECT id,secret_cipher,config FROM ops_integrations WHERE provider='github' AND revoked_at IS NULL ORDER BY created_at DESC FOR UPDATE")).rows;
 const same=existing.filter(c=>{try{return tokensEqual(unseal(c.secret_cipher,`${c.id}:github`),token);}catch{return false;}});
 if(same.length){id=same[0].id;const repos=[...new Set([...same.flatMap(c=>c.config.repos),...accessible])];await client.query("UPDATE ops_integrations SET name=$1,config=$2,last_error=NULL WHERE id=$3",[name.trim(),JSON.stringify({repos}),id]);const duplicates=same.slice(1).map(c=>c.id);if(duplicates.length){await client.query('UPDATE ops_repositories SET integration_id=$1 WHERE integration_id=ANY($2::uuid[])',[id,duplicates]);await client.query("UPDATE ops_integrations SET revoked_at=now(),secret_cipher='' WHERE id=ANY($1::uuid[])",[duplicates]);}}
 else await client.query("INSERT INTO ops_integrations(id,provider,name,secret_cipher,config) VALUES($1,'github',$2,$3,$4)",[id,name.trim(),seal(token,`${id}:github`),JSON.stringify({repos:accessible})]);
 await client.query('UPDATE ops_repositories SET integration_id=$1,last_error=NULL WHERE full_name=ANY($2::text[])',[id,accessible]);
 await client.query("INSERT INTO ops_audit(kind,detail) VALUES('github_connexion',$1)",[`${name.trim()} · ${accessible.length} dépôt(s)`]);await client.query('COMMIT');
 }catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}
 await syncGitHub();return {connected:accessible.length,excluded:selected.length-accessible.length};
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
    const repo=parsed.data,base=repo.defaultBranchRef.target.oid;const pulls=repo.pullRequests.nodes.filter(pr=>pr.author?.__typename==='Bot'&&githubActorLogin(pr.author)==='dependabot[bot]'&&pr.baseRefName===repo.defaultBranchRef.name);
    for(let i=0;i<pulls.length;i+=4)await Promise.all(pulls.slice(i,i+4).map(async pr=>{
     const previous=(await query<{head_sha:string;update_type:string;dependencies:unknown}>('SELECT head_sha,update_type,dependencies FROM ops_dependency_updates WHERE repository=$1 AND number=$2',[repository,pr.number])).rows[0];
     const metadata=previous&&previous.head_sha===pr.headRefOid&&previous.update_type!=='unknown'?metadataSchema.parse({type:previous.update_type,dependencies:previous.dependencies}):metadataSchema.parse(dependencyMetadata(await api(`/repos/${repository}/pulls/${pr.number}/commits?per_page=100`)));
     const contexts=pr.commits.nodes[0]?.commit.statusCheckRollup?.contexts;const checks:{id:number;name:string;status:string;conclusion:string|null;app:{id:number;slug:string|null}|null;url:string|null}[]=[];const statuses:{context:string;description:string|null;state:string;creator:{login:string}|null}[]=[];
     for(const [idx,node] of (contexts?.nodes||[]).entries()){
      const c=checkSchema.safeParse(node);if(c.success){const v=c.data;checks.push({id:idx+1,name:v.name,status:v.status.toLowerCase(),conclusion:v.conclusion?.toLowerCase()||null,app:v.checkSuite.app?{id:v.checkSuite.app.databaseId,slug:v.checkSuite.app.slug}:null,url:v.detailsUrl});continue;}
      const s=statusSchema.safeParse(node);if(s.success)statuses.push({...s.data,creator:s.data.creator?{login:githubActorLogin(s.data.creator)!}:null,state:s.data.state.toLowerCase()});
     }
     const decision=evaluateChecks(checks,statuses,base),files=pr.files.nodes.map(f=>({filename:f.path}));
     const eligible=allowedDependencyFiles(files)&&pr.files.totalCount<=100&&!pr.isDraft;
     const ready=eligible&&decision.ok&&pr.mergeable==='MERGEABLE'&&(contexts?.totalCount||0)<=100;
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
export async function approveDependency(repository:string,number:number,expectedHead:string,expectedBase:string){
 sha.parse(expectedHead);sha.parse(expectedBase);
 const connection=(await query<{id:string;secret_cipher:string}>(`SELECT i.id,i.secret_cipher FROM ops_repositories r JOIN ops_integrations i ON i.id=r.integration_id WHERE r.full_name=$1 AND i.provider='github' AND i.revoked_at IS NULL`,[repository])).rows[0];
 if(!connection)throw new Error('Raccorder ce dépôt à GitHub avant de valider.');
 const token=unseal(connection.secret_cipher,`${connection.id}:github`);
 const result=await mergeUpdate(githubApi(token),repository,number,{expectedHead,expectedBase,automatic:false});
 await query("UPDATE ops_dependency_updates SET state='merged',merged_sha=$1,ready=false WHERE repository=$2 AND number=$3",[result.sha,repository,number]);
 await query("INSERT INTO ops_audit(kind,detail) VALUES('dependance_validee',$1)",[`${repository} #${number} · ${expectedHead.slice(0,7)} → ${result.sha.slice(0,7)}`]);
 return result;
}
