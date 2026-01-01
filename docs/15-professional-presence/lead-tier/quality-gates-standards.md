# Quality Gates & Standards

**Last Updated**: January 1, 2026  
**Audience**: Engineering managers, team leads, DevOps engineers  
**Purpose**: Measurable quality standards enforced throughout the development pipeline

---

## Overview

This document defines the quality gates, standards, and automated enforcement mechanisms that ensure code quality, prevent regressions, and maintain high engineering standards across the team.

**Philosophy**: **Quality is automated, not optional.**

Every change must pass through measurable quality gates before reaching production. We trust automation over manual processes, and we measure what we enforce.

---

## Quality Gate Architecture

```
Developer Workstation                 CI/CD Pipeline                 Production
────────────────────                 ──────────────                 ──────────

1. Pre-Commit Gates                  4. CI Gates                    7. Production Gates
   ├─ Format (Prettier)                 ├─ Lint (ESLint)               ├─ Health Checks
   ├─ Lint (ESLint)                     ├─ Build (TypeScript)          ├─ Error Monitoring
   ├─ Build (Local)                     ├─ Type Check                  └─ Performance Monitoring
   └─ Tests (Unit/E2E)                  └─ Dependency Check

2. Commit Gates                      5. Test Gates
   ├─ Conventional Commits              ├─ E2E Tests (64 tests)
   ├─ No Secrets                        ├─ Integration (9 tests)
   └─ File Size Limits                  └─ Visual Regression

3. Branch Gates                      6. Security Gates
   ├─ Branch Naming                     ├─ Dependency Audit
   └─ No Direct Main Commits            ├─ Secret Scanning
                                        └─ Code Analysis
```

**Key Principle**: **Shift Left** - Catch issues as early as possible (developer workstation > CI > production)

---

## 1. Pre-Commit Quality Gates

### 1.1 Code Formatting (Prettier)

**Gate**: All code must be formatted with Prettier before commit

**Enforcement**:

```bash
# Manual check
yarn format:check

# Auto-fix
yarn format
```

**Configuration**:

- `prettier.config.js` in each workspace
- Consistent across Strapi + UI + packages
- Enforces: semicolons, single quotes, 100 char line width
- Organizes imports with `@trivago/prettier-plugin-sort-imports`

**Standards**:

- ✅ All `.ts`, `.tsx`, `.js`, `.jsx`, `.md`, `.css`, `.scss` files formatted
- ✅ Import statements sorted (React → Next → External → Internal)
- ✅ Consistent indentation (2 spaces)
- ✅ Trailing commas in multi-line objects/arrays

**Failure Handling**:

- ❌ **BLOCKING**: Cannot commit with unformatted code
- 🔧 **Auto-fix**: Run `yarn format` to fix all files

---

### 1.2 Linting (ESLint)

**Gate**: All code must pass ESLint rules before commit

**Enforcement**:

```bash
# Check all workspaces
yarn lint

# Check specific workspace
yarn workspace @repo/ui lint
yarn workspace @repo/strapi lint
```

**Configuration**:

- `@repo/eslint-config` shared config
- Next.js rules for UI
- Node.js rules for Strapi
- TypeScript rules for both

**Standards**:

- ✅ No unused variables
- ✅ No console.log in production code (use logging library)
- ✅ Proper React Hook dependencies
- ✅ Proper TypeScript types (no `any` without justification)
- ✅ Import/export conventions
- ✅ Component naming conventions

**Failure Handling**:

- ❌ **BLOCKING**: Cannot commit with lint errors
- ⚠️ **WARNINGS**: Can commit with warnings (discouraged)
- 🔧 **Auto-fix**: Run `yarn lint --fix` for auto-fixable issues

---

### 1.3 Local Build Verification

**Gate**: Code must compile successfully before commit

**Enforcement**:

```bash
# Build all apps
yarn build

# Build specific app
yarn workspace @repo/ui build
yarn workspace @repo/strapi build
```

**What's Validated**:

- ✅ TypeScript compilation (no type errors)
- ✅ Next.js build (pages compile, no routing errors)
- ✅ Strapi build (plugins load, schemas valid)
- ✅ Asset optimization (images, fonts)
- ✅ Bundle size checks (warn if exceeds budget)

**Standards**:

- ✅ **Zero TypeScript errors** (strict mode)
- ✅ **Zero build errors**
- ⚠️ **Bundle size warnings** (investigate but don't block)

**Failure Handling**:

- ❌ **BLOCKING**: Cannot commit with build errors
- 🔧 **Fix Required**: Address TypeScript errors, missing dependencies, configuration issues

---

### 1.4 Local Test Execution

**Gate**: Relevant tests must pass before commit

**Enforcement**:

```bash
# E2E tests (if changed UI)
yarn workspace @repo/ui playwright test tests/e2e/

# Integration tests (if changed API)
yarn workspace @repo/ui playwright test tests/integration/

# Specific test
yarn workspace @repo/ui playwright test tests/e2e/contact-form.spec.ts
```

**Test Categories**:

| Test Type     | Count | Duration | When to Run               |
| ------------- | ----- | -------- | ------------------------- |
| E2E           | 64    | ~15 min  | Changed UI or components  |
| Integration   | 9     | ~4 min   | Changed API routes        |
| Unit (Vitest) | TBD   | <1 min   | Changed utility functions |

**Standards**:

- ✅ All affected tests passing
- ✅ New features have tests
- ✅ Bug fixes have regression tests
- ✅ Tests are deterministic (no flakiness)

**Failure Handling**:

- ❌ **BLOCKING**: Cannot commit with failing tests
- 🔧 **Fix Required**: Fix code or update test (if test is outdated)

---

## 2. Commit Quality Gates

### 2.1 Commit Message Standards

**Gate**: Commit messages must follow Conventional Commits format

**Format**:

```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

**Required Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance
- `perf`: Performance
- `style`: Formatting

**Examples**:

```
feat(contact): add email validation to contact form
fix(newsletter): resolve GDPR checkbox not clickable issue
docs(testing): update MSW testing guide with new examples
refactor(api): simplify Strapi proxy route logic
test(e2e): add homepage hero section comprehensive tests
```

**Enforcement**:

- ⚠️ **Commitlint** (can be bypassed with `--no-verify`)
- ✅ **PR Title** must follow format (enforced during merge)

**Standards**:

- ✅ Type is required
- ✅ Scope is optional but recommended
- ✅ Subject is lowercase, present tense, no period
- ✅ Body explains "why", not "what"
- ✅ Footer references issues (`Closes #123`)

---

### 2.2 Secret Detection

**Gate**: No secrets, API keys, or credentials in commits

**Enforcement**:

- GitHub secret scanning (automatic)
- Pre-commit hooks (can check `.env` files)
- `.gitignore` for sensitive files

**Blocked Content**:

- ❌ API keys, tokens, passwords
- ❌ `.env` files (except `.env.example`)
- ❌ Database connection strings
- ❌ AWS/GCP credentials
- ❌ Private keys

**Failure Handling**:

- 🚨 **CRITICAL**: Immediately rotate compromised secrets
- 🔧 **Fix**: Remove from history with `git filter-branch` or BFG
- 📝 **Document**: Update `.gitignore` to prevent recurrence

---

## 3. Branch Quality Gates

### 3.1 Branch Protection Rules

**Main Branch Protection**:

- ❌ No direct commits (all changes via PR)
- ✅ Require PR reviews (1+ approvals)
- ✅ Require status checks (CI must pass)
- ✅ Require up-to-date branches (must merge latest main)
- ✅ Require signed commits (optional, recommended)

**Branch Naming Conventions**:

```
feature/descriptive-name      ✅ Good
fix/issue-description          ✅ Good
docs/update-testing-guide      ✅ Good
refactor/simplify-api          ✅ Good

random-branch                  ❌ Bad (no prefix)
FEATURE-123                    ❌ Bad (uppercase)
my_feature                     ❌ Bad (underscore)
```

---

## 4. CI Quality Gates (GitHub Actions)

### 4.1 Lint & Build Gate

**Workflow**: `.github/workflows/ci.yml`  
**Duration**: ~5 minutes  
**Triggers**: Every push, every PR

**Jobs**:

1. **Lint**

   - ESLint all workspaces
   - Must pass: Zero errors
   - Can warn: Warnings accepted but discouraged

2. **Build**
   - Build all apps (Strapi + UI)
   - TypeScript strict mode
   - Must pass: Zero TypeScript errors

**Enforcement**: ❌ **BLOCKING** - PR cannot merge if CI fails

---

### 4.2 Type Check Gate

**Gate**: TypeScript type checking in strict mode

**Configuration**:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Standards**:

- ✅ No `any` types (use `unknown` or proper types)
- ✅ Null checks required (`strictNullChecks`)
- ✅ No unused variables or parameters
- ✅ Proper function signatures

---

### 4.3 Dependency Audit Gate

**Gate**: No known vulnerabilities in dependencies

**Enforcement**:

```bash
# Check for vulnerabilities
yarn audit

# Auto-fix
yarn audit fix
```

**Severity Levels**:

- 🚨 **Critical**: Must fix immediately (block merge)
- ⚠️ **High**: Fix within 1 week
- 📝 **Moderate**: Fix within 1 month
- ℹ️ **Low**: Fix when convenient

**Handling**:

- 🚨 Critical/High: Block PR merge
- ⚠️ Moderate/Low: Create follow-up issue

---

## 5. Test Quality Gates

### 5.1 E2E Test Gate

**Workflow**: `.github/workflows/e2e-tests.yml`  
**Duration**: ~15 minutes  
**Coverage**: 64 user journey tests

**Test Categories**:
| Category | Tests | Coverage |
| -------------- | ----- | --------------------------------- |
| Homepage | 12 | Hero, navigation, footer |
| Contact Form | 18 | Validation, submission, errors |
| Newsletter | 14 | Subscription, GDPR, confirmation |
| FAQ | 8 | Accordion, interactions |
| Error Handling | 12 | 404, 500, network errors |

**Success Criteria**:

- ✅ **100% pass rate** (no flaky tests)
- ✅ Tests run in <15 minutes
- ✅ Consistent across runs

**Standards**:

- ✅ Tests use MSW for API mocking (no real backend)
- ✅ Tests focus on user behavior (not implementation)
- ✅ Tests are deterministic (no random failures)
- ✅ Traces generated for debugging (artifacts uploaded)

**Failure Handling**:

- ❌ **BLOCKING**: PR cannot merge if E2E tests fail
- 🔧 **Fix Required**: Fix code or fix flaky test
- 📊 **Trace Available**: Download Playwright trace for debugging

---

### 5.2 Integration Test Gate

**Workflow**: `.github/workflows/integration-tests.yml`  
**Duration**: ~4 minutes  
**Coverage**: 9 API validation tests

**Test Categories**:
| Category | Tests | Coverage |
| --------------- | ----- | --------------------------- |
| Public Proxy | 3 | Pages, assets, subscribers |
| Private Proxy | 3 | Authenticated endpoints |
| Webhooks | 2 | Strapi webhooks |
| SSR Rendering | 1 | Server-side rendering |

**Success Criteria**:

- ✅ **100% pass rate**
- ✅ Tests run in <5 minutes
- ✅ Force trace generation (always upload artifacts)

**Standards**:

- ✅ Tests validate real API integration
- ✅ Tests use MSW bridge for orchestration
- ✅ Tests check response structure, status codes, headers
- ✅ Traces generated even on pass (for debugging slow tests)

**Enforcement**: ❌ **BLOCKING** - PR cannot merge if integration tests fail

---

### 5.3 Visual Regression Test Gate

**Workflow**: `.github/workflows/visual-regression.yml`  
**Duration**: ~3 minutes  
**Tool**: Chromatic (Storybook-based)

**Coverage**:

- Component library (atoms, molecules, organisms)
- Theme variations (light/dark modes)
- Responsive breakpoints (mobile, tablet, desktop)

**Success Criteria**:

- ✅ No unintended visual changes
- ✅ Visual changes reviewed and approved
- ✅ Baseline updated after approval

**Failure Handling**:

- ⚠️ **REVIEW REQUIRED**: Visual changes must be intentional
- ✅ **Approval Process**: Team lead reviews and approves
- 🔄 **Baseline Update**: Accept changes to update baseline

**Enforcement**: ⚠️ **OPTIONAL** - Visual regression failures don't block merge (manual review)

---

## 6. Performance Quality Gates

### 6.1 Lighthouse Performance Budget

**Workflow**: `.github/workflows/lighthouse.yml`  
**Duration**: ~20 minutes  
**Triggers**: UI changes only

**Performance Budgets**:

| Metric                  | Target | Minimum | Current (Jan 2026) |
| ----------------------- | ------ | ------- | ------------------ |
| **Performance Score**   | 95+    | 90      | 94-97              |
| **Accessibility Score** | 100    | 95      | 100                |
| **Best Practices**      | 100    | 95      | 100                |
| **SEO Score**           | 100    | 95      | 100                |

**Core Web Vitals**:

| Metric                  | Good   | Needs Improvement | Poor   | Current |
| ----------------------- | ------ | ----------------- | ------ | ------- |
| **LCP** (Load)          | <2.5s  | 2.5s - 4.0s       | >4.0s  | ~1.8s   |
| **FID** (Interactivity) | <100ms | 100ms - 300ms     | >300ms | ~50ms   |
| **CLS** (Stability)     | <0.1   | 0.1 - 0.25        | >0.25  | ~0.05   |

**Enforcement**:

- ⚠️ **Warning**: Performance score <90 (doesn't block)
- 🚨 **Blocking**: Performance score <80 (investigate)
- ✅ **Target**: Performance score >95

**Failure Handling**:

- 📊 **Report**: Lighthouse generates detailed report
- 🔍 **Investigate**: Identify bottlenecks (images, JS bundles, fonts)
- 🔧 **Optimize**: Implement optimizations, re-run Lighthouse

---

### 6.2 Bundle Size Budget

**Tool**: Next.js built-in bundle analyzer

**Budgets**:

| Bundle            | Target    | Maximum   | Current   |
| ----------------- | --------- | --------- | --------- |
| **First Load JS** | <150 KB   | <200 KB   | ~140 KB   |
| **Page JS**       | <50 KB    | <100 KB   | ~30-60 KB |
| **Total CSS**     | <50 KB    | <75 KB    | ~45 KB    |
| **Images (Lazy)** | On-demand | On-demand | ✅        |

**Enforcement**:

- ⚠️ **Warning**: Bundle size increased >10%
- 🚨 **Blocking**: Bundle size exceeds maximum
- ✅ **Report**: Bundle analysis on every build

**Failure Handling**:

- 🔍 **Analyze**: Use `@next/bundle-analyzer`
- 🔧 **Optimize**: Code splitting, dynamic imports, tree shaking
- 📝 **Document**: Justify size increase if necessary

---

## 7. Security Quality Gates

### 7.1 Dependency Vulnerability Scanning

**Tool**: GitHub Dependabot + Yarn Audit

**Automated Actions**:

- ✅ Daily scans for vulnerabilities
- ✅ Auto-create PRs for security patches
- ✅ Auto-merge patch updates (if tests pass)

**Severity Handling**:

| Severity | Action                              | Timeline  |
| -------- | ----------------------------------- | --------- |
| Critical | 🚨 Immediate fix, block deployments | <24 hours |
| High     | ⚠️ Fix ASAP, create issue           | <1 week   |
| Moderate | 📝 Schedule fix, create issue       | <1 month  |
| Low      | ℹ️ Fix when convenient              | <3 months |

**Enforcement**: 🚨 Critical/High vulnerabilities block production deployments

---

### 7.2 Secret Scanning

**Tool**: GitHub Secret Scanning + Git Hooks

**Scanned for**:

- API keys, tokens, passwords
- AWS, GCP, Azure credentials
- Database connection strings
- Private keys, certificates

**Enforcement**:

- 🚨 **Immediate Alert**: Email to repo admins
- ❌ **Block Commit**: Pre-commit hook prevents commit
- 🔧 **Remediation**: Rotate secret, remove from history

---

### 7.3 Code Security Analysis

**Tool**: ESLint security plugins + CodeQL (optional)

**Checks**:

- ✅ SQL injection risks
- ✅ XSS vulnerabilities
- ✅ Insecure dependencies
- ✅ Hardcoded secrets
- ✅ Unsafe eval() usage

**Enforcement**: ⚠️ Security warnings must be reviewed (don't auto-block)

---

## 8. Code Review Quality Standards

### 8.1 Review Requirements

**Minimum Requirements**:

- ✅ **1+ approvals** (small teams)
- ✅ **2+ approvals** (large teams or critical changes)
- ✅ **All CI checks passing**
- ✅ **No unresolved comments**

**Review Checklist** (for reviewers):

**Code Quality** (30%):

- [ ] Follows existing patterns
- [ ] No obvious bugs
- [ ] Error handling appropriate
- [ ] Complexity reasonable

**Testing** (30%):

- [ ] Tests cover new functionality
- [ ] Tests are meaningful
- [ ] Edge cases considered
- [ ] No flaky tests

**Documentation** (20%):

- [ ] README updated if needed
- [ ] Complex logic explained
- [ ] API changes documented

**Performance** (10%):

- [ ] No performance regressions
- [ ] Images optimized
- [ ] No blocking operations

**Security** (10%):

- [ ] No security vulnerabilities
- [ ] Input validation present
- [ ] Authentication/authorization correct

---

### 8.2 Review Speed SLA

| PR Size          | First Review | Approval  | Merge     |
| ---------------- | ------------ | --------- | --------- |
| Tiny (<50 LOC)   | <1 hour      | <2 hours  | <4 hours  |
| Small (<100 LOC) | <2 hours     | <4 hours  | <8 hours  |
| Medium (100-500) | <4 hours     | <8 hours  | <24 hours |
| Large (500-1000) | <8 hours     | <24 hours | <48 hours |
| XL (>1000 LOC)   | <24 hours    | <48 hours | <1 week   |

**Expedited Review**: Add "urgent" label for critical fixes

---

## 9. Documentation Quality Standards

### 9.1 Code Documentation

**Standards**:

- ✅ JSDoc for public APIs
- ✅ Inline comments for complex logic (why, not what)
- ✅ README for each major feature
- ✅ TypeScript types as documentation

**Example**:

```typescript
/**
 * Fetches user data from Strapi API
 * @param userId - The unique identifier for the user
 * @returns Promise resolving to user data or null if not found
 * @throws {Error} If API request fails
 */
async function fetchUser(userId: string): Promise<User | null> {
  // Implementation...
}
```

---

### 9.2 Technical Documentation

**Requirements**:

- ✅ README in every directory
- ✅ Architecture diagrams for complex systems
- ✅ Setup/installation instructions
- ✅ Troubleshooting common issues

**Documentation Locations**:

- `docs/` - Main documentation
- `README.md` - Project/workspace overview
- Inline - Complex code explanation

---

## 10. Monitoring & Observability Standards

### 10.1 Error Monitoring

**Tool**: Sentry (optional, or equivalent)

**Requirements**:

- ✅ Error tracking in production
- ✅ Source maps uploaded for debugging
- ✅ Error alerts to team channels
- ✅ Error rate <0.1% of requests

---

### 10.2 Performance Monitoring

**Tool**: New Relic, Datadog, or built-in Next.js analytics

**Requirements**:

- ✅ Response time tracking
- ✅ Database query performance
- ✅ API endpoint latency
- ✅ Core Web Vitals monitoring

---

## Quality Metrics Dashboard

**Track these metrics to measure quality**:

| Metric                          | Target   | Current (Jan 2026) | Trend          |
| ------------------------------- | -------- | ------------------ | -------------- |
| **CI Success Rate**             | >95%     | 95%+               | ✅ Stable      |
| **Test Coverage (E2E)**         | >80%     | 64 tests           | ✅ Good        |
| **Test Coverage (Integration)** | >70%     | 9 tests            | ✅ Good        |
| **PR Review Time (median)**     | <4 hours | ~2-3 hours         | ✅ Great       |
| **Build Time**                  | <10 min  | ~5 min             | ✅ Great       |
| **Deployment Frequency**        | Daily    | Multiple/day       | ✅ Excellent   |
| **Mean Time to Recovery**       | <1 hour  | ~35s               | ✅ Outstanding |
| **Change Failure Rate**         | <5%      | <1%                | ✅ Excellent   |
| **Performance Score**           | >95      | 94-97              | ✅ Great       |
| **Bundle Size**                 | <150 KB  | ~140 KB            | ✅ Good        |

---

## Enforcement Summary

### Blocking Gates (Must Pass)

- ❌ Format check (Prettier)
- ❌ Lint check (ESLint)
- ❌ Build verification (TypeScript)
- ❌ Test execution (E2E + Integration)
- ❌ CI checks (GitHub Actions)
- ❌ Code review approval (1+ reviewers)
- ❌ Critical/High vulnerabilities

### Warning Gates (Review Required)

- ⚠️ Visual regression changes
- ⚠️ Performance score <90
- ⚠️ Bundle size increase >10%
- ⚠️ Moderate/Low vulnerabilities
- ⚠️ ESLint warnings

### Optional Gates (Best Practice)

- ℹ️ Conventional commit messages
- ℹ️ Documentation updates
- ℹ️ Code complexity metrics

---

## Related Documentation

- [Team Workflow Guide](./team-workflow-guide.md) - Complete development lifecycle
- [Problem-Solving Case Studies](./problem-solving-case-studies.md) - Learning from incidents
- [Best Practice Checklist](../../06-workflows/best-practice-checklist.md) - Pre-implementation checklist
- [CI/CD Deep Dive](../../08-devops/CI-CD-DEEP-DIVE.md) - Pipeline architecture

---

**Status**: ✅ Production-ready  
**Last Updated**: January 1, 2026  
**Next Review**: April 1, 2026
