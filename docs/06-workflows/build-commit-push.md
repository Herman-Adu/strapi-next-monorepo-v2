# Build → Commit → Push Workflow

**Created**: November 19, 2025  
**Last Updated**: November 19, 2025  
**Status**: ✅ Current - PARAMOUNT  
**Audience**: All Developers

---

## Purpose

This document describes the **standardized development workflow** that MUST be followed for all code changes. This process ensures code quality, prevents build errors, and maintains project integrity.

**Herman's Words**: _"it's just yarn build from root to build both apps, one time fresh builds deleting .next and dist folders, this is paramount to the build process"_

---

## The Standard Process (ALWAYS Follow)

### Step 1: Clean Build ⚙️

```powershell
# Delete cache folders (CRITICAL for clean state)
Remove-Item -Recurse -Force apps/ui/.next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force apps/strapi/dist -ErrorAction SilentlyContinue

# Build from root (builds both apps)
yarn build
```

**Expected Time**: ~2m44s  
**Success Criteria**: No TypeScript errors in output

**What This Does**:

- Removes stale Next.js build cache (`.next`)
- Removes stale Strapi build cache (`dist`)
- Compiles both Strapi and Next.js from scratch
- Generates optimized production bundles
- Validates TypeScript types across entire monorepo

---

### Step 2: Verify Build Success ✅

**Check terminal output for**:

- ✅ `Compiled successfully` messages
- ✅ Bundle size reports
- ❌ No red error messages
- ❌ No TypeScript type errors

**If errors**:

- Review error messages carefully
- Fix TypeScript/ESLint errors
- Repeat Step 1 (clean build)

**If success**: Continue to Step 3

---

### Step 3: Commit Changes 📝

```powershell
# Stage all changes
git add .

# Commit with conventional message
git commit -m "feat: description of changes"
```

**Conventional Commit Format**:

| Type       | Usage                                   | Example                                         |
| ---------- | --------------------------------------- | ----------------------------------------------- |
| `feat:`    | New features                            | `feat: add contact form component`              |
| `fix:`     | Bug fixes                               | `fix: resolve newsletter validation error`      |
| `docs:`    | Documentation only                      | `docs: update component development guide`      |
| `style:`   | Formatting, styling (no code change)    | `style: format with Prettier`                   |
| `refactor` | Code restructuring (no feature/fix)     | `refactor: extract gradient utility function`   |
| `test:`    | Adding tests                            | `test: add unit tests for ContactForm`          |
| `chore:`   | Maintenance tasks                       | `chore: delete deprecated tech-stack component` |
| `perf:`    | Performance improvements                | `perf: optimize image loading`                  |
| `ci:`      | CI/CD pipeline changes                  | `ci: update GitHub Actions Node version`        |
| `build:`   | Build system changes                    | `build: update Turbo config`                    |
| `revert:`  | Reverts a previous commit               | `revert: undo component deletion`               |
| `wip:`     | Work in progress (avoid in main branch) | `wip: partial newsletter implementation`        |

**Tips**:

- Keep first line under 72 characters
- Use imperative mood ("add" not "added")
- No period at end of subject line
- Detailed explanation in body (optional)

**Example Detailed Commit**:

```powershell
git commit -m "feat: implement smart divider rendering

- Add getDividerStyles() function to SectionHeader
- Support theme gradients (Tailwind) and custom gradients (inline CSS)
- Reverse color stops for correct visual gradient direction
- Works with default, two-tone, and gradient text styles

Fixes tailwind limitation with arbitrary color values and opacity modifiers.
Divider now matches heading gradient exactly."
```

---

### Step 4: Push to GitHub 🚀

```powershell
git push origin main
```

**What Happens**:

- Code pushed to GitHub repository
- GitHub Actions workflows triggered automatically
- Build verification starts
- Visual regression testing runs
- Lint checks execute

---

### Step 5: Check GitHub Actions ✅

**Critical Step** - Do NOT skip this!

