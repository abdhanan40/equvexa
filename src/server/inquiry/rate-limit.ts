import "server-only";

import { createHash, randomBytes } from "node:crypto";

/*
 * Per-visitor limit on inquiry attempts, kept in this server process's
 * memory. It resets when the server restarts and is not shared between
 * instances, so it is a first line of defence only: at deployment, add the
 * host's firewall rate limiting, or replace this module with a shared store
 * behind the same two functions.
 *
 * Visitors are identified by a salted hash of their address. The address
 * itself is never stored or logged, and the salt changes with every process.
 */

const WINDOWS = [
  { durationMs: 10 * 60 * 1000, max: 5 },
  { durationMs: 24 * 60 * 60 * 1000, max: 20 },
] as const;

const LONGEST_WINDOW_MS = WINDOWS[WINDOWS.length - 1].durationMs;

/** Upper bound on remembered visitors, so memory cannot grow without limit. */
const MAX_VISITORS = 5000;

/** Read access to request headers, as returned by next/headers. */
type RequestHeaders = Pick<Headers, "get">;

const salt = randomBytes(16);
const attempts = new Map<string, number[]>();

/**
 * The client address as reported by the proxy in front of the site (hosting
 * platforms set these headers). Next.js falls back to the connection address
 * when no proxy is present.
 */
function clientAddress(headers: RequestHeaders) {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = headers.get("x-forwarded-for");
  const hops = forwarded?.split(",").map((hop) => hop.trim()).filter(Boolean);
  return hops?.at(-1) ?? "unknown";
}

export type Visitor = {
  key: string;
  /** Short, non-reversible id that is safe to log. */
  logId: string;
};

export function identifyVisitor(headers: RequestHeaders): Visitor {
  const key = createHash("sha256")
    .update(salt)
    .update(clientAddress(headers))
    .digest("hex");
  return { key, logId: key.slice(0, 10) };
}

function prune(now: number) {
  for (const [key, times] of attempts) {
    const recent = times.filter((time) => now - time < LONGEST_WINDOW_MS);
    if (recent.length === 0) attempts.delete(key);
    else attempts.set(key, recent);
  }
  // Forget the visitors seen longest ago if the map is still too large.
  while (attempts.size > MAX_VISITORS) {
    const oldest = attempts.keys().next().value;
    if (oldest === undefined) break;
    attempts.delete(oldest);
  }
}

/**
 * Records one attempt for the visitor unless a limit is already reached.
 * Returns false when the visitor must wait.
 */
export function takeAttempt(visitor: Visitor, now = Date.now()) {
  if (attempts.size > MAX_VISITORS / 2) prune(now);
  const times = (attempts.get(visitor.key) ?? []).filter(
    (time) => now - time < LONGEST_WINDOW_MS,
  );
  const limited = WINDOWS.some(
    (window) =>
      times.filter((time) => now - time < window.durationMs).length >= window.max,
  );
  if (!limited) times.push(now);
  // Re-insert so the map stays ordered from least to most recently seen.
  attempts.delete(visitor.key);
  attempts.set(visitor.key, times);
  return !limited;
}
