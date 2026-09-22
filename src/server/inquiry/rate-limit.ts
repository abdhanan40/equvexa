import "server-only";

import { createHmac, randomBytes } from "node:crypto";

import { warnOnce } from "../log";

/*
 * Identifies a visitor for rate limiting without keeping who they are: the
 * client address is reduced to a keyed hash (HMAC-SHA256) before it is used,
 * and only the first characters of that hash are ever logged.
 *
 * On Cloudflare the address comes from CF-Connecting-IP, which Cloudflare sets
 * on every request it forwards. Anywhere else (`next dev`, `next start`) it
 * comes from the last X-Forwarded-For entry, which Next.js fills in from the
 * connection when no proxy is present. X-Real-IP and the other entries of
 * X-Forwarded-For are ignored: a client can send them with any value.
 *
 * The attempts themselves are counted by the inquiry store (store.ts).
 */

type RequestHeaders = Pick<Headers, "get">;

export type Visitor = {
  key: string;
  /** Short, non-reversible id that is safe to log. */
  logId: string;
};

const IPV4 =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

/**
 * Parses an IP address into the part that identifies a visitor: the whole
 * IPv4 address, or the /64 network of an IPv6 address, since one subscriber
 * usually holds a whole /64 and could otherwise rotate through it. Returns
 * null for anything that is not an IP address.
 */
export function addressKey(value: string | null | undefined): string | null {
  const text = value?.trim();
  if (!text) return null;
  if (IPV4.test(text)) return text;
  return ipv6Network(text);
}

function ipv6Network(text: string): string | null {
  // Drop brackets and a zone index such as %eth0.
  let address = text.replace(/^\[|\]$/g, "").split("%")[0].toLowerCase();

  // An IPv4-mapped address (::ffff:192.0.2.1) is really that IPv4 address.
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(address);
  if (mapped) return IPV4.test(mapped[1]) ? mapped[1] : null;

  if (!/^[0-9a-f:.]+$/.test(address) || address.includes(":::")) return null;

  // An embedded IPv4 tail (64:ff9b::192.0.2.1) becomes its two hex groups.
  const tail = /(\d+\.\d+\.\d+\.\d+)$/.exec(address);
  if (tail) {
    if (!IPV4.test(tail[1])) return null;
    const [a, b, c, d] = tail[1].split(".").map(Number);
    address =
      address.slice(0, -tail[1].length) +
      `${((a << 8) | b).toString(16)}:${((c << 8) | d).toString(16)}`;
  }

  const halves = address.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const rest = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const missing = 8 - head.length - rest.length;
  // "::" stands for at least one group; without it all eight must be present.
  if (halves.length === 2 ? missing < 1 : missing !== 0) return null;

  const groups = [...head, ...Array<string>(halves.length === 2 ? missing : 0).fill("0"), ...rest];
  if (groups.some((group) => !/^[0-9a-f]{1,4}$/.test(group))) return null;
  return `${groups
    .slice(0, 4)
    .map((group) => parseInt(group, 16).toString(16))
    .join(":")}::/64`;
}

function clientAddress(headers: RequestHeaders, onCloudflare: boolean) {
  if (onCloudflare) {
    const address = addressKey(headers.get("cf-connecting-ip"));
    if (address) return address;
    // Cloudflare always sets it unless a transform rule removes it.
    warnOnce("cf-connecting-ip-missing");
  }
  const hops = headers.get("x-forwarded-for")?.split(",");
  return addressKey(hops?.at(-1));
}

/** Shorter secrets still work but are flagged in the logs. */
const SECRET_MIN_LENGTH = 32;

let fallbackSecret: Buffer | undefined;

/**
 * The key for the visitor hash. VISITOR_HASH_SECRET keeps the hash of one
 * visitor the same in every Worker isolate, so the shared store counts their
 * attempts together. Without it, a random per-process key is used: fine for
 * local work, but on Cloudflare every isolate would count separately.
 */
function hashKey(onCloudflare: boolean) {
  const secret = process.env.VISITOR_HASH_SECRET?.trim();
  if (secret) {
    if (secret.length < SECRET_MIN_LENGTH) warnOnce("visitor-hash-secret-short");
    return secret;
  }
  if (onCloudflare) warnOnce("visitor-hash-secret-missing");
  fallbackSecret ??= randomBytes(32);
  return fallbackSecret;
}

export function identifyVisitor(
  headers: RequestHeaders,
  { onCloudflare }: { onCloudflare: boolean },
): Visitor {
  const key = createHmac("sha256", hashKey(onCloudflare))
    .update(clientAddress(headers, onCloudflare) ?? "unknown")
    .digest("hex");
  return { key, logId: key.slice(0, 10) };
}
