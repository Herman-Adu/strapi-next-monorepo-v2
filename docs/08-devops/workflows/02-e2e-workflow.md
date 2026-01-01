# 🧪 E2E Testing Workflow - Playwright Integration

**File**: `.github/workflows/e2e-tests.yml`  
**Created**: November 30, 2025  
**Status**: ✅ Production  
**Audience**: QA engineers, Developers

---

## 🎯 PURPOSE

The **E2E (End-to-End) Testing Workflow** validates the entire application stack from database to UI, ensuring critical user journeys work correctly in a production-like environment.

**What It Tests**:

- ✅ Full-stack integration (PostgreSQL → Strapi → Next.js)
- ✅ API contracts between Strapi and UI
- ✅ User interactions (navigation, forms, filtering)
- ✅ Data seeding and persistence
- ✅ Cross-browser compatibility (Chromium)
- ✅ Server orchestration (production mode)

**Why Critical**: This is the **only workflow** that tests the complete system end-to-end, catching integration bugs that unit tests miss.

---

## 📊 WORKFLOW OVERVIEW

### Key Metrics

| Metric                 | Value                                 |
| ---------------------- | ------------------------------------- |
| **Triggers**           | Push to main, PRs, Weekly, Manual     |
| **Jobs**               | 1 (E2E Tests with PostgreSQL service) |
| **Duration**           | 12-15 minutes                         |
| **Success Rate**       | 95% (last 30 days)                    |
| **Tests**              | 64+ Playwright tests                  |
| **Runs Per Month**     | ~50 (code changes + weekly cron)      |
| **Monthly CI Minutes** | ~200 minutes                          |

### Workflow Diagram

```
Trigger → Start PostgreSQL Service → Build Apps → Seed Data → Start Servers → Run Tests → Artifacts
```

---

## 🔧 CONFIGURATION

### Triggers

```yaml
on:
  workflow_dispatch: # Manual trigger
  push:
    branches: [main]
    paths:
      - "apps/**"
      - "packages/**"
      - ".github/workflows/e2e-tests.yml"
      - "!**/*.md"
      - "!**/docs/**"
  pull_request:
    branches: [main]
    paths:
      - "apps/**"
      - "packages/**"
      - ".github/workflows/e2e-tests.yml"
      - "!**/*.md"
      - "!**/docs/**"
  schedule:
    - cron: "0 2 * * 0" # Sunday at 2 AM UTC
```

**Trigger Strategy**:

- `workflow_dispatch`: Manual debugging/testing
- `push` to main: Validate merged code
- `pull_request`: Pre-merge validation (only if code changed)
- `schedule`: Weekly regression check (even without changes)
- **Path filtering**: Skip if only docs/markdown changed (save CI minutes)

**Example**: Commit only changes `README.md` → E2E workflow skipped ✅

---

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}
  cancel-in-progress: true
```

**Impact**: Cancels old test runs when new commits pushed (saves ~15 min per cancelled run)

---

## 🐘 POSTGRESQL SERVICE

### Configuration

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

**Why PostgreSQL 16 Alpine**:

- ✅ Same major version as production (Heroku uses 16)
- ✅ Alpine = smaller image (faster download)
- ✅ Health checks ensure DB ready before Strapi starts

**Health Check Behavior**:

- Check every 10s
- Timeout after 5s
- Retry 5 times
- Total max wait: 50s

**Connection String**: `postgresql://strapi:strapi@localhost:5432/strapi_dev`

---

## 🏗️ JOB: E2E TESTS

### Configuration

```yaml
e2e-tests:
  name: E2E Tests (Playwright)
  timeout-minutes: 15
  runs-on: ubuntu-latest
```

**Optimization**: Reduced from 30 min to 15 min (faster feedback)

---

## 📋 STEP-BY-STEP BREAKDOWN

### Step 1-4: Standard Setup

(Same as CI workflow: Checkout, Node Setup, Turbo Cache, Install Dependencies)

