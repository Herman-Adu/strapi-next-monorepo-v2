# Gradient Text Pattern Documentation

## Overview

This document describes the standardized pattern for applying gradient text effects in the application. The pattern uses CSS classes for gradient effects, making them theme-aware, consistent, and easy to maintain.

## Architecture

### Files Involved

1. **CSS Definitions**: `apps/ui/src/styles/globals.css`
   - Contains gradient utility classes (`.gradient-text-to-r`, `.gradient-text-to-b`, etc.)
   - Uses CSS variables for theme compatibility
   - Defines 4 gradient direction classes with dark mode variants
2. **Utility Functions**: `apps/ui/src/lib/gradient-utils.ts`
   - `getHeadingStyleClass()` - Returns inline Tailwind classes for gradients
   - Uses `var(--color-primary)` with `color-mix()` for theme-aware gradients
   - Supports 4 directions: horizontal, vertical, diagonal, radial
3. **Strapi Schema**: `apps/strapi/src/components/shared/section-header.json`
   - `headingStyle`: `"default" | "gradient" | "two-tone"`
   - `gradientDirection`: `"horizontal" | "vertical" | "diagonal" | "radial"`
4. **Component Usage**: `apps/ui/src/components/page-builder/shared/SectionHeader.tsx`
   - Imports utility functions
   - Applies classes based on Strapi field values

## CSS Classes

### Gradient Direction Classes (globals.css)

Four pre-defined gradient classes for different orientations:

```css
/* Horizontal gradient (left to right) */
.gradient-text-to-r {
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    color-mix(in srgb, var(--color-primary) 70%, transparent) 50%,
    color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Vertical gradient (top to bottom) */
.gradient-text-to-b {
  background: linear-gradient(
    to bottom,
    var(--color-primary) 0%,
    color-mix(in srgb, var(--color-primary) 70%, transparent) 50%,
    color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Diagonal gradient (top-left to bottom-right) */
.gradient-text-to-br {
  background: linear-gradient(
    to bottom right,
    var(--color-primary) 0%,
    color-mix(in srgb, var(--color-primary) 70%, transparent) 50%,
    color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* Radial gradient (center outward) */
.gradient-text-radial {
  background: radial-gradient(
    ellipse at center,
    var(--color-primary) 0%,
    color-mix(in srgb, var(--color-primary) 70%, transparent) 50%,
    color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
```

### Dark Mode Variants

Dark mode adjusts gradient intensity:

```css
.dark .gradient-text-to-r,
.dark .gradient-text-to-b,
.dark .gradient-text-to-br,
.dark .gradient-text-radial {
  background: linear-gradient(...); /* Adjusted opacity for dark backgrounds */
}
```

### Key Pattern Features

1. **Tailwind v4 Variable Mapping**: Uses `var(--color-primary)` (not `--primary`)
2. **color-mix() Function**: Precise opacity control (100% → 70% → 20%)
3. **Theme-Aware**: Automatically adapts to light/dark mode
4. **80% Opacity Range**: Creates visible gradient (100% to 20%)

## Utility Functions

### `getHeadingStyleClass(style, gradientDirection)`

Returns inline Tailwind classes for gradient effects using `var(--color-primary)` pattern.

**Parameters**:

- `style`: `"default" | "gradient" | "two-tone"` - From Strapi headingStyle field
- `gradientDirection`: `"horizontal" | "vertical" | "diagonal" | "radial"` - From Strapi gradientDirection field

**Returns**: String of Tailwind CSS classes

**Implementation** (`gradient-utils.ts`):

```typescript
export function getHeadingStyleClass(
  style?: "default" | "gradient" | "two-tone",
  gradientDirection?: "horizontal" | "vertical" | "diagonal" | "radial"
): string {
  if (style === "gradient") {
    const baseClasses = "bg-clip-text text-transparent"

    switch (gradientDirection) {
      case "horizontal":
        return `bg-gradient-to-r from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)] to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] ${baseClasses}`

      case "vertical":
        return `bg-gradient-to-b from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)] to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] ${baseClasses}`

      case "diagonal":
        return `bg-gradient-to-br from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)] to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] ${baseClasses}`

      case "radial":
        return `bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,color-mix(in_srgb,var(--color-primary)_70%,transparent)_50%,color-mix(in_srgb,var(--color-primary)_20%,transparent)_100%)] ${baseClasses}`

      default:
        // Fallback to diagonal
        return `bg-gradient-to-br from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)] to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] ${baseClasses}`
    }
  }

  return "" // Default styling handled by component
}
```

**Examples**:

```typescript
// Horizontal gradient
getHeadingStyleClass("gradient", "horizontal")
// Returns: "bg-gradient-to-r from-[var(--color-primary)] via-[...] to-[...] bg-clip-text text-transparent"

// Diagonal gradient (default direction)
getHeadingStyleClass("gradient", "diagonal")
// Returns: "bg-gradient-to-br from-[var(--color-primary)] via-[...] to-[...] bg-clip-text text-transparent"

// No gradient
getHeadingStyleClass("default", "horizontal")
// Returns: ""
```

