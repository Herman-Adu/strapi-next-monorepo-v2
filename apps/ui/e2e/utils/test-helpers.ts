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
  const { timeout = 60000, contentTimeout = 15000 } = options || {}

  // Navigate with domcontentloaded (NOT networkidle - causes timeouts with HMR/websockets)
  await page.goto(path, {
    waitUntil: "domcontentloaded",
    timeout,
  })

  // Wait for specific content to be visible (more reliable than networkidle)
  const selector =
    typeof contentSelector === "string"
      ? `text=${contentSelector}`
      : `text=${contentSelector}`

  await page.waitForSelector(selector, {
    timeout: contentTimeout,
    state: "visible",
  })
}

/**
 * Check GDPR checkbox if present on the page
 *
 * Handles Radix UI checkbox components. Supports multiple checkbox IDs:
 * - "gdpr-consent" (default GDPRCheckbox)
 * - "newsletter-gdpr-consent" (NewsletterForm)
 * - "contact-gdpr-consent" (ContactForm)
 *
 * NEW: Accepts submitButton locator to find checkbox in same form/context.
 *
 * @param page - Playwright Page object
 * @param options - Optional configuration
 * @param options.submitButton - Submit button locator to find checkbox in same context
 * @returns true if checkbox was found and checked, false if not present
 */
export async function checkGDPRCheckboxIfPresent(
  page: Page,
  options?: {
    timeout?: number
    submitButton?: Locator
  }
): Promise<boolean> {
  const { timeout = 5000, submitButton } = options || {}

  try {
    // PRIORITY: If submit button provided, find checkbox in same container
    if (submitButton) {
      // First, make sure submit button is visible
      await submitButton
        .waitFor({ state: "visible", timeout: 2000 })
        .catch(() => {})

      // Get the form that holds the submit button
      const form = submitButton.locator("xpath=ancestor::form[1]").first()
      const formExists = await form.count().then((c) => c > 0)

      if (formExists) {
        // Look for checkbox within the same form
        const checkbox = form.locator('[role="checkbox"]').first()
        const checkboxVisible = await checkbox
          .isVisible({ timeout: 3000 })
          .catch(() => false)

        if (checkboxVisible) {
          const checkboxId = (await checkbox.getAttribute("id")) || "unknown"
          const currentState = await checkbox.getAttribute("data-state")

          if (currentState !== "checked") {
            // Find and click the label for better Radix UI compatibility
            const label = form.locator(`label[for="${checkboxId}"]`).first()
            const labelVisible = await label
              .isVisible({ timeout: 2000 })
              .catch(() => false)

            if (labelVisible) {
              // Wait for label to be stable and clickable
              await label.waitFor({ state: "visible", timeout: 2000 })
              // Click label naturally (no force) - better for event propagation
              await label.click()
              // Give React time to update state
              await page.waitForTimeout(200)
            } else {
              // Fallback: click checkbox directly
              await checkbox.click()
              await page.waitForTimeout(200)
            }

            // Wait for checkbox state to update with longer timeout for slower CI environments
            await expect(checkbox).toHaveAttribute("data-state", "checked", {
              timeout: 5000,
            })

            // Wait for submit button to be enabled
            await expect(submitButton).toBeEnabled({ timeout: 5000 })

            return true
          }
          return true
        } else {
          // Fallback: Try section if checkbox not visible in form
        }
      }

      // Fallback: Try section if no form found
      const section = submitButton.locator("xpath=ancestor::section[1]").first()
      const sectionExists = await section.count().then((c) => c > 0)

      if (sectionExists) {
        const checkbox = section.locator('[role="checkbox"]').first()
        const checkboxVisible = await checkbox
          .isVisible({ timeout: 3000 })
          .catch(() => false)

        if (checkboxVisible) {
          const checkboxId = (await checkbox.getAttribute("id")) || "unknown"
          const currentState = await checkbox.getAttribute("data-state")

          if (currentState !== "checked") {
            // Find and click the label for better Radix UI compatibility
            const label = section.locator(`label[for="${checkboxId}"]`).first()
            const labelVisible = await label
              .isVisible({ timeout: 2000 })
              .catch(() => false)

            if (labelVisible) {
              await label.waitFor({ state: "visible", timeout: 2000 })
              await label.click()
              await page.waitForTimeout(200)
            } else {
              await checkbox.click()
              await page.waitForTimeout(200)
            }

            await expect(checkbox).toHaveAttribute("data-state", "checked", {
              timeout: 5000,
            })
            await expect(submitButton).toBeEnabled({ timeout: 5000 })
            return true
          }
          return true
        }
      }
    }

    // FALLBACK: Try to find checkbox by ID (original approach)
    const possibleIds = [
      "gdpr-consent", // Default GDPRCheckbox ID (Newsletter CTA Section)
      "newsletter-gdpr-consent", // NewsletterForm ID (Footer)
      "contact-gdpr-consent", // Potential ContactForm ID
    ]

    for (const checkboxId of possibleIds) {
      const label = page.locator(`label[for="${checkboxId}"]`)
      const labelVisible = await label
        .isVisible({ timeout: 1000 })
        .catch(() => false)

      if (labelVisible) {
        const checkbox = page.locator(`#${checkboxId}[role="checkbox"]`)
        const currentState = await checkbox.getAttribute("data-state")

        if (currentState !== "checked") {
          await checkbox.click()
          await expect(checkbox).toHaveAttribute("data-state", "checked", {
            timeout: 3000,
          })

          return true
        }
        return true
      }
    }

    // Strategy 2: Fallback to finding any checkbox with role="checkbox"
    const checkboxButton = page.locator('[role="checkbox"]').first()
    const checkboxExists = await checkboxButton
      .isVisible({ timeout })
      .catch(() => false)

    if (checkboxExists) {
      const currentState = await checkboxButton.getAttribute("data-state")
      if (currentState !== "checked") {
        await checkboxButton.click()
        await page.waitForTimeout(1000)
      }
      return true
    }

    // No GDPR checkbox found
    return false
  } catch (error) {
    console.log("GDPR checkbox check failed:", error)
    return false
  }
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
