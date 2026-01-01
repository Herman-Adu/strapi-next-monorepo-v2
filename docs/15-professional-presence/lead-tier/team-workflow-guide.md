# Team Workflow Guide

**Last Updated**: January 1, 2026  
**Audience**: Engineering leads, team leads, senior developers  
**Purpose**: Complete development lifecycle from branch creation to production deployment

---

## Overview

This guide documents our complete development workflow—the path every feature, fix, and improvement takes from idea to production. It's designed for team leads onboarding new developers and for establishing consistent practices across engineering teams.

**Key Principles**:

- 🎯 **Main branch always deployable** - Never break production
- 🔒 **Feature branches for all work** - No direct commits to main
- ✅ **Local validation before commit** - Catch issues early
- 🤖 **CI/CD validates everything** - Automated quality gates
- 👥 **Code review required** - Knowledge sharing and quality

---

## The Complete Development Lifecycle

### Phase 1: Branch Creation & Setup

#### Step 1: Create Feature Branch

```bash
# For new features
git checkout -b feature/descriptive-name

# For bug fixes
git checkout -b fix/issue-description

# For documentation
git checkout -b docs/what-youre-documenting

# For refactoring
git checkout -b refactor/what-youre-improving

# For testing
git checkout -b test/what-youre-testing
```

**Branch Naming Rules**:

- ✅ Use lowercase and hyphens (kebab-case)
- ✅ Use meaningful prefixes (`feature/`, `fix/`, `docs/`, `refactor/`, `test/`)
- ✅ Keep names concise but descriptive (`feature/add-contact-form`, not `feature/form`)
- ❌ Never work directly on `main`
- ❌ Don't include issue numbers in branch names (use in commit messages)

**Example Good Names**:

```
feature/add-newsletter-subscription
fix/contact-form-validation-error
docs/update-testing-guide
refactor/simplify-api-routes
test/add-homepage-e2e-tests
```

---

### Phase 2: Development & Local Testing

#### Step 2: Environment Verification

**Before starting development, verify clean environment**:

```bash
# Check Docker is running
docker ps

# Verify Strapi running clean on port 1337
curl http://localhost:1337/_health

# Verify Next.js running clean on port 3000
curl http://localhost:3000
```

**Expected State**:

- ✅ Docker containers running (PostgreSQL if using Docker setup)
- ✅ Strapi responding on http://localhost:1337 (no errors in console)
- ✅ Next.js responding on http://localhost:3000 (no errors in console)
- ✅ No port conflicts
- ✅ Environment variables loaded (.env files present)

**If environment is not clean**:

1. Stop all servers
2. Clear any port locks (`npx kill-port 1337 3000`)
3. Restart services with `yarn dev` from monorepo root
4. Wait for health check confirmation

---

#### Step 3: Develop

**Development Best Practices**:

1. **Small, Focused Changes**

   - One feature/fix per branch
   - Break large features into smaller PRs
   - Easier to review and test

2. **Test As You Go**

   - Write tests alongside code (not after)
   - Run relevant tests frequently
   - Fix broken tests immediately

3. **Follow Existing Patterns**

   - Match code style of surrounding code
   - Use established patterns from docs/04-components/
   - Reference docs/02-architecture/ for design patterns

4. **Document Complex Logic**
   - Add inline comments for "why", not "what"
   - Update README if adding new features
   - Create or update relevant docs/

---

#### Step 4: Local Testing (MANDATORY)

**Run ALL relevant tests before committing**:

```bash
# E2E tests (user behavior tests with MSW)
yarn workspace @repo/ui playwright test tests/e2e/

# Integration tests (API validation)
yarn workspace @repo/ui playwright test tests/integration/

# Specific test file
yarn workspace @repo/ui playwright test tests/e2e/contact-form.spec.ts

# Run in UI mode for debugging
yarn workspace @repo/ui playwright test --ui
```

**All tests MUST pass before proceeding.**

**If tests fail**:

1. Read the error message carefully
2. Check if you broke existing functionality
3. Fix the code or update the test (if test is outdated)
4. Never commit failing tests
5. Reference docs/13-testing/ for testing patterns

