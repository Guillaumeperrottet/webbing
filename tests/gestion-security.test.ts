import assert from "node:assert/strict";
import { createHash, createHmac, randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { after, test } from "node:test";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());
const base = "http://localhost:3108";
const email = "webbing-security-qa@webbing.invalid";
const password = "Webbing-QA-phrase-longue!2026";

function totp(secret: string) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = ""; for (const c of secret.replace(/=+$/, "")) bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  const bytes = Buffer.from(bits.match(/.{8}/g)!.map((b) => parseInt(b, 2)));
  const counter = Buffer.alloc(8); counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30_000)));
  const hash = createHmac("sha1", bytes).update(counter).digest(); const offset = hash[hash.length - 1] & 15;
  return String((hash.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, "0");
}
class Client {
  cookies = new Map<string,string>();
  async action(name:string) {
    const manifest=JSON.parse(readFileSync(".next/server/server-reference-manifest.json","utf8"));
    const entry=Object.entries(manifest.node as Record<string,{exportedName:string}>).find(([,v])=>v.exportedName===name);
    assert.ok(entry, `Server action ${name} is present in the production build`);
    const form=new FormData();form.set(`$ACTION_ID_${entry[0]}`,"");
    form.set("repository","Guillaumeperrottet/webbing");form.set("number","0");
    return fetch(base+"/gestion",{method:"POST",redirect:"manual",headers:{origin:base,cookie:[...this.cookies].map(([k,v])=>`${k}=${v}`).join("; ")},body:form});
  }
  async send(path: string, body?: unknown, origin = base) {
    const response = await fetch(base + path, { method: body === undefined ? "GET" : "POST", redirect: "manual", headers: { origin, "Content-Type": "application/json", cookie: [...this.cookies].map(([k,v]) => `${k}=${v}`).join("; ") }, body: body === undefined ? undefined : JSON.stringify(body) });
    for (const value of response.headers.getSetCookie()) {
      const item = value.split(";",1)[0]; const i = item.indexOf("="); this.cookies.set(item.slice(0,i), item.slice(i+1));
    }
    return response;
  }
}
let userId: string | undefined;
let invitationId: string | undefined;

after(async () => {
  const { database } = await import("../src/lib/gestion/db");
  if (process.env.WEBBING_OPS_QA_KEEP !== "1") {
    if (userId) await database().query('DELETE FROM "user" WHERE id=$1 AND email=$2', [userId, email]);
    if (invitationId) await database().query("DELETE FROM ops_invitations WHERE id=$1 AND email=$2", [invitationId,email]);
    await database().query("DELETE FROM ops_audit WHERE detail=$1", [email]);
  }
  await database().end();
});

