# 🔄 CI/CD Integration - E2E Testing

**Last Updated**: November 24, 2025  
**Status**: Phase 3 - E2E Tests Integrated into CI/CD  
**Framework**: GitHub Actions + Playwright

---

## 📋 Overview

E2E tests now run automatically on every:

- ✅ **Push to `main` branch**
- ✅ **Pull Request to `main` branch**
- ✅ **Manual workflow dispatch**

---

## 🚀 GitHub Actions Workflows

### 1. E2E Tests Workflow

**File**: `.github/workflows/e2e-tests.yml`

**Purpose**: Run comprehensive Playwright E2E tests with full Strapi + Next.js stack

**Triggers**:

- Push to `main`
- Pull Request to `main`
- Manual workflow dispatch

**Runtime**: ~15-30 minutes

**Steps**:

1. ✅ Check out code
2. ✅ Set up Node.js 22
3. ✅ Cache dependencies and Turbo builds
4. ✅ Install dependencies (`yarn --frozen-lockfile`)
5. ✅ Install Playwright browsers (Chromium, Firefox, WebKit)
6. ✅ Start PostgreSQL database (GitHub Actions service)
7. ✅ Prepare environment variables (Strapi + Next.js)
8. ✅ Build Strapi
9. ✅ Build Next.js UI
10. ✅ Seed Strapi database with test data
11. ✅ Run Playwright E2E tests
12. ✅ Upload test artifacts (reports, screenshots, videos)
13. ✅ Comment PR with test results

**Artifacts Generated**:

- `playwright-report/` - HTML test report (30 days retention)
- `test-results/` - Test results and traces (7 days retention)
- `screenshots/` - Failure screenshots (7 days retention)
- `videos/` - Failure videos (7 days retention)

### 2. Main CI Workflow

**File**: `.github/workflows/ci.yml`

**Purpose**: Lint and build verification

**Jobs**:

- **Lint**: Format check + ESLint
- **Build**: Build Strapi + Next.js

**Runtime**: ~10-15 minutes

---

## 📊 Test Execution

### What Runs in CI

**64 E2E Tests Across 5 Test Suites**:

1. **Newsletter Tests** (9 tests)

   - Form validation
   - Submission handling
   - Mobile responsiveness
   - Keyboard navigation

2. **Contact Form Tests** (11 tests)

   - GDPR validation
   - Multi-field validation
   - Form submission
   - Error handling

3. **FAQ Tests** (13 tests)

   - Accordion interactions
   - Accessibility (ARIA)
   - Keyboard navigation
   - State management

4. **API Integration Tests** (13 tests)

   - Strapi API connectivity
   - Data population
   - Error states
   - Retry logic

5. **Error Handling Tests** (15 tests)

   - Network failures
   - Offline mode
   - Invalid responses
   - Edge cases

6. **Homepage Tests** (3 tests)
   - Basic loading
   - Navigation presence
   - Responsive design

### Browsers Tested

- ✅ **Chromium** (Desktop Chrome)
- ✅ **Firefox** (Desktop Firefox)
- ✅ **WebKit** (Desktop Safari)

**Total Test Runs**: 64 tests × 3 browsers = **192 test executions**

---

## 🎯 CI Configuration

### Environment Variables

**Automatically set in CI**:

```bash
# Strapi
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_dev
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false

# Next.js
STRAPI_REST_READONLY_API_KEY=random-value-just-for-build

# Playwright
CI=true
```

### PostgreSQL Service

**Configuration**:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: strapi
      POSTGRES_DB: strapi_dev
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
    ports:
      - 5432:5432
```

**Health Check**: Ensures database is ready before tests run

### Playwright Configuration

**From `playwright.config.ts`**:

```typescript
{
  retries: process.env.CI ? 2 : 0,        // 2 retries on CI
  workers: process.env.CI ? 1 : undefined, // Sequential on CI
  reporter: 'html',                        // HTML report
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  }
}
```

---

## 📈 Viewing Test Results

### On Pull Requests

**Automatic PR Comment** (via `daun/playwright-report-comment`):

- Test summary (passed/failed/skipped)
- Failed test details
- Link to artifacts

**Example PR Comment**:

```
🎭 Playwright Test Results

✅ 60 passed
❌ 2 failed
⏭️ 2 skipped

Failed Tests:
- contact-form.spec.ts › should submit form with GDPR
- api-integration.spec.ts › should retry failed requests

View full report in artifacts →
```

### In GitHub Actions UI

1. Navigate to **Actions** tab
2. Click on the workflow run
3. Scroll to **Artifacts** section
4. Download:
   - `playwright-report` - HTML report
   - `screenshots` - Failure screenshots (if any)
   - `videos` - Failure videos (if any)

### View HTML Report Locally

```powershell
# Download artifacts from GitHub
# Extract playwright-report.zip

# Open report
cd playwright-report
yarn workspace @repo/ui playwright show-report
```

---

## 🐛 Debugging CI Failures

### Common Failure Scenarios

#### 1. Test Data Not Populated

**Symptom**: Tests fail with "Locator not found"

**Cause**: E2E test page not seeded in database

**Solution**:

```yaml
# In .github/workflows/e2e-tests.yml
- name: Seed Strapi Database
  run: |
    # Add script to seed E2E test page
    node scripts/seed-e2e-data.js
