#!/usr/bin/env node
/*
 * Stops a Cloudflare build when a local .env file holds a secret.
 *
 * The OpenNext adapter copies every variable from these files into the
 * Worker it builds (.open-next/cloudflare/next-env.mjs), and `deploy` or
 * `upload` would then send them to Cloudflare inside the Worker's code.
 * Secrets belong in `.dev.vars` for local previews, and in the Cloudflare
 * dashboard (or `wrangler secret put`) for deployments.
 *
 * Only variable names are printed, never their values.
 */
import { existsSync, readFileSync } from "node:fs";

// The files the adapter reads for its production, development and test builds.
const ENV_FILES = [
  ".env",
  ".env.local",
  ".env.production",
  ".env.production.local",
  ".env.development",
  ".env.development.local",
  ".env.test",
  ".env.test.local",
];

// Names that suggest a credential.
const SECRET_NAME = /(KEY|SECRET|TOKEN|PASSWORD|PASSWD|CREDENTIAL)/i;

const findings = [];
for (const file of ENV_FILES) {
  if (!existsSync(file)) continue;
  for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(raw);
    if (!match) continue;
    const [, name, rawValue] = match;
    const value = rawValue.replace(/\s+#.*$/, "").replace(/^(['"])(.*)\1$/, "$2").trim();
    if (SECRET_NAME.test(name) && value !== "") findings.push(`${file}: ${name}`);
  }
}

if (findings.length > 0) {
  console.error(
    [
      "",
      "Refusing to build for Cloudflare: these .env files hold secrets, and the",
      "OpenNext adapter would copy them into the Worker bundle:",
      ...findings.map((finding) => `  - ${finding}`),
      "",
      "Move them to .dev.vars for a local preview, or set them as secrets in the",
      "Cloudflare dashboard for a deployment. See README, \"Deploying to Cloudflare\".",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

console.log("No secrets in .env files: safe to build for Cloudflare.");
