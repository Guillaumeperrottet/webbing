import assert from 'node:assert/strict';
import test from 'node:test';
import {dependencyMetadata,evaluateChecks,allowedDependencyFiles,trustedDependencyPR,mergeUpdate,QUALITY,ATTESTATION,GATE,gatewayReadiness,dispatchApproval,resolveDependencyCheck,dispatchDependencyChecks,refreshDependencyBranch} from '../scripts/dependencies/policy.mjs';
const sha='a'.repeat(40),base='b'.repeat(40);
const commit=(type)=>({author:{login:'dependabot[bot]',type:'Bot'},commit:{verification:{verified:true},message:`Bump dependencies\n\n---\nupdated-dependencies:\n- dependency-name: react\n  dependency-version: 19.3.1\n  update-type: version-update:semver-${type}\n...\n\nSigned-off-by: dependabot[bot]`}});
const checks=[{id:1,name:QUALITY,app:{id:15368,slug:'github-actions'},status:'completed',conclusion:'success'}];
const statuses=[{context:ATTESTATION,state:'success',description:`base:${base}`,creator:{login:'github-actions[bot]'}}];
test('only signed bot metadata classifies updates; mixed groups retain the largest change',()=>{
 assert.equal(dependencyMetadata([commit('patch'),commit('minor')]).type,'minor');
 assert.equal(dependencyMetadata([commit('patch'),commit('major')]).type,'major');
 const forged=commit('patch');forged.commit.verification.verified=false;assert.equal(dependencyMetadata([forged]).type,'unknown');
 forged.commit.verification.verified=true;forged.author.login='someone';assert.equal(dependencyMetadata([forged]).type,'unknown');
 assert.equal(dependencyMetadata([{...commit('patch'),commit:{verification:{verified:true},message:'Bump a tiny patch'}}]).type,'unknown');
});
test('failed, pending, spoofed or stale checks cannot authorize a merge',()=>{
 assert.equal(evaluateChecks(checks,statuses,base).ok,true);
 assert.equal(evaluateChecks(checks,statuses,'c'.repeat(40)).ok,false);
 assert.equal(evaluateChecks([...checks,{...checks[0],id:2,conclusion:'failure'}],statuses,base).ok,false);
 assert.equal(evaluateChecks(checks,[...statuses,{context:'Vercel',state:'pending'}],base).ok,false);
 assert.equal(evaluateChecks([{...checks[0],app:{id:99,slug:'fake'}}],statuses,base).ok,false);
 assert.equal(evaluateChecks(checks,[{...statuses[0],creator:{login:'someone'}}],base).ok,false);
});
test('only dependency files and same-repository bot branches qualify',()=>{
 assert.equal(allowedDependencyFiles([{filename:'portal/package.json'},{filename:'pnpm-lock.yaml'}]),true);
 assert.equal(allowedDependencyFiles([{filename:'src/auth.ts'}]),false);
 assert.equal(allowedDependencyFiles([{filename:'../package.json'}]),false);
 assert.equal(trustedDependencyPR({state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha,ref:'dependabot/npm/react',repo:{full_name:'owner/repo'}},base:{ref:'main',repo:{full_name:'owner/repo'}}},'owner/repo','main'),true);
});
test('manual approval is bound to the displayed head and target; a major never auto-merges',async()=>{
 let writes=0;
 const pr={number:1,state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha,ref:'dependabot/npm/react',repo:{full_name:'owner/repo'}},base:{ref:'main',repo:{full_name:'owner/repo'}},commits:1,changed_files:1,mergeable:true};
 const api=async(path,options)=>{
  if(options?.method){writes++;assert.equal(options.body.sha,sha);return {merged:true,sha:'d'.repeat(40)};}
  if(path==='/repos/owner/repo')return {default_branch:'main'};
  if(path.endsWith('/pulls/1'))return pr;
  if(path.includes('/commits?'))return [commit('major')];
  if(path.includes('/files?'))return [{filename:'package.json'}];
  if(path.includes('/check-runs?'))return {total_count:1,check_runs:checks};
  if(path.includes('/statuses?'))return statuses;
  if(path.includes('/git/ref/'))return {object:{sha:base}};
  throw new Error(path);
 };
 await assert.rejects(()=>mergeUpdate(api,'owner/repo',1,{expectedHead:sha,expectedBase:base,automatic:true}),/validation manuelle/);
 await assert.rejects(()=>mergeUpdate(api,'owner/repo',1,{expectedHead:'c'.repeat(40),expectedBase:base}),/changé/);
 assert.equal(writes,0);
 assert.equal((await mergeUpdate(api,'owner/repo',1,{expectedHead:sha,expectedBase:base})).sha,'d'.repeat(40));assert.equal(writes,1);
});