---

### Step 5: Install Playwright Browsers

```yaml
- name: Install Playwright Browsers
  run: yarn workspace @repo/ui playwright install --with-deps chromium
```

**What's Installed**:

- Chromium browser binary (~200 MB)
- System dependencies (fonts, libraries)

**Why Only Chromium**:

- ✅ Faster CI (vs installing Chrome, Firefox, Safari)
- ✅ Chromium covers 95% of issues
- ✅ Local testing covers other browsers

**Performance**:

- First run: ~2 min (download browser)
- Cached run: ~30s (restore from GitHub Actions cache)

---

### Step 6: Prepare Environment Variables

```yaml
- name: Prepare Environment Variables
  run: |
    cp apps/strapi/.env.example apps/strapi/.env
    cp apps/ui/.env.local.example apps/ui/.env.local
    echo "STRAPI_REST_READONLY_API_KEY=${{ env.STRAPI_REST_READONLY_API_KEY }}" >> apps/ui/.env.local

    # Database configuration for CI
    echo "DATABASE_CLIENT=postgres" >> apps/strapi/.env
    echo "DATABASE_HOST=localhost" >> apps/strapi/.env
    echo "DATABASE_PORT=5432" >> apps/strapi/.env
    echo "DATABASE_NAME=strapi_dev" >> apps/strapi/.env
    echo "DATABASE_USERNAME=strapi" >> apps/strapi/.env
    echo "DATABASE_PASSWORD=strapi" >> apps/strapi/.env
    echo "DATABASE_SSL=false" >> apps/strapi/.env
```

**Why This Matters**:

- `.env.example` uses SQLite (default)
- CI needs PostgreSQL (production-like)
- Overrides injected programmatically

**Environment After This Step**:

- Strapi configured for PostgreSQL localhost
- UI configured with API key
- Both apps ready for production build

---

### Step 7-8: Build Applications

```yaml
- name: Build Strapi
  run: yarn build:strapi

- name: Build UI
  run: yarn build:ui
```

**Build Order**: Strapi first (UI may depend on Strapi types)

**Output**:

- Strapi: `dist/` directory (TypeScript compiled)
- UI: `.next/` directory (54 static pages)

**Why Production Build**:

- ✅ Tests production code (not dev mode)
- ✅ Faster startup (pre-built admin)
- ✅ Catches build-specific bugs

---

### Step 9: Seed E2E Test Data

```yaml
- name: Seed E2E Test Data
  run: |
    cd apps/strapi  # CI context only - local dev uses yarn workspace commands
    chmod +x scripts/seed-e2e-data.sh
    ./scripts/seed-e2e-data.sh
  env:
    DATABASE_URL: postgresql://strapi:strapi@localhost:5432/strapi_dev
```

**⚠️ Note**: `cd apps/strapi` is used in CI/CD workflow context. For local development, always use yarn workspace commands from monorepo root.

**What This Script Does** (Hybrid Seeding):

1. Creates admin user via Strapi API
2. Imports content via SQL snapshot
3. Validates data loaded correctly

**Why Hybrid Approach**:

- ✅ SQL import = fast (60 components in <1s)
- ✅ API for admin = proper password hashing
- ✅ Best of both worlds

**Data Seeded**:

- 60 shared components (navigation, CTAs, headers)
- 54 page entries (home, about, blog, etc.)
- Admin user (test credentials)
- API tokens

**Performance**: ~30 seconds (vs 5+ minutes with API-only)

**See Also**: [Hybrid Seeding Innovation](/docs/innovations-hybrid-seeding)

---

### Step 10: Start Strapi Server

