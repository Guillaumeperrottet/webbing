/** Shared by the isolated GitHub merge job and Webbing's authenticated server. */
export const GATE = 'Webbing / Validation';
export const QUALITY = 'Webbing / Quality';
export const ATTESTATION = 'Webbing / Base testée';
export const WORKFLOW = '.github/workflows/webbing-dependency-checks.yml';
const SHA = /^[0-9a-f]{40}$/;
const small = new Set(['patch','minor']);

function signedSingleUpdate(message,name,version){
  const subject=message.split('\n',1)[0];
  const match=subject.match(/^Bump (\S+) from v?(\d+\.\d+\.\d+) to v?(\d+\.\d+\.\d+)(?: in \/[A-Za-z0-9_./-]+)?$/);
  if(!match||match[1]!==name||match[3]!==version)return null;
  const before=match[2].split('.').map(Number),after=match[3].split('.').map(Number);
  if([...before,...after].some(n=>!Number.isSafeInteger(n)))return null;
  for(let i=0;i<3;i++)if(after[i]!==before[i])return after[i]>before[i]?['major','minor','patch'][i]:null;
  return null;
}
export function dependencyMetadata(commits) {
  if (!Array.isArray(commits) || !commits.length || commits.length > 100) return {type:'unknown',dependencies:[]};
  const dependencies=[];
  for (const item of commits) {
    if (item.author?.login !== 'dependabot[bot]' || item.author?.type !== 'Bot' || item.commit?.verification?.verified !== true) return {type:'unknown',dependencies:[]};
    const message=item.commit.message || '';
    const start=message.lastIndexOf('\n---\nupdated-dependencies:\n');
    const end=message.indexOf('\n...\n',start);
    if(start<0 || end<0)return {type:'unknown',dependencies:[]};
    const block=message.slice(start+5,end);
    const records=block.split(/\n(?=- dependency-name:)/).filter(s=>s.startsWith('- dependency-name:'));
    if(!records.length)return {type:'unknown',dependencies:[]};
    for(const record of records){
      const name=record.match(/^- dependency-name:\s*(.+)$/m)?.[1];
      let type=record.match(/^  update-type:\s*version-update:semver-(patch|minor|major)\s*$/m)?.[1];
      const version=record.match(/^  dependency-version:\s*(.+)$/m)?.[1] || null;
      if(!type&&name&&version&&records.length===1&&!/^  update-type:/m.test(record))type=signedSingleUpdate(message,name.replace(/^['"]|['"]$/g,''),version.replace(/^['"]|['"]$/g,''));
      if(!name || !type)return {type:'unknown',dependencies:[]};
      dependencies.push({name:name.replace(/^['"]|['"]$/g,'').slice(0,200),type,version:version?.replace(/^['"]|['"]$/g,'').slice(0,100)});
    }
  }
  const type=dependencies.some(d=>d.type==='major')?'major':dependencies.some(d=>d.type==='minor')?'minor':'patch';
  return {type,dependencies};
}
export function allowedDependencyFiles(files) {
  if(!Array.isArray(files)||!files.length||files.length>100)return false;
  return files.every(f=>typeof f.filename==='string' && !f.filename.split('/').includes('..') && (
    /(^|\/)(package\.json|package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/.test(f.filename)
    || /^\.github\/workflows\/[a-zA-Z0-9._-]+\.ya?ml$/.test(f.filename)
  ));
}
export function trustedDependencyPR(pr,repository,branch) {
  return pr.state==='open' && !pr.draft && pr.user?.login==='dependabot[bot]' && pr.user?.type==='Bot'
    && pr.head?.repo?.full_name===repository && pr.base?.repo?.full_name===repository
    && pr.base?.ref===branch && /^dependabot\//.test(pr.head?.ref || '') && SHA.test(pr.head?.sha || '');
}
export function evaluateChecks(checks,statuses,baseSha) {
  const latest=new Map();
  for(const check of checks || []){
    const key=`${check.app?.id}:${check.name}`;
    if(!latest.has(key)||Number(check.id)>Number(latest.get(key).id))latest.set(key,check);
  }
  const runs=[...latest.values()].filter(c=>!(c.name==='Webbing / Dependency policy'&&c.app?.slug==='github-actions'));
  if(!runs.some(c=>c.name===QUALITY && c.app?.slug==='github-actions' && c.status==='completed' && c.conclusion==='success'))return {ok:false,reason:'Les vérifications Webbing doivent réussir.'};
  if(runs.some(c=>c.status!=='completed'||!['success','neutral','skipped'].includes(c.conclusion)))return {ok:false,reason:'Un contrôle est en attente ou en échec.'};
  const byContext=new Map();
  for(const status of statuses || []){if(status.context===GATE&&status.creator?.login==='github-actions[bot]')continue;if(!byContext.has(status.context))byContext.set(status.context,status);}
  if([...byContext.values()].some(s=>s.state!=='success'))return {ok:false,reason:'Un contrôle de déploiement est en attente ou en échec.'};
  const proof=byContext.get(ATTESTATION);
  if(!proof || proof.creator?.login!=='github-actions[bot]' || proof.state!=='success' || proof.description!==`base:${baseSha}`)return {ok:false,reason:'La branche cible a changé : relancer les vérifications sur sa version actuelle.'};
  return {ok:true,reason:'Tous les contrôles ont réussi sur la version actuelle.'};
}
export async function inspectUpdate(api,repository,number) {
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)||!Number.isSafeInteger(number)||number<1)throw new Error('Proposition invalide.');
  const root=`/repos/${repository}`;
  const [repo,pr]=await Promise.all([api(root),api(`${root}/pulls/${number}`)]);
  const eligible=trustedDependencyPR(pr,repository,repo.default_branch);
  if(!eligible)return {pr,type:'unknown',dependencies:[],ready:false,reason:'Cette proposition ne correspond pas à une mise à jour Dependabot du dépôt.'};
  const [commits,files,checks,statuses,branch]=await Promise.all([
    api(`${root}/pulls/${number}/commits?per_page=100`),api(`${root}/pulls/${number}/files?per_page=100`),
    api(`${root}/commits/${pr.head.sha}/check-runs?per_page=100`),api(`${root}/commits/${pr.head.sha}/statuses?per_page=100`),
    api(`${root}/git/ref/heads/${encodeURIComponent(repo.default_branch)}`),
  ]);
  const metadata=dependencyMetadata(commits);
  if(pr.commits>100||pr.changed_files>100||checks.total_count>100||statuses.length>=100)return {...metadata,pr,ready:false,reason:'Cette proposition dépasse la limite de vérification automatique.'};
  const dependencyOnly=allowedDependencyFiles(files);
  const baseSha=branch.object.sha;
  const state=evaluateChecks(checks.check_runs,statuses,baseSha);
  const critical=files.some(f=>['.github/workflows/webbing-dependency-checks.yml','.github/workflows/webbing-dependency-policy.yml'].includes(f.filename));
  return {...metadata,pr,baseSha,files:files.map(f=>({path:f.filename,additions:f.additions,deletions:f.deletions})),checks:checks.check_runs.map(c=>({name:c.name,status:c.status,conclusion:c.conclusion,url:c.details_url})),ready:state.ok&&pr.mergeable===true,autoEligible:small.has(metadata.type)&&!critical&&dependencyOnly,reason:!state.ok?state.reason:pr.mergeable!==true?'GitHub doit confirmer que la proposition peut être fusionnée.':!dependencyOnly?'Adaptations de code : examiner les changements avant validation.':critical?'La configuration des contrôles nécessite une validation.':state.reason};
}
export async function mergeUpdate(api,repository,number,{expectedHead,expectedBase,automatic=false}) {
  const update=await inspectUpdate(api,repository,number);
  if(!SHA.test(expectedHead || '')||!SHA.test(expectedBase || '')||update.pr.head.sha!==expectedHead||update.baseSha!==expectedBase)throw new Error('La proposition ou la branche cible a changé. Actualise avant de valider.');
  if(!update.ready)throw new Error(update.reason);
  if(automatic && !update.autoEligible)throw new Error('Cette mise à jour nécessite une validation manuelle.');
  const current=await api(`/repos/${repository}/pulls/${number}`);
  const base=await api(`/repos/${repository}/git/ref/heads/${encodeURIComponent(current.base.ref)}`);
  if(current.head.sha!==expectedHead||base.object.sha!==expectedBase||current.state!=='open')throw new Error('La proposition a changé pendant la vérification.');
  const result=await api(`/repos/${repository}/pulls/${number}/merge`,{method:'PUT',body:{sha:expectedHead,merge_method:'squash'}});
  if(!result.merged)throw new Error('GitHub n’a pas confirmé la fusion.');
  return {sha:result.sha,type:update.type};
}
export function githubApi(token) {
  return async(path,options={})=>{
    const comparison=/^\/repos\/[A-Za-z0-9_-]+\/[A-Za-z0-9_.-]+\/compare\/[0-9a-f]{40}\.\.\.[0-9a-f]{40}$/.test(path);
    if(!path.startsWith('/repos/')||path.includes('#')||path.split('/').some(part=>part==='..'||part==='.')||path.includes('..')&&!comparison)throw new Error('Requête GitHub invalide.');
    const response=await fetch('https://api.github.com'+path,{method:options.method||'GET',headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Webbing-gestion'},body:options.body?JSON.stringify(options.body):undefined,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(12000)});
    if(!response.ok)throw Object.assign(new Error(response.status===401?'Jeton GitHub expiré ou révoqué.':response.status===403?'Droits GitHub insuffisants ou limite de requêtes atteinte.':response.status===409||response.status===405?'La proposition ne peut pas être fusionnée dans son état actuel.':'GitHub n’a pas accepté cette opération.'),{status:response.status});
    return response.status===204?null:response.json();
  };
}

/** Fine-grained PATs cannot call Checks. The trusted GitHub workflow publishes its decision. */
export function gatewayReadiness(statuses,baseSha){
  const latest=new Map();
  for(const status of statuses||[])if(!latest.has(status.context))latest.set(status.context,status);
  if((statuses||[]).length>=100)return {ok:false,reason:'La liste des contrôles doit être examinée dans GitHub.'};
  const attestation=latest.get(ATTESTATION),gate=latest.get(GATE);
  if(!attestation||attestation.creator?.login!=='github-actions[bot]'||attestation.state!=='success'||attestation.description!==`base:${baseSha}`)return {ok:false,reason:'Des contrôles sur la branche cible actuelle sont nécessaires.'};
  if(!gate||gate.creator?.login!=='github-actions[bot]'||gate.description!==`base:${baseSha}`||gate.state!=='success')return {ok:false,reason:'La validation des contrôles par GitHub est en attente.'};
  if([...latest.values()].some(s=>s.state!=='success'))return {ok:false,reason:'Un contrôle de déploiement est en attente ou en échec.'};
  return {ok:true,reason:'GitHub a vérifié tous les contrôles sur la version actuelle.'};
}
export async function dispatchApproval(api,repository,number,{expectedHead,expectedBase,approvalId}){
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)||!Number.isSafeInteger(number)||number<1||!SHA.test(expectedHead)||!SHA.test(expectedBase)||!/^([0-9a-f]{8}-){1}[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(approvalId))throw new Error('Proposition invalide.');
  const root=`/repos/${repository}`;
  const [repo,pr]=await Promise.all([api(root),api(`${root}/pulls/${number}`)]);
  if(!trustedDependencyPR(pr,repository,repo.default_branch))throw new Error('Cette proposition ne correspond pas à une mise à jour Dependabot du dépôt.');
  const [base,statuses]=await Promise.all([api(`${root}/git/ref/heads/${encodeURIComponent(repo.default_branch)}`),api(`${root}/commits/${pr.head.sha}/statuses?per_page=100`)]);
  if(pr.head.sha!==expectedHead||base.object.sha!==expectedBase)throw new Error('La proposition ou la branche cible a changé. Actualise avant de valider.');
  const readiness=gatewayReadiness(statuses,expectedBase);if(!readiness.ok)throw new Error(readiness.reason);
  await api(`${root}/actions/workflows/webbing-dependency-policy.yml/dispatches`,{method:'POST',body:{ref:repo.default_branch,inputs:{pull_request:String(number),approve_manual:'true',expected_head:expectedHead,expected_base:expectedBase,approval_id:approvalId}}});
  return {queued:true};
}

export async function resolveDependencyCheck(api,repository,number,{expectedHead,expectedBase}){
  if(!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)||!Number.isSafeInteger(number)||number<1||!SHA.test(expectedHead||'')||!SHA.test(expectedBase||''))throw new Error('Proposition invalide.');
  const root=`/repos/${repository}`;
  const [repo,pr]=await Promise.all([api(root),api(`${root}/pulls/${number}`)]);
  if(!trustedDependencyPR(pr,repository,repo.default_branch))throw new Error('Cette proposition ne correspond pas à une mise à jour Dependabot du dépôt.');
  const [base,files]=await Promise.all([
    api(`${root}/git/ref/heads/${encodeURIComponent(repo.default_branch)}`),
    api(`${root}/pulls/${number}/files?per_page=100`),
  ]);
  if(pr.head.sha!==expectedHead||base.object.sha!==expectedBase)throw new Error('La proposition ou la branche cible a changé. Actualise avant de lancer les tests.');
  if(pr.changed_files>100||!files.length||files.length>=100)throw new Error('Cette proposition dépasse la limite des fichiers vérifiables.');
  return {head:expectedHead,base:expectedBase,branch:repo.default_branch};
}
export async function dispatchDependencyChecks(api,repository,number,{expectedHead,expectedBase,requestId,onDispatch}){
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(requestId||''))throw new Error('Demande de tests invalide.');
  const resolved=await resolveDependencyCheck(api,repository,number,{expectedHead,expectedBase});
  onDispatch?.();
  await api(`/repos/${repository}/actions/workflows/webbing-dependency-checks.yml/dispatches`,{method:'POST',body:{ref:resolved.branch,inputs:{pull_request:String(number),expected_head:expectedHead,expected_base:expectedBase,request_id:requestId}}});
  return {queued:true};
}

/** Runs only in the isolated trusted resolve job, before any application code. */
export async function refreshDependencyBranch(api,repository,number,binding){
  const update=await resolveDependencyCheck(api,repository,number,binding);
  const root=`/repos/${repository}`;
  const comparison=await api(`${root}/compare/${update.base}...${update.head}`);
  if(comparison.merge_base_commit?.sha===update.base)return update;
  await api(`${root}/pulls/${number}/update-branch`,{method:'PUT',body:{expected_head_sha:update.head}});
  for(let attempt=0;attempt<6;attempt++){
    const pr=await api(`${root}/pulls/${number}`);
    if(pr.head.sha!==update.head){
      const [commit,current]=await Promise.all([api(`${root}/commits/${pr.head.sha}`),api(`${root}/git/ref/heads/${encodeURIComponent(update.branch)}`)]);
      const parents=commit.parents?.map(p=>p.sha)||[];
      if(current.object.sha!==update.base||parents.length!==2||!parents.includes(update.head)||!parents.includes(update.base))throw new Error('La proposition ou la branche cible a changé pendant son actualisation.');
      return {...update,head:pr.head.sha};
    }
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
  throw new Error('GitHub actualise encore la proposition. Aucun test applicatif lancé : actualise Webbing avant de réessayer.');
}
