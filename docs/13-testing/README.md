# 🧪 Testing Strategy & Storybook Integration

**Created**: November 18, 2025  
**Last Updated**: November 18, 2025  
**Status**: ✅ Current  
**Audience**: Developers, QA Engineers

---

## 🎯 PURPOSE

This document defines our comprehensive testing strategy, methodology, and tool integration - specifically how Storybook, Chromatic, and other testing tools fit into our development process.

---

## 📊 TESTING PHILOSOPHY

### Ship Value NOW, Plan Excellence LATER

> "Remember we have ship a lot of value NOW, but we never take our eye off the ball to plan for excellence for LATER." - Herman

**NOW (Current)**:

- Component isolation with Storybook
- Visual regression baseline established
- Manual testing in development
- GitHub Actions CI/CD validation

**LATER (Planned)**:

- Automated visual regression with Chromatic
- Comprehensive E2E test coverage
- Unit test coverage for critical paths
- Performance testing automation

---

## 🏗️ TESTING PYRAMID

```
         /\
        /  \  E2E Tests (Playwright)
       /    \  ← Critical user flows
      /------\
     /        \  Integration Tests
    /          \  ← Component interactions
   /------------\
  /              \  Unit Tests (Vitest)
 /                \  ← Utility functions, hooks
/------------------\
    Storybook Stories
    ← Component isolation & visual baseline
```

### Our Approach: Top-Down

1. **Start with Storybook** - Isolate components, establish visual baseline
2. **Add E2E tests** - Critical user flows (auth, forms, navigation)
3. **Integrate Chromatic** - Automated visual regression
4. **Add unit tests** - Utilities, hooks, business logic
5. **Expand coverage** - Fill gaps as needed

---

## 🎨 STORYBOOK ROLE & BEST PRACTICES

### What is Storybook?

**Purpose**: Component isolation, development, and documentation

**Our Use Cases**:

1. **Component Development** - Build in isolation
2. **Visual Baseline** - Establish visual regression baseline
3. **Documentation** - Living component library
4. **Design Review** - Share with stakeholders
5. **Chromatic Integration** - Automated visual testing

---

### How We Use Storybook

#### 1. Component Isolation

**Benefit**: Develop components without running full app

**Example**:

```typescript
// BlogCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { BlogCard } from "./BlogCard"

const meta: Meta<typeof BlogCard> = {
  title: "Molecules/BlogCard",
  component: BlogCard,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof BlogCard>

export const Default: Story = {
  args: {
    title: "Getting Started with Next.js",
    excerpt: "Learn the basics of Next.js...",
    author: "Herman Adu",
    date: "2025-11-18",
  },
}

export const WithImage: Story = {
  args: {
    ...Default.args,
    image: {
      url: "/images/blog/nextjs-intro.jpg",
      alt: "Next.js Tutorial",
    },
  },
}

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}
```

---

#### 2. Visual Regression Baseline

**Current Setup**:

- Storybook stories define component states
- Visual snapshots established
- Manual review in Storybook UI
- **LATER**: Chromatic automates snapshot comparison

**Workflow**:

1. Create story for component state
2. Review visually in Storybook
3. Approve visual appearance
4. Becomes baseline for future changes

---

#### 3. Documentation

**Auto-generated Docs**:

- Component props automatically documented
- Usage examples from stories
- Interactive playground
- Accessible to content managers

**Tags**:

```typescript
tags: ["autodocs"] // Auto-generates docs page
```

---

### Best Practices for Storybook

#### DO ✅

1. **Create stories for all states**:

   - Default
   - Loading
   - Error
   - Empty
   - With data
   - Dark mode

2. **Use realistic data**:

   ```typescript
   // Good
   args: {
     title: 'Understanding React Hooks',
     author: 'Herman Adu',
   }

   // Avoid
   args: {
     title: 'Lorem ipsum',
     author: 'Test User',
   }
   ```

3. **Document props**:

   ```typescript
   /**
    * BlogCard displays a blog post preview with image, title, and excerpt
    *
    * @component
    * @example
    * <BlogCard
    *   title="My Blog Post"
    *   excerpt="A short description..."
    * />
    */
   ```

4. **Test accessibility**:

   - Use Storybook a11y addon
   - Verify keyboard navigation
   - Check screen reader compatibility

5. **Keep stories simple**:
   - One story per component state
   - Minimal logic in stories
   - Focus on visual representation

#### DON'T ❌

1. **Don't test logic in stories** - Use unit tests
2. **Don't make stories complex** - Keep them declarative
3. **Don't skip edge cases** - Create stories for error states
4. **Don't ignore dark mode** - Test both themes
5. **Don't forget mobile** - Use viewport addon

