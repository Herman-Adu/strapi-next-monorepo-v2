# RSC Streaming & E2E Testing: Root Cause Analysis

**Document Type**: Technical Deep Dive  
**Date Created**: December 18, 2025  
**Author**: Development Team  
**Status**: Reference Document  
**Priority**: Critical Understanding

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem 1: Error-Handling Test](#problem-1-error-handling-browser-navigation-test)
3. [Problem 2: Homepage Navigation Test](#problem-2-homepage-navigation-visibility-test)
4. [GitHub AI Analysis Evaluation](#github-ai-analysis-evaluation)
5. [Technical Deep Dive: RSC Streaming](#technical-deep-dive-rsc-streaming-protocol)
6. [Lessons for Test Engineering](#lessons-for-test-engineering)
7. [Recommendations](#recommendations-for-test-writing)
8. [Solution Summary](#solution-summary)

---

## Executive Summary

During CI test failures investigation, GitHub AI diagnosed issues as **hydration timing problems**, recommending `waitForLoadState("networkidle")` and increased timeouts. Local testing revealed **two distinct root causes** requiring different solutions:

### Issue Overview

| Test                      | GitHub AI Diagnosis       | Actual Root Cause                                 | Solution                                  |
| ------------------------- | ------------------------- | ------------------------------------------------- | ----------------------------------------- |
| Error-Handling Navigation | Incomplete page hydration | Incorrect assertion method (capturing RSC stream) | Check rendered elements, not body text    |
| Homepage Navigation       | Incomplete page hydration | CSS responsive design (nav hidden on mobile)      | Force desktop viewport or test mobile nav |

### Key Takeaway

**React Server Components (RSC) streaming is not "incomplete HTML"** - it's how Next.js 13+ App Router deliberately delivers content. Tests must target rendered elements, not raw body content which includes streaming scripts.

---

## Problem 1: Error-Handling Browser Navigation Test

### Initial Symptoms

```typescript
// Test code
const bodyContent = await page.locator("body").textContent()
expect(bodyContent).toContain("FAQ")

// Result: FAILED
// bodyContent contains RSC streaming scripts, not "FAQ"
```

### GitHub AI Diagnosis

**Claim**: "Page content not fully rendering before tests interact with elements"

**Evidence Cited**:

- Body contains truncated HTML ending at `"Frequently Asked Quest..."`
- Suggested incomplete hydration
- Recommended: `waitForLoadState("networkidle")` + timeout increases

### What We Actually Found

When testing locally after applying networkidle fixes, the test **still failed**. The body content was:

```javascript
"((e, i, s, u, m, a, l, h)=>{
    let d = document.documentElement, w = ['light', 'dark'];
    function p(n) { /* ... */ }
    // ... thousands of characters of JavaScript ...
})
self.__next_f=self.__next_f||[]
self.__next_f.push([0])
self.__next_f.push([1,\"6:\\\"$Sreact.fragment\\\"\\n8:I..."])
// ... more streaming protocol data ...
```

This is **React Server Components (RSC) streaming protocol** - Next.js's mechanism for progressive rendering.

### Root Cause: Test Strategy Error

The test was capturing the **wrong layer** of the page:

```
┌─────────────────────────────────────────┐
│ <body>                                   │
│  ┌────────────────────────────────────┐ │
│  │ <script> RSC Streaming Data </script> │ ← .textContent() captures THIS
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │ <div> Rendered DOM Content </div>   │ ← Should check THIS
│  │  <h2>Frequently Asked Questions</h2> │
│  │  <p>Everything you need...</p>       │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Why This Happens

Next.js 13+ with App Router uses RSC streaming:

1. **Initial HTML Shell**: Minimal content + script tags
2. **Progressive Streaming**: Components stream via `self.__next_f.push()` calls
3. **Client Hydration**: React reads streamed data and hydrates DOM
4. **Side Effect**: `.textContent()` on `<body>` captures **both scripts AND content**

The thousands of characters of JavaScript are **not incomplete page data** - they're the delivery mechanism itself.

### Evidence: Playwright Snapshot Showed Complete DOM

From `error-context.md` artifact:

```yaml
- main [ref=e27]:
    - generic [ref=e52]:
        - heading "Frequently Asked Questions" [level=2] [ref=e54]
        - paragraph [ref=e56]: Everything you need to know about our services
        - generic [ref=e58]:
            - heading "What technologies do you use?" [level=3]
            - heading "How long does a typical project take?" [level=3]
            - heading "Do you provide ongoing support?" [level=3]
          # ... all FAQ items present and fully rendered
```

The page **WAS fully hydrated and rendered** - we were just checking the wrong thing.

### The Fix

**❌ WRONG Approach**:

```typescript
// Captures RSC streaming scripts + rendered content
const bodyContent = await page.locator("body").textContent()
expect(bodyContent).toContain("FAQ")
```

**✅ CORRECT Approach**:

```typescript
// Targets specific rendered elements
const faqHeading = page.locator("text=/FAQ|Frequently Asked/i")
await expect(faqHeading).toBeVisible({ timeout: 20000 })
await expect(faqHeading).toContainText(/Frequently Asked|FAQ/i)
```

### Why networkidle Was Still Valuable

While networkidle didn't fix the assertion problem, it **does help** in CI by:

1. Waiting for all `self.__next_f.push()` streaming calls to complete
2. Ensuring MSW mock handlers intercept and respond before rendering
3. Letting React finish full hydration from streamed data
4. Preventing premature element checks

But it **doesn't change what `.textContent()` captures** - you still get scripts + content mixed together.

### Result

- **Before**: Test failed checking body text
- **After**: Test passes checking element visibility (45 tests passed)
- **Lesson**: RSC streaming is working correctly; test strategy needed adjustment

---

## Problem 2: Homepage Navigation Visibility Test

### Symptoms

```typescript
Error: expect(locator).toBeVisible() failed
Locator: locator('nav').first()
Expected: visible
Received: hidden

14 × locator resolved to <nav class="hidden items-center space-x-4 md:flex
     lg:space-x-6 xl:space-x-8"></nav>
   - unexpected value "hidden"
```

### Root Cause: Tailwind Responsive Design

The navigation uses **intentional mobile-first responsive classes**:

```tsx
<nav className="hidden items-center space-x-4 md:flex lg:space-x-6 xl:space-x-8">
  {/* Desktop nav links */}
</nav>
```

#### Tailwind Class Breakdown

| Class          | CSS Effect      | Breakpoint        |
| -------------- | --------------- | ----------------- |
| `hidden`       | `display: none` | Default (mobile)  |
| `md:flex`      | `display: flex` | ≥768px (tablet+)  |
| `lg:space-x-6` | `gap: 1.5rem`   | ≥1024px (laptop)  |
| `xl:space-x-8` | `gap: 2rem`     | ≥1280px (desktop) |

### Why This Happens

The navbar implements standard responsive design:

```tsx
// Desktop navigation (shown on large screens)
<nav className="hidden md:flex">
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>

// Mobile navigation (shown on small screens)
<div className="md:hidden">
  <MobileNavigationClient /> {/* Hamburger menu */}
</div>
```

### Playwright's Viewport Behavior

Playwright config likely sets viewport to **1280x720**, but:

- Test execution context may override this
- Responsive breakpoints trigger differently in headless mode
- The `md:flex` breakpoint (768px) should work at 1280px
- Some test context is triggering mobile viewport behavior

### Why This Isn't a Hydration Issue

From Playwright's page snapshot:

```yaml
- navigation [ref=e9] # ✅ Navigation EXISTS in DOM
  # The element is present, fully hydrated, and interactive
  # CSS just applies display:none based on viewport
```

The element is **fully rendered and hydrated** - it's just:

- CSS correctly applies `display: none` for mobile viewport
- Test expects it to be visible
- This is **working as designed**, not a bug

### The Fix Options

#### Option 1: Force Desktop Viewport (Recommended)

```typescript
test("should have navigation", async ({ page }) => {
  // Explicitly test desktop layout
  await page.setViewportSize({ width: 1920, height: 1080 })

  await navigateAndWaitForContent(page, "/en", /Home|About|Contact/i)
  await page.waitForLoadState("networkidle", { timeout: 15000 })

  const nav = page.locator("nav").first()
  await expect(nav).toBeVisible({ timeout: 10000 })
})
```

#### Option 2: Test Mobile Navigation Instead

```typescript
test("should have mobile navigation", async ({ page }) => {
  // Test the hamburger menu for mobile viewports
  await page.setViewportSize({ width: 375, height: 667 })

  const mobileMenuButton = page.locator(
    'button[aria-label="Toggle navigation"]'
  )
  await expect(mobileMenuButton).toBeVisible({ timeout: 10000 })
})
```

#### Option 3: Set Global Viewport in Config

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    viewport: { width: 1920, height: 1080 }, // Explicit desktop size
  },
})
```

#### Option 4: Test Both Responsive States

```typescript
test.describe("Navigation", () => {
  test("desktop navigation visible on large screens", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator("nav.md\\:flex")).toBeVisible()
  })

  test("mobile menu visible on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[aria-label="Toggle navigation"]')).toBeVisible()
  })
})
```

---

## GitHub AI Analysis Evaluation

### What GitHub AI Got Right ✅

1. **Timing is a Factor**: Tests were checking elements before full page load
2. **networkidle in CI**: Valid recommendation for production-like environments without HMR
3. **Timeout Increases**: Helpful for CI latency (network delays, MSW intercepts)
4. **Pattern Recognition**: Correctly noted similar root cause across multiple tests

### What GitHub AI Missed or Misdiagnosed ❌

#### 1. RSC Streaming Misconception

**AI's Interpretation**:

> "Body contains truncated HTML ending at 'Frequently Asked Quest...' indicating incomplete page load"

**Reality**:

- The "truncation" was the last chunk in an RSC stream
- Next.js **deliberately delivers HTML this way** via progressive streaming
- The streaming scripts are **part of the complete page**, not incomplete data
- `.textContent()` naturally captures both scripts and rendered content

#### 2. Viewport/Responsive Design Blindspot

**AI's Diagnosis**:

> "Element not visible due to hydration timing"

**Reality**:

- Element exists and is fully hydrated
- Tailwind's `hidden md:flex` is **intentional responsive design**
- CSS correctly applies `display: none` on mobile viewports
- Test needs to specify viewport, not wait longer

#### 3. Test Strategy Gap

**AI's Solution**: "Make page load fully"

**Better Solution**:

- For error-handling: Check **rendered elements**, not body text
- For homepage: Force **desktop viewport** or test mobile nav
- Focus on **what to test**, not just **when to test**

### Why AI Diagnosis Was Plausible

The diagnosis made sense because:

1. **Symptom Match**: Pages genuinely weren't ready when tests ran in CI
2. **Common Pattern**: Hydration timing IS a real issue in Next.js 13+ App Router
3. **MSW Context**: Mock service workers DO cause timing issues in tests
4. **Historical Success**: networkidle + timeouts often DO fix similar problems

The AI's recommendations were **80% correct** - they addressed real timing issues but missed nuances specific to:

- RSC streaming protocol behavior
- Tailwind responsive design patterns
- Playwright's `.textContent()` behavior with script tags

---

## Technical Deep Dive: RSC Streaming Protocol

### How Next.js 13+ Delivers Pages

#### Phase 1: Initial HTML Shell

```html
<!doctype html>
<html>
  <body>
    <div id="__next">
      <script>
        self.__next_f = self.__next_f || []
      </script>
      <!-- Minimal shell, loading state -->
    </div>
  </body>
</html>
```

#### Phase 2: Progressive Streaming

```javascript
// Server sends chunks as components render
self.__next_f.push([0]) // Protocol initialization
self.__next_f.push([1, '6:"$Sreact.fragment"\n'])
self.__next_f.push([1, '8:I["component_path","exports","Component"]\n'])
self.__next_f.push([1, 'a:J{"name":"ComponentName","props":{...}}\n'])
// ... thousands of lines of serialized component data
```

#### Phase 3: Client-Side Hydration

```javascript
// React client reads from self.__next_f queue
// Deserializes component data
// Progressively hydrates DOM as data arrives
// Updates visible content in real-time
```

### Why This Appears as "Incomplete HTML"

When you call `.textContent()` on `<body>`:

```javascript
const content = document.body
  .textContent // Returns BOTH:
// 1. All <script> tag contents (RSC streaming protocol)
// 2. All rendered text content

// Example output (partial):
`((e,i,s,u,m,a,l,h)=>{let d=document.documentElement...})
self.__next_f=self.__next_f||[]
self.__next_f.push([0])
self.__next_f.push([1,"6:\\"$Sreact.fragment\\"\\n8:I..."])
Toggle themeenSign inFrequently Asked QuestionsEverything you need...`
```

The JavaScript code ISN'T incomplete data - it's the **delivery mechanism**.

### networkidle's Real Purpose

`waitForLoadState("networkidle")` ensures:

1. ✅ All `self.__next_f.push()` streaming calls complete
2. ✅ React finishes reading from streaming queue
3. ✅ All components hydrate from streamed data
4. ✅ MSW intercepts complete before rendering starts

But it **doesn't solve**:

- ❌ `.textContent()` still captures script tags
- ❌ Need element-specific locators anyway
- ❌ Doesn't help with CSS responsive issues

### The Right Way to Test RSC Pages

```typescript
// ❌ WRONG: Captures streaming protocol + content
const bodyText = await page.locator("body").textContent()
expect(bodyText).toContain("FAQ")

// ✅ RIGHT: Target specific rendered elements
const heading = page.locator("h2", { hasText: /FAQ/i })
await expect(heading).toBeVisible()
await expect(heading).toContainText("Frequently Asked Questions")

// ✅ BETTER: Multiple specific checks
await expect(page.locator("text=What technologies do you use?")).toBeVisible()
await expect(
  page.locator("text=How long does a typical project take?")
).toBeVisible()
```

---

## Lessons for Test Engineering

### Lesson 1: Body Text Extraction Anti-Pattern

#### The Problem

```typescript
// ❌ ANTI-PATTERN with RSC/Next.js App Router
const bodyContent = await page.locator("body").textContent()
expect(bodyContent).toContain("FAQ")

// Why this fails:
// - Captures <script> tag contents (RSC streaming protocol)
// - Returns 50,000+ characters of JavaScript serialization
// - Target text might exist but buried in scripts
// - Brittle and unclear what's actually being tested
```

#### The Solution

```typescript
// ✅ CORRECT PATTERN: Target specific elements
const faqHeading = page.locator("h2", { hasText: /FAQ/i })
await expect(faqHeading).toBeVisible()

// ✅ EVEN BETTER: Multiple specific assertions
const questions = [
  "What technologies do you use?",
  "How long does a typical project take?",
  "Do you provide ongoing support?",
]

for (const question of questions) {
  await expect(page.locator(`text=${question}`)).toBeVisible()
}
```

### Lesson 2: Responsive Design Test Strategy

#### Be Explicit About Viewport

```typescript
// ❌ AMBIGUOUS: Relies on config default
test("navigation works", async ({ page }) => {
  await expect(page.locator("nav")).toBeVisible()
  // Fails if viewport is mobile-sized
})

// ✅ EXPLICIT: State which layout you're testing
test("desktop navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await expect(page.locator("nav.md\\:flex")).toBeVisible()
})

test("mobile navigation works", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await expect(page.locator('[aria-label="Toggle navigation"]')).toBeVisible()
})
```

#### Standard Viewport Sizes

| Device Type        | Width | Height | Use Case         |
| ------------------ | ----- | ------ | ---------------- |
| Mobile (iPhone SE) | 375   | 667    | Mobile testing   |
| Tablet (iPad)      | 768   | 1024   | Tablet testing   |
| Laptop             | 1280  | 720    | Small desktop    |
| Desktop            | 1920  | 1080   | Standard desktop |
| Large Desktop      | 2560  | 1440   | 4K testing       |

### Lesson 3: Playwright Artifact Analysis

#### Always Check Error Artifacts

```bash
test-results/
  └── test-name-browser/
      ├── error-context.md    # 👈 Shows ACTUAL DOM state
      ├── test-failed-1.png   # Screenshot of failure
      └── trace.zip           # Full execution recording
```

#### error-context.md Example

```yaml
# This shows the REAL page state at failure time
- heading "Frequently Asked Questions" [level=2] [ref=e54]
- paragraph [ref=e56]: Everything you need to know
```

**Key Insight**: If element appears in error-context.md, it's NOT a hydration issue - the DOM is complete.

### Lesson 4: CSS vs DOM State

#### Playwright Checks Computed CSS

```typescript
// Element exists in DOM but CSS hides it
<nav class="hidden md:flex">...</nav>

// This checks: getComputedStyle(nav).display !== "none"
await expect(page.locator("nav")).toBeVisible()

// On mobile viewport:
// - Element IS in DOM ✅
// - Computed style: display: none ❌
// - Test fails correctly
```

#### The Difference

| Method           | What It Checks                                                                    |
| ---------------- | --------------------------------------------------------------------------------- |
| `.locator()`     | Element exists in DOM                                                             |
| `.toBeVisible()` | Element exists AND computed display !== "none" AND opacity > 0 AND dimensions > 0 |
| `.textContent()` | All text including scripts                                                        |
| `.innerText()`   | Only visible text (better but still includes rendered scripts)                    |

---

## Recommendations for Test Writing

### 1. RSC/Next.js 13+ App Router Tests

#### DO:

- ✅ Use `page.locator()` with specific selectors
- ✅ Check element visibility with `.toBeVisible()`
- ✅ Use `waitForLoadState("networkidle")` in CI
- ✅ Target rendered content, not body text
- ✅ Check multiple specific elements

#### DON'T:

- ❌ Use `body.textContent()` for content checks
- ❌ Use `networkidle` in dev mode (blocks HMR)
- ❌ Assume page is incomplete if you see RSC scripts
- ❌ Check entire body content with string includes
- ❌ Use vague selectors like `.locator("div")`

### 2. Responsive Design Tests

#### DO:

- ✅ Set viewport explicitly in each test
- ✅ Test both mobile and desktop layouts
- ✅ Use descriptive test names ("desktop navigation")
- ✅ Check for viewport-specific elements
- ✅ Use Tailwind class selectors (e.g., `nav.md\\:flex`)

#### DON'T:

- ❌ Rely on default viewport for responsive tests
- ❌ Expect all elements visible on all viewports
- ❌ Ignore mobile navigation patterns
- ❌ Test only one viewport size
- ❌ Assume CSS classes are bugs

### 3. Debugging Failed Tests

#### Investigation Checklist

1. **Check error-context.md first**

   - Is element in DOM? → Not a hydration issue
   - Is element missing? → Check MSW mocks or data

2. **Check screenshot**

   - Is page rendered? → Check viewport size
   - Is page blank? → Timing or data issue

3. **Check trace.zip**

   - When did element appear?
   - What network requests fired?
   - Did MSW intercepts work?

4. **Check test strategy**
   - Using `.textContent()` on body? → Bad pattern
   - Testing responsive element? → Set viewport
   - Checking too early? → Add proper waits

### 4. Common Test Patterns

#### Pattern: Check Multiple Elements

```typescript
// ✅ Verify multiple elements loaded
const elements = [
  { selector: "h1", text: "Welcome" },
  { selector: "nav", text: "About" },
  { selector: "footer", text: "Contact" },
]

for (const { selector, text } of elements) {
  await expect(page.locator(selector, { hasText: text })).toBeVisible()
}
```

#### Pattern: Wait for Content + Interaction

```typescript
// ✅ Wait for specific content, then interact
await page.locator("text=Load More").waitFor({ state: "visible" })
await page.click("text=Load More")
await expect(page.locator("text=Additional Content")).toBeVisible()
```

#### Pattern: Viewport-Specific Navigation

```typescript
// ✅ Handle different nav patterns by viewport
async function navigateToAbout(page: Page) {
  const viewport = page.viewportSize()

  if (viewport.width < 768) {
    // Mobile: use hamburger menu
    await page.click('[aria-label="Toggle navigation"]')
    await page.click("text=About")
  } else {
    // Desktop: use nav bar
    await page.click('nav a[href="/about"]')
  }
}
```

---

## Solution Summary

### Error-Handling Test Fix (Applied)

**File**: `apps/ui/e2e/error-handling.spec.ts`

**Change**:

```typescript
// ❌ BEFORE: Checking body text
const bodyContent = await page.locator("body").textContent()
expect(bodyContent).toContain("FAQ")

// ✅ AFTER: Checking rendered element
const faqHeading = page.locator("text=/FAQ|Frequently Asked/i")
await expect(faqHeading).toBeVisible({ timeout: 20000 })
await expect(faqHeading).toContainText(/Frequently Asked|FAQ/i)
```

**Result**: ✅ Test passes (45/45 tests passing)

**Why It Works**:

- Targets specific rendered element instead of body text
- Avoids capturing RSC streaming scripts
- Clear, specific assertion that matches user experience

### Homepage Nav Test Fix (Pending)

**File**: `apps/ui/e2e/homepage.spec.ts`

**Change Needed**:

```typescript
test("should have navigation", async ({ page }) => {
  // ✅ ADD: Force desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 })

  test.setTimeout(90000)
  await navigateAndWaitForContent(page, "/en", /Home|About|Contact/i)
  await page.waitForLoadState("networkidle", { timeout: 15000 })

  const nav = page.locator("nav").first()
  await expect(nav).toBeVisible({ timeout: 10000 })
})
```

**Expected Result**: ✅ Test should pass with explicit desktop viewport

**Why It Will Work**:

- Forces desktop layout where `md:flex` applies
- Makes test intention explicit (testing desktop nav)
- Avoids responsive CSS hiding the nav element

### Contact Form Test (Not Yet Tested)

**File**: `apps/ui/e2e/contact-form.spec.ts`

**Current State**:

- networkidle waits added ✅
- Timeout increases applied ✅
- Element-based assertions already in place ✅

**Expected Result**: Should pass without changes, but needs local verification

---

## Future Considerations

### 1. Test Organization by Viewport

Consider organizing tests by viewport:

```
e2e/
  ├── mobile/
  │   ├── navigation.spec.ts
  │   └── forms.spec.ts
  ├── tablet/
  │   ├── navigation.spec.ts
  │   └── forms.spec.ts
  └── desktop/
      ├── navigation.spec.ts
      └── forms.spec.ts
```

### 2. Shared Test Utilities

Create helpers for common patterns:

```typescript
// e2e/utils/responsive.ts
export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 })
}

export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: 1920, height: 1080 })
}

export async function expectElementVisibleByViewport(
  page: Page,
  mobileSelector: string,
  desktopSelector: string
) {
  const viewport = page.viewportSize()
  const selector = viewport.width < 768 ? mobileSelector : desktopSelector
  await expect(page.locator(selector)).toBeVisible()
}
```

### 3. RSC-Aware Testing Guidelines

Document specifically for this project:

```markdown
## Testing Next.js 13+ App Router Pages

### Never Use These Patterns

- `body.textContent()` - captures RSC scripts
- `innerHTML` checks - includes streaming protocol
- String matching on full page content

### Always Use These Patterns

- Element locators: `page.locator("h1")`
- Visibility checks: `.toBeVisible()`
- Specific text matching: `page.locator("text=FAQ")`
```

### 4. CI/CD Pipeline Optimization

- Run desktop tests in parallel with mobile tests
- Use matrix strategy for viewport testing
- Cache playwright browsers
- Upload artifacts only on failure

---

## Related Documentation

- [E2E Testing Guide](README.md)
- [Troubleshooting E2E Tests](TROUBLESHOOTING.md)
- [MSW Implementation](../MSW_IMPLEMENTATION.md)
- [Test Data Seeding](test-data-seeding.md)

---

## Appendix: Example Test Patterns

### Full Example: Responsive Navigation Test

```typescript
import { test, expect } from "@playwright/test"

test.describe("Navigation", () => {
  test.describe("Desktop", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
    })

    test("shows horizontal nav bar", async ({ page }) => {
      await page.goto("/")
      await page.waitForLoadState("networkidle")

      const nav = page.locator("nav.md\\:flex")
      await expect(nav).toBeVisible()

      // Check nav contains expected links
      await expect(nav.locator("text=About")).toBeVisible()
      await expect(nav.locator("text=Contact")).toBeVisible()
    })
  })

  test.describe("Mobile", () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
    })

    test("shows hamburger menu", async ({ page }) => {
      await page.goto("/")
      await page.waitForLoadState("networkidle")

      const menuButton = page.locator('[aria-label="Toggle navigation"]')
      await expect(menuButton).toBeVisible()

      // Open menu and check links
      await menuButton.click()
      await expect(page.locator("text=About")).toBeVisible()
      await expect(page.locator("text=Contact")).toBeVisible()
    })
  })
})
```

### Full Example: RSC Content Check

```typescript
import { test, expect } from "@playwright/test"

test("FAQ section loads correctly", async ({ page }) => {
  await page.goto("/faq")
  await page.waitForLoadState("networkidle", { timeout: 15000 })

  // ✅ Check heading
  const heading = page.locator("h2", { hasText: /FAQ|Frequently Asked/i })
  await expect(heading).toBeVisible({ timeout: 20000 })

  // ✅ Check multiple questions exist
  const questions = [
    "What technologies do you use?",
    "How long does a typical project take?",
    "Do you provide ongoing support?",
  ]

  for (const question of questions) {
    const questionElement = page.locator(`text=${question}`)
    await expect(questionElement).toBeVisible()
  }

  // ✅ Test interaction
  const firstQuestion = page.locator("text=What technologies do you use?")
  await firstQuestion.click()

  const answer = page.locator("text=/Next.js|React|TypeScript/i")
  await expect(answer).toBeVisible()
})
```

---

**Document Status**: Reference - Keep updated with new discoveries  
**Last Updated**: December 18, 2025  
**Next Review**: When adding new RSC-related tests or encountering similar issues
