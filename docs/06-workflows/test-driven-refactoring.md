# Test-Driven Refactoring Workflow

**Purpose**: Enforce testing discipline to catch bugs at point of introduction

**Created**: November 20, 2025 (After learning this lesson the hard way!)

---

## The Problem We Solved

**Scenario**: Phase 1 component refactoring (6 sections)

- Changed schemas (removed icon relations → added iconType enums)
- Forgot to update middleware populates
- Made 9 commits without testing
- Bug introduced in FIRST commit (f14322d)
- Discovered 9 commits later (92cf304)
- Result: 2+ hours debugging, app completely broken

**Lesson**: Test-driven discipline is NOT optional - it's the ONLY way to catch bugs at point of introduction.

---

## The New Mandatory Process

### Rule #1: One Change, One Test, One Commit

**NEVER batch multiple refactorings without testing each one.**

**Wrong Approach ❌:**

- Refactor Section 1 schema
- Refactor Section 2 schema
- Refactor Section 3 schema
- Update all frontends
- Test once
- Commit all changes
- Bug appears - which section caused it?

**Right Approach ✅:**

- Refactor Section 1 schema
- Update Section 1 middleware
- Update Section 1 frontend
- TEST Section 1 (dev servers + UI)
- COMMIT Section 1 (only if test passes)
- Repeat for Section 2...

---

### Rule #2: Testing is NOT Optional

**Required Testing Phase** (5-10 minutes per change):

```powershell
# 1. Start Strapi
cd apps\strapi
yarn dev
# Wait for "Strapi started successfully"
# Check logs for ValidationError - should be NONE

# 2. Start Frontend (new terminal)
cd apps\ui
yarn dev
# Wait for "Ready in X.Xs"

# 3. Test in Strapi Admin (http://localhost:1337/admin)
- Open Content Manager
- Navigate to page using changed section
- Verify fields appear correctly
- Check browser console - NO errors

# 4. Test in Frontend (http://localhost:3000)
- Navigate to page using changed section
- Verify section renders correctly
- Check browser console - NO errors
- Test all variants/states

# 5. Verify Checklist
- [ ] No ValidationError in Strapi logs
- [ ] No errors in browser console
- [ ] Section renders correctly
- [ ] Strapi admin shows fields properly
- [ ] TypeScript types regenerated (no errors)

# 6. ONLY commit if ALL checks pass
git add .
git commit -m "refactor(SectionName): atomic architecture migration"
```

**Time Investment**: 5-10 minutes per change  
**Time Saved**: Hours of debugging batched changes

---

### Rule #3: Schema Changes REQUIRE Middleware Updates

**When you change a schema, you MUST check if middleware needs updating.**

**Quick Check:**

```
Did you add/remove/change any component or relation fields?
├── YES → Update middleware populate in page.ts
│   └── See docs/03-strapi/middleware-populate-patterns.md
└── NO → Skip middleware update
    └── (Only changed descriptions, validation, defaults)
```

**Examples Requiring Middleware Update:**

- ✅ Removed icon component → Added iconType enum
- ✅ Added authorImage (media relation)
- ✅ Renamed field (old populate references old name)
- ✅ Changed component UID reference

**Examples NOT Requiring Middleware Update:**

- ✅ Changed field description
- ✅ Reordered fields in schema
- ✅ Changed required/unique validation
- ✅ Changed default value

---

## The Complete Test-Driven Workflow

### For Schema Changes (Backend)

```
1. Edit schema JSON file
   ↓
2. Wait for Strapi auto-reload (watch terminal)
   ↓
3. Export Config Sync in Strapi admin
   ↓
4. Check if middleware needs update
   ├── YES: Update apps/strapi/src/documentMiddlewares/page.ts
   └── NO: Skip to next step
   ↓
5. Regenerate types: yarn generate:types
   ↓
6. TEST - Start dev servers
   ├── Check Strapi logs - NO ValidationError
   ├── Check Strapi admin - component appears correctly
   └── Check browser console - NO errors
   ↓
7. ONLY IF ALL TESTS PASS → Commit
   └── git commit -m "refactor(schema): update X section"
```

---

### For Frontend Changes

```
1. Update React component code
   ↓
2. Save file (check for TypeScript errors)
   ↓
3. TEST - Start dev server (if not running)
   ├── Check browser console - NO errors
   ├── Verify component renders correctly
   ├── Test all props/variants
   └── Test responsive design
   ↓
4. ONLY IF ALL TESTS PASS → Commit
   └── git commit -m "refactor(ui): update X component"
```

---

### For Middleware Changes

```
1. Update populate configuration in page.ts
   ↓
2. Save file (check for TypeScript errors)
   ↓
3. Regenerate types (if needed)
   ↓
4. Restart Strapi dev server
   ↓
5. TEST - Check Strapi terminal
   ├── NO ValidationError should appear
   └── Server starts successfully
   ↓
6. TEST - Load page in frontend
   ├── Check browser console - NO errors
   ├── Verify data populates correctly
   └── Check network tab - API returns full data
   ↓
7. ONLY IF ALL TESTS PASS → Commit
   └── git commit -m "fix(middleware): update populate for X"
```

---

## Recovery from Batched Changes

**If you've already made multiple changes without testing:**

