import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { mock,test } from "node:test";
import { deploymentState,deploymentUrl,eventDate,validVercelSignature,vercelEventSchema } from "../src/lib/gestion/vercel-events";
import { seal,unseal } from "../src/lib/gestion/vault";
import { readGitHubRepositories,githubActorLogin } from "../src/lib/gestion/github";
import { readSupabaseProject } from "../src/lib/gestion/providers";

test("webhook authentication covers the exact bytes and rejects missing, forged or modified bodies",()=>{
  const body=Buffer.from('{"id":"evt_qa","name":"déploiement"}');const secret='fixture-signing-key';const signature=createHmac('sha1',secret).update(body).digest('hex');
  assert.equal(validVercelSignature(body,signature,secret),true);
  assert.equal(validVercelSignature(Buffer.concat([body,Buffer.from(' ')]),signature,secret),false);
  assert.equal(validVercelSignature(body,signature,'other-key'),false);
  assert.equal(validVercelSignature(body,'aa',secret),false);assert.equal(validVercelSignature(body,null,secret),false);
});
test("old and future webhook events cannot be replayed; deployment links stay on Vercel",()=>{
  const now=Date.now();assert.equal(eventDate(now,now).getTime(),now);
  assert.throws(()=>eventDate(now-8*86400_000,now));assert.throws(()=>eventDate(now+600_000,now));assert.throws(()=>eventDate('invalid',now));
  assert.equal(deploymentUrl('webbing-test.vercel.app'),'https://webbing-test.vercel.app/');
  assert.equal(deploymentUrl('https://webbing-test.vercel.app@attacker.invalid'),null);
  assert.equal(deploymentUrl('https://attacker.invalid'),null);
  assert.equal(deploymentState('deployment.error'),'ERROR');
  assert.equal(vercelEventSchema.safeParse({id:'evt',type:'project.env.created',createdAt:now,payload:{project:{id:'prj'}}}).success,false);
});
test("stored credentials are authenticated, randomized and bound to their integration",()=>{
  const previous=process.env.WEBBING_OPS_SECRET;process.env.WEBBING_OPS_SECRET='fixture-root-key-that-is-longer-than-forty-characters';
  try {
    const token='sbp_fc_private_fixture_never_store_in_plaintext';const context='integration-one:supabase';const encrypted=seal(token,context);
    assert.ok(!encrypted.includes(token));assert.equal(unseal(encrypted,context),token);assert.notEqual(seal(token,context),encrypted);
    assert.throws(()=>unseal(encrypted,'integration-two:supabase'));
    const parts=encrypted.split('.');const data=Buffer.from(parts[3],'base64url');data[0]^=1;parts[3]=data.toString('base64url');assert.throws(()=>unseal(parts.join('.'),context));
  } finally {if(previous===undefined)delete process.env.WEBBING_OPS_SECRET;else process.env.WEBBING_OPS_SECRET=previous;}
});
test("Supabase sync uses read-only endpoints, validates project identity and separates service failures",async()=>{
  const ref='abcdefghijklmnopqrst';const calls:string[]=[];
  const fetch=mock.method(globalThis,'fetch',async(input:unknown,options?:RequestInit)=>{
    const url=String(input);calls.push(url);assert.equal(options?.redirect,'error');assert.equal(options?.method,undefined);
    if(url.includes('/health?')){assert.equal(new URL(url).searchParams.has('timeout_ms'),false);return Response.json([{name:'auth',status:'ACTIVE_HEALTHY',healthy:true},{name:'rest',status:'UNHEALTHY',healthy:false}]);}
    return Response.json({id:ref,name:'Fixture',status:'ACTIVE_HEALTHY',region:'eu-central-2'});
  });
  try {
    const result=await readSupabaseProject('fixture-token',ref);assert.equal(result.services[1].status,'UNHEALTHY');assert.equal(calls.length,2);assert.ok(calls.every(c=>!c.includes('fixture-token')));
    fetch.mock.mockImplementation(async()=>Response.json({id:'differentprojectrefxx',name:'Wrong',status:'ACTIVE_HEALTHY'}));
    await assert.rejects(()=>readSupabaseProject('fixture-token',ref),/différent/);
    fetch.mock.mockImplementation(async()=>new Response(null,{status:403}));
    await assert.rejects(()=>readSupabaseProject('fixture-token',ref),/Accès refusé/);
    fetch.mock.mockImplementation(async(input:unknown)=>String(input).includes('/health?')?new Response(null,{status:503}):Response.json({id:ref,name:'Fixture',status:'ACTIVE_HEALTHY'}));
    const partial=await readSupabaseProject('fixture-token',ref);assert.equal(partial.project.status,'ACTIVE_HEALTHY');assert.deepEqual(partial.services,[]);assert.ok(partial.servicesError);
  } finally {fetch.mock.restore();}
});

test("GitHub synchronization keeps its credential out of queries and sanitizes provider failures",async()=>{
  const requests:string[]=[];
  const request=mock.method(globalThis,'fetch',async(input:unknown,options?:RequestInit)=>{
    requests.push(String(input));assert.equal(String(input),'https://api.github.com/graphql');assert.equal(options?.method,'POST');assert.equal(options?.redirect,'error');
    const body=JSON.parse(String(options?.body));assert.match(body.query,/Guillaumeperrottet/);assert.ok(!body.query.includes('github_pat_fixture'));
    return Response.json({data:{r0:{nameWithOwner:'Guillaumeperrottet/webbing'}}});
  });
  try{
    const data=await readGitHubRepositories('github_pat_fixture',['Guillaumeperrottet/webbing']);assert.ok(data.r0);assert.equal(requests.length,1);
    request.mock.mockImplementation(async()=>Response.json({errors:[{message:'private server detail'}]}));
    await assert.rejects(()=>readGitHubRepositories('github_pat_fixture',['Guillaumeperrottet/webbing']),error=>error instanceof Error&&/droits/.test(error.message)&&!error.message.includes('private server detail'));
    request.mock.mockImplementation(async()=>new Response(null,{status:401}));
    await assert.rejects(()=>readGitHubRepositories('github_pat_fixture',['Guillaumeperrottet/webbing']),/expiré ou révoqué/);
  }finally{request.mock.restore();}
});

test("GitHub GraphQL bot identities normalize to the REST form without elevating user identities",()=>{
  assert.equal(githubActorLogin({__typename:'Bot',login:'dependabot'}),'dependabot[bot]');
  assert.equal(githubActorLogin({__typename:'Bot',login:'github-actions'}),'github-actions[bot]');
  assert.equal(githubActorLogin({__typename:'User',login:'dependabot'}),'dependabot');
  assert.equal(githubActorLogin(null),null);
});
