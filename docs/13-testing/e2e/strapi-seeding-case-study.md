# Critical Thinking Workflow: E2E Seeding Best Practices

## Overview

This document captures the code review process and lessons learned from refactoring the E2E test data seeding workflow. It serves as a template for analyzing and improving code quality after complex implementation sessions.

**Context:** After implementing E2E seeding through multiple debugging cycles, the code worked but contained "quick fixes" that violated best practices. This analysis identified critical issues and systematically addressed them.

---

## Analysis Methodology

### When to Apply This Workflow

Apply critical analysis after:

- Complex multi-step implementations with many iterations
- Sessions involving repeated debugging/fixing cycles
- Features that "work" but feel rushed or hacky
- Integration of multiple systems (database, frameworks, CI/CD)
- Code with arbitrary timeouts, sleeps, or error suppression

### Red Flags Indicating Need for Review

1. **Arbitrary delays**: `setTimeout()`, `sleep`, `await new Promise()`
2. **Blanket error suppression**: `try-catch` swallowing all errors
3. **Redundant operations**: Same verification happening multiple places
4. **Missing safety guards**: Destructive operations without confirmation
5. **Dead code**: Logic that can never execute
6. **Magic values**: Unexplained environment variable switching
7. **Mixed responsibilities**: Single function/script doing too much

---

## Case Study: E2E Seeding Implementation

### Initial Implementation Issues

#### Issue 1: Arbitrary Timeout (Severity: CRITICAL)

**Problem:**

```javascript
// run-seed.js
await seedFunction({ strapi })
await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds
await strapi.destroy()
```

**Why This Is Bad:**

- Non-deterministic: May fail on slow systems, waste time on fast ones
- Hides root cause: Connection pool not properly closed
- Race conditions: No guarantee operations complete in 2 seconds
- CI/CD unreliability: Timing-dependent code fails unpredictably

**Root Cause:**
Strapi's database connection pool (Knex/Tarn) has pending operations when `destroy()` called.

**Proper Solution:**

```javascript
await seedFunction({ strapi })

// Explicitly close connection pool before destroying Strapi
if (strapi.db && strapi.db.connection) {
  await strapi.db.connection.destroy()
}

await strapi.destroy()
```

**Lesson:** Never use timeouts to "fix" async issues. Find and address the root cause.

---

#### Issue 2: Blanket Error Suppression (Severity: CRITICAL)

**Problem:**

```javascript
try {
  await strapi.destroy()
} catch (error) {
  // Ignore all errors - connection pool cleanup issues
}
```

**Why This Is Bad:**

- Hides real errors (memory leaks, database locks, resource exhaustion)
- Debugging nightmare when actual issues occur
- False sense of success when operations fail
- Violates "fail fast" principle

**Root Cause:**
Connection pool cleanup throws "aborted" error on shutdown (known issue).

**Proper Solution:**

```javascript
try {
  await strapi.destroy()
} catch (destroyError) {
  // Only suppress known "aborted" error from connection pool cleanup
  if (destroyError.message && destroyError.message.includes("aborted")) {
    // This is a known Knex/Tarn cleanup issue - safe to ignore
  } else {
    // Re-throw unexpected errors - we need to know about these!
    throw destroyError
  }
}
```

**Lesson:** Only catch specific, expected errors. Re-throw everything else.

---

#### Issue 3: Redundant Verification (Severity: MEDIUM)

**Problem:**

```bash
# Bash script - AFTER Strapi destroyed
sleep 1  # Wait for database writes
PAGE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pages...")
```

**Why This Is Bad:**

- External dependency: Requires `psql` CLI tool
- Timing issues: `sleep 1` may not be enough on slow systems
- Wrong tool: Using raw SQL when Strapi API available
- Redundant: Verification happens inside seed script too
- Happens after cleanup: Strapi already destroyed, connection closed

**Proper Solution:**

```typescript
// Inside e2e-test-data.ts - BEFORE returning
const verification = await strapi.documents("api::page.page").count({
  filters: { slug: "e2e-test-page", locale: "en" },
})

if (verification !== 1) {
  throw new Error(`Expected 1 page, found ${verification}`)
}

console.log("✅ Seed verification passed - data persisted to database")
return // Strapi still alive, same connection pool
```

**Bash script:**

```bash
# Removed external verification - happens inside seed function now
node scripts/run-seed.js
if [ $? -eq 0 ]; then
  echo "✅ Seeding complete"
fi
```

**Lesson:** Verify inside the same process/connection. Remove redundant checks.

---

#### Issue 4: Missing Safety Guards (Severity: HIGH)

**Problem:**

