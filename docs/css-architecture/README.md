# 🎨 CSS Architecture Documentation

> **Category:** Scalable Styling System  
> **Status:** In Development  
> **Last Updated:** November 16, 2025  
> **Complexity:** Intermediate  
> **Tech Stack:** Tailwind CSS v4, CSS Variables, BEM naming

---

## 📖 Overview

This section covers the **scalable CSS architecture** for the Strapi + Next.js monorepo, built on **Tailwind CSS v4**, **design tokens**, and **atomic design principles**.

### What You'll Learn

- **Design Tokens** - CSS variables for colors, spacing, typography
- **Tailwind v4 Setup** - Modern configuration with CSS-first approach
- **Layout Patterns** - Grid, Flexbox, and responsive template areas
- **Gradient System** - Custom gradient utilities from theme tokens
- **Naming Conventions** - BEM + Atomic hybrid for component classes
- **Responsive Design** - Mobile-first breakpoints and fluid typography

---

## 🗂️ Documentation Structure

### 📄 [00-CSS-ARCHITECTURE-OVERVIEW.md](./00-CSS-ARCHITECTURE-OVERVIEW.md)

**System overview and methodology**

- CSS architecture philosophy
- Atomic design → CSS mapping
- Scalability principles (BEM + Utility-first)
- File organization (global, components, utilities)
- Preprocessor strategy (why Tailwind v4 uses CSS, not config)

**When to read:** Start here for high-level understanding

---

### 🎨 [01-DESIGN-TOKENS.md](./01-DESIGN-TOKENS.md)

**CSS custom properties (variables) system**

- Color system (semantic colors: `--color-primary`, `--color-danger`)
- Spacing scale (consistent rhythm: `--space-xs`, `--space-xl`)
- Typography tokens (font sizes, line heights, weights)
- Border radius, shadows, z-index
- Theme switching (light/dark modes)
- Token organization in monorepo (`packages/design-system`)

**When to read:** Before styling any component

**Example Preview:**

```css
:root {
  /* Semantic colors (intent-based) */
  --color-primary: oklch(0.6 0.25 260);
  --color-danger: oklch(0.55 0.22 25);

  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Typography */
  --font-size-body: 1rem;
  --font-size-heading-1: 2.5rem;
  --line-height-body: 1.6;
}
```

---

### ⚙️ [02-TAILWIND-V4-SETUP.md](./02-TAILWIND-V4-SETUP.md)

**Modern Tailwind configuration**

- CSS-first configuration (goodbye `tailwind.config.js`)
- `@theme` directive for custom tokens
- Plugin setup for Tailwind v4
- Monorepo configuration (`packages/design-system`)
- PostCSS integration
- JIT (Just-In-Time) mode optimization

**When to read:** When setting up Tailwind in the project

**Example Preview:**

```css
/* apps/ui/src/styles/theme.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.6 0.25 260);
  --font-family-display: "Inter", system-ui, sans-serif;
  --breakpoint-2xl: 1400px;
}
```

---

### 📐 [03-LAYOUT-PATTERNS.md](./03-LAYOUT-PATTERNS.md)

**Responsive layout strategies**

- CSS Grid fundamentals (12-column system, auto-fit, minmax)
- Flexbox patterns (centering, spacing, alignment)
- Template areas for complex layouts
- Responsive design with Grid/Flexbox
- Container queries (when available)
- Common layout recipes (sidebar, hero, card grid)

**When to read:** When building page templates or organisms

**Example Preview:**

```css
/* Grid auto-fit pattern */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

/* Flexbox centering */
.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

---

### 🌈 [04-GRADIENT-SYSTEM.md](./04-GRADIENT-SYSTEM.md)

**Custom gradient utilities**

- Gradient design tokens (`--gradient-primary`, `--gradient-sunset`)
- Tailwind v4 gradient utilities
- Angle control and direction
- Text gradients with `background-clip`
- Animated gradients (CSS animations)
- Performance considerations

**When to read:** When implementing brand gradients

**Example Preview:**

```css
@theme {
  --gradient-primary: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-accent) 100%
  );
}

/* Usage */
<div className="bg-[var(--gradient-primary)]">...</div>
```

---

### 🏷️ [05-NAMING-CONVENTIONS.md](./05-NAMING-CONVENTIONS.md)

**BEM + Atomic hybrid naming**

- BEM basics (Block, Element, Modifier)
- Atomic prefixes (`a-`, `m-`, `o-`, `t-`, `p-`)
- Component class structure
- When to use BEM vs Tailwind utilities
- Naming anti-patterns
- File naming alignment

**When to read:** Before creating new components

**Example Preview:**

```css
/* Atomic + BEM hybrid */
.a-button {
  /* Atom: Button */
}
.a-button--primary {
  /* Modifier: Primary variant */
}
.a-button__icon {
  /* Element: Icon inside button */
}

