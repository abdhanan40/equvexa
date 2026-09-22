import "server-only";

/*
 * Minimal client for the Resend email API over plain HTTPS, so the project
 * needs no email package. The API key is read on the server at send time
 * and is never logged, returned or placed in a message.
 */

const DEFAULT_API_URL = "https://api.resend.com";
const TIMEOUT_MS = 10_000;

/**
 * Resend rejects requests without a User-Agent (403, error 1010). Node adds
 * one to every fetch, but Cloudflare Workers sends none, so it is set here.
 */
const USER_AGENT = "equvexa-website/1.0 (+https://equvexaindustries.com)";

export type OutgoingEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
  /** Resend sends at most one email per key within 24 hours. */
  idempotencyKey: string;
};

export type SendResult =
  | { ok: true; id: string; status: number }
  | {
      ok: false;
      /** Short machine-readable cause, safe to log. */
      error: "not-configured" | "rejected" | "unavailable" | "timeout" | "network";
      status?: number;
      /** Resend's error name, e.g. validation_error. Never its message text. */
      code?: string;
    };

/**
 * Base URL of the API. RESEND_API_BASE_URL exists only so failure paths can
 * be exercised against a local stand-in; production leaves it unset.
 */
function apiUrl() {
  const override = process.env.RESEND_API_BASE_URL?.trim();
  if (override && /^https?:\/\/[^\s]+$/.test(override)) {
    return override.replace(/\/+$/, "");
  }
  return DEFAULT_API_URL;
}

export async function sendEmail(email: OutgoingEmail): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return { ok: false, error: "not-configured" };

  let response: Response;
  try {
    response = await fetch(`${apiUrl()}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": email.idempotencyKey,
        "User-Agent": USER_AGENT,
      },
      body: JSON.stringify({
        from: email.from,
        to: [email.to],
        reply_to: email.replyTo,
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    return {
      ok: false,
      error: name === "TimeoutError" || name === "AbortError" ? "timeout" : "network",
    };
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // An empty or non-JSON body is handled by the status below.
  }
  const field = (name: string) =>
    body && typeof body === "object" && name in body
      ? String((body as Record<string, unknown>)[name])
      : undefined;

  if (response.ok) {
    const id = field("id");
    return id ? { ok: true, id, status: response.status } : { ok: false, error: "rejected", status: response.status };
  }

  // Only the error name is kept; the message text can echo request details.
  const code = field("name")?.replace(/[^a-z_]/gi, "").slice(0, 60);
  const unavailable =
    response.status === 429 || response.status >= 500 || response.status === 409;
  return {
    ok: false,
    error: unavailable ? "unavailable" : "rejected",
    status: response.status,
    code,
  };
}