```bash
# No checks - blindly drops database
psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS public CASCADE;"
```

**Why This Is Bad:**

- Production risk: Could accidentally wipe production data
- No confirmation: Silent destructive operation
- Database name not validated: Works on any database
- CI exception needed: Script requires human confirmation

**Proper Solution:**

```bash
# Safety check: Prevent accidental production database wipes
if [[ ! "$DB_NAME" =~ (test|dev|e2e) ]] && [ "$CI" != "true" ]; then
  echo "⚠️  WARNING: You are about to DELETE ALL DATA from database: $DB_NAME"
  echo "⚠️  This does not appear to be a test/dev database."
  read -p "Type 'yes' to confirm deletion (or anything else to cancel): " -r
  if [[ ! "$REPLY" == "yes" ]]; then
    echo "❌ Operation cancelled by user"
    exit 1
  fi
fi

echo "🗑️  Resetting database..."
psql "$DATABASE_URL" -c "DROP SCHEMA IF EXISTS public CASCADE;"
```

**Lesson:** Always add safety guards for destructive operations. Check environment and require explicit confirmation.

---

#### Issue 5: Dead Code - Idempotency Check (Severity: MEDIUM)

**Problem:**

```typescript
// e2e-test-data.ts
const existingPage = await strapi.documents("api::page.page").findMany({
  filters: { slug: "e2e-test-page" },
})

if (existingPage && existingPage.length > 0) {
  console.log("✅ Already exists - skipping seed")
  return
}
```

**Why This Is Bad:**

- Never executes: Bash script always drops database first
- Misleading: Suggests script is idempotent when it's not
- Wasted query: Unnecessary database call
- Confusing intent: Makes code harder to understand

**Two Options:**

**Option A: Remove Check (Simpler)**

```typescript
// Database always reset - page never exists
console.log("📄 Creating E2E test page...")
const e2eTestPage = await strapi.documents("api::page.page").create({
  // ... data
})
```

**Option B: Make Truly Idempotent (More Flexible)**

```typescript
// Remove DROP SCHEMA from bash script
// Use upsert pattern in seed script
const existingPage = await strapi.documents("api::page.page").findOne({
  filters: { slug: "e2e-test-page" },
})

if (existingPage) {
  await strapi.documents("api::page.page").update({
    documentId: existingPage.documentId,
    data: {
      /* updated data */
    },
  })
} else {
  await strapi.documents("api::page.page").create({
    data: {
      /* new data */
    },
  })
}
```

**Decision:** Option A chosen for E2E testing (fresh database each time).

**Lesson:** Remove dead code. If keeping, make it truly functional.

---

#### Issue 6: Inefficient Build Process (Severity: MEDIUM)

**Problem:**

```bash
# Bash script rebuilds Strapi on EVERY seed
yarn build  # ~25 seconds
node scripts/run-seed.js
```

**Why This Is Bad:**

- Wastes time: 25+ seconds per seed when build unchanged
- CI cost: Unnecessary compute time
- Local frustration: Slow feedback loop for developers

**Proper Solution:**

```bash
# 1. Create prerequisite checker
# scripts/check-strapi-built.sh
if [ ! -d "dist" ]; then
  echo "❌ Strapi not built. Run: yarn build"
  exit 1
fi

# 2. Update seed script
bash scripts/check-strapi-built.sh
if [ $? -ne 0 ]; then
  exit 1
fi

# Skip build if dist/ exists
node scripts/run-seed.js
```

**Developer Workflow:**

```bash
# One-time build (or when code changes)
yarn build

# Fast seeding (no rebuild)
yarn seed:e2e  # ~5-10 seconds
```

**CI Workflow:**

```yaml
- name: Build Strapi
  run: yarn build
  working-directory: apps/strapi

- name: Seed E2E Data
  run: yarn seed:e2e # Skips build
  working-directory: apps/strapi
```

**Lesson:** Separate build from execution. Check prerequisites instead of rebuilding.

---

#### Issue 7: NODE_ENV Confusion (Severity: LOW)

**Problem:**

```javascript
// run-seed.js
console.log("NODE_ENV:", process.env.NODE_ENV || "development")
// Logs "development" but then...

process.env.NODE_ENV = "production" // Changes to production
const strapi = await createStrapi({ distDir: "./dist" })
```

**Why This Is Bad:**

- Misleading logs: Says one thing, does another
- Environment confusion: Why change NODE_ENV mid-script?
- Unclear intent: Why does seed need production mode?

**Root Cause:**
Strapi v5 uses NODE_ENV to determine config file location:

- `development`: Looks for `.ts` files in `config/`
- `production`: Looks for `.js` files in `dist/config/`

