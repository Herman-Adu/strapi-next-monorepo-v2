# E2E Test Troubleshooting Guide

**Last Updated**: December 5, 2025  
**Phase**: Phase 4 - E2E Test Validation & Fixes

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Test Failure Categories](#test-failure-categories)
3. [GDPR Checkbox Issues](#gdpr-checkbox-issues)
4. [Homepage Navigation Timeouts](#homepage-navigation-timeouts)
5. [404 Status Code Issues](#404-status-code-issues)
6. [API Integration Failures](#api-integration-failures)
7. [Browser-Specific Issues](#browser-specific-issues)
8. [Debugging Workflow](#debugging-workflow)
9. [Common Patterns & Solutions](#common-patterns--solutions)

---

## Overview

This guide documents all E2E test failures encountered during Phase 4 validation (December 5, 2025) with detailed root cause analysis, trace file evidence, and solutions.

### Test Suite Status

**Initial Run Results:**

- **Total Tests**: 162 (across 3 browsers: Chromium, Firefox, WebKit)
- **Passed**: 88 (54%)
- **Failed**: 29 (18%)
- **Skipped**: 3 (2%)
- **Not Run**: 42 (26%)
- **Duration**: 5.7 minutes

### Failure Distribution

```
┌──────────────────────────────┬───────┬──────────┐
│ Category                     │ Tests │ Priority │
├──────────────────────────────┼───────┼──────────┤
│ GDPR Checkbox Blocking       │   10  │    🔴    │
│ Homepage Navigation Timeout  │    6  │    🟡    │
│ 404 Status Code Incorrect    │    3  │    🟠    │
│ API Integration Issues       │    3  │    🟡    │
│ Browser-Specific Edge Cases  │    7  │    🟢    │
└──────────────────────────────┴───────┴──────────┘
```

---

## Test Failure Categories

### Category Breakdown

#### 🔴 Critical (Blocking Core Functionality)

- **GDPR Checkbox** - Submit buttons disabled, form submissions blocked
- **Impact**: Newsletter subscription, contact forms, any form with GDPR consent

#### 🟡 High (Navigation & User Experience)

- **Homepage Navigation** - `/en` route timing out
- **API Integration** - Strapi data fetching not detected
- **Impact**: User navigation, content loading, API communication

#### 🟠 Medium (Error Handling)

- **404 Status Codes** - Wrong HTTP status returned
- **Impact**: SEO, error page functionality

#### 🟢 Low (Edge Cases)

- **Browser-Specific** - Firefox offline mode, WebKit load cancellations
- **Impact**: Specific browser scenarios, not critical user flows

---

## GDPR Checkbox Issues

### Priority: 🔴 CRITICAL

### Affected Tests (10 failures)

**Newsletter Tests:**

- `[chromium] › newsletter.spec.ts:41` - "should validate empty email submission"
- `[firefox] › newsletter.spec.ts:58` - "should validate invalid email format"

**Error Handling Tests:**

- `[chromium] › error-handling.spec.ts:84` - "should handle form submission network errors"
- `[firefox] › error-handling.spec.ts:84` - "should handle form submission network errors"
- `[webkit] › error-handling.spec.ts:84` - "should handle form submission network errors"
- `[chromium] › error-handling.spec.ts:299` - "should handle page reload during submission"
- `[firefox] › error-handling.spec.ts:299` - "should handle page reload during submission"
- `[webkit] › error-handling.spec.ts:299` - "should handle page reload during submission"
- Plus 2 more in rapid navigation tests

### Error Pattern

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Subscribe")').first()
  - locator resolved to <button disabled type="submit"...>
  - attempting click action
  - waiting for element to be visible, enabled and stable
  - element is not enabled ← BLOCKED HERE
```

### Root Cause Analysis

#### Evidence from Trace Files

**File**: `test-results/newsletter-Newsletter-Subs-ee4e3-date-empty-email-submission-chromium/error-context.md`

**DOM Snapshot at Failure:**

```yaml
- checkbox "I agree to receive marketing emails Privacy Policy..." [active] [ref=e60]
- checkbox
- generic [ref=e61] [cursor=pointer]:
    - text: I agree to receive marketing emails
    - link "Privacy Policy" [ref=e62]:
        - /url: /privacy

# Submit button state:
- button "Subscribe" [disabled]  ← STILL DISABLED!
```

**Key Observations:**

1. ✅ Checkbox shows `[active]` state - appears checked visually
2. ❌ Submit button remains `[disabled]`
3. ❌ React state `agreedToTerms` not updating

#### Code Analysis

**NewsletterForm.tsx** (Lines 94-98):

```tsx
disabled={
  subscriberMutation.isPending ||
  (gdpr?.href ? !agreedToTerms : false)  ← Button disabled when agreedToTerms is false
}
```

**NewsletterForm.tsx** (Lines 106-115):

```tsx
{gdpr?.href && (
  <GDPRCheckbox
    id="newsletter-gdpr-consent"  ← CUSTOM ID!
    checked={agreedToTerms}
    onCheckedChange={setAgreedToTerms}  ← Must trigger to enable button
    ...
  />
)}
```

**Test Helper** (apps/ui/e2e/utils/test-helpers.ts, Lines 75-88):

```typescript
// Strategy 1: Find checkbox by id="gdpr-consent"
const gdprLabel = page.locator('label[for="gdpr-consent"]')  ← WRONG ID!
```

### The Problem 🐛

**ID Mismatch:**

- Test helper looks for: `label[for="gdpr-consent"]`
- NewsletterForm uses: `id="newsletter-gdpr-consent"`
- **Result**: Label not found, checkbox never clicked, `onCheckedChange` never fired, `agreedToTerms` stays `false`, button stays disabled

### Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Test Execution Flow (CURRENT - BROKEN)                     │
└─────────────────────────────────────────────────────────────┘

1. Test Helper: checkGDPRCheckboxIfPresent()
   ↓
2. Look for: page.locator('label[for="gdpr-consent"]')
   ↓
3. NOT FOUND (actual ID is "newsletter-gdpr-consent")
   ↓
4. Fallback: page.locator('[role="checkbox"]').first()
   ↓
5. Click checkbox button directly
   ↓
6. Visual state changes (data-state="checked") ✓
   ↓
7. BUT: onCheckedChange event NOT fired properly ✗
   ↓
8. React state agreedToTerms remains FALSE ✗
   ↓
9. Button disabled={!agreedToTerms} stays TRUE ✗
   ↓
10. Test tries: submitButton.click()
    ↓
11. FAIL: "element is not enabled"


┌─────────────────────────────────────────────────────────────┐
│ Expected Flow (FIXED)                                       │
└─────────────────────────────────────────────────────────────┘

1. Test Helper: checkGDPRCheckboxIfPresent()
   ↓
2. Look for BOTH IDs:
   - 'label[for="gdpr-consent"]' OR
   - 'label[for="newsletter-gdpr-consent"]'
   ↓
3. FOUND newsletter label ✓
   ↓
4. Click label (proper accessibility pattern)
   ↓
5. Label click triggers Radix UI Checkbox
   ↓
6. Checkbox calls: onCheckedChange(true)
   ↓
7. React calls: setAgreedToTerms(true) ✓
   ↓
8. Button disabled={false} becomes enabled ✓
   ↓
9. Test: submitButton.click() succeeds ✓
```

### Solution

**Update test-helpers.ts** to check for multiple possible GDPR checkbox IDs:

```typescript
export async function checkGDPRCheckboxIfPresent(
  page: Page,
  options?: { timeout?: number }
): Promise<boolean> {
  const { timeout = 5000 } = options || {}

  try {
    // Strategy 1: Find checkbox by common IDs and click label
    // Try multiple possible IDs (components may use different IDs)
    const possibleIds = [
      "gdpr-consent", // Default GDPRCheckbox ID
      "newsletter-gdpr-consent", // NewsletterForm ID
      "contact-gdpr-consent", // Potential ContactForm ID
    ]

    for (const id of possibleIds) {
      const label = page.locator(`label[for="${id}"]`)
      const labelVisible = await label
        .isVisible({ timeout: 1000 })
        .catch(() => false)

      if (labelVisible) {
        const checkbox = page.locator(`#${id}[role="checkbox"]`)
        const currentState = await checkbox.getAttribute("data-state")

        if (currentState !== "checked") {
          // Click label (proper accessibility pattern)
          await label.click()

          // Wait for React state update and button enable
          await page.waitForFunction(
            (checkboxId) => {
              const cb = document.querySelector(
                `#${checkboxId}[role="checkbox"]`
              )
              return cb?.getAttribute("data-state") === "checked"
            },
            checkboxId,
            { timeout: 3000 }
          )

          // Verify submit button is now enabled
          const submitButton = page.locator('button[type="submit"]').first()
          await page.waitForFunction(
            () => {
              const btn = document.querySelector('button[type="submit"]')
              return !btn?.hasAttribute("disabled")
            },
            { timeout: 3000 }
          )

          console.log(
            `✓ GDPR checkbox (${id}) checked and submit button enabled`
          )
        }
        return true
      }
    }

    // Strategy 2: Fallback - find any checkbox
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

    return false
  } catch (error) {
    console.log("GDPR checkbox check failed:", error)
    return false
  }
}
```

### Testing the Fix

```powershell
# Run single failing test in headed mode to observe
$env:HEADED=1; yarn workspace @repo/ui test:e2e newsletter.spec.ts:41 --project=chromium

# Run all newsletter tests to verify fix
yarn workspace @repo/ui test:e2e newsletter.spec.ts

# Run error-handling tests that also use GDPR checkbox
yarn workspace @repo/ui test:e2e error-handling.spec.ts --grep="form submission"
```

### Expected Results After Fix

- ✅ Checkbox clicks successfully
- ✅ `data-state="checked"` attribute set
- ✅ `onCheckedChange` event fires
- ✅ `agreedToTerms` React state updates to `true`
- ✅ Submit button `disabled` attribute removed
- ✅ Form submission proceeds
- ✅ 10+ tests now passing

---

## Homepage Navigation Timeouts

### Priority: 🟡 HIGH

### Affected Tests (6 failures)

- `[chromium] › homepage.spec.ts:4` - "should load successfully"
- `[firefox] › homepage.spec.ts:15` - "should have navigation"
- `[chromium/firefox/webkit] › error-handling.spec.ts` - Browser navigation tests (4 tests)

### Error Pattern

```
Test timeout of 60000ms exceeded.
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/en", waiting until "domcontentloaded"
```

### Root Cause Analysis

**Issue**: The `/en` route takes longer than 60 seconds to emit the `domcontentloaded` event.

**Why This Happens:**

1. `/en` is a dynamic route with Next.js App Router
2. May have heavy SSR processing or slow API calls
3. Dev mode HMR/websockets may interfere with load events
4. `domcontentloaded` strategy unreliable with Next.js 15

**Comparison:**

- `/en/e2e-test-page`: Loads successfully ✅
- `/en`: Times out ❌

### Solution

Use the proven `navigateAndWaitForContent()` pattern from working FAQ tests:

**Instead of:**

```typescript
await page.goto("/en", { waitUntil: "domcontentloaded" })
```

**Use:**

```typescript
await navigateAndWaitForContent(page, "/en", /Home|Services|Contact|About/i)

// Or explicit selector wait:
await page.goto("/en")
await page.waitForSelector("nav", { state: "visible", timeout: 15000 })
```

### Files to Update

1. **`apps/ui/e2e/homepage.spec.ts`** - All tests
2. **`apps/ui/e2e/error-handling.spec.ts`** - Navigation tests (lines 252, 283)

### Testing the Fix

```powershell
# Test homepage loading
yarn workspace @repo/ui test:e2e homepage.spec.ts --project=chromium

# Test navigation scenarios
yarn workspace @repo/ui test:e2e error-handling.spec.ts --grep="navigation"
```

---

## 404 Status Code Issues

### Priority: 🟠 MEDIUM

### Affected Tests (3 failures)

- `[chromium/firefox/webkit] › error-handling.spec.ts:4` - "should display 404 page for non-existent routes"

### Error Pattern

```typescript
expect(response?.status()).toBe(404)
//                         ^
// Expected: 404
// Received: 200
```

### Root Cause

Next.js catch-all route `[[...rest]]` catches ALL routes including non-existent ones, rendering without `notFound()`.

**File**: `apps/ui/src/app/[locale]/[[...rest]]/page.tsx`

**Current Code:**

```tsx
export default async function Page({ params }) {
  const page = await getPageData(params.rest)

  // Even if page is null, still renders (returns 200)
  return <PageBuilder data={page} />
}
```

### Solution

Add `notFound()` when page doesn't exist:

```tsx
import { notFound } from "next/navigation"

export default async function Page({ params }) {
  const page = await getPageData(params.rest)

  if (!page) {
    notFound() // ← Returns 404 status
  }

  return <PageBuilder data={page} />
}
```

### Testing the Fix

```powershell
# Test in browser first
# Navigate to: http://localhost:3000/en/non-existent-route
# Should see 404 page

# Run E2E test
yarn workspace @repo/ui test:e2e error-handling.spec.ts --grep="404"
```

---

## API Integration Failures

### Priority: 🟡 HIGH

### Affected Tests (3 failures)

- `[chromium/firefox] › api-integration.spec.ts:81` - "should successfully fetch data from Strapi API endpoint"
- `[webkit] › api-integration.spec.ts:33` - "should have clean console with no API errors"

### Error Patterns

**Chromium/Firefox:**

```typescript
expect(apiResponseReceived).toBe(true)
// Received: false (API call not detected)
```

**WebKit:**

```typescript
expect(criticalNetworkErrors.length).toBe(0)
// Received: 3
// Errors: ['http://localhost:3000/_next/static/chunks/.../page.js - Load request cancelled']
```

### Root Cause Analysis

**Issue 1**: API response event listener not capturing Strapi fetch  
**Issue 2**: WebKit treating HMR chunk load cancellations as errors (false positives)

### Solution

**For WebKit HMR Errors:**

```typescript
// Filter out Next.js static asset cancellations
const criticalNetworkErrors = networkErrors.filter(
  (err) =>
    !err.includes("_next/static") &&
    !err.includes("Load request cancelled") &&
    !err.includes("webpack-hmr")
)
```

**For API Detection:**
Increase wait time and add explicit Strapi domain check:

```typescript
// Wait for API response from Strapi
await page.waitForResponse(
  (response) => response.url().includes("localhost:1337") && response.ok(),
  { timeout: 5000 }
)
```

### Testing the Fix

```powershell
# Run API integration tests
yarn workspace @repo/ui test:e2e api-integration.spec.ts
```

---

## Browser-Specific Issues

### Priority: 🟢 LOW (Edge Cases)

### Affected Tests (7 failures)

- Network offline tests (Firefox)
- 3G simulation tests (Firefox)
- Page reload during interactions
- Window resize tests

### Status

These are edge cases with browser-specific behavior differences. Not critical for core user flows.

### Future Approach

1. Document browser limitations
2. Add `test.skip()` for known incompatibilities if needed
3. Focus on critical path testing first
4. Revisit during Phase 5 (Advanced Testing)

---

## Debugging Workflow

### Step-by-Step Process

#### 1. Run Tests with Trace

```powershell
# Run specific test with trace
yarn workspace @repo/ui test:e2e <test-file>.spec.ts --trace on

# Or run all tests (trace on failure only)
yarn workspace @repo/ui test:e2e
```

#### 2. Examine Test Results Directory

```powershell
# List failed tests
Get-ChildItem -Path "test-results" -Directory | Where-Object {$_.Name -notlike "*passed*"}

# Check specific failure
Get-ChildItem -Path "test-results/<test-name>" | Select Name, Length
```

#### 3. Read Error Context

```powershell
# View error details
Get-Content "test-results/<test-name>/error-context.md" | Select-Object -Last 50

# Or view screenshot
Start-Process "test-results/<test-name>/test-failed-1.png"
```

#### 4. Analyze Trace File

```powershell
# Open trace in Playwright Inspector
npx playwright show-trace test-results/<test-name>/trace.zip
```

**Trace Shows:**

- ✅ Every action taken
- ✅ DOM snapshots at each step
- ✅ Network requests
- ✅ Console logs
- ✅ Timing information
- ✅ Screenshots at failure point

#### 5. Run in Headed Mode

```powershell
# Watch test execute visually
$env:HEADED=1; yarn workspace @repo/ui test:e2e <test-file>.spec.ts --project=chromium
```

#### 6. Implement Fix

Based on trace evidence and DOM analysis, update:

- Test helpers (`apps/ui/e2e/utils/test-helpers.ts`)
- Test files (`apps/ui/e2e/*.spec.ts`)
- Application code (if bug found)

#### 7. Verify Fix

```powershell
# Run affected test only
yarn workspace @repo/ui test:e2e <test-file>.spec.ts

# If passing, run related tests
yarn workspace @repo/ui test:e2e <related-file>.spec.ts

# Final verification: full suite
yarn workspace @repo/ui test:e2e
```

---

## Common Patterns & Solutions

### Pattern 1: Disabled Submit Buttons

**Symptom**: Test times out clicking submit button  
**Cause**: Form validation or consent requirements not met  
**Solution**: Check for GDPR checkboxes, required fields, validation state

```typescript
// Always check for GDPR consent
await checkGDPRCheckboxIfPresent(page)

// Verify button is enabled before clicking
await expect(submitButton).toBeEnabled()
await submitButton.click()
```

### Pattern 2: Navigation Timeouts

**Symptom**: `page.goto()` exceeds timeout  
**Cause**: `domcontentloaded` unreliable with Next.js HMR  
**Solution**: Use content-based waiting

```typescript
// Instead of waitUntil: "domcontentloaded"
await navigateAndWaitForContent(page, "/route", /Expected Content/i)

// Or wait for specific element
await page.goto("/route")
await page.waitForSelector("nav", { state: "visible" })
```

### Pattern 3: Network Errors in Tests

**Symptom**: Tests fail with network errors  
**Cause**: HMR, websockets, or load cancellations (normal in dev)  
**Solution**: Filter expected errors

```typescript
const criticalErrors = networkErrors.filter(
  (err) =>
    !err.includes("_next/static") &&
    !err.includes("cancelled") &&
    !err.includes("webpack-hmr")
)
```

### Pattern 4: State Updates Not Detected

**Symptom**: Click action doesn't trigger state change  
**Cause**: Event handler not fired or React state update delayed  
**Solution**: Use `waitForFunction` to verify state

```typescript
await checkbox.click()

// Wait for React state update
await page.waitForFunction(
  () => {
    const el = document.querySelector("#my-element")
    return el?.getAttribute("data-state") === "checked"
  },
  { timeout: 3000 }
)
```

### Pattern 5: Element Not Found

**Symptom**: `locator.click()` fails with "not found"  
**Cause**: Selector too specific or ID mismatch  
**Solution**: Use multiple selectors or broader patterns

```typescript
// Try multiple possible selectors
const possibleSelectors = [
  "#specific-id",
  '[role="button"][aria-label="Action"]',
  'button:has-text("Action")',
]

for (const selector of possibleSelectors) {
  const element = page.locator(selector)
  if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
    await element.click()
    break
  }
}
```

---

## Resource Management Tips

### Avoiding IDE Overload

1. **Clean test results regularly**:

   ```powershell
   Remove-Item -Recurse -Force test-results, playwright-report
   ```

2. **Run tests in batches**:

   ```powershell
   # Run one test file at a time
   yarn workspace @repo/ui test:e2e newsletter.spec.ts
   yarn workspace @repo/ui test:e2e faq.spec.ts
   ```

3. **Use headed mode sparingly**:

   ```powershell
   # Only for debugging specific failures
   $env:HEADED=1; yarn workspace @repo/ui test:e2e <specific-test>
   ```

4. **Limit trace collection**:
   ```yaml
   # playwright.config.ts - only on failure
   trace: "retain-on-failure"
   ```

---

## Future Improvements

### Workflow Enhancements

1. **Test Data Management**

   - Create seed script for consistent test data
   - Document required Strapi content for each test
   - Version control test data schemas

2. **Visual Regression Testing**

   - Add Percy or Playwright screenshots
   - Baseline images for critical pages
   - Automated visual diff detection

3. **Performance Monitoring**

   - Track test execution times
   - Identify slow tests for optimization
   - Monitor test flakiness

4. **Documentation Generation**
   - Generate API docs from Strapi schemas
   - OpenAPI specification for endpoints
   - Storybook integration for components

---

**Document Version**: 1.0  
**Status**: Active  
**Next Review**: After Phase 4 completion

---

_This document is continuously updated as new patterns emerge and solutions are validated._
