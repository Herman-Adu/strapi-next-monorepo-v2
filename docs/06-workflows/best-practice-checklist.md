# Best Practice Checklist - Required for Every Solution

## Pre-Implementation Checklist

Before proposing ANY solution (fix, feature, refactor), verify:

### 1. Root Cause Understanding ✓

- [ ] **Do I understand WHY the error occurs?** (Not just "what" the error is)
- [ ] **Have I traced the error to its source?** (Stack trace, logs, code flow)
- [ ] **Can I explain the root cause in one sentence?**

**❌ BAD:** "Let me add a try-catch to suppress the error"  
**✅ GOOD:** "The Tarn connection pool throws 'aborted' asynchronously during shutdown because pending operations are cancelled. A global unhandledRejection handler can catch this specific error."

---

### 2. Solution Alignment with Best Practices ✓

- [ ] **Does my solution follow documented best practices?** (Check existing docs)
- [ ] **Am I adding complexity or removing it?**
- [ ] **Will future developers understand this code in 6 months?**

**❌ BAD:** Add triple error handlers "just in case"  
**✅ GOOD:** Use the simplest handler that addresses the root cause

---

### 3. Error Handling Validation ✓

- [ ] **Am I catching specific errors, not blanket errors?**
- [ ] **Do I re-throw unexpected errors?**
- [ ] **Are success messages accurate?** (Not printed when errors occur)

**❌ BAD:**

```javascript
try {
  await operation()
} catch (err) {
  // Suppress all errors
}
console.log("✅ Success") // Printed even on error
```

**✅ GOOD:**

```javascript
try {
  await operation()
  console.log("✅ Success") // Only printed if no error
} catch (err) {
  if (err.message.includes("expected-error")) {
    // Handle specific case
  } else {
    throw err // Re-throw unexpected errors
  }
}
```

---

### 4. No Arbitrary Delays ✓

- [ ] **Am I using setTimeout/sleep to "fix" async issues?**
- [ ] **Have I found the proper async operation to await?**

**❌ BAD:**

```javascript
await operation()
await new Promise((resolve) => setTimeout(resolve, 2000)) // "Give it time to finish"
await cleanup()
```

**✅ GOOD:**

```javascript
await operation()
await operation.waitForComplete() // Explicit async operation
await cleanup()
```

---

### 5. Single Responsibility ✓

- [ ] **Does each function/handler have ONE clear job?**
- [ ] **Am I duplicating error handling in multiple places?**

**❌ BAD:** Global handler + try-catch + top-level catch all doing the same thing  
**✅ GOOD:** ONE handler in the appropriate place

---

## Implementation Checklist

During implementation:

### 6. Test Each Layer ✓

- [ ] **Does removing this code break anything?**
- [ ] **Can I prove this code actually runs?** (Add console.log temporarily)

**Example:** If you have 3 error handlers, comment out 2 and verify the 3rd works alone.

---

### 7. Simplicity First ✓

- [ ] **Can I solve this with LESS code?**
- [ ] **Am I adding defensive layers that don't execute?**

**❌ BAD:** Add 5 safety nets "just in case"  
**✅ GOOD:** Add 1 safety net where it's actually needed

---

### 8. Documentation Alignment ✓

- [ ] **Does my code contradict our own documentation?**
- [ ] **Would this pass the review process we documented?**

**Check against:** `CRITICAL_THINKING_WORKFLOW.md`, `DEVELOPMENT_GUIDE.md`

---

## Post-Implementation Checklist

After implementing:

### 9. Code Review (Self) ✓

- [ ] **Read the code as if seeing it for the first time**
- [ ] **Does it follow the principles in CRITICAL_THINKING_WORKFLOW.md?**
- [ ] **Would I approve this in a pull request?**

---

### 10. Final Verification ✓

- [ ] **No arbitrary timeouts** (setTimeout, sleep)
- [ ] **No blanket error suppression** (empty catch blocks)
- [ ] **No redundant operations** (same check in multiple places)
- [ ] **No dead code** (code that never executes)
- [ ] **No misleading messages** (success when failed)
- [ ] **Single exit points** (one place where process.exit() runs)

---

## Red Flags - Stop and Rethink

If you encounter these, STOP and re-evaluate:

🚨 **"Let me try adding a timeout"** → Find the proper async operation  
🚨 **"Let me suppress all errors"** → Catch specific errors only  
🚨 **"Let me add another try-catch just in case"** → One handler is enough  
🚨 **"I'm not sure why this works"** → Understand before committing  
🚨 **"This violates our guidelines, but..."** → No exceptions without team discussion

---

## Decision Tree for Error Handling

```
Error occurs
    ↓
Do I understand the root cause?
    ├─ NO → Research more (stack trace, logs, source code)
    └─ YES ↓

Is this error expected in normal operation?
    ├─ YES → Catch specifically, log if needed, continue
    └─ NO ↓

Can I prevent this error from occurring?
    ├─ YES → Fix the root cause (preferred)
    └─ NO (external library, known issue) ↓

Where in the control flow does this error occur?
    ├─ Synchronously in try block → try-catch
    ├─ Asynchronously after await → try-catch
    └─ Asynchronously outside control flow → global handler

Implement the SINGLE handler in the right place
    ↓
Test that it works
    ↓
Remove any redundant handlers
```

---

## Examples: Good vs Bad

### Example 1: Async Cleanup Error

**❌ BAD (Triple Error Handling):**

