"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const test_1 = require("@playwright/test")
;(0, test_1.test)("verify servers are running", async ({ request }) => {
  // Use 127.0.0.1 in CI for consistent DNS resolution (localhost can be flaky on Linux runners)
  const baseURL = process.env.CI ? "http://127.0.0.1" : "http://localhost"
  // Check if Strapi is running
  try {
    const strapiResponse = await request.get(`${baseURL}:1337/_health`)
    if (!strapiResponse.ok()) {
      throw new Error(
        `Strapi is not running or unhealthy. Status: ${strapiResponse.status()}`
      )
    }
  } catch (error) {
    throw new Error(
      `Strapi is not running on port 1337. Please start it with: yarn workspace @repo/strapi dev\n${error}`
    )
  }
  // Check if Next.js is running
  try {
    const nextResponse = await request.get(`${baseURL}:3000`)
    if (!nextResponse.ok()) {
      throw new Error(
        `Next.js is not running properly. Status: ${nextResponse.status()}`
      )
    }
  } catch (error) {
    throw new Error(
      `Next.js is not running on port 3000. Please start it with: yarn workspace @repo/ui dev\n${error}`
    )
  }
})
