import { probeApplications } from "@/lib/gestion/data";
import { tokensEqual } from "@/lib/gestion/security";
import { syncSupabase } from "@/lib/gestion/providers";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET || process.env.WEBBING_OPS_CRON_SECRET;
  if (!secret || !tokensEqual(request.headers.get("authorization") || "", `Bearer ${secret}`)) return new Response(null, { status: 401 });
  const [health,providers]=await Promise.allSettled([probeApplications(),syncSupabase()]);
  return Response.json({ checked:health.status==='fulfilled'?health.value:0,supabaseChecked:providers.status==='fulfilled'?providers.value:0,partial:health.status==='rejected'||providers.status==='rejected' }, { status:health.status==='rejected'?503:200, headers: { "Cache-Control": "no-store" } });
}
