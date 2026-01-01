# E2E Testing Guide

## Architecture: MSW Mocked API (No Strapi Required)

**E2E tests use MSW (Mock Service Worker)** to intercept all API calls - no real Strapi backend needed!

### Why MSW?

- ✅ Tests run instantly (no server startup)
- ✅ Consistent test data (no database state)
- ✅ Works in CI without PostgreSQL
- ✅ Behavior-driven (test UI, not API)

### Test Philosophy

**E2E tests verify:**

- ✅ Component rendering
- ✅ User interactions
- ✅ Validation
- ✅ Loading states

**E2E tests DO NOT verify:**

- ❌ Real form submissions
- ❌ Database persistence

**For those:** See `tests/integration/` (requires real Strapi)

---

## Prerequisites

**For E2E tests:** None! MSW handles mocking.

**For integration tests:** Start both servers:

### 1. Start Strapi (Backend)

```bash
yarn workspace @repo/strapi dev
```

Wait for: `Server started on http://localhost:1337`

### 2. Start Next.js (Frontend)

```bash
yarn workspace @repo/ui dev
```

Wait for: `Ready on http://localhost:3000`

---

## Running E2E Tests

### From Terminal

```bash
# Run all E2E tests (no Strapi needed!)
yarn test:e2e

# Specific test file
yarn workspace @repo/ui playwright test tests/e2e/homepage.spec.ts

# Specific browser
yarn workspace @repo/ui playwright test --project=chromium

# With UI mode (interactive)
yarn workspace @repo/ui test:e2e:ui
```

### From VS Code Extension (Recommended)

1. Install **Playwright Test for VSCode**
2. Guide: `docs/13-testing/VSCODE_PLAYWRIGHT_SETUP.md`
3. Open Test Explorer → Click ▶️ to run tests

---

## Running Integration Tests

```bash
# Start Strapi first!
yarn workspace @repo/strapi dev

# Then run integration tests
yarn workspace @repo/ui test:integration
```

---

## Troubleshooting

### Tests timeout immediately

**E2E tests:** Check MSW bridge server on port 1337

```bash
# Windows: Check if port in use
netstat -ano | findstr :1337

# Kill process if needed
taskkill /PID <PID> /F
```

**Integration tests:**

- Verify Strapi running on port 1337
- Verify Next.js running on port 3000

### MSW Bridge Server Issues

- Port 1337 conflict → kill existing process
- Check `apps/ui/tests/e2e/global-setup.ts` logs
- Verbose logging: `MSW_VERBOSE=true yarn test:e2e`

### MSW Bridge Server Issues

- Port 1337 conflict → kill existing process
- Check `apps/ui/tests/e2e/global-setup.ts` logs
- Verbose logging: `MSW_VERBOSE=true yarn test:e2e`

### Strapi health check fails (integration tests only)

- Ensure database running
- Check Strapi logs
- Verify `.env` configuration

---

## CI/CD Notes

**GitHub Actions:**

- E2E tests run on every push (MSW mocked, no Strapi)
- Integration tests run weekly or manually (requires full stack)
- Workflow: `.github/workflows/e2e-tests.yml`

**What CI does:**

1. Installs dependencies
2. Starts MSW bridge server (global-setup.ts)
3. Runs Playwright tests (Chromium only)
4. Uploads test results and traces

**No Strapi or PostgreSQL needed in CI for E2E tests!**

---

## MSW Architecture & Patterns

### How MSW Works

```
┌──────────────────────────────────────────┐
│  E2E Test Execution                      │
│                                          │
│  Playwright → Next.js (port 3000)       │
│                  ↓                       │
│              fetch() (SSR)               │
│                  ↓                       │
│          MSW Bridge (port 1337)          │
│                  ↓                       │
│          Returns Mock Data               │
│                                          │
│  Real Strapi: ❌ NOT RUNNING            │
└──────────────────────────────────────────┘
```

**Key Files:**

- `tests/e2e/fixtures/msw-handlers.ts` - API route handlers
- `tests/e2e/fixtures/msw-bridge-server.ts` - MSW Node.js bridge
- `tests/e2e/fixtures/mock-data.ts` - Test data
- `tests/e2e/global-setup.ts` - Start MSW before tests
- `tests/e2e/global-teardown.ts` - Stop MSW after tests

### Writing Tests with MSW

**✅ Good: Focus on user behavior**

```typescript
test("newsletter subscription works", async ({ page }) => {
  await page.goto("/")

  // User fills form
  await page.getByLabel("Email").fill("test@example.com")
  await page.getByRole("button", { name: "Subscribe" }).click()

  // User sees success
  await expect(page.getByText("Thanks for subscribing!")).toBeVisible()
})
```

**❌ Bad: Testing implementation details**

```typescript
test("newsletter API is called", async ({ page }) => {
  await page.goto("/")

  // Don't do this - test user outcomes, not API calls
  const response = await page.waitForResponse("**/api/subscribers")
  expect(response.status()).toBe(200)
})
```

### Override MSW Responses for Specific Tests

```typescript
test("should handle newsletter API error", async ({ page }) => {
  // Override default handler for this specific test
  await page.route("**/api/subscribers", (route) => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: "Server error" }),
    })
  })

  await page.goto("/")
  await page.getByLabel("Email").fill("test@example.com")
  await page.getByRole("button", { name: "Subscribe" }).click()

  await expect(page.getByText("Something went wrong")).toBeVisible()
})
```

---

## Resources

- **⭐ MSW Consolidation Guide:** `docs/13-testing/MSW-CONSOLIDATION.md` (START HERE!)
- **Quick Reference:** `tests/e2e/IMPORTANT-MSW-TESTING.md`
- **MSW Setup Guide:** `docs/13-testing/MSW_IMPLEMENTATION.md`
- **VS Code Extension:** `docs/13-testing/VSCODE_PLAYWRIGHT_SETUP.md`
- **Test Patterns:** `docs/13-testing/E2E_TESTING_PATTERNS.md`
- **Playwright Docs:** https://playwright.dev
