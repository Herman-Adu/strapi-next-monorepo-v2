# 🚀 CI/CD Deep Dive - Complete Pipeline Architecture

**Created**: January 1, 2026  
**Status**: ✅ Production  
**Audience**: Senior engineers, CTOs, DevOps leads

---

## 🎯 OVERVIEW

This document provides a comprehensive deep dive into our GitHub Actions CI/CD pipeline—a production-grade automation system that ensures code quality, prevents regressions, and maintains 98%+ CI success rate.

**Pipeline Coverage**:

- ✅ **7 core workflows** (Lint, Build, E2E, Performance, Visual, Backup, Integration)
- ✅ **2 utility workflows** (Dependabot, Doc validation)
- ✅ **98%+ success rate** (Oct 2025 - Jan 2026)
- ✅ **Zero production incidents** since MSW migration (Dec 15, 2025)

**Key Achievement**: Transformed from manual testing chaos to enterprise-grade automated pipeline in 3 months.

---

## 📊 PIPELINE ARCHITECTURE

### Workflow Orchestration

```
PR/Push Event
    ↓
┌───────────────────────────────────────┐
│   Parallel Execution (4-20 minutes)   │
├───────────────────────────────────────┤
│  CI (Lint + Build)        │  ~5 min   │ → Required for merge
│  Integration Tests        │  ~4 min   │ → Required for merge
│  Visual Regression        │  ~3 min   │ → Optional review
│  E2E Tests (if triggered) │  ~15 min  │ → Weekly + manual
│  Lighthouse (UI changes)  │  ~20 min  │ → UI PRs only
└───────────────────────────────────────┘
    ↓
All Required ✅ → PR Mergeable
Any Failed ❌ → Fix Required
```

### Workflow Dependencies

**No Hard Dependencies**: All workflows run in parallel for speed

**Soft Dependencies** (logical order):

1. **CI** must pass (build successful)
2. **Integration Tests** validate API layer
3. **E2E Tests** validate full stack
4. **Visual Regression** catches UI regressions
5. **Lighthouse** enforces performance budgets

---

## 🏭 WORKFLOW BREAKDOWN

### 1. CI Workflow (Lint + Build) - Foundation

**File**: `.github/workflows/ci.yml`  
**Duration**: 4-5 minutes  
**Triggers**: Every push, every PR  
**Purpose**: Fast feedback loop for code quality

**Jobs**:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - checkout code
      - setup Node.js 22
      - install dependencies (yarn --frozen-lockfile)
      - run: yarn lint

  build:
    runs-on: ubuntu-latest
    steps:
      - checkout code
      - setup Node.js 22
      - cache Turbo builds
      - install dependencies
      - run: yarn build
```

**What It Validates**:

- ✅ TypeScript compilation (no type errors)
- ✅ ESLint rules (code standards)
- ✅ Import organization (prettier-plugin-sort-imports)
- ✅ Build success (all apps compile)

**Critical Dependencies**:

- `@turbo/cache` for incremental builds (50% faster)
- `eslint-config-next` for Next.js rules
- TypeScript 5.x strict mode

**Success Criteria**: Both Lint AND Build must pass

**See**: [01-ci-workflow.md](/docs/08-devops-workflows-01-ci-workflow)

---

### 2. Integration Tests - API Layer Validation

**File**: `.github/workflows/integration-tests.yml`  
**Duration**: 3-4 minutes  
**Triggers**: Every PR, manual dispatch  
**Purpose**: Validate API endpoints without full E2E overhead

**Architecture**:

```
Test Runner (Playwright)
    ↓
