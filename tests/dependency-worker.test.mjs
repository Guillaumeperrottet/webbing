import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
const worker=new URL('../.github/actions/dependency-policy/index.mjs',import.meta.url).href;
function run({type='minor',manual=false,failed=false,stale=false,enabled=true}){
 const directory=mkdtempSync(path.join(tmpdir(),'webbing-worker-test-'));
 const head='a'.repeat(40),base='b'.repeat(40),other='c'.repeat(40),repository='fixture-owner/repository';
 const pr={number:7,state:'open',draft:false,user:{login:'dependabot[bot]',type:'Bot'},head:{sha:head,ref:'dependabot/npm/next',repo:{full_name:repository}},base:{ref:'main',repo:{full_name:repository}},commits:1,changed_files:1,mergeable:true};
 const commit={author:{login:'dependabot[bot]',type:'Bot'},commit:{verification:{verified:true},message:`Update\n\n---\nupdated-dependencies:\n- dependency-name: next\n  dependency-version: 16.0.0\n  update-type: version-update:semver-${type}\n...\n`}};
 const event=manual?{inputs:{pull_request:'7',approve_manual:'true',expected_head:head,expected_base:stale?other:base,approval_id:randomUUID()}}:{};
 const eventPath=path.join(directory,'event.json'),summary=path.join(directory,'summary.md'),callsPath=path.join(directory,'calls.json');
 writeFileSync(eventPath,JSON.stringify(event),{mode:0o600});
 const script=`import fs from 'node:fs';
 const pr=${JSON.stringify(pr)},commit=${JSON.stringify(commit)},head=${JSON.stringify(head)},base=${JSON.stringify(base)},failed=${failed};
 const calls=[];globalThis.fetch=async(input,options)=>{
  const url=new URL(String(input));if(url.origin!=='https://api.github.com')throw new Error('Unexpected network destination');
  const request={path:url.pathname+url.search,method:options.method,body:options.body?JSON.parse(options.body):null};calls.push(request);
  if(request.method==='PUT'&&url.pathname.endsWith('/merge'))return Response.json({merged:true,sha:'d'.repeat(40)});
  if(request.method==='POST'&&url.pathname.includes('/statuses/'))return Response.json({state:request.body.state},{status:201});
  if(url.pathname.endsWith('/pulls/7'))return Response.json(pr);
  if(url.pathname.endsWith('/pulls'))return Response.json([pr]);
  if(url.pathname.endsWith('/pulls/7/commits'))return Response.json([commit]);
  if(url.pathname.endsWith('/pulls/7/files'))return Response.json([{filename:'package.json'}]);
  if(url.pathname.endsWith('/check-runs'))return Response.json({total_count:2,check_runs:[{id:1,name:'Webbing / Quality',status:'completed',conclusion:failed?'failure':'success',app:{id:15368,slug:'github-actions'}},{id:2,name:'Webbing / Dependency policy',status:'in_progress',conclusion:null,app:{id:15368,slug:'github-actions'}}]});
  if(url.pathname.endsWith('/statuses'))return Response.json([{context:'Webbing / Base testée',state:'success',description:'base:'+base,creator:{login:'github-actions[bot]'}},{context:'Vercel',state:'success',creator:{login:'vercel[bot]'}}]);
  if(url.pathname.includes('/git/ref/'))return Response.json({object:{sha:base}});
  if(url.pathname==='/repos/fixture-owner/repository')return Response.json({default_branch:'main'});
  throw new Error('Unexpected fixture request: '+request.path);
 };await import(${JSON.stringify(worker)});fs.writeFileSync(${JSON.stringify(callsPath)},JSON.stringify(calls));`;
 try{
  const execution=spawnSync(process.execPath,['--input-type=module','-e',script],{env:{PATH:process.env.PATH,INPUT_TOKEN:'fixture-only',INPUT_ENABLED:String(enabled),GITHUB_REPOSITORY:repository,GITHUB_EVENT_PATH:eventPath,GITHUB_EVENT_NAME:manual?'workflow_dispatch':'workflow_run',GITHUB_STEP_SUMMARY:summary,GITHUB_SERVER_URL:'https://github.com',GITHUB_RUN_ID:'123'},encoding:'utf8'});
  assert.ok(!execution.error,execution.error?.message);assert.ok(execution.status!==null,execution.stderr);
  return {status:execution.status,calls:JSON.parse(readFileSync(callsPath,'utf8')),head,base};
 }finally{rmSync(directory,{recursive:true,force:true});}
}
test('the real worker distinguishes automatic minor updates from explicit major approval',()=>{
 const small=run({});assert.equal(small.status,0);const merge=small.calls.find(c=>c.method==='PUT');assert.equal(merge.body.sha,small.head);assert.equal(merge.body.merge_method,'squash');
 const major=run({type:'major'});assert.equal(major.status,0);assert.ok(!major.calls.some(c=>c.method==='PUT'));
 const approved=run({type:'major',manual:true,enabled:false});assert.equal(approved.status,0);assert.equal(approved.calls.filter(c=>c.method==='PUT').length,1);
 const gate=approved.calls.find(c=>c.method==='POST');assert.equal(gate.body.context,'Webbing / Validation');assert.equal(gate.body.state,'success');assert.equal(gate.body.description,'base:'+approved.base);
});
test('the real worker refuses a manual merge after failed checks or a changed approval binding',()=>{
 for(const options of [{manual:true,failed:true},{manual:true,stale:true}]){const result=run(options);assert.equal(result.status,1);assert.ok(!result.calls.some(c=>c.method==='PUT'));}
 const paused=run({enabled:false});assert.equal(paused.status,0);assert.ok(!paused.calls.some(c=>c.method==='PUT'));
});