```javascript
// Global handler
process.on("unhandledRejection", (err) => {
  if (err.message.includes("aborted")) return
})

// Try-catch handler
try {
  await cleanup()
} catch (err) {
  // Suppress all errors
}

// Top-level handler
.catch((err) => {
  if (err.message.includes("aborted")) {
    process.exit(0)
  }
})
```

**✅ GOOD (Single Handler):**

```javascript
// Only the global handler - it's the only one that actually catches it
process.on("unhandledRejection", (err) => {
  if (err.message && err.message.includes("aborted")) {
    // Known Tarn connection pool issue - safe to ignore
    return
  }
  console.error("Unexpected rejection:", err)
  process.exit(1)
})

// Simple cleanup - let global handler catch async errors
finally {
  if (instance) {
    await instance.destroy()
  }
}
```

---

### Example 2: Verification

**❌ BAD (Redundant Checks):**

```bash
# In bash script
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM pages..."

# In JavaScript
const count = await strapi.db.query("pages").count()

# Both checking the same thing
```

**✅ GOOD (Single Source of Truth):**

```typescript
// Only in seed script, before Strapi shutdown
const count = await strapi.documents("api::page.page").count({
  filters: { slug: "test-page" },
})

if (count !== 1) {
  throw new Error(`Expected 1 page, found ${count}`)
}
```

---

## Integration with Workflow

### When to Use This Checklist

**EVERY TIME you:**

1. Propose a solution to a bug/error
2. Implement a new feature
3. Refactor existing code
4. Review someone else's code

**Workflow:**

1. ✅ Problem identified
2. ✅ Run through Pre-Implementation Checklist
3. ✅ Implement solution
4. ✅ Run through Implementation Checklist
5. ✅ Test solution
6. ✅ Run through Post-Implementation Checklist
7. ✅ **Only then:** Commit code

---

## Critical Principle

> **"Working" is not the same as "correct"**

Code that passes tests but violates best practices is technical debt.  
Always choose correctness over expediency.

---

## When in Doubt

Ask these questions:

1. **What is the root cause?** (One sentence explanation)
2. **Why does my solution work?** (Not "what" it does, but "why")
3. **Is this the simplest solution?** (Can I remove code and still solve it?)
4. **Does this follow our documented guidelines?** (Check against docs)
5. **Would I approve this in code review?** (Be honest)

If you can't answer all 5 confidently, keep refining.

---

## Success Metrics

You're following best practices when:

✅ Solutions are simple and obvious  
✅ Error handling is specific, not defensive  
✅ No "safety nets" that never execute  
✅ Code matches documented principles  
✅ You can explain WHY it works in one sentence  
✅ No arbitrary delays or "give it time" code  
✅ Future you would understand this code

---

## Reminder

This checklist exists because we learned the hard way:

- We added triple error handling for one problem
- We used empty catch blocks after documenting "never suppress errors"
- We added timeouts instead of finding the async operation
- We guessed at solutions instead of understanding root causes

**Don't repeat our mistakes. Use this checklist EVERY TIME.**

---

## Real-World Case Study

For a comprehensive example of applying this checklist to refactor from "quick fixes" to best practices, see:

**[E2E Seeding Case Study](/docs/13-testing-e2e-strapi-seeding-case-study)**

**What You'll Learn:**

- ✅ How to identify and understand root causes (Tarn async error)
- ✅ Why defensive programming fails (triple error handlers)
- ✅ The value of simplicity (one handler vs three)
- ✅ How to systematically refactor existing code
- ✅ Testing each layer to prove what actually works

**Key Lessons from the Case Study:**

1. **Understand Before Implementing**

   - Issue: Tarn connection pool throws "aborted" error asynchronously
   - Root Cause: Error occurs AFTER all try-catch blocks complete
   - Solution: Global `unhandledRejection` handler (only option that works)

2. **Avoid Defensive Programming**

   - Bad: Added 3 error handlers "just in case"
   - Good: Tested each handler, removed 2 that never executed
   - Result: 60% less code, same functionality

3. **No Arbitrary Timeouts**

   - Bad: `await new Promise(resolve => setTimeout(resolve, 2000))` before cleanup
   - Good: Removed timeout, let proper async operations complete
   - Why: Non-deterministic, masks underlying issues

4. **Specific Error Handling**

   - Bad: `catch (err) { /* suppress all errors */ }`
   - Good: `if (err.message?.includes("aborted")) return; else throw`
   - Why: Only suppress known errors, fail loudly on unexpected ones

5. **Single Responsibility**
   - Bad: External verification + internal verification (redundant)
   - Good: Single verification inside seed script before shutdown
   - Why: One source of truth, clear ownership

**Before Reading the Case Study:**
Go through the Pre-Implementation Checklist (items 1-5) to understand what we should have done.

**While Reading:**
Notice how each issue maps to a checklist item we violated.

**After Reading:**
You'll understand why this checklist exists and how to apply it systematically.

---

**Last Updated:** 2025-11-30  
**Status:** Living Document - Update when patterns emerge  
**Related Docs:**

- [E2E Seeding Case Study](/docs/13-testing-e2e-strapi-seeding-case-study) - Real-world example
- [E2E Testing Guide](/docs/readme) - Testing best practices
- [Test Data Seeding](/docs/13-testing-e2e-test-data-seeding) - Practical implementation
- `DEVELOPMENT_GUIDE.md` - General development workflow