---

## 🎬 CHROMATIC INTEGRATION

### What is Chromatic?

**Purpose**: Automated visual regression testing in CI/CD

**How it Works**:

1. Storybook stories run in CI/CD
2. Chromatic captures screenshots
3. Compares to approved baseline
4. Flags visual changes for review
5. Approve or reject changes

---

### Current Status

**NOW**:

- ⚠️ Chromatic configured but not fully utilized
- GitHub Actions workflow exists
- Visual regression testing available
- Needs proper baseline establishment

**LATER** (When Properly Utilized):

- ✅ Automated visual regression on every PR
- ✅ Catch unintended visual changes
- ✅ Review visual changes before merge
- ✅ Maintain visual consistency

---

### Setup & Configuration

**GitHub Actions** (`.github/workflows/chromatic.yml`):

```yaml
name: Visual Regression Testing

on: push

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Publish to Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
```

---

### Best Practices for Chromatic

#### DO ✅

1. **Establish baseline first**:

   - Review all stories visually
   - Approve initial screenshots
   - Becomes source of truth

2. **Review changes carefully**:

   - Check all flagged changes
   - Verify intentional vs accidental
   - Approve only expected changes

3. **Use meaningful commit messages**:

   - Helps identify when changes occurred
   - Easier to track visual evolution

4. **Test responsive breakpoints**:

   - Mobile, tablet, desktop
   - Use Storybook viewport addon

5. **Document visual changes**:
   - Why change was made
   - Design decision rationale

#### DON'T ❌

1. **Don't auto-approve** - Always review
2. **Don't ignore warnings** - Investigate flagged changes
3. **Don't test implementation** - Focus on visual output
4. **Don't skip PR reviews** - Visual changes need approval
5. **Don't forget dark mode** - Test both themes

---

## 🧪 UNIT TESTING (Vitest)

### What We Test

**Current Focus**:

- Utility functions
- Custom hooks
- Business logic
- Data transformations

**NOT Tested** (Yet):

- Component rendering (use Storybook + Chromatic)
- UI interactions (use E2E tests)

---

### Setup

**Location**: `apps/ui/vitest.config.ts`

```typescript
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
})
```

---

### Example: Testing Utility Function

```typescript
// lib/gradient-utils.test.ts
import { describe, it, expect } from "vitest"
import { getGradientDirection } from "./gradient-utils"

describe("getGradientDirection", () => {
  it('converts "to-right" to CSS direction', () => {
    expect(getGradientDirection("to-right")).toBe("90deg")
  })

  it('converts "to-bottom-right" to CSS direction', () => {
    expect(getGradientDirection("to-bottom-right")).toBe("135deg")
  })

  it("returns default for unknown direction", () => {
    expect(getGradientDirection("invalid")).toBe("90deg")
  })
})
```

---

### Example: Testing Custom Hook

```typescript
// hooks/useAppForm.test.ts
import { renderHook, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { useSubscriberForm } from "./useAppForm"

describe("useSubscriberForm", () => {
  it("detects duplicate email errors", async () => {
    const { result } = renderHook(() => useSubscriberForm())

    // Mock API error
    const duplicateError = new Error("unique constraint")

    result.current.mutate(
      { email: "test@example.com" },
      {
        onError: (error: any) => {
          expect(error.name).toBe("DuplicateEmailError")
        },
      }
    )
  })
})
```

---

## 🎭 E2E TESTING (Playwright)

### What We Test

**Critical User Flows**:

1. Authentication (login, register, password reset)
2. Form submissions (contact, newsletter)
3. Navigation (page transitions)
4. Search functionality
5. Content creation (Strapi admin)

---

### Setup

**Location**: `apps/ui/playwright.config.ts`

```typescript
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
})
```

---

### Example: Testing Homepage

```typescript
// e2e/homepage.spec.ts
import { test, expect } from "@playwright/test"

test("homepage loads correctly", async ({ page }) => {
  await page.goto("/")

  // Check hero section
  await expect(page.locator("h1")).toBeVisible()

  // Check navigation
  await expect(page.locator("nav")).toBeVisible()

  // Check footer
  await expect(page.locator("footer")).toBeVisible()
})

test("newsletter subscription works", async ({ page }) => {
  await page.goto("/")

  // Fill newsletter form
  await page.fill('input[type="email"]', "test@example.com")
  await page.click('button:has-text("Subscribe")')

  // Check success message
  await expect(page.locator("text=Success")).toBeVisible()
})
```

---

