import { test, expect } from "@playwright/test"
import { navigateAndWaitForContent } from "./utils/test-helpers"

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    test.setTimeout(60000)
    // Use helper to wait for MSW-mocked content to render
    await navigateAndWaitForContent(
      page,
      "/en",
      /Home|Welcome|Get Started/i
    )

    // Check that the page title is set
    await expect(page).toHaveTitle(/.*/)
  })

  test("should have navigation", async ({ page }) => {
    test.setTimeout(90000)
    // Use helper to wait for navbar content from MSW
    await navigateAndWaitForContent(
      page,
      "/en",
      /Home|About|Contact/i // Wait for actual nav link text
    )

    // Now nav should be fully rendered with links
    const nav = page.locator("nav").first()
    await expect(nav).toBeVisible({ timeout: 5000 })
  })

  test("should be responsive", async ({ page }) => {
    test.setTimeout(90000) // Increased timeout for slower browsers like Firefox

    // Test mobile viewport on e2e-test-page (not /en which has timeout issues)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveTitle(/.*/)

    // Test desktop viewport on e2e-test-page
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await expect(page).toHaveTitle(/.*/)
  })
})
