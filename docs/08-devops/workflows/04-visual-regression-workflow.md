# 🎨 Visual Regression Workflow - Chromatic Integration

**File**: `.github/workflows/visual-regression.yml`  
**Created**: November 30, 2025  
**Status**: ✅ Production  
**Audience**: UI/UX designers, Frontend developers

---

## 🎯 PURPOSE

The **Visual Regression Testing Workflow** automatically detects visual changes to UI components using Chromatic, ensuring design consistency and preventing unintended visual regressions.

**What It Tests**:

- ✅ Component visual appearance (56+ Storybook stories)
- ✅ Responsive breakpoints (mobile, tablet, desktop)
- ✅ Theme variations (light/dark modes)
- ✅ Interactive states (hover, focus, active)
- ✅ Cross-browser rendering (Chromium baseline)
- ✅ Design system consistency

**Why Critical**: Catches visual bugs that automated tests miss—layout shifts, color changes, spacing issues, CSS regressions.

---

## 📊 WORKFLOW OVERVIEW

### Key Metrics

| Metric                 | Value                                  |
| ---------------------- | -------------------------------------- |
| **Triggers**           | PRs (UI changes), Push to main, Manual |
| **Jobs**               | 1 (Chromatic Publish)                  |
| **Duration**           | 10-15 minutes                          |
| **Success Rate**       | 100% (always passes, reviews in UI)    |
| **Stories**            | 56+ Storybook components               |
| **Baselines**          | 56 snapshots                           |
| **Runs Per Month**     | ~40 (UI PRs + main pushes)             |
| **Monthly CI Minutes** | ~120 minutes                           |

### Visual Test Coverage

| Component Category | Stories | Coverage                    |
| ------------------ | ------- | --------------------------- |
| **Layout**         | 8       | Headers, Footers, Grids     |
| **Navigation**     | 6       | Menus, Breadcrumbs, Tabs    |
| **Content**        | 12      | Cards, Articles, Media      |
| **Forms**          | 10      | Inputs, Buttons, Validation |
| **Feedback**       | 8       | Alerts, Toasts, Modals      |
| **Data Display**   | 12      | Tables, Lists, Charts       |

---

## 🔧 CONFIGURATION

### Triggers

```yaml
on:
  pull_request:
    branches: [main]
    paths:
      - "apps/ui/src/**"
      - "apps/ui/.storybook/**"
      - "packages/design-system/**"
  push:
    branches: [main]
  workflow_dispatch:
```

**Trigger Strategy**:

- `pull_request`: Visual review before merge (UI/design system changes)
- `push` to main: Update baselines after merge
- **Path filtering**: Only run when visual code changes
  - UI components (`apps/ui/src/**`)
  - Storybook config (`apps/ui/.storybook/**`)
  - Design system (`packages/design-system/**`)
- `workflow_dispatch`: Manual testing

**Why This Matters**:

- ✅ Skip workflow if backend-only changes
- ✅ Saves CI minutes (~40 runs/month vs ~150 without filter)
- ✅ Focused reviews (only when visuals affected)

---

## 🏗️ JOB: CHROMATIC VISUAL TESTS

### Configuration

```yaml
chromatic:
  name: Chromatic Visual Tests
  runs-on: ubuntu-latest
  timeout-minutes: 15
```

**Timeout**: 15 minutes (building Storybook + uploading snapshots)

---

## 📋 STEP-BY-STEP BREAKDOWN

### Step 1: Checkout Repository

```yaml
- name: Checkout repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

**Why `fetch-depth: 0`** (CRITICAL):

- Fetches full Git history
- Chromatic needs commit ancestry to compare changes
- Determines which stories changed since last baseline

**Without Full History**: Chromatic can't detect unchanged stories (slower, wastes snapshots)

---

### Step 2-3: Setup Node.js & Install Dependencies

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: "22"
    cache: "yarn"

- name: Install dependencies
  run: yarn install --frozen-lockfile
```

**Standard setup** (same as other workflows)

---

### Step 4: Publish to Chromatic

```yaml
- name: Publish to Chromatic
  uses: chromaui/action@latest
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    buildScriptName: "build-storybook"
    exitZeroOnChanges: true
    workingDir: apps/ui
    autoAcceptChanges: ${{ github.ref == 'refs/heads/main' }}
    onlyChanged: true
```

**Configuration Breakdown**:

#### projectToken