## 🔄 TESTING WORKFLOW

### Development Flow

```
1. Create Component
   ↓
2. Create Storybook Stories
   ↓
3. Develop in Isolation
   ↓
4. Review in Storybook UI
   ↓
5. Add Unit Tests (if needed)
   ↓
6. Integrate into App
   ↓
7. Add E2E Tests (critical flows)
   ↓
8. Push to GitHub
   ↓
9. Chromatic Visual Regression
   ↓
10. Review & Approve Changes
```

---

### When to Write Which Test

#### Storybook Story

- ✅ Every component
- ✅ All visual states
- ✅ Different prop combinations
- ✅ Dark/light mode variants

#### Unit Test

- ✅ Utility functions
- ✅ Custom hooks
- ✅ Complex logic
- ✅ Data transformations

#### E2E Test

- ✅ Critical user flows
- ✅ Form submissions
- ✅ Authentication
- ✅ Multi-step processes

#### Manual Test

- ✅ Visual polish
- ✅ Animation smoothness
- ✅ Accessibility
- ✅ Cross-browser compatibility

---

## 🎯 CURRENT IMPLEMENTATION STATUS

### ✅ Implemented

1. **Storybook Setup**

   - Configured for Next.js
   - Component stories exist
   - Accessible at `http://localhost:6006`
   - Auto-docs enabled

2. **Visual Regression (Partial)**

   - Chromatic configured
   - GitHub Actions workflow exists
   - Baseline needs establishment

3. **Unit Testing (Vitest)**

   - Configured and ready
   - Example tests exist
   - Can run with `yarn test`

4. **E2E Testing (Playwright)**
   - Configured for Next.js
   - Example homepage test exists
   - Can run with `yarn test:e2e`

---

### ⚠️ Needs Improvement

1. **Storybook Utilization**

   - More component stories needed
   - Document all props
   - Add more state variations
   - Better organize stories

2. **Chromatic Baseline**

   - Establish initial baseline
   - Review all screenshots
   - Approve visual standards
   - Enable on all PRs

3. **Test Coverage**

   - Increase unit test coverage
   - Add more E2E tests
   - Document testing patterns
   - Create testing guidelines

4. **CI/CD Integration**
   - Enforce test passing before merge
   - Block PRs with visual regressions
   - Auto-deploy after all tests pass

---

## 🚀 FUTURE ROADMAP

### Phase 1: Storybook Excellence (Next Week)

- [ ] Create stories for all major components
- [ ] Document all component props
- [ ] Add accessibility tests
- [ ] Organize story structure

### Phase 2: Chromatic Integration (Next Month)

- [ ] Establish visual baseline
- [ ] Enable on all pull requests
- [ ] Create review workflow
- [ ] Document approval process

### Phase 3: Comprehensive Coverage (Next Quarter)

- [ ] 80% unit test coverage
- [ ] All critical flows E2E tested
- [ ] Performance testing setup
- [ ] Load testing implementation

### Phase 4: Automation Excellence (6 Months)

- [ ] Full CI/CD automation
- [ ] Auto-deployment on success
- [ ] Performance budgets enforced
- [ ] Visual regression mandatory

---

## 📚 RESOURCES

### Documentation

- [Storybook Docs](https://storybook.js.org/docs)
- [Chromatic Docs](https://www.chromatic.com/docs)
- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)

### Internal Guides

- `docs/04-components/development/complete-guide.md` - Component development
- `docs/06-workflows/build-commit-push.md` - Build workflow
- `docs/09-troubleshooting/playbook.md` - Common issues

---

## 💡 BEST PRACTICES SUMMARY

### DO ✅

- Write Storybook stories for every component
- Test all visual states
- Review visual changes in Chromatic
- Write E2E tests for critical flows
- Document testing decisions

### DON'T ❌

- Skip stories for "simple" components
- Auto-approve visual changes
- Test implementation details
- Ignore failing tests
- Forget accessibility

---

## 🎯 SUCCESS METRICS

### Current State

- **Storybook Stories**: ~10 components
- **Visual Regression**: Configured but underutilized
- **Unit Tests**: Minimal coverage
- **E2E Tests**: Basic homepage test

### Target State (3 Months)

- **Storybook Stories**: 80% of components
- **Visual Regression**: All components baselined
- **Unit Tests**: 60% coverage (utilities, hooks)
- **E2E Tests**: All critical flows covered

---

**Remember**: "Ship value NOW, plan excellence LATER" - we have the foundation, now we build on it systematically.

---

**Questions?** See `docs/09-troubleshooting/playbook.md` or ask Herman! 🚀
