# MSW Implementation for E2E Tests

**Date:** December 16, 2025  
**Status:** ✅ Implemented  
**Approach:** MSW (Mock Service Worker) for SSR-compatible API mocking

---

## 🎯 Problem Statement

### Original Issue

E2E tests were failing in CI with timeout errors because:

1. **Playwright's `page.route()`** only intercepts **browser** HTTP requests
2. **Next.js SSR** fetches data in **Node.js** before sending HTML to browser
3. **Gap:** No mechanism to intercept server-side fetch calls during SSR
4. **Result:** Pages returned 404 in CI, tests timed out waiting for content

### Test Failures (Before MSW)

- ❌ 5 tests failing: contact-form, error-handling, faq, homepage, newsletter
- ❌ All failures: Timeout waiting for content (25 seconds)
- ❌ Root cause: Pages return 404 because SSR fetch to Strapi fails
- ❌ Server logs: "Error fetching page '/e2e-test-page' for locale 'en' error: 'fetch failed'"

---

## ✅ Solution: MSW (Mock Service Worker)

### Why MSW?

MSW intercepts requests at the **network layer** in both:

- ✅ **Node.js environment** (SSR fetch calls)
- ✅ **Browser environment** (client-side requests)

This solves the SSR problem that Playwright's `page.route()` cannot handle.

### Implementation Architecture

```
┌─────────────────────────────────────────────────────┐
│  Playwright Test Runner                             │
│  ├── Global Setup (starts MSW server)               │
│  ├── Test Execution                                 │
│  │   ├── Next.js SSR → fetch() → MSW intercepts ✅  │
│  │   ├── Browser → XHR/fetch → MSW intercepts ✅    │
│  │   └── Tests verify UI behavior                  │
│  └── Global Teardown (stops MSW server)             │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Files Created/Modified

### New Files

1. **`apps/ui/tests/e2e/fixtures/msw-handlers.ts`**

   - MSW request handlers for all Strapi API endpoints
   - Handles: pages, navbar, footer, newsletter, contact submissions
   - Uses mock data from `mock-data.ts`

2. **`apps/ui/tests/e2e/fixtures/msw-server.ts`**

   - MSW server instance configuration
   - Optional verbose logging for debugging
   - Exports server for global setup/teardown

3. **`apps/ui/tests/e2e/global-setup.ts`**

   - Playwright global setup hook
   - Starts MSW server before all tests
   - Logs startup confirmation

4. **`apps/ui/tests/e2e/global-teardown.ts`**
   - Playwright global teardown hook
   - Stops MSW server after all tests complete
   - Clean shutdown

### Modified Files

1. **`apps/ui/playwright.config.ts`**

   - Added `globalSetup` and `globalTeardown` configuration
   - Points to new setup/teardown files

2. **`apps/ui/tests/e2e/contact-form.spec.ts`**

   - Removed `setupApiMocks(page)` call
   - Removed import of old mock-api.ts
   - Added comment: "MSW handles API mocking globally"

3. **`apps/ui/tests/e2e/newsletter.spec.ts`**

   - Removed `setupApiMocks(page)` call
   - Removed import of old mock-api.ts

4. **`apps/ui/tests/e2e/faq.spec.ts`**

   - Removed `setupApiMocks(page)` call
   - Removed import of old mock-api.ts

5. **`apps/ui/tests/e2e/homepage.spec.ts`**

   - Removed all `setupApiMocks(page)` calls (3 instances)
   - Removed import of old mock-api.ts

6. **`.github/workflows/e2e-tests.yml`**

   - Updated job name: "E2E Tests (Playwright - MSW Mocked API)"
   - Updated comments to reference MSW instead of old mock-api.ts

7. **`apps/ui/package.json`**
   - Added: `"msw": "^2.6.8"` (dev dependency)

### Deprecated Files

- **`apps/ui/tests/e2e/fixtures/mock-api.ts`** - No longer used (can be deleted)
  - Old Playwright `page.route()` approach
  - Didn't work for SSR

---

## 🚀 How It Works

### 1. Global Setup (Before All Tests)

```typescript
// e2e/global-setup.ts
export default async function globalSetup() {
  server.listen({ onUnhandledRequest: "warn" })
}
```

MSW server starts and registers network handlers.

### 2. Test Execution

```typescript
// Test file
test("displays contact form", async ({ page }) => {
  await page.goto("/en/e2e-test-page") // SSR happens here
  // ↓ Behind the scenes:
  // 1. Next.js SSR calls fetch('http://127.0.0.1:1337/api/pages?...')
  // 2. MSW intercepts the Node.js fetch call
  // 3. MSW returns mock data from msw-handlers.ts
  // 4. Next.js renders page with mock data
  // 5. Browser receives fully rendered HTML
  // 6. Test verifies UI
})
```

### 3. MSW Request Interception

```typescript
// e2e/fixtures/msw-handlers.ts
http.get(`${STRAPI_URL}/api/pages`, ({ request }) => {
  const url = new URL(request.url)
  const path = url.searchParams.get('filters[path][$eq]')

  if (path?.includes('e2e-test-page')) {
    return HttpResponse.json({
      data: [mockE2EPage.data],
      meta: { pagination: { ... } }
    })
  }

  return HttpResponse.json({ data: [] })
})
```

### 4. Global Teardown (After All Tests)

```typescript
// e2e/global-teardown.ts
export default async function globalTeardown() {
  server.close()
}
```

MSW server stops and cleans up.

---

## 🧪 Testing & Verification

### Local Testing

```bash
# Run tests with MSW verbose logging
MSW_VERBOSE=true yarn workspace @repo/ui test:e2e

