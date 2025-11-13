# Gradient Text System Documentation

## Overview

Flexible gradient text system allowing content managers to choose gradient direction based on text length and visual preference.

## Strapi Configuration

### Section Header Component

Located: `apps/strapi/src/components/shared/section-header.json`

**Gradient Fields:**

1. **headingStyle**: `"default" | "gradient" | "two-tone"`

   - `default`: Solid theme color
   - `gradient`: Animated gradient effect
   - `two-tone`: Two-color split (accent + main)

2. **gradientDirection**: `"diagonal" | "horizontal" | "vertical" | "radial"`
   - Only applies when `headingStyle === "gradient"`
   - Default: `"diagonal"`

## Gradient Direction Guide

### 1. Diagonal (`bg-gradient-to-br`)

**Best For:** Short headings, single-line text  
**Effect:** Subtle diagonal fade from top-left to bottom-right  
**Use Case:** "Subscribe" or "Get Started"  
**Visual:** Gentle, professional look

### 2. Horizontal (`bg-gradient-to-r`)

**Best For:** Long headings, multi-word text  
**Effect:** Left-to-right flowing gradient  
**Use Case:** "Join thousands of teams building amazing products"  
**Visual:** Dynamic, flowing effect across the text

### 3. Vertical (`bg-gradient-to-b`)

**Best For:** Stacked layouts, vertical emphasis  
**Effect:** Top-to-bottom gradient fade  
**Use Case:** Tall text blocks or vertical compositions  
**Visual:** Natural reading flow enhancement

### 4. Radial (`radial-gradient`)

**Best For:** Centered, spotlight text  
**Effect:** Center outward fade creating spotlight  
**Use Case:** Hero sections, featured announcements  
**Visual:** Dramatic, attention-grabbing center focus

## Current Implementation

### Production Implementation (CURRENT)

```typescript
// Theme-aware gradient using Tailwind v4 mapped variables
from-[var(--color-primary)]
via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)]
to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]

// Light mode: #16a34a (green) → 70% → 20% (very light)
// Dark mode: #22c55e (brighter green) → 70% → 20% (very light)
```

**Key Features:**

- ✅ Uses `var(--color-primary)` (Tailwind v4 mapped variable)
- ✅ `color-mix()` for precise opacity control
- ✅ Fully theme-aware (auto-adapts to dark mode)
- ✅ 80% opacity difference creates visible gradient

### Test Colors (Development - DEPRECATED)

```typescript
// Visible test gradient - Orange to Blue (NO LONGER USED)
from-[#FF8C00] to-[#1E90FF]
```

**Note:** These test colors were used during development to verify gradient functionality. Production uses theme variables exclusively.

## Color Intensity Analysis

### Why `color-mix()` Approach Works Better

**Previous Attempt (Failed):**

```typescript
from-primary to-primary/60  // Text became transparent
```

**Current Solution (Works):**

```typescript
from-[var(--color-primary)]                                      // 100%
via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)]   // 70%
to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]    // 20%
```

**Why It Works:**

1. **Tailwind v4 Variable Mapping**: Uses `--color-primary` (not `--primary`)
2. **Explicit Opacity Control**: `color-mix()` gives precise percentages
3. **Large Opacity Range**: 100% → 20% creates visible gradient (80% difference)
4. **No Transparency Issues**: Arbitrary values handle opacity correctly

### Why Bold Colors Work Better

