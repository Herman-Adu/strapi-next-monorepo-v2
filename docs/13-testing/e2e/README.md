# 🎭 E2E Testing Guide

**Created**: November 30, 2025  
**Last Updated**: November 30, 2025  
**Status**: ✅ Active  
**Audience**: Developers, QA Engineers

---

## 🎯 PURPOSE

This guide covers end-to-end (E2E) testing for the Next.js + Strapi monorepo, including test data management, Playwright setup, and CI/CD integration.

---

## 📚 DOCUMENTATION STRUCTURE

### Quick Links

- **[Test Data Seeding Guide](/docs/13-testing-e2e-test-data-seeding)** - Practical guide for seeding E2E test data in Strapi
- **[Strapi Seeding Case Study](/docs/13-testing-e2e-strapi-seeding-case-study)** - Deep-dive analysis and best practices learned
- **[Main Testing Strategy](/docs/13-testing-readme)** - Overview of all testing approaches (Storybook, Chromatic, Unit, E2E)

---

## 🔍 WHAT IS E2E TESTING?

End-to-end testing verifies critical user flows across the full application stack:

- **Frontend**: Next.js UI components and pages
- **Backend**: Strapi CMS and API
- **Database**: PostgreSQL data persistence
- **Integration**: Full request/response cycle

**Goal**: Ensure features work correctly from the user's perspective, not just in isolation.

---

## 🧪 CURRENT E2E SETUP

### Technology Stack

- **Test Framework**: [Playwright](https://playwright.dev)
- **Test Data**: Factory pattern with TypeScript seed scripts
- **Database**: PostgreSQL (Docker container)
- **CI/CD**: GitHub Actions

### What We Test

**Implemented:**

- ✅ E2E test data seeding (factory pattern)
- ✅ Basic homepage rendering
- ✅ Database reset and schema creation

**Planned:**

- ⏳ Newsletter subscription flow
- ⏳ Contact form submission
- ⏳ Page navigation and routing
- ⏳ Authentication flows (if implemented)
- ⏳ Content creation in Strapi admin

---

## 🚀 QUICK START

### Prerequisites

1. **Docker Running** - PostgreSQL database container
2. **Strapi Built** - `yarn build:strapi` (or `yarn build`)
3. **Environment Variables** - `.env` file configured

### Running E2E Tests Locally

```powershell
# 1. Navigate to Strapi directory
cd apps/strapi

# 2. Seed test data (resets database)
yarn seed:e2e

# 3. Start Strapi (in separate terminal)
yarn dev

# 4. Navigate to UI directory
cd ../ui

# 5. Run Playwright tests
yarn test:e2e

# Or run in headed mode (see browser)
yarn test:e2e --headed

# Or run specific test file
yarn test:e2e tests/homepage.spec.ts
```

---

## 📦 TEST DATA SEEDING

### Overview

E2E tests require consistent, predictable test data. We use a **factory pattern** with TypeScript seed scripts to create test data in Strapi.

**Benefits:**

- ✅ Version controlled (changes tracked in Git)
- ✅ Maintainable (update seed scripts, not SQL dumps)
- ✅ Flexible (easy to add/modify test scenarios)
- ✅ Self-documenting (code explains what data exists)

**Tradeoff:**

- ⚠️ Slower than SQL snapshots (~50s vs ~5s)
- ✅ Acceptable for CI (E2E tests run weekly, not on every push)

### Seeding Workflow

```bash
# Full seeding workflow (automated by yarn seed:e2e)
1. Load DATABASE_URL from .env
2. Verify Strapi build exists (dist/ directory)
3. Reset database (DROP schema, CREATE schema)
4. Create database schema (yarn build)
5. Seed test data (node scripts/run-seed.js)
6. Verify data created
```

**Detailed Guide**: See [Test Data Seeding Guide](/docs/13-testing-e2e-test-data-seeding)

---

## 📂 FILE STRUCTURE

```
apps/strapi/
├── database/
│   └── seeds/
│       └── e2e-test-data.ts          # Seed data definition
├── scripts/
│   ├── run-seed.js                    # Strapi bootstrap + seed execution
│   ├── seed-e2e-data.sh               # Main orchestration script
│   └── check-strapi-built.sh          # Prerequisites checker
└── package.json                       # Seed scripts: seed:e2e, seed:e2e:win

apps/ui/
├── e2e/
│   └── homepage.spec.ts               # E2E test files
├── playwright.config.ts               # Playwright configuration
└── package.json                       # Test scripts: test:e2e
```

---

## 🎬 CI/CD INTEGRATION

### GitHub Actions Workflow

E2E tests run automatically on:

- **Schedule**: Weekly (every Monday at 9 AM)
- **Manual Trigger**: `workflow_dispatch` in GitHub Actions UI

**Workflow Steps:**

1. Checkout code
2. Setup Node.js and dependencies
3. Start PostgreSQL (Docker service)
4. Build Strapi
5. **Seed test data** (`yarn seed:e2e`)
6. Start Strapi server (background)
7. Run Playwright tests
8. Upload test results and screenshots

**Configuration**: `.github/workflows/e2e-tests.yml`

---

## 🧩 PLAYWRIGHT CONFIGURATION

### Browser Coverage

Tests run across multiple browsers:

- **Chromium** - Chrome, Edge, Brave
- **Firefox** - Firefox
- **WebKit** - Safari
- **Mobile** - iPhone 12, Pixel 5

### Configuration Highlights

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "mobile", use: { ...devices["iPhone 12"] } },
  ],
})
```

---

## 📝 WRITING E2E TESTS

### Test Structure

```typescript
// e2e/homepage.spec.ts
import { test, expect } from "@playwright/test"