.m-card {
  /* Molecule: Card */
}
.m-card__header {
}
.m-card__body {
}

.o-hero {
  /* Organism: Hero section */
}
.o-hero__title {
}
.o-hero__cta {
}
```

---

### 📱 [06-RESPONSIVE-DESIGN.md](./06-RESPONSIVE-DESIGN.md)

**Mobile-first responsive strategies**

- Breakpoint system (Tailwind defaults + custom)
- Mobile-first approach
- Fluid typography (`clamp()` function)
- Responsive spacing
- Media query strategies
- Testing responsive layouts

**When to read:** When implementing responsive components

**Example Preview:**

```css
/* Fluid typography */
h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
}

/* Responsive grid */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## 🎯 Quick Start by Use Case

### I want to... 🤔

#### Use consistent spacing in my component

**Go to:** [01-DESIGN-TOKENS.md](./01-DESIGN-TOKENS.md) → Spacing Scale

```tsx
<div className="p-[var(--space-md)] gap-[var(--space-sm)]">
```

---

#### Create a custom gradient

**Go to:** [04-GRADIENT-SYSTEM.md](./04-GRADIENT-SYSTEM.md) → Gradient Tokens

```css
@theme {
  --gradient-sunset: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

---

#### Name a new molecule component

**Go to:** [05-NAMING-CONVENTIONS.md](./05-NAMING-CONVENTIONS.md) → Atomic Prefixes

```css
.m-testimonial-card {
}
.m-testimonial-card__quote {
}
.m-testimonial-card__author {
}
```

---

#### Build a responsive card grid

**Go to:** [03-LAYOUT-PATTERNS.md](./03-LAYOUT-PATTERNS.md) → Grid Auto-Fit

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}
```

---

#### Set up Tailwind v4 in the monorepo

**Go to:** [02-TAILWIND-V4-SETUP.md](./02-TAILWIND-V4-SETUP.md) → Monorepo Configuration

---

## 🏗️ Architecture Overview

### CSS Layers Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CSS ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1️⃣  DESIGN TOKENS (CSS Variables)                         │
│      :root { --color-primary, --space-md, --font-size-h1 }  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  2️⃣  TAILWIND BASE + UTILITIES                             │
│      @import "tailwindcss";                                  │
│      @theme { ... }                                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  3️⃣  GLOBAL STYLES                                         │
│      Typography, Resets, Accessibility                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  4️⃣  COMPONENT STYLES (BEM + Atomic)                       │
│      .a-button { }                                           │
│      .m-card { }                                             │
│      .o-hero { }                                             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  5️⃣  UTILITY OVERRIDES                                     │
│      Custom utilities not in Tailwind                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### File Organization

```
apps/ui/src/styles/
├── globals.css          # Entry point (imports all)
├── theme.css            # @theme directive + tokens
├── typography.css       # Font styles, headings
├── layout.css           # Grid, Flexbox utilities
└── components/
    ├── atoms.css        # .a-button, .a-input
    ├── molecules.css    # .m-card, .m-form-group
    └── organisms.css    # .o-hero, .o-navbar

packages/design-system/src/
├── tokens.css           # Shared design tokens
└── gradients.css        # Gradient utilities
```

---

## 🎨 Design Token Philosophy

### Semantic vs Literal Naming

**❌ AVOID (Literal):**

```css
:root {
  --red-500: #ef4444;
  --blue-600: #2563eb;
}
```

**Problem:** What if brand color changes from blue to purple?

**✅ PREFER (Semantic):**

```css
:root {
  --color-primary: oklch(0.6 0.25 260); /* Can change value without renaming */
  --color-danger: oklch(0.55 0.22 25);
  --color-success: oklch(0.65 0.18 145);
}
```

**Benefits:**

- Intent-based naming survives design changes
- Easier to maintain consistency
- Self-documenting code

---

## 🚀 Implementation Checklist

### Phase 1: Design Tokens (Day 1)

```
□ Define color palette (primary, secondary, danger, success, neutral)
□ Create spacing scale (xs, sm, md, lg, xl, 2xl)
□ Set typography tokens (font sizes, line heights, weights)
□ Document border radius, shadows, z-index values
□ Add theme switching support (light/dark)
```

### Phase 2: Tailwind v4 Setup (Day 1)

```
□ Install Tailwind CSS v4
□ Configure PostCSS
□ Create theme.css with @theme directive
□ Set up monorepo package structure
□ Test JIT mode with custom tokens
```

### Phase 3: Layout Patterns (Day 2)

```
□ Create Grid utility classes (12-column, auto-fit)
□ Create Flexbox utility classes (centering, spacing)
□ Build common layout recipes (sidebar, hero, card grid)
□ Test responsive behavior
```

