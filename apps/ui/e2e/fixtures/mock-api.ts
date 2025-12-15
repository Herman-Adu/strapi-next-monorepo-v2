import { Page } from "@playwright/test"
import { mockE2EPage, mockNavbar, mockFooter } from "./mock-data"

/**
 * Setup API mocking for E2E tests
 * Intercepts Strapi API calls and returns mock data
 * This allows tests to run without a real backend
 */
export async function setupApiMocks(page: Page) {
  // Mock pages API endpoint
  await page.route("**/api/pages**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockE2EPage),
    })
  })

  // Mock navbar API endpoint
  await page.route("**/api/navbar**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockNavbar),
    })
  })

  // Mock footer API endpoint
  await page.route("**/api/footer**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockFooter),
    })
  })

  // Allow all other requests to pass through
  await page.route("**/*", (route) => {
    if (!route.request().url().includes("/api/")) {
      route.continue()
    }
  })
}
