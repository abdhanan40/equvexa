/** The Worker the OpenNext build writes to .open-next/worker.js. */
declare module "*/.open-next/worker.js" {
  const handler: { fetch: ExportedHandlerFetchHandler<CloudflareEnv> };
  export default handler;
}
