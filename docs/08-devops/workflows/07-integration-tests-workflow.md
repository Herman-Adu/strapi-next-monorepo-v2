# Integration Tests Workflow

**Status**: ✅ Production Ready  
**Type**: GitHub Actions  
**File**: `.github/workflows/integration-tests.yml`  
**Date**: January 1, 2026

---

## 🎯 Purpose

Run integration tests against a real Strapi API instance to verify Next.js frontend integration with backend services. Unlike E2E tests that use MSW mocks, integration tests validate actual API responses.

---

## 📋 Workflow Overview

**File**: `.github/workflows/integration-tests.yml`

**Triggers**:

- Push to `main` branch
- Pull requests to `main`
- Manual dispatch via GitHub UI

**Duration**: ~3-4 minutes

**Test Count**: 9 integration tests

**Success Rate**: 95%+ (documented in Sprint 3)

---

## 🔄 Workflow Steps

### Step 1: Checkout Code

```yaml
- uses: actions/checkout@v4
```

Clones repository with full history for accurate testing.

### Step 2: Setup Node.js

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
```

Installs Node.js 20 (project requirement).

### Step 3: Install Dependencies

```yaml
- name: Install dependencies
  run: yarn install --frozen-lockfile
```

**Critical**: Installs from root using `yarn install` (NOT `npm install`).

### Step 4: Start Strapi Backend

```yaml
- name: Start Strapi
  run: |
    cd apps/strapi
    yarn develop &
    npx wait-on http://localhost:1337/admin --timeout 60000
  env:
    DATABASE_URL: postgresql://postgres:postgres@localhost:5432/strapi_test
    NODE_ENV: test
```

**Key Points**:

- Starts Strapi in background (`&`)
- Waits for admin panel to be ready (health check)
- Uses test database (PostgreSQL)
- 60-second timeout for startup

### Step 5: Seed Test Data

```yaml
- name: Seed database
  run: |
    cd apps/strapi
    yarn seed:safe
  env:
    DATABASE_URL: postgresql://postgres:postgres@localhost:5432/strapi_test
```

**Purpose**: Load test data for integration tests (NOT production data).

**Script**: `apps/strapi/database/seeds/e2e-test-data-safe.ts`

### Step 6: Run Integration Tests

```yaml
- name: Run integration tests
  run: yarn workspace @repo/ui test:integration
  env:
    STRAPI_API_URL: http://localhost:1337
    NEXT_PUBLIC_STRAPI_URL: http://localhost:1337
