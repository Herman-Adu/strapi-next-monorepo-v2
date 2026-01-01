# E2E CI Fix Tracker - DO NOT BREAK WHAT WORKS

**Purpose:** Track EXACTLY what works and what doesn't in GitHub Actions E2E workflow  
**Date:** December 16, 2025  
**Current Status:** ❌ BROKEN - Dev server won't start in CI

---

## 🎯 **GOAL**

Get E2E tests passing in GitHub Actions workflow (currently 141 passing locally)

---

## 📊 **KNOWN WORKING STATE (LOCAL)**

**Environment:**

- Node.js with Next.js dev server
- Strapi running on port 1337
- Next.js on port 3000
- Command: `yarn workspace @repo/ui test:e2e`

**Test Results:**

- ✅ 140-141 passing
- ⏭️ 19 skipped (integration tests)
- ❌ 1-3 flaky (acceptable)

---

## 🔴 **CI FAILURES TIMELINE**

### Attempt 1: `ffd1f15` - No Server Started

**Problem:** Workflow built UI but never started server  
**Error:** `ERR_CONNECTION_REFUSED at http://127.0.0.1:3000`  
**Why:** Tests need server running to navigate to pages

### Attempt 2: `a90c53b` - Production Mode Issues

**Change:** Added `yarn start` after `yarn build:ui`  
**Problem:** Production server didn't start properly  
**Error:** Timeout after 10 minutes  
**Why:** `yarn start` = `next start` needs proper build output or env vars

### Attempt 3: `a5c4207` - **BROKE WORKING SOLUTION**

**Change:** Switched to `yarn dev`, removed build  
**Problem:** `yarn dev` waits for Strapi on port 1337!  
**Error:** `wait-on http://localhost:1337/_health` times out  
**Why:** No Strapi running in E2E workflow (only tests UI with mocked API)

### Attempt 4: `86b94fd` - Used `npx next dev` Directly (Still Failed)

**Change:** Changed to `npx next dev &` to bypass yarn script  
**Problem:** Server still times out after 120s  
**Error:** `wait-on` timeout, process exits with code 1, no test artifacts  
**Why:** Server process starts but never becomes responsive on port 3000

**Root Cause Analysis:**

- Server runs in background (`&`) so errors not visible
- `env.mjs` validation may be failing silently
- No logs captured to debug what's happening
- Need to check if server process actually stays alive

### Attempt 5: `66e753e` - Added Logging (FOUND ROOT CAUSE!)

**Change:** Capture server logs, check process health  
**Result:** ✅ Server logs captured successfully!  
**What Logs Revealed:**

```
✓ Ready in 5.3s  <-- Server started!
◐ Compiling /[locale]/[[...rest]] ...
Module not found: Can't resolve '@repo/shared-data'
```

**THE REAL PROBLEM:**

- ✅ Server starts and listens on port 3000
- ✅ Environment validation passes
- ❌ **First page request fails - missing workspace package**
- ❌ `@repo/shared-data` not built in monorepo
- ❌ `wait-on` makes HEAD request → compilation fails
- ❌ Server stuck in error state, never responds

**Solution:** Build workspace packages BEFORE starting server!

---

## 🔍 **ROOT CAUSE ANALYSIS**

### Package.json Scripts:

```json
{
  "dev": "wait-on http://localhost:1337/_health && next dev", // ❌ Can't use - needs Strapi
  "start": "next start", // ⚠️ Needs proper build
  "build": "next build" // ✅ Creates .next directory
}
```

### The Problem:

1. **`yarn dev`** - Requires Strapi (not available in E2E CI)
2. **`yarn start`** - Requires `.next` build output + correct config
3. **`next build`** - Works but need to start server correctly

---

## ✅ **CORRECT SOLUTION**

### Option A: Fix Production Mode (RECOMMENDED)

```yaml
- name: Build UI
  run: yarn build:ui
  env:
    NEXT_OUTPUT: "" # Use default output mode

- name: Start Next.js Server
  run: |
    npx next start --cwd apps/ui &
    NEXTJS_PID=$!
    echo "NEXTJS_PID=$NEXTJS_PID" >> $GITHUB_ENV
    npx wait-on http://127.0.0.1:3000 --timeout 120000
```

### Option B: Use Dev Server Without Strapi Check (ATTEMPTED - commit `86b94fd`)

