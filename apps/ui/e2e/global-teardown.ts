import { server } from "./fixtures/msw-server"

/**
 * Playwright Global Teardown
 *
 * This runs once after all tests complete.
 * We use it to stop the MSW (Mock Service Worker) server.
 */

export default async function globalTeardown() {
  console.log("\n🛑 [MSW] Stopping Mock Service Worker server...")

  // Stop MSW server
  server.close()

  console.log("✅ [MSW] Mock server stopped successfully\n")
}
