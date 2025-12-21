# VS Code Playwright Extension Setup Guide

**Purpose:** Run and debug Playwright E2E and integration tests directly from VS Code UI

**Benefits:**

- ✅ Visual test runner in sidebar
- ✅ Click to run individual tests or suites
- ✅ Inline test results and errors
- ✅ Integrated debugger with breakpoints
- ✅ Auto-discovery of all tests

---

## Prerequisites

- VS Code 1.85+ installed
- Node.js 20+ installed
- Playwright tests working from terminal (verify with `yarn test:e2e`)

---

## Step 1: Install Playwright Extension

### Method A: VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search: **"Playwright Test for VSCode"**
4. Publisher: **Microsoft**
5. Click **Install**

### Method B: Command Line

```bash
code --install-extension ms-playwright.playwright
```

---

## Step 2: Configure Workspace Settings

**Monorepo Challenge:** Playwright config is in `apps/ui/`, not workspace root.

### Create/Update `.vscode/settings.json`:

```json
{
  "playwright.testConfig": "apps/ui/playwright.config.ts",
  "playwright.workspaceFolder": "apps/ui",
  "playwright.reuseBrowser": true,
  "playwright.showTrace": true,

  // Optional: Auto-run tests on save
  "playwright.runTestsOnSave": false
}
```

**Key Settings:**

- `testConfig` - Points to Playwright config location
- `workspaceFolder` - Where to run commands (apps/ui/)
- `reuseBrowser` - Faster test execution (reuse browser instance)
- `showTrace` - Show trace viewer on failures

---

## Step 3: Verify Extension Activation

1. **Open Test Explorer:**

   - Click **Testing** icon in left sidebar (beaker icon)
   - Or: View → Testing (Ctrl+Shift+E)

2. **Check for test discovery:**

   - Should see "Playwright Tests" section
   - Tests organized by file:
     ```
     └── tests/
         ├── e2e/
         │   ├── homepage.spec.ts (9 tests)
         │   ├── contact-form.spec.ts (42 tests)
         │   ├── newsletter.spec.ts (27 tests)
         │   ├── faq.spec.ts (42 tests)
         │   └── error-handling.spec.ts (45 tests)
         └── integration/
             ├── api-integration.spec.ts (27 tests)
             └── ssr-rendering.spec.ts (27 tests)
     ```

3. **If tests not showing:**
   - Reload window: Ctrl+Shift+P → "Reload Window"
   - Check Output panel: View → Output → Select "Playwright Test"
   - Verify `playwright.testConfig` path is correct

---

## Step 4: Running Tests from UI

### Run Individual Test

1. Hover over test name in Test Explorer
2. Click **▶️ Run Test** icon
3. See results inline (✅ pass / ❌ fail)

### Run Test File

1. Hover over file name (e.g., `homepage.spec.ts`)
2. Click **▶️ Run Test** icon
3. All tests in file execute

### Run All Tests

1. Hover over "Playwright Tests" root
2. Click **▶️ Run All Tests** icon
3. Executes entire suite (219 tests)

### Run Tests by Browser

1. Right-click test or file
2. Select **Run Test** → Choose browser:
   - Chromium
   - Firefox
   - WebKit

---

## Step 5: Debugging Tests

### Set Breakpoints

1. Open test file (e.g., `contact-form.spec.ts`)
2. Click left margin next to line number (red dot appears)
3. Set breakpoints inside test:

   ```typescript
   test("should validate required fields", async ({ page }) => {
     await page.goto("/en/e2e-test-page")

     const emailInput = page.locator('input[name="email"]') // ← Set breakpoint here
     await emailInput.fill("invalid-email")
   })
   ```

### Start Debugging

1. Hover over test in Test Explorer
2. Click **🐛 Debug Test** icon (not ▶️ Run)
3. Test pauses at breakpoint
4. Use Debug toolbar:
   - Continue (F5)
   - Step Over (F10)
   - Step Into (F11)
   - Inspect variables in sidebar

### Debug Panel Features

- **Variables:** Inspect `page`, `emailInput`, DOM state
- **Call Stack:** See test execution flow
- **Watch:** Monitor specific expressions
- **Debug Console:** Run commands (e.g., `await page.screenshot()`)

---

## Step 6: View Test Results

### Inline Results

- ✅ Green checkmark = test passed
- ❌ Red X = test failed
- ⏱️ Duration shown next to each test

### Failure Details

1. Click failed test in Test Explorer
2. See error message and stack trace
3. Click file path in error → jumps to failing line

### Trace Viewer

