# 🔄 Recovery Instructions - Start Here Tomorrow

**Last Updated**: November 22, 2025 @ 11:45 PM  
**Next Session**: November 23, 2025 (Morning)  
**Status**: ✅ Ready for Testing Workflow

---

## 🎯 Quick Start - Give Me This Context

When we start tomorrow, give me these files to read in this order:

### 1. Session Review (READ FIRST)

```
Read: docs/11-recovery/SESSION-2025-11-22-REVIEW.md
```

This gives me complete context of what we accomplished today.

### 2. Testing Documentation (Priority Reading)

```
Read: docs/13-testing/README.md
Read: docs/13-testing/storybook/integration.md
Read: docs/13-testing/chromatic/setup.md
```

These are the key docs for tomorrow's testing workflow.

### 3. Documentation Hub

```
Read: docs/00-START-HERE.md
```

Navigation guide to all documentation.

---

## 📊 Current State Snapshot

### ✅ What's Working

- **Documentation Library**: 47 files, 7 categories, role-based navigation
- **Test Data Structure**: Component-based with 4 use case scenarios
- **Build**: Passing (132 static pages, 94 doc routes)
- **Schemas**: All 13 molecules corrected (components*molecules*\*)
- **Architecture**: Clean Server/Client separation
- **Dev Server**: Running on port 3001

### ⚠️ What Needs Work

- **Strapi Content**: Empty (data loss from schema changes)
- **Testing**: Not yet validated
- **Storybook**: Need to review 53 molecule stories
- **Chromatic**: Build 15 needs validation
- **Unit Tests**: Need to write test suites

### 🔄 In Progress

- Nothing - clean state, ready to start fresh

---

## 🚀 Tomorrow's Game Plan

### Phase 1: Morning - Testing Setup (9 AM - 12 PM)

#### Step 1: Start Services (15 min)

```powershell
# Terminal 1: Strapi
cd c:\Users\herma\source\repository\strapi-next-monorepo-v2\apps\strapi
yarn develop

# Terminal 2: Next.js UI
cd c:\Users\herma\source\repository\strapi-next-monorepo-v2\apps\ui
yarn dev

# Terminal 3: Storybook
cd c:\Users\herma\source\repository\strapi-next-monorepo-v2
yarn storybook
```

#### Step 2: Review Testing Docs (90 min)

1. Read Testing Strategy (45 min)
2. Read Storybook Integration (30 min)
3. Read Chromatic Setup (15 min)
4. Take notes on test approach

#### Step 3: Storybook Review (45 min)

