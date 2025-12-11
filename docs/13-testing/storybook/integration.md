# 📚 Storybook Integration & Atomic Design Connection

**Created**: November 19, 2025  
**Last Updated**: November 19, 2025  
**Status**: ✅ Current  
**Audience**: Developers

---

## 🎯 PURPOSE

This document explains how Storybook integrates with our **Atomic Design architecture** and serves as our component development, documentation, and visual regression testing foundation.

---

## 🏗️ STORYBOOK ❤️ ATOMIC DESIGN

### The Perfect Match

Storybook's component isolation model **perfectly aligns** with Atomic Design principles:

```
Atomic Design Layer          Storybook Organization
─────────────────────────────────────────────────────
⚛️  Atoms                    → atoms/
    (Button, Input)            stories/atoms/*.stories.tsx

🧬 Molecules                 → molecules/
    (BlogCard, FormField)      stories/molecules/*.stories.tsx

🦠 Organisms                 → organisms/
    (Header, HeroSection)      stories/organisms/*.stories.tsx

📄 Sections                  → sections/
    (Newsletter, Testimonials) stories/sections/*.stories.tsx

📱 Pages                     → pages/
    (Homepage, Contact)        stories/pages/*.stories.tsx
```

---

## 🎨 OUR STORYBOOK ETHOS

### "Component Isolation = Component Excellence"

**Principles**:

1. **Develop in Isolation** - Build components without running full app
2. **Document as You Build** - Stories ARE documentation
3. **Test Visually First** - See all states before integration
4. **Design System Living** - Single source of truth for design
5. **Connected to Architecture** - Reflects atomic design structure

---

## 📂 DIRECTORY STRUCTURE

### Current Organization

```
apps/ui/src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   │   └── BlogCard/
│   │       ├── BlogCard.tsx
│   │       ├── BlogCard.stories.tsx     ← Storybook story
│   │       ├── BlogCard.test.tsx        ← Unit tests
│   │       └── README.md                ← Documentation
│   ├── organisms/
│   └── page-builder/                    ← Strapi components
│       ├── components/
│       │   ├── elements/
│       │   ├── sections/
│       │   └── forms/
│
└── stories/                              ← Example/demo stories
    ├── Button.stories.ts
    ├── Header.stories.ts
    └── Page.stories.ts
```

---

## 🎬 STORY STRUCTURE

### Atomic Design Story Template

```typescript
// src/components/molecules/BlogCard/BlogCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { BlogCard } from "./BlogCard"

/**
 * BlogCard - Molecule Level Component
 *
 * Displays blog post preview with image, title, excerpt, and metadata.
 * Used in blog listings, related posts, and content grids.
 *
 * **Atomic Design Level**: Molecule
 * **Composed Of**: Image (atom), Heading (atom), Text (atom), Badge (atom)
 * **Used In**: BlogGrid (organism), RelatedPosts (section)
 */
const meta: Meta<typeof BlogCard> = {
  title: "Molecules/BlogCard", // ← Follows atomic structure
  component: BlogCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A molecule-level component for displaying blog post previews. Combines multiple atoms (image, text, badge) into a cohesive card interface.",
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof BlogCard>

/**
 * Default State
 * Standard blog card with all elements present
 */
export const Default: Story = {
  args: {
    title: "Getting Started with Next.js 15",
    excerpt:
      "Learn the fundamentals of Next.js 15 and how to build modern web applications with React Server Components.",
    author: "Herman Adu",
    date: "2025-11-19",
    readTime: "5 min read",
    category: "Tutorial",
  },
}

/**
 * With Featured Image
 * Blog card with hero image
 */
export const WithImage: Story = {
  args: {
    ...Default.args,
    image: {
      url: "/images/blog/nextjs-15.jpg",
      alt: "Next.js 15 Tutorial Cover",
    },
  },
}

/**
 * Loading State
 * Skeleton loader while content fetches
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
}

/**
 * Dark Mode
 * Card appearance in dark theme
 */
export const DarkMode: Story = {
  args: Default.args,
  parameters: {
    backgrounds: { default: "dark" },
  },
}

/**
 * Mobile View
 * Responsive layout on small screens
 */
export const Mobile: Story = {
  args: Default.args,
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
}
```

---

## 🔗 CONNECTION TO ATOMIC DESIGN

### Story Naming Convention

**Format**: `[AtomicLevel]/[ComponentName]`

**Examples**:

- `Atoms/Button`
- `Atoms/Input`
- `Molecules/BlogCard`
- `Molecules/FormField`
- `Organisms/Header`
- `Organisms/HeroSection`
- `Sections/Newsletter`
- `Sections/Testimonials`
- `Pages/Homepage`

