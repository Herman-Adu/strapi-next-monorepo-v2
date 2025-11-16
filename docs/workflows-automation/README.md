# 🔄 Workflows & Automation Documentation

> **Category:** Development Workflows & Automation  
> **Status:** In Development  
> **Last Updated:** November 16, 2025  
> **Complexity:** Intermediate to Advanced  
> **Focus:** CI/CD, Git strategy, testing, deployment automation

---

## 📖 Overview

This section covers **development workflows, automation strategies, CI/CD pipelines, testing approaches, and deployment processes** for the Strapi + Next.js monorepo.

### What You'll Learn

- **Git Strategy** - Trunk-based development, conventional commits, branch protection
- **CI/CD Pipeline** - GitHub Actions workflows, cache optimization, automated testing
- **Testing Strategy** - Unit, integration, E2E, visual regression testing
- **Deployment** - Strapi Cloud, Vercel, staging environments, preview deployments
- **Content Workflow** - Editorial workflow, review process, versioning
- **Automation Opportunities** - Type generation, cache invalidation, scaffolding

---

## 🗂️ Documentation Structure

### 📄 [00-WORKFLOW-OVERVIEW.md](./00-WORKFLOW-OVERVIEW.md)

**Development process overview**

- End-to-end workflow (idea → production)
- Team roles and responsibilities
- Tool ecosystem (Git, CI/CD, deployment)
- Communication patterns
- Sprint/iteration structure

**When to read:** Start here for process understanding

---

### 🌿 [01-GIT-STRATEGY.md](./01-GIT-STRATEGY.md)

**Git workflow and best practices**

- **Trunk-Based Development** - Short-lived feature branches, frequent integration
- **Conventional Commits** - Standardized commit messages (feat, fix, docs)
- **Branch Protection** - Main branch rules, required PR reviews
- **Commit Linting** - Commitlint + Husky hooks
- **Semantic Versioning** - Automated version bumps
- **Monorepo Strategy** - Handling multiple packages

**When to read:** Before making your first commit

**Example Preview:**

```bash
# Conventional commit format
git commit -m "feat(blog): add pagination to blog list"
git commit -m "fix(api): resolve 500 error on /api/blogs"
git commit -m "docs(readme): update installation instructions"

# Commitlint validates:
# <type>(<scope>): <subject>
# Types: feat, fix, docs, style, refactor, test, chore
```

---

### ⚙️ [02-CI-CD-PIPELINE.md](./02-CI-CD-PIPELINE.md)

**GitHub Actions workflows**

- **CI Workflow** - Lint, test, build on every PR
- **Cache Strategy** - Yarn cache, build cache, Docker layer cache
- **Matrix Builds** - Test across Node versions
- **Deployment Workflow** - Auto-deploy on merge to main
- **Cleanup Automation** - Nightly cache cleanup (implemented)
- **Performance Testing** - Lighthouse CI integration

**When to read:** When setting up or optimizing CI/CD

**Example Preview:**

```yaml
# .github/workflows/ci.yml (optimized)
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "yarn"

      - run: yarn install --frozen-lockfile
      - run: yarn lint
      - run: yarn test
      - run: yarn build
```

---

### 🧪 [03-TESTING-STRATEGY.md](./03-TESTING-STRATEGY.md)

**Comprehensive testing approach**

- **Unit Testing** - Vitest for utilities, hooks, components
- **Integration Testing** - API routes, Strapi integration
- **E2E Testing** - Playwright for critical user flows
- **Visual Regression** - Percy, Chromatic for component snapshots
- **Performance Testing** - Lighthouse CI, WebPageTest
- **Test Coverage** - Targets and reporting

**When to read:** When implementing testing

**Example Preview:**

```typescript
// Unit test example (Vitest)
import { describe, it, expect } from "vitest"
import { formatDate } from "@/lib/utils"

describe("formatDate", () => {
  it("formats ISO date to readable string", () => {
    expect(formatDate("2025-11-16")).toBe("November 16, 2025")
  })
})

// E2E test example (Playwright)
import { test, expect } from "@playwright/test"

test("blog list loads correctly", async ({ page }) => {
  await page.goto("/blog")
  await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible()
  await expect(page.getByRole("article")).toHaveCount(10)
})
```

---

### 🚀 [04-DEPLOYMENT.md](./04-DEPLOYMENT.md)

