# 🎨 Chromatic Visual Regression Testing

**Created**: November 19, 2025  
**Last Updated**: November 19, 2025  
**Status**: ✅ Current  
**Audience**: Developers, DevOps

---

## 🎯 PURPOSE

Chromatic provides **automated visual regression testing** for our Storybook components. Every commit captures screenshots of all component stories and compares them to approved baselines, catching unintended visual changes before they reach production.

---

## 🏗️ HOW IT WORKS

### The Visual Regression Flow

```
1. Developer Commits Code
   ↓
2. GitHub Actions Triggers
   ↓
3. Storybook Builds All Stories
   ↓
4. Chromatic Captures Screenshots
   │
   ├─ Every component state
   ├─ All viewports (mobile, tablet, desktop)
   ├─ Light & dark themes
   └─ Different browsers
   ↓
5. Compare to Baseline
   │
   ├─ If SAME → ✅ Pass
   └─ If DIFFERENT → ⚠️ Review Required
   ↓
6. Developer Reviews Changes
   │
   ├─ Intentional change? → ✅ Approve (becomes new baseline)
   └─ Bug/regression? → ❌ Reject (fix required)
   ↓
7. PR Can Merge (if approved)
```

---

## ⚙️ CONFIGURATION

### GitHub Actions Workflow

**Location**: `.github/workflows/chromatic.yml`

```yaml
name: Visual Regression Testing

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Full git history for Chromatic

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "yarn"

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build Storybook & Publish to Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: "build-storybook"
          workingDir: apps/ui
          exitZeroOnChanges: true # Don't fail CI on visual changes
          exitOnceUploaded: true # Continue even with changes
```

---

### Storybook Integration

**Location**: `apps/ui/.storybook/main.ts`

```typescript
const config: StorybookConfig = {
  addons: [
    "@chromatic-com/storybook", // ← Chromatic addon
    // ... other addons
  ],
}
```

---

## 🚀 SETUP & AUTHENTICATION

### Initial Setup

