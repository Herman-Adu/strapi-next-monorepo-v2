/// <reference lib="dom" />
import { test, expect } from "@playwright/test"
import {
  navigateAndWaitForContent,
  checkGDPRCheckboxIfPresent,
} from "./utils/test-helpers"

test.describe("Error Handling", () => {
  // Run tests serially to avoid dev server exhaustion from rapid navigations
  test.describe.configure({ mode: "serial" })

  test("should display 404 page for non-existent routes", async ({
    page,
    browserName,
  }) => {
    // Increase timeout for all browsers
    test.setTimeout(90000)

    // No API mocking for 404 test
    await page.goto("/en/this-page-does-not-exist-12345", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    })

    // Wait for page content to render
    await page.locator("body").waitFor({ state: "visible", timeout: 10000 })

    // Should show 404 page content (status check removed - Next.js dev mode returns 200)
    const bodyContent = await page.locator("body").textContent()
    const has404Content =
      bodyContent!.toLowerCase().includes("404") ||
      bodyContent!.toLowerCase().includes("not found") ||
      bodyContent!.toLowerCase().includes("page not found")

    expect(has404Content).toBe(true)

    // Should have 404 visual elements
    const pageContent = await page.locator("main, body").textContent()
    expect(pageContent).toBeTruthy()
  })

  test("should handle malformed URLs gracefully", async ({ page }) => {
    // Try to navigate to malformed URL
    await page
      .goto("/en/test page with spaces and special chars!!!@#$", {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      })
      .catch((error) => error)

    // Should either redirect, show 404, or handle gracefully
    // Wait for content to be visible
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Page should not crash
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent).toBeTruthy()
  })

  test("should handle JavaScript errors gracefully", async ({ page }) => {
    const jsErrors: string[] = []

    // Listen for JavaScript errors
    page.on("pageerror", (error) => {
      jsErrors.push(error.message)
    })

    // Navigate to test page
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Wait for page to render
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })
    await page.waitForLoadState("load")

    // Should have minimal or no JavaScript errors
    const criticalErrors = jsErrors.filter(
      (error) =>
        !error.includes("Extension") &&
        !error.includes("DevTools") &&
        !error.includes("favicon")
    )

    expect(criticalErrors.length).toBe(0)
  })

  test("should handle network offline state", async ({ page, context }) => {
    // First verify page works online
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Go offline
    await context.setOffline(true)

    // Try to navigate - should fail
    await page
      .goto("/en/another-page", {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      })
      .catch((error) => error)

    // Go back online
    await context.setOffline(false)

    // Try again - should succeed
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent!.length).toBeGreaterThan(100)
  })

  test("should handle form submission network errors", async ({ page }) => {
    // Block form submission endpoints BEFORE navigation
    await page.route("**/api/newsletter", (route) => route.abort())
    await page.route("**/api/contact", (route) => route.abort())
    await page.route("**/api/submit", (route) => route.abort())

    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Wait for page content
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Try to submit newsletter
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    await emailInput.fill("error@test.com")

    // Check GDPR checkbox to enable submit button
    await checkGDPRCheckboxIfPresent(page, { submitButton })

    await submitButton.click()

    // Wait for error handling to complete
    await page.waitForLoadState("load")

    // Should show error message or maintain form state
    const errorMessage = page.locator("text=/error|failed|wrong|try again/i")
    const hasError = await errorMessage
      .isVisible({ timeout: 2000 })
      .catch(() => false)

    // Form should not crash or show success state
    const successMessage = page.locator("text=/thank you|subscribed|success/i")
    const hasSuccess = await successMessage
      .isVisible({ timeout: 2000 })
      .catch(() => false)

    // Should show error OR not show success (graceful degradation)
    expect(hasError || !hasSuccess).toBe(true)
  })

  test("should handle missing images gracefully", async ({ page }) => {
    // Navigate with image interception to cause 404s
    await page.route("**/*.{png,jpg,jpeg,svg,webp,gif}", (route) => {
      route.abort()
    })

    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Phase 3&4 visibility pattern
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })
    await page
      .locator("h1, h2, main")
      .first()
      .waitFor({ state: "visible", timeout: 5000 })

    // Page should still render even with missing images
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent!.length).toBeGreaterThan(100)

    // Check that broken images have alt text or fallback
    const images = page.locator("img")
    const imageCount = await images.count()

    if (imageCount > 0) {
      const firstImage = images.first()

      // Wait for image to be in DOM (even if broken)
      await firstImage.waitFor({ state: "attached", timeout: 3000 })

      const alt = await firstImage.getAttribute("alt")

      // Should have meaningful alt text or empty string (not null)
      expect(alt).not.toBeNull()
    }
  })

  test("should handle CSS loading failures", async ({ page }) => {
    // Block CSS files
    await page.route("**/*.css", (route) => route.abort())

    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Phase 3&4 visibility pattern
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Content should still be present and readable (even if unstyled)
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent!.length).toBeGreaterThan(100)

    // Text should be visible (accessible without styles)
    const heading = page.locator("h1, h2, h3").first()

    // Wait for heading to exist in DOM
    await heading.waitFor({ state: "attached", timeout: 5000 })

    // At minimum, heading should exist in DOM
    const headingCount = await page.locator("h1, h2, h3").count()
    expect(headingCount).toBeGreaterThan(0)
  })

  test("should handle localStorage unavailable", async ({ page }) => {
    // Inject script to disable localStorage
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("localStorage is disabled")
        },
      })
    })

    // Page should still load despite localStorage errors
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Wait for page to render
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent!.length).toBeGreaterThan(100)
  })

  test("should handle slow network (3G simulation)", async ({
    page,
    context,
  }) => {
    // Simulate slow 3G network
    await context.route("**/*", async (route) => {
      // Add 500ms delay to all requests
      await new Promise((resolve) => setTimeout(resolve, 500))
      await route.continue()
    })

    await page.goto("/en/e2e-test-page", {
      waitUntil: "networkidle",
      timeout: 60000,
    })

    // Page should eventually load
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent!.length).toBeGreaterThan(100)

    // Should show loading states during slow load
    // This documents the UX during slow connections
  })

  test("should handle invalid API response data", async ({ page }) => {
    // Intercept API and return invalid JSON
    await page.route("**/api/pages*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{ invalid json",
      })
    })

    // Try to load page
    await page.goto("/en/e2e-test-page", { timeout: 30000 }).catch(() => {
      // Might fail, which is acceptable
    })

    await page.waitForLoadState("domcontentloaded")

    // Should show error state or fallback content
    const bodyContent = await page.locator("body").textContent()

    expect(bodyContent).toBeTruthy()
  })

  test("should handle CORS errors gracefully", async ({ page }) => {
    // This test verifies CORS is properly configured
    const corsErrors: string[] = []

    page.on("console", (msg) => {
      if (msg.text().toLowerCase().includes("cors")) {
        corsErrors.push(msg.text())
      }
    })

    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Wait for page to render
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })
    await page.waitForLoadState("load")

    // Should not have CORS errors when accessing Strapi API
    expect(corsErrors.length).toBe(0)
  })

  test("should handle browser back/forward navigation", async ({
    page,
    browserName,
  }) => {
    // Increase timeout for slower browsers (firefox, webkit)
    if (browserName === "firefox" || browserName === "webkit") {
      test.setTimeout(90000)
    }

    // Navigate to test page
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Expand an accordion (if FAQ exists)
    const faqButtons = page.locator(
      'button[data-state], [data-accordion-item], button:has-text("What")'
    )

    await faqButtons
      .first()
      .waitFor({ state: "visible", timeout: 5000 })
      .catch(() => {})
    const faqButtonCount = await faqButtons.count()

    if (faqButtonCount > 0) {
      await faqButtons.first().click()
      // Accordion click is synchronous, no wait needed
    }

    // Navigate to another page
    await navigateAndWaitForContent(page, "/en", /Home|Services|Contact/i)
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Go back
    await page.goBack({ waitUntil: "domcontentloaded" })
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Page should reload correctly
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent).toContain("FAQ")
  })

  test("should handle rapid page navigations", async ({ page }) => {
    // Navigate to page
    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Rapidly navigate away and back (reduced from 5 to 3 navigations)
    await navigateAndWaitForContent(page, "/en", /Home|Services|Contact/i, {
      timeout: 30000,
    })
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    // Page should load correctly after rapid navigation
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent!.length).toBeGreaterThan(100)
  })

  test("should handle page reload during form submission", async ({ page }) => {
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.locator("body").waitFor({ state: "visible", timeout: 5000 })

    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    // Phase 3&4 pattern: Wait for input to be visible before filling
    await emailInput.waitFor({ state: "visible" })
    await emailInput.fill("reload@test.com")

    // Check GDPR checkbox to enable submit button
    await checkGDPRCheckboxIfPresent(page, { submitButton })

    await submitButton.click()

    // Immediately reload page during submission (use domcontentloaded)
    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForLoadState("load")

    // Page should reload cleanly without errors
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent!.length).toBeGreaterThan(100)

    // Form should be reset (not stuck in loading state)
    const emailInputAfterReload = page.locator('input[type="email"]').first()
    const isDisabled = await emailInputAfterReload.isDisabled()
    expect(isDisabled).toBe(false)
  })

  test("should handle window resize during interactions", async ({ page }) => {
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Desktop size
    await page.setViewportSize({ width: 1920, height: 1080 })

    // Expand accordion (if FAQ exists)
    const faqButtons = page.locator(
      'button[data-state], [data-accordion-item], button:has-text("What")'
    )
    const faqButtonCount = await faqButtons.count()

    if (faqButtonCount > 0) {
      await faqButtons.first().click()
      // Accordion click is synchronous
    }

    // Resize to mobile during interaction
    await page.setViewportSize({ width: 375, height: 667 })

    // Accordion should still work after resize (optional check)
    // Page should remain functional
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent!.length).toBeGreaterThan(100)
  })
})
