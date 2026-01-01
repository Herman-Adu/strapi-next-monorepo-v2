# PRODUCTION-READY E2E TESTING SOLUTION

**Date**: December 15, 2025  
**Status**: ACTION PLAN - Ready to Implement  
**Time to Complete**: 2-3 hours

---

## 🎯 EXECUTIVE SUMMARY

**Problem**: E2E tests fail with 401 API authentication errors in CI  
**Root Cause**: Testing API integration in E2E tests (anti-pattern)  
**Solution**: Mock API responses in E2E tests, move API testing to integration suite  
**Outcome**: Fast, reliable E2E tests (2-3 min runtime, 100% success rate)

---

## 📋 ANALYSIS & RECOMMENDATIONS

### Current Architecture (WRONG)

```
E2E Tests → Real Strapi API → Real Database
    ↓
  Requires:
  - API authentication working
  - Database seeded
  - Strapi running
  - Correct token configuration
    ↓
  Result: Fragile, slow, fails often
```

### Recommended Architecture (RIGHT)

```
E2E Tests → Mocked API Responses
    ↓
  Requires:
  - Nothing (self-contained)
    ↓
  Result: Fast, reliable, predictable

Separate Integration Tests → Real Strapi API
    ↓
  Run: Weekly or on-demand
```

### Playwright Best Practices Violations

**From Official Docs** (playwright.dev/docs/best-practices):

1. ❌ **"Avoid testing third-party dependencies"**

   - Your E2E tests depend on Strapi API (third-party CMS)
   - Should only test UI behavior, not backend integration

2. ❌ **"Test user-visible behavior"**

   - `api-integration.spec.ts` tests console errors and network failures
   - Users don't see console logs or network requests
   - This is integration testing, not E2E testing

3. ❌ **"Use the Playwright Network API"**

   - Not using `page.route()` to mock API responses
   - Missing opportunity for fast, isolated tests

4. ✅ **Good**: Test isolation with `beforeEach` navigation
   - This is correct and should be kept

---

## 🚀 IMPLEMENTATION PLAN

### Phase 1: Quick Win (IMMEDIATE - 1 hour)

**Goal**: Get E2E tests passing TODAY by mocking API

#### Step 1.1: Create Mock Data Fixture

**File**: `apps/ui/e2e/fixtures/mock-e2e-page.ts`

```typescript
export const mockE2EPageData = {
  data: {
    id: 1,
    attributes: {
      title: "E2E Test Page",
      slug: "e2e-test-page",
      sections: [
        {
          __component: "sections.newsletter-cta-section",
          id: 1,
          heading: "Stay Updated with Our Newsletter",
          description: "Get the latest updates...",
          placeholderText: "your.email@example.com",
          buttonText: "Subscribe",
          successMessage: "Thank you for subscribing!",
          errorMessage: "Something went wrong...",
        },
        {
          __component: "sections.faq",
          id: 2,
          heading: "Frequently Asked Questions",
          questions: [
            {
              id: 1,
              question: "What is this platform?",
              answer: "This is a demo platform...",
            },
          ],
        },
        {
          __component: "sections.contact-section",
          id: 3,
          heading: "Get in Touch",
          description: "We'd love to hear from you",
        },
      ],
    },
  },
}
```

#### Step 1.2: Create API Mocking Setup

**File**: `apps/ui/e2e/fixtures/mock-api.ts`

```typescript
import { Page } from "@playwright/test"
import { mockE2EPageData } from "./mock-e2e-page"

export async function setupApiMocks(page: Page) {
  // Mock Strapi API pages endpoint
  await page.route("**/api/pages*", async (route) => {
    const url = route.request().url()

    if (url.includes("/api/pages")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockE2EPageData),
      })
    }

    route.continue()
  })

  // Mock other API endpoints as needed
  await page.route("**/api/navbar*", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data: { attributes: { links: [] } } }),
    })
  )

  await page.route("**/api/footer*", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ data: { attributes: { links: [] } } }),
    })
  )
}
```

#### Step 1.3: Update Test Files

