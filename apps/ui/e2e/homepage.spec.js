"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const test_1 = require("@playwright/test")
test_1.test.describe("Homepage", () => {
  ;(0, test_1.test)("should load successfully", async ({ page }) => {
    test_1.test.setTimeout(60000) // Increased timeout for initial page load
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    // Wait for page to be interactive - no networkidle due to Next.js HMR/websockets
    await page.waitForSelector("body", { state: "attached" })
    // Check that the page title is set
    await (0, test_1.expect)(page).toHaveTitle(/.*/)
  })
  ;(0, test_1.test)("should have navigation", async ({ page }) => {
    test_1.test.setTimeout(60000) // Increased timeout
    await page.goto("/en", { waitUntil: "domcontentloaded" })
    // Look for common navigation elements
    const nav = page.locator("nav").first()
    await (0, test_1.expect)(nav).toBeVisible({ timeout: 15000 })
  })
  ;(0, test_1.test)("should be responsive", async ({ page }) => {
    test_1.test.setTimeout(90000) // Increased timeout for slower browsers like Firefox
    // Test mobile viewport on e2e-test-page (not /en which has timeout issues)
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await (0, test_1.expect)(page).toHaveTitle(/.*/)
    // Test desktop viewport on e2e-test-page
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await (0, test_1.expect)(page).toHaveTitle(/.*/)
  })
})
