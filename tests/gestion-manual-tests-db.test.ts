import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
import {mock,test} from 'node:test';
const require=createRequire(import.meta.url);require('@next/env').loadEnvConfig(process.cwd());
test('concurrent manual clicks start one run; completion never merges a proposal',{skip:process.env.WEBBING_OPS_DB_TEST!=='1'},async()=>{
 const {query,database}=await import('../src/lib/gestion/db');const {seal}=await import('../src/lib/gestion/vault');
 const {requestDependencyTests,reconcileDependencyTests}=await import('../src/lib/gestion/github');
 const id=randomUUID(),repository=`fixture-owner/manual-tests-${randomUUID()}`,head='a'.repeat(40),base='b'.repeat(40),merge='c'.repeat(40);let dispatches=0,requestId='';
 const pr={state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha:head,ref:'dependabot/npm/next',repo:{full_name:repository}},base:{ref:'main',repo:{full_name:repository}},changed_files:1};
 const fetch=mock.method(globalThis,'fetch',async(input:unknown,options?:RequestInit)=>{
  const url=new URL(String(input));assert.equal(url.origin,'https://api.github.com');assert.ok(url.pathname.startsWith(`/repos/${repository}`));assert.ok(!url.pathname.endsWith('/merge')&&!url.pathname.includes('/check-runs'));
  if(options?.method==='POST'){dispatches++;assert.ok(url.pathname.endsWith('/webbing-dependency-checks.yml/dispatches'));const body=JSON.parse(String(options.body));assert.equal(body.inputs.approve_manual,undefined);requestId=body.inputs.request_id;return new Response(null,{status:204});}
  if(url.pathname.endsWith('/pulls/7'))return Response.json(pr);
  if(url.pathname.endsWith('/git/ref/heads/main'))return Response.json({object:{sha:base}});
  if(url.pathname.endsWith('/files'))return Response.json([{filename:'package.json'}]);
  if(url.pathname.includes('/commits/refs%2Fpull%2F'))return Response.json({sha:merge,parents:[{sha:base},{sha:head}]});
  if(url.pathname===`/repos/${repository}`)return Response.json({default_branch:'main'});
  throw new Error('Unexpected fixture request.');
 });
 try{
  await query("INSERT INTO ops_integrations(id,provider,name,secret_cipher,config) VALUES($1,'github',$2,$3,'{}')",[id,repository,seal('github_pat_fixture_not_a_real_credential',`${id}:github`)]);
  await query("INSERT INTO ops_repositories(full_name,default_branch,integration_id) VALUES($1,'main',$2)",[repository,id]);
  const result=await Promise.all([requestDependencyTests(repository,7,head,base,'qa@webbing.invalid'),requestDependencyTests(repository,7,head,base,'qa@webbing.invalid')]);
  assert.equal(result.length,2);assert.equal(dispatches,1);
  await assert.rejects(()=>requestDependencyTests(repository,8,head,base,'qa@webbing.invalid'),/déjà en cours/);assert.equal(dispatches,1);
  const refreshed='d'.repeat(40),runUrl='https://github.com/fixture/actions/runs/1';
  await reconcileDependencyTests(async(path:string)=>{
   if(path.includes('/actions/'))return {workflow_runs:[{display_title:`Webbing tests ${requestId} · #7`,status:'completed',conclusion:'success',html_url:runUrl}]};
   if(path.endsWith('/pulls/7'))return {...pr,head:{...pr.head,sha:refreshed}};
   if(path.includes('/statuses?'))return [{context:'Webbing / Base testée',state:'success',description:`base:${base}`,target_url:runUrl,creator:{login:'github-actions[bot]'}}];
   throw new Error(path);
  },repository);
  const completed=(await query('SELECT status,head_sha FROM ops_dependency_tests WHERE repository=$1',[repository])).rows[0];
  assert.equal(completed.status,'success');assert.equal(completed.head_sha,refreshed);
  assert.equal((await query('SELECT count(*)::int AS n FROM ops_dependency_approvals WHERE repository=$1',[repository])).rows[0].n,0);
 }finally{
  fetch.mock.restore();await query('DELETE FROM ops_dependency_tests WHERE repository=$1',[repository]);await query('DELETE FROM ops_repositories WHERE full_name=$1',[repository]);await query('DELETE FROM ops_integrations WHERE id=$1',[id]);await query('DELETE FROM ops_audit WHERE detail LIKE $1',[repository+'%']);await database().end();
 }
});
