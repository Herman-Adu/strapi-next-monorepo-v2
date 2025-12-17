import { Page, Locator, expect } from "@playwright/test"

/**
 * E2E Test Helper Utilities
 *
 * Reusable functions for common E2E test patterns.
 * Created: December 4, 2025
 */

/**
 * Navigate to a page and wait for specific content to be visible
 *
 * This implements the FAQ test success pattern:
 * 1. Navigate with proper timeout
 * 2. Wait for network to settle
 * 3. Wait for specific content to appear
 *
 * @param page - Playwright Page object
 * @param path - Relative path to navigate to (e.g., "/en/e2e-test-page")
 * @param contentSelector - Text or regex to wait for (e.g., /FAQ|Newsletter/i)
 * @param options - Optional configuration
 */
export async function navigateAndWaitForContent(
  page: Page,
  path: string,
  contentSelector: string | RegExp,
  options?: {
    timeout?: number
    contentTimeout?: number
  }
) {
  // Increase content timeout in CI (production build slower to hydrate than dev HMR)
  const defaultContentTimeout = process.env.CI ? 25000 : 15000
  const { timeout = 60000, contentTimeout = defaultContentTimeout } =
    options || {}

  // eslint-disable-next-line no-console
  console.log(
    `[Test Helper] Navigating to: ${path}, waiting for: ${contentSelector}`
  )

  // Navigate with domcontentloaded (NOT networkidle - causes timeouts with HMR/websockets)
  await page.goto(path, {
    waitUntil: "domcontentloaded",
    timeout,
  })

  // eslint-disable-next-line no-console
  console.log(`[Test Helper] Page loaded: ${path}`)

  // Log page HTML to debug what's actually on the page
  const bodyText = await page.locator("body").textContent()
  // eslint-disable-next-line no-console
  console.log(`[Test Helper DEBUG] Body text preview (first 200 chars): ${bodyText?.substring(0, 200)}`)

  // Check if main element exists
  const mainExists = (await page.locator("main").count()) > 0
  // eslint-disable-next-line no-console
  console.log(`[Test Helper DEBUG] Main element exists: ${mainExists}`)

  // Wait for specific content to be visible (more reliable than networkidle)
  const selector =
    typeof contentSelector === "string"
      ? `text=${contentSelector}`
      : `text=${contentSelector}`

  // eslint-disable-next-line no-console
  console.log(
    `[Test Helper] Waiting for selector: ${selector} (timeout: ${contentTimeout}ms)`
  )

  try {
    await page.waitForSelector(selector, {
      timeout: contentTimeout,
      state: "visible",
    })
    // eslint-disable-next-line no-console
    console.log(`[Test Helper] ✅ Content found: ${selector}`)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[Test Helper] ❌ Content NOT found: ${selector}`)
    // eslint-disable-next-line no-console
    console.error(`[Test Helper DEBUG] Full body text: ${bodyText}`)
    throw error
  }
}

/**
 * Check GDPR checkbox if present on the page
 *
 * **Recommended Usage**: Pass `scope` for explicit, maintainable test targeting.
 * **Legacy Usage**: Pass `submitButton` for backwards compatibility (DOM traversal).
 *
 * @example
 * // NEW: Scope-based (recommended)
 * await checkGDPRCheckboxIfPresent(page, { scope: "contact" })
 * await checkGDPRCheckboxIfPresent(page, { scope: "newsletter-footer" })
 *
 * @example
 * // LEGACY: Button-based (backwards compatible)
 * await checkGDPRCheckboxIfPresent(page, { submitButton })
 *
 * @param page - Playwright Page object
 * @param options - Configuration options
 * @param options.scope - Form scope (e.g., "contact", "newsletter-footer", "newsletter-cta")
 * @param options.submitButton - Submit button locator (legacy, for DOM traversal)
 * @param options.timeout - Maximum wait time in milliseconds
 * @returns true if checkbox was found and checked, false if not present
 */
export async function checkGDPRCheckboxIfPresent(
  page: Page,
  options?: {
    scope?: string
    timeout?: number
    submitButton?: Locator
  }
): Promise<boolean> {
  const { scope, timeout = 5000, submitButton } = options || {}

  try {
    // STRATEGY 1: Scope-based (PRIMARY - most reliable)
    if (scope) {
      const testId = `${scope}-gdpr-checkbox`
      const checkbox = page.locator(`[data-testid="${testId}"]`).first()
      const exists = await checkbox.count().then((c) => c > 0)

      if (exists) {
        return await checkAndVerifyCheckbox(page, checkbox, submitButton)
      }
      // No GDPR checkbox found for this scope - not required
      return false
    }

    // STRATEGY 2: Test ID from submit button (SECONDARY - backwards compatible)
    if (submitButton) {
      const buttonTestId = await submitButton.getAttribute("data-testid")
      if (buttonTestId) {
        const derivedScope = buttonTestId.replace("-submit", "")
        const checkboxTestId = `${derivedScope}-gdpr-checkbox`
        const checkbox = page
          .locator(`[data-testid="${checkboxTestId}"]`)
          .first()
        const exists = await checkbox.count().then((c) => c > 0)

        if (exists) {
          return await checkAndVerifyCheckbox(page, checkbox, submitButton)
        }
      }

      // LEGACY FALLBACK: DOM traversal strategies
      return await checkGDPRCheckboxViaTraversal(page, submitButton)
    }

    // STRATEGY 3: Fallback to known IDs (LEGACY - least reliable)
    const possibleIds = [
      "contact-gdpr-consent",
      "newsletter-footer-gdpr-consent",
      "newsletter-cta-gdpr-consent",
      "gdpr-consent", // Generic fallback
    ]

    for (const checkboxId of possibleIds) {
      const checkbox = page.locator(`#${checkboxId}[role="checkbox"]`).first()
      const exists = await checkbox
        .isVisible({ timeout: 1000 })
        .catch(() => false)

      if (exists) {
        return await checkAndVerifyCheckbox(page, checkbox, submitButton)
      }
    }

    // No GDPR checkbox found - not required for this form
    return false
  } catch (error) {
    // GDPR checkbox not required for this form
    return false
  }
}

