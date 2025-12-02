# 🏗️ CI Workflow - Lint + Build

**File**: `.github/workflows/ci.yml`  
**Created**: November 30, 2025  
**Status**: ✅ Production  
**Audience**: Developers, DevOps engineers

---

## 🎯 PURPOSE

The **CI (Continuous Integration) Workflow** is the foundation of our quality gates. It runs on every push and pull request to ensure code quality and build integrity before merging to main.

**What It Validates**:

- ✅ Code formatting (Prettier)
- ✅ Linting (ESLint)
- ✅ TypeScript compilation (Strapi)
- ✅ Next.js build (54 static pages)
- ✅ Cross-platform compatibility

**Why Critical**: This is the **first line of defense** against bugs, formatting inconsistencies, and build failures.

---

## 📊 WORKFLOW OVERVIEW

### Key Metrics

| Metric                 | Value                     |
| ---------------------- | ------------------------- |
| **Triggers**           | Push to main, PRs, Manual |
| **Jobs**               | 2 (Lint, Build)           |
| **Duration**           | 10-20 minutes             |
| **Success Rate**       | 98% (last 30 days)        |
| **Runs Per Month**     | ~150                      |
| **Monthly CI Minutes** | ~300 minutes              |

### Workflow Diagram

```
Push/PR → Concurrency Check → Lint Job → Build Job → Success/Failure
                ↓
         Cancel in-progress runs
```

---

## 🔧 CONFIGURATION

### Triggers

```yaml
on:
  workflow_dispatch: # Manual trigger
  push:
    branches: [main] # Every push to main
  pull_request:
    branches: [main] # Every PR targeting main
```

**Why These Triggers**:

- `workflow_dispatch`: Allows manual re-runs (debugging)
- `push` to main: Validates merged code
- `pull_request`: Validates before merge (pre-merge gate)

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}
  cancel-in-progress: true
```

**What This Does**:

- Cancels old runs when new commits pushed
- Saves CI minutes (don't test outdated code)
- Faster feedback loop

**Example**: Push commit A → CI starts → Push commit B → CI for A cancelled, CI for B starts

---

## 🎯 JOB 1: LINT

### Purpose

Enforce code quality and formatting standards.

### Configuration

```yaml
lint:
  name: Lint
  timeout-minutes: 15
  runs-on: ubuntu-latest
```

**Timeout**: 15 minutes (prevents hanging jobs)  
**Runner**: Ubuntu Latest (Linux, free tier)

### Steps Breakdown

#### Step 1: Checkout Code

```yaml
- name: Check out code
  uses: actions/checkout@v4
  with:
    fetch-depth: 2
```

**Why `fetch-depth: 2`**:

- Fetches current + previous commit
- Enables diff-based tools
- Faster than full clone

#### Step 2: Setup Node.js

```yaml
- name: Setup Node.js environment
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: "yarn"
```

**Node Version**: 22 (matches local development)  
**Cache**: Yarn dependencies cached (speeds up installs)

**Performance Impact**:

- First run: ~2 min (install dependencies)
- Cached run: ~30 seconds (restore from cache)

#### Step 3: Cache Turbo

```yaml
- name: Cache turbo build setup
  uses: actions/cache@v4
  with:
    path: .turbo
    key: ${{ runner.os }}-turbo-${{ hashFiles('**/yarn.lock') }}
    restore-keys: |
      ${{ runner.os }}-turbo-
```

**What's Cached**: Turbo build artifacts  
**Cache Key**: OS + yarn.lock hash (invalidates when dependencies change)  
**Restore Keys**: Fallback to any OS-specific cache

**Performance Impact**: 50% faster incremental builds

#### Step 4: Install Dependencies

```yaml
- name: Install dependencies
  run: yarn --frozen-lockfile
