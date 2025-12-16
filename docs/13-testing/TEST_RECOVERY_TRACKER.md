# Test Recovery Tracker - Master Plan

**Created:** 2024-12-15  
**Purpose:** Single source of truth for test restoration and improvement work  
**Current Phase:** Phase 1 - Restore to 185 Passing Tests

---

## 🎯 ULTIMATE GOAL

**Get all E2E tests passing (green ticks) for clean local development and commit**

---

## 📊 CURRENT STATUS - REAL BASELINE (With Servers Running)

**ACTUAL BASELINE (2024-12-15 - Servers Running):**

- ✅ **98 passing tests** (REAL BASELINE)
- ❌ **9 failing tests** (consistent, reproducible)
- ⏭️ 3 skipped tests
- ⚠️ 55 did not run (serial mode dependencies)
- **Total Test Time:** 3.4 minutes
- **Workers:** 12 (unlimited locally)

**Previous Confusion:**

- "185 passing" never existed in code
- "70 passing" was when servers weren't running
- **98 passing is our TRUE baseline to fix from**

**New Failures (vs assumed 185):**

1. Homepage tests failing (load, navigation) - **NEW ISSUE**
2. Form submissions still failing (contact, newsletter)
3. FAQ accordion still failing
4. Error handling tests failing

**Why 77 Tests "Did Not Run":**

- Tests across 3 browsers (chromium, firefox, webkit)
- 165 total tests found
- Some tests have conditional skips
- Serial mode tests don't run if earlier tests fail

---

## 📋 PHASE 1: FIX FROM CURRENT BASELINE (70 PASSING)

**Goal:** Fix failing tests from actual current state (not assumed 185)  
**Status:** 🔵 IN PROGRESS  
**Started:** 2024-12-15  
**Baseline:** 70 passing, 15 failing

## 🔍 ANALYSIS: 9 Failing Tests (98 Passing Baseline)

### Failure Category 1: Form Success Toasts (6 failures)

**Tests Failing:**

1. Contact form - chromium, firefox, webkit (3 tests)
2. Newsletter form - chromium, firefox, webkit (3 tests)

**Error:** `expect(locator).toBeVisible()` - Success toast not appearing after submission

**Investigation:**

- Form submissions ARE being mocked in `mock-api.ts`
- Mock returns 200 status with proper data structure
- But success toast never renders

**Hypothesis:**

1. ❌ Mock routes NOT intercepting (pattern mismatch?)
2. ❌ Toast component not mounting
3. ❌ onSuccess callback not firing
4. ⚠️ Need to check actual form submission URL in traces

### Failure Category 2: FAQ Accordion (3 failures)

**Tests Failing:**

1. Chromium: "should expand accordion on click"
2. Firefox: "should expand accordion on click"
3. Webkit: "should allow multiple accordions open simultaneously"

**Error:** `getByText(/We use modern technologies/i)` - Element not found

**ROOT CAUSE IDENTIFIED:**
Mock data uses wrong structure:

```typescript
// CURRENT MOCK (WRONG):
{
  __component: "sections.faq",
  id: 2,
  heading: "Frequently Asked Questions",
  questions: [  // ❌ Wrong property name
    {
      id: 1,
      question: "What is this platform?",  // ❌ Wrong text
      answer: "..."
    }
  ]
}

// NEEDS TO BE (Based on test expectations):
{
  __component: "sections.faq",
  id: 2,
  header: { ... },  // ✅ Full header object
  accordions: [  // ✅ Correct property name
    {
      id: 1,
      question: "What technologies do you use?",  // ✅ Matches test regex
      answer: "We use modern technologies including Next.js, React, TypeScript..."  // ✅ Matches test
    }
  ]
}
```

---

## 📋 FIX PLAN: Get to 107 Passing (All Green)

### Phase 1: Fix FAQ Mock Data (3 tests)

**Priority:** HIGH - Clear root cause identified

1. Update `mock-data.ts` FAQ structure:

   - Change `questions:` → `accordions:`
   - Add full `header:` object
   - Update question/answer text to match test expectations
   - Add "What technologies do you use?" question

2. Verify FAQ component expects `accordions` property

3. Run FAQ tests only: `yarn workspace @repo/ui playwright test e2e/faq.spec.ts --reporter=list`

**Expected Result:** 3 failures → 0 failures (+3 passing)

### Phase 2: Fix Form Toast Visibility (6 tests)

**Priority:** HIGH - Blocking green ticks

1. Check form submission URL patterns in traces
2. Verify mock route patterns match actual requests
3. Options to investigate:

   - Add console.log to mock routes to verify interception
   - Check if toast component mounting
   - Verify onSuccess callback chain
   - Check toast duration (might disappear too fast)

4. Run single form test with debug:

   ```powershell
   yarn workspace @repo/ui playwright test e2e/newsletter.spec.ts:88 --debug
   ```

5. Fix based on findings

**Expected Result:** 6 failures → 0 failures (+6 passing)

### Success Criteria