### Pattern Breakdown

**Key Components:**

1. `var(--color-primary)` - Tailwind v4 mapped color variable (theme-aware)
2. `color-mix(in_srgb, var(--color-primary)_70%, transparent)` - 70% opacity stop
3. `color-mix(in_srgb, var(--color-primary)_20%, transparent)` - 20% opacity stop
4. `bg-clip-text` - Clips background to text shape
5. `text-transparent` - Makes text color transparent (shows gradient)

## Implementation Pattern

### Step 1: Define Strapi Fields

In your Strapi component JSON (e.g., `section-header.json`):

```json
{
  "headingStyle": {
    "type": "enumeration",
    "enum": ["default", "gradient", "two-tone"],
    "default": "default"
  },
  "gradientDirection": {
    "type": "enumeration",
    "enum": ["diagonal", "horizontal", "vertical", "radial"],
    "default": "diagonal"
  }
}
```

### Step 2: Import Utilities

In your component file (`SectionHeader.tsx`):

```typescript
import { getHeadingStyleClass } from "@/lib/gradient-utils"
import { cn } from "@/lib/styles"
```

### Step 3: Apply Classes

Use utility function to get gradient classes:

```tsx
const headingStyleClass = getHeadingStyleClass(
  header.headingStyle,
  header.gradientDirection
)

<h2
  className={cn(
    "text-3xl font-bold tracking-tight sm:text-4xl",
    headingStyleClass || "text-primary dark:text-foreground"
  )}
>
  {renderHeading()}
</h2>
```

### Step 4: Handle Non-Gradient Styles

Provide fallback colors when gradient not used:

```tsx
function getHeadingColorClass(style?: "default" | "gradient" | "two-tone") {
  if (style === "gradient") {
    return "" // Handled by getHeadingStyleClass
  }

  if (style === "two-tone") {
    return "" // Handled with custom JSX
  }

  return "text-primary dark:text-foreground" // Default solid color
}
```

## Complete Component Example

**SectionHeader.tsx** (Current Production Implementation):

```typescript
"use client"

import { Data } from "@repo/strapi"
import { cn } from "@/lib/styles"
import { getHeadingStyleClass } from "@/lib/gradient-utils"

interface SectionHeaderProps {
  header: Data.SectionHeader
  align?: "left" | "center"
}

export function SectionHeader({ header, align = "center" }: SectionHeaderProps) {
  // Get gradient classes based on style and direction
  const headingStyleClass = getHeadingStyleClass(
    header.headingStyle,
    header.gradientDirection
  )

  // Render heading with optional accent (for two-tone)
  function renderHeading() {
    if (header.headingStyle === "two-tone" && header.headingAccent) {
      return (
        <>
          <span className="text-primary">{header.headingAccent}</span>{" "}
          <span className="text-foreground">{header.heading}</span>
        </>
      )
    }

    return header.headingAccent
      ? `${header.headingAccent} ${header.heading}`
      : header.heading
  }

  return (
    <div className={cn("space-y-4", align === "center" && "text-center")}>
      {header.badge && (
        <SectionBadge badge={header.badge} align={align} />
      )}

      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl",
          headingStyleClass || "text-primary dark:text-foreground"
        )}
      >
        {renderHeading()}
      </h2>

      {header.description && (
        <p className="text-lg text-muted-foreground">
          {header.description}
        </p>
      )}
    </div>
  )
}
```

**Usage in Newsletter CTA**:

```typescript
import { SectionHeader } from "@/components/page-builder/shared/SectionHeader"

export function StrapiNewsletterCTASection({ component }) {
  return (
    <SectionWrapper background={component.background}>
      {component.header && (
        <SectionHeader
          header={component.header}
          align="center"
        />
      )}
      {/* Newsletter form */}
    </SectionWrapper>
  )
}
```

## Two-Tone Pattern

For two-tone styling, use custom JSX with spans:

```typescript
function renderHeading(
  heading: string,
  headingAccent?: string,
  style?: "default" | "gradient" | "two-tone"
) {
  if (style === "two-tone" && headingAccent) {
    return (
      <>
        <span className="text-primary">{headingAccent}</span>{" "}
        <span className="text-muted-foreground dark:text-foreground">
          {heading}
        </span>
      </>
    )
  }

  // Combine accent and heading for other styles
  if (headingAccent) {
    return `${headingAccent} ${heading}`
  }

  return heading
}
```

## Benefits

1. **Theme-Aware**: Uses CSS variables, automatically adapts to theme changes
2. **Consistent**: Single source of truth for gradient styles
3. **Maintainable**: Update CSS class, affects all instances
4. **Performance**: CSS classes are faster than inline styles
5. **Type-Safe**: TypeScript utilities prevent errors
6. **Documented**: Clear pattern for future development

## Extending the Pattern

### Adding New Gradient Directions

