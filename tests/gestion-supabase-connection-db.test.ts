import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { mock, test } from "node:test";
const require=createRequire(import.meta.url);
require('@next/env').loadEnvConfig(process.cwd());

test('reusing a Supabase credential updates one connection and preserves the union of selected projects',{skip:process.env.WEBBING_OPS_DB_TEST!=='1'},async()=>{
  const {database}=await import('../src/lib/gestion/db');
  const {connectSupabase}=await import('../src/lib/gestion/providers');
  const db=database(),name='qa-supabase-'+randomUUID(),token='sbp_fc'+randomBytes(24).toString('hex');
  const refs=Array.from({length:3},()=>randomBytes(10).toString('hex'));
  const fetch=mock.method(globalThis,'fetch',async(input:unknown)=>{
    const url=new URL(String(input));const ref=url.pathname.split('/').at(-1)!;
    assert.ok(refs.includes(ref),'fixture calls must not touch real projects');
    return Response.json({id:ref,name,status:'INACTIVE',region:'eu-central-2'});
  });
  try {
    const first=await connectSupabase(name,token,refs.slice(0,2));assert.equal(first.updated,false);
    const second=await connectSupabase(name,token,refs.slice(1));assert.equal(second.updated,true);
    const rows=(await db.query("SELECT id,config,secret_cipher FROM ops_integrations WHERE name=$1 AND revoked_at IS NULL",[name])).rows;
    assert.equal(rows.length,1);assert.deepEqual([...rows[0].config.refs].sort(),[...refs].sort());
    assert.ok(!rows[0].secret_cipher.includes(token));
    const projects=(await db.query("SELECT integration_id FROM ops_supabase_projects WHERE ref=ANY($1::text[])",[refs])).rows;
    assert.equal(projects.length,3);assert.ok(projects.every(p=>p.integration_id===rows[0].id));
    await Promise.all([connectSupabase(name,token,refs),connectSupabase(name,token,refs)]);
    assert.equal((await db.query("SELECT count(*)::int AS count FROM ops_integrations WHERE name=$1 AND revoked_at IS NULL",[name])).rows[0].count,1);
    const otherToken='sbp_fc'+randomBytes(24).toString('hex');
    await connectSupabase(name,otherToken,[refs[2]]);
    const assignments=(await db.query("SELECT integration_id,count(*)::int AS count FROM ops_supabase_projects WHERE ref=ANY($1::text[]) GROUP BY integration_id",[refs])).rows;
    assert.equal(assignments.length,2);
    assert.equal(assignments.find(p=>p.integration_id===rows[0].id)?.count,2,'a new credential only replaces the selected project binding');
  } finally {
    fetch.mock.restore();
    await db.query("DELETE FROM ops_supabase_projects WHERE ref=ANY($1::text[])",[refs]);
    await db.query("DELETE FROM ops_integrations WHERE name=$1",[name]);
    await db.query("DELETE FROM ops_audit WHERE detail LIKE $1",[name+'%']);
    await db.end();
  }
});
