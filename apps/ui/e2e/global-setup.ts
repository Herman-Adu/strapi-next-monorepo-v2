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

  // Start MSW server
  server.listen({
    onUnhandledRequest: "warn", // Warn about unmocked requests (helps debugging)
  })

  console.log("✅ [MSW] Mock server started successfully\n")
}
/* eslint-enable no-console */
