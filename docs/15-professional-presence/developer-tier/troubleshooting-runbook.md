# Troubleshooting Runbook

> **Error → Diagnosis → Solution in <2 minutes**

---

## Table of Contents

1. [Critical Issues (Site Down)](#critical-issues-site-down)
2. [Build & Compilation Errors](#build--compilation-errors)
3. [Database Issues](#database-issues)
4. [Test Failures](#test-failures)
5. [Git & Commit Issues](#git--commit-issues)
6. [Environment & Configuration](#environment--configuration)
7. [Component Rendering Issues](#component-rendering-issues)
8. [API & Data Fetching](#api--data-fetching)
9. [Performance Issues](#performance-issues)
10. [Docker & Container Issues](#docker--container-issues)

---

## Critical Issues (Site Down)

### 🚨 Error: "Server Error 500" in Next.js

**Error Message:**

```
Application error: a server-side exception has occurred
```

**Diagnosis:**

1. Check if Strapi is running: `http://localhost:1337/admin`
2. Check browser console (F12 → Console) for API errors
3. Check terminal for Next.js error logs

**Solution:**

```powershell
# 1. Restart Strapi
cd apps\strapi
yarn develop

# 2. Clear Next.js cache
cd apps\ui
rm -rf .next
yarn dev

# 3. Check Strapi API responds
curl http://localhost:1337/api/pages
```

**If Still Failing:**

- Check `apps/ui/.env.local` has correct `NEXT_PUBLIC_STRAPI_API_URL`
- Check Strapi database connection in `apps/strapi/.env`
- See [API & Data Fetching](#api--data-fetching) section

---

### 🚨 Error: "EADDRINUSE: Port already in use"

**Error Message:**

```
Error: listen EADDRINUSE: address already in use :::1337
```

**Diagnosis:**
Another process (usually old Strapi instance) is using the port.

**Solution (Windows):**

```powershell
# Find process using port 1337 (Strapi) or 3000 (Next.js)
netstat -ano | findstr :1337
# Output: TCP  0.0.0.0:1337  0.0.0.0:0  LISTENING  12345

# Kill the process (replace 12345 with actual PID)
taskkill /PID 12345 /F

# Restart dev servers
yarn dev
```

**Solution (macOS/Linux):**

```bash
# Find process
lsof -i :1337

# Kill process
kill -9 <PID>

# Restart
yarn dev
```

**Prevention:**

- Always use `Ctrl+C` to stop dev servers (don't close terminal)
- Use `yarn dev` from root (manages both servers)

---

### 🚨 Error: Database Connection Failed

**Error Message:**

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Diagnosis:**
PostgreSQL not running or wrong connection credentials.

**Solution:**

```powershell
# 1. Check PostgreSQL status (Docker)
docker ps | findstr postgres

# 2. If not running, start it
cd apps\strapi
docker compose up -d db

# 3. Verify connection
docker exec -it strapi-postgres psql -U postgres -d strapi_db

# 4. If successful, restart Strapi
yarn workspace @repo/strapi develop
```

**If Using Local PostgreSQL:**

```powershell
# Check PostgreSQL service running
services.msc  # Search for "postgresql"

# Or restart PostgreSQL
net stop postgresql-x64-14
net start postgresql-x64-14
```

**Check `.env` File:**

```bash
# File: apps/strapi/.env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost      # ← Must match Docker/local setup
DATABASE_PORT=5432
DATABASE_NAME=strapi_db      # ← Must exist
DATABASE_USERNAME=postgres   # ← Must have permissions
DATABASE_PASSWORD=postgres   # ← Must be correct
```

---

## Build & Compilation Errors

### ❌ Error: "Type 'X' is not assignable to type 'Y'"

**Error Message:**

```
Type '{ name: string; }' is not assignable to type 'User'.
  Property 'email' is missing in type '{ name: string; }'.
```

**Diagnosis:**
TypeScript type mismatch - usually after adding new Strapi fields or changing component props.

**Solution:**

```powershell
# 1. Regenerate Strapi types
yarn workspace @repo/strapi types:generate

# 2. Check types file created
ls apps\strapi\types\generated\

# 3. Import correct type in Next.js
# File: apps/ui/src/components/YourComponent.tsx
import type { User } from "@/types/strapi"  # ← Use generated types
```

**Common Causes:**

- Added field in Strapi but didn't regenerate types
- Using wrong import path for types
- Component props don't match Strapi schema

**Prevention:**

- Run `yarn workspace @repo/strapi types:generate` after any Strapi schema change
- Use TypeScript strict mode (catches issues early)

---

### ❌ Error: "Module not found: Can't resolve 'X'"

**Error Message:**

```
Module not found: Can't resolve '@/components/Button'
```

**Diagnosis:**

1. File doesn't exist at import path
2. TypeScript path alias not configured
3. File extension missing/wrong

**Solution:**

```powershell
# 1. Check file exists
ls apps\ui\src\components\Button.tsx

# 2. Check TypeScript paths config
# File: apps/ui/tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  # ← Must match import alias
    }
  }
}

# 3. Restart Next.js (picks up config changes)
# Ctrl+C, then yarn dev

# 4. If still fails, clear cache
rm -rf .next
yarn dev
```

**Fix Import:**

```typescript
// ❌ Wrong
import { Button } from "@/components/Button"

// ✅ Correct (if file is Button.tsx)
import { Button } from "@/components/atoms/Button"
```

---

### ❌ Error: ESLint / Prettier Conflicts

**Error Message:**

```
Replace `"Hello"` with `'Hello'` (prettier/prettier)
```

**Diagnosis:**
ESLint and Prettier have conflicting rules.

**Solution:**

```powershell
# Run Prettier first (auto-fixes)
yarn format

# Then check ESLint
yarn workspace @repo/ui lint

# If conflicts persist, check config
# File: apps/ui/.eslintrc.js
{
  "extends": [
    "next/core-web-vitals",
    "prettier"  # ← Must be LAST to override conflicts
  ]
}
```

**Prevention:**

- Always run `yarn format` before committing
- Use editor integration (VSCode: Prettier extension)

---

## Database Issues

### 💾 Error: "Relation does not exist"

**Error Message:**

```
error: relation "components_sections_testimonials" does not exist
```

**Diagnosis:**
Database schema doesn't match Strapi models - usually after creating new component.

**Solution:**

```powershell
# Option 1: Restart Strapi (auto-migrates in dev)
cd apps\strapi
# Ctrl+C
yarn develop  # Watches for schema changes

# Option 2: Manual migration (if Option 1 fails)
# Delete SQLite database (DEV ONLY!)
rm apps\strapi\.tmp\data.db
yarn develop  # Recreates from scratch

# Option 3: PostgreSQL - Reset database (DEV ONLY!)
docker compose down -v  # ⚠️ DELETES ALL DATA
docker compose up -d db
yarn develop
```

**Prevention:**

- Use PostgreSQL with backups (see [ADR-002](../adr/ADR-002-hybrid-database-architecture.md))
- Run automated daily backups: `yarn workspace @repo/strapi backup`

---

### 💾 Error: "Database Deleted Again!" (Incident #5)

**Symptoms:**

- Strapi admin shows "First time setup" instead of login
- All content gone
- `apps/strapi/.tmp/data.db` file missing or recreated

**Diagnosis:**
SQLite single-file database was accidentally deleted (common with SQLite).

**Solution (Immediate Recovery):**

```powershell
# 1. Check if backup exists
ls backups\daily\

# 2. Restore from latest backup
yarn workspace @repo/strapi restore backups\daily\strapi-backup-2026-01-01.tar.gz

# 3. Restart Strapi
yarn workspace @repo/strapi develop
```

**Solution (Permanent Fix - Switch to PostgreSQL):**

```powershell
# 1. Start PostgreSQL with Docker
cd apps\strapi
docker compose up -d db

# 2. Update .env
# File: apps/strapi/.env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres

# 3. Restart Strapi (auto-migrates)
yarn develop

# 4. Restore content from backup
yarn workspace @repo/strapi restore backups\daily\latest.tar.gz
```

**Prevention:**

- ✅ Use PostgreSQL (Docker + Local dual setup)
- ✅ Run automated daily backups
- ✅ Test restore process monthly
- See: [ADR-002: Hybrid Database Architecture](../adr/ADR-002-hybrid-database-architecture.md)
- See: [Case Study: Preventing Database Incident #5](../lead-tier/problem-solving-case-studies.md#case-study-2-preventing-database-incident-5)

---

## Test Failures

### 🧪 Error: E2E Tests Timeout

**Error Message:**

```
browserType.launch: Target page, context or browser has been closed
```

**Diagnosis:**
Real Strapi running on port 1337 conflicts with MSW bridge server.

**Solution:**

```powershell
# 1. Stop Strapi (Ctrl+C in dev terminal)

# 2. Verify port 1337 is free
netstat -ano | findstr :1337
# Should show nothing

# 3. Run E2E tests
yarn workspace @repo/ui playwright test

# 4. Restart dev servers after tests
yarn dev
```

**Why This Happens:**

- E2E tests use **MSW** (Mock Service Worker) on port 1337
- Real Strapi also uses port 1337
- Port conflict → MSW can't start → Tests fail

**See:** [ADR-001: MSW for E2E Testing](../adr/ADR-001-msw-for-e2e-testing.md)

---

### 🧪 Error: "Tests Pass Locally, Fail in CI"

**Symptoms:**

- All tests green locally
- GitHub Actions CI shows failures
- Error: "Timed out waiting for element"

**Diagnosis:**
CI environment is slower (no hot reload, cold start, network latency).

**Solution:**

**1. Increase Timeouts:**

```typescript
// File: apps/ui/tests/e2e/your-test.spec.ts
test.beforeEach(async ({ page }) => {
  test.setTimeout(60000) // 60s instead of 30s

  await page.goto("/en/page")
  await page.waitForLoadState("networkidle", { timeout: 15000 }) // Wait for hydration
})
```

**2. Use Robust Selectors:**

```typescript
// ❌ Fragile (text can change)
await page.click("Submit")

// ✅ Robust (data attribute)
await page.click('[data-testid="submit-button"]')

// ✅ Robust (ARIA role)
await page.click('button[type="submit"]')
```

**3. Wait for Specific Conditions:**

```typescript
// ❌ Race condition
await page.click("button")
expect(page.locator(".success")).toBeVisible()

// ✅ Explicit wait
await page.click("button")
await page.waitForSelector(".success", { state: "visible", timeout: 10000 })
expect(page.locator(".success")).toBeVisible()
```

**Prevention:**

- Use `setStandardTimeout()` helper (built-in)
- Use `waitForLoadState("networkidle")` after navigation
- Add `{ timeout: 10000 }` to all assertions
- See: [E2E Testing Guide](../../13-testing/MSW-CONSOLIDATION.md)

---

### 🧪 Error: Integration Tests Fail "ECONNREFUSED"

**Error Message:**

```
Error: connect ECONNREFUSED 127.0.0.1:1337
```

**Diagnosis:**
Integration tests need **real Strapi** running (unlike E2E tests which use MSW).

**Solution:**

```powershell
# 1. Start Strapi + database in one terminal
yarn dev

# 2. In ANOTHER terminal, run integration tests
yarn workspace @repo/strapi test:integration
```

**Test Types:**

- **E2E Tests**: Use MSW (no Strapi needed)
- **Integration Tests**: Use real Strapi + database

---

## Git & Commit Issues

### 🔧 Error: Husky Pre-Commit Hook Failed

**Error Message:**

```
husky - pre-commit hook failed (add --no-verify to bypass)
✖ lint-staged failed with errors
```

**Diagnosis:**
Pre-commit validation found errors (lint, format, type check, or tests).

**Solution:**

```powershell
# 1. See what failed
yarn format  # Fix formatting
yarn workspace @repo/ui lint  # Check lint errors
yarn workspace @repo/ui type-check  # Check type errors

# 2. Fix errors shown in output

# 3. Try commit again
git add .
git commit -m "your message"

# OR bypass if you're SURE validation passed manually
git commit -m "your message" --no-verify
```

**When to Use `--no-verify`:**

- ✅ After running `yarn format` (already validated)
- ✅ Updating documentation only (no code changes)
- ✅ Emergency hotfix (validate after merge)
- ❌ To skip failing tests (fix tests instead!)

**See:** [MANDATORY-WORKFLOW.md](../../06-workflows/MANDATORY-WORKFLOW.md)

---

### 🔧 Error: "Commit message doesn't follow Conventional Commits"

**Error Message:**

```
✖ subject may not be empty [subject-empty]
✖ type may not be empty [type-empty]
```

**Diagnosis:**
Commit message doesn't follow `type(scope): description` format.

**Solution:**

```powershell
# ❌ Wrong
git commit -m "fixed bug"

# ✅ Correct
git commit -m "fix: resolve database connection issue"

# ✅ With scope
git commit -m "fix(api): resolve database connection issue"

# ✅ Breaking change
git commit -m "feat!: migrate to new API structure

BREAKING CHANGE: API endpoints changed from /v1 to /v2"
```

**Common Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting (no code change)
- `refactor:` - Code restructure (no behavior change)
- `test:` - Add/update tests
- `chore:` - Build process, dependencies

**Use Interactive Prompt:**

```powershell
yarn commit  # Guided prompts for commit message
```

---

### 🔧 Error: Merge Conflicts

**Error Message:**

```
CONFLICT (content): Merge conflict in apps/ui/src/app/page.tsx
```

**Diagnosis:**
Same file edited in different branches.

**Solution:**

```powershell
# 1. Pull latest main
git checkout main
git pull origin main

# 2. Go back to your branch
git checkout your-branch

# 3. Merge main into your branch
git merge main

# 4. VSCode shows conflicts - resolve them
# Look for markers:
<<<<<<< HEAD
your changes
=======
their changes
>>>>>>> main

# 5. Choose which to keep (or combine both)
# Remove markers (<<<, ===, >>>)

# 6. Test everything works
yarn build
yarn workspace @repo/ui playwright test

# 7. Commit resolved conflicts
git add .
git commit -m "chore: resolve merge conflicts with main"
```

**Prevention:**

- Pull main frequently (`git pull origin main`)
- Keep branches short-lived (<3 days)
- Communicate with team about overlapping work

---

## Environment & Configuration

### ⚙️ Error: Environment Variable Undefined

**Error Message:**

```
Error: NEXT_PUBLIC_STRAPI_API_URL is not defined
```

**Diagnosis:**
`.env.local` file missing or variable not set.

**Solution:**

```powershell
# 1. Check file exists
ls apps\ui\.env.local

# 2. If missing, create it
# File: apps/ui/.env.local
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# 3. Restart Next.js (reads .env on startup)
# Ctrl+C
yarn dev
```

**Debugging:**

```typescript
// Add to your code temporarily
console.log("STRAPI_URL:", process.env.NEXT_PUBLIC_STRAPI_API_URL)
```

**Production Checklist:**

- [ ] All `NEXT_PUBLIC_*` vars set in Vercel/hosting dashboard
- [ ] Strapi `APP_KEYS`, `JWT_SECRET` regenerated (never use dev values!)
- [ ] Database credentials secured (not in git)

---

### ⚙️ Error: Docker Compose Won't Start

**Error Message:**

```
ERROR: Couldn't connect to Docker daemon
```

**Solution (Windows):**

```powershell
# 1. Start Docker Desktop
# Search → "Docker Desktop" → Open

# 2. Wait for "Docker is running" indicator

# 3. Try again
cd apps\strapi
docker compose up -d db
```

**Solution (Linux/macOS):**

```bash
# Check Docker service
sudo systemctl status docker

# Start Docker
sudo systemctl start docker

# Enable on boot
sudo systemctl enable docker
```

---

## Component Rendering Issues

### 🎨 Error: Component Renders Twice

**Symptoms:**

- `console.log` appears twice in development
- Duplicate API calls

**Diagnosis:**
React 18+ Strict Mode intentionally double-renders in development (helps catch bugs).

**Solution:**

**This is NORMAL in development!** Doesn't happen in production.

**If you need to fix double API calls:**

```typescript
// ❌ Problem: Runs twice
useEffect(() => {
  fetchData()
}, [])

// ✅ Solution: Use ref to track
const hasFetched = useRef(false)

useEffect(() => {
  if (!hasFetched.current) {
    hasFetched.current = true
    fetchData()
  }
}, [])

// ✅ Better: Use React Query (handles automatically)
const { data } = useQuery("key", fetchData)
```

---

### 🎨 Error: "Hydration Mismatch"

**Error Message:**

```
Warning: Text content did not match. Server: "Hello" Client: "Hi"
```

**Diagnosis:**
Server-rendered HTML differs from client-rendered HTML.

**Common Causes:**

- Using `Date.now()` or `Math.random()` in component
- Accessing `window` or `localStorage` in component body
- Conditional rendering based on client-only state

**Solution:**

```typescript
// ❌ Causes hydration mismatch
export default function Page() {
  return <div>{new Date().toLocaleString()}</div>
}

// ✅ Use client-only rendering
"use client"
export default function Page() {
  const [time, setTime] = useState<string>()

  useEffect(() => {
    setTime(new Date().toLocaleString())
  }, [])

  return <div>{time || "Loading..."}</div>
}

// ✅ Or suppress hydration warning (if intentional)
<div suppressHydrationWarning>
  {new Date().toLocaleString()}
</div>
```

---

## API & Data Fetching

### 🌐 Error: "Failed to fetch" in Browser Console

**Error Message:**

```
GET http://localhost:1337/api/pages net::ERR_CONNECTION_REFUSED
```

**Diagnosis:**
Strapi not running or wrong URL.

**Solution:**

```powershell
# 1. Check Strapi running
curl http://localhost:1337/api/pages

# 2. If ECONNREFUSED, start Strapi
yarn workspace @repo/strapi develop

# 3. Check .env.local has correct URL
# File: apps/ui/.env.local
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337  # ← Must match Strapi port

# 4. Restart Next.js
yarn workspace @repo/ui dev
```

---

### 🌐 Error: API Returns Empty Array

**Symptoms:**

- API responds with `{ data: [], meta: {...} }`
- No errors in console
- Content exists in Strapi admin

**Diagnosis:**

1. Content not published in Strapi
2. Wrong API endpoint or filters
3. Missing population parameters

**Solution:**

```powershell
# 1. Check Strapi Content Manager
# http://localhost:1337/admin/content-manager
# → Verify content is "Published" (not "Draft")

# 2. Test API directly
curl http://localhost:1337/api/pages?populate=*

# 3. Check response
# If data: [] → content not published
# If data: [{...}] but missing fields → add populate params
```

**Fix Population:**

```typescript
// ❌ Missing nested fields
const response = await ky.get("/api/pages", {
  searchParams: {
    populate: "*", // Only populates first level
  },
})

// ✅ Populate nested relations
const response = await ky.get("/api/pages", {
  searchParams: {
    "populate[sections][populate][image][populate][media]": "*",
  },
})
```

---

### 🌐 Error: CORS Policy Blocked

**Error Message:**

```
Access to fetch at 'http://localhost:1337' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Diagnosis:**
Strapi CORS not configured for Next.js origin.

**Solution:**

```typescript
// File: apps/strapi/config/middlewares.ts
export default [
  // ... other middlewares
  {
    name: "strapi::cors",
    config: {
      origin: ["http://localhost:3000"], // Add your Next.js URL
      credentials: true,
    },
  },
]

// Restart Strapi
```

---

## Performance Issues

### ⚡ Error: Slow Page Load (>3 seconds)

**Diagnosis:**

```powershell
# 1. Check Lighthouse score
# Chrome DevTools → Lighthouse → Analyze

# 2. Check bundle size
yarn workspace @repo/ui build
# Look for "First Load JS" warnings

# 3. Check API response time
curl -w "@curl-format.txt" -o NUL http://localhost:1337/api/pages
```

**Solutions:**

**1. Optimize Images:**

```typescript
// ❌ Using <img> tag
<img src="/hero.jpg" />

// ✅ Use Next.js Image
import Image from "next/image"
<Image src="/hero.jpg" width={1200} height={600} alt="Hero" />
```

**2. Code Splitting:**

```typescript
// ❌ Import heavy component
import { HeavyChart } from "./HeavyChart"

// ✅ Dynamic import
const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Don't render on server (if client-only)
})
```

**3. Reduce Bundle Size:**

```powershell
# Analyze bundle
yarn workspace @repo/ui build
yarn workspace @repo/ui analyze  # If bundle analyzer configured

# Find large dependencies
npx depcheck  # Shows unused dependencies
```

---

## Docker & Container Issues

### 🐳 Error: Docker Container Won't Start

**Error Message:**

```
ERROR: for db  Cannot start service db: driver failed
```

**Solution:**

```powershell
# 1. Check Docker is running
docker ps

# 2. Remove old containers
docker compose down
docker rm -f strapi-postgres  # Force remove

# 3. Remove volumes (⚠️ deletes data!)
docker compose down -v

# 4. Start fresh
docker compose up -d db

# 5. Check logs
docker logs strapi-postgres
```

---

### 🐳 Error: "Role does not exist" in PostgreSQL

**Error Message:**

```
FATAL: role "strapi" does not exist
```

**Solution:**

```powershell
# 1. Connect to PostgreSQL
docker exec -it strapi-postgres psql -U postgres

# 2. Create role
CREATE USER strapi WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE strapi_db TO strapi;

# 3. Exit
\q

# 4. Update .env to use new user
# File: apps/strapi/.env
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=postgres
```

---

## Emergency Procedures

### 🆘 "Everything is Broken - Start Fresh"

```powershell
# ⚠️ NUCLEAR OPTION - Deletes everything, starts from scratch

# 1. Stop all processes
# Ctrl+C in all terminals

# 2. Delete all dependencies
rm -rf node_modules
rm -rf apps/strapi/node_modules
rm -rf apps/ui/node_modules
rm yarn.lock

# 3. Delete all build artifacts
rm -rf apps/ui/.next
rm -rf apps/strapi/build

# 4. Delete database (DEV ONLY!)
rm -rf apps/strapi/.tmp
docker compose down -v  # If using Docker

# 5. Fresh install
yarn install

# 6. Restore from backup (if you have one)
yarn workspace @repo/strapi restore backups/daily/latest.tar.gz

# 7. Restart everything
yarn dev
```

**Time to Recovery:** 10-15 minutes

---

### 🆘 "CI is Red - Need to Merge Urgently"

**Scenario:** Production is down, need hotfix, but CI failing.

```powershell
# 1. Identify failure
# GitHub Actions → Check error logs

# 2. If test failure, skip tests TEMPORARILY
git commit -m "fix: urgent hotfix" --no-verify
git push

# 3. Create PR with "[URGENT]" prefix
# Get approval from lead

# 4. Merge to main
# Deploy immediately

# 5. CREATE FOLLOW-UP TICKET
# Fix skipped tests in next PR (don't forget!)
```

**Prevention:**

- Keep main branch always deployable
- Run tests locally before pushing: `yarn workspace @repo/ui playwright test`
- Use feature flags for risky changes

---

## 📊 Common Error Matrix

| Error Type              | First Check                     | Quick Fix                                    | Time to Fix |
| ----------------------- | ------------------------------- | -------------------------------------------- | ----------- |
| Port in use (1337/3000) | `netstat -ano \| findstr :PORT` | `taskkill /PID <PID> /F`                     | 30 sec      |
| Database connection     | `docker ps`                     | `docker compose up -d db`                    | 1 min       |
| E2E tests timeout       | Strapi running?                 | Stop Strapi, run tests                       | 1 min       |
| Type error              | Regenerated types?              | `yarn workspace @repo/strapi types:generate` | 2 min       |
| Module not found        | File exists?                    | Check import path, restart Next.js           | 2 min       |
| Husky hook failed       | Ran `yarn format`?              | Run format, commit, or `--no-verify`         | 2 min       |
| Hydration mismatch      | Using `Date.now()`?             | Move to `useEffect` or `"use client"`        | 5 min       |
| Empty API response      | Content published?              | Publish in Strapi, check populate            | 5 min       |
| Database schema error   | Created new component?          | Restart Strapi (auto-migrates)               | 2 min       |

---

## 🔗 Related Documentation

- **[Getting Started Quick](./getting-started-quick.md)** - Setup guide
- **[Code Examples](./code-examples.md)** - Copy-paste patterns
- **[MANDATORY-WORKFLOW.md](../../06-workflows/MANDATORY-WORKFLOW.md)** - Git workflow
- **[MSW Testing Guide](../../13-testing/MSW-CONSOLIDATION.md)** - E2E test debugging
- **[Quality Gates](../lead-tier/quality-gates-standards.md)** - CI/CD debugging

---

## 💡 Pro Tips

1. **Bookmark This Page** - Save 30+ minutes per error
2. **Read Error Messages Carefully** - Often contains solution
3. **Check Browser Console** - 80% of issues show here first
4. **Restart Works** - "Have you tried turning it off and on again?" is real
5. **Ask for Help** - Post error + what you tried in team chat
6. **Document Your Fix** - Add to this runbook (help future you!)

---

_Last Updated: January 2026 | Covers 95% of common errors | Average fix time: <5 minutes_