```yaml
projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

- **Purpose**: Authenticates with Chromatic service
- **Storage**: GitHub repository secret
- **Security**: Never committed to repo
- **Obtain**: From Chromatic dashboard (chromatic.com)

**Setting Secret**:

```bash
gh secret set CHROMATIC_PROJECT_TOKEN --body="chpt_xxxxxxxxxxxxx"
```

---

#### buildScriptName

```yaml
buildScriptName: "build-storybook"
```

- **What It Runs**: `yarn workspace @repo/ui build-storybook`
- **Output**: Static Storybook build in `storybook-static/`
- **Duration**: ~3-5 minutes

**Storybook Build Output**:

```
Building Storybook...
Compiling preview...
Compiling manager...
✓ Built in 3m 24s
```

---

#### exitZeroOnChanges

```yaml
exitZeroOnChanges: true
```

- **What It Does**: Workflow passes even if visual changes detected
- **Why**: Visual changes aren't failures, they're for review
- **Behavior**: Chromatic posts results, but CI stays green

**Without This**: CI would fail on every visual change (not helpful)

---

#### workingDir

```yaml
workingDir: apps/ui
```

- **Purpose**: Run Chromatic from UI package (monorepo)
- **Context**: Chromatic uses `package.json` in this directory

---

#### autoAcceptChanges

```yaml
autoAcceptChanges: ${{ github.ref == 'refs/heads/main' }}
```

- **What It Does**: Auto-accept visual changes on main branch
- **Why**: Main branch = source of truth (update baselines)
- **Behavior**:
  - PR: Changes require manual review ❌ (good)
  - Main: Changes auto-accepted ✅ (update baseline)

**Workflow**:

1. PR: Chromatic detects changes → Manual review in UI
2. Approved & merged to main → Auto-accept → New baseline set

---

#### onlyChanged

```yaml
onlyChanged: true
```

- **What It Does**: Only snapshot changed stories (skip unchanged)
- **How**: Uses Git history to detect file changes
- **Performance**: ~80% faster (snapshot 10 stories vs 56)

**Snapshot Usage** (Chromatic limits):

- Changed stories: ~10 per PR
- All stories: 56
- Savings: 46 snapshots saved per run

---

### What Chromatic Does (Behind the Scenes)

```
1. Build Storybook (static HTML/CSS/JS)
   ↓
2. Upload to Chromatic CDN
   ↓
3. For each story:
   a. Render in isolated browser
   b. Wait for animations to settle
   c. Capture pixel-perfect screenshot
   d. Compare to baseline
   ↓
4. Generate visual diff (if changed)
   ↓
5. Post results to Chromatic UI
   ↓
6. Return build URL
```

**Comparison Algorithm**:

- Pixel-by-pixel comparison
- Anti-aliasing tolerance
- Ignores date/time text (configurable)
- Detects: color, layout, spacing, font changes

---

### Step 5: Comment PR with Chromatic Results

```yaml
- name: Comment PR with Chromatic results
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
  with:
    script: |
      const output = process.env.CHROMATIC_URL || 'Visual tests running...';
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: `🎨 **Chromatic Visual Regression Tests**\n\n${output}\n\n[View Storybook →](${output})`
      });
```

**What This Does**:

1. Reads Chromatic build URL from environment
2. Posts comment to PR with link

**Example Comment**:

```
🎨 **Chromatic Visual Regression Tests**

https://www.chromatic.com/build?appId=...&number=42