test("homepage loads correctly", async ({ page }) => {
  // Navigate to page
  await page.goto("/")

  // Check critical elements
  await expect(page.locator("h1")).toBeVisible()
  await expect(page.locator("nav")).toBeVisible()

  // Verify content
  const heading = await page.locator("h1").textContent()
  expect(heading).toContain("Welcome")
})
```

### Best Practices

#### DO ✅

1. **Test user flows, not implementation**

   ```typescript
   // Good - tests what user sees
   await page.click('button:has-text("Subscribe")')
   await expect(page.locator("text=Success")).toBeVisible()

   // Bad - tests implementation details
   await page.click("#newsletter-form-submit-button-id-123")
   ```

2. **Use semantic selectors**

   ```typescript
   // Good
   await page.getByRole("button", { name: "Subscribe" })
   await page.getByLabel("Email address")

   // Avoid
   await page.locator(".btn-primary")
   await page.locator("#email-input")
   ```

3. **Wait for elements explicitly**

   ```typescript
   // Good
   await expect(page.locator(".success-message")).toBeVisible()

   // Bad - implicit wait, might be flaky
   await page.click("button")
   expect(await page.locator(".success").count()).toBe(1)
   ```

4. **Use test data from seeds**

   ```typescript
   // E2E test page created by seed script
   await page.goto("/en/e2e-test-page")

   // Test known seeded content
   await expect(page.locator("h1")).toHaveText("E2E Test Page")
   ```

#### DON'T ❌

1. **Don't test unit logic** - Use unit tests for that
2. **Don't hardcode URLs** - Use `baseURL` from config
3. **Don't sleep/wait arbitrarily** - Use explicit waits
4. **Don't test every edge case** - Focus on critical paths
5. **Don't ignore flaky tests** - Fix or remove them

---

## 🐛 TROUBLESHOOTING

### Common Issues

#### Issue: "Page not found" errors

**Cause**: Test data not seeded or fullPath not calculated

**Solution**:

```bash
# Re-seed test data
cd apps/strapi
yarn seed:e2e

# Verify in Strapi admin that fullPath is populated
```

#### Issue: "Database connection refused"

**Cause**: PostgreSQL not running

**Solution**:

```bash
# Check Docker container
docker ps | grep postgres

# Restart if needed
docker-compose up -d
```

#### Issue: "Strapi build not found"

**Cause**: Strapi not built before seeding

**Solution**:

```bash
# Build Strapi first
yarn build:strapi

# Then seed
yarn seed:e2e
```

#### Issue: Tests pass locally but fail in CI

**Cause**: Timing differences, missing dependencies, or environment config

**Solution**:

1. Check CI logs for specific errors
2. Verify environment variables in GitHub Secrets
3. Add explicit waits for slower CI environment
4. Run tests with `--debug` flag locally

---

## 📊 TEST REPORTS

### Local Reports

After running tests:

```bash
# View HTML report
yarn test:e2e --reporter=html

# Open report (auto-opens browser)
yarn workspace @repo/ui playwright show-report
```

### CI Reports

- **GitHub Actions**: Logs and artifacts available in workflow run
- **Screenshots**: Uploaded for failed tests
- **Videos**: Retained for failed tests
- **Trace**: Full execution trace for debugging

---

## 🎯 COVERAGE GOALS

### Current Coverage

- ✅ Homepage rendering
- ✅ Test data seeding infrastructure

### 3-Month Goals

- ⏳ Newsletter subscription (form submission)
- ⏳ Contact form submission
- ⏳ Page navigation (all routes)
- ⏳ SEO meta tags verification
- ⏳ Accessibility checks (axe-core)

### 6-Month Goals

- ⏳ Authentication flows (if implemented)
- ⏳ Strapi admin content creation
- ⏳ API endpoint testing
- ⏳ Multi-language support testing
- ⏳ Performance budgets (Lighthouse CI)

---

## 📚 ADDITIONAL RESOURCES

### Documentation

- [Playwright Docs](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Strapi Testing](https://docs.strapi.io/dev-docs/testing)

### Internal Guides

- [Test Data Seeding Guide](/docs/13-testing-e2e-test-data-seeding) - How to seed test data
- [Strapi Seeding Case Study](/docs/13-testing-e2e-strapi-seeding-case-study) - Best practices analysis
- [Main Testing Strategy](/docs/13-testing-readme) - Overview of all testing
- [Troubleshooting Playbook](/docs/09-troubleshooting-playbook) - Common issues

### External Resources

- [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)
- [Strapi Discord](https://discord.strapi.io/)

---

## 🤝 CONTRIBUTING

### Adding New E2E Tests

1. **Identify critical user flow** - What needs testing?
2. **Check if test data exists** - See `database/seeds/e2e-test-data.ts`
3. **Add seed data if needed** - Update seed script
4. **Write test** - Create `.spec.ts` file in `e2e/`
5. **Test locally** - `yarn test:e2e`
6. **Verify in CI** - Push and check GitHub Actions

### Updating Seed Data

1. **Edit seed script** - `database/seeds/e2e-test-data.ts`
2. **Test seeding** - `yarn seed:e2e`
3. **Verify in Strapi admin** - Check data created correctly
4. **Update related tests** - Adjust tests for new data
5. **Document changes** - Update this guide if needed

---

## ✅ SUCCESS CHECKLIST

Before considering E2E tests "done":

- [ ] All critical user flows covered
- [ ] Tests run reliably (no flaky tests)
- [ ] Test data seeding automated
- [ ] CI/CD integration working
- [ ] Documentation up to date
- [ ] Team trained on writing/maintaining tests
- [ ] Test reports reviewed regularly
- [ ] Failed tests trigger alerts

---

**Questions?** See [Troubleshooting Guide](/docs/09-troubleshooting-playbook) or ask the team! 🚀