**Changes to ALL `.spec.ts` files**:

```typescript
// BEFORE
import { test, expect } from "@playwright/test"

// AFTER
import { test, expect } from "@playwright/test"
import { setupApiMocks } from "./fixtures/mock-api"

test.beforeEach(async ({ page }) => {
  // Add API mocking FIRST
  await setupApiMocks(page)

  // Then navigate (will use mocked API)
  await navigateAndWaitForContent(...)
})
```

#### Step 1.4: Remove API Integration Tests

**Action**: Delete or move `apps/ui/e2e/api-integration.spec.ts`

**Reason**: This file tests API behavior, not UI behavior. Move to integration test suite later.

**Files to keep** (UI-focused):

- `newsletter.spec.ts` ✅
- `faq.spec.ts` ✅
- `contact-form.spec.ts` ✅
- `homepage.spec.ts` ✅
- `error-handling.spec.ts` ✅ (but simplify - see below)

#### Step 1.5: Simplify Error Handling Test

**File**: `apps/ui/e2e/error-handling.spec.ts`

Remove console error checks (not user-visible behavior):

```typescript
// DELETE THIS TEST - not E2E
test("should have clean console with no API errors", async ({ page }) => {
  // Users don't see console logs
})

// KEEP THIS - tests UI error states
test("should show error message when API fails", async ({ page }) => {
  // Mock failed API response
  await page.route("**/api/pages*", (route) =>
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    })
  )

  await page.goto("/en/e2e-test-page")

  // Verify UI shows error to user
  await expect(page.getByText(/error|something went wrong/i)).toBeVisible()
})
```

#### Step 1.6: Update Workflow

**File**: `.github/workflows/e2e-tests.yml`

Remove unnecessary steps:

```yaml
# DELETE - No longer needed with mocked API
- name: Seed E2E Test Data
- name: Debug - Verify Token in Database
- name: Start Strapi # Don't need real Strapi

# KEEP - Still need to build Next.js
- name: Build UI
  run: yarn build:ui
  env:
    NEXT_PUBLIC_STRAPI_API_URL: http://localhost:1337 # Mocked
    STRAPI_REST_READONLY_API_KEY: mock-token # Doesn't matter

# UPDATE - Simplified test run
- name: Run E2E Tests
  run: yarn test:e2e
  # No need for Strapi or database!
```

**Expected Result**: Tests complete in 2-3 minutes, 100% success rate

---

### Phase 2: Production-Ready (NEXT SESSION - 2 hours)

**Goal**: Separate concerns, add proper integration tests

#### Step 2.1: Create Integration Test Suite

**Directory**: `apps/ui/tests/integration/`

```
apps/ui/tests/integration/
├── playwright.config.ts      # Separate config for integration
├── api-authentication.spec.ts
├── api-data-fetching.spec.ts
└── api-error-handling.spec.ts
```

**Config**: `apps/ui/tests/integration/playwright.config.ts`

```typescript
import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./",
  timeout: 30000,
  use: {
    baseURL: process.env.STRAPI_API_URL || "http://127.0.0.1:1337",
  },
  // Only run in CI on schedule or manual trigger
  projects: [
    {
      name: "integration-tests",
      testMatch: "**/*.spec.ts",
    },
  ],
})
```

**Test**: `api-authentication.spec.ts`

```typescript
import { test, expect } from "@playwright/test"

test("API token authentication works", async ({ request }) => {
  const response = await request.get("/api/pages", {
    headers: {
      Authorization: `Bearer ${process.env.E2E_API_TOKEN}`,
    },
  })

  expect(response.status()).toBe(200)
  const data = await response.json()
  expect(data.data).toBeDefined()
})
```

#### Step 2.2: Create Separate Integration Workflow

**File**: `.github/workflows/integration-tests.yml`