---

#### Step 5: Build Verification (MANDATORY)

**Ensure code compiles without errors**:

```bash
# Build everything
yarn build

# Or build specific app
yarn workspace @repo/ui build
yarn workspace @repo/strapi build
```

**Build MUST succeed with zero TypeScript errors.**

**Common build failures**:

- TypeScript type errors (`Type 'X' is not assignable to type 'Y'`)
- Missing imports
- Incorrect Next.js App Router usage
- Strapi plugin configuration errors

**Fix ALL build errors before committing.**

---

### Phase 3: Pre-Commit Validation

#### Step 6: Format Code

```bash
# Format all files with Prettier
yarn format
```

**This will**:

- Auto-format all `.ts`, `.tsx`, `.js`, `.jsx`, `.md`, `.css`, `.scss` files
- Organize imports with `@trivago/prettier-plugin-sort-imports`
- Apply consistent code style across the monorepo

**Expected output**: `Checking formatting...` → `All matched files use Prettier code style!`

---

#### Step 7: Lint Code

```bash
# Run ESLint on all workspaces
yarn lint
```

**This validates**:

- ESLint rules (Next.js, React, TypeScript)
- Code quality standards
- Import patterns
- Component structure

**All workspaces must pass** (Strapi + UI)

**If lint fails**: Fix the issues or add `// eslint-disable-next-line rule-name` with justification comment

---

#### Step 8: Final Pre-Commit Checklist

Before committing, verify:

- [ ] ✅ All tests passing (`yarn test`)
- [ ] ✅ Build successful (`yarn build`)
- [ ] ✅ Code formatted (`yarn format`)
- [ ] ✅ Lint clean (`yarn lint`)
- [ ] ✅ No console.log/debugger statements (unless intentional)
- [ ] ✅ Environment still clean (no hanging processes)

**Once all checks pass, you're ready to commit.**

---

### Phase 4: Commit & Push

#### Step 9: Commit with Conventional Commits

```bash
# Stage all changes
git add .

# Commit with conventional commit message
git commit -m "feat: add newsletter subscription form" --no-verify

# Or without --no-verify if you want Husky to run
git commit -m "feat: add newsletter subscription form"
```

**Commit Message Format** (Conventional Commits):

```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring (no behavior change)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, configs)
- `perf`: Performance improvements
- `style`: Code style changes (formatting, no logic change)

**Examples**:

```
feat(contact): add email validation to contact form
fix(newsletter): resolve GDPR checkbox not clickable
docs(testing): update MSW testing guide
refactor(api): simplify Strapi proxy route logic
test(e2e): add homepage hero section tests
chore(deps): update Playwright to 1.49.0
perf(images): implement lazy loading for all images
```

**Why `--no-verify`?**

We use `--no-verify` to bypass Husky pre-commit hooks because:

- ✅ We've already run all checks manually (format, lint, build, test)
- ✅ Husky hooks can fail unpredictably on edge cases
- ✅ Manual validation is faster (no hook overhead)
- ✅ Documented in docs/06-workflows/PRE_COMMIT_VALIDATION_WORKFLOW.md

**Husky hooks would duplicate work we've already done.**

---

#### Step 10: Push to Remote

```bash
# Push feature branch to remote
git push origin feature/your-branch-name

# If first push, set upstream
git push -u origin feature/your-branch-name
```

**After pushing**, GitHub Actions CI/CD will automatically:

1. Run lint checks
2. Build all apps
3. Run E2E tests (if triggered)
4. Run integration tests
5. Run visual regression (if UI changes)
6. Report results on PR

---

### Phase 5: Pull Request & Code Review

#### Step 11: Create Pull Request

**On GitHub**:

1. Navigate to repository
2. Click "Pull requests" → "New pull request"
3. Select your branch → compare with `main`
4. Fill out PR template (if exists)

**PR Description Should Include**:

```markdown
## What This PR Does

Brief description of the feature/fix

## Changes Made

- Added newsletter subscription form component
- Implemented email validation with Zod
- Added E2E tests for subscription flow
- Updated Strapi schema with subscriber content type

## Testing