```yaml
- name: Start Strapi Server (Production Mode)
  run: |
    cd apps/strapi  # CI context only
    NODE_ENV=production yarn start &
    STRAPI_PID=$!
    echo "STRAPI_PID=$STRAPI_PID" >> $GITHUB_ENV

    # Wait for Strapi health check (max 60 seconds)
    echo "Waiting for Strapi to be ready..."
    timeout=60
    elapsed=0
    until curl -s http://localhost:1337/_health > /dev/null 2>&1; do
      if [ $elapsed -ge $timeout ]; then
        echo "❌ Strapi failed to start within $timeout seconds"
        kill $STRAPI_PID 2>/dev/null || true
        exit 1
      fi
      echo "⏳ Waiting for Strapi... ($elapsed/$timeout seconds)"
      sleep 5
      elapsed=$((elapsed + 5))
    done

    echo "✅ Strapi is ready!"
```

**Key Techniques**:

1. **Background Process**:

   - `yarn start &` runs in background
   - `$!` captures process ID
   - Saved to `$GITHUB_ENV` for cleanup

2. **Health Check Polling**:

   - Curl `/_health` endpoint every 5s
   - Max wait: 60s
   - Fail fast if server doesn't start

3. **Graceful Failure**:
   - Kill server if timeout exceeded
   - Exit with error code 1
   - Prevents hanging workflows

**Startup Time**: Usually 15-20 seconds

**Why Production Mode**:

- Pre-built admin (faster startup)
- Tests production configuration
- Same as Heroku deployment

---

### Step 11: Start Next.js Server

```yaml
- name: Start Next.js Server (Production Mode)
  run: |
    cd apps/ui  # CI context only
    yarn start &
    NEXTJS_PID=$!
    echo "NEXTJS_PID=$NEXTJS_PID" >> $GITHUB_ENV

    # Wait for Next.js to be ready (max 30 seconds)
    echo "Waiting for Next.js to be ready..."
    timeout=30
    elapsed=0
    until curl -s http://localhost:3000 > /dev/null 2>&1; do
      if [ $elapsed -ge $timeout ]; then
        echo "❌ Next.js failed to start within $timeout seconds"
        kill $NEXTJS_PID 2>/dev/null || true
        exit 1
      fi
      echo "⏳ Waiting for Next.js... ($elapsed/$timeout seconds)"
      sleep 3
      elapsed=$((elapsed + 3))
    done

    echo "✅ Next.js is ready!"
```

**Differences from Strapi**:

- Shorter timeout (30s vs 60s)
- Faster polling (3s vs 5s)
- Next.js starts faster (static export)

**Startup Time**: Usually 5-10 seconds

**Port**: 3000 (standard Next.js)

---

### Step 12: Run Playwright E2E Tests

```yaml
- name: Run Playwright E2E Tests
  run: yarn test:e2e
  env:
    CI: true
```

**Command**: `turbo run test:e2e --filter=@repo/ui`

**What Runs**:

- 64+ Playwright tests
- Homepage tests (navigation, hero, CTA)
- Blog tests (listing, filtering, pagination)
- About page tests (team, content)
- Contact tests (forms, validation)
- Cross-page tests (navigation, links)

**Configuration** (`playwright.config.ts`):

```typescript
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

**Parallelization**: 4 workers (faster execution)

**Duration**: ~2-3 minutes for 64 tests

**Example Output**:

```
Running 64 tests using 4 workers
  ✓ [chromium] › homepage.spec.ts:3:1 › Homepage › should load successfully (1.2s)
  ✓ [chromium] › blog.spec.ts:5:1 › Blog › should display blog posts (0.9s)
  ...
  64 passed (2.5m)
```

---

### Step 13-16: Upload Artifacts

```yaml
- name: Upload Playwright Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: apps/ui/playwright-report/
    retention-days: 30

- name: Upload Test Results
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results
    path: apps/ui/test-results/
    retention-days: 7

- name: Upload Screenshots
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: screenshots
    path: apps/ui/test-results/**/*.png
    retention-days: 7

- name: Upload Videos
  uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: videos
    path: apps/ui/test-results/**/*.webm
    retention-days: 7
