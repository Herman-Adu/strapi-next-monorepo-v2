# MANDATORY DEVELOPMENT WORKFLOW

**Last Updated:** December 21, 2025

This is the **definitive workflow** for ALL development work in this repository. Every todo list, every feature, every fix follows this exact pattern.

---

## Overview

This workflow ensures:

- ✅ `main` branch always stays clean and deployable
- ✅ All code is tested, built, formatted, and linted locally before commit
- ✅ CI/CD validates everything on GitHub before merge
- ✅ Pull requests create audit trail and enable team collaboration
- ✅ Using `--no-verify` is safe because we've done all checks locally

---

## The Complete Workflow

### **PHASE 1: Branch Creation**

#### 1. Create Feature Branch

```bash
# For new features
git checkout -b feature/descriptive-name

# For bug fixes
git checkout -b fix/issue-description

# For documentation
git checkout -b docs/what-youre-documenting
```

**Rules:**

- ❌ **NEVER** work directly on `main`
- ✅ Branch name describes the work clearly
- ✅ Use prefixes: `feature/`, `fix/`, `docs/`, `refactor/`, `test/`

---

### **PHASE 2: Development & Local Verification**

#### 2. Develop

Make your code changes on the feature branch.

#### 3. Ask User: Environment Check

**Before testing, ALWAYS ask:**

> "Is Docker running? Are both apps running clean on correct ports?"

**Wait for user confirmation** that:

- ✅ Docker is running
- ✅ Strapi running on port 1337 (clean build)
- ✅ Next.js running on port 3000 (clean build)

**DO NOT:**

- ❌ Start servers yourself
- ❌ Change configs unnecessarily
- ✅ Focus on your work, not environment management

#### 4. Test Locally

Run all relevant tests in the user's running environment:

```bash
# E2E tests
yarn workspace @repo/ui playwright test tests/e2e/

# Integration tests
yarn workspace @repo/ui playwright test tests/integration/

# Specific test suite
yarn workspace @repo/ui playwright test tests/e2e/contact-form.spec.ts
```

**All tests must pass before continuing.**

#### 5. Build Locally

```bash
yarn build
```

**Build must succeed before continuing.**

#### 6. Format

```bash
yarn format
```

#### 7. Lint

```bash
yarn lint
```

**Warnings are acceptable, errors are not.**

#### 8. Check Staged

```bash
git status
git diff --cached
```

Review what will be committed.

#### 9. Build Again

```bash
yarn build
```

**Final verification that everything still builds after formatting/linting.**

---

### **PHASE 3: Commit & Push Feature Branch**

#### 10. Commit with `--no-verify`

```bash
git add .
git commit -m "feat: descriptive commit message" --no-verify
```

**Why `--no-verify` is safe:**

- ✅ We already tested locally
- ✅ We already built locally
- ✅ We already formatted locally
- ✅ We already linted locally
- ✅ Husky hook would just duplicate what we've done

**Commit message format:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build process, tooling

#### 11. Push Feature Branch

```bash
git push origin feature/your-branch-name
```

---

### **PHASE 4: Pull Request & Merge (Using GitHub CLI)**

#### 12. Create Pull Request

**Use GitHub CLI to create PR programmatically:**

```bash
gh pr create --title "feat: your descriptive title" \
  --body "Description of changes" \
  --base main
```

**PR Best Practices:**

- Clear title with conventional commit prefix (`feat:`, `fix:`, `docs:`, etc.)
- Detailed description explaining what changed and why
- Link to related issues if applicable

**Alternative:** Create PR manually on GitHub web interface if preferred.

#### 13. Monitor CI/CD Checks

**Use GitHub CLI to monitor workflow status:**

```bash
# Check current status of PR checks
gh pr checks <PR_NUMBER>

# View detailed status with JSON output
gh pr view <PR_NUMBER> --json statusCheckRollup

# Monitor checks in loop (PowerShell - wait for completion)
$i=0; while($i -lt 10) {
  Start-Sleep -Seconds 30
  $result = gh pr checks <PR_NUMBER> 2>&1 | Out-String
  Write-Host "`n=== Check $(($i+1)) ==="
  Write-Host $result
  if($result -match "All checks have passed") { break }
  $i++
}
```

**All GitHub Actions workflows must pass:**

- ✅ Verify build (Lint + Build all apps)
- ✅ E2E Tests (Playwright - MSW Mocked API)
- ✅ Visual Regression Testing (Chromatic - for UI changes)

**Watch for green checkmarks.** Do not merge until all pass.

#### 14. Merge Pull Request

**Once all checks pass, merge using GitHub CLI:**

```bash
# Recommended: Squash merge (clean history) + auto-delete remote branch
gh pr merge <PR_NUMBER> --squash --delete-branch

