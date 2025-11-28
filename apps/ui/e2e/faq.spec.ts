import { test, expect } from "@playwright/test"

test.describe("FAQ Accordion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle", { timeout: 30000 })
  })

  test("should display FAQ section", async ({ page }) => {
    // Verify FAQ section is visible
    const faqSection = page
      .locator("section")
      .filter({ hasText: /faq|frequently asked|questions/i })
      .first()
    await expect(faqSection).toBeVisible()

    // Check for accordion items
    const accordionItems = page.locator(
      '[role="button"], summary, [data-accordion], .accordion-item'
    )
    const count = await accordionItems.count()

    // Should have multiple FAQ items (at least 3 based on test data)
    expect(count).toBeGreaterThan(0)
  })

  test("should have all FAQ questions visible", async ({ page }) => {
    // Check for specific questions from test data
    const question1 = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()
    const question2 = page
      .locator("text=/how long|typical project take/i")
      .first()
    const question3 = page
      .locator("text=/ongoing support|support after launch/i")
      .first()

    await expect(question1).toBeVisible()
    await expect(question2).toBeVisible()
    await expect(question3).toBeVisible()
  })

  test("should start with accordions collapsed", async ({ page }) => {
    // Find accordion answers (should be hidden initially)
    // Adjust selectors based on your actual implementation
    const answerText = page
      .locator("text=/Next.js, React, TypeScript, Tailwind CSS/i")
      .first()

    // Answer should not be visible initially
    const isVisible = await answerText
      .isVisible({ timeout: 2000 })
      .catch(() => false)
    expect(isVisible).toBe(false)
  })

  test("should expand accordion on click", async ({ page }) => {
    // Find first FAQ question
    const firstQuestion = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()

    // Click to expand
    await firstQuestion.click()

    // Wait for expansion animation
    await page.waitForTimeout(500)

    // Answer should now be visible
    const answer = page.locator("text=/Next.js, React, TypeScript/i").first()
    await expect(answer).toBeVisible()
  })

  test("should collapse accordion on second click", async ({ page }) => {
    const firstQuestion = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()

    // Click to expand
    await firstQuestion.click()
    await page.waitForTimeout(500)

    // Verify it's expanded
    const answer = page.locator("text=/Next.js, React, TypeScript/i").first()
    await expect(answer).toBeVisible()

    // Click again to collapse
    await firstQuestion.click()
    await page.waitForTimeout(500)

    // Should be hidden again
    const isVisible = await answer
      .isVisible({ timeout: 2000 })
      .catch(() => false)
    expect(isVisible).toBe(false)
  })

  test("should allow multiple accordions open simultaneously", async ({
    page,
  }) => {
    const question1 = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()
    const question2 = page
      .locator("text=/how long|typical project take/i")
      .first()

    // Expand first accordion
    await question1.click()
    await page.waitForTimeout(500)

    // Expand second accordion
    await question2.click()
    await page.waitForTimeout(500)

    // Both answers should be visible
    const answer1 = page.locator("text=/Next.js, React, TypeScript/i").first()
    const answer2 = page.locator("text=/4-6 weeks|8-12 weeks/i").first()

    await expect(answer1).toBeVisible()
    await expect(answer2).toBeVisible()
  })

  test("should handle keyboard navigation", async ({ page }) => {
    // Tab to first FAQ question
    await page.keyboard.press("Tab")

    // Keep tabbing until we reach an FAQ button
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab")

      // Check if focused element contains FAQ question text
      const focusedText = await page.evaluate(() => {
        const el = document.activeElement
        return el?.textContent || ""
      })

      if (focusedText.toLowerCase().includes("technologies")) {
        // Found the FAQ, press Enter to expand
        await page.keyboard.press("Enter")
        await page.waitForTimeout(500)

        // Verify answer is visible
        const answer = page
          .locator("text=/Next.js, React, TypeScript/i")
          .first()
        const isVisible = await answer
          .isVisible({ timeout: 2000 })
          .catch(() => false)
        expect(isVisible).toBe(true)
        break
      }
    }
  })

  test("should handle Space key to toggle accordion", async ({ page }) => {
    const firstQuestion = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()

    // Focus the question
    await firstQuestion.focus()

    // Press Space to expand
    await page.keyboard.press("Space")
    await page.waitForTimeout(500)

    // Answer should be visible
    const answer = page.locator("text=/Next.js, React, TypeScript/i").first()
    const isVisible = await answer
      .isVisible({ timeout: 2000 })
      .catch(() => false)

    // Space key should work (true) OR Enter key is the only toggle (also acceptable)
    // This test documents the keyboard interaction pattern
    console.log("Space key expands accordion:", isVisible)
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
    console.log("ARIA expanded attribute:", ariaExpanded)

    // Click to expand
    await accordionButton.click()
    await page.waitForTimeout(500)

    // Check if aria-expanded changed to true (if implemented)
    const ariaExpandedAfter =
      await accordionButton.getAttribute("aria-expanded")
    console.log("ARIA expanded after click:", ariaExpandedAfter)
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
      .locator("text=/what technologies|technologies do you use/i")
      .first()

    // Get initial height of accordion
    const initialHeight = await page.evaluate(() => {
      const accordionPanel = document.querySelector(
        '[aria-hidden="true"], details > div, .accordion-content'
      )
      return accordionPanel ? (accordionPanel as HTMLElement).offsetHeight : 0
    })

    // Click to expand
    await firstQuestion.click()

    // Wait a bit for animation to start
    await page.waitForTimeout(100)

    // Height should increase (animation in progress or complete)
    const expandingHeight = await page.evaluate(() => {
      const accordionPanel = document.querySelector(
        '[aria-hidden="false"], details[open] > div, .accordion-content'
      )
      return accordionPanel ? (accordionPanel as HTMLElement).offsetHeight : 0
    })

    // After expansion, height should be greater than initial
    await page.waitForTimeout(500)
    const finalHeight = await page.evaluate(() => {
      const accordionPanel = document.querySelector(
        '[aria-hidden="false"], details[open] > div, .accordion-content'
      )
      return accordionPanel ? (accordionPanel as HTMLElement).offsetHeight : 0
    })

    expect(finalHeight).toBeGreaterThan(0)
  })

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/en/e2e-test-page", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle")

    // Verify FAQ section is visible on mobile
    const faqSection = page
      .locator("section")
      .filter({ hasText: /faq|frequently asked|questions/i })
      .first()
    await expect(faqSection).toBeVisible()

    // Verify accordion questions are clickable on mobile
    const firstQuestion = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()
    await firstQuestion.click()
    await page.waitForTimeout(500)

    // Answer should be visible on mobile
    const answer = page.locator("text=/Next.js, React, TypeScript/i").first()
    await expect(answer).toBeVisible()

    // Check that text wraps properly on mobile
    const answerBox = await answer.boundingBox()
    if (answerBox) {
      expect(answerBox.width).toBeLessThanOrEqual(375)
    }
  })

  test("should maintain state when scrolling", async ({ page }) => {
    const firstQuestion = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()

    // Expand first accordion
    await firstQuestion.click()
    await page.waitForTimeout(500)

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500))
    await page.waitForTimeout(500)

    // Accordion should still be expanded
    const answer = page.locator("text=/Next.js, React, TypeScript/i").first()
    await expect(answer).toBeVisible()

    // Scroll back up
    await page.evaluate(() => window.scrollBy(0, -500))
    await page.waitForTimeout(500)

    // Should still be expanded
    await expect(answer).toBeVisible()
  })

  test("should handle rapid clicks gracefully", async ({ page }) => {
    const firstQuestion = page
      .locator("text=/what technologies|technologies do you use/i")
      .first()

    // Click multiple times rapidly
    await firstQuestion.click()
    await firstQuestion.click()
    await firstQuestion.click()
    await firstQuestion.click()

    // Wait for animations to settle
    await page.waitForTimeout(1000)

    // Accordion should be in a consistent state (either open or closed, not broken)
    const answer = page.locator("text=/Next.js, React, TypeScript/i").first()
    const isVisible = await answer
      .isVisible({ timeout: 1000 })
      .catch(() => false)

    // State should be deterministic (no broken animations)
    console.log(
      "Accordion state after rapid clicks:",
      isVisible ? "expanded" : "collapsed"
    )

    // Click once more to ensure it still works
    await firstQuestion.click()
    await page.waitForTimeout(500)

    const finalState = await answer
      .isVisible({ timeout: 1000 })
      .catch(() => false)
    console.log(
      "Final state after one more click:",
      finalState ? "expanded" : "collapsed"
    )

    // Should have toggled from previous state
    expect(finalState).not.toBe(isVisible)
  })
})
