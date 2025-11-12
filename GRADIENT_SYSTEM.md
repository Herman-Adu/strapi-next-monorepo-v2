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

### Test Colors (Development)

```typescript
// Visible test gradient - Orange to Blue
from-[#FF8C00] to-[#1E90FF]
```

### Theme Colors (Production)

```typescript
// Theme-aware - Pale green gradient
from-primary to-primary/60

// Light mode: #16a34a → #16a34a with 60% opacity
// Dark mode: #22c55e → #22c55e with 60% opacity
```

## Color Intensity Analysis

### Why Bold Colors Work Better

1. **High Contrast**: Orange (#FF8C00) to Blue (#1E90FF) = dramatic shift
2. **Saturation**: Bold, saturated colors show gradients clearly
3. **Visibility**: Strong against dark/light backgrounds

### Why Pastel Colors Are Subtle

1. **Low Contrast**: Green (#16a34a) to 60% green = minimal shift
2. **Similar Hues**: Same color family reduces gradient visibility
3. **Opacity**: 60% transparency makes it even more subtle

## Recommendations

### For Maximum Visibility

```typescript
case "horizontal":
  // Multi-stop gradient with varying opacity
  return "bg-gradient-to-r from-primary/90 via-primary to-primary/70 bg-clip-text text-transparent"
```

### For Dramatic Effect (like MetricsSection description)

```typescript
// Multiple color stops with glow
"bg-gradient-to-r from-muted-foreground/80 via-primary/70 to-muted-foreground/80 bg-clip-text text-transparent filter drop-shadow-[0_2px_12px_hsl(var(--primary)/0.4)]"
```

### For Subtle Branding

```typescript
// Current theme implementation
"bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent"
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

### Current Test Implementation

```typescript
from-[#FF8C00] to-[#1E90FF]  // Orange to Blue
```

### Theme Color Conversion

```typescript
// Option 1: Simple gradient (current MetricsSection pattern)
from-primary to-primary/60

// Option 2: Multi-stop for more drama
from-primary/80 via-primary to-primary/60

// Option 3: Center spotlight (like description)
from-primary/60 via-primary to-primary/60

// Option 4: With contrasting color
from-primary via-secondary to-primary
```

## Next Steps

1. **Test in Strapi**: Try all 4 gradient directions with current orange-blue test
2. **Evaluate Visibility**: See which directions work best for different text lengths
3. **Switch to Theme**: Once satisfied, convert to theme colors
4. **Fine-tune Opacity**: Adjust from/to opacity values for desired subtlety
5. **Add Glow**: Consider adding drop-shadow for enhanced visibility

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
