# MSW Testing Strategy - Complete Guide

**Last Updated**: January 1, 2026  
**Status**: ✅ Production Strategy  
**Success Rate**: 95%+ CI passing rate

---

## 🎯 Executive Summary

**MSW (Mock Service Worker) is our core E2E testing strategy.** This document consolidates all MSW knowledge across the codebase into one authoritative guide.

### Quick Facts

- **55 E2E tests** running with MSW
- **95%+ CI success rate** (up from 40% with old approach)
- **Zero database incidents** since MSW adoption (Dec 15, 2025)
- **Fast execution**: Tests run without real Strapi backend
- **SSR compatible**: Mocks work in both Node.js and browser

---

## 📚 Table of Contents

1. [Why MSW?](#why-msw)
2. [Architecture Overview](#architecture-overview)
3. [Quick Start](#quick-start)
4. [MSW Implementation Details](#msw-implementation-details)
5. [Writing Tests with MSW](#writing-tests-with-msw)
6. [Troubleshooting](#troubleshooting)
7. [Migration Guide](#migration-guide)
8. [References](#references)

---

## Why MSW?

### The Problem We Solved

**Before MSW (Oct-Dec 2025):**

- ❌ E2E tests required real Strapi backend running
- ❌ Database pollution and test flakiness
- ❌ 40% CI failure rate due to timeouts
- ❌ Dangerous data loss incidents (Nov 20, 2025)
- ❌ Tests took 5-10 minutes with seeding

**After MSW (Dec 15, 2025):**

- ✅ E2E tests run WITHOUT Strapi backend
- ✅ No database side effects
- ✅ 95%+ CI success rate
- ✅ Zero data loss incidents
- ✅ Tests complete in 2-3 minutes

### Why We Chose MSW

MSW solves a critical problem that Playwright's `page.route()` cannot:

**The SSR Problem:**

```
Next.js SSR → fetch() in Node.js → Strapi API
                 ↑
    Playwright page.route() CANNOT intercept this!
```

**MSW Solution:**

```
Next.js SSR → fetch() in Node.js → MSW intercepts ✅
Browser → fetch()/XHR → MSW intercepts ✅
```

MSW intercepts requests at the **network layer** in BOTH Node.js and browser environments.

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│  E2E Test Execution                                     │
│                                                         │
│  ┌──────────────┐         ┌──────────────┐             │
│  │  Playwright  │────────▶│  Next.js Dev │             │
│  │  Test Runner │         │  Server      │             │
│  └──────────────┘         │  (Port 3000) │             │
│                           └──────┬───────┘             │
│                                  │                      │
│                                  │ fetch()              │
│                                  ▼                      │
│                           ┌──────────────┐             │
│                           │  MSW Bridge  │             │
│                           │  Server      │             │
│                           │  (Port 1337) │◀─── Mocks   │
│                           └──────────────┘     Strapi  │
│                                                         │
│  Real Strapi: ❌ NOT RUNNING                           │
└─────────────────────────────────────────────────────────┘
```

### What's Running During Tests

✅ **Next.js dev server** (port 3000)  
✅ **MSW bridge server** (port 1337) - Mocks Strapi API  
❌ **Real Strapi server** - MUST BE STOPPED

### File Structure

```
apps/ui/tests/e2e/
├── fixtures/
│   ├── msw-handlers.ts      # API route handlers
│   ├── msw-bridge-server.ts # Bridge server for Node.js
│   ├── msw-server.ts        # MSW server configuration
│   └── mock-data.ts         # Test data definitions
├── global-setup.ts          # Start MSW before tests
├── global-teardown.ts       # Stop MSW after tests
└── *.spec.ts                # Test files (no mock setup needed!)
```

---

## Quick Start

### Prerequisites

```bash
# Ensure dependencies are installed
yarn install
```

### Running E2E Tests Locally

```bash
# 1. STOP Strapi if it's running
# Press Ctrl+C in the Strapi terminal

# 2. Run tests (MSW starts automatically)
yarn workspace @repo/ui playwright test

# Or with UI mode
yarn workspace @repo/ui playwright test --ui
```

**Important**: You do NOT need to:

- Start Strapi manually
- Seed the database
- Set up mock data in each test file

MSW handles all API mocking automatically via global setup.

### Running in CI

E2E tests run automatically in GitHub Actions:

```yaml
# .github/workflows/e2e-tests.yml
- name: Run E2E Tests
  run: yarn workspace @repo/ui playwright test
```

No special configuration needed - MSW starts via Playwright global setup.

---

## MSW Implementation Details

### 1. MSW Handlers (`msw-handlers.ts`)

Defines how MSW responds to API requests:

```typescript
import { http, HttpResponse } from "msw"
import { mockData } from "./mock-data"

export const handlers = [
  // Homepage endpoint
  http.get("http://localhost:1337/api/pages", ({ request }) => {
    const url = new URL(request.url)
    const filters = url.searchParams.get("filters[slug][$eq]")

    if (filters === "/") {
      return HttpResponse.json(mockData.homepage)
    }
    return HttpResponse.json({ data: [] })
  }),

  // Navbar endpoint
  http.get("http://localhost:1337/api/navbar", () => {
    return HttpResponse.json(mockData.navbar)
  }),

  // Newsletter subscription
  http.post("http://localhost:1337/api/subscribers", async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      data: { id: 1, attributes: { email: body.data.email } },
    })
  }),
]
```

**Key Features:**

- Handles all Strapi API endpoints
- Returns realistic mock data
- Supports query parameters
- Validates request bodies

### 2. MSW Bridge Server (`msw-bridge-server.ts`)

Creates a Node.js HTTP server that MSW can intercept:

```typescript
import { createServer } from "http"
import { setupServer } from "msw/node"
import { handlers } from "./msw-handlers"

const PORT = 1337

export function startMSWBridge() {
  const mswServer = setupServer(...handlers)
  mswServer.listen({ onUnhandledRequest: "bypass" })

  const httpServer = createServer((req, res) => {
    // MSW intercepts these requests
  })

  httpServer.listen(PORT)
  return { mswServer, httpServer }
}
```

**Why Bridge Server?**

- Next.js SSR runs in Node.js
- MSW needs a real HTTP server to intercept fetch() calls
- Bridge server on port 1337 "looks like" Strapi to Next.js

### 3. Global Setup/Teardown

**Global Setup (`global-setup.ts`):**

```typescript
import { startMSWBridge } from "./fixtures/msw-bridge-server"

async function globalSetup() {
  console.log("🚀 Starting MSW bridge server...")
  global.__MSW_BRIDGE__ = startMSWBridge()
  console.log("✅ MSW bridge server ready on port 1337")
}

export default globalSetup
```

**Global Teardown (`global-teardown.ts`):**

```typescript
async function globalTeardown() {
  console.log("🛑 Stopping MSW bridge server...")
  const { mswServer, httpServer } = global.__MSW_BRIDGE__
  mswServer.close()
  httpServer.close()
  console.log("✅ MSW bridge server stopped")
}

export default globalTeardown
```

**Configured in `playwright.config.ts`:**

```typescript
export default defineConfig({
  globalSetup: require.resolve("./tests/e2e/global-setup.ts"),
  globalTeardown: require.resolve("./tests/e2e/global-teardown.ts"),
  // ... other config
})
```

### 4. Mock Data (`mock-data.ts`)

Centralized test data definitions:

```typescript
export const mockData = {
  homepage: {
    data: [
      {
        id: 1,
        attributes: {
          title: "E2E Test Home Page",
          slug: "/",
          sections: [
            {
              __component: "sections.hero",
              heading: "Test Hero",
              // ... full mock data
            },
          ],
        },
      },
    ],
  },
  navbar: {
    /* ... */
  },
  footer: {
    /* ... */
  },
}
```

**Benefits:**

- Single source of truth for test data
- Easy to update across all tests
- Type-safe with TypeScript

---

## Writing Tests with MSW

### Basic Test Structure

With MSW, tests are incredibly simple:

```typescript
import { test, expect } from "@playwright/test"

test.describe("Newsletter Form", () => {
  test("should subscribe successfully", async ({ page }) => {
    await page.goto("/")

    // Fill form
    await page.getByLabel("Email").fill("test@example.com")
    await page.getByRole("button", { name: "Subscribe" }).click()

    // Assert success
    await expect(page.getByText("Thanks for subscribing!")).toBeVisible()
  })
})
```

**Key Points:**

- ❌ No `setupApiMocks(page)` needed
- ❌ No per-test mock configuration
- ✅ MSW handles ALL API calls automatically
- ✅ Focus on user behavior, not implementation

### Testing Different Scenarios

Override MSW responses for specific tests:

```typescript
test("should handle newsletter API error", async ({ page }) => {
  // Override default handler for this test
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

### User Behavior Testing Philosophy

**✅ Test what users see and do:**

```typescript
// Good: User-centric
await page.getByRole("button", { name: "Subscribe" }).click()
await expect(page.getByText("Thanks for subscribing!")).toBeVisible()
```

**❌ Don't test implementation details:**

```typescript
// Bad: Testing API calls directly
const response = await page.waitForResponse("**/api/subscribers")
expect(response.status()).toBe(200)
```

---

## Troubleshooting

### Common Issues

#### 1. Port 1337 Already in Use

**Symptom:** Tests fail with "EADDRINUSE" error

**Cause:** Real Strapi is still running

**Solution:**

```bash
# Stop Strapi
# Find process using port 1337
netstat -ano | findstr :1337  # Windows
lsof -i :1337                  # macOS/Linux

# Kill the process or just stop Strapi terminal (Ctrl+C)
```

#### 2. Tests Timing Out

**Symptom:** Tests wait 25 seconds and fail

**Cause:** MSW not intercepting requests (likely not started)

**Debug Steps:**

```typescript
// Add to global-setup.ts for debugging
mswServer.listen({
  onUnhandledRequest: "warn", // Log unhandled requests
})
```

**Check:**

- MSW bridge server started successfully
- Port 1337 is listening
- No real Strapi competing for port

#### 3. Mock Data Not Loading

**Symptom:** Pages show "404" or empty content

**Cause:** Mock data doesn't match expected structure

**Solution:**

1. Compare mock data structure with real Strapi response
2. Use browser DevTools → Network tab to see requests
3. Add logging to MSW handlers:

```typescript
http.get('http://localhost:1337/api/pages', ({ request }) => {
  console.log('📥 MSW intercepted:', request.url);
  return HttpResponse.json(mockData.homepage);
}),
```

#### 4. SSR vs Client-Side Discrepancies

**Symptom:** Content loads differently on SSR vs client navigation

**Cause:** MSW bridge (Node.js) and MSW browser have different handlers

**Solution:** Ensure handlers are consistent in:

- `msw-handlers.ts` (used by both)
- Applied in both `msw-server.ts` and `msw-bridge-server.ts`

---

## Migration Guide

### From Real Strapi to MSW

If you have old tests using real Strapi:

**Before (Old Approach - Deprecated):**

```typescript
test("newsletter", async ({ page }) => {
  // Assumes real Strapi running on 1337
  await page.goto("/")
  await page.getByLabel("Email").fill("test@example.com")
  await page.getByRole("button", { name: "Subscribe" }).click()

  // Data saved to real database ❌
  await expect(page.getByText("Thanks!")).toBeVisible()
})
```

**After (MSW Approach - Current):**

```typescript
test("newsletter", async ({ page }) => {
  // MSW handles API mocking automatically ✅
  await page.goto("/")
  await page.getByLabel("Email").fill("test@example.com")
  await page.getByRole("button", { name: "Subscribe" }).click()

  // No database side effects ✅
  await expect(page.getByText("Thanks!")).toBeVisible()
})
```

**Changes Required:**

1. ❌ Remove all `setupApiMocks(page)` calls
2. ❌ Remove imports of old `mock-api.ts`
3. ❌ Remove Strapi startup/seeding steps
4. ✅ Let MSW global setup handle everything
5. ✅ Focus tests on user behavior

### From Playwright page.route() to MSW

**Old Approach:**

```typescript
test("newsletter", async ({ page }) => {
  // Manual mocking in each test ❌
  await page.route("**/api/subscribers", (route) => {
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data: { id: 1 } }),
    })
  })

  await page.goto("/")
  // ... rest of test
})
```

**MSW Approach:**

```typescript
test("newsletter", async ({ page }) => {
  // MSW handles it globally ✅
  await page.goto("/")
  // ... rest of test
})
```

**Benefits:**

- Less boilerplate per test
- Consistent mocking across all tests
- SSR compatible (page.route() is NOT)

---

## References

### Core Documentation

1. **Gold Standard**: [`apps/ui/tests/e2e/IMPORTANT-MSW-TESTING.md`](../../apps/ui/tests/e2e/IMPORTANT-MSW-TESTING.md)

   - Quick reference for developers
   - Critical "what NOT to do" warnings

2. **Implementation Details**: [`docs/13-testing/MSW_IMPLEMENTATION.md`](./MSW_IMPLEMENTATION.md)

   - Technical implementation notes
   - Historical context (Dec 16, 2025 decision)

3. **E2E Testing Breakthrough**: [`docs/13-testing/E2E_TESTING_BREAKTHROUGH.md`](./E2E_TESTING_BREAKTHROUGH.md)
   - Complete story of MSW adoption
   - Before/after comparisons
   - Lessons learned

### Related Documentation

- [`docs/08-devops/workflows/02-e2e-workflow.md`](../08-devops/workflows/02-e2e-workflow.md) - E2E CI workflow
- [`docs/11-recovery/PRODUCTION_READY_E2E_SOLUTION.md`](../11-recovery/PRODUCTION_READY_E2E_SOLUTION.md) - Production-ready patterns
- [`apps/ui/tests/e2e/README.md`](../../apps/ui/tests/e2e/README.md) - E2E test suite overview

### External Resources

- [MSW Official Documentation](https://mswjs.io/)
- [Playwright Testing Documentation](https://playwright.dev/)
- [Next.js Testing Documentation](https://nextjs.org/docs/testing)

---

## CI/CD Integration

### GitHub Actions Workflow

E2E tests run automatically on every push to main:

**Workflow File**: `.github/workflows/e2e-tests.yml`

**What CI Does**:

1. Installs dependencies (`yarn install`)
2. Starts MSW bridge server (via `global-setup.ts`)
3. Runs Playwright tests (Chromium only for speed)
4. Uploads test results and traces as artifacts

**No Strapi or PostgreSQL needed in CI for E2E tests!**

### Running Tests Locally vs CI

| Environment | Strapi Needed? | MSW Needed? | Database Needed? |
|-------------|----------------|-------------|------------------|
| **E2E (Local)** | ❌ No | ✅ Yes (auto) | ❌ No |
| **E2E (CI)** | ❌ No | ✅ Yes (auto) | ❌ No |
| **Integration (Local)** | ✅ Yes | ❌ No | ✅ Yes |
| **Integration (CI)** | ✅ Yes | ❌ No | ✅ Yes (ephemeral) |

### Test Execution in CI

```bash
# E2E tests (fast, MSW mocked)
runs-on: push to main
duration: ~3-4 minutes
success-rate: 95%+

# Integration tests (slower, real Strapi)
runs-on: weekly schedule or manual trigger
duration: ~3-4 minutes
success-rate: 95%+
```

---

## Success Metrics

### Before MSW (Oct-Nov 2025)

- ❌ 40% CI success rate
- ❌ 5-10 minute test execution
- ❌ Database pollution issues
- ❌ 1 critical data loss incident (Nov 20, 2025)

### After MSW (Dec 2025 - Present)

- ✅ 95%+ CI success rate
- ✅ 2-3 minute test execution
- ✅ Zero database incidents
- ✅ 55 passing E2E tests
- ✅ Zero flaky tests

---

## Conclusion

**MSW is the foundation of our E2E testing strategy.** It solved critical problems with SSR, database pollution, and test flakiness, resulting in a 95%+ CI success rate and zero incidents since adoption.

**Key Takeaways:**

1. MSW handles ALL API mocking automatically
2. Tests focus on user behavior, not implementation
3. No Strapi backend needed for E2E tests
4. SSR and client-side both work seamlessly
5. This is our production strategy - not an experiment

**For Questions or Issues:**

- Check this consolidation doc first
- Refer to IMPORTANT-MSW-TESTING.md for quick answers
- Review MSW_IMPLEMENTATION.md for technical details

---

_This document consolidates MSW knowledge from across the codebase. Last updated: January 1, 2026_
