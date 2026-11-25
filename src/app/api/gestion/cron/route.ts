import { probeApplications } from "@/lib/gestion/data";
import { tokensEqual } from "@/lib/gestion/security";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET || process.env.WEBBING_OPS_CRON_SECRET;
  if (!secret || !tokensEqual(request.headers.get("authorization") || "", `Bearer ${secret}`)) return new Response(null, { status: 401 });
  return Response.json({ checked: await probeApplications() }, { headers: { "Cache-Control": "no-store" } });
}