```

**Critical Command**: `yarn workspace @repo/ui test:integration`

**NOT**: `npm run test:integration`

**Test Files**: `apps/ui/tests/integration/*.spec.ts`

### Step 7: Upload Test Results (on failure)

```yaml
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: integration-test-results
    path: apps/ui/test-results/
```

Preserves test artifacts for debugging failures.

---

## 🧪 What Integration Tests Validate

### API Connectivity

- Strapi API accessible
- Authentication working
- CORS configured correctly

### Data Fetching

- Homepage data retrieval
- Dynamic page content
- Structured data (breadcrumbs, SEO)

### Real API Responses

- Actual response shapes
- Real database queries
- Production-like scenarios

**Key Difference from E2E Tests**:

- **E2E Tests**: Use MSW to mock API responses (fast, isolated)
- **Integration Tests**: Hit real Strapi API (slower, validates actual integration)

---

## 📁 Test Files

### Integration Test Directory

```
apps/ui/tests/integration/
├── api-integration.spec.ts    # API connectivity and data fetching
├── ssr-rendering.spec.ts      # Server-side rendering with real API
└── README.md                  # Integration test documentation
```

### Test Examples

**File**: `apps/ui/tests/integration/api-integration.spec.ts`

```typescript
import { test, expect } from "@playwright/test"

test("fetches homepage data from Strapi API", async ({ request }) => {
  const response = await request.get(
    "http://localhost:1337/api/pages?filters[slug][$eq]=home"
  )

  expect(response.ok()).toBeTruthy()
  const data = await response.json()
  expect(data.data).toBeDefined()
  expect(data.data[0].attributes.title).toBeTruthy()
})

test("validates API authentication", async ({ request }) => {
  const response = await request.get("http://localhost:1337/api/pages", {
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  })

  expect(response.ok()).toBeTruthy()
})
```

---

## 🔧 Local Development

### Run Integration Tests Locally

```bash
# Start Strapi in one terminal
yarn workspace @repo/strapi develop

# In another terminal, seed test data
yarn workspace @repo/strapi seed:safe

# Run integration tests
yarn workspace @repo/ui test:integration
```

**Important**: Strapi must be running locally before executing integration tests.

### Debug Integration Tests

```bash
# Run with UI (headed mode)
yarn workspace @repo/ui test:integration --headed

# Run specific test file
yarn workspace @repo/ui test:integration api-integration.spec.ts

# Debug mode
yarn workspace @repo/ui test:integration --debug
```

---

## 🚨 Common Issues

### Issue 1: Strapi Not Ready

**Symptom**: Tests fail with connection errors

**Solution**: Increase `wait-on` timeout

```yaml
npx wait-on http://localhost:1337/admin --timeout 120000
```

### Issue 2: Database Not Seeded

**Symptom**: Tests fail with "data not found"

**Solution**: Verify seed script ran successfully

```bash
yarn workspace @repo/strapi seed:safe
```

### Issue 3: API Token Missing

**Symptom**: 401 Unauthorized errors

**Solution**: Generate API token in Strapi admin

1. Login to Strapi admin (`http://localhost:1337/admin`)
2. Settings → API Tokens → Create New Token
3. Set environment variable: `STRAPI_API_TOKEN`

---

## 📊 Success Metrics

**From Sprint 3 Current State Audit:**

- **Test Count**: 9 integration tests
- **Duration**: 3-4 minutes
- **Success Rate**: 95%+
- **CI Success Improvement**: 40% → 95%+ (+137%)

---

## 🔗 Related Documentation

- `apps/ui/tests/integration/README.md` - Integration test guide
- `.github/workflows/integration-tests.yml` - Workflow configuration
- `apps/strapi/database/seeds/e2e-test-data-safe.ts` - Test data seeding
- `docs/08-devops/workflows/02-e2e-workflow.md` - E2E tests (MSW-based)
- `docs/SPRINT-3-CURRENT-STATE-AUDIT.md` - Current architecture
- `MONOREPO_COMMAND_REFERENCE.md` - Yarn workspace commands

---

## ⚙️ Configuration

### Environment Variables

**Required for Integration Tests**:

```bash
# Strapi API endpoint
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Database (test environment)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/strapi_test

# API Token (for authenticated requests)
STRAPI_API_TOKEN=your_test_api_token

# Node environment
NODE_ENV=test
```

### Test Configuration

**File**: `apps/ui/playwright.config.ts`

```typescript
export default defineConfig({
  testDir: "./tests",
  projects: [
    {
      name: "integration",
      testMatch: /.*\.integration\.spec\.ts/,
      use: {
        baseURL: process.env.STRAPI_API_URL || "http://localhost:1337",
      },
    },
  ],
})
```

---

## 🎯 Best Practices

### 1. Use Safe Test Data

**Always use `seed:safe`** - Never use production data in tests.

```bash
# ✅ CORRECT
yarn workspace @repo/strapi seed:safe

# ❌ WRONG
yarn workspace @repo/strapi seed  # May contain sensitive data
```

### 2. Isolate Test Database

**Use separate database** for integration tests:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/strapi_test
```

**NOT** production database.

### 3. Clean Up After Tests

Integration tests should not leave state changes:

```typescript
test.afterEach(async () => {
  // Clean up test data if needed
})
```

### 4. Use Yarn Workspace Commands

**✅ CORRECT**:

```bash
yarn workspace @repo/ui test:integration
yarn workspace @repo/strapi develop
```

**❌ WRONG**:

```bash
yarn test:integration  # Wrong - not in package.json scripts
yarn playwright test    # Wrong - missing workspace prefix
cd apps/ui && yarn test # Wrong - bypasses workspace orchestration
```

---

## 📈 Maintenance

### Weekly

- Review test failure patterns
- Update test data if schema changes
- Check test execution time (should stay ~3-4 min)

### Monthly

- Audit test coverage
- Remove obsolete tests
- Add tests for new features

### Quarterly

- Review success rate trends
- Update dependencies (Playwright, Vitest)
- Performance optimization

---

## ✅ Checklist for Adding New Integration Tests

- [ ] Test validates real API interaction (not mocked)
- [ ] Test uses correct Yarn workspace command
- [ ] Test data exists in `e2e-test-data-safe.ts`
- [ ] Test runs successfully locally
- [ ] Test passes in CI/CD pipeline
- [ ] Test documented in `apps/ui/tests/integration/README.md`
- [ ] Environment variables configured
- [ ] Test cleanup implemented (if needed)

---

**For questions or issues, refer to integration test README or CI/CD workflow documentation.**
