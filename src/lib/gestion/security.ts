import { createHash, timingSafeEqual } from "node:crypto";
export function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function tokensEqual(a: string, b: string) {
  return timingSafeEqual(Buffer.from(tokenHash(a)), Buffer.from(tokenHash(b)));
}
export function validOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(process.env.WEBBING_OPS_URL || "https://www.webbing.ch").origin;
}
export function classifyHttp(status: number): "disponible" | "redirection" | "protege" | "incident" {
  if (status === 401 || status === 403) return "protege";
  if (status >= 300 && status < 400) return "redirection";
  return status >= 200 && status < 300 ? "disponible" : "incident";
}