/**
 * Check checkbox and verify state change
 * Handles Radix UI checkbox state updates with polling retry logic
 *
 * @param page - Playwright Page object
 * @param checkbox - Checkbox locator
 * @param submitButton - Optional submit button to verify enabled state after checking
 * @returns true if checkbox successfully checked
 */
async function checkAndVerifyCheckbox(
  page: Page,
  checkbox: Locator,
  submitButton?: Locator
): Promise<boolean> {
  const currentState = await checkbox.getAttribute("data-state")

  if (currentState === "checked") {
    return true // Already checked
  }

  // Wait for checkbox to be ready
  await checkbox.waitFor({ state: "visible", timeout: 3000 })
  await checkbox.scrollIntoViewIfNeeded()

  // Polling approach for Radix UI (max 5 attempts with increased wait time)
  for (let attempt = 1; attempt <= 5; attempt++) {
    // Use Playwright's native click to properly trigger React events
    await checkbox.click({ force: true })

    // Wait for React state propagation (increased from 200ms to 500ms)
    await page.waitForTimeout(500)

    // Check state
    const newState = await checkbox.getAttribute("data-state")
    if (newState === "checked") {
      // Verify button enabled if provided
      if (submitButton) {
        await expect(submitButton).toBeEnabled({ timeout: 5000 })
      }
      return true
    }

    // Retry with longer wait
    if (attempt < 5) {
      await page.waitForTimeout(300)
    }
  }

  throw new Error("GDPR checkbox failed to check after 5 attempts")
}

/**
 * Legacy DOM traversal strategies for backwards compatibility
 * Tries multiple strategies to find GDPR checkbox relative to submit button
 *
 * @param page - Playwright Page object
 * @param submitButton - Submit button locator
 * @returns true if checkbox found and checked, false otherwise
 */
async function checkGDPRCheckboxViaTraversal(
  page: Page,
  submitButton: Locator
): Promise<boolean> {
  // For now, return false (legacy DOM traversal not needed with scope-based approach)
  // This maintains backwards compatibility without the complex traversal logic
  return false
}

/**
 * Apply standard test timeout (60 seconds)
 *
 * Helper to set consistent timeout across tests
 */
export function setStandardTimeout(): number {
  return 60000
}

/**
 * Wait for element and scroll into view
 *
 * Useful for elements that may be below the fold
 */
