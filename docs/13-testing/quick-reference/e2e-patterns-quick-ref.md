# E2E Patterns Quick Reference Card

⚡ **1-page scannable reference for all 12 patterns** ⚡

---

## 🎯 Pattern Selector

| I Need To...                      | Use Pattern                         |
| --------------------------------- | ----------------------------------- |
| Fill form inputs                  | #1 Input Timing                     |
| Reset forms between serial tests  | #2 Serial Reset                     |
| Detect success/error messages     | #3 Toast Detection                  |
| Test disabled buttons             | #4 Validation Test                  |
| Navigate pages                    | #6 Wait Strategy + #7 Decision Tree |
| Wait for content after navigation | #8 Visibility Wait                  |
| Test offline mode                 | #9 Offline Logic                    |
| Block CSS/images                  | #10 Resource Blocking               |
| Prevent dev server exhaustion     | #11 Serial Mode                     |
| Optimize multiple navigations     | #12 Rapid Navigation                |

---

## Form Patterns

### #1 Input Timing ⭐⭐⭐⭐⭐

```typescript
const input = page.locator('input[name="email"]')
await input.waitFor({ state: "visible" })
await input.fill("test@example.com")
```

### #2 Serial Reset ⭐⭐⭐⭐

```typescript
test.describe.configure({ mode: "serial" })

await expect(input).toHaveValue("", { timeout: 5000 })
```

### #3 Toast Detection ⭐⭐⭐⭐⭐

```typescript
import { waitForSuccessToast } from "./utils/test-helpers"

await waitForSuccessToast(page, "Success!")
```

### #4 Validation Test ⭐⭐⭐⭐

```typescript
await page.locator('button[type="submit"]').click({ force: true })
```

### #5 Loading State ⭐⭐⭐

```typescript
// Test workflow outcome, not micro-states
await submitButton.click()
await waitForSuccessToast(page)
// Don't test loading spinner visibility
```

---

## Navigation Patterns

### #6 Wait Strategy Alignment ⭐⭐⭐⭐⭐

```typescript
// ✅ Dev mode
await page.goto("/path", { waitUntil: "domcontentloaded" })

// ❌ AVOID in dev
await page.goto("/path", { waitUntil: "networkidle" })
```

### #7 Wait Decision Tree ⭐⭐⭐⭐⭐

```
Mocking network? → domcontentloaded
Dev mode? → domcontentloaded
Production + testing resources? → networkidle
Default → domcontentloaded
```

### #8 Visibility Wait ⭐⭐⭐⭐⭐

```typescript
await page.goto("/", { waitUntil: "domcontentloaded" })
await page.locator("body").waitFor({ state: "visible" })
```

---

## Error Handling Patterns

### #9 Offline Logic ⭐⭐⭐⭐

```typescript
// 1. Navigate ONLINE
await page.goto("/contact", { waitUntil: "domcontentloaded" })

// 2. Switch offline
await context.setOffline(true)

// 3. Test behavior

// 4. Restore
await context.setOffline(false)
```

### #10 Resource Blocking ⭐⭐⭐⭐

```typescript
// 1. Block BEFORE navigation
await page.route("**/*.css", (route) => route.abort())

// 2. Use domcontentloaded
await page.goto("/", { waitUntil: "domcontentloaded" })

// 3. Add visibility wait
await page.locator("body").waitFor({ state: "visible" })
```

### #11 Serial Mode ⭐⭐⭐⭐

```typescript
// Top of test file
test.describe.configure({ mode: "serial" })
```

### #12 Rapid Navigation ⭐⭐⭐

```typescript
// Minimize navigations + add visibility waits
await page.goto("/page1", { waitUntil: "domcontentloaded" })
await page.locator("body").waitFor({ state: "visible" })
```

---

## 🔥 Most Common Combos

### Standard Form Test

```typescript
test.describe.configure({ mode: "serial" })

test("form test", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "domcontentloaded" })

  await expect(input).toHaveValue("", { timeout: 5000 })

  const emailInput = page.locator('input[name="email"]')
  await emailInput.waitFor({ state: "visible" })
  await emailInput.fill("test@example.com")

  await submitButton.click()
  await waitForSuccessToast(page, "Success!")
})
```

### Offline Test

```typescript
await page.goto("/", { waitUntil: "domcontentloaded" })
await context.setOffline(true)
// test offline behavior
await context.setOffline(false)
```

### Resource Blocking Test

```typescript
await page.route("**/*.css", (route) => route.abort())
await page.goto("/", { waitUntil: "domcontentloaded" })
await page.locator("body").waitFor({ state: "visible" })
```

---

## ⚠️ Common Mistakes

| ❌ DON'T                            | ✅ DO                                   |
| ----------------------------------- | --------------------------------------- |
| `.fill()` without visibility wait   | Wait for visible, then fill             |
| `networkidle` in dev mode           | Use `domcontentloaded`                  |
| Navigate while offline              | Navigate online, then go offline        |
| Block resources + `networkidle`     | Block + `domcontentloaded` + visibility |
| Test loading spinner visibility     | Test workflow outcomes                  |
| Parallel mode for complex workflows | Use serial mode                         |

---

## 📊 Universal Checklist

Every new test should have:

- [ ] `waitUntil: "domcontentloaded"` for navigation
- [ ] Visibility wait after navigation
- [ ] Visibility wait before `.fill()`
- [ ] Serial mode for forms/workflows
- [ ] Toast helper for success messages
- [ ] Reset checks in serial tests

---

## 🚀 New Test Template

```typescript
import { test, expect } from "@playwright/test"
import { waitForSuccessToast } from "./utils/test-helpers"

test.describe.configure({ mode: "serial" })

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    // Navigate
    await page.goto("/path", { waitUntil: "domcontentloaded" })
    await page.locator("body").waitFor({ state: "visible" })

    // Interact
    const input = page.locator('input[name="field"]')
    await input.waitFor({ state: "visible" })
    await input.fill("value")

    // Verify
    await waitForSuccessToast(page, "Success!")
  })
})
```

---

**Full Documentation**: `docs/13-testing/E2E_TESTING_PATTERNS.md`  
**Recovery Guides**: `docs/11-recovery/SESSION_RECOVERY_*.md`  
**Test Status**: `docs/13-testing/E2E_TEST_SUITE_STATUS.md`
