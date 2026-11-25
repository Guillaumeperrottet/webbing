import { query } from "@/lib/gestion/db";
import { tokenHash } from "@/lib/gestion/security";
import { z } from "zod";

export const runtime = "nodejs";
const report = z.object({ backups: z.array(z.object({ application: z.string().min(1).max(80), state: z.enum(["ok", "erreur", "absent"]), backupAt: z.iso.datetime().nullable(), bytes: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).nullable(), maxAgeHours: z.number().int().min(1).max(8760), restoreTestedAt: z.iso.datetime().nullable().optional() })).max(100) });
export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9_-]{40,128})$/)?.[1];
  if (!token) return Response.json({ error: "Authentification requise." }, { status: 401 });
  const collector = await query("SELECT id FROM ops_collectors WHERE token_hash=$1 AND revoked_at IS NULL", [tokenHash(token)]);
  if (collector.rowCount !== 1) return new Response(null, { status: 401 });
  const reserved = await query("UPDATE ops_collectors SET last_seen=now() WHERE id=$1 AND (last_seen IS NULL OR last_seen < now()-interval '45 seconds') RETURNING id", [collector.rows[0].id]);
  if (!reserved.rowCount) return new Response(null, { status: 429 });
  if (Number(request.headers.get("content-length")) > 64000) return new Response(null, { status: 413 });
  const raw = await request.text();
  if (raw.length > 64000) return new Response(null, { status: 413 });
  let json: unknown; try { json = JSON.parse(raw); } catch { return new Response(null, { status: 400 }); }
  const parsed = report.safeParse(json);
  if (!parsed.success) return Response.json({ error: "Rapport invalide." }, { status: 400 });
  const client = await (await import("@/lib/gestion/db")).database().connect();
  try {
    await client.query("BEGIN");
    for (const b of parsed.data.backups) {
      if (b.backupAt && new Date(b.backupAt).getTime() > Date.now() + 300_000) throw new Error("Date future");
      const app = await client.query("SELECT id FROM ops_applications WHERE slug=$1", [b.application]);
      if (!app.rowCount) throw new Error("Application inconnue");
      await client.query("INSERT INTO ops_backups(application_id,collector_id,state,backup_at,bytes,max_age_hours,restore_tested_at) VALUES($1,$2,$3,$4,$5,$6,$7)", [app.rows[0].id, collector.rows[0].id, b.state, b.backupAt, b.bytes, b.maxAgeHours, b.restoreTestedAt || null]);
    }
    await client.query("INSERT INTO ops_audit(kind,detail) VALUES('rapport_sauvegardes',$1)", [`${parsed.data.backups.length} application(s)`]);
    await client.query("COMMIT");
  } catch {
    await client.query("ROLLBACK"); return Response.json({ error: "Rapport refusé." }, { status: 400 });
  } finally { client.release(); }
  return Response.json({ received: parsed.data.backups.length }, { headers: { "Cache-Control": "no-store" } });
}