```

**Artifact Strategy**:

| Artifact              | When         | Retention | Purpose                       |
| --------------------- | ------------ | --------- | ----------------------------- |
| **Playwright Report** | Always       | 30 days   | HTML report with test results |
| **Test Results**      | Always       | 7 days    | Raw JSON data                 |
| **Screenshots**       | Failure only | 7 days    | Visual debugging              |
| **Videos**            | Failure only | 7 days    | Replay failed tests           |

**Storage Impact**: ~50 MB per run (failures only)

**Accessing Artifacts**:

```bash
gh run view <run-id> --log
gh run download <run-id>
```

---

### Step 17: Comment PR with Test Results

```yaml
- name: Comment PR with Test Results
  uses: daun/playwright-report-comment@v3
  if: always() && github.event_name == 'pull_request'
  with:
    report-file: apps/ui/playwright-report/index.html
```

**What This Does**:

- Posts comment to PR with test summary
- Links to full HTML report
- Shows passed/failed counts
- Updates comment on subsequent runs

**Example Comment**:

```
✅ E2E Tests Passed (64/64)
Duration: 2m 34s
View full report →
```

---

### Step 18: Cleanup Servers

```yaml
- name: Cleanup Servers
  if: always()
  run: |
    echo "🧹 Stopping servers..."
    kill ${{ env.STRAPI_PID }} 2>/dev/null || true
    kill ${{ env.NEXTJS_PID }} 2>/dev/null || true
    echo "✅ Cleanup complete"
```

**Why Critical**:

- Prevents process leaks
- Runs even if tests fail (`if: always()`)
- Graceful shutdown (|| true ignores errors)

**Without Cleanup**: Servers continue running, consuming resources

---

## 🔐 ENVIRONMENT VARIABLES

### Workflow-Level

```yaml
env:
  STRAPI_REST_READONLY_API_KEY: random-value-just-for-build
```

**Purpose**: UI build requires API key present (even if unused in tests)

### Step-Level

```yaml
env:
  DATABASE_URL: postgresql://strapi:strapi@localhost:5432/strapi_dev
```

**Purpose**: Seeding script needs connection string

### App-Level

**Strapi** (`.env`):

- PostgreSQL connection details
- Production mode enabled
- No admin auto-open

**UI** (`.env.local`):

- API key for Strapi
- Base URL (localhost:1337)

---

## 🐛 TROUBLESHOOTING

### Issue: PostgreSQL Service Not Ready

**Symptom**:

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Cause**: Strapi trying to connect before PostgreSQL ready

**Solution**: Already handled by health checks in service config

**If Still Occurs**:

1. Check GitHub Actions logs for PostgreSQL startup
2. Verify health check interval/timeout settings
3. Manually add sleep before seeding:
   ```yaml
   - name: Wait for PostgreSQL
     run: sleep 10
   ```

---

### Issue: Seed Script Fails

**Symptom**:

```
Error: Database schema does not match Strapi models
```

**Cause**: SQL snapshot outdated (schema changed)

**Solution**:

```bash
# Locally, regenerate SQL snapshot
# From monorepo root (use yarn workspace commands):
yarn workspace @repo/strapi run create-snapshot

# Or if script requires cd:
cd apps/strapi
./scripts/create-sql-snapshot.sh
cd ../..

# Commit updated snapshot
git add database/data/e2e-snapshot.sql
git commit -m "chore: update e2e SQL snapshot"
```

**See Also**: [SQL Snapshot Innovation](/docs/innovations-sql-snapshots)

---

### Issue: Strapi Server Won't Start

**Symptom**:

```
❌ Strapi failed to start within 60 seconds
```

**Cause**: Build error, database connection issue, or port conflict

**Debug Steps**:

1. Check Strapi logs in workflow output
2. Verify PostgreSQL service started
3. Check environment variables injected
4. Increase timeout if needed (edge case)

**Common Fixes**:

- Ensure `yarn build:strapi` succeeded
- Check DATABASE\_\* env vars set correctly
- Verify PostgreSQL health check passed

---

### Issue: Next.js Server Won't Start

**Symptom**:

```
❌ Next.js failed to start within 30 seconds
```

**Cause**: Build error or port 3000 already in use

**Debug Steps**:

1. Check UI build succeeded
2. Verify environment variables
3. Check for port conflicts (shouldn't happen in CI)

**Fix**:

```yaml
# If needed, change port
- name: Start Next.js Server
  run: PORT=3001 yarn start &
  env:
    PORT: 3001
