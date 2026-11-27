import { after } from "next/server";
import { receiveOwnerEvent, processOwnerPublications } from "@/lib/gestion/owner-releases";
export const runtime = "nodejs";
export const maxDuration = 180;
export async function POST(request: Request) {
  const signature = request.headers.get("x-hub-signature-256");
  if (!signature || !/^sha256=[a-f0-9]{64}$/.test(signature)) return new Response(null, { status: 401 });
  if (Number(request.headers.get("content-length")) > 524288) return new Response(null, { status: 413 });
  const reader = request.body?.getReader(); if (!reader) return new Response(null, { status: 400 });
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 524288) { await reader.cancel(); return new Response(null, { status: 413 }); } chunks.push(value); }
  try {
    const result = await receiveOwnerEvent(Buffer.concat(chunks), signature, request.headers.get("x-github-delivery") || "", request.headers.get("x-github-event") || "");
    if (result.process) after(async () => { try { await processOwnerPublications(result.repository); } catch { /* Pending requests are retried by the read-only preflight in cron. */ } });
    return Response.json({ received: true, accepted: result.accepted }, { headers: { "Cache-Control": "no-store" } });
  } catch { return new Response(null, { status: 400 }); }
}
