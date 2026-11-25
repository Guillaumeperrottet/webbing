import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const vercelEvents = ["deployment.created", "deployment.ready", "deployment.succeeded", "deployment.promoted", "deployment.error", "deployment.canceled", "deployment.rollback", "project.created", "project.removed", "project.renamed"] as const;
const id = z.string().min(1).max(160);
const project = z.object({ id, name: z.string().max(160).optional(), previousName: z.string().max(160).optional() });
export const vercelEventSchema = z.object({
  id, type: z.enum(vercelEvents), createdAt: z.union([z.number(), z.string().max(60)]),
  payload: z.object({
    team: z.object({ id: id.nullable() }).nullable().optional(), project,
    target: z.string().max(80).nullable().optional(), fromDeploymentId: id.optional(), toDeploymentId: id.optional(),
    deployment: z.object({ id, name: z.string().max(160).optional(), url: z.string().max(500).optional(), target: z.string().max(80).nullable().optional(), createdAt: z.number().optional(), meta: z.record(z.string(), z.unknown()).optional() }).optional(),
  }),
});
export function validVercelSignature(body: Buffer, signature: string | null, secret: string) {
  if (!signature || !/^[a-f0-9]{40}$/i.test(signature)) return false;
  const actual = createHmac("sha1", secret).update(body).digest();
  return timingSafeEqual(actual, Buffer.from(signature, "hex"));
}
export function eventDate(value: string | number, now = Date.now()) {
  const date = new Date(typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value);
  if (!Number.isFinite(date.getTime()) || date.getTime() > now + 300_000 || date.getTime() < now - 7 * 86400_000) throw new Error("Événement hors délai.");
  return date;
}
export function deploymentState(type: string) {
  return ({ "deployment.created": "INITIALIZING", "deployment.ready": "READY", "deployment.succeeded": "READY", "deployment.promoted": "READY", "deployment.error": "ERROR", "deployment.canceled": "CANCELED" } as Record<string,string>)[type];
}
export function deploymentUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("https://") ? value : `https://${value}`);
    return url.protocol === "https:" && !url.username && !url.password && !url.port && url.hostname.endsWith(".vercel.app") ? url.toString() : null;
  } catch { return null; }
}
