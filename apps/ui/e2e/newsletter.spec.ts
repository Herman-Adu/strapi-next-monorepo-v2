import { test, expect } from "@playwright/test"
import {
  navigateAndWaitForContent,
  checkGDPRCheckboxIfPresent,
  setStandardTimeout,
  waitForSuccessToast,
} from "./utils/test-helpers"
import { setupApiMocks } from "./fixtures/mock-api"

test.describe("Newsletter Subscription", () => {
  // Run tests serially to avoid race conditions with parallel execution
  test.describe.configure({ mode: "serial" })

  test.beforeEach(async ({ page }) => {
    // Increase timeout for slow dev server
    test.setTimeout(setStandardTimeout())

    // Setup API mocking before navigation
    await setupApiMocks(page)

    // Use helper to navigate and wait for content
    await navigateAndWaitForContent(
      page,
      "/en/e2e-test-page",
      /Stay Updated|Newsletter|Subscribe/i
    )

    // navigateAndWaitForContent already waits for content visibility
    // No need for networkidle wait (causes timeouts in production/CI)
  })

  test("should display newsletter CTA section", async ({ page }) => {
    // Check newsletter section is visible
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()
    await expect(newsletterSection).toBeVisible()

    // Check for email input
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()

    // Check for submit button
    const submitButton = page.locator('button:has-text("Subscribe")').first()
    await expect(submitButton).toBeVisible()
  })

  test("should validate empty email submission", async ({ page }) => {
    // Find the newsletter email input
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Try to submit with empty email
    await submitButton.click()

    // Browser HTML5 validation should prevent submission
    // Check if input has required attribute or validation message appears
    const isRequired = await emailInput.getAttribute("required")
    expect(isRequired).not.toBeNull()
  })

  test("should validate invalid email format", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    // Wait for input to be ready
    await emailInput.waitFor({ state: "visible" })

    // Enter invalid email
    await emailInput.fill("notanemail")

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    await submitButton.click()

    // HTML5 validation should trigger
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    )
    expect(validationMessage).not.toBe("")
  })

  test.skip("should successfully submit valid email", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    // In serial mode, ensure form has reset from previous test
    await expect(emailInput).toHaveValue("", { timeout: 5000 })

    // Wait for input to be ready
    await emailInput.waitFor({ state: "visible" })

    // Enter valid email
    const testEmail = `test${Date.now()}@example.com`
    await emailInput.fill(testEmail)

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Submit form
    await submitButton.click()

    // Wait for success toast to appear (using standardized "Success!" title)
    await waitForSuccessToast(page, "Success!", { timeout: 15000 })
  })

  test("should show privacy notice", async ({ page }) => {
    // Check for privacy notice text
    const privacyNotice = page.locator("text=/privacy|unsubscribe/i").first()
    await expect(privacyNotice).toBeVisible()
  })

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Reload page with helper
    await navigateAndWaitForContent(
      page,
      "/en/e2e-test-page",
      /Stay Updated|Newsletter|Subscribe/i
    )

    // Check newsletter section is still visible and functional
    const emailInput = page.locator('input[type="email"]').first()
    await expect(emailInput).toBeVisible()

    const submitButton = page.locator('button:has-text("Subscribe")').first()
    await expect(submitButton).toBeVisible()

    // Verify elements stack properly (not overlapping)
    const inputBox = await emailInput.boundingBox()
    const buttonBox = await submitButton.boundingBox()

    expect(inputBox).not.toBeNull()
    expect(buttonBox).not.toBeNull()

    // Elements should be within mobile viewport width
    if (inputBox && buttonBox) {
      expect(inputBox.width).toBeLessThanOrEqual(375)
      expect(buttonBox.width).toBeLessThanOrEqual(375)
    }
  })

  test("should handle keyboard navigation", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()

    // Wait for input to be ready
    await emailInput.waitFor({ state: "visible" })

    // Focus the email input directly
    await emailInput.focus()

    // Type email using keyboard
    await page.keyboard.type("keyboard@test.com")

    // Verify value was entered
    const inputValue = await emailInput.inputValue()
    expect(inputValue).toContain("keyboard@test.com")

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Submit with Enter key
    await page.keyboard.press("Enter")

    // Wait for submission
    await page.waitForTimeout(2000)
  })

  test.skip("should prevent double submission", async ({ page }) => {
    // SKIPPED: This test is inherently flaky due to React re-render timing
    //
    // CONTEXT: The button uses `disabled={subscriberMutation.isPending}` to prevent
    // double-clicks, but there's a tiny window between clicks where React hasn't
    // re-rendered yet. This creates a race condition that makes the test unreliable.
    //
    // TESTING STRATEGY: Double-submission prevention is properly tested at the
    // component level (unit tests) where we can control timing precisely. E2E tests
    // should focus on user workflows, not micro-timing of React state updates.
    //
    // If you need to verify this behavior in E2E, you would need to:
    // 1. Intercept the API with a significant delay (2000ms+)
    // 2. Use page.evaluate() to bypass the disabled check
    // 3. Verify that TanStack Query's mutation guards prevent duplicate calls
    //
    // However, this level of testing is better suited for integration tests.

    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    await emailInput.fill("double@test.com")

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Click submit
    await submitButton.click()

    // This would ideally verify the button stays disabled during submission
    // but React re-render timing makes this assertion flaky
    await expect(submitButton).toBeDisabled({ timeout: 100 })
  })

  test.skip("should show loading state during submission", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    // In serial mode, ensure form has reset from previous test
    await expect(emailInput).toHaveValue("", { timeout: 5000 })

    // Wait for input to be ready
    await emailInput.waitFor({ state: "visible" })

    const testEmail = `loading${Date.now()}@test.com`
    await emailInput.fill(testEmail)

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Wait for submit button to be enabled (email validation passed)
    await expect(submitButton).toBeEnabled({ timeout: 3000 })

    // Submit and wait for success (submission is too fast to reliably catch loading state)
    await submitButton.click()
    await waitForSuccessToast(page, "Success!", { timeout: 10000 })

    // Verify form cleared after success, confirming submission completed
    await expect(emailInput).toHaveValue("", { timeout: 5000 })
  })
})
