import "server-only";
import { query } from "./db";
import { classifyHttp } from "./security";

export type Application = {
  id: string; name: string; slug: string; environment: string; url: string | null; admin_url: string | null;
  vercel_id: string | null; supabase_ref: string | null; repository: string | null;
  framework: string | null; react_version: string | null; node_version: string | null;
  dependency_bot: boolean; cron_count: number; test_count: number; inventory_at: string;
  health_state: string | null; health_code: number | null; health_ms: number | null; health_at: string | null;
  backup_at: string | null; backup_bytes: string | null; backup_state: string | null; backup_max_hours: number | null; backup_reported_at: string | null;
};
export async function applications() {
  return (await query<Application>(`SELECT a.*,
    h.state AS health_state,h.http_code AS health_code,h.duration_ms AS health_ms,h.checked_at AS health_at,
    b.backup_at,b.bytes AS backup_bytes,b.state AS backup_state,b.max_age_hours AS backup_max_hours,b.reported_at AS backup_reported_at
    FROM ops_applications a
    LEFT JOIN LATERAL (SELECT * FROM ops_health WHERE application_id=a.id ORDER BY checked_at DESC LIMIT 1) h ON true
    LEFT JOIN LATERAL (SELECT * FROM ops_backups WHERE application_id=a.id ORDER BY reported_at DESC LIMIT 1) b ON true
    ORDER BY a.environment,a.name`)).rows;
}
export async function overview() {
  const [apps, collectors, audit] = await Promise.all([
    applications(), query("SELECT id,name,last_seen,created_at FROM ops_collectors WHERE revoked_at IS NULL ORDER BY created_at DESC"),
    query("SELECT id,kind,detail,created_at FROM ops_audit ORDER BY created_at DESC LIMIT 15"),
  ]);
  return { apps, collectors: collectors.rows, audit: audit.rows };
}

export async function probeApplications() {
  const apps = (await query<{ id: string; url: string }>("SELECT id,url FROM ops_applications WHERE url IS NOT NULL ORDER BY name")).rows;
  for (let i = 0; i < apps.length; i += 6) {
    await Promise.all(apps.slice(i, i + 6).map(async (app) => {
      const started = performance.now(); let state = "incident"; let code: number | null = null;
      try {
        let url = new URL(app.url);
        if (url.protocol !== "https:" || url.username || url.password || url.port) throw new Error("URL interdite");
        const host = url.hostname.replace(/^www\./, "");
        const signal = AbortSignal.timeout(7000);
        for (let hop = 0; hop < 5; hop++) {
          const response = await fetch(url, { method: "HEAD", redirect: "manual", signal, cache: "no-store", headers: { "User-Agent": "WebbingHealth/1.0" } });
          code = response.status; state = classifyHttp(code);
          const location = response.headers.get("location");
          await response.body?.cancel();
          if (state !== "redirection" || !location) break;
          const next = new URL(location, url);
          if (next.hostname === "vercel.com" || next.hostname.endsWith(".vercel.com")) { state = "protege"; break; }
          if (next.protocol !== "https:" || next.port || next.username || next.password || next.hostname.replace(/^www\./, "") !== host) break;
          url = next;
        }
      } catch { state = "injoignable"; }
      await query("INSERT INTO ops_health(application_id,state,http_code,duration_ms) VALUES($1,$2,$3,$4)", [app.id, state, code, Math.round(performance.now() - started)]);
    }));
  }
  await query("DELETE FROM ops_health WHERE checked_at < now()-interval '30 days'");
  await query("DELETE FROM ops_audit WHERE created_at < now()-interval '90 days'");
  return apps.length;
}
