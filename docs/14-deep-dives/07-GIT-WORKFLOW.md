# 🔄 Git Workflow Guide: Milestone Commits & Best Practices

**Purpose**: Master Git workflows for professional development  
**Time**: 45 minutes to read, lifetime to master  
**Audience**: Developers moving from solo to team workflows

---

## 📋 Overview

Git is more than version control—it's your project's time machine, collaboration hub, and deployment pipeline foundation. This guide covers:

- **Conventional Commits**: Industry-standard commit message format
- **Branching Strategies**: Feature branches, hotfixes, releases
- **Milestone Commits**: Major phase completion best practices
- **Team Collaboration**: Pull requests, code reviews, conflict resolution
- **Git Hygiene**: Keeping history clean and useful

**Philosophy**: Your Git history should tell a story, not a mystery.

---

## 🎯 Quick Start: Essential Commands

```powershell
# Daily workflow
git status              # Check what changed
git add .               # Stage all changes
git commit -m "msg"     # Commit with message
git push                # Push to remote

# View history
git log --oneline       # Compact log
git log --graph         # Visual branch structure

# Undo mistakes
git reset HEAD~1        # Undo last commit (keep changes)
git checkout -- file    # Discard changes to file

# Branching
git checkout -b feat/new-feature  # Create and switch to branch
git merge main          # Merge main into current branch
git rebase main         # Rebase current branch onto main
```

**Use this when**: You need quick reference during development

---

## 📝 Part 1: Conventional Commits (20 minutes)

### Why Conventional Commits?

**Problem**: Inconsistent commit messages make history useless

```
❌ "fixed stuff"
❌ "updates"
❌ "asdfasdf"
❌ "final final FINAL version"
```

**Solution**: Structured format that conveys meaning

```
✓ "feat(page-builder): add hero section component"
✓ "fix(api): resolve populate middleware caching issue"
✓ "docs(strapi): add Strapi 5 beginner guide"
```

**Benefits**:

- Automated CHANGELOG generation
- Semantic versioning automation
- Easier Git history navigation
- CI/CD triggers based on commit type
- Better team communication

---

### The Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Components**:

1. **Type**: What kind of change (required)
2. **Scope**: What part of codebase (optional but recommended)
3. **Subject**: Brief description (required, max 50 chars)
4. **Body**: Detailed explanation (optional, max 72 chars/line)
5. **Footer**: Breaking changes, issues closed (optional)

---

### Commit Types

| Type       | Use Case                | Example                                         |
| ---------- | ----------------------- | ----------------------------------------------- |
| `feat`     | New feature             | `feat(auth): add OAuth Google login`            |
| `fix`      | Bug fix                 | `fix(api): handle null response in middleware`  |
| `docs`     | Documentation only      | `docs(readme): update installation steps`       |
| `style`    | Code formatting         | `style(header): fix indentation`                |
| `refactor` | Code restructure        | `refactor(utils): extract validation logic`     |
| `perf`     | Performance improvement | `perf(populate): reduce queries from 147 to 23` |
| `test`     | Add/update tests        | `test(auth): add login integration tests`       |
| `build`    | Build system changes    | `build(webpack): optimize bundle splitting`     |
| `ci`       | CI/CD changes           | `ci(github): add automated deployment`          |
| `chore`    | Maintenance             | `chore(deps): update Strapi to 5.29.0`          |
| `revert`   | Revert previous commit  | `revert: "feat(auth): add OAuth"`               |

---

### Scope Guidelines

**Scopes match your project structure**:

```
apps/strapi/     → (strapi), (api), (content-types)
apps/ui/         → (ui), (components), (pages)
packages/design-system/ → (design-system)
docs/            → (docs)
```

**Examples**:

```bash
# Strapi backend
feat(strapi): add employee tracking content type
fix(api): resolve CORS configuration for production

# Frontend
feat(ui): implement dark mode toggle
fix(components): button accessibility improvements

# Documentation
docs(strapi): add advanced performance guide
docs(docker): document multi-stage build process

# Infrastructure
chore(docker): optimize Dockerfile for smaller images
ci(github): add automated testing workflow
```

**No scope** (when change affects entire project):

```bash
chore: update Node.js to v22
docs: add contributing guidelines
```

---

### Writing Good Subjects

**Rules**:

- **Max 50 characters** (enforced by Commitlint)
- **Imperative mood**: "add" not "added", "fix" not "fixed"
- **No period** at end
- **Lowercase** (except proper nouns)
- **Be specific** but concise

**Examples**:

❌ **Bad**:

```
"Updated the thing"                    # What thing?
"Fixed bug"                            # Which bug?
"Added feature for pages"              # Which feature?
"Improvements to performance"          # How improved?
```

✓ **Good**:

```
"add populate middleware for pages"
"fix populate caching issue"
"add hero section component"
"reduce API response time by 94%"
```

---

### Writing Helpful Bodies

**When to include a body**:

- Complex changes needing explanation
- Breaking changes
- Performance improvements (show metrics)
- Bug fixes (explain root cause)

**Format**:

```
<type>(<scope>): <subject>
[blank line]
Explain the motivation for the change.
Show before/after if applicable.
Explain implementation decisions.
[blank line]
<footer if needed>
```

**Example 1: Performance Improvement**

```bash
git commit -m "perf(populate): implement selective population middleware

Before: 8.3 seconds, 147 queries, 2.3MB response
After: 480ms, 23 queries, 120KB response

Implementation:
- Added populate middleware in apps/strapi/src/documentMiddlewares/page.ts
- Conditional trigger based on middlewarePopulate parameter
- 18 section-specific population rules
- Caching strategy for repeated queries

Impact: 94% faster page loads, $66,400/year value

Related: DEVELOPMENT_GUIDE.md section 3.2"
```

**Example 2: Breaking Change**

```bash
git commit -m "feat(api)!: change page API response structure

BREAKING CHANGE: Page API now returns flat attributes

Before:
{
  data: {
    id: 1,
    attributes: { title: "..." }
  }
}

After:
{
  id: 1,
  title: "...",
  sections: [...]
}

Migration:
- Update frontend API calls to expect flat structure
- Remove .attributes access in components
- Run migration script: yarn migrate:api-v2

Rationale: Simpler frontend code, 30% smaller responses

Resolves: #123"
```

**Example 3: Bug Fix**

```bash
git commit -m "fix(middleware): resolve populate caching issue

Issue: Populate middleware cached incorrectly across requests,
causing stale data to be served to users.

Root cause: Cache key didn't include document ID, so all pages
shared the same cached populated data.

Fix:
- Added documentId to cache key
- Implemented per-document cache invalidation
- Added cache expiry (5 minutes)

Testing: Verified with load test (100 concurrent users)

Closes: #456"
```

---

### Footer Convention

**Breaking Changes**:

```
BREAKING CHANGE: <description>
```

**Closes Issues**:

```
Closes: #123
Resolves: #456
Fixes: #789
```

**References**:

```
Related: DEVELOPMENT_GUIDE.md
See also: docs/14-deep-dives/strapi-5/03-ADVANCED.md
```

---

## 🌿 Part 2: Branching Strategy (15 minutes)

### Branch Naming Convention

```
<type>/<short-description>
```

**Types**:

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code restructuring
- `perf/` - Performance improvements
- `hotfix/` - Urgent production fixes
- `release/` - Release preparation

**Examples**:

```bash
feat/employee-tracking-plugin
fix/populate-middleware-caching
docs/phase-3-completion
refactor/component-architecture
perf/api-response-optimization
hotfix/critical-security-patch
release/v2.0.0
```

---

### Workflow: Feature Branch

**1. Create Branch**:

```powershell
# From main/master
git checkout main
git pull origin main

# Create feature branch
git checkout -b feat/hero-section-component
```

**2. Work on Feature**:

```powershell
# Make changes
# ... edit files ...

# Stage and commit
git add src/components/HeroSection.tsx
git commit -m "feat(components): add hero section component"

# Continue working
# ... more changes ...
git commit -m "feat(components): add hero variant with image"
```

**3. Keep Branch Updated**:

```powershell
# Option A: Merge (preserves history)
git checkout main
git pull origin main
git checkout feat/hero-section-component
git merge main

# Option B: Rebase (linear history)
git checkout feat/hero-section-component
git rebase main
```

**4. Push to Remote**:

```powershell
# First push
git push -u origin feat/hero-section-component

# Subsequent pushes
git push
```

**5. Create Pull Request**:

- GitHub/GitLab/Bitbucket UI
- Fill in PR template
- Request code review
- Address feedback
- Merge when approved

---

### Workflow: Hotfix

**When**: Critical production bug needs immediate fix