- ✅ 98 + 9 = **107 passing tests**
- ✅ 0 failures
- ✅ Clean test run with green ticks
- ✅ All browsers (chromium, firefox, webkit) passing

---

### Todo List (NEW - Based on Analysis)

- [x] 1. Run tests with servers running - **DONE: 98 passing**
- [x] 2. Analyze 9 test failures - **DONE**
- [x] 3. Identify FAQ mock data issue - **DONE: questions vs accordions**
- [ ] 4. Update FAQ mock data structure
- [ ] 5. Run FAQ tests to verify fix
- [ ] 6. Investigate form toast visibility issue
- [ ] 7. Fix form toast (based on investigation)
- [ ] 8. Run all tests to verify 107 passing
- [ ] 9. Commit fixes with documented baseline

### Files to Modify

#### File 1: `apps/ui/playwright.config.ts`

**RESTORE TO:**

```typescript
testDir: "./e2e",  // NOT "./", NOT "./tests"
// REMOVE: testMatch line
workers: process.env.CI ? 1 : undefined,  // NOT 4
```

**Changes:**

- Line 6: `testDir: "./"` → `testDir: "./e2e"`
- Line 7: REMOVE `testMatch: ["**/*.spec.ts"]`
- Line 14: `workers: process.env.CI ? 1 : 4` → `workers: process.env.CI ? 1 : undefined`

#### File 2: `apps/ui/e2e/fixtures/mock-api.ts`

**RESTORE TO:** Full API mocking (pages, navbar, footer, catch-all)

**Add back:**

```typescript
// Mock pages API endpoint
await page.route("**/api/pages**", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(mockE2EPage),
  })
})

// Mock navbar API endpoint
await page.route("**/api/navbar**", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(mockNavbar),
  })
})

// Mock footer API endpoint
await page.route("**/api/footer**", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(mockFooter),
  })
})

// Allow all other requests to pass through
await page.route("**/*", (route) => {
  if (!route.request().url().includes("/api/")) {
    route.continue()
  }
})
```

**Remove:**

- All "SSR/ISR" comments about using real Strapi
- Form-only mock comments

### Success Criteria

- ✅ `yarn test:e2e` shows 185 passing tests
- ✅ 9 failures are the ORIGINAL failures (forms + FAQ)
- ✅ ~97 skipped tests (expected)
- ✅ All tests run in chromium, firefox, webkit

### Rollback Plan

If restoration fails:

1. Check git status: `git status`
2. Review diffs: `git diff`
3. Revert: `git checkout -- apps/ui/playwright.config.ts apps/ui/e2e/fixtures/mock-api.ts`

---

## 📋 PHASE 2: FIX ORIGINAL 9 FAILURES (AFTER PHASE 1 COMPLETE)

**Goal:** Resolve the 9 test failures that existed at 185 passing baseline  
**Status:** ⏳ NOT STARTED  
**Prerequisites:** Phase 1 complete (back to 185 passing)

### Original 9 Failures Breakdown

#### Category A: Form Success Toasts (6 failures)

**Tests Failing:**

1. Contact form success toast - chromium
2. Contact form success toast - firefox
3. Contact form success toast - webkit
4. Newsletter success toast - chromium
5. Newsletter success toast - firefox (2 tests)
6. Newsletter success toast - webkit

**Suspected Cause:**

- Mock routes not intercepting form POST requests
- Toast component not rendering
- Success callback not firing

**Investigation Plan:**

- [ ] Check actual form submission URL patterns
- [ ] Add console.log to mock routes to verify interception
- [ ] Run single test with `--debug` flag
- [ ] Check toast component mounting

#### Category B: FAQ Accordion Expansion (3 failures)

**Tests Failing:**

1. FAQ accordion expansion - chromium
2. FAQ accordion expansion - firefox
3. FAQ accordion expansion - webkit (+ multiple open test)

**Suspected Cause:**

- Answer text not visible after click
- Animation timing issue
- Browser-specific rendering

**Investigation Plan:**

- [ ] Increase wait time after click
- [ ] Check for `data-state="open"` attribute
- [ ] Verify accordion animation CSS
- [ ] Test in headed mode to observe behavior

### Phase 2 Todo List (WILL BE CREATED AFTER PHASE 1)

_This section will be populated once we successfully restore to 185 passing tests_

---

## 📋 PHASE 3: INTEGRATION TESTS (FUTURE)

**Goal:** Properly separate E2E and Integration tests  
**Status:** 🔮 PLANNED  
**Prerequisites:** Phase 1 & 2 complete

### Plan

1. Create separate `playwright-integration.config.ts`
2. Update package.json scripts
3. Document E2E vs Integration strategy
4. Keep test types completely separate

_Detailed plan will be created after Phase 2 completion_

---

## 🗂️ RELATED DOCUMENTATION

### Existing Test Documentation

- `docs/13-testing/E2E_TESTING_PATTERNS.md` - Test patterns and helpers
- `docs/13-testing/E2E_TEST_SUITE_STATUS.md` - Test suite overview
- `docs/13-testing/README.md` - Testing overview
- `apps/ui/tests/integration/README.md` - Integration tests (NEW)