1. **Stop Making Changes**: Don't make situation worse
2. **Review Git History**: `git log --oneline -10`
3. **Identify Last Known Good State**: When did app last work?
4. **Test Current State**: Start dev servers, check for errors
5. **If Broken**:
   - Use git bisect to find breaking commit
   - Or rollback to last good state: `git reset --hard <commit-hash>`
   - Or systematically test each change
6. **Fix Issues One by One**:
   - Fix issue
   - Test
   - Commit fix
   - Continue
7. **Learn the Lesson**: Never batch again!

---

## Success Metrics

### Good Session ✅

- 5 components refactored
- Each tested individually
- Each committed separately
- 5 clean commits
- App works after each commit
- Zero debugging time
- **Total time**: 5 × 40 min = 3.3 hours

### Bad Session ❌

- 6 components refactored
- No testing until end
- 1 batched commit
- App broken
- 2+ hours debugging
- Lesson learned the hard way
- **Total time**: 2 hours coding + 2 hours debugging = 4 hours

**Lesson**: Test-driven approach is actually FASTER!

---

## Real-World Example: November 20, 2025

### What Went Wrong

**The Work:**

- Phase 1: Migrate 6 sections to atomic architecture
- Change: icon component → iconType enum (primitive)
- Change: link component → href/newTab (primitives)

**The Violation:**

```
Commit f14322d: Refactor StrapiFeatureGridSection
  ├── Updated schema ✅
  ├── Updated frontend ✅
  └── Forgot middleware ❌ (BUG INTRODUCED!)

Commit 6660f0d: Refactor StrapiWorkflowSection
  ├── Updated schema ✅
  ├── Updated frontend ✅
  └── Forgot middleware ❌ (BUG CONTINUES!)

Commit fd0d9d6: Refactor StrapiFinalCTASection
  ├── Updated schema ✅
  ├── Updated frontend ✅
  └── Forgot middleware ❌ (BUG CONTINUES!)

... 6 more commits ...

Commit 92cf304: Create TestimonialCard molecule
  ├── User demands testing ✅
  ├── Start dev servers ✅
  └── ValidationError appears! 🚨

Result: 2+ hours debugging to find root cause
```

**The Bug:**

```typescript
// Middleware still had:
"sections.final-cta-section": {
  populate: {
    ctaButtons: { populate: { icon: true, link: true } }  // ❌ Fields don't exist!
  }
}

// Schema had changed to:
{
  "ctaButtons": {
    "component": "elements.icon-button"
    // Now has: iconType (enum), href (string), newTab (boolean)
  }
}

// Should have been:
"sections.final-cta-section": {
  populate: {
    ctaButtons: true  // ✅ All primitives
  }
}
```

**The Fix:**

- Time to identify: 1.5 hours
- Time to fix: 2 minutes
- Time if tested after first commit: 2 minutes
- **Time wasted: 1.5 hours**

---

## Automation Opportunities

### Future Improvements

1. **Pre-commit Hook**: Warn if middleware not updated when schema changed
2. **CI/CD Check**: Validate populate patterns match schemas
3. **Type Safety**: TypeScript checks for invalid populate keys
4. **Test Automation**: E2E tests for each section

### For Now

**Manual discipline is required - no shortcuts!**

The human must:

- ✅ Remember to test after EVERY change
- ✅ Remember to update middleware after schema changes
- ✅ Remember to commit only after tests pass
- ✅ Resist the temptation to batch changes

---

## Team Agreement

**All developers must follow this workflow - no exceptions.**

### Rationale

- Protects production app stability
- Catches bugs immediately (cheap to fix)
- Prevents debugging nightmares (expensive to fix)
- Maintains clean git history (easy rollback)
- Professional development practice

### Enforcement

- Code reviews check for batched commits
- Agent reminds about testing before commits
- Pull requests rejected if tests not documented
- Post-mortems for any production bugs

---

## Herman's Wisdom

> "there should be a time when i can run the app and make sure there are no issues"

**Interpretation**: Testing is paramount. Never commit without testing.

> "NO GUESSING... implement it in small manageable testable modules we can commit, to catch errors where they happen"

**Interpretation**: Small commits, test each one, catch bugs immediately.

**Agent's Commitment**: "Test after EVERY change moving forward - no more batching without testing"

---

## Quick Reference Card

### Before Every Commit

- [ ] All files saved
- [ ] Strapi dev server running - NO errors
- [ ] Frontend dev server running - NO errors
- [ ] Browser console clean - NO errors
- [ ] Component renders correctly
- [ ] All variants tested
- [ ] TypeScript types regenerated (if schema changed)
- [ ] Config sync exported (if schema changed)
- [ ] Middleware updated (if field types changed)

### If ANY Check Fails

- ❌ DO NOT commit
- ✅ Fix the issue
- ✅ Re-run all checks
- ✅ Only commit when all pass

---

## Related Documentation

- [Component Development Workflow](/docs/04-components-workflow) - Complete workflow including testing phases
- [Middleware Populate Patterns](/docs/03-strapi-middleware-populate-patterns) - When and how to update middleware
- [Recovery Document](/docs/11-recovery-recovery-document) - November 20, 2025 debugging session context

---

**Last Updated**: November 20, 2025  
**Next Review**: After completing Phase 2 (to refine time estimates)

**Remember**: 5-10 minutes testing saves 2+ hours debugging. Every. Single. Time.
