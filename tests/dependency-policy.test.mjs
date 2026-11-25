import assert from 'node:assert/strict';
import test from 'node:test';
import {dependencyMetadata,evaluateChecks,allowedDependencyFiles,trustedDependencyPR,mergeUpdate,QUALITY,ATTESTATION} from '../scripts/dependencies/policy.mjs';
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