### Key Configuration Files

- `apps/ui/playwright.config.ts` - Playwright configuration
- `apps/ui/e2e/fixtures/mock-api.ts` - API mocking setup
- `apps/ui/e2e/fixtures/mock-data.ts` - Mock response data

### Test Files

- `apps/ui/e2e/contact-form.spec.ts` - Contact form tests
- `apps/ui/e2e/newsletter.spec.ts` - Newsletter form tests
- `apps/ui/e2e/faq.spec.ts` - FAQ accordion tests
- `apps/ui/e2e/homepage.spec.ts` - Homepage navigation tests
- `apps/ui/e2e/error-handling.spec.ts` - Error handling tests

---

## 📝 CHANGE LOG

### 2024-12-15 - Test Count Regression (98 passing)

**What Happened:**

- Attempted to simplify mock strategy (use real Strapi for pages)
- Changed playwright config to include integration tests
- Tests dropped from 185 → 179 → 98 passing

**Changes Made:**

1. Modified `playwright.config.ts` testDir to root
2. Removed page/navbar/footer mocks from `mock-api.ts`
3. Changed worker count to 4
4. Created new integration test files

**Why It Failed:**

- Integration tests auto-skip in Firefox/Webkit (84 tests lost)
- E2E tests need mocks to work without Strapi running
- Mixed E2E and integration tests in same run
- Didn't understand SSR/ISR implications fully

**Lesson Learned:**

- Keep E2E (mocked) and Integration (real API) tests COMPLETELY SEPARATE
- Never mix test types in same playwright config
- Always verify test count after config changes
- Document configuration decisions in tracker

**Recovery Action:**

- Restore original playwright.config.ts
- Restore original mock-api.ts
- Verify 185 passing baseline
- Create separate config for integration tests

---

## 🎓 LESSONS & PRINCIPLES

### Testing Strategy

1. **E2E Tests = Mocked API**

   - Fast (no Strapi needed)
   - Run on every commit
   - Test UI behavior only
   - Use `setupApiMocks()` in all tests

2. **Integration Tests = Real API**

   - Slow (requires Strapi + DB)
   - Run weekly or manually
   - Test actual API integration
   - Never mock API endpoints

3. **Never Mix Test Types**
   - Separate configs
   - Separate directories
   - Separate npm scripts
   - Clear documentation

### Configuration Management

1. **Understand Before Changing**

   - Read existing config completely
   - Test changes incrementally
   - Document why each change is made
   - Verify test count after each change

2. **Keep Baselines**

   - Know your "last known good" state
   - Document test counts at each phase
   - Quick rollback if regression occurs
   - Git commits after each working state

3. **Single Source of Truth**
   - This tracker document is authoritative
   - All plans reference this document
   - Update after every phase completion
   - Review before starting new work

---

## 🛠️ ENVIRONMENT & COMMANDS

**Operating System:** Windows 11  
**Shell:** PowerShell  
**Working Directory:** Always run from repository root  
**Package Manager:** Yarn (v1.22.x)

### ✅ CORRECT COMMANDS (Use These)

```powershell
# Run E2E tests (from root)
yarn workspace @repo/ui test:e2e --reporter=list

# Run specific test file
yarn workspace @repo/ui playwright test e2e/contact-form.spec.ts --reporter=list

# Run with UI
yarn workspace @repo/ui test:e2e:ui

# Build from root (clean build)
yarn build
```

### ❌ INCORRECT COMMANDS (Don't Use These)

```powershell
# DON'T cd into apps/ui - always use workspace from root
cd apps/ui; yarn test:e2e

# DON'T use npm or npx
npm test
npx playwright test

# DON'T run without workspace name
yarn test:e2e
```

---

## 🔄 NEXT STEPS

**IMMEDIATE (Phase 1 - IN PROGRESS):**

1. ✅ Create this tracker (DONE)
2. ✅ Restore playwright.config.ts (DONE)
3. ✅ Restore mock-api.ts (DONE)
4. 🔵 Run tests and verify 185 passing (RUNNING)
5. ⏭️ Update tracker with results

**THEN (Phase 2):**

1. Analyze 9 original failures
2. Create Phase 2 detailed plan
3. Fix failures systematically
4. Update tracker after each fix

**FINALLY (Phase 3):**

1. Separate integration tests properly
2. Document E2E vs Integration strategy
3. Set up CI/CD for both test types

---

## 📞 COMMUNICATION PROTOCOL

**When I (Agent) Start Work:**

- Reference this tracker
- Update todo list status
- Document what I'm about to do

**When I Complete Work:**

- Mark todos complete
- Update change log
- Add lessons learned
- Document results

**When I Change Direction:**

- Document WHY in change log
- Update current phase status
- Create new plan if needed
- Link to related decisions

**When I'm Stuck:**

- Document the blocker
- Ask for guidance
- Don't guess and make changes
- Review tracker for context

---

**Last Updated:** 2024-12-15  
**Current Phase:** Phase 1 - Todo #1 Complete, Moving to #2  
**Next Action:** Restore playwright.config.ts configuration