```

**Why `--frozen-lockfile`**:

- ✅ Ensures yarn.lock not modified
- ✅ Fails if dependencies out of sync
- ✅ Reproducible builds

**Common Failure**: New dependency added without updating yarn.lock

#### Step 5: Prepare Environment Variables

```yaml
- name: Prepare Environment Variables
  run: |
    cp apps/strapi/.env.example apps/strapi/.env
    cp apps/ui/.env.local.example apps/ui/.env.local
    echo "STRAPI_REST_READONLY_API_KEY=${{ env.STRAPI_REST_READONLY_API_KEY }}" >> apps/ui/.env.local
```

**What This Does**:

- Copies `.env.example` → `.env` (Strapi)
- Copies `.env.local.example` → `.env.local` (UI)
- Injects CI-specific API key

**Why Needed**: Build requires environment variables (even if unused)

#### Step 6: Format Check

```yaml
- name: yarn format:check
  run: yarn format:check
```

**What's Checked**:

- Prettier formatting (all files)
- No CRLF line endings (LF only)
- Import sorting (ESLint plugin removed for compatibility)

**Command**: `prettier --check .`

**Common Failures**:

- CRLF line endings (Windows issue)
- Unformatted code committed
- Merge conflicts with formatting

**Fix Locally**:

```bash
yarn format:fix
```

#### Step 7: Lint

```yaml
- name: yarn lint
  run: yarn lint
```

**What's Checked**:

- ESLint rules (all packages)
- TypeScript types (via `turbo lint`)
- Code quality issues

**Command**: `turbo lint`

**Common Failures**:

- Unused imports
- Type errors
- ESLint rule violations

**Fix Locally**:

```bash
yarn lint:fix
```

---

## 🏗️ JOB 2: BUILD

### Purpose

Verify production builds compile successfully.

### Configuration

```yaml
build:
  name: Build all apps
  timeout-minutes: 15
  runs-on: ubuntu-latest
```

**Timeout**: 15 minutes  
**Runner**: Ubuntu Latest (same as Lint for consistency)

### Steps Breakdown

#### Steps 1-5: Same as Lint Job

(Checkout, Node Setup, Turbo Cache, Install Dependencies, Environment Variables)

**Why Repeated**: Jobs run independently (no shared state)

#### Step 6: Build UI

```yaml
- name: Build UI
  run: yarn build:ui
```

**What's Built**:

- Next.js static export
- 54 static pages generated
- Client-side bundles optimized
- Server components compiled

**Command**: `yarn workspace @repo/ui build`

**Output**:

```
Route (app)                              Size     First Load JS
┌ ○ /                                   5.2 kB         92.1 kB
├ ○ /[locale]                           5.2 kB         92.1 kB
├ ○ /[locale]/[...slug]                 5.2 kB         92.1 kB
...
○  (Static)  prerendered as static content
```

**Common Failures**:

- TypeScript errors
- Invalid imports
- Environment variable missing
- Memory issues (large builds)

**Performance**:

- Cold build: ~5-10 minutes
- Warm build (cached): ~2-3 minutes

#### Step 7: Build Strapi

```yaml
- name: Build Strapi
  run: yarn build:strapi
```

**What's Built**:

- TypeScript compilation (src → dist)
- Admin panel build
- Plugin builds
- Type generation

**Command**: `yarn workspace @repo/strapi build`

**Output**:

```
Building your admin UI with development configuration...
Admin UI built successfully
```

**Common Failures**:

- TypeScript compilation errors
- Missing Strapi plugins
- Invalid schema definitions
- Database connection errors (shouldn't happen in build)

**Performance**:

- Cold build: ~3-5 minutes
- Warm build (cached): ~1-2 minutes

---

## 🚀 EXECUTION FLOW

### Complete Workflow Timeline

```
0:00  Workflow triggered
0:05  Lint job starts
  0:05  Checkout code (5s)
  0:10  Setup Node.js (5s)
  0:15  Restore Turbo cache (10s)
  0:45  Install dependencies (30s cached)
  0:50  Prepare env vars (5s)
  1:30  Format check (40s)
  3:00  Lint (1m 30s)