- [x] E2E tests passing (55/55)
- [x] Integration tests passing (9/9)
- [x] Manual testing on localhost
- [x] Build successful

## Related Issues

Closes #123

## Screenshots (if UI changes)

[Attach screenshots or GIF]

## Deployment Notes

- Requires Strapi schema migration
- New environment variable: NEWSLETTER_API_KEY
```

---

#### Step 12: Code Review Process

**Required Approvals**: 1+ reviewer (for small teams) or 2+ (for larger teams)

**Review Checklist** (for reviewers):

**Code Quality**:

- [ ] Code follows existing patterns
- [ ] No obvious bugs or security issues
- [ ] Error handling appropriate
- [ ] Comments explain complex logic

**Testing**:

- [ ] Tests cover new functionality
- [ ] Tests are meaningful (not just coverage)
- [ ] Edge cases considered

**Documentation**:

- [ ] README updated if needed
- [ ] Inline comments for complex code
- [ ] API changes documented

**Performance**:

- [ ] No unnecessary re-renders (React)
- [ ] No N+1 queries (Strapi)
- [ ] Images optimized
- [ ] No blocking operations

**CI/CD**:

- [ ] All CI checks passing (green checkmarks)
- [ ] No new warnings in build logs
- [ ] Performance budgets met (Lighthouse)

---

#### Step 13: Address Review Comments

**Responding to Feedback**:

1. **Read Carefully**: Understand the concern before responding
2. **Discuss If Unclear**: Ask questions if feedback is ambiguous
3. **Make Changes**: Address valid concerns with code updates
4. **Respond**: Reply to each comment (resolved, implemented, or discussed)
5. **Push Updates**: Commit and push changes to same branch

```bash
# Make changes based on feedback
# ...

git add .
git commit -m "refactor: address PR review comments" --no-verify
git push origin feature/your-branch-name
```

**CI/CD will re-run automatically on new commits.**

---

### Phase 6: Merge & Deploy

#### Step 14: Merge Pull Request

**Merge Strategies** (choose one):

1. **Squash and Merge** (Recommended)

   - Combines all commits into one
   - Clean, linear history
   - Easier to revert if needed
   - Use for: Most PRs

2. **Merge Commit**

   - Preserves all commits
   - Shows branching history
   - Use for: Large features with meaningful commit history

3. **Rebase and Merge**
   - Replays commits on main
   - Linear history without merge commit
   - Use for: Small PRs with clean commit history

**Merge Checklist**:

- [ ] All CI checks passing ✅
- [ ] Required approvals received ✅
- [ ] No merge conflicts
- [ ] Ready for production

**Click "Squash and merge"** (or chosen strategy)

---

#### Step 15: Post-Merge Actions

**Automatic Actions** (via GitHub Actions):

- Build verification on main
- Run E2E tests (if configured)
- Deploy to staging (if configured)
- Deploy to production (if auto-deploy enabled)

**Manual Actions**:

1. **Delete Feature Branch** (GitHub will prompt)

   ```bash
   git checkout main
   git pull origin main
   git branch -d feature/your-branch-name
   ```

2. **Verify Deployment** (if applicable)

   - Check staging environment
   - Run smoke tests
   - Monitor error logs

3. **Update Project Board** (if using)
   - Move issue to "Done"
   - Add "deployed" label

---

### Phase 7: Monitoring & Rollback

#### Step 16: Monitor Production

**After merge/deploy**, monitor:

- **Error Logs**: Check Sentry, CloudWatch, or application logs
- **Performance**: Check response times, Core Web Vitals
- **User Reports**: Monitor support channels for issues
- **CI/CD**: Ensure no regression in subsequent builds

**Monitoring Period**: At least 1 hour after deploy, 24 hours for major changes

---

#### Step 17: Rollback (If Needed)

**If critical issue detected**:

1. **Immediate Rollback**:

   ```bash
   # Revert the merge commit
   git revert -m 1 <merge-commit-hash>
   git push origin main
   ```

2. **Or Create Hotfix**:

   ```bash
   git checkout -b hotfix/critical-issue
   # Fix the issue
   git commit -m "hotfix: fix critical issue"
   git push origin hotfix/critical-issue
   # Create PR, fast-track review, merge
   ```

3. **Communicate**:
   - Notify team in Slack/Teams
   - Update incident log
   - Document in post-mortem

---

## Environment Management

### Local Development

```bash
# Start all services
yarn dev

