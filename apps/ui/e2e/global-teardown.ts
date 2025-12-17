import { server } from "./fixtures/msw-server"

/**
 * Playwright Global Teardown
 *
 * This runs once after all tests complete.
 * Stop both MSW server and HTTP bridge server.
 */

/* eslint-disable no-console */
export default async function globalTeardown() {
  console.log("\n🛑 [MSW] Stopping servers...")

  // Stop bridge server
  const bridge = (global as any).__MSW_BRIDGE__
  if (bridge) {
    await bridge.stop()
  }

  // Stop MSW server
  server.close()

  console.log("✅ [MSW] All servers stopped\n")
}
/* eslint-enable no-console */