**Deployment strategies and environments**

- **Environments** - Development, Staging, Production
- **Strapi Deployment** - Strapi Cloud, Railway, self-hosted Docker
- **Next.js Deployment** - Vercel (recommended), self-hosted
- **Database Strategy** - Managed PostgreSQL (Supabase, Neon)
- **Preview Deployments** - Automatic PR previews on Vercel
- **Environment Variables** - Secure management across environments
- **Rollback Strategy** - Quick recovery from failed deployments

**When to read:** When preparing for production deployment

**Example Preview:**

```bash
# Deployment checklist
✅ Environment variables configured (STRAPI_API_URL, DATABASE_URL)
✅ Database migrations applied
✅ Strapi plugins installed and configured
✅ Next.js build succeeds
✅ CORS configured for production domain
✅ API tokens created (Read-Only for frontend)
✅ Monitoring configured (Sentry, Vercel Analytics)
✅ Backups enabled (database, media)
```

---

### ✍️ [05-CONTENT-WORKFLOW.md](./05-CONTENT-WORKFLOW.md)

**Editorial workflow and content management**

- **Editorial Workflow** - Draft → Review → Publish states
- **Review Process** - Content editor → Technical reviewer → Publisher
- **Content Versioning** - Strapi v5 draft/publish system
- **Scheduled Publishing** - Future publish dates (plugin or custom)
- **Content Migration** - Importing content from existing CMS
- **Localization** - i18n plugin configuration

**When to read:** When setting up content team processes

**Example Preview:**

```
Content Lifecycle:
1. Editor creates draft blog post
2. Editor requests review (custom field or plugin)
3. Reviewer approves/requests changes
4. Editor publishes (publishedAt set)
5. Webhook triggers Next.js revalidation
6. Content goes live within 60s (ISR)
```

---

## 🎯 Quick Start by Use Case

### I want to... 🤔

#### Set up conventional commits

**Go to:** [01-GIT-STRATEGY.md](./01-GIT-STRATEGY.md) → Conventional Commits

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky
npx husky init
```

---

#### Optimize GitHub Actions cache

**Go to:** [02-CI-CD-PIPELINE.md](./02-CI-CD-PIPELINE.md) → Cache Strategy

```yaml
- uses: actions/setup-node@v4
  with:
    cache: "yarn"
- run: yarn install --frozen-lockfile
```

---

#### Add E2E tests with Playwright

**Go to:** [03-TESTING-STRATEGY.md](./03-TESTING-STRATEGY.md) → E2E Testing

```bash
npm init playwright@latest
npx playwright test
```

---

#### Deploy to Vercel

**Go to:** [04-DEPLOYMENT.md](./04-DEPLOYMENT.md) → Next.js Deployment

```bash
vercel --prod
```

---

#### Set up content review workflow

**Go to:** [05-CONTENT-WORKFLOW.md](./05-CONTENT-WORKFLOW.md) → Editorial Workflow

---

## 🏗️ Development Workflow Diagram

### Full Cycle (Idea → Production)

```
┌─────────────────────────────────────────────────────────────┐
│  1️⃣  PLANNING                                               │
│  • Create GitHub issue                                       │
│  • Define acceptance criteria                               │
│  • Assign to developer                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  2️⃣  DEVELOPMENT                                            │
│  • Create feature branch (git checkout -b feat/blog-pagination) │
│  • Write code + tests                                        │
│  • Commit with conventional format                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  3️⃣  CONTINUOUS INTEGRATION (GitHub Actions)               │
│  • Lint code (ESLint, Prettier)                             │
│  • Run tests (Vitest, Playwright)                           │
│  • Build project (Turbo build)                              │
│  • Check for errors                                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  4️⃣  PULL REQUEST REVIEW                                   │
│  • Create PR with description                                │
│  • Request code review                                       │
│  • Address feedback                                          │
│  • Approve and merge                                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  5️⃣  CONTINUOUS DEPLOYMENT                                 │
│  • Auto-deploy to staging (Vercel preview)                  │
│  • QA testing on staging                                     │
│  • Merge to main → Auto-deploy to production                │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  6️⃣  MONITORING & FEEDBACK                                 │
│  • Monitor performance (Vercel Analytics)                    │
│  • Track errors (Sentry)                                     │
│  • Gather user feedback                                      │
│  • Iterate with new issues                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 Automation Strategy

