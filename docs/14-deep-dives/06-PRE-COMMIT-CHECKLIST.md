# ✅ Pre-Commit Checklist: Testing & Git Finalization

**Purpose**: Ensure quality before committing major milestones  
**Time**: 30-45 minutes  
**Use When**: Completing major features, preparing for deployment, end of development phase

---

## 📋 Overview

This checklist ensures your code is production-ready before committing to Git. Use this for major milestones like:

- Phase 3 completion (all deep-dive documentation)
- New feature releases
- Production deployments
- Team handoffs

**Philosophy**: Catch issues locally, not in production.

---

## 🧪 Part 1: Automated Testing (15 minutes)

### Step 1: Run Type Checking

```powershell
# From monorepo root
yarn typecheck

# Expected output:
# ✓ apps/strapi: No TypeScript errors
# ✓ apps/ui: No TypeScript errors
# ✓ packages/*: No TypeScript errors
```

**If errors appear**:

```powershell
# View detailed errors
cd apps/strapi
yarn tsc --noEmit

# Common fixes:
# 1. Missing types: yarn add -D @types/package-name
# 2. Type mismatch: Update interface definitions
# 3. Unused imports: Remove or comment out
```

**Checklist**:

- [ ] No TypeScript errors in apps/strapi
- [ ] No TypeScript errors in apps/ui
- [ ] No TypeScript errors in packages
- [ ] All type definitions up to date

---

### Step 2: Run Linting

```powershell
# Lint all workspaces
yarn lint

# Expected output:
# ✓ apps/strapi: ESLint passed
# ✓ apps/ui: ESLint passed
# ✓ packages/*: ESLint passed
```

**If warnings/errors appear**:

```powershell
# Auto-fix issues
yarn lint:fix

# Manual review remaining issues
yarn lint --quiet  # Only show errors
```

**Common Issues**:

```typescript
// ❌ Unused variables
const unusedVar = "test"

// ✓ Fix: Remove or prefix with _
const _unusedVar = "test" // Explicitly unused

// ❌ Missing dependencies in useEffect
useEffect(() => {
  fetchData(userId)
}, []) // Missing userId

// ✓ Fix: Add to dependency array
useEffect(() => {
  fetchData(userId)
}, [userId])
```

**Checklist**:

- [ ] No ESLint errors
- [ ] Warnings reviewed and justified
- [ ] Auto-fix applied where appropriate
- [ ] Code follows style guidelines

---

### Step 3: Run Formatting Check

```powershell
# Check formatting
yarn format:check

# Expected output:
# Checking formatting...
# All matched files use Prettier code style!
```

**If formatting issues**:

```powershell
# Auto-format all files
yarn format

# Verify formatting fixed
yarn format:check
```

**Checklist**:

- [ ] All files formatted with Prettier
- [ ] Consistent code style across monorepo
- [ ] No manual formatting overrides

---

### Step 4: Build Verification

```powershell
# Build all apps and packages
yarn build

# Expected output:
# ✓ packages/shared-data built
# ✓ packages/design-system built
# ✓ apps/strapi built
# ✓ apps/ui built
```

**If build fails**:

```powershell
# Build individual workspace
cd apps/strapi
yarn build

# Check build logs for errors
# Common issues:
# 1. Missing dependencies
# 2. Import path errors
# 3. Build config issues
```

**Checklist**:

- [ ] Clean build successful (no cached artifacts)
- [ ] All workspaces build without errors
- [ ] Build output sizes reasonable
- [ ] No console warnings during build

---

## 📝 Part 2: Manual Testing (10 minutes)

### Strapi Backend Testing

```powershell
# Start Strapi
cd apps/strapi
yarn develop
```

**Test Checklist**:

- [ ] **Admin panel loads**: http://localhost:1337/admin
- [ ] **Content types visible**: All expected types in Content Manager
- [ ] **Create test entry**: Add sample blog post/page
- [ ] **API responds**: Visit http://localhost:1337/api/pages
- [ ] **Populate works**: Test with ?populate=\* parameter
- [ ] **No console errors**: Check browser dev tools
- [ ] **Database connected**: PostgreSQL container running

**API Test**:

```powershell
# Test API endpoint
Invoke-RestMethod -Uri "http://localhost:1337/api/pages" | ConvertTo-Json -Depth 10

# Verify response:
# ✓ data array present
# ✓ Correct structure
# ✓ No error messages
```

---

### Frontend Testing

```powershell
# Start UI (in separate terminal)
cd apps/ui
yarn dev
```

**Test Checklist**:

- [ ] **Homepage loads**: http://localhost:3000
- [ ] **No build errors**: Check terminal output
- [ ] **No console errors**: Check browser dev tools
- [ ] **Images load**: All media displays correctly
- [ ] **Navigation works**: Test all menu links
- [ ] **Responsive**: Test mobile/tablet/desktop views
- [ ] **Type safety**: No TypeScript errors in browser

**Browser Console Check**:

```javascript
// Should see no errors
// Acceptable warnings:
// - Next.js development warnings (image optimization, etc.)
// - Third-party library warnings (if documented)

// Red flags:
// ❌ Uncaught TypeError
// ❌ Failed to fetch
// ❌ Cannot read property of undefined
```

---

### Integration Testing

**Test Full Stack**:

- [ ] Create content in Strapi admin
- [ ] Content appears on frontend (may need refresh)
- [ ] Edit content in Strapi
- [ ] Changes reflect on frontend
- [ ] Delete content
- [ ] Frontend handles missing content gracefully

**Performance Check**:

- [ ] Page load < 3 seconds (development)
- [ ] No memory leaks (refresh 10x, memory stable)
- [ ] No excessive API calls (check Network tab)

---

## 📚 Part 3: Documentation Review (5 minutes)

### Documentation Checklist

**New Code**:

- [ ] **JSDoc comments**: Complex functions documented
- [ ] **README updates**: New features listed
- [ ] **Component docs**: Usage examples provided
- [ ] **API docs**: Endpoints documented

**Example**:

```typescript
/**
 * Fetches paginated blog posts with optional filtering
 *
 * @param options - Query options
 * @param options.page - Page number (1-indexed)
 * @param options.pageSize - Items per page (default: 10)
 * @param options.filters - Strapi filter object
 * @returns Promise resolving to paginated blog posts
 *
 * @example
 * const posts = await getBlogPosts({ page: 1, pageSize: 10 })
 */
export async function getBlogPosts(options: BlogPostOptions) {
  // ...
}
```

**Breaking Changes**:

- [ ] **CHANGELOG updated**: Breaking changes documented
- [ ] **Migration guide**: If schema/API changes
- [ ] **Team notified**: Slack/email for major changes

---

## 🔍 Part 4: Git Preparation (5 minutes)

### Git Status Review

```powershell
# Check what's changed
git status

# Review changes
git diff

# Stage changes selectively
git add apps/strapi/src/
git add docs/14-deep-dives/
```

**Review Checklist**:

- [ ] No debug code (console.log, debugger)
- [ ] No commented-out code (unless documented why)
- [ ] No temporary files (.DS_Store, \*.log)
- [ ] No sensitive data (.env files, API keys)
- [ ] Only intended changes staged

**Clean Up**:

```powershell
# Remove debug statements
git diff | Select-String "console.log"  # Should return nothing

# Check for secrets
git diff | Select-String "password|secret|key"  # Review any matches

# Unstage unintended files
git reset HEAD unwanted-file.txt
```

---

### Commit Message Preparation

**Conventional Commit Format**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**For Major Milestone** (like Phase 3 completion):

```bash
git commit -m "docs(deep-dives): complete technical documentation phase

Major additions:
- Strapi 5 mastery series (4 articles: beginner → best practices)
- Docker containerization guides (2 articles: fundamentals → production)
- Complete transformation journey review
- Pre-commit testing & Git finalization guide

Value documented: $530K (3 years)
Learning time: 390 minutes of structured content
Code examples: 150+ real implementations
Diagrams: 24 Mermaid visualizations

Articles created:
- 01-BEGINNER.md (45 min, setup & basics)
- 02-INTERMEDIATE.md (60 min, dynamic zones & populate middleware)
- 03-ADVANCED.md (75 min, performance & security)
- 04-BEST-PRACTICES.md (90 min, strategic patterns & team workflows)
- docker/01-FUNDAMENTALS.md (50 min, local development)
- docker/02-PRODUCTION.md (70 min, multi-stage builds & deployment)
- 05-TRANSFORMATION-JOURNEY.md (45 min, complete evolution story)

Impact:
- Component architecture: $32,500/year
- Config sync automation: $58,400/year
- Type generation: $12,000/year
- Performance optimization: 94% faster (8.3s → 480ms)
- Docker optimization: 73% smaller images (1.8GB → 477MB)
- Team velocity: 6x multiplication

Breaking changes: None
Migrations required: None

Resolves: Phase 3 completion milestone"
```

**Commit Types**:

```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting (no code change)
refactor: Code restructure (no functionality change)
perf:     Performance improvement
test:     Adding tests
chore:    Maintenance (dependency updates, etc.)
```

---

## 🚀 Part 5: Final Verification (5 minutes)

### Pre-Push Checklist

**Local Verification**:

- [ ] All tests pass: `yarn test` (if tests exist)
- [ ] Type checking passes: `yarn typecheck`
- [ ] Linting passes: `yarn lint`
- [ ] Formatting correct: `yarn format:check`
- [ ] Build succeeds: `yarn build`
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] Git commit message prepared

**Monorepo Health**:

```powershell
# Verify monorepo integrity
yarn workspaces info

# Check for dependency issues
yarn check --integrity

# Clean install test
rm -rf node_modules
yarn
yarn build
```

**Checklist**:

- [ ] No dependency conflicts
- [ ] Lockfile up to date (yarn.lock)
- [ ] All workspaces resolvable
- [ ] Clean install successful