```powershell
# 1. Create hotfix branch from production
git checkout production  # or main
git pull origin production
git checkout -b hotfix/critical-auth-vulnerability

# 2. Make the fix
# ... edit files ...
git commit -m "fix(auth)!: patch critical JWT vulnerability

BREAKING CHANGE: All existing tokens invalidated

Issue: JWT secret was leaked in public repo
Fix: Rotated JWT secret, invalidated all tokens
Action required: Users must re-authenticate

Resolves: SECURITY-001"

# 3. Push and deploy immediately
git push -u origin hotfix/critical-auth-vulnerability

# 4. Merge to production AND main
git checkout production
git merge hotfix/critical-auth-vulnerability
git push origin production

git checkout main
git merge hotfix/critical-auth-vulnerability
git push origin main
```

---

### Workflow: Release

**When**: Preparing for production deployment

```powershell
# 1. Create release branch
git checkout main
git pull origin main
git checkout -b release/v2.0.0

# 2. Bump version
# Update package.json, CHANGELOG.md, etc.
git commit -m "chore(release): bump version to 2.0.0"

# 3. Final testing
yarn test
yarn build

# 4. Tag release
git tag -a v2.0.0 -m "Release version 2.0.0

Features:
- Employee tracking plugin
- Advanced page builder
- Performance optimizations (94% faster)

Breaking changes:
- New API response structure
- Removed deprecated endpoints

Migration guide: docs/MIGRATION_v2.md"

# 5. Merge to production and main
git checkout production
git merge release/v2.0.0
git push origin production
git push origin v2.0.0  # Push tag

git checkout main
git merge release/v2.0.0
git push origin main
```

---

## 🏆 Part 3: Milestone Commits (10 minutes)

### What is a Milestone Commit?

**Definition**: Commit marking completion of major project phase

**Examples**:

- Phase 1 complete (foundation)
- Phase 2 complete (performance optimization)
- Phase 3 complete (documentation)
- MVP launch
- Production deployment
- Major refactor completion

**Purpose**:

- Clear project history checkpoints
- Team alignment on progress
- Celebration moments
- Rollback points if needed

---

### Milestone Commit Template

```bash
git commit -m "<type>(milestone): <phase name> complete

Major additions:
- Feature/improvement 1
- Feature/improvement 2
- Feature/improvement 3

Value delivered:
- Metric 1: X improvement
- Metric 2: $Y annual value
- Metric 3: Z% faster/better

Technical details:
- Files changed: N
- Lines added: +X
- Lines removed: -Y
- New features: Z

Impact:
- Team: How this helps team
- Users: How this helps users
- Business: ROI and strategic value

Breaking changes: None/Listed below
Migrations required: None/Listed below

Resolves: Issue numbers
Related: Documentation links

Next phase: Brief preview of what's next"
```

---

### Example: Phase 3 Documentation Complete

```bash
git commit -m "docs(milestone): phase 3 technical documentation complete

Major additions:
- Strapi 5 mastery series (4 articles: beginner → best practices)
- Docker containerization guides (2 articles: fundamentals → production)
- Complete transformation journey review
- Pre-commit testing & Git finalization guide
- Git workflow & best practices guide

Value documented: $530,100 (3 years)
Learning time: 480 minutes of structured content
Code examples: 175+ real implementations
Diagrams: 30+ Mermaid visualizations

Articles created:
- docs/14-deep-dives/strapi-5/01-BEGINNER.md (45 min)
- docs/14-deep-dives/strapi-5/02-INTERMEDIATE.md (60 min)
- docs/14-deep-dives/strapi-5/03-ADVANCED.md (75 min)
- docs/14-deep-dives/strapi-5/04-BEST-PRACTICES.md (90 min)
- docs/14-deep-dives/docker/01-FUNDAMENTALS.md (50 min)
- docs/14-deep-dives/docker/02-PRODUCTION.md (70 min)
- docs/14-deep-dives/05-TRANSFORMATION-JOURNEY.md (45 min)
- docs/14-deep-dives/06-PRE-COMMIT-CHECKLIST.md (30 min)
- docs/14-deep-dives/07-GIT-WORKFLOW.md (45 min)

Impact:
- Team: Onboarding time reduced from 2 weeks to 2 days
- Users: Better quality through documented best practices
- Business: $176,700/year automation value, 6x team velocity

Technical metrics:
- Files changed: 15
- Lines added: +5,000
- Documentation coverage: 100% of core features
- Knowledge retention: Permanent (no tribal knowledge)

Breaking changes: None
Migrations required: None

Related documentation:
- README.md updated with learning paths
- docs/README.md with navigation
- Cross-references validated

Next phase: Phase 4 - Advanced features (employee tracking plugin, advanced SEO)

Resolves: Phase 3 milestone"
```

---

## 👥 Part 4: Team Collaboration (10 minutes)

