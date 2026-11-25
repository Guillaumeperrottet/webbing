import { auth } from "@/lib/gestion/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const allowed = new Set(["sign-in/email", "sign-out", "get-session", "two-factor/enable", "two-factor/verify-totp", "two-factor/verify-backup-code"]);
async function handle(request: Request, context: { params: Promise<{ all: string[] }> }) {
  const path = (await context.params).all.join("/");
  if (!allowed.has(path)) return Response.json({ error: "Cette opération n’est pas disponible." }, { status: 404 });
  const response = await auth().handler(request);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}
export const GET = handle;
export const POST = handle;