test('the limited-token gateway requires a trusted current decision and ignores its own pending status only inside the trusted worker',()=>{
 const gate={context:GATE,state:'success',description:`base:${base}`,creator:{login:'github-actions[bot]'}};
 assert.equal(gatewayReadiness(statuses,base).ok,false);
 assert.equal(gatewayReadiness([...statuses,gate],base).ok,true);
 assert.equal(gatewayReadiness([...statuses,{...gate,creator:{login:'someone'}}],base).ok,false);
 assert.equal(gatewayReadiness([...statuses,gate],'c'.repeat(40)).ok,false);
 assert.equal(gatewayReadiness([...statuses,gate,{context:'Vercel',state:'failure'}],base).ok,false);
 assert.equal(evaluateChecks(checks,[...statuses,{...gate,state:'pending'}],base).ok,true);
});
test('Webbing dispatches a bound approval without the Checks API or a direct merge',async()=>{
 const approvalId='12345678-1234-4234-8234-123456789abc';let writes=0;
 const pr={state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha,ref:'dependabot/npm/next',repo:{full_name:'owner/repo'}},base:{ref:'main',repo:{full_name:'owner/repo'}}};
 const api=async(path,options)=>{
  assert.ok(!path.includes('/check-runs')&&!path.endsWith('/merge'));
  if(options?.method){writes++;assert.equal(path,'/repos/owner/repo/actions/workflows/webbing-dependency-policy.yml/dispatches');assert.equal(options.body.ref,'main');assert.deepEqual(options.body.inputs,{pull_request:'7',approve_manual:'true',expected_head:sha,expected_base:base,approval_id:approvalId});return null;}
  if(path==='/repos/owner/repo')return {default_branch:'main'};
  if(path.endsWith('/pulls/7'))return pr;
  if(path.includes('/git/ref/'))return {object:{sha:base}};
  if(path.includes('/statuses?'))return [...statuses,{context:GATE,state:'success',description:`base:${base}`,creator:{login:'github-actions[bot]'}}];
  throw new Error(path);
 };
 await assert.rejects(()=>dispatchApproval(api,'owner/repo',7,{expectedHead:'c'.repeat(40),expectedBase:base,approvalId}),/changé/);assert.equal(writes,0);
 assert.deepEqual(await dispatchApproval(api,'owner/repo',7,{expectedHead:sha,expectedBase:base,approvalId}),{queued:true});assert.equal(writes,1);
});

test('security updates without an update-type use only the matching stable versions in their signed subject',()=>{
 const security=(before,after)=>{const value=commit('patch');value.commit.message=value.commit.message.replace('Bump dependencies',`Bump react from ${before} to ${after}`).replace('  update-type: version-update:semver-patch\n','').replace('dependency-version: 19.3.1',`dependency-version: ${after}`);return value;};
 assert.equal(dependencyMetadata([security('19.3.0','19.3.1')]).type,'patch');
 assert.equal(dependencyMetadata([security('19.2.9','19.3.1')]).type,'minor');
 assert.equal(dependencyMetadata([security('18.3.1','19.3.1')]).type,'major');
 assert.equal(dependencyMetadata([security('19.3.1','19.2.9')]).type,'unknown');
 assert.equal(dependencyMetadata([security('19.3.0-rc.1','19.3.1')]).type,'unknown');
 const mismatch=security('19.3.0','19.3.1');mismatch.commit.message=mismatch.commit.message.replace('dependency-version: 19.3.1','dependency-version: 20.0.0');assert.equal(dependencyMetadata([mismatch]).type,'unknown');
});

