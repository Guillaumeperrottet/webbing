import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, chmodSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { classifyHttp, tokensEqual } from "../src/lib/gestion/security";

test("HTTP status distinguishes protected applications from outages", () => {
  assert.equal(classifyHttp(200),"disponible"); assert.equal(classifyHttp(308),"redirection");
  assert.equal(classifyHttp(401),"protege"); assert.equal(classifyHttp(403),"protege"); assert.equal(classifyHttp(500),"incident");
  assert.equal(tokensEqual("one","one"),true); assert.equal(tokensEqual("one","two"),false);
});
test("NAS agent reports backup metadata without reading or uploading file contents", () => {
  const folder=mkdtempSync(path.join(tmpdir(),"webbing-nas-"));
  try {
    const backups=path.join(folder,"backups");mkdirSync(backups);
    writeFileSync(path.join(backups,"database.dump"),"PRIVATE_DATABASE_CONTENT_NEVER_UPLOAD");
    writeFileSync(path.join(backups,"incomplete.sql"),"");
    const config=path.join(folder,"config.json");writeFileSync(config,JSON.stringify({endpoint:"https://www.webbing.ch/api/gestion/collecte",token:"test-only",backups:[{application:"selfkey",directory:backups,maxAgeHours:24}]}));chmodSync(config,0o600);
    const output=execFileSync("python3",["scripts/gestion/synology-agent.py","--config",config,"--dry-run"],{encoding:"utf8"});
    const result=JSON.parse(output);assert.equal(result.backups[0].state,"ok");assert.equal(result.backups[0].bytes,37);assert.doesNotMatch(output,/PRIVATE_DATABASE_CONTENT/);
    chmodSync(config,0o644);assert.throws(()=>execFileSync("python3",["scripts/gestion/synology-agent.py","--config",config,"--dry-run"],{stdio:"pipe"}));
  } finally {rmSync(folder,{recursive:true,force:true});}
});