### Current Automations (✅ Implemented)

#### 1. GitHub Actions Cache Cleanup

**Status:** ✅ Operational  
**Workflow:** `.github/workflows/cleanup-caches.yml`  
**Schedule:** Daily at 2 AM UTC  
**Retention:** 7 days  
**Impact:** Reduced cache usage from 115% (11.58 GB) to 29% (2.9 GB)

```yaml
name: Cleanup Old Caches
on:
  schedule:
    - cron: "0 2 * * *"
  workflow_dispatch:

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const caches = await github.rest.actions.getActionsCacheList({
              owner: context.repo.owner,
              repo: context.repo.repo,
            });

            const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

            for (const cache of caches.data.actions_caches) {
              if (new Date(cache.created_at).getTime() < sevenDaysAgo) {
                await github.rest.actions.deleteActionsCacheById({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  cache_id: cache.id,
                });
              }
            }
```

#### 2. CI Cache Optimization

**Status:** ✅ Implemented  
**Workflow:** `.github/workflows/ci.yml`  
**Optimization:** `--frozen-lockfile` + `cache: 'yarn'`  
**Impact:** 67% build cache reduction (2.4 GB → 500 MB per build)

---

### Planned Automations (📋 In Planning)

#### 3. TypeScript Type Generation from Strapi

**Goal:** Auto-generate types when schema changes  
**Trigger:** Strapi webhook on schema update  
**Process:**

```
Strapi Schema Change
  → Webhook POST to /api/webhooks/schema-update
    → Run strapi-to-typescript generator
      → Commit types to packages/shared-data/strapi-types.ts
        → Push to Git or publish package
```

**Status:** 📋 Planned  
**Priority:** HIGH  
**Estimated Effort:** 1-2 days

---

#### 4. Component Scaffolding CLI

**Goal:** Generate atomic component boilerplate  
**Command:** `yarn generate:component --type molecule --name BlogCard`  
**Generated Files:**

```
apps/ui/src/components/molecules/BlogCard/
├── BlogCard.tsx
├── BlogCard.module.css
├── BlogCard.stories.tsx
├── BlogCard.test.tsx
└── index.ts
```

**Status:** 📋 Planned  
**Priority:** MEDIUM  
**Estimated Effort:** 2-3 days

---

#### 5. Cache Invalidation via Webhooks

**Goal:** Auto-invalidate Next.js cache when content publishes  
**Trigger:** Strapi webhook on entry.publish  
**Process:**

```
Content Publishes in Strapi
  → Webhook POST to /api/webhooks/strapi
    → Parse event (model, entry)
      → revalidatePath('/blog')
      → revalidatePath(`/blog/${entry.slug}`)
        → Response 200 OK
```

**Status:** 🏗️ Partially implemented (Next.js API route exists)  
**Priority:** HIGH  
**Estimated Effort:** 1 day (configure webhooks in Strapi admin)

---

#### 6. Visual Regression Testing

**Goal:** Auto-detect UI changes in components  
**Tool:** Percy or Chromatic  
**Trigger:** Every PR  
**Process:**

```
PR Created
  → GitHub Actions runs Storybook build
    → Percy/Chromatic captures screenshots
      → Compares with baseline
        → Flags visual changes for review
```

**Status:** 📋 Planned  
**Priority:** MEDIUM  
**Estimated Effort:** 2-3 days

---

#### 7. Performance Budget Enforcement

**Goal:** Fail CI if performance degrades  
**Tool:** Lighthouse CI  
**Thresholds:**

- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- TTFB < 600ms

**Process:**

```
PR Created
  → GitHub Actions runs Lighthouse CI
    → Lighthouse tests production build
      → Fails if LCP > 2.5s
        → Blocks merge until fixed
```

**Status:** 📋 Planned  
**Priority:** MEDIUM  
**Estimated Effort:** 1 day

---

#### 8. Automated Deployment Previews

**Goal:** Auto-deploy PR to preview environment  
**Platform:** Vercel (Next.js) + Strapi Cloud preview  
**Trigger:** Every PR

**Status:** 🏗️ Partially implemented (Vercel auto-preview exists)  
**Priority:** LOW (Vercel handles this automatically)  
**Estimated Effort:** 0 days (already working)

---

