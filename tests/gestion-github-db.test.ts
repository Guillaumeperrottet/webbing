import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import {mock,test} from 'node:test';
const require=createRequire(import.meta.url);require('@next/env').loadEnvConfig(process.cwd());
test('a scoped GitHub credential queues one bound request and records only a confirmed merge',{skip:process.env.WEBBING_OPS_DB_TEST!=='1'},async()=>{
 const {query,database}=await import('../src/lib/gestion/db');
 const {seal}=await import('../src/lib/gestion/vault');
 const {approveDependency,reconcileApprovals}=await import('../src/lib/gestion/github');
 const {ATTESTATION,GATE}=await import('../scripts/dependencies/policy.mjs');
 const id=randomUUID(),repository=`fixture-owner/webbing-gateway-${randomUUID()}`,head='a'.repeat(40),base='b'.repeat(40),merged='c'.repeat(40);
 const pr={state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha:head,ref:'dependabot/npm/next',repo:{full_name:repository}},base:{ref:'main',repo:{full_name:repository}}};
 let dispatches=0;
 const fetch=mock.method(globalThis,'fetch',async(input:unknown,options?:RequestInit)=>{
  const url=new URL(String(input));assert.equal(url.origin,'https://api.github.com');assert.ok(url.pathname.startsWith(`/repos/${repository}`));assert.ok(!url.pathname.includes('/check-runs')&&!url.pathname.endsWith('/merge'));
  if(options?.method==='POST'){dispatches++;assert.ok(url.pathname.endsWith('/dispatches'));const body=JSON.parse(String(options.body));assert.equal(body.inputs.expected_head,head);assert.equal(body.inputs.expected_base,base);assert.equal(body.inputs.approve_manual,'true');return new Response(null,{status:204});}
  if(url.pathname.endsWith('/pulls/7'))return Response.json(pr);
  if(url.pathname.endsWith('/git/ref/heads/main'))return Response.json({object:{sha:base}});
  if(url.pathname.endsWith('/statuses'))return Response.json([ATTESTATION,GATE].map(context=>({context,state:'success',description:`base:${base}`,creator:{login:'github-actions[bot]'}})));
  if(url.pathname===`/repos/${repository}`)return Response.json({default_branch:'main'});
  throw new Error('Unexpected fixture request.');
 });
 try{
  await query("INSERT INTO ops_integrations(id,provider,name,secret_cipher,config) VALUES($1,'github',$2,$3,'{}')",[id,repository,seal('github_pat_fixture_not_a_real_credential',`${id}:github`)]);
  await query("INSERT INTO ops_repositories(full_name,default_branch,integration_id) VALUES($1,'main',$2)",[repository,id]);
  assert.deepEqual(await approveDependency(repository,7,head,base,'qa@webbing.invalid'),{queued:true});
  assert.deepEqual(await approveDependency(repository,7,head,base,'qa@webbing.invalid'),{queued:true});assert.equal(dispatches,1);
  assert.equal((await query("SELECT status FROM ops_dependency_approvals WHERE repository=$1",[repository])).rows[0].status,'requested');
  await assert.rejects(()=>approveDependency(repository,7,head,merged,'qa@webbing.invalid'),/changé/);assert.equal(dispatches,1);
  const api=async(path:string)=>path.includes('/actions/')?{workflow_runs:[]}:{...pr,merged:true,merge_commit_sha:merged};
  await reconcileApprovals(api,repository);
  const completed=(await query("SELECT status,merged_sha FROM ops_dependency_approvals WHERE repository=$1 AND base_sha=$2",[repository,base])).rows[0];assert.equal(completed.status,'merged');assert.equal(completed.merged_sha,merged);
  assert.equal((await query("SELECT count(*)::int AS count FROM ops_audit WHERE kind='dependance_validee' AND detail LIKE $1",[repository+'%'])).rows[0].count,1);
  await reconcileApprovals(api,repository);assert.equal((await query("SELECT count(*)::int AS count FROM ops_audit WHERE kind='dependance_validee' AND detail LIKE $1",[repository+'%'])).rows[0].count,1);
 }finally{
  fetch.mock.restore();
  await query('DELETE FROM ops_dependency_approvals WHERE repository=$1',[repository]);await query('DELETE FROM ops_dependency_updates WHERE repository=$1',[repository]);await query('DELETE FROM ops_repositories WHERE full_name=$1',[repository]);await query('DELETE FROM ops_integrations WHERE id=$1',[id]);await query('DELETE FROM ops_audit WHERE detail LIKE $1',[repository+'%']);await database().end();
 }
});
