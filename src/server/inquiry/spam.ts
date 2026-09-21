import "server-only";

import type { SubmissionMeta } from "./parse";

/*
 * Low-friction spam checks. None of them is shown to the visitor: a filled
 * trap is dropped quietly, and a submission that is too fast or full of links
 * gets the same "could not be sent" answer as a delivery failure, with the
 * send-it-yourself fallback, so a real person is never stuck.
 */

/** A person needs longer than this to complete either form. */
export const MIN_FILL_TIME_MS = 3000;

/** Messages with more links than this are treated as suspicious. */
export const MAX_LINKS = 3;

const LINK = /\bhttps?:\/\/|\bwww\.[^\s.]/gi;

export function countLinks(text: string) {
  return text.match(LINK)?.length ?? 0;
}

export type SpamVerdict =
  | { kind: "clean" }
  /** Almost certainly a bot: drop without sending. */
  | { kind: "drop"; reason: "trap" }
  /** Probably a bot: do not send, answer as a failure. */
  | { kind: "suspicious"; reason: "too-fast" | "links" };

export function checkTrap(meta: SubmissionMeta): SpamVerdict {
  return meta.trapFilled ? { kind: "drop", reason: "trap" } : { kind: "clean" };
}

export function checkBehaviour(meta: SubmissionMeta, text: string): SpamVerdict {
  if (meta.elapsedMs === null || meta.elapsedMs < MIN_FILL_TIME_MS) {
    return { kind: "suspicious", reason: "too-fast" };
  }
  if (countLinks(text) > MAX_LINKS) {
    return { kind: "suspicious", reason: "links" };
  }
  return { kind: "clean" };
}
