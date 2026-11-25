import type { IncomingMessage, ServerResponse } from "node:http";
import { rateLimited, validateEnquiry } from "../lib/enquiry.js";

const hits = new Map<string, number[]>();

function clientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket.remoteAddress || "unknown";
  return raw.split(",")[0].trim() || "unknown";
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const existing = (req as IncomingMessage & { body?: unknown }).body;
  if (existing && typeof existing === "object") return existing as Record<string, unknown>;
  if (typeof existing === "string" && existing) return JSON.parse(existing) as Record<string, unknown>;

  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > 20_000) throw new Error("too_large");
    chunks.push(buf);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw) as Record<string, unknown>;
}

function send(res: ServerResponse, status: number, payload: unknown) {
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(body);
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    send(res, 405, { error: "Method not allowed" });
    return;
  }

  if (rateLimited(clientIp(req), Date.now(), hits)) {
    send(res, 429, { error: "Too many enquiries from this network. Please call or use WhatsApp." });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = await readJson(req);
  } catch {
    send(res, 400, { error: "Could not read the form." });
    return;
  }

  const result = validateEnquiry(body);
  if (!result.ok) {
    send(res, 400, { error: result.error });
    return;
  }
  if (result.spam) {
    send(res, 200, { ok: true });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    send(res, 503, { error: "Enquiry storage is not configured yet. Please call or use WhatsApp." });
    return;
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/enquiries`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(result.row)
  });

  if (!response.ok) {
    send(res, 502, { error: "The enquiry could not be saved. Please call or use WhatsApp." });
    return;
  }

  send(res, 200, { ok: true });
}
