# CI/CD Pipeline Documentation

## Overview

This project uses **GitHub Actions** for continuous integration and deployment. The pipeline runs on every push to the `main` branch and on pull requests.

## Pipeline Architecture

### Workflow File

- **Location**: `.github/workflows/ci.yml`
- **Trigger**: Push to `main` branch
- **Runner**: Ubuntu Latest (Linux)

### Pipeline Jobs

#### 1. **Lint** (3m 3s)

- **Purpose**: Code quality and consistency checks
- **Steps**:
  1. Checkout code
  2. Setup Node.js 22.x
  3. Cache dependencies (Yarn + node_modules)
  4. Install dependencies (`yarn install --frozen-lockfile`)
  5. Run ESLint across all packages (`turbo lint`)
- **Exit Criteria**: All ESLint rules pass, no errors

#### 2. **Build all apps** (4m 50s)

- **Purpose**: Verify production build compiles successfully
- **Steps**:
  1. Checkout code
  2. Setup Node.js 22.x
  3. Cache turbo build setup
  4. Setup Node.js environment
  5. Install dependencies
  6. Prepare environment variables
  7. **Clean build directories** (using `rimraf` - cross-platform)
  8. Build UI (Next.js static export)
  9. Build Strapi (TypeScript compilation)
  10. Post-setup and cache cleanup
- **Exit Criteria**:
  - Zero compilation errors
  - All static pages generated (54 pages)
  - TypeScript types valid

## Key Technologies

### Build System

- **Turbo**: Monorepo task orchestration with caching
- **Yarn Workspaces**: Dependency management across packages
- **Cache Strategy**: Turbo caches build artifacts for faster rebuilds

### Quality Gates

1. **Prettier** (pre-commit hook via Husky + lint-staged)
2. **ESLint** (CI pipeline + pre-commit)
3. **TypeScript** (strict mode compilation)
4. **Commitlint** (conventional commits enforced)

## Environment Variables

### Required for CI

The pipeline expects these environment variables to be available (via GitHub Secrets or `.env` files):

**Strapi (Backend)**:

- `HOST`, `PORT`, `APP_KEYS`, `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`
- `DATABASE_CLIENT`, `DATABASE_HOST`, `DATABASE_PORT`
- `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- `DATABASE_SSL`

**Next.js (Frontend)**:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STRAPI_URL`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

**Setup Script**:
The `scripts/setup-env.js` automatically creates `.env` files with fallback values if GitHub Secrets aren't available.

## Cross-Platform Compatibility

### Problem (Fixed in commit 234d6d0)

Original scripts used PowerShell commands:

```json
"clean:ui": "powershell -Command \"Remove-Item -Path 'apps/ui/.next'...\""
```

**Issue**: Linux CI runners don't have PowerShell installed by default.

### Solution

Replaced with `rimraf` (cross-platform):

```json
"clean:ui": "rimraf apps/ui/.next && echo 'Cleaned UI .next folder'"
```

**Benefits**:

- ✅ Works on Linux (CI)
- ✅ Works on Windows (local dev)
- ✅ Works on macOS
- ✅ No external dependencies required

## Build Output

### Next.js (UI)

- **Type**: Static Site Generation (SSG)
- **Pages**: 54 static pages pre-rendered
- **Routes**:
  - Dynamic: `/[locale]/[[...rest]]` (Strapi page builder)
  - Static: `/docs/*` (11 markdown documentation files)
  - Auth pages: Sign in, Register, Password reset, etc.
- **Build Artifacts**: `apps/ui/.next/` (cleaned before each build)

### Strapi (API)

- **Type**: TypeScript compilation
- **Output**: `apps/strapi/dist/` (cleaned before each build)
- **Features**: Admin panel, API routes, Content types

## Caching Strategy

### GitHub Actions Cache

- **Turbo Cache**: `.turbo/` directory (500MB)
- **Node Modules**: `node_modules/`, `apps/*/node_modules/`
- **Cache Key**: `node-cache-Linux-x64-yarn-${{ hashFiles('**/yarn.lock') }}`

### Cache Warning (To Address Tomorrow)

⚠️ **Current Status**: Approaching 11.58 GB of 10 GB limit

- **Action Required**: Clean old caches manually
- **Location**: GitHub → Actions → Caches
- **Recommendation**: Set up automatic cache cleanup or reduce cache size

## Common CI Failures & Solutions

### 1. PowerShell Not Found (FIXED ✅)

```
/bin/sh: 1: powershell: not found
error Command failed with exit code 127.
```

**Solution**: Use `rimraf` instead of PowerShell commands.

### 2. ESLint Errors

**Cause**: Unescaped quotes, missing button types, unused imports
**Solution**: Run `yarn lint` locally before pushing
**Auto-fix**: Many rules auto-fix with `yarn lint --fix`