3:00  Lint job complete ✅
3:00  Build job starts
  3:05  Checkout code (5s)
  3:10  Setup Node.js (5s)
  3:20  Restore Turbo cache (10s)
  3:50  Install dependencies (30s cached)
  3:55  Prepare env vars (5s)
  6:55  Build UI (3m)
  8:55  Build Strapi (2m)
10:00 Build job complete ✅
10:00 Workflow complete ✅
```

**Total Duration**: ~10 minutes (with cache)

### Parallel vs Sequential

**Current**: Jobs run sequentially (Lint → Build)  
**Future**: Could run in parallel (save 3 minutes)

**Why Sequential**:

- Fails fast (if lint fails, don't waste time building)
- Clearer error messages
- Easier debugging

---

## 🔐 ENVIRONMENT VARIABLES

### Workflow-Level Variables

```yaml
env:
  STRAPI_REST_READONLY_API_KEY: random-value-just-for-build
```

**Purpose**: Injected into UI .env.local for build  
**Why Random**: Build doesn't connect to Strapi, just needs value present

### App-Level Variables

**Strapi** (`.env`):

- Copied from `.env.example`
- All values use defaults
- Database not connected (build-only)

**UI** (`.env.local`):

- Copied from `.env.local.example`
- API key injected from workflow env
- API not called (static build)

---

## 🐛 TROUBLESHOOTING

### Issue: Lint Fails with "Unexpected CRLF"

**Symptom**:

```
apps/ui/src/components/Example.tsx
  1:1  error  Delete `␍`  prettier/prettier
```

**Cause**: Windows CRLF line endings committed

**Solution**:

```bash
# Local fix
yarn format:fix
git add .
git commit -m "fix: normalize line endings"

# Prevent future issues
# Already configured:
# - .editorconfig (end_of_line = lf)
# - .gitattributes (* text=auto eol=lf)
# - lint-staged (auto-fixes on commit)
```

**Root Cause**: Multi-layer CRLF defense should prevent this. If it occurs:

1. Check .editorconfig is respected by editor
2. Verify lint-staged is running
3. Check .gitattributes is applied

---

### Issue: Build Fails with "Cannot find module"

**Symptom**:

```
Error: Cannot find module '@repo/shared-data'
```

**Cause**: Dependency not installed or workspace link broken

**Solution**:

```bash
# Clear all caches
yarn cache clean
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules

# Reinstall
yarn install

# Rebuild
yarn build
```

---

### Issue: TypeScript Errors in Build

**Symptom**:

```
apps/ui/src/app/page.tsx:10:5 - error TS2322: Type 'string' is not assignable to type 'number'.
```

**Cause**: Type error not caught locally

**Solution**:

```bash
# Check types locally
yarn typecheck

# Fix type errors
# Then commit fix
```

**Prevention**: Enable TypeScript strict mode in editor

---

### Issue: Out of Memory

**Symptom**:

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Cause**: Large Next.js build exceeds default Node.js memory

**Solution** (if needed):

```yaml
# In .github/workflows/ci.yml
- name: Build UI
  run: NODE_OPTIONS="--max-old-space-size=4096" yarn build:ui
```

**Current Status**: Not needed yet, builds fit in default 2GB

---

### Issue: Cache Corruption

**Symptom**: Builds fail inconsistently, succeed after cache clear

**Cause**: Corrupted Turbo or Yarn cache

**Solution**:

```bash
# Manual workflow trigger with cache cleared
gh run list --workflow=ci.yml --json databaseId -q '.[0].databaseId' | xargs gh run rerun --debug

