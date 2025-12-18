# Monorepo Command Reference

**Last Updated:** December 18, 2025  
**Environment:** Windows 11 + Docker + PostgreSQL + Next.js 15 + Strapi  
**Package Manager:** Yarn Workspaces

---

## 🚨 CRITICAL: Always Run from Monorepo Root

```bash
# Current working directory should ALWAYS be:
C:\Users\herma\source\repository\strapi-next-monorepo-v2\
```

---

## ✅ CORRECT Command Patterns

### E2E Testing Commands

```bash
# Run ALL E2E tests
yarn workspace @repo/ui playwright test

# Run specific test suite
yarn workspace @repo/ui playwright test homepage.spec.ts
yarn workspace @repo/ui playwright test contact-form.spec.ts
yarn workspace @repo/ui playwright test newsletter.spec.ts
yarn workspace @repo/ui playwright test faq.spec.ts
yarn workspace @repo/ui playwright test error-handling.spec.ts

# Run with specific browser (CI uses chromium only)
yarn workspace @repo/ui playwright test --project=chromium
yarn workspace @repo/ui playwright test --project=firefox
yarn workspace @repo/ui playwright test --project=webkit

# Run with UI mode (debugging)
yarn workspace @repo/ui playwright test --ui

# Run in headed mode (see browser)
yarn workspace @repo/ui playwright test --headed

# Run with debug mode
yarn workspace @repo/ui playwright test --debug

# Show HTML report
yarn workspace @repo/ui playwright show-report

# Show trace file
yarn workspace @repo/ui playwright show-trace test-results/<test-name>/trace.zip

# Install Playwright browsers
yarn workspace @repo/ui playwright install
yarn workspace @repo/ui playwright install --with-deps chromium

# Generate tests with codegen
yarn workspace @repo/ui playwright codegen http://localhost:3000
```

### Build Commands

```bash
# Build both apps
yarn build

# Build UI only
yarn build:ui

# Build Strapi only
yarn build:strapi

# Clean builds
yarn clean
yarn clean:ui
yarn clean:strapi
```

### Development Commands

```bash
# Start both apps with orchestration
yarn dev

# Start both apps in parallel (no orchestration)
yarn dev:all

# Start UI only
yarn dev:ui

# Start Strapi only
yarn dev:strapi
```

### Test Commands

```bash
# Run all UI tests (E2E + Integration + Unit)
yarn test

# E2E tests only
yarn test:e2e

# Unit tests
yarn test:ui

# Integration tests
yarn workspace @repo/ui playwright test tests/integration/
```

### Linting & Formatting

```bash
# Format all files
yarn format

# Check formatting
yarn format:check

# Lint all workspaces
yarn lint

# Type check UI
yarn workspace @repo/ui typecheck
```

---

## ❌ NEVER Use These Commands

```bash
# ❌ WRONG - Never use npx
npx playwright test
npx playwright install
npx tsx scripts/something.ts

# ❌ WRONG - Never cd into workspace
cd apps/ui
playwright test

# ❌ WRONG - Never use npm
npm run test
npm install
```

---

## 📁 Workspace Structure

```
strapi-next-monorepo-v2/           # ← ALWAYS run commands from here
├── apps/
│   ├── strapi/                     # Backend (Strapi CMS)
│   └── ui/                         # Frontend (Next.js 15)
│       ├── e2e/                    # E2E test files
│       │   ├── homepage.spec.ts
│       │   ├── contact-form.spec.ts
│       │   ├── newsletter.spec.ts
│       │   ├── faq.spec.ts
│       │   └── error-handling.spec.ts
│       ├── tests/integration/      # Integration tests
│       └── playwright.config.ts
├── packages/                       # Shared packages
│   ├── design-system/
│   ├── shared-data/
│   ├── typescript-config/
│   └── prettier-config/
└── package.json                    # Root package.json with scripts
```

---

## 🔧 CI/CD Commands (GitHub Actions)

### E2E Workflow (`.github/workflows/e2e-tests.yml`)

```yaml
# Install Playwright browsers
- run: yarn workspace @repo/ui playwright install --with-deps chromium

# Run E2E tests
- run: |
    cd apps/ui
    yarn playwright test --project=chromium
```

### Integration Workflow (`.github/workflows/integration-tests.yml`)

```yaml
# Install Playwright browsers
- run: yarn workspace @repo/ui playwright install --with-deps chromium

# Run integration tests
- run: |
    cd apps/ui
    yarn playwright test tests/integration/ --reporter=html
```

---

## 🎯 Common Workflows

### Running Tests Before Commit

```bash
# 1. From monorepo root
cd C:\Users\herma\source\repository\strapi-next-monorepo-v2\

# 2. Build to ensure no TypeScript errors
yarn build:ui

# 3. Run E2E tests
yarn workspace @repo/ui playwright test --project=chromium

# 4. Check formatting
yarn format:check

# 5. Run linting
yarn lint
```

### Debugging Failing Tests

```bash
# 1. Run with UI mode
yarn workspace @repo/ui playwright test --ui

# 2. Run specific test in headed mode
yarn workspace @repo/ui playwright test contact-form.spec.ts --headed

# 3. Run with debug mode
yarn workspace @repo/ui playwright test contact-form.spec.ts --debug

# 4. View trace file
yarn workspace @repo/ui playwright show-trace test-results/<test-name>/trace.zip

# 5. View HTML report
yarn workspace @repo/ui playwright show-report
```

### CI Simulation (Local)

```bash
# Set CI environment variable
$env:CI="true"

# Build UI
yarn build:ui

# Run tests (will use CI config - 1 worker, retries enabled)
yarn workspace @repo/ui playwright test --project=chromium

# Unset CI variable
Remove-Item Env:\CI
```