1. **Open GitHub repository** in browser
2. **Go to Actions tab** (top navigation)
3. **Check latest workflow run** (should be your commit)
4. **Verify all workflows pass**:
   - ✅ Verify build / Build all apps (~1m)
   - ✅ Verify build / Lint (~2m)
   - ✅ Visual Regression Testing / Chromatic Visual Tests (~4m)

**If errors detected**:

1. Click on failed workflow
2. Review error logs
3. Fix issues locally
4. **Repeat from Step 1** (clean build)
5. Push again

**If all green** ✅:

- Celebrate! You followed the workflow correctly
- Your changes are now safe in production-ready state
- Team can pull your changes with confidence

---

## Why This Process Matters 🎯

### 1. Clean State (Deleting Cache)

**Problem without clean build**:

- Stale dependencies cause mysterious errors
- Old type definitions conflict with new code
- Build works locally but fails in CI/CD
- Webpack cache issues cause inconsistent behavior

**Solution**:

- Fresh `.next` and `dist` folders every time
- Catches errors early in development
- Ensures reproducible builds

### 2. Early Detection (Build Before Commit)

**Problem**:

- Committing broken code
- Discovering errors in CI/CD (too late)
- Blocking other developers
- Failed deployments

**Solution**:

- TypeScript errors caught immediately
- ESLint violations fixed before push
- Confident commits that won't break main branch

### 3. Build Integrity (CI/CD Environment Match)

**Problem**:

- "Works on my machine" syndrome
- Different environments produce different results
- Production builds fail unexpectedly

**Solution**:

- Local build simulates production build
- Same tools, same process, predictable results
- If it builds locally with clean cache, it builds in CI/CD

### 4. Team Collaboration

**Problem**:

- Other developers pull broken code
- Hours wasted debugging someone else's mistakes
- Trust issues in version control

**Solution**:

- Every commit is verified working code
- Team members can `git pull` with confidence
- Professional development workflow

---

## Common Mistakes to Avoid ❌

### ❌ DON'T:

1. **Skip clean build**
   - "I'll just commit this small change"
   - **Result**: Breaks CI/CD with cache issues
2. **Commit without building**

   - "Build takes too long, I'll commit anyway"
   - **Result**: TypeScript errors discovered in CI/CD

3. **Ignore build warnings**

   - "It's just a warning, not an error"
   - **Result**: Production issues or degraded performance

4. **Push without checking GitHub Actions**

   - "I'll check it later"
   - **Result**: Broken main branch sits for hours

5. **Use `git push --force` on main**
   - "I need to fix my commit history"
   - **Result**: Destroys other people's work

### ✅ DO:

1. **Always delete `.next` and `dist` before building**
   - Takes 1 second, saves hours of debugging
2. **Always build from root before committing**

   - Validates entire monorepo integrity

3. **Always verify build succeeds before committing**

   - Check terminal for "Compiled successfully"

4. **Always check GitHub Actions after pushing**

   - Catch issues before they affect others

5. **Always use conventional commit messages**
   - Enables automatic changelog generation
   - Makes git history searchable

---

## Time Investment ⏱️

| Step                         | Time      |
| ---------------------------- | --------- |
| Clean build (delete cache)   | ~5s       |
| Build both apps              | ~2m44s    |
| Verify success               | ~10s      |
| Commit                       | ~10s      |
| Push                         | ~5s       |
| Check GitHub Actions         | ~30s      |
| **Total per commit**         | **~3-4m** |
| **Alternative (skip steps)** | 0m        |
| **Time spent debugging**     | **Hours** |

**Worth it?** Absolutely! 3 minutes now prevents hours of debugging later.

---

## Troubleshooting Build Errors 🔧

### TypeScript Errors

**Example**:

```
apps/ui/src/components/ContactForm.tsx:45:12 - error TS2322:
Type 'string | undefined' is not assignable to type 'string'.
```

**Fix**:

1. Navigate to the file and line number
2. Fix the TypeScript error
3. Run `yarn build` again
4. Verify error is resolved

### ESLint Errors

**Example**:

```
apps/ui/src/components/Hero.tsx
  12:7  error  'unused' is assigned a value but never used  @typescript-eslint/no-unused-vars
```

**Fix**:

1. Remove unused variable or add `// eslint-disable-next-line`
2. Run `yarn build` again

### Module Not Found

**Example**:

```
Module not found: Can't resolve '@/components/NewComponent'
```

**Fix**:

1. Check import path is correct
2. Verify file exists
3. Check capitalization (case-sensitive!)
4. Run `yarn build` again

### Out of Memory Error

**Example**:

```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
```

**Fix**:

```powershell
# Increase Node.js memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

---

## Advanced: Selective Building 🎓

**For experienced developers only** - generally not recommended.

### Build Only Strapi

```powershell
cd apps/strapi
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
yarn build
```

### Build Only UI

```powershell
cd apps/ui
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
yarn build
```

**Warning**: Building individually doesn't validate cross-app TypeScript types. Always do full build before committing!

---

## GitHub Actions Workflow Details 🤖

### 1. Verify Build (1-2 minutes)

**What it does**:

- Checks out code
- Installs dependencies
- Builds both apps
- Verifies no TypeScript errors

**When it fails**:

- TypeScript errors in code
- Missing dependencies
- Build configuration issues

### 2. Lint (2-3 minutes)

**What it does**:

- Runs ESLint on all code
- Checks code style
- Enforces best practices

**When it fails**:

- ESLint rule violations
- Unused imports
- Console.log statements (in production code)

### 3. Visual Regression Testing (3-5 minutes)

**What it does**:

- Builds Storybook
- Publishes to Chromatic
- Captures screenshots
- Compares with baseline

**When it fails**:

- Unintentional UI changes
- Component rendering errors
- Storybook build failures

---

## Emergency Procedures 🚨

### If You Accidentally Pushed Broken Code

1. **Don't panic** - it happens to everyone
2. **Check GitHub Actions** - identify the error
3. **Fix locally**:
   ```powershell
   # Fix the error in your code
   Remove-Item -Recurse -Force apps/ui/.next, apps/strapi/dist -ErrorAction SilentlyContinue
   yarn build  # Verify fix works
   git add .
   git commit -m "fix: resolve build error from previous commit"
   git push origin main
   ```
4. **Monitor GitHub Actions** - verify fix works
5. **Notify team** - let them know issue is resolved

### If Build Works Locally But Fails in CI/CD

**Possible causes**:

- Different Node.js version
- Missing environment variables
- Cache issues in GitHub Actions

**Solution**:

1. Check Node.js version matches CI/CD (22.x)
2. Verify `.env` files not needed in build
3. Re-run failed workflow (sometimes cache issues resolve)
4. Check GitHub Actions logs for specific error

### If You Need to Revert a Commit

```powershell
# Find the commit to revert
git log --oneline -5

# Revert specific commit (creates new commit)
git revert <commit-hash>
git push origin main

# Or hard reset (if not pushed yet - DESTRUCTIVE!)
git reset --hard HEAD~1  # Go back one commit
# NO PUSH - this changes history
```

**Preferred**: Use `git revert` (creates new commit, preserves history)  
**Dangerous**: Use `git reset --hard` only on local unpushed commits

---

## Success Criteria ✅

**Before you consider your work "done"**:

- [ ] Deleted `.next` and `dist` folders
- [ ] Ran `yarn build` from root
- [ ] Build completed successfully (no errors)
- [ ] Committed with conventional message
- [ ] Pushed to GitHub
- [ ] GitHub Actions all passing (green checkmarks)
- [ ] No errors in logs
- [ ] Team notified (if breaking changes)

---

## Related Documentation

- **Development Workflow**: `docs/06-workflows/development-workflow.md`
- **Component Deletion**: `docs/06-workflows/component-deletion.md`
- **Troubleshooting**: `docs/09-troubleshooting/playbook.md`
- **CI/CD Setup**: `docs/08-devops/ci-cd.md`

---

## Feedback & Updates

**This is a living document**. If you discover:

- Missing steps
- Better procedures
- Common errors not listed
- Clearer explanations needed

**Please update this document** and commit the changes!

---

**Remember**: 3-4 minutes of proper workflow prevents hours of debugging. Build clean, commit smart, push with confidence! 🚀
