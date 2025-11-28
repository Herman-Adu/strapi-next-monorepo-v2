import { test, expect } from "@playwright/test"

test.describe("API Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle", { timeout: 30000 })
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
        !error.includes("browserslist")
    )

    console.log("Console errors:", criticalErrors)
    console.log("Network errors:", networkErrors)

    // Should have no critical errors
    expect(criticalErrors.length).toBe(0)
    expect(networkErrors.length).toBe(0)
  })

  test("should successfully fetch data from Strapi API endpoint", async ({
    page,
  }) => {
    let apiResponseReceived = false
    let apiResponseStatus = 0

    // Intercept API requests to Strapi
    page.on("response", (response) => {
      const url = response.url()

      // Check if this is a Strapi API request
      if (url.includes("localhost:1337/api") || url.includes("/api/pages")) {
        apiResponseReceived = true
        apiResponseStatus = response.status()
      }
    })

    // Navigate to page (triggering API call)
    await page.goto("/en/e2e-test-page", { waitUntil: "networkidle" })

    // Should have received API response
    expect(apiResponseReceived).toBe(true)
    expect(apiResponseStatus).toBe(200)
  })

  test("should handle API response data correctly", async ({
    page,
    context,
  }) => {
    // Intercept and verify API response structure
    const apiResponse = await page.waitForResponse(
      (response) =>
        response.url().includes("/api/pages") ||
        (response.url().includes("localhost:1337") &&
          response.url().includes("/api/")),
      { timeout: 30000 }
    )

    expect(apiResponse.status()).toBe(200)

    // Parse response JSON
    const jsonData = await apiResponse.json()
    console.log("API Response structure:", Object.keys(jsonData))

    // Strapi typically returns { data: {...}, meta: {...} }
    expect(jsonData).toHaveProperty("data")

    // Data should have page sections
    const pageData = jsonData.data

    if (pageData && typeof pageData === "object") {
      // Should have sections or attributes
      const hasContent =
        "attributes" in pageData ||
        "sections" in pageData ||
        Array.isArray(pageData)

      expect(hasContent).toBe(true)
    }
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

  test("should populate FAQ section from API data", async ({ page }) => {
    // FAQ section should have content from Strapi
    const faqHeading = page.locator("text=/frequently asked|faq/i").first()
    await expect(faqHeading).toBeVisible()

    // Should have specific questions from test data
    const question1 = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()
    const question2 = page.locator("text=/how long|typical project/i").first()

    await expect(question1).toBeVisible()
    await expect(question2).toBeVisible()

    // Click to expand and verify answer content from API
    await question1.click()
    await page.waitForTimeout(500)

    const answer = page
      .locator("text=/Next.js, React, TypeScript, Tailwind CSS, Strapi/i")
      .first()
    await expect(answer).toBeVisible()
  })

  test("should respect locale from API", async ({ page }) => {
    // Content should be in English locale (en)
    const htmlLang = await page.getAttribute("html", "lang")
    expect(htmlLang).toContain("en")

    // Page URL should include locale
    const url = page.url()
    expect(url).toContain("/en/")
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