### Pull Request Best Practices

**Before Creating PR**:

```powershell
# 1. Update your branch
git checkout main
git pull origin main
git checkout your-feature-branch
git rebase main  # or merge main

# 2. Run pre-commit checks
yarn typecheck
yarn lint
yarn format:check
yarn build

# 3. Push
git push origin your-feature-branch
```

**PR Title**: Same as commit message format

```
feat(component): add hero section with variants
```

**PR Description Template**:

```markdown
## What

Brief description of what changed.

## Why

Why this change was needed (problem being solved).

## How

How you implemented the solution.

## Testing

- [ ] Manual testing completed
- [ ] All tests passing
- [ ] Verified in development environment
- [ ] Checked for breaking changes

## Screenshots

(If UI change)

## Checklist

- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console errors/warnings
- [ ] Backward compatible (or migration guide provided)

## Related Issues

Closes: #123
Related: #456
```

---

### Code Review Process

**As Reviewer**:

```
✓ Does it solve the stated problem?
✓ Is code readable and maintainable?
✓ Are there tests?
✓ Is documentation updated?
✓ Are there performance implications?
✓ Are there security considerations?
✓ Does it follow project conventions?
```

**Review Comments**:

```
❌ "This is wrong"
✓ "Consider extracting this to a helper function for reusability"

❌ "Bad code"
✓ "This could be simplified using array destructuring"

❌ "Doesn't work"
✓ "I tested this and got error X. Could you add error handling?"
```

**As Author**:

- Respond to all comments
- Ask questions if feedback unclear
- Update code based on feedback
- Push changes and re-request review

---

### Conflict Resolution

**When conflicts occur**:

```powershell
# 1. Update your branch
git checkout main
git pull origin main
git checkout your-feature-branch
git merge main

# 2. Git marks conflicts in files
# <<<<<<< HEAD (your changes)
# ... your code ...
# =======
# ... their code ...
# >>>>>>> main
```

**Resolve manually**:

```typescript
// Example conflict
<<<<<<< HEAD
export const API_URL = 'http://localhost:1337'
=======
export const API_URL = process.env.NEXT_PUBLIC_API_URL
>>>>>>> main

// Resolution (keep both concepts)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
```

**Complete resolution**:

```powershell
# 3. Mark as resolved
git add conflicted-file.ts

# 4. Complete merge
git commit  # Opens editor with merge commit message

# 5. Push
git push
```

---

## 🧹 Part 5: Git Hygiene (10 minutes)

### Keep History Clean

**Squash WIP Commits**:

Before:

```
fix wip
wip
more wip
finally works
fix typo
```

After:

```
feat(component): add hero section component
```

**How to squash**:

```powershell
# Interactive rebase (squash last 5 commits)
git rebase -i HEAD~5

# In editor, change:
pick abc123 fix wip
pick def456 wip
pick ghi789 more wip
pick jkl012 finally works
pick mno345 fix typo

# To:
pick abc123 fix wip
squash def456 wip
squash ghi789 more wip
squash jkl012 finally works
squash mno345 fix typo

# Save and close editor
# Write final commit message
```

---

### Protect Sensitive Data

**Never commit**:

- `.env` files
- API keys
- Passwords
- Database credentials
- Private keys
- User data

**Use .gitignore**:

```
# Environment variables
.env
.env.local
.env.production

# Secrets
secrets/
*.pem
*.key

# Database
*.sqlite
*.db

# Logs
logs/
*.log
```

**If you accidentally commit secrets**:

```powershell
# 1. Remove from history (use with caution!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Force push (dangerous, coordinate with team!)
git push origin --force --all

# 3. ROTATE THE SECRET IMMEDIATELY
# Change API keys, passwords, etc.
```

**Better**: Use secrets management

- Environment variables
- AWS Secrets Manager
- HashiCorp Vault
- Vercel/Heroku environment config

---

### Useful Git Aliases

**Add to ~/.gitconfig**:

```ini
[alias]
  # Short status
  s = status -s

  # Pretty log
  lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

  # Amend last commit
  amend = commit --amend --no-edit

  # Undo last commit (keep changes)
  undo = reset HEAD~1

  # Stash with message
  stash-save = stash save

  # List branches by date
  branches = branch --sort=-committerdate

  # Clean merged branches
  cleanup = "!git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d"
```

**Usage**:

```powershell
git s              # Short status
git lg             # Pretty log
git amend          # Fix last commit
git undo           # Undo last commit
git branches       # List branches
git cleanup        # Remove merged branches
```

---

