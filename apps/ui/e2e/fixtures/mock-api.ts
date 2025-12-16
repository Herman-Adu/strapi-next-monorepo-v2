import { Page } from "@playwright/test"
import { mockE2EPage, mockNavbar, mockFooter } from "./mock-data"

/**
 * Setup API mocking for E2E tests
 * Intercepts Strapi API calls and returns mock data
 * This allows tests to run without a real backend
 */
export async function setupApiMocks(page: Page) {
  // Get the Strapi URL from environment (defaults to localhost:1337)
  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"

  // Mock pages API endpoint - matches Strapi backend requests
  await page.route(`${strapiUrl}/api/pages**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockE2EPage),
    })
  })

  // Mock navbar API endpoint - matches Strapi backend requests
  await page.route(`${strapiUrl}/api/navbar**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockNavbar),
    })
  })

  // Mock footer API endpoint - matches Strapi backend requests
  await page.route(`${strapiUrl}/api/footer**`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockFooter),
    })
  })

  // Mock newsletter subscription endpoint (POST) - client-side proxy requests
  await page.route("**/api/public-proxy/subscribers**", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Successfully subscribed!",
        }),
      })
    } else {
      route.continue()
    }
  })

  // Mock contact form submission endpoint (POST) - client-side proxy requests
  await page.route("**/api/public-proxy/contact-messages**", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Message sent successfully!",
        }),
      })
    } else {
      route.continue()
    }
  })
}