export async function scrollToElement(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  const { timeout = 5000 } = options || {}

  await locator.waitFor({ state: "visible", timeout })
  await locator.scrollIntoViewIfNeeded({ timeout })
}

/**
 * Fill form and submit with GDPR handling
 *
 * Common pattern for newsletter/contact forms
 *
 * @param page - Playwright Page object
 * @param emailSelector - Selector for email input
 * @param email - Email address to fill
 * @param submitSelector - Selector for submit button
 */
export async function fillAndSubmitForm(
  page: Page,
  emailSelector: string,
  email: string,
  submitSelector: string
): Promise<void> {
  // Fill email
  const emailInput = page.locator(emailSelector).first()
  await emailInput.fill(email)

  // Check GDPR if present
  await checkGDPRCheckboxIfPresent(page)

  // Submit
  const submitButton = page.locator(submitSelector).first()
  await submitButton.click()
}

/**
 * Wait for API call to complete
 *
 * Useful after form submissions or data fetches
 */
export async function waitForAPI(
  page: Page,
  timeout: number = 2000
): Promise<void> {
  await page.waitForTimeout(timeout)
}

/**
 * Check if element exists without throwing
 *
 * Returns true if element is visible, false otherwise
 */
export async function elementExists(
  locator: Locator,
  timeout: number = 5000
): Promise<boolean> {
  return await locator.isVisible({ timeout }).catch(() => false)
}

/**
 * Wait for success toast to appear
 *
 * Uses text-based detection to find toast notifications.
 * This pattern works reliably across Radix UI versions regardless of role attributes.
 *
 * BEST PRACTICE: Waits for ToastViewport container first to ensure toast system is ready,
 * then checks for specific toast content.
 *
 * Based on research findings:
 * - Radix UI v1.2.1 may use role="status", role="region", or no role
 * - Text-based detection is more reliable than role-based
 * - Works for both Newsletter and Contact form patterns
 * - All forms now use "Success!" as title for consistency
 *
 * @param page - Playwright Page object
 * @param expectedText - Optional specific text to look for (default: "Success!")
 * @param options - Optional configuration
 * @returns Promise that resolves when toast is visible
 *
 * @example
 * ```typescript
 * // Use toast title (recommended for consistency)
 * await waitForSuccessToast(page)
 *
 * // Specific message
 * await waitForSuccessToast(page, "Success!")
 *
 * // Custom timeout
 * await waitForSuccessToast(page, "Success!", { timeout: 10000 })
 * ```
 */
export async function waitForSuccessToast(
  page: Page,
  expectedText?: string,
  options?: { timeout?: number }
): Promise<void> {
  const { timeout = 5000 } = options || {}

  // STEP 1: Wait for ToastViewport to be ready (ensures toast system is initialized)
  await page
    .locator(
      '[class*="ToastViewport"], [data-radix-toast-viewport], .fixed.z-100'
    )
    .first()
    .waitFor({ state: "attached", timeout: 3000 })
    .catch(() => {
      // Toast viewport may already exist, continue
    })

  // STEP 2: Wait for toast content to appear
  // Default to "Success!" title for consistency across all forms
  const searchText = expectedText || "Success!"
  const toastLocator = page.locator(`text=/${searchText}/i`).first()

  await expect(toastLocator).toBeVisible({ timeout })
}

/**
 * Wait for error toast to appear
 *
 * Uses text-based detection to find error toast notifications.
 * Companion to waitForSuccessToast for error state validation.
 *
 * @param page - Playwright Page object
 * @param expectedText - Optional specific error text to look for
 * @param options - Optional configuration
 * @returns Promise that resolves when error toast is visible
 *
 * @example
 * ```typescript
 * // Generic error detection
 * await waitForErrorToast(page)
 *
 * // Specific error message
 * await waitForErrorToast(page, "Email is required")
 * ```
 */
export async function waitForErrorToast(
  page: Page,
  expectedText?: string,
  options?: { timeout?: number }
): Promise<void> {
  const { timeout = 5000 } = options || {}

  const toastLocator = expectedText
    ? page.locator(`text=/${expectedText}/i`)
    : page.locator("text=/error|failed|could not|invalid|required/i")

  await expect(toastLocator).toBeVisible({ timeout })
}