## 🚀 Advanced Workflows

### Git Worktrees (Multiple Branches Simultaneously)

**Use case**: Work on multiple features without switching branches

```powershell
# Create worktree
git worktree add ../feature-auth feat/auth-system

# Now you have:
# /project/          (main branch)
# /feature-auth/     (feat/auth-system branch)

# Work in both simultaneously
cd ../feature-auth
# ... make changes ...
cd ../project
# ... continue main work ...

# Remove when done
git worktree remove ../feature-auth
```

---

### Git Bisect (Find Bug Introduction)

**Use case**: Binary search to find which commit introduced a bug

```powershell
# Start bisect
git bisect start

# Mark current as bad
git bisect bad

# Mark last known good commit
git bisect good abc123

# Git checks out middle commit
# Test if bug exists
yarn test

# If bug present:
git bisect bad

# If bug absent:
git bisect good

# Repeat until Git finds the commit
# Git will show: "abc123 is the first bad commit"

# End bisect
git bisect reset
```

---

### Git Stash (Save Work-in-Progress)

```powershell
# Save current changes
git stash save "WIP: hero section"

# List stashes
git stash list
# stash@{0}: WIP: hero section
# stash@{1}: WIP: footer component

# Apply stash
git stash apply stash@{0}

# Apply and remove
git stash pop

# Create branch from stash
git stash branch feat/hero-from-stash stash@{0}
```

---

## 📊 Git Statistics

### View Contribution Stats

```powershell
# Commits per author
git shortlog -sn

# Lines changed per author
git log --author="Your Name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'

# Files changed most often
git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -10

# Activity by day of week
git log --date=short --pretty=format:%ad | awk '{print $1}' | sort | uniq -c
```

---

## 🎯 Troubleshooting Common Issues

### "I committed to wrong branch"

```powershell
# Move commit to new branch
git branch feat/new-branch    # Create branch at current commit
git reset HEAD~1 --hard       # Remove commit from current branch
git checkout feat/new-branch  # Switch to new branch
```

---

### "I need to change last commit message"

```powershell
# Change last commit message
git commit --amend

# Change pushed commit (dangerous!)
git commit --amend
git push --force-with-lease
```

---

### "I deleted a branch accidentally"

```powershell
# Find the commit
git reflog

# Recreate branch
git branch feat/recovered-branch abc123
```

---

### "I need to undo a pushed commit"

```powershell
# Option 1: Revert (creates new commit)
git revert abc123
git push

# Option 2: Reset (rewrites history, dangerous!)
git reset --hard HEAD~1
git push --force-with-lease  # Only if no one else has pulled
```

---

## 📚 Related Documentation

- [Pre-Commit Checklist](./06-PRE-COMMIT-CHECKLIST.md) - Testing before commits
- [Development Workflow](../../DEVELOPMENT_WORKFLOW.md) - Overall process
- [Component Workflow](../../COMPONENT_WORKFLOW.md) - Component-specific flow
- [Strapi Best Practices](./strapi-5/04-BEST-PRACTICES.md) - Team workflows

---

## 🎓 Conclusion

**Git mastery transforms**:

- Solo developer → Professional team member
- "Just commit everything" → Strategic version control
- Mystery history → Clear project narrative
- Fear of mistakes → Confidence in rollback

**Key Principles**:

1. **Conventional commits** make history readable
2. **Feature branches** isolate work
3. **Small, focused commits** are easier to review and revert
4. **Clean history** is easier to navigate
5. **Never commit secrets** to version control

**Investment**: 2-3 days learning Git deeply  
**Return**: Career-long professional development skill  
**ROI**: Incalculable (Git is universal in software)

---

## ✅ Quick Reference

**Daily Commands**:

```powershell
git status
git add .
git commit -m "type(scope): description"
git push
git pull
```

**Feature Workflow**:

```powershell
git checkout -b feat/new-feature
# ... work ...
git commit -m "feat(scope): add feature"
git push -u origin feat/new-feature
# Create PR
```

**Milestone Commit**:

```powershell
# Run pre-commit checks
yarn typecheck && yarn lint && yarn build

# Commit with detailed message
git commit -m "docs(milestone): phase X complete

Major additions:
- Item 1
- Item 2

Value: $X
Impact: Y

Next phase: Z"
```

**You're a Git pro when**: You can explain your project's history to a new team member using only `git log`. 🎯

---

**Last Updated**: December 1, 2025  
**Guide**: Git Workflow - Milestone Commits & Best Practices  
**Part of**: [Deep Dives - Technical Mastery](./README.md)
