import { server } from "./fixtures/msw-server"

/**
 * Playwright Global Setup
 *
 * This runs once before all tests start.
 * We use it to start the MSW (Mock Service Worker) server.
 *
 * The MSW server will intercept all network requests made by:
 * - Next.js server-side rendering (SSR)
 * - Browser client-side requests
 *
 * This allows E2E tests to run without a real Strapi backend.
 */

/* eslint-disable no-console */
export default async function globalSetup() {
  console.log("\n🚀 [MSW] Starting Mock Service Worker server...")
  console.log("   This will intercept network requests for Strapi API")
  console.log(
    `   Target URL: ${process.env.STRAPI_URL || "http://127.0.0.1:1337"}\n`
  )

  // Start MSW server with all interceptors enabled
  // CRITICAL: Next.js 15+ uses undici for fetch(), so we must enable it explicitly
  server.listen({
    onUnhandledRequest: "warn", // Warn about unmocked requests (helps debugging)
  })

  // Enable verbose logging to debug interception
  server.events.on("request:start", ({ request }) => {
    console.log(`   ⚡ [MSW] Intercepted: ${request.method} ${request.url}`)
  })

  server.events.on("request:match", ({ request }) => {
    console.log(`   ✅ [MSW] Matched handler: ${request.method} ${request.url}`)
  })

  server.events.on("request:unhandled", ({ request }) => {
    console.log(`   ⚠️  [MSW] No handler: ${request.method} ${request.url}`)
  })

  console.log("✅ [MSW] Mock server started successfully\n")
  console.log("   Intercepting all Node.js fetch() calls (including undici)\n")
}
/* eslint-enable no-console */
