import { createRequire } from "node:module";
import { randomBytes, createHash } from "node:crypto";
import { Resend } from "resend";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

async function main() {
  const { database } = await import("../../src/lib/gestion/db");
  const email = process.env.WEBBING_OPS_ADMIN_EMAIL!;
  const exists = await database().query('SELECT id FROM "user" WHERE email=$1', [email]);
  if (exists.rowCount) throw new Error("Le compte existe déjà : aucune nouvelle invitation envoyée.");
  const token = randomBytes(32).toString("base64url");
  const hash = createHash("sha256").update(token).digest("hex");
  const link = `${process.env.WEBBING_OPS_URL}/gestion/activation#invitation=${token}`;
  await database().query("UPDATE ops_invitations SET expires_at=now() WHERE email=$1 AND consumed_at IS NULL", [email]);
  const invite = await database().query("INSERT INTO ops_invitations(token_hash,email,expires_at) VALUES($1,$2,now()+interval '24 hours') RETURNING id", [hash, email]);
  const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "Webbing <contact@webbing.ch>", to: email, subject: "Active ton espace de gestion Webbing",
    text: `Ton espace de gestion est prêt.\n\nOuvre ce lien personnel pour choisir ton mot de passe et activer la double authentification :\n${link}\n\nCe lien est valable 24 heures et ne peut être utilisé qu’une fois. Les données restent inaccessibles avant la validation de ton application d’authentification. Conserve les codes de secours hors de Webbing.\n\nAccès habituel : ${process.env.WEBBING_OPS_URL}/gestion`,
  });
  if (result.error) {
    await database().query("UPDATE ops_invitations SET expires_at=now() WHERE id=$1", [invite.rows[0].id]);
    throw new Error(result.error.message);
  }
  console.log(`Invitation personnelle envoyée à ${email}.`);
  await database().end();
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
