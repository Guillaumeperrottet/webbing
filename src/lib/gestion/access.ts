import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, adminEmail } from "./auth";
import { query } from "./db";

export async function access() {
  const requestHeaders = await headers();
  if (!requestHeaders.get("cookie")) return { session: null, verified: false };
  const session = await auth().api.getSession({ headers: requestHeaders, query: { disableCookieCache: true } });
  if (!session || session.user.email.toLowerCase() !== adminEmail()) return { session: null, verified: false };
  if (Date.now() - new Date(session.session.createdAt).getTime() > 8 * 60 * 60_000) return { session: null, verified: false };
  const proof = await query("SELECT 1 FROM ops_verified_sessions WHERE session_id=$1", [session.session.id]);
  return { session, verified: session.user.twoFactorEnabled === true && proof.rowCount === 1 };
}

export async function requireAdmin() {
  const result = await access();
  if (!result.session) redirect("/gestion/connexion");
  if (!result.verified) redirect(result.session.user.twoFactorEnabled ? "/gestion/verification" : "/gestion/securite");
  return result.session;
}