# Expected output:
# 🚀 [MSW] Starting Mock Service Worker server...
# [MSW] Intercepted: GET http://127.0.0.1:1337/api/pages?...
# [MSW] Intercepted: GET http://127.0.0.1:1337/api/navbar
# [MSW] Intercepted: GET http://127.0.0.1:1337/api/footer
# ✅ [MSW] Mock server started successfully
```

### CI Testing

No changes needed! MSW works automatically in CI:

```yaml
# .github/workflows/e2e-tests.yml
- name: Run E2E tests
  run: yarn workspace @repo/ui test:e2e
```

MSW will:

1. Start in global setup
2. Intercept SSR fetch calls in CI environment
3. Return mock data for all Strapi API requests
4. Stop in global teardown

---

## 📊 Expected Outcomes

### Before MSW (Playwright `page.route()` only)

- ❌ 5 tests failing (timeout)
- ❌ Pages return 404 (SSR fetch fails)
- ❌ Server logs: "fetch failed"
- ❌ Screenshots show blank/404 pages

### After MSW

- ✅ All tests should pass
- ✅ Pages load correctly with mock data
- ✅ SSR fetch intercepted by MSW
- ✅ No Strapi required in CI
- ✅ Same 141 tests that pass locally will pass in CI

---

## 🔧 Configuration

### Environment Variables

```bash
# MSW uses STRAPI_URL from environment
STRAPI_URL=http://127.0.0.1:1337  # Default

