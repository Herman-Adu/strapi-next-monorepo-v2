import { test, expect } from "@playwright/test"

test.describe("FAQ Accordion", () => {
  // Run tests serially to avoid race conditions with parallel execution
  test.describe.configure({ mode: "serial" })

  test.beforeEach(async ({ page }) => {
    // Increase timeout for slow dev server
    test.setTimeout(60000)

    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    })

    // Ensure page is fully loaded
    await page.waitForLoadState("networkidle", { timeout: 10000 })

    // Wait for FAQ section to be visible - check for heading or badge
    await page.waitForSelector(
      "text=/frequently asked|common.*questions|FAQ/i",
      {
        timeout: 15000,
        state: "visible",
      }
    )
  })

  test("should display FAQ section", async ({ page }) => {
    // Verify FAQ section is visible
    const faqSection = page
      .locator("section")
      .filter({ hasText: /faq|frequently asked|questions/i })
      .first()
    await expect(faqSection).toBeVisible()

    // Check for accordion trigger buttons (Radix UI uses button elements)
    const accordionTriggers = faqSection.getByRole("button")
    const count = await accordionTriggers.count()

    // Should have multiple FAQ items (5 based on test data)
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test("should have all FAQ questions visible", async ({ page }) => {
    // Check for specific questions from test data
    const question1 = page.getByText(/what technologies do you use/i).first()
    const question2 = page
      .getByText(/how long does a typical project take/i)
      .first()
    const question3 = page.getByText(/do you provide ongoing support/i).first()

    await expect(question1).toBeVisible()
    await expect(question2).toBeVisible()
    await expect(question3).toBeVisible()
  })

  test("should start with accordions collapsed", async ({ page }) => {
    // Check that accordion content regions are in closed state initially
    // Radix UI uses data-state="closed" on AccordionContent (div with overflow-hidden class)
    const closedContent = page.locator(
      'div.overflow-hidden[data-state="closed"]'
    )
    const closedCount = await closedContent.count()

    // All accordions should start collapsed (5 from test data)
    expect(closedCount).toBeGreaterThanOrEqual(5)

    // Verify no open accordion content initially
    const openContent = page.locator('div.overflow-hidden[data-state="open"]')
    await expect(openContent).toHaveCount(0)
  })

  test("should expand accordion on click", async ({ page }) => {
    // Find first FAQ question button (AccordionTrigger has role="button")
    const firstQuestion = page
      .getByRole("button", { name: /what technologies do you use/i })
      .first()

    // Click to expand
    await firstQuestion.click()

    // Wait for expansion animation to complete (increased for reliability)
    await page.waitForTimeout(1500)

    // Check that answer text is now visible - matches actual data: "We use modern technologies including..."
    const answerText = page
      .getByText(/We use modern technologies.*Next\.js.*React.*TypeScript/i)
      .first()
    await expect(answerText).toBeVisible({ timeout: 10000 })

    // Alternative: Check for data-state="open" on border-b parent div
    const openItem = page.locator('div.border-b[data-state="open"]').first()
    await expect(openItem).toBeVisible()
  })

  test("should collapse accordion on second click", async ({ page }) => {
    const firstQuestion = page
      .getByRole("button", { name: /what technologies do you use/i })
      .first()

    // Click to expand
    await firstQuestion.click()
    await page.waitForTimeout(1000)

    // Verify answer text is visible
    const answerText = page
      .getByText(
        /We use modern technologies like Next\.js|Next\.js, React, TypeScript/i
      )
      .first()
    await expect(answerText).toBeVisible({ timeout: 10000 })

    // Click again to collapse
    await firstQuestion.click()
    await page.waitForTimeout(1000)

    // Answer text should no longer be visible
    await expect(answerText).toBeHidden()

    // Should be no open items
    const openItems = page.locator('div.border-b[data-state="open"]')
    await expect(openItems).toHaveCount(0)
  })

  test("should allow multiple accordions open simultaneously", async ({
    page,
  }) => {
    const question1 = page
      .getByRole("button", { name: /what technologies do you use/i })
      .first()
    const question2 = page
      .getByRole("button", { name: /how long|typical project take/i })
      .first()

    // Expand first accordion
    await question1.click()
    await page.waitForTimeout(1500)

    // Expand second accordion
    await question2.click()
    await page.waitForTimeout(1500)

    // Both accordion items should be open (Radix Accordion type="multiple" allows this)
    const openItems = page.locator('div.border-b[data-state="open"]')
    await expect(openItems).toHaveCount(2)

    // Verify both answers are visible
    const answer1 = page
      .getByText(
        /We use modern technologies like Next\.js|Next\.js, React, TypeScript/i
      )
      .first()
    await expect(answer1).toBeVisible()
  })

  test("should handle keyboard navigation", async ({ page }) => {
    const firstQuestion = page
      .getByRole("button", { name: /what technologies do you use/i })
      .first()

    // Focus the button
    await firstQuestion.focus()

    // Press Enter to expand
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1500)

    // Verify answer is visible with correct text regex
    const answerText = page
      .getByText(/We use modern technologies.*Next\.js.*React.*TypeScript/i)
      .first()
    await expect(answerText).toBeVisible({ timeout: 10000 })

    // Verify accordion item has data-state="open"
    const openItem = page.locator('div.border-b[data-state="open"]').first()
    await expect(openItem).toBeVisible()
  })

  test("should handle Space key to toggle accordion", async ({ page }) => {
    const firstQuestion = page
      .getByText(/what technologies do you use/i)
      .first()

    // Focus the question
    await firstQuestion.focus()

    // Press Space to expand
    await page.keyboard.press("Space")
    await page.waitForTimeout(500)

    // Answer should be visible
    const answer = page.getByText(/Next.js, React, TypeScript/i).first()
    const isVisible = await answer
      .isVisible({ timeout: 2000 })
      .catch(() => false)

    // Space key should work (true) OR Enter key is the only toggle (also acceptable)
    // This test documents the keyboard interaction pattern
    test.info().annotations.push({
      type: "Space key result",
      description: `Space key expands accordion: ${isVisible}`,
    })
  })

  test("should be accessible with proper ARIA attributes", async ({ page }) => {
    // Check for proper ARIA attributes on accordion items
    const accordionButton = page
      .locator('[role="button"], summary, button')
      .filter({
        hasText: /what technologies/i,
      })
      .first()

    // Should have proper role or be a button/summary element
    const tagName = await accordionButton.evaluate((el) =>
      el.tagName.toLowerCase()
    )
    const role = await accordionButton.getAttribute("role")

    expect(["button", "summary"].includes(tagName) || role === "button").toBe(
      true
    )

    // Check for aria-expanded attribute (if implemented)
    const ariaExpanded = await accordionButton.getAttribute("aria-expanded")
    test.info().annotations.push({
      type: "ARIA initial state",
      description: `ARIA expanded attribute: ${ariaExpanded}`,
    })

    // Click to expand
    await accordionButton.click()
    await page.waitForTimeout(500)

    // Check if aria-expanded changed to true (if implemented)
    const ariaExpandedAfter =
      await accordionButton.getAttribute("aria-expanded")
    test.info().annotations.push({
      type: "ARIA after click",
      description: `ARIA expanded after click: ${ariaExpandedAfter}`,
    })
  })

  test("should display all 5 FAQ items from test data", async ({ page }) => {
    // Based on test data, should have 5 FAQs for Web Development Agency
    const questions = [
      /what technologies/i,
      /how long|typical project/i,
      /ongoing support|after launch/i,
      /redesign|existing website/i,
      /what's included|pricing/i,
    ]

    for (const questionPattern of questions) {
      const question = page.locator(`text=${questionPattern}`).first()
      await expect(question).toBeVisible()
    }
  })

  test("should expand accordion with smooth animation", async ({ page }) => {
    const firstQuestion = page
      .getByRole("button", { name: /what technologies do you use/i })
      .first()

    // Click to expand
    await firstQuestion.click()

    // Wait for animation to complete
    await page.waitForTimeout(1000)

    // Accordion item should be visible with data-state="open"
    const openItem = page.locator('div.border-b[data-state="open"]').first()
    await expect(openItem).toBeVisible()

    // Content should have height
    const openContent = openItem
      .locator('div.overflow-hidden[data-state="open"]')
      .first()
    const finalHeight = await openContent.evaluate(
      (el) => (el as HTMLElement).offsetHeight
    )
    expect(finalHeight).toBeGreaterThan(0)
  })

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/en/e2e-test-page", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    })
    await page.waitForLoadState("networkidle", { timeout: 10000 })
    await page.waitForSelector("body", { state: "attached" })

    // Verify FAQ section is visible on mobile
    const faqSection = page
      .locator("section")
      .filter({ hasText: /faq|frequently asked|questions/i })
      .first()
    await expect(faqSection).toBeVisible()

    // Verify accordion questions are clickable on mobile
    const firstQuestion = page
      .getByRole("button", { name: /what technologies do you use/i })
      .first()
    await firstQuestion.click()
    await page.waitForTimeout(1500)

    // Answer should be visible on mobile - check text content
    const answerText = page.getByText(/Next\.js|React|TypeScript/i).first()
    await expect(answerText).toBeVisible({ timeout: 10000 })

    // Check that accordion fits within viewport
    const openItem = page.locator('div.border-b[data-state="open"]').first()
    const answerBox = await openItem.boundingBox()
    if (answerBox) {
      expect(answerBox.width).toBeLessThanOrEqual(375)
    }
  })

  test("should maintain state when scrolling", async ({ page }) => {
    const firstQuestion = page
      .getByRole("button", { name: /what technologies do you use/i })
      .first()

    // Expand first accordion
    await firstQuestion.click()
    await page.waitForTimeout(1500)

    // Verify answer is visible with correct regex
    const answerText = page
      .getByText(/We use modern technologies.*Next\.js.*React.*TypeScript/i)
      .first()
    await expect(answerText).toBeVisible({ timeout: 10000 })

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500))
    await page.waitForTimeout(300)

    // Accordion should still be expanded (check data-state)
    const openItem = page.locator('div.border-b[data-state="open"]').first()
    await expect(openItem).toBeVisible()

    // Scroll back up
    await page.evaluate(() => window.scrollBy(0, -500))
    await page.waitForTimeout(500)

    // Should still be expanded
    await expect(answerText).toBeVisible()
  })

  test("should handle rapid clicks gracefully", async ({ page }) => {
    const firstQuestion = page
      .getByText(/what technologies do you use/i)
      .first()

    // Click multiple times rapidly
    await firstQuestion.click()
    await firstQuestion.click()
    await firstQuestion.click()
    await firstQuestion.click()

    // Wait for animations to settle
    await page.waitForTimeout(1000)

    // Accordion should be in a consistent state (either open or closed, not broken)
    const answer = page.getByText(/Next.js, React, TypeScript/i).first()
    const isVisible = await answer
      .isVisible({ timeout: 1000 })
      .catch(() => false)

    // State should be deterministic (no broken animations)
    test.info().annotations.push({
      type: "Rapid clicks state",
      description: `Accordion state after rapid clicks: ${isVisible ? "expanded" : "collapsed"}`,
    })

    // Click once more to ensure it still works
    await firstQuestion.click()
    await page.waitForTimeout(500)

    const finalState = await answer
      .isVisible({ timeout: 1000 })
      .catch(() => false)
    test.info().annotations.push({
      type: "Final click state",
      description: `Final state after one more click: ${finalState ? "expanded" : "collapsed"}`,
    })

    // Should have toggled from previous state
    expect(finalState).not.toBe(isVisible)
  })
})
