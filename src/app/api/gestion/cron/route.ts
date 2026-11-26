import { probeApplications } from "@/lib/gestion/data";
import { tokensEqual } from "@/lib/gestion/security";
import { syncSupabase } from "@/lib/gestion/providers";
import { syncGitHub } from "@/lib/gestion/github";
import { query } from "@/lib/gestion/db";
import { recoverPublicationProtection } from "@/lib/gestion/releases";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET || process.env.WEBBING_OPS_CRON_SECRET;
  if (!secret || !tokensEqual(request.headers.get("authorization") || "", `Bearer ${secret}`)) return new Response(null, { status: 401 });
  const refreshGitHub=async()=>{
    const lock=await query("INSERT INTO ops_jobs(name,last_run) VALUES('github-cron',now()) ON CONFLICT(name) DO UPDATE SET last_run=now() WHERE ops_jobs.last_run<now()-interval '1 hour' RETURNING name");
    return lock.rowCount?syncGitHub():0;
  };
  const [health,providers,github,publications]=await Promise.allSettled([probeApplications(),syncSupabase(),refreshGitHub(),recoverPublicationProtection()]);
  return Response.json({ checked:health.status==='fulfilled'?health.value:0,supabaseChecked:providers.status==='fulfilled'?providers.value:0,githubChecked:github.status==='fulfilled'?github.value:0,publicationsChecked:publications.status==='fulfilled'?publications.value:0,partial:[health,providers,github,publications].some(result=>result.status==='rejected') }, { status:health.status==='rejected'?503:200, headers: { "Cache-Control": "no-store" } });
}