1. **Add to Strapi enum** (`section-header.json`):

```json
"gradientDirection": {
  "enum": ["diagonal", "horizontal", "vertical", "radial", "custom-angle"]
}
```

2. **Add case to utility function** (`gradient-utils.ts`):

```typescript
case "custom-angle":
  return `bg-gradient-to-[45deg] from-[var(--color-primary)] via-[color-mix(...)] to-[color-mix(...)] ${baseClasses}`
```

3. **Add CSS class** (optional, for reusable patterns):

```css
.gradient-text-45deg {
  background: linear-gradient(
    45deg,
    var(--color-primary) 0%,
    color-mix(in srgb, var(--color-primary) 70%, transparent) 50%,
    color-mix(in srgb, var(--color-primary) 20%, transparent) 100%
  );
  background-clip: text;
  color: transparent;
}
```

### Adding Custom Colors (Future - Atomic Refactor)

**Current:** Fixed to `var(--color-primary)`
**Future:** Support custom color selection

```typescript
// Future implementation with color prop
export function getHeadingStyleClass(
  style?: "default" | "gradient" | "two-tone",
  gradientDirection?: string,
  customColor?: string // <- New parameter
): string {
  const color = customColor || "var(--color-primary)"

  return `bg-gradient-to-r from-[${color}] via-[color-mix(in_srgb,${color}_70%,transparent)] ...`
}
```

**See `COMPONENT_ARCHITECTURE_REFACTOR.md` for multi-color gradient plans**

## Real-World Examples

### SectionHeader Component (Production)

Uses `getHeadingStyleClass()` with all 4 gradient directions.

**Strapi Configuration**:

```json
{
  "heading": "Subscribe to our newsletter",
  "headingStyle": "gradient",
  "gradientDirection": "horizontal"
}
```

**Result**: Horizontal gradient from full green → 70% → 20% (very light)

### Newsletter CTA Section (Current)

Integrates SectionHeader as shared component with gradient support.

### MetricsSection Description (Reference)

Uses different pattern (multi-color spotlight):

```tsx
className =
  "bg-gradient-to-r from-muted-foreground/80 via-primary/70 to-muted-foreground/80 bg-clip-text text-transparent"
```

**Note**: This is a specialized pattern for dramatic effect, not using the standard `var(--color-primary)` pattern.

## Testing Checklist

- [x] Gradient renders correctly in light mode
- [x] Gradient renders correctly in dark mode
- [x] Theme switching updates gradient colors
- [x] Non-gradient fallback works (default style)
- [x] Two-tone styling works with accent colors
- [x] Responsive text sizes maintain gradient effect
- [x] All 4 directions work (horizontal, vertical, diagonal, radial)
- [x] Browser compatibility verified (Chrome, Firefox, Safari, Edge)
- [ ] Custom color selection (deferred to atomic refactor)

---

## 🔗 Related Documentation

- **TAILWIND_V4_GRADIENT_GUIDE.md** - Complete troubleshooting and `var(--color-primary)` deep-dive
- **GRADIENT_SYSTEM.md** - Overall gradient architecture and direction guide
- **COMPONENT_ARCHITECTURE_REFACTOR.md** - Future multi-color gradient plans
- **SHARED_COMPONENT_GUIDE.md** - SectionHeader component usage
- **STRAPI_BEST_PRACTICES.md** - Workflow and development processes

## Troubleshooting

**Gradient not visible**:

- Ensure using `var(--color-primary)` (not `var(--primary)`)
- Check opacity range: 100% → 20% creates 80% difference (visible)
- Verify text has sufficient size
- Confirm `bg-clip-text text-transparent` classes applied

**Gradient doesn't change with theme**:

- Confirm using `var(--color-primary)` (Tailwind v4 mapped variable)
- Check that `--color-primary` is mapped in `@theme inline` block in `globals.css`
- Verify dark mode CSS exists if using CSS classes

**Text appears solid instead of gradient**:

- Verify `background-clip: text` or `bg-clip-text` is applied
- Check `color: transparent` or `text-transparent` is set
- Ensure no parent element has `color` override
- Confirm using `color-mix()` syntax correctly (underscores: `_70%`)

**Text is completely transparent/invisible**:

- Check if using wrong variable: `var(--primary)` instead of `var(--color-primary)`
- Verify not using opacity modifiers in arbitrary values: `var(--color-primary)/60` (doesn't work)
- Use `color-mix()` instead: `color-mix(in_srgb,var(--color-primary)_60%,transparent)`

**Common Mistakes**:

```typescript
// ❌ WRONG - Text becomes invisible
from-primary to-primary/60

// ❌ WRONG - Wrong variable
from-[var(--primary)]

// ❌ WRONG - Opacity modifier doesn't work here
from-[var(--color-primary)/60]

// ✅ CORRECT
from-[var(--color-primary)]
via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)]
to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]
```

**See `TAILWIND_V4_GRADIENT_GUIDE.md` for detailed troubleshooting**