1. **Create Chromatic Account**:

   - Visit [chromatic.com](https://www.chromatic.com)
   - Sign in with GitHub
   - Create new project

2. **Get Project Token**:

   - Copy project token from Chromatic dashboard
   - Add to GitHub repository secrets

3. **Add GitHub Secret**:

   ```bash
   # GitHub Repository → Settings → Secrets → Actions
   Name: CHROMATIC_PROJECT_TOKEN
   Value: <your-token-from-chromatic>
   ```

4. **Trigger First Build**:
   ```bash
   git push origin main
   # GitHub Actions will run Chromatic workflow
   ```

---

## 📸 CAPTURING VISUAL BASELINES

### First-Time Baseline Creation

**When**: After major component changes or initial setup

**Process**:

1. **Build Storybook**:

   ```bash
   cd apps/ui
   yarn build-storybook
   ```

2. **Review All Stories**:

   - Open Storybook locally: `yarn storybook`
   - Check each component looks correct
   - Verify all states (default, loading, error, etc.)
   - Test dark mode
   - Check responsive breakpoints

3. **Commit & Push**:

   ```bash
   git add .
   git commit -m "feat: establish Chromatic baseline"
   git push origin main
   ```

4. **Approve in Chromatic**:
   - Open Chromatic dashboard
   - Review all captured screenshots
   - Approve all as baseline
   - This becomes your "source of truth"

---

### Updating Baselines

**When**: Intentional visual changes made

**Process**:

1. Make component changes
2. Update stories if needed
3. Commit & push
4. Chromatic detects changes
5. Review changes in Chromatic UI
6. If intentional → **Approve** (updates baseline)
7. If bug → **Reject** (fix and retry)

---

## 🔍 REVIEWING VISUAL CHANGES

### Chromatic UI Workflow

**Dashboard Access**: [app.chromatic.com](https://app.chromatic.com)

**Review Process**:

1. **Open Build**:

   - Click on latest build from GitHub commit
   - See all changed components

2. **Compare Changes**:

   - Side-by-side comparison
   - Before (baseline) vs After (current)
   - Pixel-level diff highlighting
   - Multiple viewports if configured

3. **Accept or Deny**:

   **Accept** if:

   - ✅ Intentional design update
   - ✅ New feature added
   - ✅ Bug fix that changes appearance
   - ✅ Expected refactoring result

   **Deny** if:

   - ❌ Unintended visual regression
   - ❌ Breaking change not mentioned in PR
   - ❌ Layout shift bug
   - ❌ CSS cascade issue

4. **Update Status**:
   - Chromatic updates GitHub PR status
   - Shows ✅ or ⚠️ next to commit

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Review ALL Changes**:

   - Never auto-approve
   - Check every component carefully
   - Verify intentional vs accidental

2. **Use Meaningful Commit Messages**:

   ```bash
   # Good
   git commit -m "feat: update button hover state to match design"

   # Bad
   git commit -m "fix stuff"
   ```

3. **Test Multiple Viewports**:

   ```typescript
   // In stories
   export const Mobile: Story = {
     parameters: {
       viewport: { defaultViewport: "mobile1" },
     },
   }

   export const Desktop: Story = {
     parameters: {
       viewport: { defaultViewport: "desktop" },
     },
   }
   ```

4. **Test Dark Mode**:

   ```typescript
   export const DarkMode: Story = {
     parameters: {
       backgrounds: { default: "dark" },
     },
   }
   ```

5. **Document Visual Changes**:

   ```bash
   git commit -m "style: update hero gradient colors

   - Changed from blue-500 to primary-500
   - Updated dark mode opacity
   - Improves brand consistency"
   ```

### DON'T ❌

1. **Don't Skip Review**:

   - Visual changes need human verification
   - Chromatic can't know if change is intentional

2. **Don't Ignore Warnings**:

   - If Chromatic flags change, investigate
   - Even small changes can indicate bugs

3. **Don't Test Implementation**:

   - Focus on visual output
   - Not internal component structure

4. **Don't Auto-Merge PRs**:

   - Visual regression review required
   - Someone should see changes before merge

5. **Don't Forget Accessibility**:
   - Visual changes may affect a11y
   - Test with screen readers after approval

---

## 🔧 TROUBLESHOOTING

### Chromatic Build Failing

**Symptom**: GitHub Actions fails on Chromatic step

**Common Causes**:

1. **Missing Project Token**:

   ```bash
   # Check GitHub Secrets
   Settings → Secrets → Actions → CHROMATIC_PROJECT_TOKEN
   ```

2. **Storybook Build Error**:

   ```bash
   # Test locally first
   cd apps/ui
   yarn build-storybook
   # Fix any build errors before pushing
   ```

3. **Network Issues**:
   - Chromatic service temporarily down
   - Check [status.chromatic.com](https://status.chromatic.com)
   - Retry workflow

---

### Visual Differences Detected (But Look Same)

**Symptom**: Chromatic shows changes but images look identical

**Causes**:

1. **Font Rendering**:

   - Different OS fonts
   - Anti-aliasing differences
   - **Solution**: Use consistent fonts in Storybook

2. **Animation Timing**:

   - Screenshots taken mid-animation
   - **Solution**: Disable animations in Storybook

3. **Dynamic Content**:

   - Timestamps, random data
   - **Solution**: Use fixed data in stories

4. **Browser Differences**:
   - Chromatic uses Chrome by default
   - **Solution**: Consistent browser testing

---

### Too Many Changes to Review

**Symptom**: 100+ components changed

**Causes**:

1. **No Baseline Established**:

   - First time running Chromatic
   - **Solution**: Approve all as initial baseline

2. **Major Refactor**:

   - Theme system update
   - CSS framework change
   - **Solution**: Review in batches, approve intentional changes

3. **Global Style Change**:
   - Typography update
   - Spacing system change
   - **Solution**: Document in PR, bulk approve if intentional

---

## 📊 INTEGRATION WITH CI/CD

### Build-Commit-Push Workflow

**Updated Process** (includes Chromatic):

```bash
# 1. Clean build
Remove-Item -Recurse -Force apps/ui/.next, apps/strapi/dist -ErrorAction SilentlyContinue

# 2. Build & test locally
yarn build

# 3. Commit
git add .
git commit -m "feat: update component"

# 4. Push (triggers Chromatic)
git push origin main

# 5. Check GitHub Actions
# - Verify Build ✅
# - Visual Regression Testing ⚠️ (may need review)
# - If visual changes → Review in Chromatic dashboard

# 6. Approve/Reject in Chromatic UI
# - If approved → Baseline updated ✅
# - If rejected → Fix and push again 🔄
```

**See**: [Build-Commit-Push Workflow](../../06-workflows/build-commit-push.md)

---

## 🎓 LEARNING RESOURCES

### Official Documentation

- [Chromatic Docs](https://www.chromatic.com/docs)
- [Visual Testing Guide](https://www.chromatic.com/docs/test)
- [GitHub Actions Integration](https://www.chromatic.com/docs/github-actions)

### Internal Guides

- [Storybook Integration](../storybook/integration.md)
- [Testing Strategy](../README.md)
- [Component Development](../../04-components/development-guide.md)

---

## 🚀 QUICK REFERENCE

### Common Commands

```bash
# Run Storybook locally
cd apps/ui
yarn storybook

# Build Storybook
yarn build-storybook

# Manually trigger Chromatic (local)
npx chromatic --project-token=<your-token>
```

### Useful Links

- **Chromatic Dashboard**: [app.chromatic.com](https://app.chromatic.com)
- **Status Page**: [status.chromatic.com](https://status.chromatic.com)
- **GitHub Actions**: Repository → Actions tab

---

## 🎯 SUCCESS CRITERIA

### Current State (November 2025)

- ✅ Chromatic configured
- ✅ GitHub Actions workflow exists
- ⚠️ Baseline needs establishment
- ⚠️ Review process needs formalization

### Target State (When Components Complete)

- ✅ Full baseline established
- ✅ All component states captured
- ✅ PR review includes visual regression check
- ✅ Block merge on unapproved changes
- ✅ Team trained on review process

---

**Questions?** See [Testing Strategy](../README.md) or ask the team! 🚀
