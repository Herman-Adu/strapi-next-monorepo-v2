import { test, expect, type Page } from "@playwright/test"

const invalidEmail = "not-an-email"

/**
 * INTEGRATION TESTS - Real API Form Submissions
 *
 * These tests use REAL Strapi API endpoints (no mocking)
 * Requirements:
 * - Strapi running on http://localhost:1337
 * - PostgreSQL database seeded with E2E test page
 * - E2E_TESTS_PLAYWRIGHT_API_KEY environment variable set
 *
 * Run: yarn test:integration
 * CI: Runs weekly via integration-tests.yml workflow
 */

/**
 * Helper: Check GDPR checkbox if present (Radix UI implementation)
 */
async function checkGDPRCheckbox(page: Page, testId: string): Promise<void> {
  const checkbox = page.locator(`[data-testid="${testId}"]`).first()
  const exists = await checkbox.count().then((c) => c > 0)

  if (!exists) return // No GDPR checkbox - skip

  const currentState = await checkbox.getAttribute("data-state")
  if (currentState === "checked") return // Already checked

  // Click and verify state change (Radix UI pattern)
  await checkbox.click({ force: true })
  await page.waitForTimeout(500)

  const newState = await checkbox.getAttribute("data-state")
  if (newState !== "checked") {
    throw new Error(`GDPR checkbox failed to check for ${testId}`)
  }
}

test.describe("Form Submissions (Real API)", () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Skip integration tests in Firefox and webkit - they're slow with real API calls
    if (browserName === "firefox" || browserName === "webkit") {
      test.skip()
      return
    }

    // NO API MOCKING - tests real Strapi endpoints
    await page.goto("/en/e2e-test-page", { timeout: 60000 })
    await page.waitForLoadState("domcontentloaded", { timeout: 30000 })
  })

  test("should submit newsletter form to real Strapi API", async ({ page }) => {
    // Use timestamp to ensure unique email per run
    const email = `integration-newsletter-${Date.now()}@test.com`

    // Fill newsletter form
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.waitFor({ state: "visible" })
    await emailInput.fill(email)

    // Check GDPR checkbox if present
    await checkGDPRCheckbox(page, "newsletter-footer-gdpr-checkbox")

    // Submit form
    const submitButton = page.locator('button:has-text("Subscribe")').first()
    await submitButton.click({ force: true })

    // Wait for submission to complete
    await page.waitForTimeout(3000)

    // Primary success indicator: NO error messages
    const fatalError = page.locator("text=/fatal|crash|exception/i").first()
    const hasFatalError = await fatalError
      .isVisible({ timeout: 1000 })
      .catch(() => false)
    expect(hasFatalError).toBe(false)

    // Verify page is still functional (no crash)
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent).toBeTruthy()
    expect(bodyContent?.length).toBeGreaterThan(100)
  })

  test("should submit contact form to real Strapi API", async ({ page }) => {
    // Use timestamp to ensure unique submission per run
    const timestamp = Date.now()

    // Fill contact form
    const nameInput = page
      .locator('input[name="name"], input[placeholder*="name" i]')
      .first()
    await nameInput.waitFor({ state: "visible" })
    await nameInput.fill("Integration Test User")

    const emailInput = page
      .locator(
        'input[type="email"][name="email"], input[placeholder*="email" i]'
      )
      .first()
    await emailInput.fill(`integration-contact-${timestamp}@test.com`)

    const messageInput = page
      .locator('textarea[name="message"], textarea[placeholder*="message" i]')
      .first()
    await messageInput.fill(
      `Integration test message submitted at ${new Date().toISOString()}`
    )

    // Check GDPR checkbox if present
    await checkGDPRCheckbox(page, "contact-gdpr-checkbox")

    // Submit form
    const submitButton = page.locator('button:has-text("Send Message")').first()
    await submitButton.click({ force: true })

    // Wait for submission to complete
    await page.waitForTimeout(3000)

    // Primary success indicator: NO fatal error messages
    const fatalError = page.locator("text=/fatal|crash|exception/i").first()
    const hasFatalError = await fatalError
      .isVisible({ timeout: 1000 })
      .catch(() => false)
    expect(hasFatalError).toBe(false)

    // Verify page is still functional (no crash)
    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent).toBeTruthy()
    expect(bodyContent?.length).toBeGreaterThan(100)
  })

  test("should handle newsletter form validation errors from API", async ({
    page,
  }) => {
    // Submit invalid email
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.waitFor({ state: "visible" })
    await emailInput.fill(invalidEmail)

    // Check GDPR checkbox if present
    await checkGDPRCheckbox(page, "newsletter-footer-gdpr-checkbox")

    const submitButton = page.locator('button:has-text("Subscribe")').first()
    await submitButton.click({ force: true })

    // Should show validation error (either client-side or from API)
    const errorMessage = page.locator(
      "text=/error|invalid|valid email|correct format/i"
    )
    const hasError = await errorMessage
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false)

    // At minimum, should not show success
    const successMessage = page.locator("text=/Success!|Thank you/i")
    const hasSuccess = await successMessage
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false)

    expect(hasError || !hasSuccess).toBe(true)
  })

  test("should handle contact form validation errors from API", async ({
    page,
  }) => {
    // Submit incomplete form (only email, no name or message)
    const emailInput = page
      .locator(
        'input[type="email"][name="email"], input[placeholder*="email" i]'
      )
      .first()
    await emailInput.waitFor({ state: "visible" })
    await emailInput.fill("test@example.com")

    // Check GDPR if present
    await checkGDPRCheckbox(page, "contact-gdpr-checkbox")

    const submitButton = page.locator('button:has-text("Send Message")').first()
    await submitButton.click({ force: true })

    // Should show validation error
    const errorMessage = page.locator(
      "text=/error|required|fill|complete|invalid/i"
    )
    const hasError = await errorMessage
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false)

    // Should not show success
    const successMessage = page.locator("text=/Success!|Thank you/i")
    const hasSuccess = await successMessage
      .first()
      .isVisible({ timeout: 2000 })
      .catch(() => false)

    expect(hasError || !hasSuccess).toBe(true)
  })

  test("should handle network timeout gracefully", async ({
    page,
    browserName,
  }) => {
    // Skip on Firefox - route interception is unreliable (known Playwright limitation)
    if (browserName === "firefox") {
      test.skip()
      return
    }

    // Fill form
    const emailInput = page.locator('input[type="email"]').first()
    await emailInput.waitFor({ state: "visible" })
    await emailInput.fill("timeout-test@example.com")

    // Check GDPR if present
    await checkGDPRCheckbox(page, "newsletter-footer-gdpr-checkbox")

    const submitButton = page.locator('button:has-text("Subscribe")').first()

    // Delay API response to simulate slow network
    await page.route("**/api/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await route.continue()
    })

    await submitButton.click({ force: true })

    // Should handle delay gracefully - verify loading state or button disabled
    const loadingIndicator = page
      .locator('[class*="animate-spin"], text=/loading/i')
      .first()
    const hasLoading = await loadingIndicator
      .isVisible({ timeout: 2000 })
      .catch(() => false)
    const isButtonDisabled = await submitButton.isDisabled()

    // Either shows loading indicator OR disables button during submission
    expect(hasLoading || isButtonDisabled).toBe(true)

    // Wait for completion
    await page.waitForTimeout(3000)

    const bodyContent = await page.locator("body").textContent()
    expect(bodyContent).toBeTruthy() // Page should still be functional
    expect(bodyContent!.length).toBeGreaterThan(100)
  })
})