**Better Approach:**

```javascript
// Be explicit about what we're doing
console.log("🔧 Loading Strapi with compiled configuration...")

// Set NODE_ENV for config loading (explain WHY)
process.env.NODE_ENV = "production" // Use compiled configs from dist/

const strapi = await createStrapi({
  distDir: "./dist",
  // Could explicitly set config paths instead of relying on NODE_ENV
})
```

**Or Use Explicit Config Paths:**

```javascript
const strapi = await createStrapi({
  distDir: "./dist",
  autoReload: false,
  serveAdminPanel: false,
})
```

**Lesson:** Don't use environment variables for magic behavior. Be explicit about intent.

---

#### Issue 8: Mixed Responsibilities in Bash Script (Severity: LOW)

**Problem:**

```bash
# Single script does:
# 1. Load environment
# 2. Check prerequisites
# 3. Reset database
# 4. Run migrations
# 5. Seed data
# 6. Verify data
# 7. Print summary
```

**Why This Could Be Better:**

- Hard to test individual steps
- Hard to reuse components (can't just "reset DB")
- Harder to maintain as complexity grows

**Better Structure:**

```bash
scripts/
  db/
    load-env.sh          # 1. Environment loading
    check-connection.sh  # 2. Database connectivity
    reset-schema.sh      # 3. Drop/create schema
  build/
    check-built.sh       # 4. Verify dist/ exists
  seed/
    run-seed.js          # 5. Execute seed function
    e2e-test-data.ts     # 6. Seed data definition
  orchestration/
    seed-e2e-data.sh     # Main script - calls others
```

**When to Refactor:**

- Script exceeds ~200 lines
- Need to reuse components elsewhere
- Testing individual steps becomes important
- Multiple workflows share common operations

**Current Status:** Acceptable for now (178 lines, single workflow).

**Lesson:** Start simple, refactor when complexity justifies it.

---

## Systematic Refactoring Approach

### 1. Identify Issues Without Fixing

**Severity Levels:**

- **CRITICAL**: Security, data loss, production incidents, CI/CD failures
- **HIGH**: Performance, reliability, maintainability blockers
- **MEDIUM**: Code clarity, minor inefficiencies, tech debt
- **LOW**: Style, documentation, nice-to-haves

**Analysis Template:**

```markdown
#### Issue: [Name]

**Severity:** [CRITICAL|HIGH|MEDIUM|LOW]

**Problem:**
[What the code does wrong]

**Why This Is Bad:**

- Impact 1
- Impact 2
- Impact 3

**Root Cause:**
[Why it was implemented this way]

**Proper Solution:**
[Code example]

**Lesson:**
[General principle to remember]
```

### 2. Prioritize Fixes

**Fix Order:**

1. CRITICAL issues (security, data loss, breaking changes)
2. HIGH priority (performance, reliability)
3. MEDIUM priority (tech debt, clarity)
4. LOW priority (polish, documentation)

**Batch Related Fixes:**
Use `multi_replace_string_in_file` for simultaneous related changes:

```typescript
// Example: Fixing timeout, cleanup, and error handling together
;[
  { file: "run-seed.js", fix: "Remove timeout" },
  { file: "run-seed.js", fix: "Add connection cleanup" },
  { file: "run-seed.js", fix: "Specific error catching" },
]
```

### 3. Implement Incrementally

**One Fix at a Time:**

```markdown
1. Mark issue as in-progress
2. Implement fix
3. Test if possible
4. Mark complete
5. Move to next issue
```

**Test After Each Fix:**

```bash
# Quick smoke test
yarn seed:e2e

# Check for errors
echo $?  # Should be 0
```

### 4. Document Learnings

**Capture for Future:**

- What went wrong and why
- What the proper solution is
- General principles to apply elsewhere
- Code examples (before/after)

---

## Testing Best Practices

### Manual Testing Checklist

After refactoring:

```bash
# 1. Clean environment
cd apps/strapi

# 2. Test seeding
yarn seed:e2e

# Expected output:
# ✅ Connected to database: strapi_dev
# ✅ Strapi build verified
# ✅ Database reset complete
# ✅ Build complete
# ✅ Seeding complete
# ✅ Seed verification passed

# 3. Verify in database
# - Open pgAdmin
# - Check pages table
# - Verify page with slug 'e2e-test-page' exists

# 4. Test error handling
# - Rename dist/ to dist_backup/
# - Run yarn seed:e2e
# Expected: Clear error message "Strapi not built"
# - Restore dist/

# 5. Test safety guards (LOCAL ONLY)
# - Temporarily change DB_NAME to not match test|dev|e2e
# - Run yarn seed:e2e
# Expected: Confirmation prompt appears
# - Type 'no' → script cancels
# - Restore DB_NAME
```

### Automated Testing (Future)

```typescript
// tests/integration/seed-e2e.test.ts
describe("E2E Seeding", () => {
  test("creates page with correct structure", async () => {
    // Run seed
    await runSeed()

    // Verify
    const page = await strapi.documents("api::page.page").findOne({
      filters: { slug: "e2e-test-page" },
    })

    expect(page).toBeDefined()
    expect(page.content).toHaveLength(3)
    expect(page.status).toBe("published")
  })

  test("fails gracefully when build missing", async () => {
    // Simulate missing build
    await fs.rm("dist", { recursive: true })

    // Expect error
    await expect(runSeed()).rejects.toThrow("Strapi not built")
  })
})
```

---

## Key Principles Summary

### 1. No Arbitrary Delays

❌ `setTimeout()`, `sleep`, `await new Promise()`  
✅ Explicit async operations, connection pool cleanup

### 2. Specific Error Handling

❌ `catch (error) { /* ignore */ }`  
✅ `catch (error) { if (expected) { /* ok */ } else { throw error } }`

### 3. Single Source of Truth

❌ Verification in bash script AND TypeScript seed  
✅ Verification in one place (inside seed function)

### 4. Safety First

❌ Destructive operations without confirmation  
✅ Environment checks, confirmation prompts, clear warnings

### 5. Remove Dead Code

❌ Logic that can never execute  
✅ Clean, minimal code that actually runs

### 6. Explicit Over Magic

❌ Environment variable switches without explanation  
✅ Clear comments explaining WHY and WHAT

### 7. Separation of Concerns

❌ Everything in one script  
✅ Modular components (when complexity justifies it)

### 8. Prerequisites Over Rebuilding

❌ Rebuild on every run  
✅ Check if build exists, fail with clear instructions

---

## Workflow Template for Future Sessions

### Post-Implementation Review

After completing complex work:

1. **Pause and Assess**

   - "Does this feel rushed or hacky?"
   - "Are there arbitrary timeouts or error suppression?"
   - "Would I be comfortable with this in production?"

2. **Request Analysis**

   ```
   "Let's do a critical thinking review of this implementation.
   Analyze the code for best practice violations and suggest
   systematic improvements."
   ```

3. **Review Findings**

   - Read through all issues identified
   - Agree on severity levels
   - Prioritize fixes

4. **Implement Fixes**

   - One at a time (or batched if related)
   - Test after each fix
   - Update documentation

5. **Document Learnings**
   - Capture in project docs
   - Share with team
   - Reference in future reviews

### Questions to Ask

**Code Quality:**

- Are there any timeouts or delays? Why?
- Is error handling specific or blanket?
- Are there redundant operations?
- Does code that claims to be idempotent actually work?

**Safety:**

- Can this harm production data?
- Are destructive operations guarded?
- Is environment validated?

**Performance:**

- Are we rebuilding unnecessarily?
- Can steps be skipped if prerequisites exist?
- Are we doing redundant work?

**Clarity:**

- Does the code do what it claims?
- Are environment variables used for magic?
- Is intent clear from reading the code?

---

## Conclusion

**The Goal:** Not just "working code" but "production-ready code."

**The Process:**

1. Get it working (rapid iteration, debugging)
2. Make it right (systematic analysis, refactoring)
3. Make it clear (documentation, lessons learned)

**The Outcome:**

- Reliable CI/CD pipelines
- Maintainable codebase
- Knowledge sharing with team
- Higher code quality standards

**Apply This After:**

- Complex integrations (database, APIs, frameworks)
- Sessions with >5 debugging iterations
- Features that work but feel fragile
- Any time you use `setTimeout` to "fix" something

---

## References

**Modified Files:**

- `apps/strapi/scripts/run-seed.js` - Seed runner with proper async handling
- `apps/strapi/scripts/seed-e2e-data.sh` - Orchestration with safety guards
- `apps/strapi/scripts/check-strapi-built.sh` - Prerequisite checker
- `apps/strapi/database/seeds/e2e-test-data.ts` - Factory seed script

**Related Documentation:**

- `DEVELOPMENT_WORKFLOW.md` - General workflow guidelines
- `DATABASE_BACKUP_RESTORE.md` - Database management
- `TROUBLESHOOTING_PLAYBOOK.md` - Common issues and solutions

---

**Last Updated:** 2025-01-XX  
**Author:** Development Team  
**Status:** Living Document (update as standards evolve)
