# Gradient Text Pattern Documentation

## Overview

This document describes the standardized pattern for applying gradient text effects in the application. The pattern uses CSS classes for gradient effects, making them theme-aware, consistent, and easy to maintain.

## Architecture

### Files Involved

1. **CSS Definitions**: `apps/ui/src/styles/globals.css`
   - Contains `.gradient-heading` and `.gradient-subheading` classes
   - Uses CSS variables for theme compatibility
2. **Utility Functions**: `apps/ui/src/lib/gradient-utils.ts`
   - `getGradientClass()` - Returns appropriate CSS class based on style and type
   - `getDefaultTextClass()` - Returns default text color for non-gradient styles
3. **Component Usage**: Any component with gradient text (e.g., `SectionHeader.tsx`)
   - Imports utility functions
   - Applies classes conditionally based on Strapi field values

## CSS Classes

### `.gradient-heading`

**Purpose**: Subtle gradient for main headings  
**Effect**: Diagonal gradient from primary color to 60% opacity  
**Use Case**: H1, H2 main titles

```css
.gradient-heading {
  background: linear-gradient(
    to bottom right,
    hsl(var(--primary)) 0%,
    hsl(var(--primary) / 0.6) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### `.gradient-subheading`

**Purpose**: Dramatic gradient for subheadings/descriptions  
**Effect**: Multi-stop horizontal gradient with glow effect  
**Use Case**: Descriptions, taglines, featured text

```css
.gradient-subheading {
  background: linear-gradient(
    to right,
    hsl(var(--muted-foreground) / 0.8) 0%,
    hsl(var(--muted-foreground) / 0.6) 25%,
    hsl(var(--primary) / 0.7) 50%,
    hsl(var(--muted-foreground) / 0.6) 75%,
    hsl(var(--muted-foreground) / 0.8) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 12px hsl(var(--primary) / 0.4));
}

.dark .gradient-subheading {
  background: linear-gradient(
    to right,
    hsl(var(--foreground) / 0.9) 0%,
    hsl(var(--primary)) 50%,
    hsl(var(--foreground) / 0.9) 100%
  );
  filter: drop-shadow(0 0 20px hsl(var(--primary) / 0.3));
}
```

## Utility Functions

### `getGradientClass(style, type)`

Returns the appropriate CSS class for gradient effects.

**Parameters**:

- `style`: `"default" | "gradient" | "two-tone"` - From Strapi component
- `type`: `"heading" | "subheading"` - Element type

**Returns**: CSS class name string

**Examples**:

```typescript
// Main heading with gradient
getGradientClass("gradient", "heading") // Returns: "gradient-heading"

// Description with gradient
getGradientClass("gradient", "subheading") // Returns: "gradient-subheading"

// No gradient
getGradientClass("default", "heading") // Returns: ""
```

### `getDefaultTextClass(style, isDark)`

Returns default text color class for non-gradient styles.

**Parameters**:

- `style`: `"default" | "gradient" | "two-tone"`
- `isDark`: `boolean` - Dark mode state

**Returns**: CSS class name string

## Implementation Pattern

### Step 1: Define Strapi Field

In your Strapi component JSON (e.g., `section-header.json`):

```json
{
  "headingStyle": {
    "type": "enumeration",
    "enum": ["default", "gradient", "two-tone"],
    "default": "default"
  }
}
```

### Step 2: Import Utilities

In your component file:

```typescript
import { getGradientClass } from "@/lib/gradient-utils"
import { cn } from "@/lib/styles"
```

### Step 3: Apply Classes

Use `cn()` utility to combine classes:

```tsx
// For gradient headings
<h1 className={cn(
  "text-5xl font-bold tracking-tight",
  getGradientClass(component.headingStyle, "heading")
)}>
  {component.heading}
</h1>

// For gradient descriptions
<p className={cn(
  "text-xl font-semibold",
  getGradientClass(component.descriptionStyle, "subheading")
)}>
  {component.description}
</p>
```

### Step 4: Handle Non-Gradient Styles

Provide fallback colors for default style:

```tsx
function getHeadingStyleClass(style?: "default" | "gradient" | "two-tone") {
  if (style === "gradient") {
    return getGradientClass("gradient", "heading")
  }

  if (style === "two-tone") {
    return "" // Handle with custom JSX
  }

  return "text-primary dark:text-foreground" // Flat color
}
```

## Complete Component Example

```typescript
"use client"

import { Data } from "@repo/strapi"
import { cn } from "@/lib/styles"
import { getGradientClass } from "@/lib/gradient-utils"

export function MySection({ component }) {
  // Get gradient class for heading
  const headingClass = getGradientClass(
    component.headingStyle,
    "heading"
  )

  // Get gradient class for description
  const descriptionClass = getGradientClass(
    component.descriptionStyle,
    "subheading"
  )

  return (
    <section>
      <h2 className={cn(
        "text-4xl font-bold tracking-tight",
        headingClass || "text-primary dark:text-foreground"
      )}>
        {component.heading}
      </h2>

      {component.description && (
        <p className={cn(
          "text-xl font-semibold mt-4",
          descriptionClass || "text-muted-foreground"
        )}>
          {component.description}
        </p>
      )}
    </section>
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

### Adding New Gradient Types

1. Add CSS class to `globals.css`:

```css
.gradient-cta {
  background: linear-gradient(...);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

2. Update `GradientType` in `gradient-utils.ts`:

```typescript
export type GradientType = "heading" | "subheading" | "cta"
```

3. Add case to `getGradientClass()`:

```typescript
case "cta":
  return "gradient-cta"
```

### Adding New Styles

1. Add to Strapi enum:

```json
"enum": ["default", "gradient", "two-tone", "animated"]
```

2. Handle in component:

```typescript
case "animated":
  return "gradient-heading animate-pulse"
```

## Real-World Examples

### SectionHeader Component

Uses pattern for main headings with three styles (default, gradient, two-tone).

### MetricsSection Component

Uses `.gradient-subheading` for dramatic description text with glow effect.

### Newsletter CTA

Can use both `.gradient-heading` for title and `.gradient-subheading` for tagline.

## Testing Checklist

- [ ] Gradient renders correctly in light mode
- [ ] Gradient renders correctly in dark mode
- [ ] Theme switching updates gradient colors
- [ ] Non-gradient fallback works
- [ ] Two-tone styling works with accent colors
- [ ] Responsive text sizes maintain gradient effect
- [ ] Browser compatibility (Chrome, Firefox, Safari)

## Troubleshooting

**Gradient not visible**:

- Ensure CSS class is in globals.css
- Check that text has sufficient size
- Verify no conflicting text-color classes

**Gradient doesn't change with theme**:

- Confirm using CSS variables: `hsl(var(--primary))`
- Check dark mode variant exists in CSS

**Text appears solid instead of gradient**:

- Verify `background-clip: text` is applied
- Check `-webkit-text-fill-color: transparent` is set
- Ensure no parent element has `color` override
