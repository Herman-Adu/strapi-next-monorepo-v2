import { test as setup } from "@playwright/test"

setup("verify servers are running", async ({ request }) => {
  // Check if Strapi is running
  try {
    const strapiResponse = await request.get("http://localhost:1337/_health")
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
    const nextResponse = await request.get("http://localhost:3000")
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
