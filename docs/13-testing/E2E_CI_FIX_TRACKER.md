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
    cd apps/ui
    npx next start &
    NEXTJS_PID=$!
    echo "NEXTJS_PID=$NEXTJS_PID" >> $GITHUB_ENV
    npx wait-on http://127.0.0.1:3000 --timeout 120000
```

### Option B: Use Dev Server Without Strapi Check

```yaml
- name: Start Next.js Dev Server
  run: |
    cd apps/ui
    npx next dev &
    NEXTJS_PID=$!
    echo "NEXTJS_PID=$NEXTJS_PID" >> $GITHUB_ENV
    npx wait-on http://127.0.0.1:3000 --timeout 120000
```

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

## 📝 **NEXT STEPS**

1. **Revert to commit `a90c53b`** (had server start logic)
2. **Fix by using `npx next start`** instead of `yarn start`
3. **OR use `npx next dev`** instead of `yarn dev`
4. **Test that it doesn't wait for Strapi**
5. **Verify build output exists before starting**

---

**Last Updated:** December 16, 2025  
**Status:** Ready to implement correct fix  
**Next Commit:** Should fix without breaking previous work
