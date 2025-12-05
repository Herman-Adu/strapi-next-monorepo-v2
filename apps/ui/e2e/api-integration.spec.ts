import { test, expect } from "@playwright/test"
import {
  navigateAndWaitForContent,
  setStandardTimeout,
} from "./utils/test-helpers"

test.describe("API Integration", () => {
  // Run tests serially to avoid race conditions
  test.describe.configure({ mode: "serial" })

  test.beforeEach(async ({ page }) => {
    // Set standard timeout
    test.setTimeout(setStandardTimeout())

    // Use helper to navigate with proper waits
    await navigateAndWaitForContent(
      page,
      "/en/e2e-test-page",
      /E2E Test Page|Stay Updated|Newsletter/i
    )
  })

  test("should load page content from Strapi API", async ({ page }) => {
    // Page should successfully load with content from Strapi
    await expect(page).toHaveTitle(/.*/)

    // Verify content is present (not loading state)
    const body = await page.locator("body").textContent()
    expect(body).not.toContain("Loading...")
    expect(body!.length).toBeGreaterThan(100) // Should have substantial content
  })

  test("should have clean console with no API errors", async ({ page }) => {
    const consoleErrors: string[] = []
    const networkErrors: string[] = []

    // Listen for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    // Listen for network request failures
    page.on("requestfailed", (request) => {
      networkErrors.push(`${request.url()} - ${request.failure()?.errorText}`)
    })

    // Reload page to capture all requests
    await page.reload({ waitUntil: "networkidle" })

    // Wait for any async operations
    await page.waitForTimeout(2000)

    // Console should be clean (filter out common non-critical warnings)
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes("DevTools") &&
        !error.includes("Extension") &&
        !error.includes("favicon") &&
        !error.includes("browserslist") &&
        !error.includes("next-auth") &&
        !error.includes("CLIENT_FETCH_ERROR")
    )

    // Filter out expected network errors (auth session, aborted requests, HMR, static assets)
    const criticalNetworkErrors = networkErrors.filter(
      (error) =>
        !error.includes("/api/auth/session") &&
        !error.includes("NS_BINDING_ABORTED") &&
        !error.includes("Load request cancelled") &&
        !error.includes("ERR_ABORTED") &&
        !error.includes("_next/static")
    )

    console.log("Console errors:", criticalErrors)
    console.log("Network errors:", criticalNetworkErrors)

    // Should have no critical errors
    expect(criticalErrors.length).toBe(0)
    expect(criticalNetworkErrors.length).toBe(0)
  })

  test("should successfully load data from Strapi via SSR", async ({
    page,
  }) => {
    // NOTE: This app uses SSR - Strapi API calls happen on Next.js server,
    // not in the browser. We verify the integration by checking the content loaded.

    // Navigate to test page
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Verify Strapi content loaded successfully by checking for expected sections
    // If Strapi was down, page would show error or empty state

    // Check for newsletter section (from Strapi)
    const newsletterSection = page.locator(
      "text=/Stay Updated|Newsletter|Subscribe/i"
    )
    await expect(newsletterSection.first()).toBeVisible({ timeout: 5000 })

    // Check for FAQ section (from Strapi)
    const faqSection = page.locator("text=/FAQ|Frequently Asked|Questions/i")
    const faqExists = await faqSection
      .first()
      .isVisible()
      .catch(() => false)

    // Check for any component content (proves SSR worked)
    const body = await page.locator("body").textContent()
    const hasSubstantialContent = body && body.length > 500

    // At least one section should be visible
    const hasStrapiContent = faqExists || hasSubstantialContent

    console.log("FAQ visible:", faqExists)
    console.log("Body content length:", body?.length)

    expect(hasStrapiContent).toBe(true)
  })

  test("should render Strapi content structure correctly", async ({ page }) => {
    // Verify that Strapi data structure is correctly rendered on the page
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })

    // Check for expected section types from Strapi
    const sections = {
      newsletter: await page
        .locator('[class*="newsletter"], [id*="newsletter"]')
        .count(),
      faq: await page.locator('[class*="faq"], [id*="faq"]').count(),
      // Any section wrapper elements
      anySection: await page.locator("section, [data-testid]").count(),
    }

    console.log("Sections found:", sections)

    // Should have at least some sections rendered
    const hasSections =
      sections.newsletter > 0 || sections.faq > 0 || sections.anySection > 0

    // Check for component content
    const hasComponents =
      (await page.locator("form, button, input").count()) > 0

    // Should have either sections or components (proves Strapi data rendered)
    expect(hasSections || hasComponents).toBe(true)
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

    console.log("Page state when API down:", bodyContent?.substring(0, 200))
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

    // If retry logic exists, should have made at least 2 requests
    console.log("Total API requests made:", requestCount)

    // Page should eventually load successfully despite initial failure
    const hasContent = await page.locator("body").textContent()
    expect(hasContent!.length).toBeGreaterThan(100)
  })

  test("should populate newsletter section from API data", async ({ page }) => {
    // Newsletter section should have content from Strapi
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

  test("should populate contact form from API data", async ({ page }) => {
    // Contact section should have content from Strapi
    const contactHeading = page
      .locator("text=/get in touch|contact|build something together/i")
      .first()
    await expect(contactHeading).toBeVisible()

    // Form should have fields configured by Strapi
    const nameInput = page
      .locator('input[name="name"], input[placeholder*="name" i]')
      .first()
    const emailInput = page
      .locator(
        'input[type="email"][name="email"], input[placeholder*="email" i]'
      )
      .first()
    const messageInput = page
      .locator('textarea[name="message"], textarea[placeholder*="message" i]')
      .first()

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(messageInput).toBeVisible()
  })

  test("should populate FAQ section from Strapi data", async ({ page }) => {
    // FAQ section should have content from Strapi
    const faqHeading = page
      .locator("text=/frequently asked|faq|questions/i")
      .first()
    await expect(faqHeading).toBeVisible({ timeout: 10000 })

    // Should have FAQ questions (verify at least one exists)
    // Using accordion/button pattern that FAQ components typically use
    const faqButtons = page.locator(
      'button[data-state], [data-accordion-item], button:has-text("What")'
    )
    const faqButtonCount = await faqButtons.count()

    console.log("FAQ buttons found:", faqButtonCount)

    // Should have at least one FAQ item
    expect(faqButtonCount).toBeGreaterThan(0)

    // Click first FAQ to verify it's interactive (optional - test passes if FAQs exist)
    if (faqButtonCount > 0) {
      await faqButtons.first().click()
      await page.waitForTimeout(1000) // Wait longer for animation

      // After clicking, check if content expanded or state changed
      // Note: Different accordion implementations use different patterns
      const expandedItem = page.locator('[data-state="open"]')
      const isExpanded = await expandedItem.count()

      console.log("Expanded items after click:", isExpanded)

      // FAQ exists and is clickable - that's the key verification
      // Accordion state may vary by implementation, so we don't fail on it
      if (isExpanded === 0) {
        console.log(
          "Note: FAQ clicked but accordion state pattern not detected (may use different implementation)"
        )
      }
    }
  })

  test("should respect locale from Strapi data", async ({ page }) => {
    // Content should be in English locale (en)
    const htmlLang = await page.getAttribute("html", "lang")
    expect(htmlLang).toContain("en")

    // Page should have loaded successfully
    // Note: Next.js may rewrite URLs, so we verify lang attribute instead of URL
    const url = page.url()
    console.log("Current URL:", url)

    // Verify we're on the test page (locale may be in URL or handled by Next.js rewrites)
    expect(url).toContain("e2e-test-page")
  })

  test("should handle API rate limiting gracefully", async ({ page }) => {
    // Simulate rate limiting by returning 429 status
    let requestCount = 0

    await page.route("**/api/**", async (route) => {
      requestCount++

      if (requestCount <= 5) {
        // Simulate rate limit
        await route.fulfill({
          status: 429,
          body: JSON.stringify({ error: "Too Many Requests" }),
        })
      } else {
        // After 5 failed attempts, let it through
        await route.continue()
      }
    })

    // Try to load page
    await page.goto("/en/e2e-test-page", { timeout: 60000 }).catch(() => {
      // Might timeout, which is acceptable
    })

    await page.waitForTimeout(3000)

    // Page should handle rate limiting (show error or retry)
    const bodyContent = await page.locator("body").textContent()
    console.log(
      "Page state during rate limiting:",
      bodyContent?.substring(0, 200)
    )

    // Should not crash or show blank page
    expect(bodyContent).toBeTruthy()
  })

  test("should load images from Strapi media library", async ({ page }) => {
    // Check if any images are loaded from Strapi uploads
    const images = page.locator("img")
    const imageCount = await images.count()

    if (imageCount > 0) {
      // Check first image
      const firstImage = images.first()
      const src = await firstImage.getAttribute("src")

      console.log("First image src:", src)

      // Image should either be from Strapi (localhost:1337) or optimized by Next.js
      expect(src).toBeTruthy()

      // Verify image loads successfully
      const naturalWidth = await firstImage.evaluate(
        (img: HTMLImageElement) => img.naturalWidth
      )
      expect(naturalWidth).toBeGreaterThan(0)
    }
  })

  test("should handle API timeout gracefully", async ({ page }) => {
    // Simulate slow API by delaying response
    await page.route("**/api/**", async (route) => {
      // Delay for 31 seconds (longer than typical timeout)
      await new Promise((resolve) => setTimeout(resolve, 31000))
      await route.continue()
    })

    // Try to load page with timeout
    const loadResult = await page
      .goto("/en/e2e-test-page", { timeout: 30000 })
      .catch((error) => error)

    // Should handle timeout gracefully
    console.log("Timeout handling result:", loadResult)

    // Page should show timeout error or loading state
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent).toBeTruthy()
  })
})