test("private access enforces invitation, two factors, per-session verification and logout", async () => {
  const { database } = await import("../src/lib/gestion/db");
  const anonymous = new Client();
  const redirect = await anonymous.send("/gestion");
  assert.equal(redirect.status, 307); assert.equal(redirect.headers.get("location"), "/gestion/connexion");
  assert.equal((await anonymous.send("/gestion?vue=dependances")).headers.get("location"),"/gestion/connexion");
  for(const action of ["addGitHubConnection","approveDependencyUpdate","launchDependencyTests","refreshDependencies","disconnectGitHub"]){
    const response=await anonymous.action(action);assert.equal(response.status,303);assert.equal(response.headers.get("location"),"/gestion/connexion");await response.text();
  }
  const login = await anonymous.send("/gestion/connexion"); const loginHtml = await login.text();
  assert.equal(login.status,200); assert.match(login.headers.get("x-robots-tag") || "",/noindex/);
  assert.doesNotMatch(loginHtml,/googletagmanager|G-E7P0FVYQSZ|\/insights\/script/);
  assert.equal((await anonymous.send("/api/gestion/agent")).status,401);
  assert.equal((await anonymous.send("/api/gestion/cron")).status,401);
  assert.equal((await anonymous.send("/api/gestion/collecte",{backups:[]})).status,401);
  assert.equal((await anonymous.send("/api/gestion/auth/sign-up/email",{email,password,name:"Test"})).status,404);
  assert.equal((await anonymous.send("/api/gestion/activation",{token:"x".repeat(43),password},"https://untrusted.invalid")).status,403);
  const token = randomBytes(32).toString("base64url");
  const inserted = await database().query("INSERT INTO ops_invitations(token_hash,email,expires_at) VALUES($1,$2,now()+interval '10 minutes') RETURNING id", [createHash("sha256").update(token).digest("hex"),email]); invitationId=inserted.rows[0].id;
  const client = new Client();
  const created = await client.send("/api/gestion/activation",{token,password});
  const data = await created.json(); assert.equal(created.status,200,JSON.stringify(data)); userId=data.user.id;
  assert.equal((await anonymous.send("/api/gestion/activation",{token,password})).status,400,"invitation is one-use");
  assert.equal((await client.send("/gestion")).headers.get("location"),"/gestion/securite");
  assert.equal((await client.send("/api/gestion/agent")).status,401,"password alone grants no data");
  const blockedApproval=await client.action("approveDependencyUpdate");
  assert.equal(blockedApproval.status,303);assert.equal(blockedApproval.headers.get("location"),"/gestion/securite");await blockedApproval.text();
  const blockedTests=await client.action("launchDependencyTests");
  assert.equal(blockedTests.status,303);assert.equal(blockedTests.headers.get("location"),"/gestion/securite");await blockedTests.text();
  const stale = new Client();
  assert.equal((await stale.send("/api/gestion/auth/sign-in/email",{email,password})).status,200);
  const enabled = await client.send("/api/gestion/auth/two-factor/enable",{password,method:"totp"});
  const setup = await enabled.json(); assert.equal(enabled.status,200,JSON.stringify(setup));
  const secret = new URL(setup.totpURI).searchParams.get("secret")!;
  const wrong = await client.send("/api/gestion/auth/two-factor/verify-totp",{code:totp(secret)==="000000"?"111111":"000000"});
  assert.equal(wrong.status,401); assert.notEqual((await client.send("/gestion")).status,200);
  const verified = await client.send("/api/gestion/auth/two-factor/verify-totp",{code:totp(secret),trustDevice:false});
  assert.equal(verified.status,200,await verified.text());
  const dashboard = await client.send("/gestion"); assert.equal(dashboard.status,200);
  const html = await dashboard.text(); assert.match(html,/Vue d’ensemble/); assert.match(html,/selfkey/);
  assert.doesNotMatch(html,/googletagmanager|G-E7P0FVYQSZ|\/insights\/script/);
  const dependencies=await client.send("/gestion?vue=dependances");assert.equal(dependencies.status,200);assert.match(await dependencies.text(),/Configuration des dépôts/);
  assert.notEqual((await stale.send("/gestion")).status,200,"old password-only session stays unverified after enrollment");
  assert.equal((await stale.send("/api/gestion/agent")).status,401);
  assert.equal((await client.send("/api/gestion/auth/two-factor/disable",{password})).status,404);
  assert.equal((await client.send("/api/gestion/agent")).status,200);
  await client.send("/api/gestion/auth/sign-out",{});
  assert.equal((await client.send("/api/gestion/agent")).status,401,"logout revokes access");
  const again=await client.send("/api/gestion/auth/sign-in/email",{email,password}); const againBody=await again.json();
  assert.equal(againBody.twoFactorRedirect,true); assert.equal((await client.send("/api/gestion/agent")).status,401);
  const recovery=await client.send("/api/gestion/auth/two-factor/verify-backup-code",{code:setup.backupCodes[0],trustDevice:false});
  assert.equal(recovery.status,200,await recovery.text()); assert.equal((await client.send("/api/gestion/agent")).status,200);
  await client.send("/api/gestion/auth/sign-out",{});
  if (process.env.WEBBING_OPS_QA_KEEP === "1") {
    writeFileSync(".vercel/gestion-qa.json",JSON.stringify({email,password,secret,userId,invitationId}),{mode:0o600});
  }
});
