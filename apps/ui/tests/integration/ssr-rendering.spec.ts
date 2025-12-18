import { test, expect } from "@playwright/test"

/**
 * INTEGRATION TESTS - SSR Rendering with MSW Mocks
 *
 * BEHAVIOR-DRIVEN: Tests what users experience, not Strapi API internals
 *
 * Architecture: Next.js SSR + MSW Mocked API
 * - Tests server-side rendering works correctly
 * - Tests mocked data renders properly
 * - Tests no hydration mismatches
 * - Tests SEO/metadata presence
 *
 * NO REAL STRAPI REQUIRED - All API calls mocked via MSW
 *
 * Run: yarn test:integration
 */

test.describe("SSR Rendering (Behavior-Driven)", () => {
  test("should render footer from mocked API data", async ({ page }) => {
    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })

    // Footer should render from MSW mock
    const footer = page.locator("footer").first()
    await expect(footer).toBeVisible({ timeout: 5000 })

    // Should have footer content
    const footerText = await footer.textContent()
    expect(footerText!.length).toBeGreaterThan(10)
  })

  test("should have no hydration errors", async ({ page }) => {
    const consoleErrors: string[] = []

    // Capture console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text())
      }
    })

    await page.goto("/en/e2e-test-page", {
      waitUntil: "networkidle",
      timeout: 30000,
    })

    // Wait for hydration
    await page.waitForTimeout(2000)

    // Filter out non-critical errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes("DevTools") &&
        !error.includes("Extension") &&
        !error.includes("favicon") &&
        !error.includes("browserslist") &&
        !error.includes("next-auth")
    )

    // Should have no hydration mismatches
    const hydrationErrors = criticalErrors.filter(
      (error) =>
        error.includes("Hydration") ||
        error.includes("did not match") ||
        error.includes("suppressHydrationWarning")
    )

    expect(hydrationErrors.length).toBe(0)
  })

  test("should have proper SEO metadata", async ({ page }) => {
    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })

    // Check for title tag
    const title = await page.title()
    expect(title.length).toBeGreaterThan(0)

    // Check for meta description
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content")
    expect(description).toBeTruthy()
  })

  test("should render page sections from mocked data", async ({ page }) => {
    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    })

    // MSW mock includes sections (newsletter, FAQ, etc.)
    // Verify at least some sections rendered
    const sections = await page.locator("section").count()
    expect(sections).toBeGreaterThan(0)

    // Verify interactive elements present
    const buttons = await page.locator("button").count()
    expect(buttons).toBeGreaterThan(0)
  })
})
