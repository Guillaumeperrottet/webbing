import { probeApplications } from "@/lib/gestion/data";
import { tokensEqual } from "@/lib/gestion/security";
import { syncSupabase } from "@/lib/gestion/providers";
import { syncGitHub } from "@/lib/gestion/github";
export const runtime = "nodejs";
export const maxDuration = 120;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET || process.env.WEBBING_OPS_CRON_SECRET;
  if (!secret || !tokensEqual(request.headers.get("authorization") || "", `Bearer ${secret}`)) return new Response(null, { status: 401 });
  const [health,providers,github]=await Promise.allSettled([probeApplications(),syncSupabase(),syncGitHub()]);
  return Response.json({ checked:health.status==='fulfilled'?health.value:0,supabaseChecked:providers.status==='fulfilled'?providers.value:0,githubChecked:github.status==='fulfilled'?github.value:0,partial:github.status==='rejected'||health.status==='rejected'||providers.status==='rejected' }, { status:health.status==='rejected'?503:200, headers: { "Cache-Control": "no-store" } });
}
