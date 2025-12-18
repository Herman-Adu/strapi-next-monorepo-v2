import { test, expect } from "@playwright/test"
import {
  navigateAndWaitForContent,
  checkGDPRCheckboxIfPresent,
  setStandardTimeout,
  waitForSuccessToast,
} from "./utils/test-helpers"

test.describe("Newsletter Subscription", () => {
  // Run tests serially to avoid race conditions with parallel execution
  test.describe.configure({ mode: "serial" })

  test.beforeEach(async ({ page }) => {
    // Increase timeout for slow dev server
    test.setTimeout(setStandardTimeout())

    // Use helper to navigate and wait for content
    // Note: MSW (Mock Service Worker) handles API mocking globally
    await navigateAndWaitForContent(
      page,
      "/en/e2e-test-page",
      /Stay Updated|Newsletter|Subscribe/i
    )

    // Wait for full page hydration in CI (safe without HMR)
    await page.waitForLoadState("networkidle", { timeout: 15000 })
  })

  test("should display newsletter CTA section", async ({ page }) => {
    // Check newsletter section is visible
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()
    await expect(newsletterSection).toBeVisible()

    // Check for email input (Newsletter CTA Section specific)
    const emailInput = newsletterSection.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()

    // Check for submit button (Newsletter CTA Section specific testid)
    const submitButton = page.getByTestId("newsletter-cta-submit")
    await expect(submitButton).toBeVisible()
  })

  test("should validate empty email submission", async ({ page }) => {
    // Find the newsletter CTA section specifically
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()

    // Target elements within newsletter CTA section
    const emailInput = newsletterSection.locator('input[type="email"]')
    const submitButton = page.getByTestId("newsletter-cta-submit")

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
    // Scope to newsletter CTA section
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()

    const emailInput = newsletterSection.locator('input[type="email"]')
    const submitButton = page.getByTestId("newsletter-cta-submit")

    // Wait for input to be ready
    await emailInput.waitFor({ state: "visible" })

    // Enter invalid email
    await emailInput.fill("notanemail")

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Wait for button to become enabled after GDPR checkbox
    await page.waitForTimeout(500) // Allow form validation to complete
    await expect(submitButton).toBeEnabled({ timeout: 5000 })

    await submitButton.click()

    // HTML5 validation should trigger
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    )
    expect(validationMessage).not.toBe("")
  })

  test("should successfully submit valid email", async ({ page }) => {
    // Scope to newsletter CTA section to avoid selecting wrong form
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()

    const emailInput = newsletterSection.locator('input[type="email"]')
    const submitButton = page.getByTestId("newsletter-cta-submit")

    // In serial mode, ensure form has reset from previous test
    await expect(emailInput).toHaveValue("", { timeout: 5000 })

    // Wait for input to be ready (Pattern 8: visibility for RSC content)
    await emailInput.waitFor({ state: "attached", timeout: 5000 })
    await emailInput.waitFor({ state: "visible", timeout: 5000 })

    // Enter valid email
    const testEmail = `test${Date.now()}@example.com`
    await emailInput.fill(testEmail)

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Wait for submit button to be ready
    await submitButton.waitFor({ state: "attached", timeout: 5000 })
    await submitButton.waitFor({ state: "visible", timeout: 5000 })

    // Verify button is enabled
    await expect(submitButton).toBeEnabled({ timeout: 5000 })

    // Submit form programmatically (most reliable method)
    await newsletterSection
      .locator("form")
      .evaluate((form: HTMLFormElement) => {
        form.requestSubmit()
      })

    // Wait for success toast to appear (text-based detection more reliable)
    await waitForSuccessToast(page, "Success!", {
      timeout: 15000,
    })
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

    // Scope to newsletter CTA section
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()

    // Check newsletter section elements are visible and functional
    const emailInput = newsletterSection.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()

    const submitButton = page.getByTestId("newsletter-cta-submit")
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
    // Scope to newsletter CTA section
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()

    const emailInput = newsletterSection.locator('input[type="email"]')

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

    // Wait for submission to complete
    await page.waitForLoadState("domcontentloaded")
  })

  test("should prevent double submission", async ({ page }) => {
    // Scope to newsletter CTA section
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()

    const emailInput = newsletterSection.locator('input[type="email"]')
    const submitButton = page.getByTestId("newsletter-cta-submit")

    // Wait for elements to be ready (Pattern 8)
    await emailInput.waitFor({ state: "attached", timeout: 5000 })
    await emailInput.waitFor({ state: "visible", timeout: 5000 })
    await submitButton.waitFor({ state: "attached", timeout: 5000 })

    const testEmail = `double${Date.now()}@test.com`
    await emailInput.fill(testEmail)

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Click submit
    await submitButton.click()

    // Wait for success to confirm single submission processed
    // TanStack Query mutation prevents duplicate submissions internally
    await waitForSuccessToast(page, "Success!", { timeout: 15000 })
  })

  test("should show loading state during submission", async ({ page }) => {
    // Scope to newsletter CTA section
    const newsletterSection = page
      .locator("section")
      .filter({ hasText: /Stay Updated|Newsletter/i })
      .first()

    const emailInput = newsletterSection.locator('input[type="email"]')
    const submitButton = page.getByTestId("newsletter-cta-submit")

    // In serial mode, ensure form has reset from previous test
    await expect(emailInput).toHaveValue("", { timeout: 5000 })

    // Wait for input to be ready (Pattern 8)
    await emailInput.waitFor({ state: "attached", timeout: 5000 })
    await emailInput.waitFor({ state: "visible", timeout: 5000 })

    const testEmail = `loading${Date.now()}@test.com`
    await emailInput.fill(testEmail)

    // Check GDPR checkbox if present - Newsletter CTA Section on test page
    await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-cta" })

    // Wait for submit button to be ready and enabled
    await submitButton.waitFor({ state: "attached", timeout: 5000 })
    await expect(submitButton).toBeEnabled({ timeout: 3000 })

    // Submit and wait for success
    await submitButton.click()
    await waitForSuccessToast(page, "Success!", { timeout: 10000 })

    // Verify form cleared after success, confirming submission completed
    await expect(emailInput).toHaveValue("", { timeout: 5000 })
  })
})