```

**TODO**: Create seeding script (Phase 3 task)

#### 2. Timeout During Startup

**Symptom**: "Strapi failed to start within 120 seconds"

**Cause**: Strapi takes longer to build/start on CI

**Solution**: Already handled with health check + 120s timeout

#### 3. Browser Launch Failures

**Symptom**: "Failed to launch chromium"

**Cause**: Missing browser dependencies

**Solution**: Use `playwright install --with-deps` (already configured)

#### 4. Port Conflicts

**Symptom**: "Address already in use: 1337 or 3000"

**Cause**: Previous process not cleaned up

**Solution**: Concurrency group cancels in-progress runs (already configured)

#### 5. Database Connection Errors

**Symptom**: "connect ECONNREFUSED localhost:5432"

**Cause**: PostgreSQL service not healthy

**Solution**: Health check in service config (already configured)

### Debug Steps

**View Logs**:

1. Click on failed workflow run
2. Expand failed step
3. Check logs for error messages

**Download Artifacts**:

1. Screenshots show UI state at failure
2. Videos show full test execution
3. Traces show detailed debugging info

**Run Locally**:

```powershell
# Replicate CI environment
$env:CI = "true"
yarn test:e2e
```

---

## 🔒 Branch Protection Rules

### Recommended Settings

**To enforce E2E tests before merge**:

1. Go to: **Settings** → **Branches** → **main**
2. Enable: "Require status checks to pass before merging"
3. Select required checks:
   - ✅ `E2E Tests (Playwright)`
   - ✅ `Lint`
   - ✅ `Build all apps`

**Effect**: PRs cannot be merged until all tests pass

### Bypass for Hotfixes

**Option 1**: Create `hotfix/*` branches exempt from checks

**Option 2**: Allow admins to bypass (not recommended)

**Option 3**: Manual workflow dispatch after merge

---

## 📊 Performance Metrics

### Target CI Times

- **Lint**: < 5 minutes ✅
- **Build**: < 15 minutes ✅
- **E2E Tests**: < 30 minutes ⏳

### Optimization Strategies

**Current**:

- ✅ Turbo cache for builds
- ✅ Yarn cache for dependencies
- ✅ Playwright browser caching
- ✅ Sequential test execution (workers: 1)

**Future Optimizations**:

- [ ] Parallel test execution (increase workers)
- [ ] Test sharding (split into multiple jobs)
- [ ] Selective test running (only affected tests)
- [ ] Database snapshot for faster seeding

---

## 🚦 Status Badges

### Add to README.md

```markdown
## CI Status

[![Verify Build](https://github.com/Herman-Adu/strapi-next-monorepo-v2/actions/workflows/ci.yml/badge.svg)](https://github.com/Herman-Adu/strapi-next-monorepo-v2/actions/workflows/ci.yml)

[![E2E Tests](https://github.com/Herman-Adu/strapi-next-monorepo-v2/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/Herman-Adu/strapi-next-monorepo-v2/actions/workflows/e2e-tests.yml)

[![Visual Regression](https://github.com/Herman-Adu/strapi-next-monorepo-v2/actions/workflows/visual-regression.yml/badge.svg)](https://github.com/Herman-Adu/strapi-next-monorepo-v2/actions/workflows/visual-regression.yml)
```

---

## 📝 Workflow Triggers

### Automatic Triggers

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
```

**Runs on**:

- Every commit to `main`
- Every commit to PR branches targeting `main`

### Manual Trigger

```yaml
on:
  workflow_dispatch:
```

**How to trigger**:

1. Go to **Actions** tab
2. Select **E2E Tests** workflow
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow"

### Scheduled Runs (Optional)

**Add to trigger for nightly tests**:

```yaml
on:
  schedule:
    - cron: "0 2 * * *" # 2 AM daily
```

---

## 🎯 Success Criteria

**CI/CD Integration Complete When**:

- [x] E2E tests workflow created
- [x] PostgreSQL service configured
- [x] Playwright browsers installed
- [x] Test artifacts uploaded
- [x] PR comments enabled
- [x] Failure screenshots captured
- [x] Failure videos captured
- [ ] Test data seeding automated
- [ ] Branch protection rules enabled
- [ ] All tests passing in CI

**Next Steps**:

1. Create database seeding script for E2E test page
2. Enable branch protection rules
3. Test full workflow with real PR

---

## 🔗 Related Files

- `.github/workflows/e2e-tests.yml` - E2E test workflow
- `.github/workflows/ci.yml` - Main CI workflow
- `apps/ui/playwright.config.ts` - Playwright configuration
- `apps/ui/e2e/README.md` - E2E test documentation
- `apps/ui/E2E_TESTING.md` - Quick start guide

---

## ✅ Checklist

**Before Merging**:

- [x] E2E workflow file created
- [x] Playwright browsers configured
- [x] Database service configured
- [x] Environment variables set
- [x] Artifact uploads configured
- [x] PR comment action added
- [ ] Test seeding script created
- [ ] All tests passing in CI
- [ ] Documentation complete

**After Merging**:

- [ ] Enable branch protection
- [ ] Add status badges to README
- [ ] Monitor first few CI runs
- [ ] Optimize performance if needed

---

**Last Updated**: November 24, 2025  
**Workflow**: E2E Tests  
**Status**: Configured ✅ | Seeding TODO ⏳  
**Next**: Create test data seeding script
