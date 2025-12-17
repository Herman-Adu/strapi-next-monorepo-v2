import { server } from "./fixtures/msw-server"
import { createBridgeServer } from "./fixtures/msw-bridge-server"

/**
 * Playwright Global Setup
 *
 * This runs once before all tests start.
 * We start both:
 * 1. MSW server (mock handlers)
 * 2. HTTP bridge server (intercepts Next.js fetch calls)
 *
 * Pattern from: https://dev.to/webdeveloperhyper/how-to-test-nextjs-ssr-api-playwright-msw-k65
 */

/* eslint-disable no-console */
export default async function globalSetup() {
  console.log("\n🚀 [MSW] Starting Mock Service Worker...")

  // 1. Start MSW with handlers
  server.listen({
    onUnhandledRequest: "bypass",
  })

  console.log("   ✅ MSW server started")

  // 2. Start HTTP bridge server (critical for SSR interception)
  const bridge = createBridgeServer()

  // Add timeout to prevent CI hangs if port is unavailable
  const startWithTimeout = Promise.race([
    bridge.start(),
    new Promise<void>((_, reject) => {
      setTimeout(
        () => reject(new Error("Bridge server start timeout (30s)")),
        30000
      )
    }),
  ])

  try {
    await startWithTimeout
    console.log("   ✅ Bridge server started on port 1337")
  } catch (error) {
    console.error("   ❌ Bridge server failed to start:", error)
    throw error
  }
  console.log("   🔗 Next.js fetch → Bridge → MSW → Mock response\n")

  // Store bridge reference for teardown
  ;(global as any).__MSW_BRIDGE__ = bridge
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
