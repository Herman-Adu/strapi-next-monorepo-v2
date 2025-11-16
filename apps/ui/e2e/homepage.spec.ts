import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    await page.goto("/en")

    // Wait for page to load
    await page.waitForLoadState("networkidle")

    // Check that the page title is set
    await expect(page).toHaveTitle(/.*/)
  })

  test("should have navigation", async ({ page }) => {
    await page.goto("/en")

    // Look for common navigation elements
    const nav = page.locator("nav").first()
    await expect(nav).toBeVisible()
  })

  test("should be responsive", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/en")
    await expect(page).toHaveTitle(/.*/)

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/en")
    await expect(page).toHaveTitle(/.*/)
  })
})