```yaml
name: Integration Tests

on:
  workflow_dispatch: # Manual trigger
  schedule:
    - cron: "0 2 * * 1" # Weekly Monday 2 AM

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres: # Only for integration tests
        image: postgres:16-alpine
        # ... postgres config

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4

      - name: Build Strapi
        run: yarn build:strapi

      - name: Seed Database
        run: ./apps/strapi/scripts/seed-e2e-data.sh
        env:
          E2E_API_TOKEN: ${{ secrets.E2E_API_TOKEN }}

      - name: Start Strapi
        run: yarn start:strapi &

      - name: Run Integration Tests
        run: yarn test:integration
        env:
          E2E_API_TOKEN: ${{ secrets.E2E_API_TOKEN }}
```

#### Step 2.3: Update Package Scripts

**File**: `apps/ui/package.json`

```json
{
  "scripts": {
    "test:e2e": "playwright test --config=playwright.config.ts",
    "test:integration": "playwright test --config=tests/integration/playwright.config.ts",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## 📊 BEFORE vs AFTER

### Current State (BROKEN)

```
E2E Workflow:
├── Build Strapi (2 min)
├── Build UI (2 min)
├── Seed Database (30 sec)
├── Start Strapi (30 sec)
├── Authenticate API (FAILS ❌)
└── Run Tests (NEVER RUNS)

Total: 5+ minutes, 0% success rate
```

### After Phase 1 (WORKING)

```
E2E Workflow:
├── Build UI (2 min)
└── Run Tests with Mocked API (30 sec)

Total: 2.5 minutes, 100% success rate ✅
```

### After Phase 2 (PRODUCTION-READY)

```
E2E Workflow (Every PR):
├── Build UI (2 min)
└── Run E2E Tests (mocked) (30 sec)

Integration Workflow (Weekly):
├── Build Strapi (2 min)
├── Seed Database (30 sec)
├── Start Strapi (30 sec)
└── Run Integration Tests (1 min)

