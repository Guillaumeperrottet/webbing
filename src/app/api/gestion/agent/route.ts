import { readFile } from "node:fs/promises";
import path from "node:path";
import { access } from "@/lib/gestion/access";
export const runtime = "nodejs";
export async function GET() {
  if (!(await access()).verified) return new Response(null, { status: 401 });
  return new Response(await readFile(path.join(process.cwd(), "scripts/gestion/synology-agent.py"), "utf8"), {
    headers: { "Content-Type": "text/x-python; charset=utf-8", "Content-Disposition": 'attachment; filename="webbing-synology.py"', "Cache-Control": "private, no-store" },
  });
}
