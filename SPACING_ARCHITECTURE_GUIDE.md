# Spacing Architecture Guide

> **Critical Reference**: Complete guide to implementing uniform vertical spacing with content manager control. Based on real-world lessons from Newsletter CTA Section implementation.

**Last Updated:** November 14, 2025  
**Status:** ✅ Production Pattern

---

## Table of Contents

1. [The Problem We Solved](#the-problem-we-solved)
2. [Core Principles](#core-principles)
3. [Implementation Pattern](#implementation-pattern)
4. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
5. [Testing Checklist](#testing-checklist)
6. [Real-World Example](#real-world-example)
7. [Future Reference](#future-reference)

---

## The Problem We Solved

### Symptom

Inconsistent vertical spacing when components are conditionally rendered (badge shown/hidden, header shown/hidden). The space between elements doesn't match visually, creating a broken rhythm.

### Root Cause

**Mixing spacing responsibilities** - components adding their own margins (`mb-6`, `mt-4`) instead of letting the parent container handle all spacing uniformly.

### Visual Example

```
❌ WRONG (Inconsistent spacing):
Badge
  [small gap - hardcoded mb-6]
Header (Heading)
  [small gap - space-y-4]
Header (Description)
  [LARGE gap - parent gap-12]
Main Content

✅ CORRECT (Uniform spacing):
Badge
  [LARGE gap - parent gap-12]
Header (Heading)
  [small gap - space-y-4]
Header (Description)
  [LARGE gap - parent gap-12]
Main Content
```

---

## Core Principles

### 1. **Single Source of Truth for Section Spacing**

The **parent container** controls ALL vertical spacing between major sections (badge, header, main content).

```tsx
// Parent controls section-level spacing
<div className="flex flex-col gap-12">
  <SectionBadge /> {/* No margin */}
  <SectionHeader /> {/* No margin */}
  <MainContent /> {/* No margin */}
</div>
```

### 2. **Components Manage Internal Spacing Only**

Individual components (like `SectionHeader`) only control spacing **within themselves**.

```tsx
// SectionHeader controls internal spacing
<div className="space-y-4">
  {" "}
  {/* Internal spacing */}
  <h2>Heading</h2>
  <p>Description</p>
</div>
```

### 3. **Content Manager Control via Spacing Setting**

One setting controls BOTH:

- Section-level gaps (parent container)
- Internal component spacing

```tsx
const headerSpacing = component.header?.spacing ?? "default"

const sectionGap = {
  compact: "gap-8", // Section separation
  default: "gap-12",
  spacious: "gap-16",
}[headerSpacing]
```

### 4. **No Hardcoded Margins on Reusable Components**

❌ **NEVER:**

```tsx
// Bad - hardcoded margin
<OrbAnimation className="mb-6 flex items-center">
  <div className="badge">...</div>
</OrbAnimation>
```

✅ **ALWAYS:**

```tsx
// Good - no margin, parent gap handles spacing
<OrbAnimation className="flex items-center">
  <div className="badge">...</div>
</OrbAnimation>
```

---

## Implementation Pattern

### Step 1: Define Spacing Map

```tsx
// Map content manager's spacing setting to CSS classes
const headerSpacing = component.header?.spacing ?? "default"

const sectionGap = {
  compact: "gap-8", // 2rem - tight sections
  default: "gap-12", // 3rem - balanced
  spacious: "gap-16", // 4rem - generous breathing room
}[headerSpacing]
```

### Step 2: Parent Container with Uniform Gap

```tsx
<SectionWrapper background={backgroundConfig}>
  {/* Parent container controls ALL vertical spacing */}
  <div className={`flex w-full flex-col ${sectionGap}`}>
    <SectionBadge badge={component.badge} />
    {component.header && <SectionHeader header={component.header} />}
    <MainContent />
  </div>
</SectionWrapper>
```

### Step 3: Child Components Return Null When Hidden

```tsx
// SectionBadge component
export function SectionBadge({ badge }) {
  if (!badge?.text) return null
  if (!badge.showBadge) return null // Null-safe - gap collapses

  return (
    <OrbAnimation className="flex items-center">
      {" "}
      {/* NO MARGIN */}
      <div className="badge">{badge.text}</div>
    </OrbAnimation>
  )
}
```

### Step 4: Internal Spacing Controlled by Component

```tsx
// SectionHeader component
function getSpacingClass(spacing?: "compact" | "default" | "spacious") {
  switch (spacing) {
    case "compact":
      return "space-y-2" // 0.5rem
    case "spacious":
      return "space-y-6" // 1.5rem
    case "default":
      return "space-y-4" // 1rem (default)
  }
}

export function SectionHeader({ header }) {
  const spacingClass = getSpacingClass(header.spacing)

  return (
    <div className={spacingClass}>
      {" "}
      {/* Internal spacing ONLY */}
      <h2>{header.heading}</h2>
      <p>{header.description}</p>
    </div>
  )
}
```

---

## Common Pitfalls & Solutions

### ❌ Pitfall 1: Hardcoded Margins on Reusable Components

**Problem:**

```tsx
// Component adds its own margin
<OrbAnimation className="mb-6 flex items-center">
  <SectionBadge />
</OrbAnimation>
```

**Why It Fails:**

- Creates **double spacing** when combined with parent gap
- **Inconsistent** when component is hidden (margin remains in some cases)
- **Not controllable** by content managers

**Solution:**

```tsx
// Remove ALL margins from reusable components
<OrbAnimation className="flex items-center">
  <SectionBadge />
</OrbAnimation>
```

---

### ❌ Pitfall 2: Wrapping Badge + Header Together

**Problem:**

```tsx
// Attempting to group badge and header
{
  ;(component.badge || component.header) && (
    <div className="space-y-6">
      {" "}
      {/* Different spacing than parent gap */}
      <SectionBadge />
      <SectionHeader />
    </div>
  )
}
```

**Why It Fails:**

- Badge→Header gap (`space-y-6`) differs from Header→Content gap (parent `gap-12`)
- Creates **uneven visual rhythm**
- Breaks uniform spacing principle

**Solution:**

```tsx
// Let parent gap handle ALL spacing uniformly
<div className="flex flex-col gap-12">
  <SectionBadge /> {/* gap-12 */}
  <SectionHeader /> {/* gap-12 */}
  <MainContent />
</div>
```

---

### ❌ Pitfall 3: Matching Internal Spacing to Section Spacing

**Problem:**

```tsx
// Trying to make badge→header match header's internal spacing
const internalGap = {
  compact: "space-y-2", // Same as header's internal spacing
  default: "space-y-4",
}
```

**Why It Fails:**

- Section separation (badge→header) needs **larger gaps** than internal spacing
- Creates **cramped layout** where sections blur together
- No visual hierarchy between internal vs external spacing

**Solution:**

```tsx
// Section gaps should be LARGER than internal spacing
const sectionGap = {
  compact: "gap-8", // 2rem (LARGE)
  default: "gap-12", // 3rem (LARGE)
}

// vs Header's internal spacing (SMALLER for cohesion)
const internalSpacing = {
  compact: "space-y-2", // 0.5rem (small)
  default: "space-y-4", // 1rem (small)
}
```

---

### ❌ Pitfall 4: Using `space-y` Instead of `gap` for Flex Containers

**Problem:**

```tsx
<div className="flex flex-col space-y-12">
  {" "}
  {/* Wrong utility */}
  <SectionBadge />
  <SectionHeader />
</div>
```

**Why It Fails:**

- `space-y-*` uses **margin** (can create issues with null children in some cases)
- `gap-*` is the **modern flexbox/grid approach**
- `gap` is more predictable with conditional rendering

**Solution:**

```tsx
<div className="flex flex-col gap-12">
  {" "}
  {/* Correct - use gap with flex */}
  <SectionBadge />
  <SectionHeader />
</div>
```

---

### ❌ Pitfall 5: Passing `className="mb-0"` to Override Margins

**Problem:**

```tsx
// Trying to override component's built-in margin
<SectionHeader header={component.header} className="mb-0" />
```

**Why It's a Code Smell:**

- Indicates the component has **unwanted margins** in the first place
- Should never need to override if component is designed correctly

**Solution:**

```tsx
// Component should have NO margin by default
;<SectionHeader header={component.header} />

// Component implementation - no bottom margin
export function SectionHeader({ header, className }) {
  return (
    <div className={cn(spacingClass, alignmentClass, className)}>
      {/* No mb-* classes here */}
    </div>
  )
}
```

---

## Testing Checklist

### Visual Testing Scenarios

Test ALL combinations for EACH spacing setting (compact/default/spacious):

#### Scenario 1: All Visible

- ✅ Badge visible
- ✅ Header visible (heading + description)
- ✅ Main content visible
- **Verify:** Badge→Header gap = Header→Content gap (uniform)
- **Verify:** Heading→Description gap is SMALLER (internal cohesion)

#### Scenario 2: Badge Hidden

- ❌ Badge hidden (`showBadge: false`)
- ✅ Header visible
- ✅ Main content visible
- **Verify:** Header→Content gap remains consistent
- **Verify:** No phantom spacing where badge would be

#### Scenario 3: Header Hidden

- ✅ Badge visible
- ❌ Header hidden (`showHeader: false`)
- ✅ Main content visible
- **Verify:** Badge→Content gap remains consistent
- **Verify:** No phantom spacing where header would be

#### Scenario 4: Both Hidden

- ❌ Badge hidden
- ❌ Header hidden
- ✅ Main content visible
- **Verify:** Main content appears at natural position
- **Verify:** No wrapper div rendering (optimization)

### Code Review Checklist

Before committing, verify:

- [ ] No `mb-*` or `mt-*` classes on reusable components (Badge, Header)
- [ ] Parent container uses `gap-*` (not `space-y-*`) for flexbox
- [ ] All children return `null` when hidden (not empty divs)
- [ ] Spacing setting controls BOTH section gaps AND internal spacing
- [ ] Gap values are larger than internal spacing values
- [ ] No conditional wrappers around badge/header
- [ ] Comments explain spacing architecture
- [ ] Visual testing completed for all scenarios

---

## Real-World Example

### Newsletter CTA Section - Final Implementation

```tsx
export function StrapiNewsletterCTASection({ component }) {
  // Map header spacing setting to CSS gap classes
  const headerSpacing = component.header?.spacing ?? "default"

  const sectionGap = {
    compact: "gap-8", // 2rem - tight sections
    default: "gap-12", // 3rem - balanced spacing
    spacious: "gap-16", // 4rem - generous breathing room
  }[headerSpacing]

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Parent container: uniform gap for ALL section spacing */}
      <div className={`flex w-full flex-col ${sectionGap}`}>
        {/* Badge - returns null when hidden */}
        <SectionBadge badge={component.badge ?? undefined} />

        {/* Header - spacing property controls ONLY internal spacing */}
        {component.header && <SectionHeader header={component.header} />}

        {/* Main content section */}
        <div className="w-full">{/* Newsletter form and benefits */}</div>
      </div>
    </SectionWrapper>
  )
}
```

### SectionHeader - Internal Spacing Only

```tsx
function getSpacingClass(spacing?: "compact" | "default" | "spacious"): string {
  switch (spacing) {
    case "compact":
      return "space-y-2" // 0.5rem - tight internal spacing
    case "spacious":
      return "space-y-6" // 1.5rem - generous internal spacing
    case "default":
    default:
      return "space-y-4" // 1rem - balanced internal spacing
  }
}

export function SectionHeader({ header, className }) {
  if (!header?.heading) return null
  if (!header.showHeader) return null

  const spacingClass = getSpacingClass(header.spacing ?? undefined)
  const wrapperClasses = cn(spacingClass, alignmentClass, className)

  return (
    <div className={wrapperClasses}>
      {" "}
      {/* NO margin classes */}
      <h2>{header.heading}</h2>
      <p>{header.description}</p>
    </div>
  )
}
```

### SectionBadge - No Margins

```tsx
export function SectionBadge({ badge }) {
  if (!badge?.text) return null
  if (!badge.showBadge) return null

  return (
    <OrbAnimation
      orbAnimation={badge.orbAnimation}
      className="flex items-center justify-center"  {/* NO mb-* */}
    >
      <div className="badge">{badge.text}</div>
    </OrbAnimation>
  )
}
```

---

## Spacing Values Reference

### Section-Level Spacing (Parent Gap)

| Setting      | CSS Class | Rem Value | Pixels | Use Case                    |
| ------------ | --------- | --------- | ------ | --------------------------- |
| **Compact**  | `gap-8`   | 2rem      | 32px   | Dense layouts, mobile-first |
| **Default**  | `gap-12`  | 3rem      | 48px   | Balanced, most common       |
| **Spacious** | `gap-16`  | 4rem      | 64px   | Hero sections, emphasis     |

### Internal Component Spacing (SectionHeader)

| Setting      | CSS Class   | Rem Value | Pixels | Use Case                  |
| ------------ | ----------- | --------- | ------ | ------------------------- |
| **Compact**  | `space-y-2` | 0.5rem    | 8px    | Tight heading/description |
| **Default**  | `space-y-4` | 1rem      | 16px   | Balanced internal spacing |
| **Spacious** | `space-y-6` | 1.5rem    | 24px   | Generous internal spacing |

### Visual Ratio

**Section Gap : Internal Spacing**

- Compact: `2rem : 0.5rem` = **4:1 ratio**
- Default: `3rem : 1rem` = **3:1 ratio**
- Spacious: `4rem : 1.5rem` = **2.67:1 ratio**

This ratio creates proper **visual hierarchy** - clear section separation with internal cohesion.

---

## Future Reference

### When Creating New Sections

1. **Start with parent gap** - Decide on section-level spacing first
2. **Remove all margins** - Reusable components should have NO `mb-*` or `mt-*`
3. **Return null when hidden** - Not empty divs
4. **Map spacing setting** - Content manager controls both section + internal spacing
5. **Test all combinations** - Badge visible/hidden, Header visible/hidden
6. **Verify visual uniformity** - Use browser DevTools to measure gaps

### When Refactoring Existing Sections

1. **Identify hardcoded margins** - Search for `mb-*`, `mt-*` in components
2. **Find spacing inconsistencies** - Visual testing with inspector
3. **Replace with parent gap** - Move spacing responsibility up
4. **Update component props** - Add spacing settings if needed
5. **Document the pattern** - Comment the architecture in code

### Pattern Template

```tsx
// SPACING ARCHITECTURE TEMPLATE

export function YourSection({ component }) {
  // 1. Map content manager setting to gap classes
  const spacing = component.header?.spacing ?? "default"
  const sectionGap = {
    compact: "gap-8",
    default: "gap-12",
    spacious: "gap-16",
  }[spacing]

  return (
    <SectionWrapper>
      {/* 2. Parent container with uniform gap */}
      <div className={`flex flex-col ${sectionGap}`}>
        {/* 3. Reusable components with NO margins */}
        <SectionBadge badge={component.badge} />

        {component.header && <SectionHeader header={component.header} />}

        {/* 4. Main content */}
        <MainContent />
      </div>
    </SectionWrapper>
  )
}
```

---

## Troubleshooting

### Issue: Spacing looks uneven when badge is hidden

**Diagnosis:**

```tsx
// Check if badge component has hardcoded margin
<OrbAnimation className="mb-6 ...">  ❌ Remove this
```

**Fix:**

```tsx
<OrbAnimation className="flex items-center">  ✅ No margin
```

---

### Issue: Too much space between badge and header

**Diagnosis:**
Parent gap is too large, or badge/header are wrapped with extra spacing.

**Fix:**

```tsx
// Remove wrapper, use parent gap directly
<div className="flex flex-col gap-12">
  <Badge /> {/* gap-12 */}
  <Header /> {/* gap-12 */}
  <Content />
</div>
```

---

### Issue: Not enough space between header and main content

**Diagnosis:**
Parent gap is too small, or main content has negative margin.

**Fix:**

```tsx
// Increase parent gap OR check for margin overrides
<div className="flex flex-col gap-16">
  {" "}
  {/* Larger gap */}
  <Header />
  <MainContent /> {/* Check: no mt-* or negative margins */}
</div>
```

---

## Key Takeaways

1. **Parent gap controls section spacing** - Badge→Header→Content
2. **Components control internal spacing** - Heading→Description
3. **No hardcoded margins on reusable components** - Ever
4. **Section gaps > Internal spacing** - Create visual hierarchy
5. **Content managers control both** - Via single spacing setting
6. **Return null when hidden** - Gaps collapse automatically
7. **Test all combinations** - Badge/Header visible/hidden permutations

---

## Related Documentation

- [STYLING_GUIDE.md](./STYLING_GUIDE.md) - Container queries and responsive patterns
- [COMPONENT_INTEGRATION_GUIDE.md](./COMPONENT_INTEGRATION_GUIDE.md) - Strapi → Frontend workflow
- [COMPONENT_DEVELOPMENT_GUIDE.md](./COMPONENT_DEVELOPMENT_GUIDE.md) - Component creation patterns

---

**Remember:** Spacing is architecture, not decoration. Get it right once, reuse everywhere.
