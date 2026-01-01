# Section Spacing Architecture Guide

**Version**: 1.0  
**Date**: November 14, 2025  
**Status**: INTERIM SOLUTION - Requires comprehensive review

---

## ⚠️ Critical Notice

This document describes the **current interim spacing solution**. While functional, it has known limitations and requires a comprehensive architectural review to achieve truly consistent vertical spacing across all heading sizes and spacing options.

**Known Limitation**: Vertical spacing varies slightly when using different heading sizes due to typography line-height characteristics. This is inherent to CSS typography and cannot be fully normalized without custom line-height values or complex calculations.

---

## Table of Contents

1. [Spacing Hierarchy Overview](#spacing-hierarchy-overview)
2. [Two-Level Spacing System](#two-level-spacing-system)
3. [Implementation Patterns](#implementation-patterns)
4. [Component Setup Guide](#component-setup-guide)
5. [Testing Checklist](#testing-checklist)
6. [Known Issues & Future Work](#known-issues--future-work)

---

## Spacing Hierarchy Overview

### Three Distinct Spacing Concerns

```
┌─────────────────────────────────────────────────┐
│ SECTION WRAPPER (Background Container)          │
│                                                  │
│  ┌────────────────────────────────────────┐    │
│  │ SECTION-LEVEL SPACING (gap-8/12/16)    │    │ ← Controlled by background.padding
│  │                                         │    │
│  │  [Badge]                                │    │
│  │     ↕ Section Gap                       │    │
│  │  [Header]                               │    │
│  │     ↕ Section Gap                       │    │
│  │  [Content]                              │    │
│  └────────────────────────────────────────┘    │
│                                                  │
└─────────────────────────────────────────────────┘

WITHIN HEADER (Internal Spacing):
┌─────────────────────────────────────┐
│ HEADER INTERNAL (space-y-2/4/6)     │ ← Controlled by header.spacing
│                                      │
│  [Heading]                           │
│     ↕ Internal Gap                   │
│  [Divider] (if shown)                │
│     ↕ Internal Gap                   │
│  [Description]                       │
└─────────────────────────────────────┘
```

### Spacing Controls

| Level                 | Setting              | CSS Output                                                    | Purpose                                                       |
| --------------------- | -------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| **Section-level**     | `background.padding` | `gap-8` (32px)<br>`gap-12` (48px)<br>`gap-16` (64px)          | Controls gaps BETWEEN Badge, Header, and Content blocks       |
| **Header internal**   | `header.spacing`     | `space-y-2` (8px)<br>`space-y-4` (16px)<br>`space-y-6` (24px) | Controls gaps WITHIN the header (heading→divider→description) |
| **Container padding** | `background.padding` | `p-8/p-12/p-16`                                               | Controls padding inside bordered/elevated containers          |

**CRITICAL**: These are SEPARATE concerns. Mixing them causes spacing inconsistencies.

---

## Two-Level Spacing System

### Level 1: Section-Level Gaps (Badge → Header → Content)

**Controlled by**: `background.padding` setting in Strapi  
**Implementation location**: Section component (e.g., `StrapiNewsletterCTASection.tsx`)

```tsx
// Map background padding to section gaps
const backgroundPadding = backgroundConfig?.padding ?? "default"

const sectionGap = (
  {
    none: "gap-4", // 16px - Minimal separation
    compact: "gap-8", // 32px - Tight sections
    default: "gap-12", // 48px - Standard separation (RECOMMENDED)
    spacious: "gap-16", // 64px - Maximum breathing room
  } as const
)[backgroundPadding]
```

**Usage**:

```tsx
<SectionWrapper background={backgroundConfig}>
  <div className={`flex w-full flex-col ${sectionGap}`}>
    <SectionBadge badge={component.badge} />
    <SectionHeader header={component.header} />
    <div className="w-full">{/* Main content */}</div>
  </div>
</SectionWrapper>
```

**Visual Example**:

```
Compact (gap-8 = 32px):
[Badge]
   ↕ 32px
[Header: Heading + Description]
   ↕ 32px
[Content]

Spacious (gap-16 = 64px):
[Badge]
   ↕ 64px
[Header: Heading + Description]
   ↕ 64px
[Content]
```

---

### Level 2: Header Internal Spacing (Heading → Divider → Description)

**Controlled by**: `header.spacing` setting in Strapi  
**Implementation location**: `SectionHeader.tsx` component

```tsx
function getSpacingClass(spacing?: "compact" | "default" | "spacious"): string {
  switch (spacing) {
    case "compact":
      return "space-y-2" // 8px - Tight heading group
    case "spacious":
      return "space-y-6" // 24px - Airy heading group
    case "default":
    default:
      return "space-y-4" // 16px - Standard (RECOMMENDED)
  }
}
```

**Usage in SectionHeader**:

```tsx
const spacingClass = getSpacingClass(spacing ?? undefined)

return (
  <div className={cn(spacingClass, alignmentClass, className)}>
    <h2>{heading}</h2>
    {showDivider && <div className="h-1 w-24 bg-gradient..." />}
    {description && <p>{description}</p>}
  </div>
)
```

**Visual Example**:

```
Compact (space-y-2 = 8px):
Heading
   ↕ 8px
Divider
   ↕ 8px
Description

Spacious (space-y-6 = 24px):
Heading
   ↕ 24px
Divider
   ↕ 24px
Description
```

---

## Implementation Patterns

### Pattern 1: Section with Shared Header Component

**Use Case**: Most sections (Hero, Features, Newsletter, Metrics, etc.)

```tsx
export function StrapiMySection({ component }) {
  // 1. Extract background config
  const backgroundConfig = component.background ?? {
    backgroundStyle: "transparent",
    padding: "default",
    // ...defaults
  }

  // 2. Map background.padding to section-level gaps
  const backgroundPadding = backgroundConfig?.padding ?? "default"
  const sectionGap = (
    {
      none: "gap-4",
      compact: "gap-8",
      default: "gap-12",
      spacious: "gap-16",
    } as const
  )[backgroundPadding]

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Use flex-col with sectionGap for section-level spacing */}
      <div className={`flex w-full flex-col ${sectionGap}`}>
        {/* Badge - returns null when hidden */}
        <SectionBadge badge={component.badge} />

        {/* Header - its spacing property controls ONLY internal gaps */}
        {component.header && <SectionHeader header={component.header} />}

        {/* Main content */}
        <div className="w-full">{/* Your section content */}</div>
      </div>
    </SectionWrapper>
  )
}
```

**Key Points**:

- Section-level gap (`gap-8/12/16`) separates Badge, Header, and Content
- Header's `spacing` property controls ONLY its internal spacing
- Never override Header spacing from the section component
- `SectionBadge` returns `null` when `showBadge` is false (no gap created)

---

### Pattern 2: Custom Heading with Divider (Newsletter Form)

**Use Case**: Components with custom headings separate from Section Header

```tsx
<div className="space-y-6">
  {component.heading && (
    <div className="relative">
      <h2 className="text-3xl font-bold md:text-4xl">{component.heading}</h2>

      {/* Divider uses absolute positioning to avoid affecting spacing */}
      {component.showDivider && (
        <div className="from-primary/60 to-primary absolute -bottom-3 left-0 h-1 w-24 rounded-full bg-gradient-to-r" />
      )}
    </div>
  )}

  {component.description && (
    <p className="text-foreground/80 leading-relaxed">
      {component.description}
    </p>
  )}
</div>
```

**Key Points**:

- Custom heading uses `space-y-6` for consistent internal spacing
- Divider uses **absolute positioning** with `-bottom-3` offset
- Absolute positioning prevents divider from creating extra spacing
- This pattern is INDEPENDENT from Section Header spacing

---

### Pattern 3: Section Header with Divider (Shared Component)

**Use Case**: Section Header component with optional divider

```tsx
// In SectionHeader.tsx
const spacingClass = getSpacingClass(spacing ?? undefined)

return (
  <div className={cn(spacingClass, alignmentClass, className)}>
    <h2 className={headingClasses}>{heading}</h2>

    {/* Divider participates in space-y flow - CURRENTLY COMMENTED OUT */}
    {/* {showDivider && (
      <div className={cn(
        "from-primary/60 to-primary h-1 w-24 rounded-full bg-gradient-to-r",
        dividerAlignmentClass
      )} />
    )} */}

    {description && <p className={descriptionClasses}>{description}</p>}
  </div>
)
```

**Key Points**:

- Divider is a direct child of the `space-y-*` container
- Divider gap equals the spacing setting (2/4/6)
- Heading → Divider → Description all use same gap
- **CURRENT STATUS**: Divider commented out pending spacing review

---

## Component Setup Guide

### For New Sections Using Shared Header

**Step 1**: Add Schema Fields

In your Strapi component JSON (e.g., `my-section.json`):

```json
{
  "attributes": {
    "badge": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-badge"
    },
    "background": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-background"
    },
    "header": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-header"
    }
    // ...other section-specific fields
  }
}
```

---

**Step 2**: Implement Section Component

```tsx
import { Data } from "@repo/strapi"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiMySection({
  component,
}: {
  readonly component: Data.Component<"sections.my-section">
}) {
  // Extract background config with defaults
  const backgroundConfig = component.background ?? {
    backgroundStyle: "transparent" as const,
    containerStyle: "full-width" as const,
    containerWidth: "default" as const,
    padding: "default" as const,
    gradient: false,
  }

  // Map padding to section gaps
  const backgroundPadding = backgroundConfig?.padding ?? "default"
  const sectionGap = (
    {
      none: "gap-4",
      compact: "gap-8",
      default: "gap-12",
      spacious: "gap-16",
    } as const
  )[backgroundPadding]

  return (
    <SectionWrapper background={backgroundConfig}>
      <div className={`flex w-full flex-col ${sectionGap}`}>
        <SectionBadge badge={component.badge ?? undefined} />

        {component.header && <SectionHeader header={component.header} />}

        <div className="w-full">{/* Your section content */}</div>
      </div>
    </SectionWrapper>
  )
}
```

---

**Step 3**: Update Middleware Population

In `apps/ui/src/middleware.ts` (or page route):

```ts
const populateSections = {
  "sections.my-section": {
    populate: {
      badge: {
        populate: "*",
      },
      background: {
        populate: "*",
      },
      header: {
        populate: {
          textStyle: {
            populate: "*",
          },
          descriptionTextStyle: {
            populate: "*",
          },
        },
      },
      // ...other nested components
    },
  },
  // ...other sections
}
```

---

**Step 4**: Run Config Sync EXPORT

After modifying Strapi schema:

```powershell
yarn workspace @repo/strapi strapi config:sync:export
```

This exports Content Manager metadata for new fields.

---

**Step 5**: Test Spacing Combinations

Test all 9 combinations for Section Header (if using shared header):

| Heading Size | Compact | Default | Spacious |
| ------------ | ------- | ------- | -------- |
| Small        | ✓       | ✓       | ✓        |
| Medium       | ✓       | ✓       | ✓        |
| Large        | ✓       | ✓       | ✓        |

Test section-level spacing (background.padding):

| Section Gap | Badge→Header | Header→Content |
| ----------- | ------------ | -------------- |
| Compact     | 32px         | 32px           |
| Default     | 48px         | 48px           |
| Spacious    | 64px         | 64px           |

---

## Testing Checklist

### Section-Level Spacing Tests

- [ ] **Compact (gap-8)**: Badge→Header = 32px, Header→Content = 32px
- [ ] **Default (gap-12)**: Badge→Header = 48px, Header→Content = 48px
- [ ] **Spacious (gap-16)**: Badge→Header = 64px, Header→Content = 64px
- [ ] **Badge hidden**: No extra gap created, Header→Content spacing intact
- [ ] **Header hidden**: Badge→Content spacing matches section gap

### Header Internal Spacing Tests

When using `SectionHeader` component:

- [ ] **Compact (space-y-2)**: Heading→Description = 8px
- [ ] **Default (space-y-4)**: Heading→Description = 16px
- [ ] **Spacious (space-y-6)**: Heading→Description = 24px
- [ ] **With Divider ON**: Heading→Divider→Description all equal gaps
- [ ] **With Divider OFF**: Heading→Description gap unchanged

### Heading Size Tests

Test visual consistency across heading sizes:

- [ ] Small (`text-2xl sm:text-3xl`)
- [ ] Medium (`text-3xl sm:text-4xl`) - **Golden baseline**
- [ ] Large (`text-4xl sm:text-5xl md:text-6xl`)
- [ ] XL (`text-5xl sm:text-6xl md:text-7xl`)

**Known Issue**: Larger headings have more line-height, causing slight visual spacing differences. This is a CSS typography characteristic and requires a comprehensive review to solve.

---

## Known Issues & Future Work

### Current Limitations

1. **Spacing Variation Across Heading Sizes**

   - **Issue**: Larger headings (Large/XL) appear to have slightly more space above/below due to increased line-height
   - **Impact**: Visual spacing not pixel-perfect across all heading size options
   - **Current Workaround**: Use Medium size as baseline for most consistent results
   - **Future Solution**: Requires custom line-height normalization or typography reset

2. **Divider in Section Header (Commented Out)**

   - **Status**: Divider feature implemented but commented out in `SectionHeader.tsx`
   - **Reason**: Waiting for spacing architecture review before finalizing
   - **Location**: Two places in SectionHeader.tsx (two-tone and regular rendering paths)
   - **Future**: Uncomment after comprehensive spacing solution validated

3. **No Compensation for Typography Line-Height**
   - **Issue**: Different heading sizes have different line-heights built into typography
   - **Current**: No compensation applied (pure `space-y` values)
   - **Rejected Approaches**:
     - Dynamic spacing based on heading size (violates fluid principle)
     - Negative margins on headings (breaks at certain combinations)
     - Flexbox gap instead of space-y (doesn't solve line-height issue)
   - **Future**: Requires architectural redesign or custom CSS properties

### Recommended Review Topics

1. **Typography System Audit**

   - Review all heading line-heights across size options
   - Consider normalized line-height values (e.g., `leading-[1.1]`)
   - Evaluate custom CSS properties for heading bounds

2. **Spacing Token System**

   - Consider CSS custom properties for spacing values
   - Evaluate design tokens for section-level vs internal spacing
   - Review Tailwind spacing scale sufficiency

3. **Component Architecture**

   - Evaluate if divider should use absolute positioning universally
   - Consider CSS pseudo-elements for decorative dividers
   - Review wrapper div necessity in SectionHeader

4. **Testing Infrastructure**
   - Visual regression testing for spacing combinations
   - Automated spacing measurement tests
   - Cross-browser line-height consistency tests

### Action Items for Comprehensive Solution

- [ ] Conduct typography audit across all heading sizes
- [ ] Prototype custom line-height normalization approach
- [ ] Test CSS custom properties for dynamic spacing
- [ ] Evaluate design token system for spacing values
- [ ] Create visual regression test suite for spacing
- [ ] Document final spacing architecture after review
- [ ] Update all components to use finalized pattern

---

## Quick Reference

### Section-Level Spacing (Badge → Header → Content)

```tsx
const sectionGap = (
  {
    none: "gap-4", // 16px
    compact: "gap-8", // 32px
    default: "gap-12", // 48px ← RECOMMENDED
    spacious: "gap-16", // 64px
  } as const
)[backgroundConfig.padding]
```

### Header Internal Spacing (Heading → Description)

```tsx
function getSpacingClass(spacing?: "compact" | "default" | "spacious"): string {
  switch (spacing) {
    case "compact":
      return "space-y-2" // 8px
    case "spacious":
      return "space-y-6" // 24px
    case "default":
    default:
      return "space-y-4" // 16px ← RECOMMENDED
  }
}
```

### Heading Sizes

```tsx
function getHeadingSizeClass(
  size?: "small" | "medium" | "large" | "xl"
): string {
  switch (size) {
    case "small":
      return "text-2xl sm:text-3xl"
    case "medium":
      return "text-3xl sm:text-4xl" // ← MOST CONSISTENT
    case "xl":
      return "text-5xl sm:text-6xl md:text-7xl"
    case "large":
    default:
      return "text-4xl sm:text-5xl md:text-6xl"
  }
}
```

### Divider Patterns

**Absolute Positioning** (Newsletter custom heading):

```tsx
<div className="relative">
  <h2>Heading</h2>
  {showDivider && (
    <div className="absolute -bottom-3 left-0 h-1 w-24 bg-gradient-to-r..." />
  )}
</div>
```

**Space-y Flow** (Section Header - currently commented out):

```tsx
<div className="space-y-4">
  <h2>Heading</h2>
  {/* {showDivider && <div className="h-1 w-24 bg-gradient-to-r..." />} */}
  <p>Description</p>
</div>
```

---

## Support & Maintenance

**Document Owner**: Development Team  
**Last Updated**: November 14, 2025  
**Review Cycle**: After comprehensive spacing architecture finalized  
**Related Docs**:

- `COMPONENT_ARCHITECTURE.md` - Shared component patterns
- `STYLING_GUIDE.md` - General styling conventions
- `THEME_SYSTEM_GUIDE.md` - Theme and color system
- `TROUBLESHOOTING_PLAYBOOK.md` - Common issues and solutions

**For Questions**: Review this doc first, then check related architecture docs. If spacing issues persist, flag for comprehensive architecture review.

---

## Appendix: File Locations

### Component Files

- **SectionHeader**: `apps/ui/src/components/page-builder/shared/SectionHeader.tsx`
- **SectionBadge**: `apps/ui/src/components/page-builder/shared/SectionBadge.tsx`
- **SectionWrapper**: `apps/ui/src/components/page-builder/shared/SectionWrapper.tsx`
- **Newsletter Section**: `apps/ui/src/components/page-builder/components/sections/StrapiNewsletterCTASection.tsx`

### Schema Files

- **Section Header**: `apps/strapi/src/components/shared/section-header.json`
- **Section Badge**: `apps/strapi/src/components/shared/section-badge.json`
- **Section Background**: `apps/strapi/src/components/shared/section-background.json`
- **Newsletter CTA**: `apps/strapi/src/components/sections/newsletter-cta-section.json`

### Config Sync

- **Metadata Export Location**: `apps/strapi/config/sync/core-store.plugin_content_manager_configuration_*`
- **Sync Commands**:
  - Export: `yarn workspace @repo/strapi strapi config:sync:export`
  - Import: `yarn workspace @repo/strapi strapi config:sync:import`

---

**END OF DOCUMENT**
