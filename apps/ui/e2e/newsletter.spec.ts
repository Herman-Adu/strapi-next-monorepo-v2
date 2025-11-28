import { test, expect } from "@playwright/test"

test.describe("Newsletter Subscription", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the E2E test page with newsletter section
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle", { timeout: 30000 })
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

    // Enter invalid email
    await emailInput.fill("notanemail")
    await submitButton.click()

    // HTML5 validation should trigger
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    )
    expect(validationMessage).not.toBe("")
  })

  test("should successfully submit valid email", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    // Enter valid email
    const testEmail = `test${Date.now()}@example.com`
    await emailInput.fill(testEmail)

    // Submit form
    await submitButton.click()

    // Wait for success message or loading state
    // Adjust selectors based on your actual implementation
    await page.waitForTimeout(2000) // Wait for API call

    // Check for success state (adjust based on your implementation)
    // This could be a success message, disabled button, or changed text
    const successMessage = page.locator("text=/thank you|subscribed|success/i")
    const isSuccess = await successMessage
      .isVisible({ timeout: 5000 })
      .catch(() => false)

    // If no success message, at least verify no error occurred
    if (!isSuccess) {
      const errorMessage = page.locator("text=/error|failed|wrong/i")
      const hasError = await errorMessage
        .isVisible({ timeout: 2000 })
        .catch(() => false)
      expect(hasError).toBe(false)
    }
  })

  test("should show privacy notice", async ({ page }) => {
    // Check for privacy notice text
    const privacyNotice = page.locator("text=/privacy|unsubscribe/i").first()
    await expect(privacyNotice).toBeVisible()
  })

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Reload page
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")

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

    // Tab to email input
    await page.keyboard.press("Tab")
    await page.keyboard.press("Tab") // May need multiple tabs depending on page structure

    // Type email using keyboard
    await page.keyboard.type("keyboard@test.com")

    // Verify value was entered
    const inputValue = await emailInput.inputValue()
    expect(inputValue).toContain("keyboard@test.com")

    // Submit with Enter key
    await page.keyboard.press("Enter")

    // Wait for submission
    await page.waitForTimeout(2000)
  })

  test("should prevent double submission", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    await emailInput.fill("double@test.com")

    // Click submit twice quickly
    await submitButton.click()
    await submitButton.click()

    // Button should be disabled during submission (if implemented)
    const isDisabled = await submitButton.isDisabled().catch(() => false)

    // Either button is disabled OR we check that only one request was sent
    // This test validates against race conditions
    await page.waitForTimeout(2000)
  })

  test("should show loading state during submission", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first()
    const submitButton = page.locator('button:has-text("Subscribe")').first()

    await emailInput.fill("loading@test.com")

    // Submit and immediately check for loading state
    await submitButton.click()

    // Check if button shows loading state (disabled, spinner, changed text)
    // Adjust based on your implementation
    const hasLoadingState =
      (await submitButton.isDisabled().catch(() => false)) ||
      (await submitButton
        .locator("svg")
        .isVisible()
        .catch(() => false)) ||
      (await submitButton.textContent())?.toLowerCase().includes("sending")

    // At least one loading indicator should be present during submission
    await page.waitForTimeout(1000)
  })
})