### Phase 4: Component Styles (Day 2-3)

```
□ Define naming convention (BEM + Atomic prefixes)
□ Create atom styles (.a-button, .a-input)
□ Create molecule styles (.m-card, .m-form-group)
□ Create organism styles (.o-hero, .o-navbar)
□ Document component patterns
```

### Phase 5: Gradients & Advanced (Day 3)

```
□ Create gradient tokens
□ Build text gradient utilities
□ Add animated gradient patterns
□ Test performance
```

---

## ⚠️ Common CSS Pitfalls

### Pitfall #1: Over-Reliance on Tailwind Utilities

**❌ BAD:**

```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200">
  Click Me
</button>
```

**Problem:** Hard to maintain, not reusable, bloated HTML

**✅ GOOD:**

```tsx
<button className="a-button a-button--primary">Click Me</button>
```

```css
.a-button {
  @apply font-semibold py-2 px-4 rounded-lg shadow-md transition-colors;
}
.a-button--primary {
  @apply bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white;
}
```

**Rule:** Use Tailwind for layout/spacing. Use component classes for reusable patterns.

---

### Pitfall #2: Hardcoded Values Instead of Tokens

**❌ BAD:**

```css
.card {
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

**✅ GOOD:**

```css
.m-card {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}
```

**Rule:** Always use design tokens for consistent theming.

---

### Pitfall #3: Ignoring Mobile-First

**❌ BAD:**

```css
.hero {
  font-size: 3rem; /* Desktop size by default */
}

@media (max-width: 768px) {
  .hero {
    font-size: 1.5rem;
  } /* Overriding */
}
```

**✅ GOOD:**

```css
.o-hero__title {
  font-size: clamp(1.5rem, 5vw, 3rem); /* Fluid */
}

/* Or with Tailwind */
<h1 className="text-2xl md:text-4xl lg:text-5xl">
```

**Rule:** Start small (mobile), scale up (desktop).

---

### Pitfall #4: Deep Nesting in BEM

**❌ BAD:**

```css
.o-hero__content__title__text__highlight {
  /* Too deep! */
}
```

**✅ GOOD:**

```css
.o-hero__title {
}
.o-hero__title--highlighted {
}
```

**Rule:** Keep BEM flat. Max 2 levels (Block\_\_Element--Modifier).

---

## 🔗 Related Documentation

- [Atomic Architecture](../atomic-architecture/README.md) - Component hierarchy
- [Content Modeling](../content-modeling/README.md) - Data structure
- [Performance Optimization](../performance-optimization/README.md) - CSS optimization
- [Workflows & Automation](../workflows-automation/README.md) - Linting, formatting

---

## 🤖 Automation Opportunities

### Automated Token Sync

**Goal:** Sync design tokens from Figma to codebase

**Approach:**

1. Export design tokens from Figma (using Tokens Studio plugin)
2. Script converts JSON tokens to CSS variables
3. Commit to `packages/design-system/tokens.css`
4. CI validates token changes

**Status:** 📋 Planned

---

### CSS Linting & Formatting

**Goal:** Enforce consistent CSS patterns

**Tools:**

- **Stylelint** - Lint CSS/SCSS files
- **Prettier** - Format CSS
- **PostCSS** - Process CSS (autoprefixer, minification)

**Status:** 🏗️ Partially configured

---

## 📚 Learning Path

### Beginner (1-2 days)

1. Read [01-DESIGN-TOKENS.md](./01-DESIGN-TOKENS.md)
2. Understand color, spacing, typography tokens
3. Read [02-TAILWIND-V4-SETUP.md](./02-TAILWIND-V4-SETUP.md)
4. Set up Tailwind in the project

### Intermediate (3-5 days)

5. Read [03-LAYOUT-PATTERNS.md](./03-LAYOUT-PATTERNS.md)
6. Build responsive layouts with Grid/Flexbox
7. Read [05-NAMING-CONVENTIONS.md](./05-NAMING-CONVENTIONS.md)
8. Apply BEM + Atomic naming to components

### Advanced (1 week)

9. Read [04-GRADIENT-SYSTEM.md](./04-GRADIENT-SYSTEM.md)
10. Create custom gradient utilities
11. Read [06-RESPONSIVE-DESIGN.md](./06-RESPONSIVE-DESIGN.md)
12. Optimize for all screen sizes

---

**🎉 You're ready to build a scalable CSS architecture!**

Start with [01-DESIGN-TOKENS.md](./01-DESIGN-TOKENS.md) to define your design system foundation, then proceed to [02-TAILWIND-V4-SETUP.md](./02-TAILWIND-V4-SETUP.md) for implementation.
