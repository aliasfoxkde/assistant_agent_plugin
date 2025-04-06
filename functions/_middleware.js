// Cloudflare Pages Functions middleware
export async function onRequest(context) {
  // Just pass through to the static assets
  return await context.next();
}
