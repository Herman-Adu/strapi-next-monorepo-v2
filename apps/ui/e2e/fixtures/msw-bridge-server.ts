/**
 * MSW Bridge Server - HTTP Server for Next.js SSR Testing
 *
 * This server acts as a bridge between Next.js fetch() calls and MSW handlers.
 * Since Next.js SSR runs in a separate process, we need an HTTP server that:
 *
 * 1. Listens on the same URL that Next.js tries to fetch (STRAPI_URL)
 * 2. Forwards requests through MSW handlers
 * 3. Returns mocked responses without hitting the real network
 *
 * Pattern based on: https://dev.to/webdeveloperhyper/how-to-test-nextjs-ssr-api-playwright-msw-k65
 */

import http from "http"
import type { IncomingMessage, ServerResponse } from "http"

const STRAPI_PORT = 1337 // Must match STRAPI_URL in env

/**
 * Create HTTP bridge server
 * This server intercepts fetch() calls from Next.js SSR and routes them through MSW
 */
export function createBridgeServer() {
  const bridgeServer = http.createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      /* eslint-disable no-console */
      console.log(`[MSW Bridge] ${req.method} ${req.url}`)
      /* eslint-enable no-console */

      try {
        // Forward request through MSW
        const url = `http://127.0.0.1:${STRAPI_PORT}${req.url}`

        // Convert Node.js headers to proper HeadersInit format
        const headers: Record<string, string> = {}
        Object.entries(req.headers)
          .filter(([key]) => key !== "host")
          .forEach(([key, value]) => {
            if (value && typeof value === "string") {
              headers[key] = value
            } else if (
              value &&
              Array.isArray(value) &&
              value.length > 0 &&
              value[0]
            ) {
              headers[key] = value[0]
            }
          })

        // Read request body for POST/PUT/PATCH requests
        let body: string | undefined
        if (req.method && ["POST", "PUT", "PATCH"].includes(req.method)) {
          body = await new Promise<string>((resolve) => {
            let data = ""
            req.on("data", (chunk) => {
              data += chunk.toString()
            })
            req.on("end", () => {
              resolve(data)
            })
          })
        }

        const response = await fetch(url, {
          method: req.method,
          headers,
          body,
        })

        // Return MSW response
        let data
        try {
          data = await response.json()
        } catch {
          data = null
        }

        res.writeHead(response.status, { "Content-Type": "application/json" })
        res.end(data ? JSON.stringify(data) : null)
      } catch (error) {
        /* eslint-disable no-console */
        console.error("[MSW Bridge] Error:", error)
        /* eslint-enable no-console */
        res.writeHead(500, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "Internal server error" }))
      }
    }
  )

  return {
    start: () => {
      return new Promise<void>((resolve) => {
        bridgeServer.listen(STRAPI_PORT, () => {
          /* eslint-disable no-console */
          console.log(`[MSW Bridge] Listening on port ${STRAPI_PORT}`)
          /* eslint-enable no-console */
          resolve()
        })
      })
    },
    stop: () => {
      return new Promise<void>((resolve) => {
        bridgeServer.close(() => {
          /* eslint-disable no-console */
          console.log("[MSW Bridge] Server closed")
          /* eslint-enable no-console */
          resolve()
        })
      })
    },
  }
}
