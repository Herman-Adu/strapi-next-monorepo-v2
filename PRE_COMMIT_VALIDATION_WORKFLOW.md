# Pre-Commit Validation Workflow

## Critical: Manual Validation Required Before Every Commit

**Frequency:** 20+ times per day  
**Environment:** Windows 11, Yarn Monorepo, Husky pre-commit hooks  
**Problem:** Husky hooks can fail unpredictably, blocking commits

---

## The Problem

Husky pre-commit hooks run `lint-staged` which can:

- Fail on edge cases not caught by manual checks
- Block commits even when code is valid
- Waste time debugging hook failures instead of shipping code
- Run slower than manual validation

**Pattern observed:** Manual validation passes → Husky fails → Need bypass

---

## Required Manual Validation (Before EVERY Commit)

### Step 1: Format Check (ALWAYS RUN FIRST)

```bash
# From monorepo root
yarn format:check
```

**Must show:** `All matched files use Prettier code style!`

If fails, run:

```bash
yarn format
```

### Step 2: Lint Check

```bash
# From monorepo root
yarn lint
```

**Must pass** for all workspaces (UI, Strapi)

### Step 3: Build Verification (for code changes)

```bash
# UI changes
yarn build:ui

# Strapi changes
yarn build:strapi

# Everything
yarn build
```

**Must complete** without TypeScript/build errors

### Step 4: Test Verification (if tests exist)

```bash
# E2E tests (if changed e2e files)
yarn workspace @repo/ui playwright test

# Unit tests (if changed src files)
yarn workspace @repo/ui test
```

---

## Commit Strategy

### Option A: Normal Commit (Let Husky Run)

```bash
git add .
git commit -m "feat: your message"
```

**Use when:** You have time to debug if hooks fail

### Option B: Bypass Husky (Recommended After Manual Validation)

```bash
git add .
git commit --no-verify -m "feat: your message"
```

**Use when:**

- ✅ Manual validation passed (format:check, lint, build, tests)
- ✅ You're confident in the changes
- ✅ Husky might fail on edge cases
- ✅ You commit 20+ times/day and need speed

---

## Why Manual Validation First?

1. **Faster feedback loop** - Catches issues immediately vs waiting for hook
2. **Explicit control** - You know exactly what checks ran
3. **Predictable** - Same commands every time, no surprises
4. **Debuggable** - Clear error messages vs cryptic hook failures
5. **Flexible** - Use `--no-verify` when you're confident

---

## CI/CD Safety Net

Even with `--no-verify`, CI workflows will catch issues:

- `.github/workflows/ci.yml` - Runs lint, format:check, build
- `.github/workflows/e2e-tests.yml` - Runs all E2E tests
- Both workflows are blocking - must pass before merge

**Therefore:** `--no-verify` is safe when manual checks pass

---

## Quick Reference Card

```bash
# === BEFORE EVERY COMMIT ===
yarn format:check  # ← ALWAYS
yarn lint          # ← ALWAYS
yarn build:ui      # ← If UI code changed
yarn test:e2e      # ← If tests changed

# === COMMIT ===
git add .
git commit --no-verify -m "type: message"  # ← Safe after validation

# === PUSH ===
git push origin <branch-name>
```

---

## Edge Cases & Troubleshooting

### Husky Hook Fails But Manual Check Passes

**Cause:** lint-staged runs different context than manual commands  
**Solution:** Use `--no-verify` - your manual checks are sufficient

### Format Check Passes, Husky Still Fails

**Cause:** lint-staged might run on files not in staging area  
**Solution:** Use `--no-verify` after confirming `git status` shows only intended files

### Want to See What Husky Would Run

```bash
npx lint-staged --verbose --concurrent false
```

**Note:** This still might fail differently than in git hook context

---

## System Improvement Plan (Future)

Current system issues:

1. Husky context differs from manual command context
2. lint-staged runs unpredictably on Windows
3. No clear feedback why hooks fail vs manual pass
4. Slows down high-frequency commit workflow

**Proposed improvements:**

- [ ] Replace Husky with simpler pre-commit validation
- [ ] Move all validation to CI only (faster local dev)
- [ ] Create custom PowerShell pre-commit script with better error messages
- [ ] Add `--skip-hooks` alias command for validated commits
- [ ] Document exact lint-staged configuration that causes issues

---

## Real-World Usage Pattern

Typical day (20+ commits):

```bash
# Morning - First commit
yarn format:check && yarn lint && yarn build:ui
git add . && git commit --no-verify -m "feat: start feature X"

# Mid-day commits (after testing changes)
yarn format:check  # Quick check
git add . && git commit --no-verify -m "refactor: improve component Y"

# Before lunch - bigger change
yarn format:check && yarn lint && yarn build:ui
git add . && git commit --no-verify -m "feat: complete feature X"

# Afternoon - doc updates
yarn format:check  # Docs don't need build
git add . && git commit --no-verify -m "docs: update README"

# End of day - full verification
yarn format:check && yarn lint && yarn build && yarn test:e2e
git add . && git commit --no-verify -m "test: add E2E coverage"
git push origin fix/e2e-typescript-errors
```

**Key:** Run full validation suite before pushing, use quick checks between commits

---

## Remember

1. **Manual validation is MORE reliable than Husky**
2. **CI is the final safety net** - It will catch what you miss
3. **`--no-verify` is your friend** - Use it after validation
4. **Speed matters** - 20+ commits/day requires efficient workflow
5. **Document issues** - If Husky fails mysteriously, note it here

---

## See Also

- `MONOREPO_COMMAND_REFERENCE.md` - Correct yarn workspace commands
- `.husky/pre-commit` - Current hook configuration
- `.lintstagedrc.js` - lint-staged configuration (apps/ui/)
- `.github/workflows/ci.yml` - CI validation that catches issues
