# 🧪 E2E Testing Quick Start - Playwright Guide

**Created**: November 30, 2025  
**Status**: ✅ Complete  
**Audience**: All developers  
**Format**: Quick start guide

---

## 🚀 GETTING STARTED

### Run E2E Tests

```bash
# Run all tests
yarn test:e2e

# Run in UI mode (interactive)
yarn test:e2e --ui

# Run specific file
yarn test:e2e homepage.spec.ts

# Run specific test
yarn test:e2e --grep "should load homepage"

# Run in headed mode (see browser)
yarn test:e2e --headed

# Debug mode
yarn test:e2e --debug
```

---

## 🗄️ DATABASE SETUP

### Seed Test Data

```bash
# Hybrid seeding (30 seconds)
yarn seed:e2e

# Or manually
cd apps/strapi
./scripts/seed-e2e-data.sh
```

### Reset Database

```bash
# Fast snapshot restore (10 seconds)
./apps/strapi/scripts/restore-snapshot.sh

# Full re-seed (30 seconds)
yarn seed:e2e
```

### Create New Snapshot

```bash
# After adding new test data
./apps/strapi/scripts/snapshot-db.sh
```

---

## ✍️ WRITING TESTS

### Basic Test Structure

```typescript
import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should load successfully", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/My Site/)
  })
})
```

### Common Patterns

```typescript
// Navigate
await page.goto("/blog")

// Click element
await page.click('[data-testid="submit-button"]')

// Fill form
await page.fill('input[name="email"]', "test@example.com")

// Wait for element
await page.waitForSelector('[data-testid="content"]')

// Wait for network idle
await page.waitForLoadState("networkidle")

// Assertions
await expect(page.locator("h1")).toContainText("Welcome")
await expect(page.locator('[data-testid="card"]')).toBeVisible()
await expect(page).toHaveURL(/blog/)
```

---

## 🎯 SELECTORS

### Best Practices

```typescript
// ✅ GOOD: Use data-testid
await page.click('[data-testid="submit-button"]')

// ✅ GOOD: Use semantic selectors
await page.click('button:has-text("Submit")')

// ✅ GOOD: Use ARIA roles
await page.click('role=button[name="Submit"]')

// ❌ BAD: Use CSS classes (brittle)
await page.click(".btn-primary")

// ❌ BAD: Use complex selectors
await page.click("div > div.container > button:nth-child(2)")
```

### Adding data-testid

```typescript
// In component
<button data-testid="submit-button">Submit</button>

// In test
await page.click('[data-testid="submit-button"]');
```

---

## ⏱️ WAITS & TIMING

### Proper Waits

```typescript
// ✅ GOOD: Wait for selector
await page.waitForSelector('[data-testid="content"]')

// ✅ GOOD: Wait for load state
await page.waitForLoadState("networkidle")

// ✅ GOOD: Wait for response
await page.waitForResponse((resp) => resp.url().includes("/api/posts"))

// ❌ BAD: Fixed timeout
await page.waitForTimeout(3000)
```

### Timeouts

```typescript
// Per test
test.setTimeout(30000); // 30 seconds

// Per action
await page.click('button', { timeout: 10000 });

// Global (playwright.config.ts)
use: {
  timeout: 30000,
  navigationTimeout: 30000
}
```

---

## 📸 DEBUGGING

### Screenshots & Videos

```typescript
// Take screenshot
await page.screenshot({ path: 'screenshot.png' });

// Screenshot on failure (automatic)
// Configured in playwright.config.ts
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
}
```

### Trace Viewer

```bash
# Record trace
yarn test:e2e --trace on

# Open trace
npx playwright show-trace trace.zip
```

### Debug Mode

```bash
# Pause before each action
yarn test:e2e --debug

# Set breakpoint in code
await page.pause();
```

---

## 🔍 LOCATORS

### Finding Elements

```typescript
// By text
await page.locator("text=Welcome")

// By role
await page.locator('role=button[name="Submit"]')

// By test ID
await page.locator('[data-testid="header"]')

// Chaining
await page.locator('[data-testid="blog-post"]').locator("h2").click()

// First/Last/Nth
await page.locator("button").first().click()
await page.locator("button").last().click()
await page.locator("button").nth(2).click()
```

---

## 📝 ASSERTIONS

### Common Assertions