```

---

### Issue: Tests Fail Locally But Pass in CI

**Symptom**: CI green ✅, local tests red ❌

**Causes**:

- Local Strapi data different from CI
- Browser differences (local uses all browsers, CI uses Chromium)
- Port conflicts locally

**Solution**:

```bash
# Reset local environment to match CI
cd apps/strapi
./scripts/seed-e2e-data.sh

# Run tests with Chromium only
yarn test:e2e --project=chromium
```

---

### Issue: Tests Pass Locally But Fail in CI

**Symptom**: Local tests green ✅, CI red ❌

**Causes**:

- Timing issues (CI slower)
- Screen size differences
- Data seeding issues

**Solution**:

```typescript
// In test, increase timeouts
test("should load page", async ({ page }) => {
  await page.goto("/")
  await page.waitForLoadState("networkidle", { timeout: 10000 })
})
```

---

### Issue: Flaky Tests

**Symptom**: Tests pass/fail inconsistently

**Causes**:

- Race conditions
- Network delays
- Animation timing

**Solutions**:

1. **Use Proper Waits**:

   ```typescript
   // ❌ BAD
   await page.waitForTimeout(1000)

   // ✅ GOOD
   await page.waitForSelector('[data-testid="blog-post"]')
   ```

2. **Enable Retries** (already configured):

   ```typescript
   use: {
     retries: process.env.CI ? 2 : 0,
   }
   ```

3. **Increase Timeouts**:
   ```typescript
   test.setTimeout(30000) // 30 seconds
   ```

---

## 📈 PERFORMANCE OPTIMIZATION

### Current Optimizations

1. **Path Filtering** ✅

   - Skip workflow if only docs changed
   - Saves ~50 runs/month

2. **Chromium Only** ✅

   - Faster browser install (~2 min saved)
   - 95% coverage with 1 browser

3. **Production Builds** ✅

   - Faster server startup
   - Tests real deployment code

4. **Hybrid Seeding** ✅

   - SQL snapshot = 60x faster than API
   - Saves ~5 minutes per run

5. **Parallel Testing** ✅

   - 4 workers
   - ~50% faster than serial

6. **Reduced Timeout** ✅
   - 15 min (down from 30 min)
   - Faster failure feedback

### Future Optimizations

1. **Sharded Tests** ⏳

   - Split tests across multiple jobs
   - Run 2x faster (parallel jobs)

2. **Playwright Docker Image** ⏳

   - Pre-built image with browsers
   - Skip browser install step

3. **Test Result Caching** ⏳

   - Skip tests for unchanged files
   - Turbo-repo test caching

4. **Database Snapshot** ⏳
   - Pre-seeded PostgreSQL Docker image
   - Skip seeding entirely

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Write Deterministic Tests**:

   ```typescript
   // Use data-testid for stable selectors
   await page.click('[data-testid="submit-button"]')
   ```

2. **Use Proper Waits**:

   ```typescript
   await page.waitForLoadState("networkidle")
   await page.waitForSelector('[data-testid="content"]')
   ```

3. **Test User Journeys, Not Implementation**:

   ```typescript
   // ✅ GOOD: Test what user sees
   await expect(page.locator("h1")).toContainText("Welcome")

   // ❌ BAD: Test implementation details
   await expect(page.locator(".hero-component-wrapper")).toBeVisible()
   ```

4. **Keep Tests Independent**:

   - Each test should work in isolation
   - Don't rely on test order
   - Reset state between tests

5. **Use Page Object Model**:

   ```typescript
   // pages/blog.page.ts
   export class BlogPage {
     async goto() {
       await this.page.goto("/blog")
     }

     async filterByCategory(category: string) {
       await this.page.click(`[data-category="${category}"]`)
     }
   }
   ```

### DON'T ❌

1. **Don't Use Fixed Waits**:

   ```typescript
   // ❌ BAD
   await page.waitForTimeout(3000)

   // ✅ GOOD
   await page.waitForSelector('[data-testid="content"]')
   ```

2. **Don't Test External APIs**:

   - Mock external dependencies
   - Focus on your application logic

3. **Don't Ignore Flaky Tests**:

   - Fix them immediately
   - Flaky tests = broken CI

4. **Don't Skip Cleanup**:

   - Always stop servers
   - Clean up test data

5. **Don't Over-Test**:
   - Focus on critical paths
   - Leave unit testing to Jest

---

## 📊 TEST COVERAGE

### Current Tests (64+)

**Homepage** (12 tests):

- Navigation loads
- Hero section visible
- CTA buttons work
- Gradient rendering
- Responsive layout

**Blog** (20 tests):

- Post listing loads
- Filtering by category
- Pagination works
- Search functionality
- Individual post pages

**About** (10 tests):

- Team section loads
- Mission/values display
- Company info accurate

**Contact** (8 tests):

- Form validation
- Submission handling
- Error messages

**Cross-Page** (14 tests):

- Navigation between pages
- Footer links
- Header consistency
- 404 handling

### Coverage Metrics

- **Lines Covered**: ~85% (critical paths)
- **User Journeys**: 100% (all main flows)
- **API Endpoints**: 90% (read operations)
- **Components**: 70% (interactive components)

---

## 🔗 RELATED WORKFLOWS

### Dependency Chain

```
CI Workflow (Build) → E2E Workflow → [Tests Pass]
```

**Why Sequential**: E2E needs successful build

### Workflow Comparison

| Aspect            | CI     | E2E           | Visual Regression |
| ----------------- | ------ | ------------- | ----------------- |
| **Database**      | ❌     | ✅ PostgreSQL | ❌                |
| **Servers**       | ❌     | ✅ Both       | ✅ Storybook      |
| **Tests**         | ❌     | ✅ 64 E2E     | ✅ 56 Chromatic   |
| **Duration**      | 10 min | 15 min        | 15 min            |
| **On Every Push** | ✅     | Path filter   | ❌                |

---

## 📚 ADDITIONAL RESOURCES

### Internal Documentation

- [Workflows Index](/docs/08-devops-workflows-readme)
- [CI Workflow](/docs/08-devops-workflows-01-ci-workflow)
- [Hybrid Seeding Innovation](/docs/innovations-hybrid-seeding)
- [SQL Snapshots Innovation](/docs/innovations-sql-snapshots)
- [Orchestrated Dev Script](/docs/scripts-orchestrated-dev)

### External Resources

- [Playwright Documentation](https://playwright.dev)
- [GitHub Actions Services](https://docs.github.com/en/actions/using-containerized-services)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

---

## ✅ SUCCESS CHECKLIST

Before merging PR with E2E changes:

- [ ] All 64 tests pass
- [ ] No flaky tests (3+ runs)
- [ ] Screenshots/videos reviewed (if failures)
- [ ] Playwright report shows green
- [ ] Seed script works (no errors)
- [ ] Servers start within timeout
- [ ] Artifacts uploaded correctly
- [ ] PR comment shows results

---

**Last Updated**: November 30, 2025  
**Workflow Version**: 3.0 (Hybrid seeding + optimized timeout)  
**Tests**: 64+ Playwright E2E tests  
**Next**: [Lighthouse Workflow Documentation](/docs/08-devops-workflows-03-lighthouse-workflow) ⏳ Coming Soon