---

## 📊 Test Suite Status (Dec 18, 2025)

**Current Status: ✅ 144/144 PASSING**

| Suite          | Tests           | Status      | Runtime |
| -------------- | --------------- | ----------- | ------- |
| Homepage       | 9               | ✅ Passing  | 42s     |
| Contact Form   | 30 (12 skipped) | ✅ Passing  | 1.6m    |
| Newsletter     | 18 (9 skipped)  | ✅ Passing  | 60s     |
| FAQ            | 42              | ✅ Passing  | 1.5m    |
| Error Handling | 45              | ✅ Passing  | 1.8m    |
| **TOTAL**      | **144**         | **✅ 100%** | **~6m** |

---

## 🔍 Package.json Scripts Reference

### Root (`package.json`)

```json
{
  "scripts": {
    "build": "yarn clean && turbo build",
    "build:ui": "yarn clean:ui && turbo run build --filter=@repo/ui",
    "build:strapi": "yarn clean:strapi && turbo run build --filter=@repo/strapi",
    "dev": "node ./scripts/dev-orchestrated.js",
    "dev:ui": "turbo run dev --filter=@repo/ui",
    "dev:strapi": "turbo run dev --filter=@repo/strapi",
    "test": "turbo run test --filter=@repo/ui",
    "test:e2e": "turbo run test:e2e --filter=@repo/ui",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,md,css,scss}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,md,css,scss}\""
  }
}
```

### UI Workspace (`apps/ui/package.json`)

```json
{
  "scripts": {
    "build": "next build",
    "dev": "wait-on http://localhost:1337/_health && next dev",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:integration": "playwright test tests/integration/"
  }
}
```

**Note:** When running from monorepo root, prefix with workspace:

```bash
yarn workspace @repo/ui test:e2e  # Calls: playwright test
```

---

## 🎓 Key Concepts

### Yarn Workspaces

- **Root package.json** orchestrates all workspaces
- **Workspace packages** (`@repo/ui`, `@repo/strapi`) are isolated
- Commands run via: `yarn workspace <name> <command>`
- Shared dependencies hoisted to root `node_modules/`

### Turbo (Monorepo Build System)

- Caches build outputs in `.turbo/`
- Parallelizes tasks across workspaces
- Filters tasks: `--filter=@repo/ui` or `--filter=@repo/strapi`

### Playwright Configuration

- **Local:** Runs all 3 browsers (chromium, firefox, webkit), 4 workers
- **CI:** Runs chromium only, 1 worker, 2 retries
- **MSW:** Mocks API at Node.js level (no real Strapi needed for E2E)
- **WebServer:** Auto-starts Next.js dev server before tests

---

## ⚠️ Common Mistakes

### 1. Running commands from wrong directory

```bash
# ❌ WRONG
cd apps/ui
playwright test

# ✅ CORRECT
cd C:\Users\herma\source\repository\strapi-next-monorepo-v2\
yarn workspace @repo/ui playwright test
```

### 2. Using npx instead of yarn workspace

```bash
# ❌ WRONG
npx playwright test

# ✅ CORRECT
yarn workspace @repo/ui playwright test
```

### 3. Forgetting to build before commit

```bash
# ❌ WRONG - commit without build check
git commit -m "fix: something"

# ✅ CORRECT - verify build first
yarn build:ui
yarn workspace @repo/ui playwright test --project=chromium
git commit -m "fix: something"
```

### 4. Using npm instead of yarn

```bash
# ❌ WRONG
npm install
npm run test

# ✅ CORRECT
yarn install
yarn test:e2e
```

---

## 📝 Documentation to Update

The following files contain incorrect `npx` references and need updating:

### High Priority (Active Docs)

- [ ] `apps/ui/e2e/README.md`
- [ ] `apps/ui/tests/integration/README.md`
- [ ] `docs/13-testing/e2e/README.md`
- [ ] `docs/13-testing/quick-reference/e2e-quick-start.md`
- [ ] `docs/08-devops/workflows/02-e2e-workflow.md`
- [ ] `docs/06-workflows/automation/quick-ref.md`

### Medium Priority (Tutorial Content)

- [ ] `content/tutorials/series-2-e2e-testing/*.md` (all files)
- [ ] `content/articles/series-2-e2e-testing/*.md` (all files)

### Low Priority (Archives/Planning)

- [ ] `docs/11-recovery/archives/*.md`
- [ ] `content/planning/phase-2-planning/*.md`

### Workflow Files (Already Correct)

- ✅ `.github/workflows/e2e-tests.yml` - Uses correct commands in context
- ✅ `.github/workflows/integration-tests.yml` - Uses correct commands in context

**Note:** CI workflows run commands from `apps/ui/` directory after `cd`, so they use bare `playwright` commands. This is acceptable in that specific context only.

---

## 🎯 Quick Command Lookup

| Task              | Command                                                    |
| ----------------- | ---------------------------------------------------------- |
| Run all E2E tests | `yarn workspace @repo/ui playwright test`                  |
| Run single suite  | `yarn workspace @repo/ui playwright test homepage.spec.ts` |
| Debug tests       | `yarn workspace @repo/ui playwright test --ui`             |
| Build UI          | `yarn build:ui`                                            |
| Format code       | `yarn format`                                              |
| Lint code         | `yarn lint`                                                |
| Start dev servers | `yarn dev`                                                 |
| View test report  | `yarn workspace @repo/ui playwright show-report`           |

---

## 📞 Support

If you see `npx` in any documentation or command examples, it's **incorrect** for this monorepo setup. Always use the patterns shown in this document.

**Remember:** All commands run from monorepo root using `yarn workspace @repo/<name> <command>` pattern.
