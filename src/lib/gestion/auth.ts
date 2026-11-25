import "server-only";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { twoFactor } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { database, query } from "./db";

export function adminEmail() {
  return process.env.WEBBING_OPS_ADMIN_EMAIL?.trim().toLowerCase() || "";
}

let instance: ReturnType<typeof createAuth> | undefined;
function createAuth() {
  const secret = process.env.WEBBING_OPS_SECRET;
  if (!secret || secret.length < 40 || !adminEmail()) throw new Error("L’authentification privée n’est pas configurée.");
  return betterAuth({
    appName: "Webbing Gestion",
    baseURL: process.env.WEBBING_OPS_URL || "https://www.webbing.ch",
    basePath: "/api/gestion/auth",
    secret,
    database: database(),
    emailAndPassword: { enabled: true, minPasswordLength: 14, maxPasswordLength: 128, requireEmailVerification: false },
    session: { expiresIn: 8 * 60 * 60, updateAge: 30 * 60, cookieCache: { enabled: false } },
    rateLimit: { enabled: true, storage: "database", window: 60, max: 30, customRules: { "/sign-in/email": { window: 60, max: 5 }, "/two-factor/*": { window: 60, max: 5 } } },
    advanced: { cookiePrefix: "webbing-gestion", defaultCookieAttributes: { httpOnly: true, sameSite: "lax" }, database: { generateId: "uuid" } },
    databaseHooks: {
      user: { create: { before: async (user) => {
        if (user.email.toLowerCase() !== adminEmail()) throw new APIError("FORBIDDEN", { message: "Inscription indisponible." });
        return { data: user };
      } } },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path.startsWith("/two-factor/") && ctx.body) ctx.body.trustDevice = false;
      }),
      after: createAuthMiddleware(async (ctx) => {
        if (!["/two-factor/verify-totp", "/two-factor/verify-backup-code"].includes(ctx.path)) return;
        if (ctx.context.returned instanceof APIError) return;
        const session = ctx.context.newSession ?? ctx.context.session;
        if (!session?.user.twoFactorEnabled) return;
        await query("INSERT INTO ops_verified_sessions(session_id) VALUES($1) ON CONFLICT DO NOTHING", [session.session.id]);
        await query("INSERT INTO ops_audit(kind, detail) VALUES('connexion_mfa', $1)", [session.user.email]);
      }),
    },
    plugins: [twoFactor({ issuer: "Webbing Gestion", skipVerificationOnEnable: false, accountLockout: { enabled: true, maxFailedAttempts: 5 } }), nextCookies()],
  });
}

export function auth() { return instance ??= createAuth(); }