---

### Push to Remote

```powershell
# Create feature branch (if not on main)
git checkout -b docs/phase-3-completion

# Push to remote
git push origin docs/phase-3-completion

# Create Pull Request (if using PR workflow)
# Or merge to main (if direct commit workflow)
```

**Post-Push Verification**:

- [ ] CI/CD pipeline passes (if configured)
- [ ] No broken links in documentation
- [ ] Team notified of major changes

---

## 📊 Quality Metrics

### Code Quality Indicators

**✅ Good Indicators**:

```
✓ Zero TypeScript errors
✓ Zero ESLint errors
✓ Build time < 5 minutes
✓ All tests passing
✓ Test coverage > 70% (if measured)
✓ No console errors in browser
✓ Page load < 3 seconds (dev)
```

**⚠️ Warning Signs**:

```
⚠ TypeScript "any" usage increased
⚠ Build warnings accumulating
⚠ Skipped tests
⚠ Console warnings in production code
⚠ Large bundle size increases
⚠ Memory usage growing
```

**🚨 Red Flags**:

```
🚨 TypeScript errors ignored
🚨 ESLint rules disabled
🚨 Tests commented out
🚨 Production errors in logs
🚨 Security vulnerabilities in dependencies
🚨 Secrets committed to Git
```

---

## 🎯 Quick Reference: Pre-Commit Commands

```powershell
# Complete pre-commit verification (run from root)

# 1. Type checking
yarn typecheck

# 2. Linting
yarn lint

# 3. Formatting
yarn format:check

# 4. Build
yarn build

# 5. Git status
git status
git diff

# 6. Stage changes
git add .

# 7. Commit
git commit -m "type(scope): description"

# 8. Push
git push origin branch-name
```

**Time**: 5-10 minutes for routine commits, 30-45 minutes for major milestones

---

## 💡 Tips for Efficient Verification

### Speed Up Repeated Checks

**Use Git Hooks**:

```bash
# .husky/pre-commit
#!/bin/sh
yarn typecheck
yarn lint
yarn format:check

# Only commits if all pass
```

**Cache Builds**:

```powershell
# Turbo caches builds automatically
# Only rebuilds changed workspaces
yarn build  # Fast on repeated runs
```

**Parallel Execution**:

```powershell
# Run checks in parallel (PowerShell)
Start-Job { yarn typecheck }
Start-Job { yarn lint }
Start-Job { yarn format:check }

# Wait for all to complete
Get-Job | Wait-Job | Receive-Job
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Type errors in generated files"

**Error**: `node_modules/@types/...` has errors

**Fix**:

```powershell
# Regenerate types
cd apps/strapi
yarn strapi ts:generate-types

# Clear type cache
rm -rf node_modules/.cache
```

---

### Issue 2: "Lint errors in dependencies"

**Error**: ESLint complaining about `node_modules` files

**Fix**: Update `.eslintignore`

```
node_modules/
.next/
.strapi/
dist/
build/
```

---

### Issue 3: "Build succeeds locally, fails in CI"

**Causes**:

1. Different Node.js version
2. Missing environment variables
3. Platform-specific dependencies

**Fix**:

```powershell
# Match CI Node version
nvm use 22

# Clean install (CI behavior)
rm -rf node_modules
yarn install --frozen-lockfile

# Build
yarn build
```

---

## 📚 Related Documentation

- [Git Strategy](../workflows-automation/01-GIT-STRATEGY.md) - Branching and commit conventions
- [CI/CD Pipeline](../workflows-automation/02-CI-CD-PIPELINE.md) - Automated testing
- [Testing Strategy](../workflows-automation/03-TESTING-STRATEGY.md) - Test types and coverage
- [Component Workflow](../../COMPONENT_WORKFLOW.md) - Development process

---

## 🎓 Conclusion

**Pre-commit verification prevents**:

- Production bugs (type errors, build failures)
- Team friction (broken builds, merge conflicts)
- Technical debt (accumulating warnings, skipped tests)
- Security issues (committed secrets, vulnerabilities)

**Investment**: 30-45 minutes per major milestone  
**Return**: Zero production incidents from preventable issues  
**ROI**: Priceless

**Remember**: The best bug is the one that never makes it to production.

---

## ✅ Final Checklist Summary

**Before Committing**:

```
□ yarn typecheck (no errors)
□ yarn lint (no errors)
□ yarn format:check (all formatted)
□ yarn build (successful)
□ Manual testing (apps run correctly)
□ Documentation updated
□ Git status reviewed (no unintended files)
□ Commit message prepared (conventional format)
□ Breaking changes documented (if any)
□ Team notified (if major changes)
```

**You're ready to commit when all boxes are checked.** ✅

---

**Last Updated**: December 1, 2025  
**Guide**: Pre-Commit Checklist - Testing & Git Finalization  
**Part of**: [Deep Dives - Technical Mastery](./README.md)