**Benefits**:

- ✅ Clear hierarchy visible in Storybook sidebar
- ✅ Easy to find components by atomic level
- ✅ Matches file system structure
- ✅ Reinforces architectural principles

---

### Story Organization Reflects Architecture

```
Storybook Sidebar                  Atomic Design Docs
──────────────────────────────────────────────────────
📁 Atoms                          02-architecture/atomic-design/
  📄 Button                           ├── 02-ATOMIC-DESIGN-PRIMER.md
  📄 Input                            └── 05-COMPONENT-INVENTORY.md
  📄 Badge
                                   Component classification:
📁 Molecules                       - Atoms: Single-purpose UI elements
  📄 BlogCard                      - Molecules: Simple combinations
  📄 FormField                     - Organisms: Complex feature blocks
  📄 SearchBar                     - Sections: Page regions
                                   - Pages: Full page layouts
📁 Organisms
  📄 Header
  📄 HeroSection
  📄 ContactForm

📁 Sections
  📄 Newsletter
  📄 Testimonials
  📄 FAQ

📁 Pages
  📄 Homepage
  📄 ContactPage
```

---

## 🚀 WORKFLOW INTEGRATION

### Component Development Lifecycle

```
1. Design Component (Atomic Design)
   │
   ├─ Identify atomic level
   ├─ List dependencies (which atoms/molecules needed)
   └─ Plan states (default, loading, error, etc.)
   │
   ↓
2. Create Story First
   │
   ├─ Define all visual states
   ├─ Document props
   └─ Add examples
   │
   ↓
3. Develop Component in Isolation (Storybook)
   │
   ├─ Run: yarn storybook
   ├─ Develop with hot reload
   └─ Test all story variants
   │
   ↓
4. Review in Storybook UI
   │
   ├─ Check all states render correctly
   ├─ Test accessibility
   ├─ Verify dark mode
   └─ Test responsive breakpoints
   │
   ↓
5. Visual Regression Baseline (Chromatic)
   │
   ├─ Commit story
   ├─ Push to GitHub
   ├─ Chromatic captures screenshots
   └─ Approve baseline
   │
   ↓
6. Integrate into App
   │
   ├─ Import component
   ├─ Use in pages/sections
   └─ Test in real context
   │
   ↓
7. Maintain Documentation
   │
   └─ Update 05-COMPONENT-INVENTORY.md
```

---

## 📖 DOCUMENTATION SYNERGY

### Storybook + Atomic Docs = Complete Picture

**Storybook Provides**:

- ✅ Live component playground
- ✅ Interactive prop controls
- ✅ Visual state variations
- ✅ Accessibility testing
- ✅ Code snippets

**Atomic Design Docs Provide**:

- ✅ Architectural context ([02-architecture/atomic-design/](../../02-architecture/atomic-design/))
- ✅ Design principles ([01-ETHOS.md](/docs/02-architecture-atomic-design-01-ethos))
- ✅ Component inventory ([05-COMPONENT-INVENTORY.md](/docs/02-architecture-atomic-design-05-component-inventory))
- ✅ Strategic planning ([04-STRATEGIC-PLAN.md](/docs/02-architecture-atomic-design-04-strategic-plan))
- ✅ Best practices

**Together**:

- 🎯 Theory (Atomic Docs) + Practice (Storybook) = Mastery
- 🎯 Understanding WHY + Seeing HOW = Complete Knowledge
- 🎯 Architecture (Docs) + Implementation (Stories) = Maintainable System

---

## 🎯 WHEN COMPONENTS ARE COMPLETE

### Future: Full Storybook Integration

**Current State** (November 2025):

- ✅ Storybook configured
- ✅ Example stories exist
- ✅ Chromatic integrated
- ⚠️ Not yet part of standard workflow

**Future State** (When Components Complete):

Will be integrated into workflow:

1. **Mandatory Stories**:

   - Every component MUST have stories
   - All states documented
   - Examples for content managers

2. **Visual Regression Required**:

   - Chromatic baseline for all components
   - PR review includes visual changes
   - Block merge on visual regression failures

3. **Living Documentation**:

   - Storybook published to public URL
   - Content managers access for customization guides
   - Design team uses for reference

4. **Content Manager Empowerment**:
   - Component customization previews
   - Visual prop explorer
   - Copy-paste code snippets

---

## 🔧 STORYBOOK CONFIGURATION

### Our Setup

**Location**: `apps/ui/.storybook/`

**Files**:

- `main.ts` - Core configuration
- `preview.ts` - Global decorators, parameters

**Key Features Enabled**:

