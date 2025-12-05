# Contact Form E2E Test Suite - Comprehensive Plan

**Created**: December 5, 2025  
**Status**: Planning Phase  
**Target**: Implement robust E2E test coverage for Contact Form

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Contact Form Architecture Analysis](#contact-form-architecture-analysis)
3. [Comparison with Newsletter Form](#comparison-with-newsletter-form)
4. [Test Coverage Plan](#test-coverage-plan)
5. [Implementation Strategy](#implementation-strategy)
6. [Risk Assessment](#risk-assessment)
7. [Success Criteria](#success-criteria)

---

## Executive Summary

### Objective

Build a comprehensive E2E test suite for the Contact Form that:

- Validates all form fields (name, email, message)
- Tests GDPR checkbox integration
- Verifies API submission flow
- Handles error states gracefully
- Tests across all 3 browsers (Chromium, Firefox, WebKit)

### Current State

- **Newsletter Form**: 24/24 tests passing (100%) ✅
- **Contact Form**: No test suite exists yet
- **Learnings Applied**: GDPR checkbox helper, navigation patterns, timeout handling

### Target Metrics

- **Goal**: 27+ tests (matching Newsletter complexity)
- **Pass Rate**: 100% across all browsers
- **Duration**: ~5-7 minutes (sequential execution)

---

## Contact Form Architecture Analysis

### Component Hierarchy

```
StrapiContactSection (Server Component)
├── ContactFormCard (Client Component)
    ├── ContactForm (Pure form fields)
    │   ├── AppForm (React Hook Form wrapper)
    │   ├── AppField (name)
    │   ├── AppField (email)
    │   └── AppTextArea (message)
    ├── GDPRCheckbox (Optional - Strapi configured)
    └── Button (Submit - external to form)
```

### Key Components

#### 1. **ContactForm.tsx** (Elementary Component)

**Location**: `apps/ui/src/components/elementary/forms/ContactForm.tsx`

**Responsibilities**:

- Pure form fields only (name, email, message)
- React Hook Form integration
- Zod validation schema
- Form submission via `useContactForm` mutation

**Key Fields**:

```typescript
{
  name: string (min 1 char)
  email: string (email format, min 1 char)
  message: string (min 10 chars)
}
```

**Form Configuration**:

- **Form ID**: `contactForm`
- **Validation**: `onBlur` mode, `onSubmit` revalidate
- **Toast Notifications**: Success/error feedback

#### 2. **ContactFormCard.tsx** (Page Builder Molecule)

**Location**: `apps/ui/src/components/page-builder/components/molecules/ContactFormCard.tsx`

**Responsibilities**:

- Client-side state management
- GDPR checkbox state (`agreedToTerms`)
- Submit button rendering
- Form mutation orchestration

**GDPR Integration**:

- Optional (configured via Strapi)
- Disables submit button when unchecked
- Uses `glassmorphic-sm` variant
- Checkbox ID: `gdpr-consent` (default)

#### 3. **useContactForm Hook**

**Location**: `apps/ui/src/hooks/useAppForm.ts`

**API Details**:

- **Endpoint**: `/api/contact-messages` (via proxy)
- **Method**: POST
- **Payload**: `{ data: { name, email, message } }`
- **UID**: `api::contact-message.contact-message`

**Mutation Behavior**:

- Uses `@tanstack/react-query` mutation
- No duplicate handling (unlike Newsletter)
- Returns success/error to component callbacks

---

## Comparison with Newsletter Form

### Similarities ✅

| Feature              | Newsletter  | Contact     | Notes                                       |
| -------------------- | ----------- | ----------- | ------------------------------------------- |
| **GDPR Checkbox**    | ✅ Optional | ✅ Optional | Same `GDPRCheckbox` component               |
| **Strapi Config**    | ✅ Yes      | ✅ Yes      | CMS-driven form configuration               |
| **Submit Button**    | ✅ External | ✅ External | Outside `<form>` tag, uses `form` attribute |
| **Client Component** | ✅ Yes      | ✅ Yes      | State management for GDPR/submit            |
| **API Mutation**     | ✅ POST     | ✅ POST     | Similar pattern via `useAppForm`            |
| **Toast Feedback**   | ✅ Yes      | ✅ Yes      | Success/error notifications                 |
| **Validation**       | ✅ Zod      | ✅ Zod      | Schema-based validation                     |

### Differences ⚠️

| Aspect                 | Newsletter                           | Contact                         | Impact                          |
| ---------------------- | ------------------------------------ | ------------------------------- | ------------------------------- |
| **Field Count**        | 1 (email)                            | 3 (name, email, message)        | More test cases needed          |
| **Validation**         | Email format only                    | Name (1+), Email, Message (10+) | Complex validation scenarios    |
| **API Endpoint**       | `/api/subscribers`                   | `/api/contact-messages`         | Different error handling        |
| **Duplicate Handling** | ✅ Yes (suppresses duplicate errors) | ❌ No                           | API may return different errors |
| **Field Types**        | Input                                | Input + TextArea                | Different UI interactions       |
| **Message Length**     | N/A                                  | Min 10 chars                    | Additional validation test      |

### Key Learnings from Newsletter Tests

#### ✅ **Patterns to Reuse**

1. **GDPR Checkbox Helper** ✨ CRITICAL

   ```typescript
   await checkGDPRCheckboxIfPresent(page, { submitButton })
   ```

   - Already handles Radix UI checkbox state
   - Finds checkbox in same form context
   - Gracefully handles missing checkbox

2. **Navigation Pattern** ✅

   ```typescript
   await navigateAndWaitForContent(
     page,
     "/en/e2e-test-page",
     /Contact|Send Message/i
   )
   ```

   - Uses `domcontentloaded` (not `networkidle`)
   - Waits for specific content to appear
   - 60s timeout for navigation

3. **Sequential Execution** ⚙️

   ```typescript
   test.describe.configure({ mode: "serial" })
   ```

   - Prevents dev server exhaustion
   - Ensures accurate results
   - Required for 100% pass rate

4. **Standard Timeout** ⏱️

   ```typescript
   test.setTimeout(setStandardTimeout()) // 60s
   ```

   - Handles slow dev server startup
   - Consistent timeout across tests

5. **Network Idle Fallback** 🔄
   ```typescript
   await page
     .waitForLoadState("networkidle", { timeout: 10000 })
     .catch(() => {})
   ```
   - Best-effort wait for stability
   - Doesn't fail if HMR/websockets active

#### ⚠️ **Challenges Encountered**

1. **Submit Button Blocking** 🚫

   - GDPR checkbox disables submit when unchecked
   - **Solution**: `checkGDPRCheckboxIfPresent` helper

2. **Dynamic Email Generation** 🎲

   - Prevents duplicate email errors
   - **Pattern**: `test${Date.now()}@example.com`

3. **Toast Message Detection** 💬

   - Success/error feedback via toast
   - **Pattern**: Wait 2s, check for toast content

4. **Form Reset Verification** 🔄
   - After successful submit, form should clear
   - **Pattern**: Check input values are empty

---

## Test Coverage Plan

### Test Categories

#### 1. **Form Visibility & Structure** (3 tests × 3 browsers = 9 tests)

**Test Cases**:

- ✅ Contact form section is visible
- ✅ All required fields are present (name, email, message)
- ✅ Submit button is visible and labeled correctly

**Selectors**:

```typescript
// Section
page.locator("section").filter({ hasText: /Contact|Send Message/i })

// Name field
page.locator('input[name="name"]')

// Email field
page.locator('input[type="email"][name="email"]')

// Message field
page.locator('textarea[name="message"]')

// Submit button
page.locator('button[type="submit"]').filter({ hasText: /Send Message/i })
```

#### 2. **Name Field Validation** (3 tests × 3 browsers = 9 tests)

**Test Cases**:

- ✅ Empty name shows validation error
- ✅ Single character name is accepted (min 1 char)
- ✅ Long name is accepted (100+ chars)

**Validation Rules** (from Zod schema):

```typescript
name: z.string().min(1)
```

**Test Pattern**:

```typescript
test("should validate empty name submission", async ({ page }) => {
  const nameInput = page.locator('input[name="name"]')
  const submitButton = page.locator('button[type="submit"]')

  // Leave name empty
  await nameInput.fill("")

  // Fill other required fields
  await page.locator('input[name="email"]').fill("test@example.com")
  await page
    .locator('textarea[name="message"]')
    .fill("Test message with 10+ characters")

  // Check GDPR if present
  await checkGDPRCheckboxIfPresent(page, { submitButton })

  // Try to submit
  await submitButton.click()

  // Should show validation error or HTML5 required message
  const isRequired = await nameInput.getAttribute("required")
  expect(isRequired).not.toBeNull()
})
```

#### 3. **Email Field Validation** (4 tests × 3 browsers = 12 tests)

**Test Cases**:

- ✅ Empty email shows validation error
- ✅ Invalid email format rejected (e.g., "notanemail")
- ✅ Valid email accepted
- ✅ Email with special characters accepted (e.g., "user+tag@example.com")

**Validation Rules**:

```typescript
email: z.string().email().min(1)
```

**Similar to Newsletter**: Reuse email validation test patterns

#### 4. **Message Field Validation** (4 tests × 3 browsers = 12 tests)

**Test Cases**:

- ✅ Empty message shows validation error
- ✅ Message < 10 chars shows validation error
- ✅ Message = 10 chars is accepted
- ✅ Long message (500+ chars) is accepted

**Validation Rules**:

```typescript
message: z.string().min(10)
```

**Test Pattern** (NEW - unique to Contact Form):

```typescript
test("should reject message with less than 10 characters", async ({ page }) => {
  const messageInput = page.locator('textarea[name="message"]')
  const submitButton = page.locator('button[type="submit"]')

  // Fill other fields
  await page.locator('input[name="name"]').fill("Test User")
  await page.locator('input[name="email"]').fill("test@example.com")

  // Fill message with < 10 chars
  await messageInput.fill("Short")

  // Check GDPR if present
  await checkGDPRCheckboxIfPresent(page, { submitButton })

  // Try to submit
  await submitButton.click()

  // Wait for error toast or validation message
  await page.waitForTimeout(2000)

  // Check for error state (toast, error message, etc.)
  const bodyContent = await page.locator("body").textContent()
  const hasErrorIndicator =
    bodyContent!.includes("10") || // Min length error
    bodyContent!.includes("too short") ||
    bodyContent!.includes("minimum")

  expect(hasErrorIndicator).toBe(true)
})
```

#### 5. **GDPR Checkbox Behavior** (3 tests × 3 browsers = 9 tests)

**Test Cases**:

- ✅ Submit button disabled when GDPR unchecked (if GDPR present)
- ✅ Submit button enabled when GDPR checked
- ✅ GDPR link opens correct URL

**Reuses Newsletter Pattern**:

```typescript
test("should disable submit when GDPR unchecked", async ({ page }) => {
  const submitButton = page.locator('button[type="submit"]')

  // Check if GDPR checkbox exists
  const gdprCheckbox = page.locator('[role="checkbox"]').first()
  const gdprExists = await gdprCheckbox.isVisible().catch(() => false)

  if (gdprExists) {
    // Ensure unchecked
    const currentState = await gdprCheckbox.getAttribute("data-state")
    if (currentState === "checked") {
      await gdprCheckbox.click()
    }

    // Submit should be disabled
    const isDisabled = await submitButton.isDisabled()
    expect(isDisabled).toBe(true)
  } else {
    test.skip()
  }
})
```

#### 6. **Successful Submission** (3 tests × 3 browsers = 9 tests)

**Test Cases**:

- ✅ Valid form submission shows success toast
- ✅ Form fields reset after success
- ✅ Can submit multiple messages sequentially

**Test Pattern**:

```typescript
test("should successfully submit valid contact form", async ({ page }) => {
  const nameInput = page.locator('input[name="name"]')
  const emailInput = page.locator('input[name="email"]')
  const messageInput = page.locator('textarea[name="message"]')
  const submitButton = page.locator('button[type="submit"]')

  // Fill form with valid data
  await nameInput.fill("Test User")
  await emailInput.fill(`test${Date.now()}@example.com`)
  await messageInput.fill("This is a test message with more than 10 characters")

  // Check GDPR if present
  await checkGDPRCheckboxIfPresent(page, { submitButton })

  // Submit form
  await submitButton.click()

  // Wait for API response
  await page.waitForTimeout(2000)

  // Check for success toast
  const bodyContent = await page.locator("body").textContent()
  const hasSuccessIndicator =
    bodyContent!.toLowerCase().includes("success") ||
    bodyContent!.toLowerCase().includes("sent") ||
    bodyContent!.toLowerCase().includes("thank you")

  expect(hasSuccessIndicator).toBe(true)

  // Verify form reset
  const nameValue = await nameInput.inputValue()
  const emailValue = await emailInput.inputValue()
  const messageValue = await messageInput.inputValue()

  expect(nameValue).toBe("")
  expect(emailValue).toBe("")
  expect(messageValue).toBe("")
})
```

#### 7. **Error Handling** (3 tests × 3 browsers = 9 tests)

**Test Cases**:

- ✅ Network error shows error toast
- ✅ Server error shows error toast
- ✅ Form remains populated after error (no reset)

**Pattern** (similar to Newsletter):

```typescript
test("should handle API errors gracefully", async ({ page }) => {
  // Intercept API request and force error
  await page.route("**/api/contact-messages", (route) => {
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "Server error" } }),
    })
  })

  // Fill and submit form
  await page.locator('input[name="name"]').fill("Test User")
  await page.locator('input[name="email"]').fill("test@example.com")
  await page.locator('textarea[name="message"]').fill("Test message content")

  const submitButton = page.locator('button[type="submit"]')
  await checkGDPRCheckboxIfPresent(page, { submitButton })
  await submitButton.click()

  // Wait for error
  await page.waitForTimeout(2000)

  // Check for error toast
  const bodyContent = await page.locator("body").textContent()
  const hasErrorIndicator =
    bodyContent!.toLowerCase().includes("error") ||
    bodyContent!.toLowerCase().includes("failed")

  expect(hasErrorIndicator).toBe(true)

  // Form should NOT reset (allow user to retry)
  const nameValue = await page.locator('input[name="name"]').inputValue()
  expect(nameValue).toBe("Test User")
})
```

#### 8. **Accessibility & UX** (3 tests × 3 browsers = 9 tests)

**Test Cases**:

- ✅ All form fields have proper labels
- ✅ Required fields marked with asterisk or required attribute
- ✅ Textarea has proper ARIA label

**Test Pattern**:

```typescript
test("should have accessible form fields", async ({ page }) => {
  // Check name field label
  const nameLabel = page.locator('label:has-text("Name")')
  await expect(nameLabel).toBeVisible()

  // Check email field label
  const emailLabel = page.locator('label:has-text("Email")')
  await expect(emailLabel).toBeVisible()

  // Check message field label
  const messageLabel = page.locator('label:has-text("Message")')
  await expect(messageLabel).toBeVisible()

  // Check textarea has aria-label
  const messageTextarea = page.locator('textarea[name="message"]')
  const ariaLabel = await messageTextarea.getAttribute("aria-label")
  expect(ariaLabel).toBe("contact-message")
})
```

### Summary: Total Test Count

| Category              | Tests  | Browsers | Total  |
| --------------------- | ------ | -------- | ------ |
| Form Visibility       | 3      | 3        | 9      |
| Name Validation       | 3      | 3        | 9      |
| Email Validation      | 4      | 3        | 12     |
| Message Validation    | 4      | 3        | 12     |
| GDPR Checkbox         | 3      | 3        | 9      |
| Successful Submission | 3      | 3        | 9      |
| Error Handling        | 3      | 3        | 9      |
| Accessibility         | 3      | 3        | 9      |
| **TOTAL**             | **26** | **3**    | **78** |

**Note**: 78 tests is comprehensive but may be excessive. **Recommended minimum: 27 tests** (9 categories × 3 browsers) to match Newsletter complexity.

---

## Implementation Strategy

### Phase 1: Setup & Foundation (30 minutes)

**Tasks**:

1. ✅ Create `apps/ui/e2e/contact.spec.ts`
2. ✅ Import test helpers (`navigateAndWaitForContent`, `checkGDPRCheckboxIfPresent`)
3. ✅ Set up test describe block with serial mode
4. ✅ Configure standard timeout (60s)
5. ✅ Add beforeEach navigation to `/en/e2e-test-page`

**Code Template**:

```typescript
import { test, expect } from "@playwright/test"
import {
  navigateAndWaitForContent,
  checkGDPRCheckboxIfPresent,
  setStandardTimeout,
} from "./utils/test-helpers"

test.describe("Contact Form", () => {
  // Serial execution to prevent dev server exhaustion
  test.describe.configure({ mode: "serial" })

  test.beforeEach(async ({ page }) => {
    test.setTimeout(setStandardTimeout())

    await navigateAndWaitForContent(
      page,
      "/en/e2e-test-page",
      /Contact|Send Message/i
    )

    await page
      .waitForLoadState("networkidle", { timeout: 10000 })
      .catch(() => {})
  })

  // Tests go here...
})
```

### Phase 2: Core Validation Tests (45 minutes)

**Module 1**: Form Visibility (15 min)

- Test: Contact form section visible
- Test: All fields present
- Test: Submit button visible

**Module 2**: Name Validation (15 min)

- Test: Empty name validation
- Test: Single char name accepted
- Test: Long name accepted

**Module 3**: Email Validation (15 min)

- Reuse Newsletter patterns
- Test: Empty email
- Test: Invalid format
- Test: Valid format
- Test: Special characters

### Phase 3: Message Validation (30 minutes)

**Module 4**: Message Field Tests (30 min)

- Test: Empty message
- Test: < 10 chars rejected
- Test: = 10 chars accepted
- Test: Long message accepted

**Key Difference**: TextArea vs Input requires different selectors

### Phase 4: GDPR & Submission (45 minutes)

**Module 5**: GDPR Tests (20 min)

- Reuse Newsletter patterns
- Test: Submit disabled when unchecked
- Test: Submit enabled when checked
- Test: GDPR link opens correctly

**Module 6**: Success Flow (25 min)

- Test: Valid submission success
- Test: Form reset after success
- Test: Multiple submissions work

### Phase 5: Error Handling & Polish (30 minutes)

**Module 7**: Error Tests (20 min)

- Test: Network error handling
- Test: Server error handling
- Test: Form preserves data on error

**Module 8**: Accessibility (10 min)

- Test: Labels present
- Test: Required attributes
- Test: ARIA labels

### Phase 6: Verification & Documentation (30 minutes)

**Tasks**:

1. Run full test suite (sequential)
2. Verify 100% pass rate
3. Check test duration (target: ~5-7 min)
4. Update documentation
5. Git commit with detailed message

**Total Estimated Time**: 3.5 - 4 hours

---

## Risk Assessment

### High Risk ⚠️

1. **TextArea Validation Complexity**

   - **Risk**: Min 10 char validation may not show browser HTML5 error
   - **Mitigation**: Use Zod error detection from form state
   - **Fallback**: Check for toast error message

2. **API Response Differences**

   - **Risk**: Contact API may have different error format than Newsletter
   - **Mitigation**: Test with actual API calls first
   - **Fallback**: Mock API responses if real API unreliable

3. **GDPR Configuration Variability**
   - **Risk**: GDPR checkbox may not exist in Strapi config
   - **Mitigation**: Use `checkGDPRCheckboxIfPresent` helper (graceful fallback)
   - **Success**: Already proven in Newsletter tests

### Medium Risk 🟡

1. **Dev Server Exhaustion**

   - **Risk**: 78 tests may overwhelm dev server even with serial execution
   - **Mitigation**: Run in manageable batches (26 tests at a time)
   - **Solution**: Already using `--workers=1` pattern

2. **Form Reset Timing**
   - **Risk**: Form reset after success may be delayed
   - **Mitigation**: Add appropriate wait time (2s after submit)
   - **Pattern**: Proven in Newsletter tests

### Low Risk 🟢

1. **Selector Stability**

   - **Risk**: Form selectors may change
   - **Mitigation**: Use semantic selectors (`name` attribute, `type`, `role`)
   - **Confidence**: Form structure is stable

2. **Browser Compatibility**
   - **Risk**: Different behavior across browsers
   - **Mitigation**: Already testing on Chromium, Firefox, WebKit
   - **Confidence**: Newsletter tests pass 100% on all browsers

---

## Success Criteria

### Must Have ✅

- [ ] **100% pass rate** across all 3 browsers (Chromium, Firefox, WebKit)
- [ ] **27+ tests** covering all critical paths
- [ ] **Sequential execution** with `--workers=1`
- [ ] **GDPR checkbox helper** integrated
- [ ] **API submission** tested with real endpoints
- [ ] **Error handling** for network/server failures
- [ ] **Form validation** for all fields (name, email, message)
- [ ] **Test duration** under 7 minutes

### Should Have 🎯

- [ ] **Accessibility tests** for labels and ARIA attributes
- [ ] **Multiple submission** tests to verify form can be used repeatedly
- [ ] **API mocking** for error scenarios
- [ ] **Toast message** detection for success/error feedback
- [ ] **Form reset** verification after successful submit
- [ ] **Documentation** updated in TROUBLESHOOTING.md

### Nice to Have 💡

- [ ] **Edge case tests** (extremely long messages, special characters)
- [ ] **Performance benchmarks** (form submission speed)
- [ ] **Visual regression** tests for form layout
- [ ] **Mobile viewport** tests

---

## Next Steps

### Before Starting Implementation

**Review Questions**:

1. Should we implement all 78 tests or reduce to 27 core tests?
2. Do we need to verify contact form exists in Strapi on `/en/e2e-test-page`?
3. Should we test in batches or all at once?
4. Do we need to update the GDPR checkbox helper for contact-specific selectors?

**Recommended Approach**:

- **Start with 27 core tests** (match Newsletter complexity)
- **Implement in phases** (visibility → validation → submission → errors)
- **Test each module** before moving to next
- **Commit after each phase** to preserve progress

### Post-Implementation

**Documentation Updates**:

- [ ] Add Contact Form section to TROUBLESHOOTING.md
- [ ] Update test suite status table with final results
- [ ] Document any new patterns or helpers created
- [ ] Add Contact Form to overall E2E testing guide

**Code Quality**:

- [ ] Ensure consistent test naming
- [ ] Add descriptive comments for complex tests
- [ ] Extract reusable selectors to constants
- [ ] Follow Newsletter test structure for consistency

---

**Ready to proceed? Please review this plan and confirm approach before implementation begins.**