### 3. Build Failures

**Common Causes**:

- Missing environment variables
- TypeScript type errors
- Missing dependencies

**Debug Steps**:

1. Check "Build UI" step logs in GitHub Actions
2. Run `yarn build` locally to reproduce
3. Verify `.env` files exist and are valid

### 4. Format Check Failures

**Cause**: Code not formatted with Prettier
**Solution**: Run `yarn format` before committing
**Prevention**: Husky pre-commit hook runs automatically

## Local Development Workflow

### Before Committing

```bash
# 1. Kill any running processes on ports
yarn kill:port 3000
yarn kill:port 1337

# 2. Clean build artifacts
yarn clean

# 3. Format code
yarn format

# 4. Run linter
yarn lint

# 5. Build to verify
yarn build

# 6. Commit (uses Commitizen for conventional commits)
yarn commit
```

### Pre-commit Hooks

**Managed by**: Husky + lint-staged

**Automatically runs**:

1. Prettier on staged files (`*.{js,jsx,ts,tsx,md,css,scss}`)
2. ESLint with `--fix` flag
3. Format check to ensure consistency

**Configuration**:

- `.lintstagedrc.js` (root and `apps/ui/`)
- `.husky/pre-commit`

## CI/CD Best Practices

### ✅ Do's

1. **Always clean before building** (prevents stale artifacts)
2. **Use frozen lockfile** (`yarn install --frozen-lockfile`) for deterministic builds
3. **Test locally first** (run `yarn build` before pushing)
4. **Write conventional commits** (enables automatic changelog generation)
5. **Keep cache size under control** (delete old caches periodically)

### ❌ Don'ts

1. **Don't skip quality gates** (ESLint/Prettier exist for a reason)
2. **Don't commit `.env` files** (use `.env.example` instead)
3. **Don't use platform-specific commands** (e.g., PowerShell) in scripts
4. **Don't push without testing build** (CI should never be the first time you build)

## Troubleshooting

### Pipeline Stuck or Slow

1. Check GitHub Actions status page
2. Review cache hit rate (should be >80%)
3. Consider increasing cache key specificity

### Build Times Too Long

- **Current**: ~5 minutes total
- **Optimization**: Turbo cache is working well
- **If slower**: Check if cache is being invalidated unnecessarily

### Deployment Issues

- Verify environment variables in deployment platform
- Check `heroku-postbuild.sh` script for Heroku deployments
- Ensure database migrations run successfully

## Monitoring & Alerts

### GitHub Actions Notifications

- **Success**: Green checkmark on commit
- **Failure**: Red X + email notification
- **Required Status Checks**: Both Lint and Build must pass

### Metrics to Track

1. **Build time trend**: Should remain consistent (~5 min)
2. **Cache hit rate**: Higher is better
3. **Failure rate**: Should be <5%

## Future Improvements

### Planned Enhancements

1. **Cache Management**: Implement automatic cleanup of old caches
2. **Parallel Jobs**: Run Lint and Build in parallel (currently sequential)
3. **E2E Tests**: Add Playwright/Cypress tests to pipeline
4. **Deployment**: Automatic deployment to staging on `main` push
5. **Branch Protection**: Require CI pass before merge
6. **Code Coverage**: Add coverage reports and badges

### Tomorrow's Action Items

1. **Clean GitHub Actions Cache** (currently 11.58 GB / 10 GB)
2. **Review cache strategy** (reduce size or increase eviction)
3. **Set up automatic cache cleanup** (GitHub Actions workflow)

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Push to main / Open PR                                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Lint (3m 3s)                                               │
│  ├─ Checkout code                                           │
│  ├─ Setup Node.js 22.x                                      │
│  ├─ Restore cache (dependencies)                            │
│  ├─ Install dependencies (frozen lockfile)                  │
│  └─ Run turbo lint                                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Build all apps (4m 50s)                                    │
│  ├─ Checkout code                                           │
│  ├─ Setup Node.js 22.x                                      │
│  ├─ Cache turbo build setup                                 │
│  ├─ Setup Node.js environment                               │
│  ├─ Install dependencies                                    │
│  ├─ Prepare environment variables                           │
│  ├─ Clean build directories (rimraf)                        │
│  ├─ Build UI (Next.js → 54 static pages)                    │
│  ├─ Build Strapi (TypeScript → dist/)                       │
│  └─ Post setup                                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ✅ All Checks Passed                                       │
│  → Ready to merge / deploy                                  │
└─────────────────────────────────────────────────────────────┘
```

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Turborepo Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

---

**Last Updated**: November 15, 2025  
**Pipeline Version**: 2.0 (Cross-platform with rimraf)  
**Build Status**: ✅ All checks passing