# Enable verbose logging for debugging
MSW_VERBOSE=true
```

### MSW Handler Structure

Each handler follows this pattern:

```typescript
http.get(`${STRAPI_URL}/api/endpoint`, ({ request }) => {
  // 1. Parse request parameters
  const url = new URL(request.url)
  const param = url.searchParams.get("param")

  // 2. Return appropriate mock data
  return HttpResponse.json({ data: mockData })
})
```

---

## 🎓 Key Learnings

### Why Playwright's `page.route()` Failed

From official Playwright docs:

> "Playwright provides APIs to monitor and modify **browser network traffic**"

**Limitation:** Browser only, not Node.js SSR.

### Why MSW Succeeds

From MSW documentation:

> "MSW intercepts requests on the network level, making it agnostic of the request-issuing agent (be it a browser, Node.js, or React Native)"

**Solution:** Works in both browser AND Node.js environments.

### Research References

1. **Max Schmitt (2025):** "Testing Next.js SSR with Playwright"

   - Confirmed `page.route()` limitation
   - Recommended MSW for SSR mocking

2. **Playwright Official Docs:** Network interception

   - Browser-only request interception
   - Suggests alternative approaches for server-side

3. **Next.js Testing Guide:** Official recommendation

   - "For testing server-side functionality, consider using tools like MSW"

4. **MSW Official Docs:** Node.js integration
   - Setup with Playwright global hooks
   - Request handler patterns

---

## 🚨 Important Notes

### Service Worker Confusion

**Note:** MSW has two modes:

1. **Browser Mode:** Uses Service Worker (can interfere with Playwright)
2. **Node.js Mode:** Network-level interception (what we use)

Playwright docs warn about MSW Service Workers, but we use **Node.js mode** which has no such issues.

### MSW Version

- **Current:** MSW v2.x (latest)
- **Not v1.x:** Breaking changes between versions
- **Node.js 18+** required (we use Node.js 20)

### Archived Package Warning

- **`playwright-ssr`** is **ARCHIVED** (October 2024) - DO NOT USE
- Use MSW instead for SSR testing

---

## 🔄 Migration Summary

### What Changed

1. **Installation:** Added `msw` package
2. **Configuration:** Added global setup/teardown
3. **Handlers:** Created MSW handlers (similar to old mock-api.ts)
4. **Tests:** Removed per-test `setupApiMocks()` calls
5. **CI:** Updated workflow comments

### What Stayed the Same

1. **Mock data structure:** No changes to `mock-data.ts`
2. **Test logic:** No changes to test assertions
3. **CI workflow steps:** No changes to GitHub Actions
4. **Test organization:** E2E vs Integration separation unchanged

### What's Better

1. **SSR Support:** MSW intercepts server-side fetches
2. **Cleaner Tests:** No `setupApiMocks()` boilerplate
3. **Global Mocking:** Set up once, works for all tests
4. **Reusable:** Same handlers could work for Vitest unit tests
5. **Production-like:** No application code changes needed

---

## 📈 Success Metrics

### Before

- Local: 141 passing (with real Strapi running)
- CI: 4 passing, 5 failing (without Strapi)

### Target

- Local: 141 passing (with MSW, no Strapi needed)
- CI: 141 passing (with MSW, no Strapi needed)

---

## 🛠️ Troubleshooting

### If Tests Still Fail

1. **Check MSW is starting:**

   ```bash
   # Look for startup message in test output
   🚀 [MSW] Starting Mock Service Worker server...
   ```

2. **Enable verbose logging:**

   ```bash
   MSW_VERBOSE=true yarn workspace @repo/ui test:e2e
   ```

3. **Verify handlers match requests:**

   - Check URL patterns in `msw-handlers.ts`
   - Ensure `STRAPI_URL` environment variable is set correctly

4. **Check for unhandled requests:**
   - MSW logs warnings for unmocked requests
   - Add missing handlers if needed

### Common Issues

**Issue:** Tests still timeout  
**Solution:** Check that pages are using the mocked endpoints, not different URLs

**Issue:** 404 errors persist  
**Solution:** Verify mock data structure matches what components expect

**Issue:** MSW not intercepting  
**Solution:** Ensure global setup/teardown are configured in `playwright.config.ts`

---

## 📚 Additional Resources

- [MSW Official Documentation](https://mswjs.io/docs/)
- [MSW with Playwright Integration](https://mswjs.io/docs/integrations/node)
- [Playwright Network Mocking](https://playwright.dev/docs/network)
- [Next.js Testing Guide](https://nextjs.org/docs/pages/guides/testing/playwright)

---

**Implementation Date:** December 16, 2025  
**Implementation Time:** ~1 hour  
**Result:** ✅ MSW successfully integrated for SSR-compatible API mocking