1. If `playwright.showTrace: true` in settings
2. Failed test automatically opens trace viewer
3. See:
   - Screenshots at each step
   - Network requests
   - Console logs
   - DOM snapshots

---

## Step 7: Advanced Features

### Filter Tests

1. Test Explorer search box (top of panel)
2. Type test name or file name
3. Only matching tests shown

### Test Tags (Future)

```typescript
test("should validate email @smoke @form", async ({ page }) => {
  // ...
})
```

Filter by tag in Test Explorer: `@smoke`

### Watch Mode

1. Enable in settings: `"playwright.runTestsOnSave": true`
2. Every file save → re-runs affected tests
3. Fast feedback during development

---

## Troubleshooting

### ❌ Tests Not Appearing in Explorer

**Cause:** Extension can't find Playwright config

**Fix:**

1. Check `.vscode/settings.json` has correct paths
2. Verify `apps/ui/playwright.config.ts` exists
3. Reload window: Ctrl+Shift+P → "Reload Window"

---

### ❌ "MSW Bridge Server Failed to Start"

**Cause:** Port 1337 already in use

**Fix:**

```bash
# Windows
netstat -ano | findstr :1337
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:1337 | xargs kill -9
```

Then re-run test.

---

### ❌ Tests Timeout in Debug Mode

**Cause:** Default timeout (30s) not enough for breakpoint debugging

**Fix:** Increase timeout in `playwright.config.ts`:

```typescript
timeout: process.env.DEBUG ? 300_000 : 30_000, // 5 min in debug mode
```

---

### ❌ "Cannot find module '@playwright/test'"

**Cause:** Dependencies not installed in `apps/ui/`

**Fix:**

```bash
cd apps/ui
yarn install
```

---

## Monorepo-Specific Notes

### Running Integration Tests

**Integration tests require real Strapi** (not MSW mocked):

1. **Start Strapi:**

   ```bash
   yarn workspace @repo/strapi dev
   ```

2. **Wait for:** "Server started on http://localhost:1337"

3. **Run integration tests** from Test Explorer:
   - `tests/integration/api-integration.spec.ts`
   - `tests/integration/ssr-rendering.spec.ts`

**Tip:** E2E tests DON'T require Strapi (MSW mocked)

---

### Workspace Commands

**From Test Explorer, you can:**

- Run E2E tests instantly (MSW handles API)
- Run integration tests (if Strapi running)
- Debug any test with breakpoints
- View traces on failures

**From Terminal, you can:**

```bash
# All tests (E2E + integration)
yarn test:e2e

# E2E only (MSW mocked, no Strapi needed)
yarn workspace @repo/ui test:e2e

# Integration only (requires Strapi)
yarn workspace @repo/ui test:integration

# Specific file
yarn workspace @repo/ui playwright test homepage.spec.ts
```

---

## Keyboard Shortcuts

| Action               | Windows/Linux | Mac         |
| -------------------- | ------------- | ----------- |
| Open Test Explorer   | Ctrl+Shift+E  | Cmd+Shift+E |
| Run Test at Cursor   | Ctrl+; R      | Cmd+; R     |
| Debug Test at Cursor | Ctrl+; D      | Cmd+; D     |
| Run All Tests        | Ctrl+; A      | Cmd+; A     |
| Show Output Panel    | Ctrl+Shift+U  | Cmd+Shift+U |

---

## Best Practices

### ✅ DO:

- Use Test Explorer for quick test runs during development
- Debug with breakpoints when test fails unexpectedly
- Filter tests by file/name to focus on specific area
- Keep trace viewer open on failures (auto-opens if configured)

### ❌ DON'T:

- Run all 219 tests from UI repeatedly (use CI for full suite)
- Debug without breakpoints (just use regular run)
- Forget to start Strapi before running integration tests
- Leave watch mode on (can slow down IDE)

---

## Next Steps

1. ✅ Install extension
2. ✅ Configure `.vscode/settings.json`
3. ✅ Verify tests appear in Test Explorer
4. ✅ Run a few E2E tests (no Strapi needed)
5. ✅ Try debugging with breakpoints
6. ✅ Start Strapi and run integration tests

**Questions?** Check Output panel: View → Output → "Playwright Test"

---

## Resources

- [VS Code Playwright Extension Docs](https://playwright.dev/docs/getting-started-vscode)
- [Playwright Debugging Guide](https://playwright.dev/docs/debug)
- [Test Explorer UI Guide](https://code.visualstudio.com/docs/editor/testing)
- Monorepo E2E patterns: `docs/13-testing/E2E_TESTING_PATTERNS.md`
