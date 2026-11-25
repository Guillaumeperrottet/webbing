import { createRequire } from "node:module";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

async function main() {
  const { database } = await import("../../src/lib/gestion/db");
  const team = process.env.WEBBING_VERCEL_TEAM || "team_HMC6tPegXy4EJfpqbNRboiB3";
  const raw = execFileSync("vercel", ["api", "/v9/projects?limit=100", "--scope", team, "--raw"], { encoding: "utf8", maxBuffer: 12_000_000 });
  const projects = JSON.parse(raw).projects;
  if (!Array.isArray(projects)) throw new Error("Inventaire Vercel invalide.");
  const root = process.env.WEBBING_CODE_ROOT || path.join(process.env.HOME!, "code/Guillaumeperrottet");
  const chat = path.join(process.env.HOME!, "Documents/ChatGPT");
  const dirs = [root, chat].flatMap((base) => existsSync(base) ? readdirSync(base, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith(".") && e.name !== "Sauvegardes versions").map((e) => path.join(base, e.name)) : []);
  dirs.push(path.join(root, "selfkey/apps/camping"), path.join(root, "campus-gerance/portal"), path.join(chat, "Timbrage d'heures 2/application"));
  type LocalPackage = { dependencies?: Record<string,string>; devDependencies?: Record<string,string>; scripts?: Record<string,string> };
  const locals = new Map<string, { dir: string; pkg: LocalPackage; config: { crons?: { path: string; schedule: string }[] } }>();
  for (const dir of dirs) {
    if (!existsSync(path.join(dir, "package.json"))) continue;
    const pkg = JSON.parse(readFileSync(path.join(dir, "package.json"), "utf8"));
    const config = existsSync(path.join(dir, "vercel.json")) ? JSON.parse(readFileSync(path.join(dir, "vercel.json"), "utf8")) : {};
    const local = { dir, pkg, config };
    locals.set(path.basename(dir), local);
    if (existsSync(path.join(dir, ".vercel/project.json"))) {
      const link = JSON.parse(readFileSync(path.join(dir, ".vercel/project.json"), "utf8"));
      locals.set(link.projectId, local);
      if (link.projectName) locals.set(link.projectName, local);
    }
  }
  const aliases: Record<string,string> = { "popliving-v2": "popliving_v2", "webbing": "webbing-ch", "mypapers": "plannikeeper", "selfcamp-camping-staging": "camping" };
  const refs: Record<string,string> = { "campus-appart": "hlmdzlyyloocqaaekpjy", "campus-gerance": "lpgwmwfzbjxytbajzews", "campus-gerance-portal": "lpgwmwfzbjxytbajzews", "coachingbymarie": "oksyrtxfqknmpfqdbsqg", "selfkey-staging": "capikoltigfflnnicmws", "pattushotel": "jzqbyszvsvmigtmcmcqq", "pattushotel-staging": "jzqbyszvsvmigtmcmcqq", "openwind": "fnndeoqzqfxpznhcundq", "openwind-staging": "fvgntgbhaxlsgxmnjeem", "touille": "oktwwjqypcbwhbczycsw", "mypapers": "hkmygixmrzaypvekubpd", "tempo-timbrage-staging": "fvjfzatqvnidhzhdodho", "selfcamp-camping-staging": "ubjmilqnnbvvvtwzaepb" };
  const urls: Record<string,string> = { "wisp": "https://www.wisp.ch", "openwind": "https://www.openwind.ch" };
  for (const project of projects) {
    const local = locals.get(project.id) || locals.get(project.name) || locals.get(aliases[project.name]);
    const deps = { ...local?.pkg.devDependencies, ...local?.pkg.dependencies };
    const target = project.targets?.production;
    const alias = target?.alias?.find((a: string) => !a.endsWith(".vercel.app")) || target?.alias?.[0];
    const url = urls[project.name] || (alias ? `https://${alias}` : target?.url ? `https://${target.url}` : null);
    let hasAdmin = false;
    if (local) hasAdmin = ["src/app/admin", "app/admin"].some((s) => existsSync(path.join(local.dir, s)));
    const bot = local ? [".github/dependabot.yml", ".github/dependabot.yaml", "renovate.json", "renovate.json5", ".github/renovate.json"].some((s) => existsSync(path.join(local.dir, s))) : false;
    const repository = project.link?.repo ? `https://github.com/${project.link.org}/${project.link.repo}` : null;
    const values = [project.name, project.name.replace(/-staging$/, ""), project.name.includes("staging") ? "staging" : "production", url, hasAdmin && url ? `${url}/admin` : null, project.id, refs[project.name] || null, repository, deps.next ? `Next.js ${deps.next}` : project.framework, deps.react || null, project.nodeVersion, bot, local?.config.crons?.length || 0, Object.keys(local?.pkg.scripts || {}).filter((s) => s.startsWith("test")).length];
    await database().query(`INSERT INTO ops_applications(slug,name,environment,url,admin_url,vercel_id,supabase_ref,repository,framework,react_version,node_version,dependency_bot,cron_count,test_count)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT(slug) DO UPDATE SET name=excluded.name,environment=excluded.environment,url=excluded.url,admin_url=excluded.admin_url,vercel_id=excluded.vercel_id,supabase_ref=excluded.supabase_ref,repository=excluded.repository,framework=excluded.framework,react_version=excluded.react_version,node_version=excluded.node_version,dependency_bot=excluded.dependency_bot,cron_count=excluded.cron_count,test_count=excluded.test_count,inventory_at=now()`, values);
  }
  await database().query("INSERT INTO ops_audit(kind,detail) VALUES('inventaire',$1)", [`${projects.length} projets Vercel importés`]);
  console.log(`${projects.length} projets réels importés, sans secret ni contenu des bases.`);
  await database().end();
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
