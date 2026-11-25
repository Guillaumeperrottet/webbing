import { auth, adminEmail } from "@/lib/gestion/auth";
import { database, query } from "@/lib/gestion/db";
import { tokenHash, validOrigin } from "@/lib/gestion/security";
import { z } from "zod";

export const runtime = "nodejs";
const input = z.object({ token: z.string().min(40).max(128), password: z.string().min(14).max(128) });
export async function POST(request: Request) {
  if (!validOrigin(request)) return Response.json({ error: "Requête refusée." }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 4096) return new Response(null, { status: 413 });
  const body = input.safeParse(await request.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Choisis un mot de passe d’au moins 14 caractères." }, { status: 400 });
  const lock = await database().connect();
  let acquired = false;
  try {
    acquired = (await lock.query("SELECT pg_try_advisory_lock(726394,1) AS locked")).rows[0].locked;
    if (!acquired) return Response.json({ error: "Une activation est déjà en cours." }, { status: 429 });
    const invite = await query("SELECT id FROM ops_invitations WHERE token_hash=$1 AND email=$2 AND consumed_at IS NULL AND expires_at>now()", [tokenHash(body.data.token), adminEmail()]);
    if (invite.rowCount !== 1) return Response.json({ error: "Ce lien a expiré ou a déjà été utilisé." }, { status: 400 });
    const users = await query('SELECT id FROM "user" WHERE email=$1', [adminEmail()]);
    if (users.rowCount) return Response.json({ error: "Le compte est déjà activé. Connecte-toi." }, { status: 409 });
    const response = await auth().api.signUpEmail({ body: { email: adminEmail(), password: body.data.password, name: "Guillaume" }, headers: request.headers, asResponse: true });
    if (response.ok) {
      await query("UPDATE ops_invitations SET consumed_at=now() WHERE id=$1", [invite.rows[0].id]);
      await query("INSERT INTO ops_audit(kind,detail) VALUES('activation_compte',$1)", [adminEmail()]);
    }
    response.headers.set("Cache-Control", "no-store");
    return response;
  } finally {
    if (acquired) await lock.query("SELECT pg_advisory_unlock(726394,1)");
    lock.release();
  }
}
