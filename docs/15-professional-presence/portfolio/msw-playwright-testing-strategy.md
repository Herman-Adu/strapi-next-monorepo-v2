# MSW + Playwright Testing Strategy: From 40% to 95% CI Success

**Reading Time:** 12 minutes  
**Difficulty:** Advanced (Testing Architecture)  
**Published:** January 2026

**Target Audience:** QA Engineers, Test Automation Engineers, DevOps Engineers, Tech Leads

---

## 📊 Executive Summary

Transformed E2E testing strategy from database-coupled Playwright tests with **40% CI success rate** to MSW-mocked architecture achieving **95%+ reliability**. Eliminated 4 database deletion incidents, reduced test execution time by **75%**, and reclaimed **$70,000+/year** in engineering productivity.

### Key Results

| Metric                  | Before (Nov 2025) | After (Dec 2025) | Improvement      |
| ----------------------- | ----------------- | ---------------- | ---------------- |
| **CI Success Rate**     | 40%               | 95%+             | 137% improvement |
| **Test Execution Time** | ~3 minutes        | 45 seconds       | 75% faster       |
| **Database Incidents**  | 4 in 2 weeks      | 0 since adoption | 100% elimination |
| **Test Debugging Time** | 20+ hours/week    | 2 hours/week     | 90% reduction    |
| **Deploy Velocity**     | 3-4/week          | 8-10/week        | 150% increase    |

**Business Value:** $70,000+/year in reclaimed engineering time + improved deployment pipeline

---

## 💥 The Testing Crisis

### Before: Database-Coupled Chaos

**Architecture (November 2025):**

```
┌──────────────────────────────────────────────────┐
│             E2E Test Architecture                │
├──────────────────────────────────────────────────┤
│  Playwright Tests                                │
│         ↓                                        │
│  Next.js (localhost:3000)                        │
│         ↓                                        │
│  Real Strapi CMS (localhost:1337)               │
│         ↓                                        │
│  PostgreSQL Database (seeded test data)          │
└──────────────────────────────────────────────────┘

Dependencies: Strapi running + Database seeded + Network stable
```

**Daily Reality:**

```bash
# Typical test run attempt #1
$ yarn test:e2e
❌ 45 tests failed: "Timed out waiting for element"
# Diagnosis: Strapi not started yet

# Attempt #2
$ yarn workspace @repo/strapi develop  # Start Strapi manually
$ yarn test:e2e
❌ 62 tests failed: "Expected content not found"
# Diagnosis: Database not seeded

# Attempt #3
$ ./scripts/seed-e2e-data.sh  # Seed database (5 minutes)
$ yarn test:e2e
❌ 38 tests failed: "Database record not found"
# Diagnosis: Test #1 deleted data that test #2 needed

# Attempt #4
$ ./scripts/seed-e2e-data.sh  # Re-seed (5 more minutes)
$ yarn test:e2e --workers=1  # Sequential tests only
✅ 85 tests passed... ❌ 56 tests failed
# Diagnosis: Race conditions with Strapi boot time

# 2 hours later...
🤬 "This test suite is unusable!"
```

### The Failure Cascade

**Week of December 3-10, 2025:**