# Start specific service
yarn workspace @repo/strapi dev
yarn workspace @repo/ui dev

# Run with specific port
PORT=3001 yarn workspace @repo/ui dev
```

**Environment Variables** (.env files):

- `.env.local` - Local development (not committed)
- `.env.test` - Test environment (committed)
- `.env.production` - Production (secrets in environment)

---

### CI/CD Environment

**GitHub Actions** automatically:

- Sets up Node.js 22
- Installs dependencies (`yarn --frozen-lockfile`)
- Runs all quality gates
- Caches dependencies and builds (Turbo)

**Environment Variables in CI**:

- Set in GitHub Secrets
- Available to workflows
- Never logged or exposed

---

### Staging Environment (Optional)

**Purpose**: Pre-production validation

- Same stack as production
- Real database (separate from production)
- Real API keys (separate from production)
- Manual or automatic deployment after PR merge

---

### Production Environment

**Deployment Triggers**:

- Automatic: On merge to main (if configured)
- Manual: GitHub Actions workflow dispatch
- Tagged releases: On version tags (v1.0.0)

**Pre-Deployment Checklist**:

- [ ] All tests passing
- [ ] Staging validated
- [ ] Database migrations ready (if applicable)
- [ ] Environment variables configured
- [ ] Rollback plan documented
- [ ] Team notified

---

## Code Review Standards

### Review Speed Expectations

| PR Size          | First Review | Approval  |
| ---------------- | ------------ | --------- |
| Small (<100 LOC) | <2 hours     | <4 hours  |
| Medium (100-500) | <4 hours     | <8 hours  |
| Large (>500 LOC) | <8 hours     | <24 hours |

**If PR is urgent**: Add "urgent" label and notify reviewers

---

### Review Quality Guidelines

**For Reviewers**:

1. **Understand the Context**: Read PR description and related issues
2. **Test Locally**: Checkout branch and test if complex
3. **Be Constructive**: Suggest improvements, don't just criticize
4. **Be Specific**: Point to specific lines, provide examples
5. **Approve Quickly**: If no major concerns, approve and suggest minor improvements for future

**Review Comment Examples**:

❌ **Bad**: "This code is bad"  
✅ **Good**: "Consider using `Array.map()` instead of a for-loop for better readability"

❌ **Bad**: "Why did you do it this way?"  
✅ **Good**: "This could cause performance issues with large datasets. Have you considered using pagination?"

---

### Common Review Patterns

**Nitpicks** (minor, non-blocking):

```
nit: Consider renaming `getData` to `fetchUserData` for clarity
```

**Blocking Issues** (must be fixed):

```
⚠️ BLOCKING: This introduces a security vulnerability. Please use parameterized queries instead of string concatenation.
```

**Questions** (seeking clarification):

```
❓ QUESTION: What's the expected behavior when `user` is null?
```

**Suggestions** (improvements):

```
💡 SUGGESTION: We have a utility function `formatDate()` in `lib/dates.ts` that could simplify this
```

---

## Common Workflows

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop, test, validate
yarn test && yarn build && yarn format && yarn lint

# 3. Commit and push
git commit -m "feat: add new feature" --no-verify
git push origin feature/new-feature

# 4. Create PR, get review, merge
```

---

### Fixing a Bug

```bash
# 1. Create fix branch
git checkout -b fix/bug-description

# 2. Reproduce bug locally
# 3. Write failing test
# 4. Fix bug
# 5. Verify test passes

yarn test && yarn build

# 6. Commit and push
git commit -m "fix: resolve bug description" --no-verify
git push origin fix/bug-description

# 7. Create PR with reproduction steps
```

---

### Updating Documentation

```bash
# 1. Create docs branch
git checkout -b docs/update-testing-guide

# 2. Update documentation
# 3. Validate links (if using link checker)

yarn format

# 4. Commit and push
git commit -m "docs: update testing guide with MSW examples" --no-verify
git push origin docs/update-testing-guide

# 5. Create PR (no code review needed for simple docs)
```

