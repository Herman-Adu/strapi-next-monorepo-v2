import { setupServer } from "msw/node"
import { handlers } from "./msw-handlers"

/**
 * MSW Server Instance for E2E Tests
 *
 * This server runs in Node.js and intercepts network requests
 * before they reach the actual network layer. This enables:
 *
 * 1. SSR Mocking: Intercepts Next.js server-side fetch calls
 * 2. Client-side Mocking: Intercepts browser fetch/XHR requests
 * 3. No code changes: Application code remains production-ready
 *
 * The server is started in global-setup.ts and stopped in global-teardown.ts
 */

export const server = setupServer(...handlers)

// Optional: Enable request logging for debugging
/* eslint-disable no-console */
if (process.env.MSW_VERBOSE === "true") {
  server.events.on("request:start", ({ request }) => {
    console.log("[MSW] Intercepted:", request.method, request.url)
  })

  server.events.on("request:match", ({ request }) => {
    console.log("[MSW] Matched handler for:", request.method, request.url)
  })

  server.events.on("request:unhandled", ({ request }) => {
    console.log("[MSW] No handler for:", request.method, request.url)
  })
}
/* eslint-enable no-console */