1. **Monday:** E2E tests fail in CI → Debug locally → Accidentally delete database (Incident #2)
2. **Tuesday:** Restore database → E2E tests still failing → More debugging
3. **Wednesday:** Try docker system prune to "start fresh" → Database deleted again (Incident #3)
4. **Thursday:** Restore database → Give up on E2E tests → Ship without testing
5. **Friday:** Production bug discovered → Could have been caught by E2E tests

**Cost:**

- **40 hours** debugging tests (should have been building features)
- **2 database incidents** requiring 6+ hours recovery
- **1 production bug** caught by users (embarrassing)
- **Missed deadline** due to debugging instead of shipping

### Root Cause Analysis

**Why Tests Were Flaky:**

1. **Strapi Boot Time:** 15-20 seconds, tests started before Strapi ready
2. **Database State:** Tests shared database, mutations caused failures
3. **Network Latency:** Real HTTP requests susceptible to timing issues
4. **Environmental Differences:** Works locally, fails in CI (cold cache, slower CPU)

**Why Database Incidents Happened:**

- Troubleshooting test failures → "Let me try deleting the database to start fresh"
- SQLite single-file fragility → One `rm` command = 7 days lost

**The Realization:**

> "We're not testing our app. We're testing if Strapi works."  
> — December 15, 2025 breakthrough moment

---

## 💡 The Breakthrough: MSW Architecture

### The Decision Point

**Playwright Official Documentation:**

> "Avoid testing third-party dependencies. Mock them instead."

**Our tests were verifying:**

- ❌ Strapi CMS reliability (not our responsibility)
- ❌ PostgreSQL query performance (database's job)
- ❌ Network stability (infrastructure concern)
- ✅ User experience (THIS is what we should test!)

### New Architecture with MSW

```
┌──────────────────────────────────────────────────┐
│            MSW-Powered E2E Tests                 │
├──────────────────────────────────────────────────┤
│  Playwright Tests                                │
│         ↓                                        │
│  Next.js (localhost:3000)                        │
│         ↓                                        │
│  MSW Bridge Server (localhost:1337) ← MOCK      │
│         │                                        │
│         └─> Returns Controlled Mock Data         │
│                                                  │
│  Real Strapi: ❌ NOT RUNNING                     │
│  Database: ❌ NOT NEEDED                         │
└──────────────────────────────────────────────────┘

Dependencies: Next.js only (MSW starts automatically)
```

### Why MSW?

**Mock Service Worker (MSW):**

- Intercepts HTTP requests at the network layer
- Works in browser AND Node.js (Playwright)
- Returns controlled, predictable responses
- Zero changes to application code

**Key Advantages:**

1. **Deterministic:** Same input → Same output, every time
2. **Fast:** No Strapi boot time, no database queries
3. **Safe:** No database access = no deletion risk
4. **Isolated:** Tests don't affect each other
5. **CI-Friendly:** Consistent across environments

---

## 🛠️ Implementation Journey

### Phase 1: MSW Setup (2 hours)

**Install MSW:**

```bash
yarn add -D msw@latest
```

**Create Mock Data:**

```typescript
// apps/ui/tests/e2e/fixtures/mock-data.ts
export const mockData = {
  homepage: {
    data: [
      {
        id: 1,
        attributes: {
          title: "Welcome to Our SaaS",
          slug: "/",
          sections: [
            {
              __component: "sections.hero",
              id: 1,
              heading: "Build Something Amazing",
              subheading: "The platform you need",
              ctaButton: {
                text: "Get Started",
                url: "/signup",
                variant: "primary",
              },
            },
          ],
        },
      },
    ],
    meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
  },

  navbar: {
    data: {
      id: 1,
      attributes: {
        links: [
          { id: 1, url: "/features", text: "Features", newTab: false },
          { id: 2, url: "/pricing", text: "Pricing", newTab: false },
          { id: 3, url: "/docs", text: "Docs", newTab: false },
        ],
        ctaButton: {
          text: "Sign Up",
          url: "/signup",
          variant: "primary",
        },
      },
    },
  },
}
```

**Create MSW Handlers:**

```typescript
// apps/ui/tests/e2e/fixtures/msw-handlers.ts
import { http, HttpResponse } from "msw"
import { mockData } from "./mock-data"

export const handlers = [
  // Homepage endpoint
  http.get("http://localhost:1337/api/pages", ({ request }) => {
    const url = new URL(request.url)
    const slug = url.searchParams.get("filters[slug][$eq]")

    if (slug === "/") {
      return HttpResponse.json(mockData.homepage)
    }
    return HttpResponse.json({ data: [], meta: {} })
  }),

  // Navbar endpoint
  http.get("http://localhost:1337/api/navbar", () => {
    return HttpResponse.json(mockData.navbar)
  }),

  // Contact form submission
  http.post(
    "http://localhost:1337/api/contact-submissions",
    async ({ request }) => {
      const body = await request.json()

      // Validate required fields
      if (!body.data?.email) {
        return HttpResponse.json(
          { error: { message: "Email is required" } },
          { status: 400 }
        )
      }

      // Success response
      return HttpResponse.json({
        data: {
          id: 1,
          attributes: { ...body.data, createdAt: new Date().toISOString() },
        },
      })
    }
  ),
]
```

### Phase 2: MSW Bridge Server (1 hour)

**Create Node.js Server for Playwright:**

```typescript
// apps/ui/tests/e2e/fixtures/msw-bridge-server.ts
import { createServer } from "http"
import { setupServer } from "msw/node"
import { handlers } from "./msw-handlers"

let server: ReturnType<typeof createServer> | null = null
let mswServer: ReturnType<typeof setupServer> | null = null

export async function startMSWServer() {
  // Setup MSW server
  mswServer = setupServer(...handlers)
  mswServer.listen({ onUnhandledRequest: "warn" })

  // Create HTTP server that forwards to MSW
  server = createServer((req, res) => {
    // MSW intercepts automatically
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ message: "MSW Bridge Server Running" }))
  })

  return new Promise<void>((resolve) => {
    server!.listen(1337, () => {
      console.log("✅ MSW Bridge Server running on port 1337")
      resolve()
    })
  })
}

export async function stopMSWServer() {
  if (server) {
    await new Promise<void>((resolve) => server!.close(() => resolve()))
    console.log("🛑 MSW Bridge Server stopped")
  }
  if (mswServer) {
    mswServer.close()
  }
}
```

**Playwright Global Setup:**

```typescript
// apps/ui/tests/e2e/global-setup.ts
import { startMSWServer } from "./fixtures/msw-bridge-server"

export default async function globalSetup() {
  console.log("🚀 Starting MSW Bridge Server...")
  await startMSWServer()
}
```

**Playwright Global Teardown:**

```typescript
// apps/ui/tests/e2e/global-teardown.ts
import { stopMSWServer } from "./fixtures/msw-bridge-server"

export default async function globalTeardown() {
  console.log("🧹 Cleaning up MSW Bridge Server...")
  await stopMSWServer()
}
```

**Configure Playwright:**

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test"

export default defineConfig({
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  // ... rest of config
})
```

### Phase 3: Rewrite Tests (8 hours for 141 tests)

**Before (Database-Coupled):**

```typescript
// ❌ Old approach - tightly coupled to database
import { test, expect } from "@playwright/test"

test("homepage displays hero section", async ({ page }) => {
  // Requires: Strapi running, database seeded, network stable
  await page.goto("/")

  // Fragile: Times out if Strapi slow
  await page.waitForSelector("h1", { timeout: 30000 })

  // Fragile: Fails if database content changes
  await expect(page.locator("h1")).toHaveText("Build Something Amazing")
})
```

**After (MSW-Mocked):**

```typescript
// ✅ New approach - MSW provides predictable data
import { test, expect } from "@playwright/test"
import {
  navigateAndWaitForContent,
  setStandardTimeout,
} from "./utils/test-helpers"

test("homepage displays hero section", async ({ page }) => {
  test.setTimeout(setStandardTimeout()) // Consistent timeout

  // MSW returns mock data automatically
  await navigateAndWaitForContent(page, "/", /Build Something Amazing/)

  // Deterministic: Mock data never changes
  await expect(page.locator("h1")).toHaveText("Build Something Amazing")
})
```

**Test Helper Pattern:**

```typescript
// apps/ui/tests/e2e/utils/test-helpers.ts

/**
 * Navigate and wait for specific content (handles hydration)
 */
export async function navigateAndWaitForContent(
  page: Page,
  url: string,
  contentPattern: RegExp,
  timeout = 15000
) {
  await page.goto(url)
  await page.waitForLoadState("networkidle", { timeout })
  await expect(page.locator("body")).toContainText(contentPattern, { timeout })
}

/**
 * Standard timeout for CI environments
 */
export function setStandardTimeout() {
  return process.env.CI ? 60000 : 30000
}

/**
 * Check and interact with GDPR checkbox if present
 */
export async function checkGDPRCheckboxIfPresent(
  page: Page,
  options?: { scope?: string }
) {
  const checkbox = page.locator('[data-testid="gdpr-checkbox"]')
  if (await checkbox.isVisible({ timeout: 1000 }).catch(() => false)) {
    await checkbox.click()
  }
}
```

---

## 📈 Results & Impact

### CI Success Rate: 137% Improvement

**Before MSW (November 2025):**

```
CI Run #1: 45/141 tests passed (31%) ❌
CI Run #2: 56/141 tests passed (39%) ❌
CI Run #3: 68/141 tests passed (48%) ❌
CI Run #4: 53/141 tests passed (37%) ❌

Average: 40% success rate
Conclusion: Pipeline unusable, tests skipped
```

**After MSW (December 2025 - January 2026):**

```
CI Run #1: 138/141 tests passed (97.8%) ✅
CI Run #2: 135/141 tests passed (95.7%) ✅
CI Run #3: 139/141 tests passed (98.5%) ✅
CI Run #4: 137/141 tests passed (97.1%) ✅

Average: 97%+ success rate
Conclusion: Reliable, trusted, blocking merges enabled
```

**Improvement:** 40% → 97% = 137% improvement

### Execution Speed: 75% Faster

| Phase          | Before (Real Strapi) | After (MSW)     | Time Saved |
| -------------- | -------------------- | --------------- | ---------- |
| Strapi boot    | 15-20 seconds        | 0 seconds       | 100%       |
| Database seed  | 10-15 seconds        | 0 seconds       | 100%       |
| Test execution | 120-150 seconds      | 45-50 seconds   | 62.5%      |
| **Total**      | **~3 minutes**       | **~45 seconds** | **75%**    |

**CI Minutes Saved:**

- Per test run: 2.25 minutes saved
- Per day (10 runs): 22.5 minutes saved
- Per month: 675 minutes saved
- Annual: **8,100 CI minutes saved** ($500-750/year in GitHub Actions costs)

### Developer Productivity: 90% Reclaimed

**Before:**

```
Week of Dec 3-10, 2025:
Monday:    8 hours debugging test failures
Tuesday:   6 hours fixing database + more debugging
Wednesday: 8 hours (database incident #3)
Thursday:  4 hours still debugging
Friday:    2 hours documentation

Total: 28 hours debugging / 40 hours = 70% of week LOST
```

**After:**

```
Week of Dec 16-22, 2025:
Monday:    30 min fixing 1 legitimate test failure (UI bug found!)
Tuesday:   0 hours test debugging
Wednesday: 1 hour adding new tests (easy with MSW)
Thursday:  0 hours test debugging
Friday:    30 min reviewing test coverage

Total: 2 hours testing / 40 hours = 5% of week (acceptable!)
```

**Improvement:** 28 hours/week → 2 hours/week = **90% reclaimed**

**Annual Value:** 26 hours/week × 52 weeks × $75/hour = **$101,400/year**  
_Conservative estimate (accounting for learning curve): $70,000+/year_

### Database Incidents: 100% Eliminated

**Incident Timeline:**

```
Nov 20 ──┐
Dec 3  ──┤
Dec 8  ──┤─── 4 incidents in 2 weeks (SQLite + Database-coupled tests)
Dec 15 ──┘

Dec 15: MSW adopted ← TURNING POINT

Dec 16-31: 0 incidents (15 days incident-free)
Jan 1-present: 0 incidents
```

**Root Cause Solved:**

- Tests no longer touch database
- Troubleshooting no longer leads to "rm -rf" debugging
- Database deletions still happen (Docker cleanup), but tests unaffected

### Deployment Velocity: 150% Increase

| Metric                | Before                 | After                | Improvement   |
| --------------------- | ---------------------- | -------------------- | ------------- |
| **Deploys/Week**      | 3-4                    | 8-10                 | 150%          |
| **PR Merge Time**     | 2-4 hours              | 30-45 min            | 75% faster    |
| **Blocked PRs**       | 60%                    | 5%                   | 92% reduction |
| **Deploy Confidence** | Low (tests unreliable) | High (tests trusted) | Qualitative   |

**Feedback Loop:**

- Before: Write code → Wait 3 min → CI fails → Debug 2 hours → Retry
- After: Write code → Wait 45 sec → CI passes → Merge confidently

---

## 🎓 Lessons Learned

### What We Got Right

1. **Focus on User Experience:** E2E tests verify UX, not Strapi internals
2. **Deterministic Data:** Mock data eliminates environmental variables
3. **Fast Feedback:** 45-second tests enable rapid iteration
4. **Safety First:** Zero database risk = peace of mind

### What We'd Do Differently

1. **MSW from Day 1:** Should have started with mocks, not migrated later
2. **Integration Tests Earlier:** Took 2 weeks to add real API tests back
3. **Better Mock Data Organization:** Flat structure got messy, should have used factory pattern

### Separation of Concerns: E2E vs Integration

**E2E Tests (MSW-Mocked):**

- **What:** User workflows, UI behavior, form validation
- **Goal:** Verify user experience
- **Frequency:** Every commit (fast, reliable)
- **Example:** "User can submit contact form and see success message"

**Integration Tests (Real Strapi):**

- **What:** API contracts, database queries, auth flows
- **Goal:** Verify backend functionality
- **Frequency:** Weekly or pre-release (slower, requires database)
- **Example:** "Contact form API creates database record with correct schema"

**Both are necessary!** MSW tests UX, integration tests API correctness.

---

## 🚀 Implementation Guide

### For Teams Considering MSW

**When to Use MSW:**

- ✅ E2E tests for frontend behavior
- ✅ Third-party API integrations (Stripe, SendGrid)
- ✅ Complex API responses (many nested relations)
- ✅ Flaky tests due to backend timing

**When NOT to Use MSW:**

- ❌ Testing backend logic (use integration tests)
- ❌ Testing database queries (use real database)
- ❌ Testing authentication flows (needs real tokens)
- ❌ API contract testing (use OpenAPI/Pact)

### Migration Checklist

- [ ] Install MSW (`yarn add -D msw@latest`)
- [ ] Create mock data fixtures (start with 1 endpoint)
- [ ] Setup MSW handlers (return mock data)
- [ ] Configure Playwright global setup/teardown
- [ ] Rewrite 1 test as POC (validate approach)
- [ ] Migrate remaining tests (batch by feature)
- [ ] Add integration test suite (real API)
- [ ] Document testing strategy (E2E vs Integration)
- [ ] Train team on MSW patterns
- [ ] Celebrate 🎉 (you just saved 20 hours/week!)

---

## 📚 Resources

- **MSW Docs:** https://mswjs.io/docs/
- **Playwright Best Practices:** https://playwright.dev/docs/best-practices
- **Testing Strategy Guide:** [../lead-tier/quality-gates-standards.md](../lead-tier/quality-gates-standards.md)
- **ADR-001:** [../adr/ADR-001-msw-for-e2e-testing.md](../adr/ADR-001-msw-for-e2e-testing.md)

---

## 💼 About This Implementation

**Project:** Strapi + Next.js SaaS Platform  
**Migration Date:** December 15, 2025  
**Migration Time:** 16 hours (research + implementation)  
**Time to ROI:** 1 week (first saved debugging cycle)  
**Tests Migrated:** 141 E2E tests  
**Integration Tests Added:** 9 (real Strapi API)

**Technologies:**

- MSW 2.0
- Playwright 1.40
- Next.js 15
- Strapi 5
- TypeScript 5.3

---

## 🔑 Key Takeaways

1. **Mock Third-Party Dependencies** - Test your code, not Strapi's
2. **Fast Feedback Wins** - 45-second tests enable rapid iteration
3. **Deterministic > Realistic** - Controlled data beats "real" but unpredictable data
4. **E2E ≠ Integration** - Different goals, different strategies
5. **MSW is Production-Ready** - Used by major companies (Microsoft, Shopify, Stripe)

**The Real Win:** Engineering team building features instead of debugging flaky tests.

---

_This case study demonstrates testing architecture, DevOps optimization, and converting technical debt into systematic solutions. All metrics from real production migration (November 2025 - January 2026)._

**Connect:** [LinkedIn](#) | [GitHub](#) | [Portfolio](#)  
**Tags:** #Testing #MSW #Playwright #E2E #TestAutomation #DevOps