test('manual test requests bind the bot head and current base without approving a proposal',async()=>{
 let writes=0,files=[{filename:'package.json'}];
 const pr={state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha,ref:'dependabot/npm/next',repo:{full_name:'owner/repo'}},base:{ref:'main',repo:{full_name:'owner/repo'}},changed_files:1};
 const api=async(path,options)=>{
  if(options?.method){writes++;assert.equal(path,'/repos/owner/repo/actions/workflows/webbing-dependency-checks.yml/dispatches');assert.equal(options.body.ref,'main');assert.equal(options.body.inputs.expected_head,sha);assert.equal(options.body.inputs.expected_base,base);assert.equal(options.body.inputs.approve_manual,undefined);return null;}
  if(path==='/repos/owner/repo')return {default_branch:'main'};
  if(path.endsWith('/pulls/7'))return pr;
  if(path.includes('/git/ref/'))return {object:{sha:base}};
  if(path.includes('/files?'))return files;
  throw new Error(path);
 };
 const binding={expectedHead:sha,expectedBase:base,requestId:'12345678-1234-4234-8234-123456789abc'};
 assert.deepEqual(await resolveDependencyCheck(api,'owner/repo',7,binding),{head:sha,base,branch:'main'});
 await assert.rejects(()=>dispatchDependencyChecks(api,'owner/repo',7,{...binding,expectedBase:'d'.repeat(40)}),/changé/);
 files=[];await assert.rejects(()=>dispatchDependencyChecks(api,'owner/repo',7,binding),/limite/);
 files=[{filename:'src/compatibility-fix.ts'}];await assert.rejects(()=>dispatchDependencyChecks(api,'owner/repo',7,{...binding,expectedHead:'d'.repeat(40)}),/changé/);
 pr.head.repo.full_name='someone/fork';await assert.rejects(()=>dispatchDependencyChecks(api,'owner/repo',7,binding),/Dependabot/);
 pr.head.repo.full_name='owner/repo';assert.equal(writes,0);
 assert.deepEqual(await dispatchDependencyChecks(api,'owner/repo',7,binding),{queued:true});assert.equal(writes,1);
});

test('application compatibility fixes always require explicit approval, even with minor dependency metadata',async()=>{
 let writes=0;
 const pr={number:1,state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha,ref:'dependabot/npm/react',repo:{full_name:'owner/repo'}},base:{ref:'main',repo:{full_name:'owner/repo'}},commits:1,changed_files:2,mergeable:true};
 const api=async(path,options)=>{
  if(options?.method){writes++;return {merged:true,sha:'d'.repeat(40)};}
  if(path==='/repos/owner/repo')return {default_branch:'main'};
  if(path.endsWith('/pulls/1'))return pr;
  if(path.includes('/commits?'))return [commit('minor')];
  if(path.includes('/files?'))return [{filename:'package.json'},{filename:'src/compatibility-fix.ts'}];
  if(path.includes('/check-runs?'))return {total_count:1,check_runs:checks};
  if(path.includes('/statuses?'))return statuses;
  if(path.includes('/git/ref/'))return {object:{sha:base}};
  throw new Error(path);
 };
 await assert.rejects(()=>mergeUpdate(api,'owner/repo',1,{expectedHead:sha,expectedBase:base,automatic:true}),/validation manuelle/);assert.equal(writes,0);
 await mergeUpdate(api,'owner/repo',1,{expectedHead:sha,expectedBase:base});assert.equal(writes,1);
});

test('the isolated resolver refreshes only the requested bot branch and rejects concurrent changes',async()=>{
 const updated='c'.repeat(40);let writes=0,current=sha,parents=[{sha},{sha:base}];
 const binding={expectedHead:sha,expectedBase:base};
 const api=async(path,options)=>{
  if(options?.method){assert.equal(path,'/repos/owner/repo/pulls/7/update-branch');assert.equal(options.body.expected_head_sha,sha);writes++;current=updated;return {};}
  if(path==='/repos/owner/repo')return {default_branch:'main'};
  if(path.endsWith('/pulls/7'))return {state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha:current,ref:'dependabot/npm/react',repo:{full_name:'owner/repo'}},base:{ref:'main',repo:{full_name:'owner/repo'}},changed_files:1};
  if(path.includes('/git/ref/'))return {object:{sha:base}};
  if(path.includes('/files?'))return [{filename:'package.json'}];
  if(path.includes('/compare/'))return {merge_base_commit:{sha:'d'.repeat(40)}};
  if(path.endsWith('/commits/'+updated))return {parents};
  throw new Error(path);
 };
 assert.deepEqual(await refreshDependencyBranch(api,'owner/repo',7,binding),{head:updated,base,branch:'main'});assert.equal(writes,1);
 current=sha;parents=[{sha},{sha:'e'.repeat(40)}];await assert.rejects(()=>refreshDependencyBranch(api,'owner/repo',7,binding),/changé pendant/);
});