1. **High Contrast**: Orange (#FF8C00) to Blue (#1E90FF) = dramatic shift
2. **Saturation**: Bold, saturated colors show gradients clearly
3. **Visibility**: Strong against dark/light backgrounds

### Why Pastel/Monochrome Gradients Are Subtle

1. **Low Contrast**: Green 100% to green 60% = minimal shift
2. **Same Hue**: Same color family reduces visibility
3. **Solution**: Use 100% → 20% instead (current implementation)

## Recommendations

### For Maximum Visibility (CURRENT PRODUCTION)

```typescript
// All directions use this pattern with var(--color-primary)
case "horizontal":
  return "bg-gradient-to-r from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)] to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-clip-text text-transparent"

case "vertical":
  return "bg-gradient-to-b from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)] to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-clip-text text-transparent"

case "diagonal":
  return "bg-gradient-to-br from-[var(--color-primary)] via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)] to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-clip-text text-transparent"

case "radial":
  return "bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,color-mix(in_srgb,var(--color-primary)_70%,transparent)_50%,color-mix(in_srgb,var(--color-primary)_20%,transparent)_100%)] bg-clip-text text-transparent"
```

### For Dramatic Effect (Reference - MetricsSection)

```typescript
// Multi-stop with contrasting colors (different use case)
"bg-gradient-to-r from-muted-foreground/80 via-primary/70 to-muted-foreground/80 bg-clip-text text-transparent"
```

### For Subtle Branding (DEPRECATED - Didn't Work)

```typescript
// ❌ DON'T USE - Text becomes transparent
"bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent"

// ✅ USE THIS INSTEAD
"bg-gradient-to-br from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)] bg-clip-text text-transparent"
```

## Usage Pattern

### In Strapi Admin

1. Create/edit Newsletter CTA section
2. Configure header component
3. Set `headingStyle` to "gradient"
4. Choose `gradientDirection`:
   - **Diagonal**: For "Subscribe to our newsletter"
   - **Horizontal**: For "Join thousands of developers worldwide"
   - **Radial**: For "Get Started Today"
   - **Vertical**: For stacked, multi-line headings

### In Code

```typescript
// SectionHeader.tsx automatically handles gradient direction
const headingStyleClass = getHeadingStyleClass(
  headingStyle,
  gradientDirection // <- New parameter
)
```

## MetricsSection Description Gradient

The dramatic multi-color gradient used in MetricsSection description:

```typescript
// Light mode
from-muted-foreground/80    // Gray 80%
via-muted-foreground/60     // Gray 60%
via-primary/70              // Green 70% (center highlight)
via-muted-foreground/60     // Gray 60%
to-muted-foreground/80      // Gray 80%

// Dark mode
from-foreground/90          // White 90%
via-primary                 // Green 100% (center highlight)
to-foreground/90            // White 90%

// Effects
bg-gradient-to-r bg-clip-text text-transparent
drop-shadow-[0_2px_12px_hsl(var(--primary)/0.4)]  // Glow effect
```

This creates a "spotlight" effect where the center is highlighted green, fading to gray on both sides.

## Converting to Theme Colors

### Production Implementation (CURRENT)

```typescript
// ✅ WORKING PATTERN - All 4 directions
from-[var(--color-primary)]                                      // Start: 100%
via-[color-mix(in_srgb,var(--color-primary)_70%,transparent)]   // Middle: 70%
to-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]    // End: 20%
```

**Why This Works:**

- Uses Tailwind v4's `--color-primary` mapped variable
- `color-mix()` provides precise opacity control
- 80% opacity range (100% → 20%) creates visible gradient
- Fully theme-aware (adapts to light/dark mode)

### Failed Attempts (DO NOT USE)

```typescript
// ❌ FAILED: Text became transparent
from-primary to-primary/60

// ❌ FAILED: Not theme-aware
from-[#16a34a] to-[#16a34a]

// ❌ FAILED: Wrong variable path
from-[hsl(var(--primary))] to-[hsl(var(--primary)/60)]

// ❌ FAILED: Opacity modifier doesn't work in arbitrary values
from-[var(--color-primary)] to-[var(--color-primary)/60]
```

**See `TAILWIND_V4_GRADIENT_GUIDE.md` for detailed troubleshooting**

### Alternative Patterns (For Future Use)

```typescript
// Option 1: More subtle (smaller opacity range)
from-[var(--color-primary)]
via-[color-mix(in_srgb,var(--color-primary)_80%,transparent)]
to-[color-mix(in_srgb,var(--color-primary)_40%,transparent)]

// Option 2: More dramatic (larger opacity range)
from-[var(--color-primary)]
via-[color-mix(in_srgb,var(--color-primary)_60%,transparent)]
to-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]

// Option 3: With contrasting color (requires multi-color support - future)
from-[var(--color-primary)]
via-[var(--color-secondary)]
to-[var(--color-primary)]
```

## Next Steps

### ✅ Completed

1. ✅ **Tested in Strapi**: All 4 gradient directions working
2. ✅ **Evaluated Visibility**: Horizontal works best for long text, diagonal for short
3. ✅ **Switched to Theme**: Using `var(--color-primary)` with `color-mix()`
4. ✅ **Fine-tuned Opacity**: 100% → 70% → 20% provides optimal visibility
5. ✅ **Integration**: Newsletter CTA using shared SectionHeader component

### ⏸️ Deferred to Atomic Refactor

- Custom gradient color pickers (multi-color gradients)
- Advanced opacity controls (custom percentages)
- Gradient presets library
- Animation/transition options

**See `COMPONENT_ARCHITECTURE_REFACTOR.md` and `TAILWIND_V4_GRADIENT_GUIDE.md` for deferred features**

## Example Configurations

### Newsletter CTA - Short Heading

```json
{
  "heading": "Subscribe to our newsletter",
  "headingStyle": "gradient",
  "gradientDirection": "horizontal"
}
```

### Hero Section - Long Heading

```json
{
  "heading": "Join thousands of teams building amazing products",
  "headingStyle": "gradient",
  "gradientDirection": "horizontal"
}
```

### Feature Callout - Centered

```json
{
  "heading": "Get Started",
  "headingStyle": "gradient",
  "gradientDirection": "radial"
}
```

## Browser Compatibility

All gradient directions use standard CSS properties with fallbacks:

```css
background: gradient;
background-clip: text;
-webkit-background-clip: text;
text-fill-color: transparent;
-webkit-text-fill-color: transparent;
```

Supported in all modern browsers (Chrome, Firefox, Safari, Edge).

`color-mix()` function requires modern browsers:

- Chrome 111+
- Firefox 113+
- Safari 16.2+
- Edge 111+

---

## 🔗 Related Documentation

- **TAILWIND_V4_GRADIENT_GUIDE.md** - Complete troubleshooting and technical deep-dive
- **GRADIENT_TEXT_PATTERN.md** - CSS gradient text implementation patterns
- **COMPONENT_ARCHITECTURE_REFACTOR.md** - Future atomic refactor plans
- **SHARED_COMPONENT_GUIDE.md** - SectionHeader shared component usage
- **STRAPI_BEST_PRACTICES.md** - Workflow and development processes