```typescript
// apps/ui/.storybook/main.ts
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook", // ← Visual regression
    "@storybook/addon-docs", // ← Auto-generated docs
    "@storybook/addon-onboarding", // ← First-time user guide
  ],
  framework: {
    name: "@storybook/nextjs", // ← Next.js support
    options: {},
  },
  staticDirs: ["../public"], // ← Access to public assets
}
```

---

## 💡 BEST PRACTICES

### DO ✅

1. **Follow Atomic Naming**:

   ```typescript
   title: "Molecules/BlogCard" // Not "Components/BlogCard"
   ```

2. **Document Atomic Level**:

   ```typescript
   /**
    * **Atomic Design Level**: Molecule
    * **Composed Of**: Image (atom), Heading (atom)
    * **Used In**: BlogGrid (organism)
    */
   ```

3. **Link to Architecture Docs**:

   ```typescript
   parameters: {
     docs: {
       description: {
         component: `
           Molecule-level component following atomic design principles.
           See: [Atomic Design Primer](/docs/02-architecture-atomic-design-02-atomic-design-primer)
         `,
       },
     },
   };
   ```

4. **Create Stories for All States**:
   - Default
   - Loading
   - Error
   - Empty
   - With Data
   - Dark Mode
   - Mobile View

### DON'T ❌

1. **Don't Mix Atomic Levels**:

   ```typescript
   // ❌ Bad - mixing levels
   title: "Components/BlogCard"

   // ✅ Good - clear level
   title: "Molecules/BlogCard"
   ```

2. **Don't Skip Documentation**:

   ```typescript
   // ❌ Bad - no context
   export const Default: Story = { args: {} }

   // ✅ Good - documented
   /**
    * Default State
    * Standard blog card with all elements present
    */
   export const Default: Story = { args: {} }
   ```

3. **Don't Ignore Architecture**:
   - Every component should fit atomic design model
   - If unsure, consult [05-COMPONENT-INVENTORY.md](/docs/02-architecture-atomic-design-05-component-inventory)

---

## 🎓 LEARNING PATH

### For New Developers

1. **Understand Atomic Design**:

   - Read [01-ETHOS.md](/docs/02-architecture-atomic-design-01-ethos)
   - Study [02-ATOMIC-DESIGN-PRIMER.md](/docs/02-architecture-atomic-design-02-atomic-design-primer)
   - Review [05-COMPONENT-INVENTORY.md](/docs/02-architecture-atomic-design-05-component-inventory)

2. **Explore Existing Stories**:

   ```bash
   yarn storybook
   # Open http://localhost:6006
   ```

3. **Study Story Structure**:

   - Check `src/components/molecules/BlogCard/BlogCard.stories.tsx`
   - See how atomic levels are organized
   - Notice naming conventions

4. **Create Your First Story**:
   - Follow [component development guide](/docs/04-components-development-guide)
   - Use atomic design template above
   - Test in Storybook UI

---

## 📚 RELATED DOCUMENTATION

### Architecture

- [Atomic Design Ethos](/docs/02-architecture-atomic-design-01-ethos)
- [Atomic Design Primer](/docs/02-architecture-atomic-design-02-atomic-design-primer)
- [Component Inventory](/docs/02-architecture-atomic-design-05-component-inventory)
- [Strategic Plan](/docs/02-architecture-atomic-design-04-strategic-plan)

### Development

- [Component Development Guide](/docs/04-components-development-guide)
- [Component Integration Guide](/docs/04-components-integration-guide)
- [Component Workflow](/docs/04-components-workflow)

### Testing

- [Testing Strategy Overview](/docs/13-testing-readme)
- [Chromatic Visual Regression](/docs/13-testing-chromatic-setup)
- [E2E Testing Guide](/docs/e2e-playwright)

---

## 🚀 QUICK START

### Run Storybook Locally

```bash
# From repo root
cd apps/ui
yarn storybook

# Opens http://localhost:6006
```

### Create New Story

```bash
# Example: Creating BlogCard story
touch src/components/molecules/BlogCard/BlogCard.stories.tsx
```

Use template above, replace `BlogCard` with your component.

---

## 🎯 SUCCESS METRICS

### Current State

- ✅ Storybook configured
- ✅ Example stories exist
- ✅ Chromatic integrated
- ⚠️ ~10 components with stories

### Target State (When Components Complete)

- ✅ 80%+ components have stories
- ✅ All atomic levels represented
- ✅ Visual regression baseline established
- ✅ Integrated into standard workflow
- ✅ Content manager access enabled
- ✅ Published to public URL

---

**Questions?** See [Testing Strategy](/docs/13-testing-readme) or [Component Development](/docs/04-components-development-guide)! 🚀
