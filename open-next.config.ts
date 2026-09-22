import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/*
 * Configuration of the OpenNext adapter that builds the site for Cloudflare
 * Workers (see README, "Deploying to Cloudflare").
 *
 * Every page is prerendered and nothing is revalidated, so the read-only
 * cache backed by Workers Static Assets is enough: no R2 bucket, tag cache
 * or queue is needed.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  // Off on purpose: with Next.js 16.3 it can start an endless prefetch loop
  // (opennextjs/opennextjs-cloudflare#1334).
  enableCacheInterception: false,
});