# Alternative: Merge commit (preserves all commits)
gh pr merge <PR_NUMBER> --merge --delete-branch

# Alternative: Rebase merge (linear history)
gh pr merge <PR_NUMBER> --rebase --delete-branch
```

**Recommended:** Use `--squash` for clean, atomic commits in main branch.

**What this command does:**

1. ✅ Merges PR to main
2. ✅ Automatically deletes remote feature branch
3. ✅ Updates local main branch
4. ✅ Switches to main branch locally

**Manual alternative:** Use GitHub web interface if preferred:

1. Click "Merge pull request" → Choose "Squash and merge"
2. Confirm merge
3. Delete feature branch when prompted

---

### **PHASE 5: Post-Merge Cleanup**

#### 15. Verify Local State

```bash
# Confirm you're on main with merged changes
git status
git log --oneline -3
```

#### 16. Pull Latest (if needed)

```bash
# Only if gh pr merge didn't auto-update
git pull origin main
```

#### 17. Delete Local Feature Branch

```bash
# Only if branch still exists locally
git branch -d feature/your-branch-name
```

#### 18. Clean Up Old Merged Branches (Maintenance)

**Periodically check for stale branches:**

```bash
# List merged PRs
gh pr list --state merged --json number,headRefName,mergedAt --limit 20

# Check if branch is merged to main
git log origin/main --oneline | Select-String "<commit-hash>"

# Delete local merged branch
git branch -d old-feature-branch

# Delete remote merged branch (use carefully!)
gh api -X DELETE /repos/Herman-Adu/strapi-next-monorepo-v2/git/refs/heads/old-branch-name
```

**⚠️ Important:** Always verify branch is merged before deleting!

---

## Quick Reference

```bash
# 1. Create branch
git checkout -b feature/your-feature

# 2-9. Develop, test, build, format, lint, build again
# (Ask user about environment first!)

# 10. Commit
git commit -m "feat: your message" --no-verify

# 11. Push
git push origin feature/your-feature

# 12-14. Create PR, wait for CI/CD, merge on GitHub

# 15-17. Clean up
git checkout main
git pull origin main
git branch -d feature/your-feature
```

---

## Important Notes

### Why This Workflow?

1. **Protection**: `main` is always deployable
2. **Confidence**: Local testing catches issues early
3. **Validation**: CI/CD provides second verification
4. **Collaboration**: PRs enable code review
5. **History**: Clear audit trail of changes
6. **Rollback**: Easy to revert via PR

### When to Use `--no-verify`

**ONLY after completing steps 2-9.** This bypasses the husky pre-commit hook, which is safe because we've already done everything the hook would check.

### Emergency Hotfix to Main

In rare emergencies, you may need to commit directly to `main`. Follow the same steps 2-10, but:

```bash
git checkout main
# ... make changes, test, build, format, lint, build ...
git commit -m "fix: critical hotfix description" --no-verify
git push origin main
```

**Use this ONLY for critical production issues.**

---

## Todo List Pattern

Every todo list created in this repository follows this workflow:

```
1. Create feature branch
2. Develop changes
3. Verify environment ready (ask user)
4. Test locally
5. Build locally
6. Format
7. Lint
8. Build again
9. Commit with --no-verify
10. Push feature branch
11. Create pull request
12. Wait for CI/CD green checks
13. Merge PR to main
14. Pull latest main
15. Delete feature branch
```

---

## Related Documentation

- [Build, Commit, Push Workflow](/docs/06-workflows-build-commit-push)
- [Development Workflow](/docs/06-workflows-development-workflow)
- [Best Practice Checklist](/docs/06-workflows-best-practice-checklist)
- [Pre-Commit Validation](/docs/06-workflows-pre_commit_validation_workflow)
