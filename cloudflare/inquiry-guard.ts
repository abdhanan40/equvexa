import { DurableObject } from "cloudflare:workers";

import {
  LONGEST_WINDOW_MS,
  SUBMISSION_LEASE_MS,
  SUBMISSION_TTL_MS,
  windowIsFull,
  type InquiryGuardMethods,
  type SubmissionClaim,
  type SubmissionRecord,
  type SubmissionStatus,
} from "../src/server/inquiry/guard";

/*
 * Shared state for the inquiry forms on Cloudflare, where each request may
 * run in a different isolate. Every instance holds a single key and handles
 * one call at a time, so each check-and-update below happens atomically:
 *
 *   visitor:<hash>          when this visitor last tried to send (rate limit)
 *   submission:<form>:<id>  one submission's reference and delivery state
 *
 * The visitor hash is keyed and non-reversible (src/server/inquiry/rate-limit.ts);
 * no names, email addresses, messages or IP addresses are stored. An alarm
 * deletes an instance's data once it is no longer needed.
 */
export class InquiryGuard
  extends DurableObject<CloudflareEnv>
  implements InquiryGuardMethods
{
  private readonly sql: SqlStorage;

  constructor(ctx: DurableObjectState, env: CloudflareEnv) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
  }

  /**
   * Creates the tables if they are missing. Called by every method rather
   * than once in the constructor, because the alarm's deleteAll() drops them
   * while this instance may stay in memory.
   */
  private ready() {
    this.sql.exec("CREATE TABLE IF NOT EXISTS attempts (at INTEGER NOT NULL)");
    this.sql.exec(
      `CREATE TABLE IF NOT EXISTS submission (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        reference TEXT NOT NULL,
        received_at INTEGER NOT NULL,
        sent INTEGER NOT NULL DEFAULT 0,
        lease_until INTEGER NOT NULL DEFAULT 0
      )`,
    );
  }

  async takeAttempt(): Promise<boolean> {
    this.ready();
    const now = Date.now();
    this.sql.exec("DELETE FROM attempts WHERE at <= ?", now - LONGEST_WINDOW_MS);
    const times = this.sql
      .exec<{ at: number }>("SELECT at FROM attempts")
      .toArray()
      .map((row) => row.at);
    if (windowIsFull(times, now)) return false;
    this.sql.exec("INSERT INTO attempts (at) VALUES (?)", now);
    // Forget the visitor once their last attempt is outside every window.
    await this.forgetAt(now + LONGEST_WINDOW_MS);
    return true;
  }

  async submissionStatus(): Promise<SubmissionStatus> {
    this.ready();
    return this.readSubmission(Date.now());
  }

  async claimSubmission(candidate: SubmissionRecord): Promise<SubmissionClaim> {
    this.ready();
    const now = Date.now();
    const status = this.readSubmission(now);
    if (status.state === "sent" || status.state === "sending") {
      return { claimed: false, status };
    }
    const record = status.state === "open" ? status.record : candidate;
    this.sql.exec(
      `INSERT INTO submission (id, reference, received_at, sent, lease_until)
       VALUES (1, ?, ?, 0, ?)
       ON CONFLICT (id) DO UPDATE SET lease_until = excluded.lease_until`,
      record.reference,
      record.receivedAt,
      now + SUBMISSION_LEASE_MS,
    );
    await this.forgetAt(record.receivedAt + SUBMISSION_TTL_MS);
    return { claimed: true, record };
  }

  async finishSubmission(sent: boolean): Promise<void> {
    this.ready();
    this.sql.exec("UPDATE submission SET sent = ?, lease_until = 0 WHERE id = 1", sent ? 1 : 0);
  }

  /** Deletes everything this instance holds. */
  async alarm(): Promise<void> {
    await this.ctx.storage.deleteAll();
  }

  private readSubmission(now: number): SubmissionStatus {
    const row = this.sql
      .exec<{ reference: string; received_at: number; sent: number; lease_until: number }>(
        "SELECT reference, received_at, sent, lease_until FROM submission WHERE id = 1",
      )
      .toArray()[0];
    if (!row) return { state: "new" };
    const record = { reference: row.reference, receivedAt: row.received_at };
    if (row.sent) return { state: "sent", record };
    if (row.lease_until > now) return { state: "sending", record };
    return { state: "open", record };
  }

  /** Schedules deletion no earlier than `time`, keeping any later alarm. */
  private async forgetAt(time: number) {
    const current = await this.ctx.storage.getAlarm();
    if (current === null || current < time) await this.ctx.storage.setAlarm(time);
  }
}