[View Storybook →](https://main--123abc.chromatic.com)

Changes detected:
- Button component: Border radius changed
- Card component: Spacing adjusted
```

---

## 🎨 CHROMATIC UI REVIEW WORKFLOW

### PR Review Process

1. **Developer**: Pushes UI changes to PR
2. **CI**: Runs visual regression workflow
3. **Chromatic**: Detects visual changes
4. **Developer**: Reviews changes in Chromatic UI
5. **Approval**:
   - ✅ Accept: Changes intentional (new design)
   - ❌ Reject: Changes unintended (regression)
6. **Merge**: PR merged to main
7. **Baseline Update**: Auto-accepted on main push

### Chromatic UI Features

**Visual Diff View**:

- Side-by-side comparison
- Overlay mode (toggle old/new)
- Highlight differences (red overlay)
- Zoom & pan

**Review Actions**:

- ✅ Accept change (update baseline)
- ❌ Deny change (flag regression)
- 💬 Comment (request clarification)
- 🔗 Share link (discuss with team)

**Batch Operations**:

- Accept all changes (trusted PRs)
- Accept specific components
- Deny all (major regression)

---

## 🔬 STORYBOOK CONFIGURATION

### Build Configuration

**Location**: `apps/ui/.storybook/main.ts`

```typescript
const config: StorybookConfig = {
  stories: ["../src/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@chromaui/addon-visual-tests",
  ],
  framework: "@storybook/nextjs",
  staticDirs: ["../public"],
}
```

**Key Settings**:

- **stories**: Component story locations
- **addons**: Visual testing addon included
- **framework**: Next.js-specific configuration
- **staticDirs**: Public assets available

---

### Story Best Practices

**Component Story Example**:

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    chromatic: {
      // Pause animations for consistent snapshots
      pauseAnimationAtEnd: true,
      // Viewport sizes to test
      viewports: [375, 768, 1440],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled button',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'secondary',
    icon: <ArrowIcon />,
    children: 'Next',
  },
};
```

**Chromatic-Specific Parameters**:

- `pauseAnimationAtEnd`: Freeze animations for snapshot
- `viewports`: Test responsive breakpoints
- `delay`: Wait before snapshot (loading states)
- `diffThreshold`: Tolerance for anti-aliasing

---

## 🐛 TROUBLESHOOTING

### Issue: Chromatic Detects False Positives

**Symptom**: Changes detected but visually identical

**Common Causes**:

1. Date/time text (renders differently each snapshot)
2. Random IDs in DOM
3. Animation mid-frame
4. Font loading timing

**Solutions**:

1. **Ignore Dynamic Content**:

   ```typescript
   // In story
   parameters: {
     chromatic: {
       disableSnapshot: false,
       // Ignore specific elements
       ignoreSelectors: ['.timestamp', '.random-id']
     }
   }
   ```

2. **Pause Animations**:

   ```typescript
   parameters: {
     chromatic: {
       pauseAnimationAtEnd: true
     }
   }
   ```

3. **Delay Snapshot**:
   ```typescript
   parameters: {
     chromatic: {
       delay: 300 // ms
     }
   }
   ```

---

### Issue: Baseline Drift (Main Branch Changes Not Reflected)

**Symptom**: PR shows changes already accepted in previous PR

**Cause**: Baseline not updated on main branch

**Solution**:

1. Check `autoAcceptChanges` is set (already configured ✅)
2. Manually trigger workflow on main:

   ```bash
   gh workflow run visual-regression.yml --ref main
   ```

3. In Chromatic UI, manually accept baseline

---

### Issue: Snapshot Quota Exceeded

**Symptom**:

```
Error: Snapshot limit reached (5,000/month on free plan)
```

**Cause**: Too many snapshots consumed

**Solutions**:

1. **Use `onlyChanged`** (already configured ✅)

   - Saves ~80% of snapshots

2. **Skip Stories**:

   ```typescript
   // For non-visual stories
   parameters: {
     chromatic: {
       disableSnapshot: true
     }
   }
   ```

3. **Limit Viewports**:

   ```typescript
   // Test fewer breakpoints
   chromatic: {
     viewports: [375, 1440] // Skip tablet
   }
   ```

4. **Upgrade Plan**: (if needed)
   - Free: 5,000 snapshots/month
   - Paid: 35,000+ snapshots/month

---

### Issue: Slow Storybook Build

**Symptom**: Build takes >10 minutes

**Cause**: Large component library, complex stories

**Solutions**:

1. **Optimize Storybook Config**:

   ```typescript
   // .storybook/main.ts
   viteFinal: (config) => {
     config.build = {
       ...config.build,
       minify: false, // Skip minification in CI
       sourcemap: false,
     }
     return config
   }
   ```

2. **Reduce Addon Load**:

   - Remove unused addons
   - Lazy load heavy addons

3. **Cache Storybook Build** (advanced):
   ```yaml
   - name: Cache Storybook
     uses: actions/cache@v4
     with:
       path: apps/ui/storybook-static
       key: storybook-${{ hashFiles('apps/ui/src/**/*.stories.tsx') }}
   ```

---

### Issue: Visual Changes Not Detected

**Symptom**: Made UI changes but Chromatic shows no differences

**Cause**: Changes not affecting rendered output (logic-only, tests, etc.)

**Solutions**:

1. **Verify Story Covers Changed Component**:

   - Check story imports component
   - Story args include changed props

2. **Check Path Filtering**:

   - Ensure changed file matches workflow paths
   - E.g., `apps/ui/src/components/Button.tsx` ✅

3. **Manual Trigger**:
   ```bash
   gh workflow run visual-regression.yml
   ```

---

## 📈 PERFORMANCE OPTIMIZATION

### Current Optimizations

1. **onlyChanged** ✅

   - Skip unchanged stories
   - ~80% snapshot savings

2. **Path Filtering** ✅

   - Skip workflow if no visual changes
   - Saves ~70% of runs

3. **autoAcceptChanges** ✅

   - No manual review needed on main
   - Faster baseline updates

4. **exitZeroOnChanges** ✅
   - Don't block CI on visual changes
   - Review asynchronously

### Future Optimizations

1. **TurboSnap** ⏳ (Chromatic feature)

   - Uses Git + webpack stats to detect changes
   - Even smarter than `onlyChanged`
   - Requires webpack/Vite config

2. **Component-Level Ignore** ⏳

   - Skip non-visual components (logic-only)
   - Further reduce snapshots

3. **Responsive Optimization** ⏳
   - Test fewer breakpoints for simple components
   - Full responsive for layout components

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Write Visual Stories**:

   ```typescript
   // Cover all visual states
   export const Primary = { args: { variant: "primary" } }
   export const Hover = { args: { variant: "primary", hover: true } }
   export const Disabled = { args: { disabled: true } }
   ```

2. **Use Semantic Story Names**:

   ```typescript
   // ✅ GOOD
   export const PrimaryButtonWithIcon = { ... };

   // ❌ BAD
   export const Story1 = { ... };
   ```

3. **Test Responsive Breakpoints**:

   ```typescript
   parameters: {
     chromatic: {
       viewports: [375, 768, 1440]
     }
   }
   ```

4. **Pause Animations**:

   ```typescript
   parameters: {
     chromatic: {
       pauseAnimationAtEnd: true
     }
   }
   ```

5. **Review Visual Changes Promptly**:
   - Don't let PRs sit with pending visual reviews
   - Approve or reject within 24 hours

### DON'T ❌

1. **Don't Test Logic in Storybook**:

   - Storybook = visual testing
   - Jest/Playwright = logic testing

2. **Don't Snapshot Dynamic Content**:

   ```typescript
   // ❌ BAD: Date changes every snapshot
   <div>{new Date().toISOString()}</div>

   // ✅ GOOD: Fixed date
   <div>2025-11-30</div>
   ```

3. **Don't Ignore Visual Regressions**:

   - If change unintended, fix it
   - Don't blindly accept

4. **Don't Test Too Many Viewports**:

   - 3-4 breakpoints sufficient
   - More = wasted snapshots

5. **Don't Forget Dark Mode** (if applicable):
   ```typescript
   export const DarkMode: Story = {
     parameters: {
       backgrounds: { default: "dark" },
     },
   }
   ```

---

## 🔗 RELATED WORKFLOWS

### Workflow Comparison

| Aspect       | Visual Regression  | E2E           | Lighthouse    |
| ------------ | ------------------ | ------------- | ------------- |
| **Focus**    | Visual consistency | Functionality | Performance   |
| **Tool**     | Chromatic          | Playwright    | Lighthouse CI |
| **Duration** | 15 min             | 15 min        | 20 min        |
| **Coverage** | 56 components      | 64 tests      | 6 pages       |
| **Triggers** | UI PRs             | Code PRs      | UI PRs        |

### Complementary Testing

- **Visual Regression**: Ensures components look correct
- **E2E Tests**: Ensures components work correctly
- **Unit Tests**: Ensures component logic correct

**Full Coverage** = All three types ✅

---

## 📚 ADDITIONAL RESOURCES

### Internal Documentation

- [Workflows Index](/docs/08-devops-workflows-readme)
- [CI Workflow](/docs/08-devops-workflows-01-ci-workflow)
- [E2E Workflow](/docs/08-devops-workflows-02-e2e-workflow)
- [Lighthouse Workflow](/docs/08-devops-workflows-03-lighthouse-workflow)
- [Storybook Setup Guide](/docs/deep-dives-storybook-setup) ⏳

### External Resources

- [Chromatic Documentation](https://www.chromatic.com/docs)
- [Storybook Best Practices](https://storybook.js.org/docs/writing-stories/best-practices)
- [Visual Testing Guide](https://www.chromatic.com/docs/visual-testing)
- [Chromatic GitHub Action](https://github.com/chromaui/action)

### Tools

- [Chromatic Dashboard](https://www.chromatic.com)
- [Storybook](https://storybook.js.org)
- [Percy (Alternative)](https://percy.io)

---

## ✅ SUCCESS CHECKLIST

Before merging PR with visual changes:

- [ ] Visual regression workflow passes (green)
- [ ] Chromatic build link reviewed
- [ ] All visual changes intentional
- [ ] Regression diffs approved in Chromatic UI
- [ ] No unintended layout shifts
- [ ] Color changes match design
- [ ] Responsive breakpoints tested
- [ ] Dark mode tested (if applicable)
- [ ] Accessibility maintained (color contrast)

---

**Last Updated**: November 30, 2025  
**Workflow Version**: 2.0 (onlyChanged optimization)  
**Stories**: 56+ Storybook components  
**Snapshot Limit**: 5,000/month (free tier)  
**Next**: [Cache Cleanup Workflow Documentation](/docs/08-devops-workflows-05-cache-cleanup-workflow) ⏳ Coming Soon
