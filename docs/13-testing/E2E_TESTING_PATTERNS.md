# E2E Testing Patterns Library

**Date**: December 7, 2024  
**Purpose**: Comprehensive pattern catalog for E2E test development  
**Source**: Consolidated from Phase 3&4 + Phases 1-5 recovery sessions  
**Coverage**: 12 battle-tested patterns with reusability scores

---

## 📋 Pattern Index

### Form Testing Patterns (Phase 3 & 4)

1. [Input Timing Pattern](#pattern-1-input-timing-pattern) ⭐⭐⭐⭐⭐
2. [Serial Mode Reset Pattern](#pattern-2-serial-mode-reset-pattern) ⭐⭐⭐⭐
3. [Toast Detection Pattern](#pattern-3-toast-detection-pattern) ⭐⭐⭐⭐⭐
4. [Validation Test Pattern](#pattern-4-validation-test-pattern) ⭐⭐⭐⭐
5. [Loading State Pattern](#pattern-5-loading-state-pattern) ⭐⭐⭐
6. [Wait Strategy Alignment](#pattern-6-wait-strategy-alignment) ⭐⭐⭐⭐⭐

### Error Handling Patterns (Phases 1-5)

7. [Wait Strategy Decision Tree](#pattern-7-wait-strategy-decision-tree) ⭐⭐⭐⭐⭐
8. [Visibility Wait Pattern](#pattern-8-visibility-wait-pattern) ⭐⭐⭐⭐⭐
9. [Offline Test Logic Pattern](#pattern-9-offline-test-logic-pattern) ⭐⭐⭐⭐
10. [Resource Blocking Pattern](#pattern-10-resource-blocking-pattern) ⭐⭐⭐⭐
11. [Serial Mode for Complex Workflows](#pattern-11-serial-mode-for-complex-workflows) ⭐⭐⭐⭐
12. [Rapid Navigation Pattern](#pattern-12-rapid-navigation-pattern) ⭐⭐⭐

---

## 🎯 Quick Selection Guide

**Choose your pattern based on scenario:**

| Scenario                             | Use Pattern(s)                 |
| ------------------------------------ | ------------------------------ |
| Form input not accepting values      | #1 Input Timing                |
| Form not resetting between tests     | #2 Serial Mode Reset           |
| Success message not detected         | #3 Toast Detection             |
| Testing disabled button states       | #4 Validation Test             |
| Loading spinner flickers             | #5 Loading State               |
| Tests timeout in dev mode            | #6, #7 Wait Strategy           |
| Navigation hangs with mocked network | #7 Wait Strategy Decision Tree |
| Content not visible after navigation | #8 Visibility Wait             |
| Offline/online mode switching        | #9 Offline Test Logic          |
| Testing with blocked CSS/images      | #10 Resource Blocking          |
| Dev server exhaustion                | #11 Serial Mode Workflows      |
| Multiple rapid page navigations      | #12 Rapid Navigation           |

---

## Form Testing Patterns

### Pattern 1: Input Timing Pattern

**Reusability**: ⭐⭐⭐⭐⭐ (Universal - applies to ALL form inputs)

**Problem**: Input fields not accepting `.fill()` values, resulting in empty submissions and no form processing.

**Root Cause**: `.fill()` executes before input element is fully ready to accept user interaction, even if element exists in DOM.

**Solution**: Explicit visibility wait before every `.fill()` operation.

**Code Example**:

```typescript
// ❌ BEFORE (unreliable)
await page.locator('input[name="email"]').fill("test@example.com")

// ✅ AFTER (reliable)
const emailInput = page.locator('input[name="email"]')
await emailInput.waitFor({ state: "visible" })
await emailInput.fill("test@example.com")
```

**When to Use**:

- ALL form input interactions (text, email, textarea, etc.)
- Autocomplete fields
- Dynamic forms that appear after user action
- Forms with client-side validation

**Where Applied**:

- `contact-form.spec.ts` (14 tests)
- `newsletter.spec.ts` (8 tests)
- `error-handling.spec.ts` (test #14)

**Reusability Score Justification**:
5/5 - This pattern is **mandatory** for ALL form testing. Zero exceptions. Every `.fill()` needs a visibility wait.

---

### Pattern 2: Serial Mode Reset Pattern

**Reusability**: ⭐⭐⭐⭐ (High - essential for serial test suites)

**Problem**: Tests pass individually but fail when run in serial mode because form values persist from previous tests.

**Root Cause**: Next.js dev server with HMR doesn't fully reset React component state between serial tests. Forms retain previous values.

**Solution**: Verify all form inputs are empty/reset at start of each test using explicit value checks.

**Code Example**:

```typescript
// Configure suite for serial mode
test.describe.configure({ mode: "serial" })

test("should handle form submission", async ({ page }) => {
  await page.goto("/contact")

  // ✅ Verify reset state before test
  await expect(page.locator('input[name="name"]')).toHaveValue("", {
    timeout: 5000,
  })
  await expect(page.locator('input[name="email"]')).toHaveValue("", {
    timeout: 5000,
  })
  await expect(page.locator('textarea[name="message"]')).toHaveValue("", {
    timeout: 5000,
  })

  // Now proceed with test...
})
```

**When to Use**:

- Serial mode test suites (`mode: "serial"`)
- Forms that submit and reset
- Tests that modify shared state
- Multi-step workflows

**Where Applied**:

- `contact-form.spec.ts` (all 14 tests)
- `newsletter.spec.ts` (all 8 tests)

**Reusability Score Justification**:
4/5 - Critical for serial mode, less relevant for parallel tests. Applies to ~40% of test scenarios.

---

### Pattern 3: Toast Detection Pattern

**Reusability**: ⭐⭐⭐⭐⭐ (Universal - applies to all success/error feedback)

**Problem**: Toast messages appear/disappear before test can detect them, causing false failures.

**Root Cause**: Toasts have auto-dismiss timers (typically 3-5 seconds). Tests need to catch them during visibility window.

**Solution**: Standardized helper function with appropriate timeout and visibility assertions.

**Code Example**:

```typescript
// Helper function (in test-helpers.ts)
export async function waitForSuccessToast(
  page: Page,
  expectedText: string = "Success!"
) {
  const toast = page.locator('[role="status"]', { hasText: expectedText })
  await toast.waitFor({ state: "visible", timeout: 10000 })
  await expect(toast).toBeVisible()
}

// Usage in tests
test("should show success toast", async ({ page }) => {
  // ... form submission code ...

  await waitForSuccessToast(page, "Message sent successfully!")
})
```

**When to Use**:

- Form submission feedback
- API operation results
- User action confirmations
- Error message display
- Any temporary notification

**Where Applied**:

- `contact-form.spec.ts` (tests with submissions)
- `newsletter.spec.ts` (tests with submissions)
- Future atomic components with feedback

**Reusability Score Justification**:
5/5 - Standard UI pattern across ALL interactive components. Highly reusable helper function.

---

### Pattern 4: Validation Test Pattern

**Reusability**: ⭐⭐⭐⭐ (High - common for form validation testing)

**Problem**: Cannot click disabled submit buttons to verify validation is working.

**Root Cause**: Playwright (correctly) prevents clicking disabled elements by default to mimic real user behavior.

**Solution**: Use `{ force: true }` option when intentionally testing disabled state behavior.

**Code Example**:

```typescript
test("should prevent submission with invalid data", async ({ page }) => {
  await page.goto("/contact")

  // Fill invalid data
  const emailInput = page.locator('input[name="email"]')
  await emailInput.waitFor({ state: "visible" })
  await emailInput.fill("invalid-email")

  // ✅ Force click to test validation
  await page.locator('button[type="submit"]').click({ force: true })

  // Verify NO success toast appears
  const toast = page.locator('[role="status"]')
  await expect(toast).not.toBeVisible({ timeout: 3000 })
})
```

**When to Use**:

- Testing disabled button states
- Form validation testing
- Testing state-dependent UI elements
- Verifying user actions are blocked

**Where Applied**:

- `contact-form.spec.ts` (validation tests)
- `newsletter.spec.ts` (validation tests)

**Reusability Score Justification**:
4/5 - Common pattern for validation testing. Applies whenever testing form constraints.

---

### Pattern 5: Loading State Pattern

**Reusability**: ⭐⭐⭐ (Medium - useful but not always necessary)

**Problem**: Tests fail trying to verify loading spinner visibility in micro-state timeframes.

**Root Cause**: Loading states (especially in dev mode) can be extremely brief (< 100ms), making direct visibility assertions flaky.

**Solution**: Test the complete workflow (before → after) rather than intermediate states. Focus on outcomes, not transitions.

**Code Example**:

```typescript
// ❌ AVOID (flaky in dev mode)
test("should show loading spinner", async ({ page }) => {
  await submitButton.click()
  await expect(loadingSpinner).toBeVisible() // May already be gone!
})

// ✅ PREFERRED (reliable)
test("should complete submission workflow", async ({ page }) => {
  // 1. Verify initial state
  await expect(submitButton).toBeEnabled()

  // 2. Trigger action
  await submitButton.click()

  // 3. Verify final outcome
  await waitForSuccessToast(page, "Success!")
  await expect(submitButton).toBeEnabled() // Back to enabled
})
```

**When to Use**:

- Fast operations (< 500ms)
- Dev mode testing
- When loading state timing is unpredictable
- Focus on user outcomes over transitions

**Where Applied**:

- `contact-form.spec.ts` (submission tests)
- `newsletter.spec.ts` (submission tests)

**Reusability Score Justification**:
3/5 - Useful principle but not always applicable. More of a testing philosophy than concrete pattern.

---

### Pattern 6: Wait Strategy Alignment

**Reusability**: ⭐⭐⭐⭐⭐ (Universal - critical for dev/HMR environments)

**Problem**: Tests timeout or hang indefinitely during `page.goto()` in development mode.

**Root Cause**: Using `waitUntil: "networkidle"` in dev environments with HMR creates infinite waiting because dev server maintains open connections.

**Solution**: Use `waitUntil: "domcontentloaded"` in development mode for faster, more reliable navigation.

**Code Example**:

```typescript
// ❌ AVOID in dev mode
await page.goto("/contact", { waitUntil: "networkidle" }) // Hangs with HMR

// ✅ PREFERRED in dev mode
await page.goto("/contact", { waitUntil: "domcontentloaded" })
```

**Decision Matrix**:

```typescript
// Development mode (localhost with HMR)
waitUntil: "domcontentloaded"

// Production mode (static builds)
waitUntil: "networkidle" // OR "load"

// Testing specific resources
waitUntil: "commit" // Fastest, when you just need HTML
```

**When to Use**:

- ALL navigation in development mode
- Tests running against `localhost:3000`
- Environments with hot module replacement
- Fast iteration during test development

**Where Applied**:

- `contact-form.spec.ts` (all navigations)
- `newsletter.spec.ts` (all navigations)
- `error-handling.spec.ts` (strategic navigations)
- Will apply to ALL future E2E tests

**Reusability Score Justification**:
5/5 - **Universal requirement** for dev mode testing. Every navigation needs correct wait strategy.

---

## Error Handling Patterns

### Pattern 7: Wait Strategy Decision Tree

**Reusability**: ⭐⭐⭐⭐⭐ (Universal - applies to ALL navigation scenarios)

**Problem**: Tests timeout when using `networkidle` with mocked network conditions (offline, blocked resources, slow connections).

**Root Cause**: `networkidle` waits for 500ms with ZERO network activity. Blocked/retrying resources prevent network from ever being idle.

**Solution**: Decision tree for choosing the right wait strategy based on test scenario.

**Decision Tree**:

```
Are you mocking network conditions?
├─ YES → Use "domcontentloaded"
│   └─ Examples: offline mode, blocked CSS/images, slow 3G
│
└─ NO → Are you in development mode?
    ├─ YES → Use "domcontentloaded" (HMR keeps connections open)
    │
    └─ NO → Are you testing resource loading?
        ├─ YES → Use "load" or "networkidle"
        │
        └─ NO → Use "domcontentloaded" (fastest)
```

**Code Example**:

```typescript
// Scenario 1: Testing offline behavior
test("should show offline message", async ({ page, context }) => {
  await context.setOffline(true)

  // ✅ Use domcontentloaded (networkidle will never resolve)
  await page.goto("/", { waitUntil: "domcontentloaded" })
})

// Scenario 2: Blocking CSS resources
test("should work without CSS", async ({ page }) => {
  await page.route("**/*.css", (route) => route.abort())

  // ✅ Use domcontentloaded (CSS retries prevent networkidle)
  await page.goto("/", { waitUntil: "domcontentloaded" })
})

// Scenario 3: Development mode
test("should load form", async ({ page }) => {
  // ✅ Use domcontentloaded (HMR maintains connections)
  await page.goto("/contact", { waitUntil: "domcontentloaded" })
})

// Scenario 4: Production testing (rare in our setup)
test("should load all images", async ({ page }) => {
  // ✅ Use networkidle (ensures all resources loaded)
  await page.goto("/gallery", { waitUntil: "networkidle" })
})
```

**When to Use**:

- EVERY `page.goto()` call
- EVERY `page.reload()` call
- Any navigation operation

**Where Applied**:

- `error-handling.spec.ts` (15 tests - fixed 13 timeouts)
- `contact-form.spec.ts` (all navigations)
- All existing and future test files

**Reusability Score Justification**:
5/5 - **Critical pattern for ALL navigation**. Prevents ~80% of timeout failures. Must apply to every test file.

---

### Pattern 8: Visibility Wait Pattern

**Reusability**: ⭐⭐⭐⭐⭐ (Universal - applies after ANY resource manipulation)

**Problem**: Content exists in DOM but isn't visible/interactive after navigation with blocked/modified resources.

**Root Cause**: `domcontentloaded` confirms HTML parsing, but doesn't guarantee rendering or layout computation, especially when CSS is blocked/delayed.

**Solution**: Add explicit visibility wait after navigation when manipulating resources (CSS, images, fonts).

**Code Example**:

```typescript
test("should render without CSS", async ({ page }) => {
  // Block CSS resources
  await page.route("**/*.css", (route) => route.abort())

  // Navigate with domcontentloaded
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // ✅ CRITICAL: Wait for body to be visible
  await page.locator("body").waitFor({ state: "visible" })

  // Now safe to interact with page
  await expect(page.locator("h1")).toBeVisible()
})
```

**Universal Application**:

```typescript
// Pattern applies to inputs too (Pattern 1)
const input = page.locator('input[name="email"]')
await input.waitFor({ state: "visible" })
await input.fill("test@example.com")

// Pattern applies to any critical element
const submitButton = page.locator('button[type="submit"]')
await submitButton.waitFor({ state: "visible" })
await submitButton.click()
```

**When to Use**:

- After navigation with `domcontentloaded`
- After blocking CSS/images/fonts
- After slow network simulation
- Before ANY interaction with page elements
- Form inputs (Pattern 1)
- Dynamic content that loads after page

**Where Applied**:

- `error-handling.spec.ts` (tests #1, #2, #6, #7, #12, #13, #14)
- `contact-form.spec.ts` (all input interactions)
- `newsletter.spec.ts` (all input interactions)

**Reusability Score Justification**:
5/5 - **Defensive programming best practice**. Should be default behavior after navigation. Prevents race conditions.

---

### Pattern 9: Offline Test Logic Pattern

**Reusability**: ⭐⭐⭐⭐ (High - standard for offline/network testing)

**Problem**: Offline tests fail because attempting to navigate while already offline causes immediate timeout.

**Root Cause**: When browser context is offline, `page.goto()` cannot load ANY resources (HTML, JS, CSS), causing navigation to fail before test begins.

**Solution**: **Always navigate ONLINE first**, then switch to offline mode to test behavior.

**Code Example**:

```typescript
// ❌ WRONG (immediate failure)
test("should handle offline state", async ({ page, context }) => {
  await context.setOffline(true) // Browser is offline
  await page.goto("/contact") // ❌ Cannot load page!
})

// ✅ CORRECT (reliable)
test("should handle offline state", async ({ page, context }) => {
  // 1. Navigate while ONLINE
  await page.goto("/contact", { waitUntil: "domcontentloaded" })

  // 2. NOW switch to offline
  await context.setOffline(true)

  // 3. Test offline behavior (form submission, error messages, etc.)
  await expect(page.locator(".offline-indicator")).toBeVisible()

  // 4. Restore online state for cleanup
  await context.setOffline(false)
})
```

**Workflow Pattern**:

```
1. ONLINE  → Navigate to page (loads resources)
2. OFFLINE → Test offline behavior
3. ONLINE  → Restore for next test
```

**When to Use**:

- Testing offline mode
- Testing network error handling
- Testing service worker behavior
- Testing "no connection" UI states
- Testing retry logic

**Where Applied**:

- `error-handling.spec.ts` (test #4)
- Future PWA/offline features
- Network resilience tests

**Reusability Score Justification**:
4/5 - Standard pattern for ALL offline testing. Will apply to every offline scenario, but not every test suite needs it.

---

### Pattern 10: Resource Blocking Pattern

**Reusability**: ⭐⭐⭐⭐ (High - essential for graceful degradation testing)

**Problem**: Tests timeout when blocking resources (CSS, images, fonts) due to infinite retry loops.

**Root Cause**: Blocked resources cause browser to retry indefinitely. Using `networkidle` waits for retries to stop (never happens).

**Solution**: Block resources + use `domcontentloaded` + add visibility wait.

**Code Example**:

```typescript
test("should work without CSS", async ({ page }) => {
  // 1. Set up resource blocking BEFORE navigation
  await page.route("**/*.css", (route) => route.abort())

  // 2. Navigate with domcontentloaded (not networkidle!)
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // 3. Add visibility wait for stability
  await page.locator("body").waitFor({ state: "visible" })

  // 4. Test graceful degradation
  await expect(page.locator("h1")).toBeVisible()
  await expect(page.locator("nav")).toBeVisible()
})
```

**Resource Blocking Examples**:

```typescript
// Block CSS
await page.route("**/*.css", (route) => route.abort())

// Block images
await page.route("**/*.{png,jpg,jpeg,gif,webp}", (route) => route.abort())

// Block fonts
await page.route("**/*.{woff,woff2,ttf}", (route) => route.abort())

// Block API calls
await page.route("**/api/**", (route) => route.abort())

// Block specific third-party
await page.route("**/*.google-analytics.com/**", (route) => route.abort())
```

**When to Use**:

- Testing graceful degradation
- Testing accessibility without CSS
- Testing core functionality without images
- Testing resilience to CDN failures
- Performance testing (blocking heavy resources)

**Where Applied**:

- `error-handling.spec.ts` (tests #6, #7 - CSS blocking)
- Future performance tests
- Accessibility testing

**Reusability Score Justification**:
4/5 - Critical for resilience testing. Will apply to progressive enhancement and accessibility test suites.

---

### Pattern 11: Serial Mode for Complex Workflows

**Reusability**: ⭐⭐⭐⭐ (High - prevents dev server exhaustion)

**Problem**: Parallel test execution causes dev server exhaustion, leading to random timeouts and failures.

**Root Cause**: Multiple tests hitting dev server simultaneously (especially with HMR) overwhelms server resources, causing slow responses or hangs.

**Solution**: Use serial mode for test suites with complex workflows or many network operations.

**Code Example**:

```typescript
import { test, expect } from "@playwright/test"

// ✅ Configure at suite level
test.describe.configure({ mode: "serial" })

test.describe("Error Handling Tests", () => {
  test("should handle offline state", async ({ page, context }) => {
    // Complex workflow with multiple navigations/operations
  })

  test("should handle slow network", async ({ page, context }) => {
    // Another complex workflow
  })

  // Tests run ONE AT A TIME, preventing server exhaustion
})
```

**Serial vs Parallel Decision**:

```
Use SERIAL mode when:
├─ Complex multi-step workflows (form → submit → verify → reset)
├─ Heavy network mocking (offline, slow 3G, blocked resources)
├─ Error scenario testing (retries, timeouts, failures)
├─ Tests that modify global state
└─ Dev server showing signs of exhaustion

Use PARALLEL mode when:
├─ Simple smoke tests (page loads, element visibility)
├─ Independent navigation tests
├─ Read-only tests (no state modification)
└─ Fast, isolated unit-style E2E tests
```

**When to Use**:

- Error handling test suites
- Form submission workflows
- Multi-step user journeys
- Tests with extensive network mocking
- When seeing random timeouts in parallel mode

**Where Applied**:

- `error-handling.spec.ts` (15 tests - serial mode)
- `contact-form.spec.ts` (14 tests - serial mode)
- `newsletter.spec.ts` (8 tests - serial mode)
- `faq.spec.ts` (14 tests - serial mode)

**Reusability Score Justification**:
4/5 - Standard solution for workflow/form tests. Applies to ~60% of test suites. Simple smoke tests can stay parallel.

---

### Pattern 12: Rapid Navigation Pattern

**Reusability**: ⭐⭐⭐ (Medium - useful for multi-page workflows)

**Problem**: Tests with many rapid page navigations cause timeouts or missed interactions.

**Root Cause**: Each navigation creates pending requests. Rapid sequential navigations without visibility waits cause race conditions.

**Solution**: Minimize navigation count + add visibility waits after each navigation.

**Code Example**:

```typescript
// ❌ AVOID (unnecessary navigations)
test("should test multiple pages", async ({ page }) => {
  await page.goto("/")
  await page.goto("/about")
  await page.goto("/contact")
  await page.goto("/faq")
  // Too many navigations, high risk of issues
})

// ✅ BETTER (focused + visibility waits)
test("should test contact page features", async ({ page }) => {
  // Only navigate where necessary
  await page.goto("/contact", { waitUntil: "domcontentloaded" })

  // Add visibility wait
  await page.locator("body").waitFor({ state: "visible" })

  // Test all features on this page
  await testFormValidation(page)
  await testFormSubmission(page)
  await testErrorHandling(page)
  // Multiple tests, one navigation
})
```

**Optimization Strategies**:

```typescript
// Strategy 1: Test multiple features per navigation
await page.goto("/contact")
await testFeatureA()
await testFeatureB()
await testFeatureC()

// Strategy 2: Use in-page navigation when possible
await page.locator('a[href="#section"]').click()
// Faster than full page.goto()

// Strategy 3: Add visibility waits between navigations
await page.goto("/page1", { waitUntil: "domcontentloaded" })
await page.locator("body").waitFor({ state: "visible" })

await page.goto("/page2", { waitUntil: "domcontentloaded" })
await page.locator("body").waitFor({ state: "visible" })
```

**When to Use**:

- Multi-page user journeys
- Tests requiring multiple navigations
- Performance-sensitive test runs
- When optimizing test suite runtime

**Where Applied**:

- `error-handling.spec.ts` (tests #12, #13 - optimized navigation)
- Future user journey tests

**Reusability Score Justification**:
3/5 - Useful optimization principle but not universal. Most tests focus on single page. Applies to ~20% of scenarios.

---

## 🎓 Pattern Combinations

Some scenarios require multiple patterns working together:

### Combo 1: Complete Form Test

```typescript
test("should submit contact form", async ({ page }) => {
  // Pattern 6: Wait strategy alignment
  await page.goto("/contact", { waitUntil: "domcontentloaded" })

  // Pattern 2: Serial mode reset (if in serial mode)
  await expect(page.locator('input[name="email"]')).toHaveValue("", {
    timeout: 5000,
  })

  // Pattern 1: Input timing
  const emailInput = page.locator('input[name="email"]')
  await emailInput.waitFor({ state: "visible" })
  await emailInput.fill("test@example.com")

  const messageInput = page.locator('textarea[name="message"]')
  await messageInput.waitFor({ state: "visible" })
  await messageInput.fill("Test message")

  // Submit
  await page.locator('button[type="submit"]').click()

  // Pattern 3: Toast detection
  await waitForSuccessToast(page, "Message sent!")
})
```

### Combo 2: Offline Form Test

```typescript
test("should handle offline submission", async ({ page, context }) => {
  // Pattern 9: Offline test logic (navigate online first)
  await page.goto("/contact", { waitUntil: "domcontentloaded" })

  // Pattern 1: Input timing
  const emailInput = page.locator('input[name="email"]')
  await emailInput.waitFor({ state: "visible" })
  await emailInput.fill("test@example.com")

  // NOW go offline
  await context.setOffline(true)

  // Submit and verify error handling
  await page.locator('button[type="submit"]').click()
  await expect(page.locator(".error-message")).toContainText("offline")

  // Restore
  await context.setOffline(false)
})
```

### Combo 3: Resource Blocking Test

```typescript
test("should work without CSS", async ({ page }) => {
  // Pattern 10: Resource blocking
  await page.route("**/*.css", (route) => route.abort())

  // Pattern 7: Wait strategy decision (domcontentloaded with mocked network)
  await page.goto("/", { waitUntil: "domcontentloaded" })

  // Pattern 8: Visibility wait after resource blocking
  await page.locator("body").waitFor({ state: "visible" })

  // Test content is accessible
  await expect(page.locator("h1")).toBeVisible()
})
```

---

## 📊 Pattern Application Matrix

| Pattern               | Form Tests     | Error Tests           | Smoke Tests      | Future Atomic Components  |
| --------------------- | -------------- | --------------------- | ---------------- | ------------------------- |
| #1 Input Timing       | ✅ Required    | ✅ When forms present | ❌ No forms      | ✅ All interactive inputs |
| #2 Serial Reset       | ✅ Required    | ✅ Required           | ❌ Parallel OK   | ✅ Complex workflows      |
| #3 Toast Detection    | ✅ Required    | ⚠️ Optional           | ❌ No feedback   | ✅ All user feedback      |
| #4 Validation Test    | ✅ Required    | ⚠️ Optional           | ❌ No validation | ✅ Form validation        |
| #5 Loading State      | ⚠️ Optional    | ⚠️ Optional           | ❌ Not needed    | ⚠️ Optional               |
| #6 Wait Strategy      | ✅ Required    | ✅ Required           | ✅ Required      | ✅ UNIVERSAL              |
| #7 Wait Decision Tree | ✅ Required    | ✅ Required           | ✅ Required      | ✅ UNIVERSAL              |
| #8 Visibility Wait    | ✅ Required    | ✅ Required           | ⚠️ Optional      | ✅ Defensive practice     |
| #9 Offline Logic      | ❌ Usually not | ✅ Required           | ❌ Not needed    | ⚠️ If testing offline     |
| #10 Resource Blocking | ❌ Usually not | ✅ Required           | ❌ Not needed    | ⚠️ Resilience tests       |
| #11 Serial Mode       | ✅ Required    | ✅ Required           | ❌ Parallel OK   | ✅ Complex workflows      |
| #12 Rapid Navigation  | ⚠️ Optional    | ⚠️ Optimization       | ⚠️ Optimization  | ⚠️ Multi-page journeys    |

**Legend**:

- ✅ Required - Must apply this pattern
- ⚠️ Optional - Use based on scenario
- ❌ Not needed - Pattern doesn't apply

---

## 🚀 Quick Start for New Tests

**Step 1**: Determine test type

- Form test? → Use patterns 1, 2, 3, 6, 7, 8, 11
- Error test? → Use patterns 6, 7, 8, 9, 10, 11
- Smoke test? → Use patterns 6, 7

**Step 2**: Set up test file

```typescript
import { test, expect } from "@playwright/test"
import { waitForSuccessToast } from "./utils/test-helpers"

// For complex workflows
test.describe.configure({ mode: "serial" })

test.describe("Feature Name", () => {
  // Your tests here
})
```

**Step 3**: Write navigation

```typescript
// Always use domcontentloaded in dev mode
await page.goto("/path", { waitUntil: "domcontentloaded" })

// Add visibility wait for stability
await page.locator("body").waitFor({ state: "visible" })
```

**Step 4**: Write interactions

```typescript
// Always wait for visibility before fill
const input = page.locator('input[name="field"]')
await input.waitFor({ state: "visible" })
await input.fill("value")
```

**Step 5**: Verify outcomes

```typescript
// Use toast helper for feedback
await waitForSuccessToast(page, "Success message!")

// Use standard assertions for content
await expect(page.locator("selector")).toBeVisible()
```

---

## 📚 References

- **Phase 3 & 4 Recovery**: `docs/11-recovery/SESSION_RECOVERY_E2E_FORMS_PHASE_3_4.md`
- **Phases 1-5 Recovery**: `docs/11-recovery/SESSION_RECOVERY_ERROR_HANDLING_PHASES_1_5.md`
- **Test Status Report**: `docs/13-testing/E2E_TEST_SUITE_STATUS.md`
- **Quick Reference**: `docs/13-testing/quick-reference/e2e-patterns-quick-ref.md`
- **E2E Testing Guide**: `apps/ui/E2E_TESTING.md`
- **Playwright Docs**: https://playwright.dev/docs/api/class-page

---

**Last Updated**: December 7, 2024  
**Total Patterns**: 12  
**Test Coverage**: 69/69 tests (100%)  
**Atomic Component Ready**: ✅ Yes