```yaml
- name: Start Next.js Dev Server
  run: |
    npx next dev --cwd apps/ui &  # ❌ FAILED - server starts but doesn't respond
    NEXTJS_PID=$!
    echo "NEXTJS_PID=$NEXTJS_PID" >> $GITHUB_ENV
    npx wait-on http://127.0.0.1:3000 --timeout 120000  # Times out
```

**Issue:** Server process starts but never becomes responsive. Need logs!

### Option C: Dev Server WITH Error Logging (CURRENT ATTEMPT)

```yaml
- name: Start Next.js Dev Server
  run: |
    cd apps/ui
    # Capture stdout/stderr to debug why server won't respond
    npx next dev > next-server.log 2>&1 &
    NEXTJS_PID=$!

    # Check if process dies immediately (env validation errors)
    sleep 5
    if ! kill -0 $NEXTJS_PID 2>/dev/null; then
      cat next-server.log
      exit 1
    fi

    # Wait with longer timeout and verbose output
    npx wait-on http://127.0.0.1:3000 --timeout 180000 --interval 1000 --verbose

    # If wait-on fails, show server logs
    if [ $? -ne 0 ]; then
      cat next-server.log
      exit 1
    fi
```

**What This Fixes:**

- ✅ Captures server output to debug startup issues
- ✅ Checks if process dies (env validation failures)
- ✅ Increased timeout to 3 minutes (dev mode is slower)
- ✅ Verbose wait-on output
- ✅ Shows logs on failure
- ✅ Server logs uploaded as artifact

---

## 🚫 **DO NOT DO THIS AGAIN**

❌ **Don't use `yarn dev`** - It waits for Strapi  
❌ **Don't remove build step** - Production mode needs it  
❌ **Don't change timeout without understanding** - Not the real problem  
❌ **Don't break previous working step** - Check what was working first

---

## ✅ **CHECKLIST BEFORE PUSHING**

- [ ] Does the command work locally?
- [ ] Does it require Strapi? (If yes, won't work in E2E CI)
- [ ] Did I break the previous fix?
- [ ] Read this document first
- [ ] Understand the package.json scripts
- [ ] Test the fix logic before committing

---

## ✅ **ATTEMPT 6** - Fix Mock API URL Patterns (Dec 16, 2025)

### What We Changed

Fixed mock API patterns to match actual Strapi backend URLs.

**Problem Identified:**

- Tests were executing but failing with "element(s) not found" and timeout errors
- All 5 failing tests couldn't find page content (Contact, FAQ, Newsletter, Homepage Nav)
- Downloaded playwright-report artifact and analyzed failure screenshots (all ~6KB = blank pages)
- Root cause: Mock API patterns used `**/api/**` but Strapi requests go to `http://127.0.0.1:1337/api/**`
- The `PublicClient` makes requests to `${env.STRAPI_URL}/api/...` which doesn't match wildcard pattern

**Solution Applied:**

```typescript
// OLD (didn't work - wrong URL pattern)
await page.route("**/api/pages**", async (route) => {
  // This never matched because Strapi requests are to specific origin
})

// NEW (correct - matches actual Strapi URL)
const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337"
await page.route(`${strapiUrl}/api/pages**`, async (route) => {
  // Now matches actual backend requests!
})
```

**Files Modified:**

- `apps/ui/e2e/fixtures/mock-api.ts` - Updated all Strapi API route patterns to use full URL

**Test Results:**

- Run: 20280172516
- Status: 5 failed, 4 passed (9 total ran)
- All failures: Timeout waiting for content (pages were blank because API wasn't mocked)
- Server: ✅ Started successfully (no longer an issue)
- Build: ✅ Workspace packages built correctly

**Key Insights:**

1. **Server startup is now fixed** - `@repo/shared-data` builds before server starts
2. **Tests execute successfully** - No more crashes or compilation failures
3. **Mock API was misconfigured** - Patterns didn't match actual request URLs
4. **SSR makes Strapi requests** - Server-side rendering calls backend directly, not through proxy

---

## 📝 **NEXT STEPS**

1. **Test the mock API fix locally** to ensure it works
2. **Push changes and monitor CI** to see if tests pass
3. **If still failing, check which specific routes need mocking** (investigate with traces)
4. **Verify all content types are properly mocked** (pages, navbar, footer)

---

**Last Updated:** December 16, 2025  
**Status:** Mock API patterns fixed, ready to test  
**Next Commit:** Fix mock API URL patterns to match Strapi backend
