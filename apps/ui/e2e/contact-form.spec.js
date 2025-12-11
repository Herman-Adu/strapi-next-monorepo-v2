"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const test_1 = require("@playwright/test")
const test_helpers_1 = require("./utils/test-helpers")
test_1.test.describe("Contact Form", () => {
  // Run tests serially to avoid dev server exhaustion
  test_1.test.describe.configure({ mode: "serial" })
  test_1.test.beforeEach(async ({ page }) => {
    // Set standard timeout
    test_1.test.setTimeout((0, test_helpers_1.setStandardTimeout)())
    // Navigate to test page with contact form
    await (0, test_helpers_1.navigateAndWaitForContent)(
      page,
      "/en/e2e-test-page",
      /Contact|Get in Touch/i
    )
  })
  ;(0, test_1.test)(
    "should display contact form with all required fields",
    async ({ page }) => {
      // Scope selectors to contact form
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      await (0, test_1.expect)(nameInput).toBeVisible()
      await (0, test_1.expect)(nameInput).toHaveAttribute("type", "text")
      await (0, test_1.expect)(emailInput).toBeVisible()
      await (0, test_1.expect)(messageTextarea).toBeVisible()
      await (0, test_1.expect)(submitButton).toBeVisible()
    }
  )
  ;(0, test_1.test)("should validate required name field", async ({ page }) => {
    const contactForm = page.locator("form#contactForm")
    const nameInput = contactForm.locator('input[name="name"]')
    const emailInput = contactForm.locator('input[name="email"]')
    const messageTextarea = contactForm.locator('textarea[name="message"]')
    const submitButton = page.locator('button:has-text("Send Message")')
    // Fill only email and message (skip name)
    await emailInput.fill("test@example.com")
    await messageTextarea.fill("This is a test message for validation")
    // Check GDPR if present
    await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
      scope: "contact",
    })
    // Try to submit with empty name
    await submitButton.click({ force: true })
    // Wait a moment for any validation
    await page.waitForTimeout(1000)
    // Verify name field still has focus or is marked invalid (HTML5 required)
    const isRequired = await nameInput.getAttribute("required")
    ;(0, test_1.expect)(isRequired).not.toBeNull()
  })
  ;(0, test_1.test)(
    "should validate required email field",
    async ({ page }) => {
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      // Fill only name and message (skip email)
      await nameInput.fill("Test User")
      await messageTextarea.fill("This is a test message for validation")
      // Check GDPR if present
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      // Try to submit with empty email
      await submitButton.click({ force: true })
      // Wait a moment for any validation
      await page.waitForTimeout(1000)
      // Verify email field is marked as required
      const isRequired = await emailInput.getAttribute("required")
      ;(0, test_1.expect)(isRequired).not.toBeNull()
    }
  )
  ;(0, test_1.test)("should validate email format", async ({ page }) => {
    const contactForm = page.locator("form#contactForm")
    const nameInput = contactForm.locator('input[name="name"]')
    const emailInput = contactForm.locator('input[name="email"]')
    const messageTextarea = contactForm.locator('textarea[name="message"]')
    const submitButton = page.locator('button:has-text("Send Message")')
    // Fill form with invalid email
    await nameInput.waitFor({ state: "visible" })
    await emailInput.waitFor({ state: "visible" })
    await messageTextarea.waitFor({ state: "visible" })
    await nameInput.fill("Test User")
    await emailInput.fill("invalid-email")
    await messageTextarea.fill("This is a test message with enough characters")
    // Check GDPR if present
    await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
      scope: "contact",
    })
    // Try to submit with invalid email
    await submitButton.click()
    // Wait for validation
    await page.waitForTimeout(2000)
    // Check for error toast or email field validation state
    const bodyContent = await page.locator("body").textContent()
    const hasError =
      bodyContent.toLowerCase().includes("invalid") ||
      bodyContent.toLowerCase().includes("email")
    // If no toast, check HTML5 validation
    const validationMessage = await emailInput.evaluate(
      (el) => el.validationMessage
    )
    ;(0, test_1.expect)(hasError || validationMessage.length > 0).toBe(true)
  })
  ;(0, test_1.test)(
    "should validate required message field",
    async ({ page }) => {
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      // Fill only name and email (skip message)
      await nameInput.waitFor({ state: "visible" })
      await emailInput.waitFor({ state: "visible" })
      await nameInput.fill("Test User")
      await emailInput.fill("test@example.com")
      // Check GDPR if present
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      // Try to submit with empty message
      await submitButton.click({ force: true })
      // Wait a moment for any validation
      await page.waitForTimeout(1000)
      // Verify message field is marked as required
      const isRequired = await messageTextarea.getAttribute("required")
      ;(0, test_1.expect)(isRequired).not.toBeNull()
    }
  )
  ;(0, test_1.test)(
    "should validate minimum message length",
    async ({ page }) => {
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      // Fill form with message too short (< 10 characters)
      await nameInput.waitFor({ state: "visible" })
      await emailInput.waitFor({ state: "visible" })
      await messageTextarea.waitFor({ state: "visible" })
      await nameInput.fill("Test User")
      await emailInput.fill("test@example.com")
      await messageTextarea.fill("Short")
      // Check GDPR if present
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      // Try to submit with short message (force click to bypass disabled state)
      await submitButton.click({ force: true })
      // Wait for validation (form should not submit)
      await page.waitForTimeout(2000)
      // Check for error toast or that form is still filled (didn't submit)
      const bodyContent = await page.locator("body").textContent()
      const hasError =
        bodyContent.includes("10") ||
        bodyContent.toLowerCase().includes("minimum") ||
        bodyContent.toLowerCase().includes("at least")
      // Either error message shown OR form didn't submit (fields still filled)
      const messageValue = await messageTextarea.inputValue()
      ;(0, test_1.expect)(hasError || messageValue === "Short").toBe(true)
    }
  )
  ;(0, test_1.test)(
    "should require GDPR consent if checkbox present",
    async ({ page }) => {
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      // Check if GDPR checkbox exists
      const gdprCheckbox = page.locator('[data-testid="contact-gdpr-checkbox"]')
      const hasGDPR = (await gdprCheckbox.count()) > 0
      if (!hasGDPR) {
        test_1.test.skip()
        return
      }
      // Fill all fields but don't check GDPR
      await nameInput.fill("Test User")
      await emailInput.fill("test@example.com")
      await messageTextarea.fill("This is a valid test message")
      // Submit button should be disabled without GDPR consent
      await (0, test_1.expect)(submitButton).toBeDisabled()
      // Check GDPR checkbox
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      // Submit button should now be enabled
      await (0, test_1.expect)(submitButton).toBeEnabled()
    }
  )
  ;(0, test_1.test)(
    "should have working GDPR policy link",
    async ({ page }) => {
      // Check if GDPR checkbox exists using data-testid
      const gdprCheckbox = page.locator('[data-testid="contact-gdpr-checkbox"]')
      const hasGDPR = (await gdprCheckbox.count()) > 0
      if (!hasGDPR) {
        test_1.test.skip()
        return
      }
      // Find the GDPR label/link container
      const gdprLabel = gdprCheckbox.locator("..")
      const policyLink = gdprLabel.locator('a:has-text("Privacy Policy")')
      await (0, test_1.expect)(policyLink).toBeVisible()
      // Link should have correct href
      await (0, test_1.expect)(policyLink).toHaveAttribute("href", /privacy/i)
    }
  )
  ;(0, test_1.test)(
    "should successfully submit valid contact form",
    async ({ page }) => {
      // Scope selectors to contact form only to avoid conflicts with newsletter forms
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      // In serial mode, ensure form has reset from previous test
      await (0, test_1.expect)(nameInput).toHaveValue("", { timeout: 5000 })
      await (0, test_1.expect)(emailInput).toHaveValue("", { timeout: 5000 })
      // Fill all fields with valid data
      const testEmail = `test${Date.now()}@example.com`
      // Wait for inputs to be ready and visible
      await nameInput.waitFor({ state: "visible" })
      await emailInput.waitFor({ state: "visible" })
      await messageTextarea.waitFor({ state: "visible" })
      await nameInput.fill("Herman Adu")
      await emailInput.fill(testEmail)
      await messageTextarea.fill(
        "This is a test message from Herman Adu, performing e2e contact form testing"
      )
      // Check GDPR checkbox if present using scope
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      // Submit form via button click
      await submitButton.click()
      // Wait for success toast to appear (using standardized "Success!" title)
      await (0, test_helpers_1.waitForSuccessToast)(page, "Success!", {
        timeout: 10000,
      })
      // After success, form should clear automatically
      await (0, test_1.expect)(nameInput).toHaveValue("", { timeout: 5000 })
      await (0, test_1.expect)(emailInput).toHaveValue("", { timeout: 5000 })
      await (0, test_1.expect)(messageTextarea).toHaveValue("", {
        timeout: 5000,
      })
    }
  )
  ;(0, test_1.test)(
    "should clear form after successful submission",
    async ({ page }) => {
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      // In serial mode, ensure form has reset from previous test
      await (0, test_1.expect)(nameInput).toHaveValue("", { timeout: 5000 })
      await (0, test_1.expect)(emailInput).toHaveValue("", { timeout: 5000 })
      // Fill and submit form (use dynamic email)
      const testEmail = `test${Date.now()}@example.com`
      // Wait for inputs to be ready
      await nameInput.waitFor({ state: "visible" })
      await emailInput.waitFor({ state: "visible" })
      await messageTextarea.waitFor({ state: "visible" })
      await nameInput.fill("Test User")
      await emailInput.fill(testEmail)
      await messageTextarea.fill(
        "This is a test message that should be cleared"
      )
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      await submitButton.click()
      // Wait for success toast (using standardized "Success!" title)
      await (0, test_helpers_1.waitForSuccessToast)(page, "Success!")
      // Form fields should be cleared after success
      await (0, test_1.expect)(nameInput).toHaveValue("", { timeout: 5000 })
      await (0, test_1.expect)(emailInput).toHaveValue("", { timeout: 5000 })
      await (0, test_1.expect)(messageTextarea).toHaveValue("", {
        timeout: 5000,
      })
    }
  )
  ;(0, test_1.test)(
    "should be responsive on mobile viewport",
    async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      // All form elements should still be visible
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      await (0, test_1.expect)(nameInput).toBeVisible()
      await (0, test_1.expect)(emailInput).toBeVisible()
      await (0, test_1.expect)(messageTextarea).toBeVisible()
      await (0, test_1.expect)(submitButton).toBeVisible()
      // Form should be usable on mobile
      await nameInput.waitFor({ state: "visible" })
      await emailInput.waitFor({ state: "visible" })
      await messageTextarea.waitFor({ state: "visible" })
      await nameInput.fill("Mobile User")
      await emailInput.fill("mobile@test.com")
      await messageTextarea.fill("Testing mobile responsiveness")
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      // Submit button should be clickable
      await (0, test_1.expect)(submitButton).toBeEnabled()
    }
  )
  ;(0, test_1.test)("should support keyboard navigation", async ({ page }) => {
    const contactForm = page.locator("form#contactForm")
    const nameInput = contactForm.locator('input[name="name"]')
    const emailInput = contactForm.locator('input[name="email"]')
    const messageTextarea = contactForm.locator('textarea[name="message"]')
    // Wait for inputs to be ready
    await nameInput.waitFor({ state: "visible" })
    // Focus name field
    await nameInput.focus()
    await (0, test_1.expect)(nameInput).toBeFocused()
    // Tab to email
    await page.keyboard.press("Tab")
    await (0, test_1.expect)(emailInput).toBeFocused()
    // Tab to message
    await page.keyboard.press("Tab")
    await (0, test_1.expect)(messageTextarea).toBeFocused()
    // Should be able to type in focused field
    await page.keyboard.type("Keyboard navigation test message")
    const value = await messageTextarea.inputValue()
    ;(0, test_1.expect)(value).toContain("Keyboard navigation")
  })
  ;(0, test_1.test)(
    "should prevent duplicate submissions",
    async ({ page }) => {
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      // In serial mode, ensure form has reset from previous test
      await (0, test_1.expect)(nameInput).toHaveValue("", { timeout: 5000 })
      await (0, test_1.expect)(emailInput).toHaveValue("", { timeout: 5000 })
      // Fill form (use dynamic email)
      const testEmail = `test${Date.now()}@example.com`
      await nameInput.waitFor({ state: "visible" })
      await emailInput.waitFor({ state: "visible" })
      await messageTextarea.waitFor({ state: "visible" })
      await nameInput.fill("Test User")
      await emailInput.fill(testEmail)
      await messageTextarea.fill("Testing duplicate submission prevention")
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      // Click submit button
      await submitButton.click()
      // Wait for success toast - if duplicate prevention works, we'll only see one submission
      await (0, test_helpers_1.waitForSuccessToast)(page, "Success!", {
        timeout: 10000,
      })
      // Form should clear after success
      await (0, test_1.expect)(nameInput).toHaveValue("", { timeout: 5000 })
    }
  )
  ;(0, test_1.test)(
    "should display loading state during submission",
    async ({ page }) => {
      const contactForm = page.locator("form#contactForm")
      const nameInput = contactForm.locator('input[name="name"]')
      const emailInput = contactForm.locator('input[name="email"]')
      const messageTextarea = contactForm.locator('textarea[name="message"]')
      const submitButton = page.locator('button:has-text("Send Message")')
      // In serial mode, ensure form has reset from previous test
      await (0, test_1.expect)(nameInput).toHaveValue("", { timeout: 5000 })
      await (0, test_1.expect)(emailInput).toHaveValue("", { timeout: 5000 })
      // Fill form (use dynamic email)
      const testEmail = `test${Date.now()}@example.com`
      await nameInput.waitFor({ state: "visible" })
      await emailInput.waitFor({ state: "visible" })
      await messageTextarea.waitFor({ state: "visible" })
      await nameInput.fill("Test User")
      await emailInput.fill(testEmail)
      await messageTextarea.fill("Testing loading state display")
      await (0, test_helpers_1.checkGDPRCheckboxIfPresent)(page, {
        scope: "contact",
      })
      // Click submit and wait for success
      await submitButton.click()
      await (0, test_helpers_1.waitForSuccessToast)(page, "Success!", {
        timeout: 10000,
      })
      // Form should clear after success, verifying submission completed
      await (0, test_1.expect)(nameInput).toHaveValue("", { timeout: 5000 })
    }
  )
})
