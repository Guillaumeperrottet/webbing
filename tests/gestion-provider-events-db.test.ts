import assert from "node:assert/strict";
import { randomUUID,randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import test from "node:test";
const require=createRequire(import.meta.url);require('@next/env').loadEnvConfig(process.cwd());
test('provider events are idempotent and cannot replace the serving version with an older or failed deployment',{skip:process.env.WEBBING_OPS_DB_TEST!=='1'},async()=>{
  const {database}=await import('../src/lib/gestion/db');const{receiveVercelEvent}=await import('../src/lib/gestion/providers');const{seal}=await import('../src/lib/gestion/vault');
  const db=database(),integration=randomUUID(),nonce=randomUUID(),team='team_qa_'+nonce,project='prj_qa_'+nonce,name='qa-sync-'+nonce;
  await db.query("INSERT INTO ops_integrations(id,provider,name,secret_cipher,config,revoked_at) VALUES($1,'vercel',$2,$3,$4,now())",[integration,name,seal(randomBytes(32).toString('hex'),`${integration}:vercel`),JSON.stringify({teamId:team})]);
  const start=Date.now()-10_000;
  const event=(suffix:string,type:string,time:number,deployment:string)=>({id:'evt_qa_'+nonce+suffix,type,createdAt:time,payload:{team:{id:team},project:{id:project,name},target:'production',deployment:{id:deployment,name,url:'fixture.vercel.app',createdAt:start,meta:{githubCommitSha:'abc1234'}}}});
  try {
    const one=event('1','deployment.promoted',start+1000,'dpl_qa_live_'+nonce);await receiveVercelEvent(one,integration,team);
    assert.deepEqual(await receiveVercelEvent(one,integration,team),{duplicate:true});
    await receiveVercelEvent(event('2','deployment.error',start+2000,'dpl_qa_failed_'+nonce),integration,team);
    let app=(await db.query('SELECT id,current_deployment_id FROM ops_applications WHERE vercel_id=$1',[project])).rows[0];assert.equal(app.current_deployment_id,one.payload.deployment.id);
    await receiveVercelEvent(event('3','deployment.created',start,'dpl_qa_live_'+nonce),integration,team);
    assert.equal((await db.query('SELECT state FROM ops_deployments WHERE deployment_id=$1',[one.payload.deployment.id])).rows[0].state,'READY');
    const foreign=event('4','deployment.error',start+3000,'dpl_qa_foreign_'+nonce);foreign.payload.team.id='other-team';await assert.rejects(()=>receiveVercelEvent(foreign,integration,team));
    await receiveVercelEvent(event('5','deployment.promoted',start-500,'dpl_qa_older_'+nonce),integration,team);
    app=(await db.query('SELECT id,current_deployment_id FROM ops_applications WHERE vercel_id=$1',[project])).rows[0];assert.equal(app.current_deployment_id,one.payload.deployment.id);
  } finally {
    await db.query('DELETE FROM ops_provider_events WHERE integration_id=$1',[integration]);
    await db.query('DELETE FROM ops_deployments WHERE application_id IN (SELECT id FROM ops_applications WHERE vercel_id=$1)',[project]);
    await db.query('DELETE FROM ops_applications WHERE vercel_id=$1',[project]);
    await db.query('DELETE FROM ops_integrations WHERE id=$1',[integration]);
    await db.query('DELETE FROM ops_audit WHERE detail LIKE $1',['%'+name+'%']);
    await db.end();
  }
});
