# Component Architecture Refactoring Plan

## 🎯 Mission Statement

Create a **composable, atomic design system** where small, single-responsibility components can be mixed and matched across ALL sections without duplication or bloat.

---

## � Current Status

### ✅ Completed (Newsletter CTA Milestone)

1. **Shared Components Created**

   - `SectionBadge.tsx` - Reusable badge component
   - `SectionBackground.tsx` - Reusable background wrapper (deprecated, merged into SectionWrapper)
   - `SectionHeader.tsx` - Reusable header with gradient support
   - `SectionWrapper.tsx` - Background theming system

2. **Gradient System Implemented**

   - 4 gradient directions working (horizontal, vertical, diagonal, radial)
   - Theme-aware using `var(--color-primary)` + `color-mix()`
   - Integrated into SectionHeader component
   - `gradient-utils.ts` utility functions

3. **Background Theme System**

   - `theme-pastel` background option added
   - Pastel green (#f0fdf4) in light mode
   - Dark green (#0f1f14) in dark mode
   - Integrated into Newsletter CTA section

4. **Documentation Created**
   - `TAILWIND_V4_GRADIENT_GUIDE.md` - Complete gradient troubleshooting
   - `GRADIENT_SYSTEM.md` - Architecture and direction guide
   - `GRADIENT_TEXT_PATTERN.md` - Implementation patterns
   - `SHARED_COMPONENT_GUIDE.md` - Usage documentation
   - `STRAPI_BEST_PRACTICES.md` - Workflow processes

### ⏸️ Deferred to This Atomic Refactor Phase

1. **Custom Gradient Colors** - Multi-color pickers for start/middle/end
2. **Advanced Opacity Controls** - Custom percentage inputs
3. **Gradient Presets Library** - Named gradient presets
4. **Orb Animation Component** - Extract from OrbitingBorderBadge
5. **Atomic Text Styling** - Separate text-style components

**This document outlines the complete atomic refactor plan for the next phase.**

---

## �📋 Current Problems Identified

### 1. **Monolithic Components**

- `section-header.json` contains EVERYTHING (badge, heading, description, styles)
- Benefits `list-item.json` has title/description but NO style options
- Duplication: Every component needs its own heading styling

### 2. **Missing Separation of Concerns**

```
❌ CURRENT: section-header has badge + heading + description + all styles
✅ GOAL: Separate atoms that compose together
```

### 3. **Gradient System Gaps**

- Hardcoded CSS gradients
- No per-section customization
- No light/dark mode separate controls
- Missing `theme-pastel-bg` option

### 4. **Reusability Issues**

- Badge orb animation is embedded - can't reuse for cards
- Heading styles can't be applied to benefit titles
- Every new component needs rebuilding instead of composing

---

## 🏗️ Proposed Atomic Component Structure

### **Level 1: Atoms** (Smallest reusable pieces)

#### 1.1 `text-style.json` (NEW)

```json
{
  "displayName": "Text Style Options",
  "description": "Styling options for any text element (headings, subheadings, labels)",
  "attributes": {
    "textStyle": {
      "enum": ["default", "gradient", "two-tone"],
      "default": "default",
      "description": "Text appearance: default (solid theme color), gradient (color transition), two-tone (accent + main)"
    },
    "gradientDirection": {
      "enum": ["diagonal", "horizontal", "vertical", "radial"],
      "default": "diagonal"
    },
    "customGradient": {
      "component": "atoms.gradient-colors",
      "description": "Optional custom gradient colors (overrides default theme gradients)"
    }
  }
}
```

#### 1.2 `gradient-colors.json` (NEW)

```json
{
  "displayName": "Custom Gradient Colors",
  "description": "Define custom gradient colors for light and dark modes with start, middle, end stops",
  "attributes": {
    "lightModeStart": {
      "type": "string",
      "regex": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "description": "Hex color for gradient start in light mode (e.g., #16a34a)"
    },
    "lightModeMiddle": {
      "type": "string",
      "regex": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "description": "Hex color for gradient middle stop in light mode"
    },
    "lightModeEnd": {
      "type": "string",
      "regex": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "description": "Hex color for gradient end in light mode (e.g., #e8f5e9)"
    },
    "darkModeStart": {
      "type": "string",
      "regex": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "description": "Hex color for gradient start in dark mode (e.g., #22c55e)"
    },
    "darkModeMiddle": {
      "type": "string",
      "regex": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "description": "Hex color for gradient middle stop in dark mode"
    },
    "darkModeEnd": {
      "type": "string",
      "regex": "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
      "description": "Hex color for gradient end in dark mode (e.g., #0d2818)"
    }
  }
}
```

#### 1.3 `orb-animation.json` (NEW)

```json
{
  "displayName": "Orb Animation",
  "description": "Reusable orbiting light effect for badges, cards, buttons, etc.",
  "attributes": {
    "enabled": {
      "type": "boolean",
      "default": false
    },
    "speed": {
      "enum": ["extra-slow", "slow", "medium", "fast"],
      "default": "slow"
    },
    "size": {
      "enum": ["small", "medium", "large"],
      "default": "medium"
    },
    "color": {
      "type": "string",
      "description": "Hex color for orb glow (defaults to primary)"
    },
    "blur": {
      "type": "number",
      "default": 40,
      "description": "Blur intensity in pixels"
    }
  }
}
```

#### 1.4 `styled-text.json` (NEW - Replaces scattered title fields)

```json
{
  "displayName": "Styled Text",
  "description": "Any text element with full styling options (headings, subheadings, labels)",
  "attributes": {
    "text": {
      "type": "string",
      "required": true
    },
    "accentText": {
      "type": "string",
      "description": "For two-tone style: this text appears first in theme color"
    },
    "size": {
      "enum": [
        "xs",
        "sm",
        "base",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl"
      ],
      "default": "lg"
    },
    "weight": {
      "enum": ["normal", "medium", "semibold", "bold"],
      "default": "semibold"
    },
    "textStyle": {
      "component": "atoms.text-style"
    }
  }
}
```

---

### **Level 2: Molecules** (Combined atoms)

#### 2.1 REFACTORED `section-badge.json`

```json
{
  "displayName": "Badge",
  "description": "Reusable badge with optional orb animation",
  "attributes": {
    "text": { "type": "string" },
    "icon": { "type": "string" },
    "variant": { "enum": ["default", "secondary", "outline", "ghost"] },
    "size": { "enum": ["small", "medium", "large"] },
    "orbAnimation": {
      "component": "atoms.orb-animation" // ← REUSABLE!
    },
    "pulse": { "type": "boolean" }
  }
}
```

#### 2.2 NEW `section-heading.json` (Atomic version)

```json
{
  "displayName": "Section Heading",
  "description": "Heading with full styling - used in headers, cards, benefits, etc.",
  "attributes": {
    "heading": { "type": "string", "required": true },
    "headingAccent": { "type": "string" },
    "size": { "enum": ["small", "medium", "large", "xl"], "default": "large" },
    "textStyle": {
      "component": "atoms.text-style" // ← COMPOSITION!
    },
    "showDivider": { "type": "boolean", "default": false }
  }
}
```

#### 2.3 REFACTORED `list-item.json` (Benefits, Features, etc.)

```json
{
  "displayName": "List Item",
  "description": "Reusable list item with FULL styling options",
  "attributes": {
    "title": {
      "component": "molecules.section-heading" // ← NOW HAS ALL GRADIENT OPTIONS!
    },
    "description": { "type": "text", "required": true },
    "iconType": { "enum": ["check", "circle", "none"] },
    "hoverEffect": {
      "component": "atoms.orb-animation" // ← REUSABLE ORB FOR CARDS!
    }
  }
}
```

---

### **Level 3: Organisms** (Full section components)

#### 3.1 NEW `section-header-full.json` (Container Header)

```json
{
  "displayName": "Section Header (Full)",
  "description": "Complete header for section containers with badge, heading, subheading, description",
  "attributes": {
    "badge": {
      "component": "molecules.section-badge"
    },
    "heading": {
      "component": "molecules.section-heading" // ← HAS textStyle with gradients
    },
    "subheading": {
      "component": "molecules.section-heading", // ← SAME component, different size!
      "description": "Optional subheading with full styling options"
    },
    "description": {
      "type": "text",
      "description": "Plain description text (theme-styled, no custom options)"
    },
    "alignment": {
      "enum": ["left", "center", "right"],
      "default": "center"
    },
    "spacing": {
      "enum": ["compact", "default", "spacious"],
      "default": "default"
    }
  }
}
```

#### 3.2 REFACTORED `section-background.json`

```json
{
  "attributes": {
    "backgroundStyle": {
      "enum": [
        "solid",
        "transparent",
        "muted",
        "bordered",
        "theme-subtle",
        "theme-muted",
        "theme-pastel" // ← NEW OPTION ADDED!
      ]
    }
    // ... rest stays same
  }
}
```

---

## 🔄 Migration Path (Step-by-Step)

### **Phase 1: Create Atomic Components** ✅

1. Create `apps/strapi/src/components/atoms/` folder
2. Add `text-style.json`
3. Add `gradient-colors.json`
4. Add `orb-animation.json`
5. Add `styled-text.json`

### **Phase 2: Refactor Molecules** ✅

1. Update `section-badge.json` to use `orb-animation`
2. Create new `section-heading.json` with `text-style` composition
3. Update `list-item.json` to use `section-heading` + `orb-animation`

### **Phase 3: Build Organisms** ✅

1. Create `section-header-full.json` as replacement for current `section-header`
2. Update `section-background.json` to add `theme-pastel`

### **Phase 4: Update Frontend Components** ✅

1. Create `<TextStyle>` component to handle gradient rendering
2. Create `<OrbAnimation>` component (extract from badge)
3. Create `<StyledHeading>` component (uses TextStyle)
4. Update `<SectionHeader>` to use new atomic structure
5. Update `<SectionBadge>` to use OrbAnimation
6. Update newsletter benefits to use new structure

### **Phase 5: Data Migration** ✅

1. Write migration script to convert old section-header to new structure
2. Update all existing content in Strapi
3. Deprecate old components (mark as legacy)

---

## 📝 Frontend Component Structure

```tsx
// NEW ATOMIC COMPONENTS

// apps/ui/src/components/page-builder/atoms/TextStyle.tsx
export function TextStyle({
  text,
  accentText,
  style = "default",
  gradientDirection = "diagonal",
  customGradient,
  className,
}: TextStyleProps) {
  // Handles default CSS gradients OR custom hex gradients
  // Applies inline styles for custom colors
  // Falls back to CSS classes for theme defaults
}

// apps/ui/src/components/page-builder/atoms/OrbAnimation.tsx
export function OrbAnimation({ config, children }: OrbAnimationProps) {
  // Reusable wrapper that adds orb to ANY element
  // Used in badges, cards, buttons, containers
}

// apps/ui/src/components/page-builder/molecules/StyledHeading.tsx
export function StyledHeading({
  heading,
  component, // From Strapi
}: StyledHeadingProps) {
  return (
    <TextStyle
      text={component.heading}
      accentText={component.headingAccent}
      style={component.textStyle?.textStyle}
      gradientDirection={component.textStyle?.gradientDirection}
      customGradient={component.textStyle?.customGradient}
      className={getSizeClass(component.size)}
    />
  )
}
```

---

## 🎨 CSS Organization

### Current: Hardcoded gradient classes

```css
.gradient-heading-diagonal {
  /* hardcoded */
}
.gradient-heading-horizontal {
  /* hardcoded */
}
```

### New: Default + Custom Support

```css
/* DEFAULT THEME GRADIENTS (fallback) */
.gradient-heading-diagonal {
  /* theme colors */
}

/* CUSTOM GRADIENTS (inline styles when Strapi provides hex colors) */
.custom-gradient-[direction] {
  background: linear-gradient(
    [direction],
    var(--custom-start) 0%,
    var(--custom-middle) 50%,
    var(--custom-end) 100%
  );
}
```

---

## ✅ Benefits of This Architecture

### 1. **DRY Principle**

- Orb animation defined ONCE, used everywhere
- Text styling defined ONCE, used in headings, subheadings, labels, benefits
- No more copying gradient fields to every component

### 2. **Single Responsibility**

- `text-style` = HOW text looks
- `styled-text` = WHAT text says + HOW it looks
- `section-heading` = Heading with divider options
- `section-header-full` = Complete container header

### 3. **Composability**

```
Badge = text + icon + variant + OrbAnimation
ListItem = StyledHeading + description + icon + OrbAnimation (hover)
SectionHeaderFull = Badge + StyledHeading (heading) + StyledHeading (subheading) + description
```

### 4. **Scalability**

- New component needs gradient? → Add `text-style` component
- New component needs orb hover? → Add `orb-animation` component
- Want gradient on button text? → Use `TextStyle` component

### 5. **Maintainability**

- Update orb animation in ONE place → affects badges, cards, buttons globally
- Update gradient logic in ONE place → affects all text elements
- Clear component hierarchy: atoms → molecules → organisms

### 6. **Performance**

- CSS classes for defaults (fast)
- Inline styles only for custom gradients (minimal)
- Shared components = better tree-shaking

---

## 🎨 Section Styling Pattern (CRITICAL)

> **Use this pattern for EVERY new section component**

### Pattern Overview

All sections follow the same container + responsive margin pattern established in Newsletter CTA and Marquee sections.

### The SectionWrapper Pattern

**Import:**

```tsx
import { SectionWrapper } from "@/components/page-builder/shared/SectionWrapper"
```

**Usage:**

```tsx
export function StrapiYourSection({ component }) {
  const backgroundConfig: Data.Component<"shared.section-background"> = {
    backgroundStyle: component.background?.backgroundStyle ?? "solid",
    containerStyle: component.background?.containerStyle ?? "default",
    containerWidth: component.background?.containerWidth ?? "default",
    padding: component.background?.padding ?? "default",
    gradient: component.background?.gradient ?? false,
  }

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Your section content here */}
    </SectionWrapper>
  )
}
```

### Container Classes Structure

SectionWrapper handles all container logic - **DO NOT add your own container/padding classes**.

**Automatic Behavior:**

1. **Outer wrapper:**

   ```tsx
   className = "@container mx-auto px-4 sm:px-6 lg:px-8"
   ```

   - `@container` = Enable container queries
   - `mx-auto` = Center the container
   - `px-4 sm:px-6 lg:px-8` = Responsive padding from screen edges

2. **For bordered containers (inner wrapper):**

   ```tsx
   className = "mx-auto max-w-7xl rounded-2xl border-2..."
   ```

   - `mx-auto` = Center the bordered box
   - `max-w-*` = Width from containerWidth setting
   - Border + shadow + background from containerStyle

3. **For default containers:**
   - Content renders directly in outer wrapper
   - Width applied to outer wrapper

### Width Settings

Users can choose container width in Strapi:

| Setting   | Class              | Size   |
| --------- | ------------------ | ------ |
| `default` | `max-w-7xl`        | 1280px |
| `narrow`  | `max-w-4xl`        | 896px  |
| `wide`    | `max-w-screen-2xl` | 1536px |
| `full`    | `w-full`           | 100%   |

**NEVER hardcode widths** - always respect the width setting!

### Responsive Margin Pattern

The `px-4 sm:px-6 lg:px-8` pattern ensures containers never hit screen edges:

- **Mobile (<640px):** 16px padding (px-4)
- **Tablet (640px+):** 24px padding (sm:px-6)
- **Desktop (1024px+):** 32px padding (lg:px-8)

This pattern is **production-validated** from:

- ✅ Navbar
- ✅ Footer
- ✅ Marquee
- ✅ Newsletter CTA

### DO NOT Do This

❌ **Wrong:**

```tsx
<div className="container mx-auto px-4">
  {" "}
  {/* Don't add your own container */}
  <SectionWrapper>...</SectionWrapper>
</div>
```

❌ **Wrong:**

```tsx
<SectionWrapper>
  <div className="max-w-6xl">
    {" "}
    {/* Don't hardcode widths */}
    ...
  </div>
</SectionWrapper>
```

❌ **Wrong:**

```tsx
<SectionWrapper>
  <div className="px-8">
    {" "}
    {/* Don't override padding */}
    ...
  </div>
</SectionWrapper>
```

### DO This

✅ **Correct:**

```tsx
<SectionWrapper background={backgroundConfig}>
  <div className="w-full">
    {" "}
    {/* Use w-full for fluid width */}
    {/* Your content */}
  </div>
</SectionWrapper>
```

✅ **Correct:**

```tsx
<SectionWrapper background={backgroundConfig}>
  <div className="grid gap-8 @3xl:grid-cols-2">
    {" "}
    {/* Use container queries */}
    {/* Your columns */}
  </div>
</SectionWrapper>
```

### Container Queries (CRITICAL)

Inside SectionWrapper, use **container queries** (@) not viewport breakpoints:

```tsx
// ✅ GOOD: Responds to parent container size
<div className="gap-4 @2xl:gap-6 @3xl:grid-cols-2 @4xl:gap-8">

// ❌ BAD: Responds to viewport, not container
<div className="gap-4 md:gap-6 lg:grid-cols-2 xl:gap-8">
```

**Container Query Breakpoints:**

| Token  | Min Width | When to Use                       |
| ------ | --------- | --------------------------------- |
| `@2xl` | 672px     | Most common responsive step       |
| `@3xl` | 768px     | Grid column splits                |
| `@4xl` | 896px     | Large spacing/padding adjustments |

See `STYLING_GUIDE.md` for complete container query reference.

### Bordered Container Best Practices

When `containerStyle === "bordered"`:

1. ✅ **DO:** Use `@container` queries for internal responsiveness
2. ✅ **DO:** Let SectionWrapper handle all margins/padding
3. ✅ **DO:** Use `min-h-[400px]` to prevent collapsed containers
4. ❌ **DON'T:** Add `mx-auto` (already handled)
5. ❌ **DON'T:** Add `max-w-*` (width setting controls it)
6. ❌ **DON'T:** Add horizontal padding/margins (creates edge collision)

### Complete Example

```tsx
import { SectionWrapper } from "@/components/page-builder/shared/SectionWrapper"
import { SectionBadge } from "@/components/page-builder/shared/SectionBadge"
import { SectionHeader } from "@/components/page-builder/shared/SectionHeader"

export function StrapiExampleSection({ component }) {
  const backgroundConfig: Data.Component<"shared.section-background"> = {
    backgroundStyle: component.background?.backgroundStyle ?? "solid",
    containerStyle: component.background?.containerStyle ?? "default",
    containerWidth: component.background?.containerWidth ?? "default",
    padding: component.background?.padding ?? "default",
    gradient: component.background?.gradient ?? false,
  }

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Uniform spacing: gap-12 for default header spacing */}
      <div className="flex w-full flex-col gap-12">
        {/* Badge - returns null when hidden */}
        <SectionBadge badge={component.badge ?? undefined} />

        {/* Header - controls ONLY internal spacing */}
        {component.header && <SectionHeader header={component.header} />}

        {/* Main content */}
        <div className="w-full">
          {/* Use container queries for responsive layouts */}
          <div className="grid gap-8 @2xl:gap-12 @3xl:grid-cols-2 @4xl:gap-16">
            {/* Left column */}
            <div>Your content</div>

            {/* Right column */}
            <div>Your content</div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
```

### Spacing Architecture

Follow the **uniform spacing pattern**:

```tsx
// Parent container uses SINGLE gap value (not multiple space-y values)
const sectionGap = {
  compact: "gap-8",   // Badge→Header AND Header→Content
  default: "gap-12",  // Badge→Header AND Header→Content
  spacious: "gap-16", // Badge→Header AND Header→Content
}[headerSpacing]

<div className={`flex flex-col ${sectionGap}`}>
  <SectionBadge />      {/* No margin */}
  <SectionHeader />     {/* No margin */}
  <div>Main content</div> {/* No margin */}
</div>
```

**Result:** Badge→Header gap **equals** Header→Content gap (visual uniformity)

See `SPACING_ARCHITECTURE_GUIDE.md` for complete patterns.

### Checklist for New Sections

Before creating a new section component:

- [ ] ✅ Using `<SectionWrapper>` instead of custom container?
- [ ] ✅ backgroundConfig maps all background settings?
- [ ] ✅ No hardcoded `max-w-*` widths?
- [ ] ✅ No custom `mx-auto px-*` on inner content?
- [ ] ✅ Using container queries (`@2xl`, `@3xl`, `@4xl`)?
- [ ] ✅ Using uniform spacing (single gap value)?
- [ ] ✅ Components return null when hidden (not empty divs)?
- [ ] ✅ No hardcoded margins on badge/header?
- [ ] ✅ Testing all width settings (default/narrow/wide/full)?
- [ ] ✅ Testing all container styles (default/bordered)?

### Reference Implementations

Study these sections for the correct pattern:

1. **Newsletter CTA** - Complete atomic refactor, bordered container
2. **Marquee** - Bordered container pattern (original solution)
3. **Metrics** - Simpler bordered example

All three use the EXACT same SectionWrapper pattern.

---

## 🚧 Implementation Checklist

### Immediate (Newsletter CTA Fix)

- [ ] Add `theme-pastel` to `section-background.json`
- [ ] Update `SectionBackground.tsx` to handle `theme-pastel`
- [ ] Create `gradient-colors.json` atom
- [ ] Create `text-style.json` atom
- [ ] Update `section-header.json` to use `text-style`
- [ ] Update `SectionHeader.tsx` to handle custom gradients
- [ ] Test newsletter CTA with custom dark mode gradient

### Short-term (Complete Atomic System)

- [ ] Create `orb-animation.json` atom
- [ ] Extract orb from `SectionBadge` into `<OrbAnimation>` component
- [ ] Create `section-heading.json` molecule
- [ ] Update `list-item.json` to use atomic components
- [ ] Create `section-header-full.json` organism
- [ ] Document component composition patterns

### Mid-term (Full Migration)

- [ ] Audit ALL sections for heading usage
- [ ] Migrate testimonials to use atomic headings
- [ ] Migrate marquee to use atomic structure
- [ ] Migrate metrics to use atomic structure
- [ ] Create migration guide for content editors
- [ ] Update Strapi admin UI with helper text

### Long-term (Advanced Features)

- [ ] Theme color picker (dropdown of CSS variables)
- [ ] Gradient preview in Strapi admin
- [ ] Animation preview in Strapi admin
- [ ] Component usage analytics
- [ ] A/B testing for gradient combinations

---

## 📚 Documentation Requirements

### For Each Atomic Component:

1. **Purpose**: What does it do?
2. **Used By**: Which molecules/organisms use it?
3. **Props**: All available options with examples
4. **Examples**: Visual examples with code
5. **Best Practices**: When to use vs. not use

### Component Composition Guide:

- Decision tree: "I want X effect" → "Use Y component"
- Common patterns (badge + heading, heading + subheading)
- Anti-patterns (don't nest styled-text in styled-text)

---

## 🎯 Success Metrics

1. **Reusability**: Can apply gradient to ANY text in 30 seconds
2. **Consistency**: All headings have same styling options
3. **Performance**: No duplicate CSS, minimal inline styles
4. **DX**: Content editors understand component options
5. **Maintainability**: Change orb animation globally in 5 minutes

---

## 🤔 Open Questions for Review

1. **Naming Convention**: `atoms/molecules/organisms` OR `primitives/components/sections`?
2. **Strapi Folder Structure**: Flat `components/` OR nested `components/atoms/`, `components/molecules/`?
3. **Backward Compatibility**: Support old `section-header` temporarily OR hard migration?
4. **Default Gradients**: Keep CSS classes OR generate from theme variables dynamically?
5. **Color Picker**: Custom hex input OR dropdown of theme colors OR both?

---

## 🚀 Next Steps (After Rest Break)

**Phase 1 Completed** ✅

- Newsletter CTA with shared components
- Gradient system with 4 directions
- Theme-aware `var(--color-primary)` pattern
- Background theming (`theme-pastel`)

**Phase 2: Atomic Refactor** (This Document)

1. Review this plan together
2. Decide on incremental vs. atomic-first approach
3. Begin with custom gradient color picker component
4. Extract orb animation as reusable atom
5. Create styled-text component pattern
6. Migrate existing sections to atomic structure

**Recommended Approach**: Incremental

- ✅ Proven pattern exists (shared components work!)
- ✅ Newsletter serves as reference implementation
- ✅ Can test atomic components in new sections first
- ✅ Gradual migration reduces risk

---

## 🔗 Related Documentation

- **TAILWIND_V4_GRADIENT_GUIDE.md** - Gradient implementation deep-dive
- **GRADIENT_SYSTEM.md** - Direction guide and architecture
- **GRADIENT_TEXT_PATTERN.md** - Code patterns and troubleshooting
- **SHARED_COMPONENT_GUIDE.md** - Current shared component usage
- **STRAPI_BEST_PRACTICES.md** - Development workflow and processes

---

_Document Version: 1.1_  
_Last Updated: 2025-11-13_  
_Status: READY FOR REVIEW AFTER REST_