Next.js API Routes (apps/ui/src/app/api/*)
    ↓
Mock Strapi Responses (MSW handlers)
    ↓
Assertions on API behavior
```

**What It Tests**:

- ✅ Public/Private proxy routes
- ✅ Asset handling
- ✅ Next-Auth authentication flow
- ✅ Webhook endpoints
- ✅ Error handling

**Key Innovation**: Uses MSW to mock Strapi—no database required!

**Test Example**:

```typescript
test("public-proxy forwards requests correctly", async ({ request }) => {
  const response = await request.get("/api/public-proxy/pages?populate=deep")

  expect(response.ok()).toBeTruthy()
  expect(response.headers()["content-type"]).toContain("application/json")

  const data = await response.json()
  expect(data.data).toBeDefined()
})
```

**See**: [07-integration-tests-workflow.md](/docs/08-devops-workflows-07-integration-tests-workflow)

---

### 3. E2E Tests - Full Stack Validation

**File**: `.github/workflows/e2e-tests.yml`  
**Duration**: 15 minutes  
**Triggers**: Weekly schedule, manual, code changes  
**Purpose**: Comprehensive user journey testing

**Tech Stack**:

- **Playwright** 1.49+ (3 browsers: Chromium, Firefox, WebKit)
- **MSW** (Mock Service Worker) for Strapi API mocking
- **Next.js** 15+ (App Router)
- **PostgreSQL** (GitHub Actions service container)

**Test Coverage** (64 tests):

| Suite          | Tests | Duration | Coverage                    |
| -------------- | ----- | -------- | --------------------------- |
| Homepage       | 12    | ~30s     | Hero, navigation, footer    |
| Contact Form   | 18    | ~45s     | Form validation, submission |
| Newsletter     | 14    | ~40s     | Subscription flow, GDPR     |
| FAQ            | 8     | ~25s     | Accordion interactions      |
| Error Handling | 12    | ~35s     | 404, 500, network errors    |

**MSW Architecture** (Breakthrough - Dec 15, 2025):

```
Playwright Test
    ↓
Next.js UI (http://localhost:3000)
    ↓
API Routes (/api/public-proxy/*)
    ↓
MSW Intercepts Strapi Calls
    ↓
Returns Mock Data (fixtures/mock-data.ts)
    ↓
UI Renders with Mock Data
    ↓
Playwright Asserts User Experience
```

**Key Achievement**: **Zero Strapi dependencies** in E2E tests!

**Before MSW** (Pre-Dec 15):

- ❌ Flaky database seeding
- ❌ Test pollution between runs
- ❌ 45% CI failure rate
- ❌ 30-minute cleanup processes

**After MSW** (Post-Dec 15):

- ✅ Deterministic mock data
- ✅ Isolated test runs
- ✅ 98%+ CI success rate
- ✅ 15-minute total duration

**See**: [02-e2e-workflow.md](/docs/08-devops-workflows-02-e2e-workflow), [MSW-CONSOLIDATION.md](/docs/13-testing-msw-consolidation)

---

### 4. Visual Regression - UI Consistency

**File**: `.github/workflows/visual-regression.yml`  
**Duration**: 2-3 minutes  
**Triggers**: Every push, UI changes  
**Purpose**: Catch unintended visual changes

**Tool**: Chromatic (Storybook integration)

**How It Works**:

```
1. Build Storybook (56 stories)
   ↓
2. Upload to Chromatic CDN
   ↓
3. Capture Screenshots (all variants)
   ↓
4. Compare to Approved Baselines
   ↓
5. Flag Visual Differences
   ↓
6. Developer Reviews in Chromatic UI
   ↓
7. Approve/Reject → Update Baseline
```

**Components Tested** (56 stories):

- Atoms: Badges, Icons, Buttons
- Molecules: Cards, Forms, Testimonials
- Sections: Hero, FAQ, Metrics, Benefits

**Visual Coverage**:

- ✅ Light/Dark themes
- ✅ Responsive breakpoints
- ✅ Interactive states (hover, focus)
- ✅ Animation frames

**Review Workflow**:

1. Chromatic posts comment to PR
2. Developer clicks "View Changes"
3. Side-by-side comparison shown
4. Accept (intentional) or Reject (bug)
5. Baseline updated automatically

**See**: [04-visual-regression-workflow.md](/docs/08-devops-workflows-04-visual-regression-workflow)

---

### 5. Lighthouse Performance - Budget Enforcement

**File**: `.github/workflows/lighthouse.yml`  
**Duration**: 20 minutes  
**Triggers**: PRs with UI changes  
**Purpose**: Prevent performance regressions

**Budgets** (enforced):

| Metric                   | Budget | Current | Status |
| ------------------------ | ------ | ------- | ------ |
| Performance Score        | ≥90    | 92      | ✅     |
| Accessibility Score      | ≥95    | 98      | ✅     |
| Best Practices Score     | ≥90    | 96      | ✅     |
| SEO Score                | ≥95    | 100     | ✅     |
| First Contentful Paint   | <1.8s  | 1.2s    | ✅     |
| Largest Contentful Paint | <2.5s  | 2.1s    | ✅     |
| Total Blocking Time      | <200ms | 150ms   | ✅     |
| Cumulative Layout Shift  | <0.1   | 0.05    | ✅     |

**Pages Tested**: Homepage, About, Docs, Contact, Blog, Services

**Failure Conditions**:

- Performance < 90
- Accessibility < 95
- FCP > 1.8s
- LCP > 2.5s

**See**: [03-lighthouse-workflow.md](/docs/08-devops-workflows-03-lighthouse-workflow)

---

### 6. Database Backup - Disaster Recovery

**File**: `.github/workflows/backup.yml`  
**Duration**: 5 minutes  
**Triggers**: Daily at 2 AM UTC  
**Purpose**: Automated PostgreSQL backups

**Backup Strategy**:

```bash
# 1. Export PostgreSQL schema + data
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME > backup-$(date +%Y%m%d).sql

# 2. Compress backup
gzip backup-$(date +%Y%m%d).sql

# 3. Upload to artifact storage
# (retained for 30 days)

# 4. Cleanup old backups (>7 days local)
```

**Retention Policy**:

- GitHub Artifacts: 30 days
- Local backups: 7 days
- Critical backups: Manual archive

**Recovery Process**:

1. Download backup from GitHub Actions
2. Extract: `gunzip backup-YYYYMMDD.sql.gz`
3. Restore: `psql -U postgres < backup-YYYYMMDD.sql`

**See**: [06-database-backup-workflow.md](/docs/08-devops-workflows-06-database-backup-workflow)

---

### 7. Cache Cleanup - Maintenance

**File**: `.github/workflows/cleanup-caches.yml`  
**Duration**: <1 minute  
**Triggers**: Daily at 2 AM UTC  
**Purpose**: Prevent cache bloat

**What It Cleans**:

- ✅ Turbo cache (>7 days old)
- ✅ Node modules cache (stale)
- ✅ Playwright browser cache
- ✅ Build artifacts

**Cache Strategy**:

```yaml
cache:
  paths:
    - node_modules
    - .turbo
    - apps/*/.next/cache
  key: ${{ runner.os }}-${{ hashFiles('**/yarn.lock') }}
  restore-keys: ${{ runner.os }}-
```

**See**: [05-cache-cleanup-workflow.md](/docs/08-devops-workflows-05-cache-cleanup-workflow)

---

## 🔐 SECRETS MANAGEMENT

### Required Secrets

**CI/CD**:

- `GITHUB_TOKEN` (automatic, for API access)

**Testing**:

- `E2E_TOKEN_HASH` (Strapi API auth for E2E)
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (form testing)

**External Services**:

- `CHROMATIC_PROJECT_TOKEN` (visual regression)
- `LIGHTHOUSE_BUDGETS` (performance thresholds)

**Database**:

- `DATABASE_URL` (PostgreSQL connection)
- `DATABASE_PASSWORD` (backup encryption)

### Secret Rotation

**Schedule**: Quarterly (every 3 months)

**Process**:

1. Generate new secret value
2. Update GitHub repository secrets
3. Update local `.env` files
4. Test in staging environment
5. Deploy to production
6. Revoke old secret

---

## 📈 PERFORMANCE METRICS

### CI Pipeline Stats (Oct 2025 - Jan 2026)

| Metric              | Value   | Target | Status |
| ------------------- | ------- | ------ | ------ |
| Success Rate        | 98.2%   | >95%   | ✅     |
| Average Duration    | 8.5 min | <15min | ✅     |
| False Positives     | 0.8%    | <5%    | ✅     |
| Flakiness Rate      | 1.2%    | <3%    | ✅     |
| Time to Feedback    | 5 min   | <10min | ✅     |
| Incident Prevention | 12 bugs | -      | ✅     |

**Incidents Prevented** (Caught by CI):

- 4 TypeScript errors (build failures)
- 3 visual regressions (layout shifts)
- 2 performance degradations (LCP > 2.5s)
- 2 accessibility violations (missing ARIA labels)
- 1 broken API endpoint (integration test)

---

## 🐛 TROUBLESHOOTING

### Common CI Failures

#### 1. Lint Failures

**Symptom**: `yarn lint` fails in CI

**Causes**:

- Import order violations
- TypeScript type errors
- Unused variables

**Fix**:

```bash
# Run locally first
yarn lint

# Auto-fix issues
yarn lint --fix

# Check types
yarn type-check
```

#### 2. E2E Test Flakiness

**Symptom**: E2E tests pass locally, fail in CI

**Causes**:

- Race conditions (missing `waitFor`)
- Timing issues (fast CI vs slow local)
- MSW handler not registered

**Fix**:

```typescript
// Before: Flaky
await page.click("button")
await expect(page.locator(".toast")).toBeVisible()

// After: Stable
await page.click("button")
await page.waitForSelector(".toast", { state: "visible", timeout: 5000 })
await expect(page.locator(".toast")).toBeVisible()
```

#### 3. Visual Regression False Positives

**Symptom**: Chromatic flags date/time text as changed

**Fix**: Configure ignore patterns

```typescript
// .storybook/preview.ts
export const parameters = {
  chromatic: {
    ignore: [".date-time-text", ".dynamic-timestamp"],
  },
}
```

#### 4. Cache Invalidation

**Symptom**: Build uses stale cache, errors persist

**Fix**:

```bash
# Clear all caches
gh workflow run cleanup-caches.yml

# Or manually in repo settings:
# Settings → Actions → Caches → Delete all
```

---

## 🎯 BEST PRACTICES

### PR Workflow

1. **Create Feature Branch**:

   ```bash
   git checkout -b feature/new-component
   ```

2. **Commit Frequently** (triggers CI on each push):

   ```bash
   git add .
   git commit -m "feat: add new component"
   git push origin feature/new-component
   ```

3. **Monitor CI Dashboard**:

   - Watch Actions tab in GitHub
   - Fix failures immediately
   - Don't stack commits on failing CI

4. **Review Visual Changes**:

   - Click Chromatic link in PR
   - Approve intentional changes
   - Reject regressions

5. **Merge When Green**:
   - All required checks passing
   - Visual changes approved
   - Code review completed

### Writing CI-Friendly Code

**Do's**:

- ✅ Run `yarn lint` before committing
- ✅ Test E2E locally with `yarn test:e2e`
- ✅ Keep test deterministic (no random data)
- ✅ Use `waitFor` for async operations
- ✅ Mock external APIs (MSW)

**Don'ts**:

- ❌ Skip pre-commit hooks
- ❌ Commit broken builds
- ❌ Rely on specific timing
- ❌ Use real API calls in tests
- ❌ Ignore CI failures

---

## 🔗 RELATED DOCUMENTATION

### Core References

- [Workflows Index](/docs/readme) - All 9 workflows
- [CI Workflow Details](/docs/08-devops-workflows-01-ci-workflow)
- [E2E Workflow Details](/docs/08-devops-workflows-02-e2e-workflow)
- [MSW Testing Guide](/docs/13-testing-msw-consolidation)
- [Testing Strategy](/docs/readme)

### External Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Chromatic Documentation](https://www.chromatic.com/docs)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Last Updated**: January 1, 2026  
**Maintained By**: DevOps Team  
**Review Cycle**: Quarterly