```typescript
// Visibility
await expect(page.locator("h1")).toBeVisible()
await expect(page.locator("h1")).toBeHidden()

// Text content
await expect(page.locator("h1")).toContainText("Welcome")
await expect(page.locator("h1")).toHaveText("Welcome Home")

// Attributes
await expect(page.locator("input")).toHaveAttribute("type", "email")
await expect(page.locator("button")).toBeDisabled()
await expect(page.locator("button")).toBeEnabled()

// Count
await expect(page.locator(".blog-post")).toHaveCount(10)

// URL
await expect(page).toHaveURL(/blog/)
await expect(page).toHaveURL("http://localhost:3000/blog")

// Title
await expect(page).toHaveTitle(/My Site/)
```

---

## 🎨 PAGE OBJECTS

### Pattern

```typescript
// pages/blog.page.ts
export class BlogPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/blog")
  }

  async filterByCategory(category: string) {
    await this.page.click(`[data-category="${category}"]`)
  }

  async getPostCount() {
    return await this.page.locator(".blog-post").count()
  }
}

// In test
import { BlogPage } from "./pages/blog.page"

test("filter posts", async ({ page }) => {
  const blogPage = new BlogPage(page)
  await blogPage.goto()
  await blogPage.filterByCategory("tech")
  expect(await blogPage.getPostCount()).toBeGreaterThan(0)
})
```

---

## 🔄 FIXTURES

### Custom Fixtures

```typescript
// fixtures/auth.fixture.ts
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login
    await page.goto("/login")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password")
    await page.click('button[type="submit"]')

    await use(page)

    // Teardown: Logout
    await page.click('[data-testid="logout"]')
  },
})

// In test
import { test } from "./fixtures/auth.fixture"

test("view dashboard", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/dashboard")
  // Already logged in
})
```

---

## 🌐 API TESTING

### Intercept Requests

```typescript
// Mock API response
await page.route("**/api/posts", (route) => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, title: "Mock Post" }]),
  })
})

// Wait for API call
const response = await page.waitForResponse("**/api/posts")
const data = await response.json()
expect(data).toHaveLength(10)
```

---

## 📊 TEST ORGANIZATION

### File Structure

```
tests/
├── e2e/
│   ├── homepage.spec.ts
│   ├── blog/
│   │   ├── listing.spec.ts
│   │   ├── post.spec.ts
│   │   └── filtering.spec.ts
│   ├── pages/           # Page objects
│   │   ├── blog.page.ts
│   │   └── home.page.ts
│   └── fixtures/        # Custom fixtures
│       └── auth.fixture.ts
```

### Naming Conventions

```typescript
// Describe blocks
test.describe("Feature Name", () => {
  test.describe("Subfeature", () => {
    test("should do something", async ({ page }) => {})
  })
})

// File names
homepage.spec.ts
blog - listing.spec.ts
user - auth.spec.ts
```

---

## ⚙️ CONFIGURATION

### playwright.config.ts

```typescript
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
```

---

## 🐛 COMMON ISSUES

### Test Fails Locally But Passes in CI

**Cause**: Timing issues

**Solution**:

```typescript
// Add explicit waits
await page.waitForLoadState("networkidle")
await page.waitForSelector('[data-testid="content"]')
```

### Test Passes Locally But Fails in CI

**Cause**: CI slower, different data

**Solution**:

```bash
# Reset to clean state
./apps/strapi/scripts/restore-snapshot.sh
yarn test:e2e
```

### Flaky Tests

**Cause**: Race conditions, animations

**Solutions**:

```typescript
// 1. Increase timeouts
test.setTimeout(60000);

// 2. Disable animations (CSS)
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}

// 3. Use retries
// In playwright.config.ts
retries: 2
```

---

## 📚 RESOURCES

### Documentation

- [Playwright Docs](https://playwright.dev)
- [E2E Workflow](/docs/08-devops-workflows-02-e2e-workflow)
- [Hybrid Seeding](/docs/08-devops-innovations-hybrid-seeding)

### Useful Commands

```bash
# Install browsers
npx playwright install

# Generate tests (codegen)
npx playwright codegen http://localhost:3000

# Show report
npx playwright show-report

# View trace
npx playwright show-trace trace.zip
```

---

## ✅ CHECKLIST

Before committing new E2E tests:

- [ ] Tests pass locally (3+ runs)
- [ ] Tests use proper waits (no waitForTimeout)
- [ ] Selectors use data-testid
- [ ] Tests are independent (can run in any order)
- [ ] Screenshots/videos reviewed (if failure)
- [ ] Page objects used (if complex navigation)
- [ ] Tests run in CI successfully

---

**Last Updated**: November 30, 2025  
**E2E Tests**: 64+ Playwright tests  
**Success Rate**: 95%  
**Average Duration**: 2-3 minutes (64 tests)