## 🚀 Implementation Checklist

### Phase 1: Git Workflow (Day 1)

```
□ Set up Commitlint + Husky
□ Configure conventional commit types
□ Add branch protection rules (main)
□ Document Git workflow in README
□ Train team on conventional commits
```

### Phase 2: CI/CD Pipeline (Day 1-2)

```
□ Create .github/workflows/ci.yml
□ Add lint, test, build steps
□ Optimize caching (--frozen-lockfile, cache: 'yarn')
□ Add cleanup-caches.yml workflow
□ Test CI on sample PR
```

### Phase 3: Testing (Day 2-3)

```
□ Set up Vitest for unit tests
□ Set up Playwright for E2E tests
□ Add test coverage reporting
□ Integrate tests into CI workflow
□ Write tests for critical paths
```

### Phase 4: Deployment (Day 3-4)

```
□ Deploy Strapi to Strapi Cloud
□ Deploy Next.js to Vercel
□ Configure environment variables
□ Set up database (PostgreSQL on Supabase/Neon)
□ Test production deployment
```

### Phase 5: Content Workflow (Day 4-5)

```
□ Configure Strapi draft/publish system
□ Set up user roles (Editor, Reviewer, Publisher)
□ Document content creation process
□ Configure webhooks for cache invalidation
□ Train content team
```

---

## ⚠️ Common Workflow Pitfalls

### Pitfall #1: Not Using Conventional Commits

**❌ BAD:**

```bash
git commit -m "fixed bug"
git commit -m "updates"
git commit -m "wip"
```

**Problem:** No semantic meaning, breaks automated tooling (semantic-release, changelogs)

**✅ GOOD:**

```bash
git commit -m "fix(api): resolve 500 error on /api/blogs endpoint"
git commit -m "feat(blog): add pagination to blog list page"
git commit -m "docs(readme): update installation instructions"
```

---

### Pitfall #2: Skipping Tests Before Merge

**❌ BAD:**

```bash
git push origin feature/new-feature
# Merge without running tests locally
```

**✅ GOOD:**

```bash
yarn test
yarn lint
yarn build
git push origin feature/new-feature
# Tests pass in CI before merge
```

---

### Pitfall #3: Deploying Without Environment Variables

**❌ BAD:**

```bash
# Deploy with missing STRAPI_API_URL
vercel --prod
# Site breaks in production
```

**✅ GOOD:**

```bash
# Verify environment variables first
vercel env ls
vercel env add STRAPI_API_URL
vercel --prod
```

---

### Pitfall #4: No Rollback Plan

**❌ BAD:**

- Deploy breaks production
- No way to quickly revert
- Site down for hours

**✅ GOOD:**

- Use Vercel instant rollback (one click)
- Keep last 3 production deployments
- Test rollback process in staging

---

## 🔗 Related Documentation

- [Content Modeling](../content-modeling/README.md) - Schema design
- [Strapi Integration](../strapi-integration/README.md) - API integration
- [Performance Optimization](../performance-optimization/README.md) - Monitoring
- [Atomic Architecture](../atomic-architecture/README.md) - Component structure

---

## 📚 Learning Path

### Beginner (1-2 days)

1. Read [00-WORKFLOW-OVERVIEW.md](./00-WORKFLOW-OVERVIEW.md)
2. Understand end-to-end process
3. Read [01-GIT-STRATEGY.md](./01-GIT-STRATEGY.md)
4. Set up Commitlint + Husky

### Intermediate (3-5 days)

5. Read [02-CI-CD-PIPELINE.md](./02-CI-CD-PIPELINE.md)
6. Create GitHub Actions workflows
7. Read [03-TESTING-STRATEGY.md](./03-TESTING-STRATEGY.md)
8. Add unit and E2E tests

### Advanced (1 week)

9. Read [04-DEPLOYMENT.md](./04-DEPLOYMENT.md)
10. Deploy to staging and production
11. Read [05-CONTENT-WORKFLOW.md](./05-CONTENT-WORKFLOW.md)
12. Configure editorial workflow

---

**🔄 You're ready to establish efficient workflows!**

Start with [00-WORKFLOW-OVERVIEW.md](./00-WORKFLOW-OVERVIEW.md) for process context, then proceed to [01-GIT-STRATEGY.md](./01-GIT-STRATEGY.md) for hands-on Git setup.