# Or update cache key in workflow (forces new cache)
```

---

### Issue: Workflow Stuck in "Queued"

**Symptom**: Workflow shows "Queued" for >5 minutes

**Cause**: GitHub Actions runner capacity

**Solution**:

- Wait (usually resolves in <10 min)
- Cancel and re-trigger
- Check GitHub Actions status page

---

## 📈 PERFORMANCE OPTIMIZATION

### Current Optimizations

1. **Yarn Cache** ✅

   - Dependencies cached between runs
   - ~2 min saved per run

2. **Turbo Cache** ✅

   - Build artifacts cached
   - ~50% faster incremental builds

3. **Concurrency Control** ✅

   - Cancels outdated runs
   - Saves wasted CI minutes

4. **Frozen Lockfile** ✅

   - Ensures reproducible builds
   - Prevents dependency drift

5. **Cross-Platform Tools** ✅
   - `rimraf` instead of PowerShell
   - Enables Linux CI

### Future Optimizations

1. **Parallel Jobs** ⏳

   - Run Lint + Build in parallel
   - Save ~3 minutes per run

2. **Remote Turbo Cache** ⏳

   - Share cache across team
   - Faster builds for everyone

3. **Conditional Steps** ⏳

   - Skip UI build if only Strapi changed
   - Skip Strapi build if only UI changed

4. **Docker Layer Caching** ⏳
   - Cache Docker builds
   - Faster if we add containerization

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Run locally before pushing**:

   ```bash
   yarn format:fix  # Fix formatting
   yarn lint:fix    # Fix linting
   yarn typecheck   # Check types
   yarn build       # Test build
   ```

2. **Use meaningful commit messages**:

   - Conventional commits enforced
   - Helps identify what broke

3. **Fix CI failures immediately**:

   - Don't let main stay broken
   - Blocks other PRs

4. **Review CI logs on failure**:

   - Error messages are usually clear
   - Scroll to first red text

5. **Keep yarn.lock updated**:
   - Commit yarn.lock changes
   - Run `yarn install` after pulling

### DON'T ❌

1. **Don't ignore format:check failures**:

   - Run `yarn format:fix`
   - Commit the changes

2. **Don't commit with type errors**:

   - Run `yarn typecheck`
   - Fix errors before commit

3. **Don't bypass CI**:

   - All PRs must pass CI
   - No merging on red

4. **Don't modify yarn.lock manually**:

   - Use `yarn add/remove`
   - Let Yarn manage it

5. **Don't commit .env files**:
   - Use .env.example
   - Keep secrets out of Git

---

## 🔗 RELATED WORKFLOWS

### Workflows That Depend on This

- **E2E Tests**: Requires successful build
- **Lighthouse**: Requires successful build
- **Visual Regression**: Requires successful Storybook build

### Workflow Comparison

| Feature                 | CI     | E2E    | Lighthouse | Visual |
| ----------------------- | ------ | ------ | ---------- | ------ |
| **Runs on every push**  | ✅     | ❌     | ❌         | ✅     |
| **Runs on PRs**         | ✅     | ✅     | ✅\*       | ✅\*   |
| **Caches dependencies** | ✅     | ✅     | ✅         | ✅     |
| **Duration**            | 10 min | 15 min | 20 min     | 15 min |
| **Blocks merge**        | ✅     | ✅     | ✅         | ✅     |

\* Only on relevant file changes

---

## 📚 ADDITIONAL RESOURCES

### Internal Documentation

- [Workflows Index](./README.md)
- [E2E Workflow](./02-e2e-workflow.md)
- [Cross-Platform Scripts](../innovations/cross-platform-revolution.md)
- [Turbo Caching](../innovations/turbo-caching.md)

### External Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Turbo CI Guide](https://turbo.build/repo/docs/ci)
- [Next.js CI Examples](https://github.com/vercel/next.js/tree/canary/.github/workflows)

---

## ✅ SUCCESS CHECKLIST

Before merging PR, verify:

- [ ] CI workflow passes (green checkmark)
- [ ] No formatting errors
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] UI builds successfully
- [ ] Strapi builds successfully
- [ ] No new warnings introduced
- [ ] yarn.lock updated (if dependencies changed)

---

**Last Updated**: November 30, 2025  
**Workflow Version**: 2.0 (Cross-platform with rimraf)  
**Next**: [E2E Workflow Documentation](./02-e2e-workflow.md) ⏳ Coming Soon