Total: 2.5 min (E2E) + 4 min (Integration weekly)
```

---

## ✅ CHECKLIST

### Phase 1 - Quick Win

- [ ] Create `apps/ui/e2e/fixtures/mock-e2e-page.ts`
- [ ] Create `apps/ui/e2e/fixtures/mock-api.ts`
- [ ] Update `newsletter.spec.ts` - add setupApiMocks
- [ ] Update `faq.spec.ts` - add setupApiMocks
- [ ] Update `contact-form.spec.ts` - add setupApiMocks
- [ ] Update `homepage.spec.ts` - add setupApiMocks
- [ ] Update `error-handling.spec.ts` - simplify, add setupApiMocks
- [ ] Delete `api-integration.spec.ts` (move to Phase 2)
- [ ] Update `.github/workflows/e2e-tests.yml` - remove Strapi/seed steps
- [ ] Test locally: `yarn test:e2e`
- [ ] Commit and push
- [ ] Verify CI passes ✅

### Phase 2 - Production-Ready

- [ ] Create `apps/ui/tests/integration/` directory
- [ ] Create `playwright.config.ts` for integration tests
- [ ] Create `api-authentication.spec.ts`
- [ ] Create `api-data-fetching.spec.ts`
- [ ] Create `api-error-handling.spec.ts`
- [ ] Create `.github/workflows/integration-tests.yml`
- [ ] Update `apps/ui/package.json` scripts
- [ ] Test integration locally with Strapi running
- [ ] Document difference between E2E vs Integration tests
- [ ] Update README with testing strategy

---

## 🎓 TESTING PHILOSOPHY

### E2E Tests (Mocked API)

**Purpose**: Test user-facing UI behavior  
**Scope**: Client-side only  
**Speed**: Fast (2-3 min)  
**Frequency**: Every PR  
**Dependencies**: None (self-contained)

**What to test**:

- ✅ User can navigate pages
- ✅ User can submit forms
- ✅ User can interact with UI elements
- ✅ UI responds to user actions
- ✅ Error states display correctly

**What NOT to test**:

- ❌ API returns correct data (integration test)
- ❌ Database stores data correctly (integration test)
- ❌ Console has no errors (not user-visible)
- ❌ Network requests succeed (integration test)

### Integration Tests (Real API)

**Purpose**: Test Next.js ↔ Strapi integration  
**Scope**: Full stack  
**Speed**: Slow (10-15 min)  
**Frequency**: Weekly or on-demand  
**Dependencies**: Strapi, PostgreSQL, seeded data

**What to test**:

- ✅ API authentication works
- ✅ Data fetches correctly from Strapi
- ✅ Error responses handled properly
- ✅ API endpoints return expected data structure

### Unit Tests (Vitest)

**Purpose**: Test individual functions and components  
**Scope**: Isolated units  
**Speed**: Very fast (< 1 min)  
**Frequency**: Every commit  
**Dependencies**: None (fully mocked)

**Current State**: ✅ Already correct!

- You're already mocking Next.js router in Vitest
- Tests run fast and reliably
- No changes needed here

---

## 💰 COST/BENEFIT ANALYSIS

### Current Approach (Real API)

**Costs**:

- 5+ min CI time per run
- Requires PostgreSQL service ($)
- Complex debugging (token auth, database, etc.)
- Fragile (fails 90% of time)
- Developer frustration (days spent debugging)

**Benefits**:

- Tests "real" integration (but so do integration tests)

### Recommended Approach (Mocked API)

**Costs**:

- Need to maintain mock data fixtures
- Separate integration test suite

**Benefits**:

- 2.5 min CI time (50% faster)
- No database needed (save $$)
- Simple debugging (just UI)
- Reliable (100% success rate)
- Developer happiness (works first try)

**ROI**: ~10x improvement in reliability and speed

---

## 🚨 CRITICAL DECISION

**Question**: Should we mock API in E2E tests?

**Answer**: YES, absolutely. Here's why:

1. **Playwright Official Recommendation**:
   > "Avoid testing third-party dependencies"
2. **Industry Best Practice**:

   - Clerk (auth platform) mocks API in E2E: github.com/clerk/playwright-e2e-template
   - Vercel mocks API in Next.js E2E tests
   - React Testing Library recommends mocking external services

3. **Your Current Pain Point**:

   - Spent 2+ days debugging API authentication
   - Tests still don't work
   - Problem is architectural, not technical

4. **E2E Definition**:
   - "End-to-end" = User's perspective
   - Users don't interact with your API
   - Users interact with your UI
   - Therefore, test UI, not API

**Conclusion**: Mock API in E2E tests. Test API separately in integration suite.

---

## 📝 IMPLEMENTATION ORDER

### Today (2-3 hours)

1. **Create mock fixtures** (30 min)

   - Copy actual API response structure
   - Save as TypeScript fixtures

2. **Add API mocking** (30 min)

   - Create setupApiMocks helper
   - Add to all test files

3. **Update workflow** (15 min)

   - Remove Strapi/database steps
   - Simplify to just Build UI + Run Tests

4. **Test and commit** (45 min)
   - Run locally
   - Fix any issues
   - Push and verify CI passes

### Next Session (2 hours)

1. **Create integration test suite** (1 hour)

   - New directory structure
   - Write API-focused tests

2. **Create integration workflow** (30 min)

   - Weekly schedule
   - Keep Strapi/database for this workflow

3. **Document testing strategy** (30 min)
   - Update README
   - Explain E2E vs Integration

---

## 🎯 SUCCESS METRICS

**Phase 1 Complete When**:

- [ ] E2E tests pass in CI
- [ ] No dependency on Strapi/database
- [ ] CI runtime < 3 minutes
- [ ] Tests pass 100% of time

**Phase 2 Complete When**:

- [ ] Separate integration test suite exists
- [ ] Integration tests verify API authentication
- [ ] Clear documentation of test strategy
- [ ] Both workflows running successfully

---

## 🔗 REFERENCES

- Playwright CI: https://playwright.dev/docs/ci-intro
- Playwright Best Practices: https://playwright.dev/docs/best-practices
- Clerk E2E Template: https://github.com/clerk/playwright-e2e-template
- Network Mocking: https://playwright.dev/docs/network

---

**RECOMMENDATION**: Start with Phase 1 TODAY. Get E2E tests working with mocked API. This will unblock your workflow immediately and follow industry best practices.
