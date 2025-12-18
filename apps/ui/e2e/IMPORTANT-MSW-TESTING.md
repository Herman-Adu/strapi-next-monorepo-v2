# ⚠️ IMPORTANT: E2E Testing Uses MSW (NOT Real Strapi)

**Last Updated**: December 18, 2025

## 🎯 Current E2E Testing Approach

**We DO NOT use real Strapi for E2E tests!**

### Evolution of E2E Testing

Through our testing journey, we evolved through multiple approaches:

1. **❌ Old Way (Deprecated)**: Real Strapi + saved test data

   - Required Strapi running on port 1337
   - Saved actual test data to database
   - Tested implementation details
   - **This is now obsolete and docs need cleanup**

2. **✅ Current Best Practice**: MSW Mocking + Mock Data
   - MSW bridge server on port 1337 (MOCKS Strapi)
   - All API calls intercepted and mocked
   - Test user behavior, not implementation
   - No database side effects

### What's Running During E2E Tests

```
✅ Next.js dev server (port 3000)
✅ MSW bridge server (port 1337) - MOCKS Strapi API
❌ Real Strapi server - MUST BE STOPPED
```

### How to Run E2E Tests

```powershell
# 1. STOP Strapi if it's running
# Press Ctrl+C in the Strapi terminal

# 2. Start ONLY Next.js (MSW starts automatically via Playwright)
cd apps/ui
yarn dev

# 3. In another terminal, run tests
yarn test:e2e
```

### MSW Architecture

```
Browser/Client → Next.js API (/api/public-proxy/*) → MSW Bridge (port 1337) → MSW Handlers → Mock Response
```

- **MSW Handlers** (`e2e/fixtures/msw-handlers.ts`): Define mock API responses
- **MSW Bridge Server** (`e2e/fixtures/msw-bridge-server.ts`): HTTP server on port 1337
- **MSW Server** (`e2e/fixtures/msw-server.ts`): Intercepts network requests
- **Global Setup** (`e2e/global-setup.ts`): Starts MSW before tests

### Mock Data

All mock data is defined in MSW handlers:

- Pages API (GET)
- Navbar API (GET)
- Footer API (GET)
- Newsletter subscription (POST)
- Contact form submission (POST)

No real data is saved anywhere. Everything is mocked.

### Testing Philosophy

✅ **Test user behavior**: Can user submit form? Do they see success toast?
❌ **Don't test implementation**: Don't test if Strapi saves data correctly

We mock the Strapi API and focus on testing the user experience.

---

## 🔧 If Tests Fail Due to Port Conflict

**Error**: `Address already in use :::1337`

**Cause**: Real Strapi is running and blocking MSW bridge server

**Solution**:

```powershell
# Stop Strapi server (Ctrl+C in Strapi terminal)
# Or kill the process
Get-Process | Where-Object {$_.ProcessName -match "node"} | Stop-Process -Force
```

Then restart E2E tests.

---

## 📝 TODO: Documentation Cleanup

The following docs still reference the OLD real Strapi approach and need updating:

- `apps/ui/e2e/README.md` - Lines mentioning "Start Strapi"
- Any tutorial docs mentioning test data in Strapi

These will be cleaned up after E2E test suite is complete.