1. Open Storybook (http://localhost:6006)
2. Review 53 molecule stories
3. Check atomic design organization
4. Verify visual consistency
5. Document any issues

#### Step 4: Chromatic Validation (30 min)

1. Review Build 15 baseline
2. Understand snapshot approach
3. Plan for future UI changes
4. Document baseline state

---

### Phase 2: Afternoon - Content & Testing (1 PM - 5 PM)

#### Step 5: Strapi Content Population (90 min)

**Use Test Data Library** (`/docs` → Content Management → Test Data Library)

**Priority Order**:

1. **Testimonials** (15 min)

   - Open: `test-data/molecules/testimonial-card.md`
   - Choose use case (e.g., Web Development Agency 💻)
   - Copy 3 testimonials
   - Paste into Strapi → Collection Type → Testimonial Card
   - Upload avatar images

2. **Features/Benefits** (20 min)

   - Open: `test-data/sections/benefits.md`
   - Choose same use case
   - Copy 6 benefit cards
   - Create in Strapi → Benefits Section

3. **Metrics** (15 min)

   - Open: `test-data/sections/metrics.md`
   - Copy 4 stat cards
   - Create in Strapi

4. **Tech Stack** (20 min)

   - Open: `test-data/sections/tech-stack.md`
   - Upload logos (Next.js, TypeScript, etc.)
   - Create tech stack section

5. **Partners** (20 min)
   - Open: `test-data/sections/partners.md`
   - Create partner/client showcase

**Verify Content**:

- Check all content renders in UI
- Test responsive behavior
- Verify Strapi → Next.js data flow

#### Step 6: Unit Testing Setup (60 min)

1. Review Vitest config
2. Choose first component to test
3. Write example test suite
4. Run tests: `yarn test`
5. Document testing patterns

#### Step 7: E2E Planning (30 min)

1. Review Playwright config
2. List critical user flows
3. Plan test scenarios
4. Document approach

---

## 🎯 Success Criteria for Tomorrow

By end of day, we should have:

### Testing

- ✅ Storybook reviewed and documented
- ✅ Chromatic baseline validated
- ✅ At least 1 unit test suite written
- ✅ E2E test plan documented

### Content

- ✅ Testimonials populated (min 3)
- ✅ Benefits section populated
- ✅ Metrics section populated
- ✅ Content rendering correctly in UI

### Documentation

- ✅ Testing results documented
- ✅ Issues logged (if any)
- ✅ Next steps identified

---

## 📋 Pre-Session Checklist

Before we start tomorrow, verify:

```
[ ] All services stopped from today
[ ] Clean terminal state
[ ] No pending git changes (we'll commit when ready)
[ ] Fresh coffee ☕
[ ] Context files ready to share with me
```

---

## 🐛 Known Issues

### Non-Critical

1. **Czech Locale Warnings** - Missing `cs` locale navbar/footer in Strapi

   - Impact: Build warnings only
   - Fix: Low priority

2. **Sentry Deprecation** - `sentry.client.config.ts` naming
   - Impact: Warning only
   - Fix: Rename to `instrumentation-client.ts` (future task)

### Critical (Resolved)

- ~~Doubled Strapi content~~ → Fixed via schema names
- ~~Docs 404 errors~~ → Fixed via loader path
- ~~Client Component architecture violation~~ → Fixed via Server/Client split
- ~~Dev server cache error~~ → Fixed via cache clear

---

## 💡 Pro Tips for Tomorrow

### When Giving Me Context

```
"Read these files for context:
1. docs/11-recovery/SESSION-2025-11-22-REVIEW.md
2. docs/13-testing/README.md
3. docs/13-testing/storybook/integration.md

Current state: Documentation reorganized (47 files), test data structured,
build passing. Need to start testing workflow and populate Strapi content."
```

### If Something Breaks

1. Check this recovery doc first
2. Review session review doc
3. Check build output
4. Clear cache if needed: `Remove-Item -Recurse -Force apps/ui/.next`

### Test Data Quick Access

Navigate to: `http://localhost:3001/docs`
→ Content Management category
→ Test Data Library
→ Choose component → Choose use case → Copy-paste

---

## 📁 Important File Paths

### Documentation

- Session Review: `docs/11-recovery/SESSION-2025-11-22-REVIEW.md`
- Recovery Doc: `docs/11-recovery/recovery-document.md` (old)
- Testing Hub: `docs/13-testing/README.md`
- Test Data: `docs/07-content-manager/test-data/`

### Code

- Doc Loader: `apps/ui/src/lib/docs/loader.ts`
- Doc Types: `apps/ui/src/lib/docs/types.ts`
- Sidebar: `apps/ui/src/components/docs/DocsSidebar.tsx`
- Client Sidebar: `apps/ui/src/components/docs/DocsSidebarClient.tsx`

### Configs

- Strapi: `apps/strapi/`
- Next.js: `apps/ui/next.config.mjs`
- Storybook: `.storybook/`
- Vitest: `apps/ui/vitest.config.ts`
- Playwright: `apps/ui/playwright.config.ts`

---

## 🔗 Quick Commands Reference

### Development

```powershell
# Start everything (3 terminals)
cd apps/strapi && yarn develop
cd apps/ui && yarn dev
yarn storybook

# Build
yarn build:ui

# Tests
yarn test                    # Vitest
yarn test:e2e               # Playwright
yarn chromatic              # Visual regression
```

### Git

```powershell
# Status
git status

# Add all
git add .

# Commit (after build passes!)
git commit -m "feat: description"

# Push
git push
```

### Troubleshooting

```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force apps/ui/.next

# Clear all node_modules (nuclear option)
Remove-Item -Recurse -Force node_modules
yarn install
```

---

## 🎓 Key Learnings from Today

1. **Always build before commit** - Caught multiple errors
2. **Cache issues are real** - Clear .next when weird errors appear
3. **Server/Client boundaries matter** - Next.js 15 is strict
4. **Documentation is infrastructure** - Invest in good structure
5. **Test data = productivity** - Organized test data saves hours

---

## 🚨 Emergency Contacts

### If Build Fails

1. Check error message
2. Look for type errors
3. Verify all imports
4. Clear cache
5. Check this recovery doc

### If Dev Server Fails

1. Check port availability (3000/3001)
2. Clear `.next` cache
3. Restart with fresh terminal
4. Check Strapi connection

### If Lost Context

1. Read `SESSION-2025-11-22-REVIEW.md`
2. Check git log: `git log --oneline -10`
3. Review this recovery doc
4. Start services and explore

---

## ✅ Pre-Commit Checklist (When Ready)

```
[ ] Build passes: yarn build:ui
[ ] No TypeScript errors
[ ] All tests passing (when we write them)
[ ] Storybook builds
[ ] Content renders in UI
[ ] Documentation updated
[ ] Git status clean (or intentional changes only)
[ ] Meaningful commit message ready
```

---

## 📝 Commit Message Template (When Ready)

```
feat(testing): complete testing workflow setup and content population

- Reviewed and validated all testing documentation
- Set up Storybook with 53 molecule stories
- Validated Chromatic Build 15 baseline
- Populated Strapi content using test data library:
  - 3 testimonials (Web Agency use case)
  - 6 benefits cards
  - 4 metrics
  - Tech stack logos
  - Partner showcase
- Wrote first unit test suite with Vitest
- Documented E2E testing approach for Playwright

All content rendering correctly. Testing infrastructure validated.
Ready for comprehensive test suite development.
```

---

## 🎯 Tomorrow's Success Mantra

> "Test early, test often, document everything."

We're shifting from **infrastructure building** to **validation**.

Today we built:

- Documentation system ✅
- Test data architecture ✅
- Clean codebase ✅

Tomorrow we validate:

- Testing tools work ✓
- Content flows correctly ✓
- Everything integrates smoothly ✓

---

**Status**: 🟢 Ready to Rock Tomorrow!

**See you in the morning!** ☀️🚀
