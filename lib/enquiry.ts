export type EnquiryRow = {
  name: string;
  phone: string;
  stream: string;
  board: string;
  college: string;
  message: string;
};

export type EnquiryResult =
  | { ok: true; spam: true }
  | { ok: true; spam: false; row: EnquiryRow }
  | { ok: false; error: string };

const MAX_NAME = 120;
const MAX_SHORT = 80;
const MAX_COLLEGE = 200;
const MAX_MESSAGE = 2000;

export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[^\d]/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  if (!/^[6-9]\d{9}$/.test(local)) return null;
  return local;
}

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function validateEnquiry(body: Record<string, unknown>): EnquiryResult {
  const honeypot = clip(body.company_website, 200);
  if (honeypot) return { ok: true, spam: true };

  const name = clip(body.name, MAX_NAME);
  const phone = normalizePhone(clip(body.phone, 20));
  const stream = clip(body.stream, MAX_SHORT);
  const board = clip(body.board, MAX_SHORT);
  const college = clip(body.college, MAX_COLLEGE);
  const message = clip(body.message, MAX_MESSAGE);

  if (name.length < 2) return { ok: false, error: "Enter the student's name." };
  if (!phone) return { ok: false, error: "Enter a 10-digit Indian mobile number." };

  return { ok: true, spam: false, row: { name, phone, stream, board, college, message } };
}

export function rateLimited(ip: string, now: number, store: Map<string, number[]>, windowMs = 10 * 60 * 1000, maxHits = 5): boolean {
  const recent = (store.get(ip) || []).filter((t) => now - t < windowMs);
  if (recent.length >= maxHits) {
    store.set(ip, recent);
    return true;
  }
  recent.push(now);
  store.set(ip, recent);
  return false;
}
