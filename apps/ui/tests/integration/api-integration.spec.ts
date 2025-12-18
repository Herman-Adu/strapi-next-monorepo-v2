/// <reference lib="dom" />
import { test, expect } from "@playwright/test"

/**
 * INTEGRATION TESTS - Error Handling & Resilience (Behavior-Driven)
 *
 * Tests how the application behaves under adverse conditions:
 * - API failures and timeouts
 * - Network errors and retries
 * - Graceful degradation
 * - Console error tracking
 *
 * Uses MSW to simulate failures without requiring real Strapi
 *
 * Run: yarn test:integration
 */

test.describe("Error Handling & Resilience", () => {
  test.describe.configure({ mode: "serial" })

  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000)
  })

  test("should load page successfully with MSW mocks", async ({ page }) => {
    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })

    // Verify page loaded (not error state)
    await expect(page).toHaveTitle(/.*/)

    const body = await page.locator("body").textContent()
    expect(body!.length).toBeGreaterThan(100)
  })

  test("should have clean console with no critical errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = []

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto("/en/e2e-test-page", {
      waitUntil: "networkidle",
      timeout: 30000,
    })

    await page.waitForTimeout(2000)

    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes("DevTools") &&
        !error.includes("Extension") &&
        !error.includes("favicon") &&
        !error.includes("browserslist")
    )

    expect(criticalErrors.length).toBe(0)
  })

  test("should handle Strapi API down gracefully", async ({ page }) => {
    // This test simulates Strapi being unavailable
    // We'll test by blocking API requests

    await page.route("**/api/**", (route) => {
      // Abort all API requests to simulate API down
      route.abort()
    })

    // Try to load page
    await page.goto("/en/e2e-test-page").catch(() => {
      // Page load might fail, which is expected
    })

    await page.waitForTimeout(3000)

    // Page should show error state or loading state, not crash
    const bodyContent = await page.locator("body").textContent()

    // Should either show loading, error message, or graceful degradation
    const hasGracefulFallback =
      bodyContent!.toLowerCase().includes("loading") ||
      bodyContent!.toLowerCase().includes("error") ||
      bodyContent!.toLowerCase().includes("unavailable") ||
      bodyContent!.toLowerCase().includes("try again") ||
      bodyContent!.length < 50 // Empty state

    expect(hasGracefulFallback).toBe(true)
  })

  test("should retry failed API requests", async ({ page }) => {
    let requestCount = 0

    // Intercept API requests
    await page.route("**/api/pages*", async (route) => {
      requestCount++

      // Fail first request, succeed on retry
      if (requestCount === 1) {
        await route.abort()
      } else {
        await route.continue()
      }
    })

    // Navigate to page
    await page.goto("/en/e2e-test-page", {
      waitUntil: "networkidle",
      timeout: 60000,
    })

    // Page should eventually load successfully despite initial failure
    const hasContent = await page.locator("body").textContent()
    expect(hasContent!.length).toBeGreaterThan(100)
  })

  test("should verify newsletter section renders", async ({ page }) => {
    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })

    // Newsletter section should render from MSW mock data
    const newsletterHeading = page
      .locator("text=/stay updated|newsletter/i")
      .first()
    await expect(newsletterHeading).toBeVisible()

    // Should have the specific heading from test data
    const specificHeading = page
      .locator("text=/web development insights/i")
      .first()
    const hasSpecificContent = await specificHeading
      .isVisible({ timeout: 5000 })
      .catch(() => false)

    // Either specific test data is present OR generic newsletter content
    if (!hasSpecificContent) {
      // At minimum, newsletter section should exist
      const emailInput = page.locator('input[type="email"]').first()
      await expect(emailInput).toBeVisible()
    }
  })
})