---

### Emergency Hotfix

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# 2. Make minimal fix
# 3. Test thoroughly

yarn test && yarn build

# 4. Commit and push
git commit -m "hotfix: fix critical production issue" --no-verify
git push origin hotfix/critical-issue

# 5. Create PR, fast-track review
# 6. Merge immediately after approval
# 7. Monitor production closely
```

---

## Troubleshooting Workflow Issues

### "Build works locally but fails in CI"

**Common Causes**:

- Environment variable missing in GitHub Secrets
- Dependency version mismatch (check yarn.lock)
- Platform-specific code (Windows vs. Linux)
- Cache corruption (clear GitHub Actions cache)

**Solution**:

1. Check CI logs for specific error
2. Compare local Node version with CI (should match)
3. Verify GitHub Secrets configured
4. Try clearing Turbo cache: `yarn turbo clean`

---

### "Tests pass locally but fail in CI"

**Common Causes**:

- Timing issues (tests depend on specific timing)
- Port conflicts (CI uses different ports)
- Database state (CI starts with clean state)
- Flaky tests (intermittent failures)

**Solution**:

1. Check if test is flaky (run multiple times locally)
2. Increase timeouts if timing-related
3. Ensure tests clean up after themselves
4. Use MSW for deterministic API responses

---

### "PR blocked by failing checks"

**Steps**:

1. Click "Details" on failed check
2. Read error logs carefully
3. Reproduce locally if possible
4. Fix issue and push new commit
5. CI will re-run automatically

---

### "Merge conflicts"

**Resolution**:

```bash
# Update main branch locally
git checkout main
git pull origin main

# Switch to feature branch
git checkout feature/your-branch

# Merge main into feature branch
git merge main

# Resolve conflicts in editor
# ...

# Commit merge
git add .
git commit -m "merge: resolve conflicts with main"
git push origin feature/your-branch
```

---

## Best Practices Summary

### DO ✅

- ✅ Create feature branches for ALL work
- ✅ Test, build, format, and lint before commit
- ✅ Write meaningful commit messages (Conventional Commits)
- ✅ Keep PRs small and focused (<500 LOC when possible)
- ✅ Respond to review comments promptly
- ✅ Monitor production after deployment
- ✅ Document complex changes

### DON'T ❌

- ❌ Commit directly to main
- ❌ Commit failing tests or broken builds
- ❌ Skip code review (even for "simple" changes)
- ❌ Ignore CI failures ("it works on my machine")
- ❌ Leave hanging console.log or debugger statements
- ❌ Deploy on Friday evening (if possible)
- ❌ Merge without approval

---

## Metrics & Performance

**Workflow Efficiency Metrics** (track these):

| Metric               | Target    | Current (Jan 2026) |
| -------------------- | --------- | ------------------ |
| Time to First Commit | <30 min   | ~15 min (new devs) |
| PR Creation to Merge | <24 hours | ~4-6 hours         |
| CI Pipeline Duration | <20 min   | ~15 min (E2E)      |
| Code Review Time     | <4 hours  | ~2-3 hours         |
| Deployment Frequency | Daily     | Multiple/day       |
| CI Success Rate      | >95%      | 95%+               |
| Rollback Rate        | <5%       | <1%                |

---

## Related Documentation

- [Quality Gates & Standards](./quality-gates-standards.md) - Quality expectations and enforcement
- [Problem-Solving Case Studies](./problem-solving-case-studies.md) - Learning from incidents
- [Pre-Commit Validation Workflow](../../06-workflows/PRE_COMMIT_VALIDATION_WORKFLOW.md) - Technical details
- [Mandatory Workflow](../../06-workflows/MANDATORY-WORKFLOW.md) - Workflow source material
- [CI/CD Deep Dive](../../08-devops/CI-CD-DEEP-DIVE.md) - Complete pipeline architecture

---

**Status**: ✅ Production-ready  
**Last Updated**: January 1, 2026  
**Next Review**: April 1, 2026
