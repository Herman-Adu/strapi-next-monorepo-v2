# Badge Usage Guide

## Overview

The Metrics Section now supports an optional badge that appears above the heading. The badge can include either emoji icons (colored) or Lucide icons (theme-consistent).

## Badge Fields

### 1. Badge Text (`badge`)

- **Type:** String (optional)
- **Description:** The text content displayed in the badge
- **Examples:**
  - "Powered by Industry Leaders"
  - "Trusted by 10,000+ Teams"
  - "Featured"
  - "New"

### 2. Badge Icon (`badgeIcon`)

- **Type:** String (optional)
- **Description:** Icon displayed before the badge text
- **Supports two types:**

#### Emoji Icons (Colored)

Use emoji directly for colorful, expressive icons:

- 🚀 (Rocket)
- ⭐ (Star)
- ⚡ (Lightning)
- 🔥 (Fire)
- 🏆 (Trophy)
- ✨ (Sparkles)
- 💎 (Diamond)
- 🎯 (Target)

#### Lucide Icons (Theme-Consistent)

Use Lucide icon names for design system consistency:

- `Rocket`
- `Star`
- `Zap`
- `TrendingUp`
- `Award`
- `CheckCircle`
- `Sparkles`
- `Flame`

### 3. Badge Size (`badgeSize`)

- **Type:** Enumeration (optional)
- **Default:** `medium`
- **Options:**
  - `small` - Compact size for navbar, articles, or subtle placements (text-xs, h-3 icons)
  - `medium` - Default balanced size for most sections (text-sm, h-4 icons)
  - `large` - Prominent size for hero sections or emphasis (text-base, h-5 icons)
- **Description:** Controls the overall size of the badge including text, padding, and icon dimensions

## Usage Examples

### Example 1: Emoji Badge (Medium)

```
Badge: "Powered by Industry Leaders"
Badge Icon: 🚀
Badge Size: medium
```

### Example 2: Lucide Icon Badge (Large)

```
Badge: "Trusted by 10,000+ Teams"
Badge Icon: Star
Badge Size: large
```

### Example 3: Small Badge Without Icon

```
Badge: "Featured"
Badge Icon: (empty)
Badge Size: small
```

### Example 4: No Badge

```
Badge: (empty)
Badge Icon: (empty)
Badge Size: (any)
```

Result: No badge will be displayed

## Styling

- **Shape:** Rounded pill (fully rounded borders)
- **Colors:** Theme-aware (uses primary color)
  - Border: `border-primary/30` (light), `border-primary/40` (dark)
  - Background: `bg-primary/5` (light), `bg-primary/10` (dark)
  - Text: `text-primary`
- **Sizes:**
  - **Small:** `text-xs`, `px-2.5 py-1`, `gap-1.5`, icon: `h-3 w-3` (Lucide) / `text-sm` (emoji)
  - **Medium:** `text-sm`, `px-3 py-1.5`, `gap-2`, icon: `h-4 w-4` (Lucide) / `text-base` (emoji)
  - **Large:** `text-base`, `px-4 py-2`, `gap-2.5`, icon: `h-5 w-5` (Lucide) / `text-lg` (emoji)
- **Positioning:** Centered above heading with 6 spacing units margin (`mb-6`)

## Available Lucide Icons

The following Lucide icon names are currently supported:

- `Rocket` - Launch, speed, growth
- `Star` - Featured, favorite, rating
- `Zap` - Energy, power, fast
- `TrendingUp` - Growth, improvement, success
- `Award` - Achievement, recognition
- `CheckCircle` - Verified, approved, complete
- `Sparkles` - New, special, enhanced
- `Flame` - Hot, trending, popular

## Best Practices

### When to Use Emoji

- Need specific colored icons (🇺🇸, 🎨, 📊)
- Want playful, friendly tone
- Icon isn't available in Lucide set

### When to Use Lucide Icons

- Want consistent design system
- Need theme-aware colors
- Building professional, corporate UI
- Icon is available in supported list

### Badge Text Length

- Keep short (2-5 words)
- Examples: "New Feature", "Trusted Worldwide", "Award Winning"
- Avoid: Long sentences or detailed descriptions

### Badge Size Selection

- **Small:** Use for navbar, article headers, or subtle callouts
- **Medium:** Default for most sections (features, metrics, benefits)
- **Large:** Use for hero sections or when badge needs emphasis

### Icon Selection

- Match icon meaning to badge context
- Rocket (🚀/Rocket): Growth, launch, speed
- Star (⭐/Star): Featured, top-rated
- Fire (🔥/Flame): Popular, trending
- Award (🏆/Award): Achievement, recognition

## Implementation Details

### Frontend Component

- Location: `apps/ui/src/components/page-builder/components/sections/StrapiMetricsSection.tsx`
- Functions:
  - `renderBadgeIcon()` - Handles both emoji and Lucide icons with size parameter
  - `getBadgeClass()` - Maps size enum to appropriate padding, text size, and gap classes
- Detection: Uses length check and emoji regex to differentiate icon types
- Size Mapping:
  ```tsx
  const iconSizeMap = { small: "h-3 w-3", medium: "h-4 w-4", large: "h-5 w-5" }
  const emojiSizeMap = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }
  const badgeSizeMap = {
    small: "gap-1.5 px-2.5 py-1 text-xs",
    medium: "gap-2 px-3 py-1.5 text-sm",
    large: "gap-2.5 px-4 py-2 text-base",
  }
  ```

### Schema Definition

- Location: `apps/strapi/src/components/sections/metrics-section.json`
- Fields: `badge` (string), `badgeIcon` (string), `badgeSize` (enum)
- All fields are optional
- Default size: `medium`

### Type Safety

- Types auto-generated in `apps/strapi/types/generated/components.d.ts`
- Run `yarn strapi ts:generate-types` after schema changes
- TypeScript ensures correct field usage

## Workflow for Adding New Icons

If you need to add more Lucide icons:

1. **Update imports** in `StrapiMetricsSection.tsx`:

   ```tsx
   import { Award, CheckCircle, ..., NewIcon } from "lucide-react"
   ```

2. **Add to iconMap**:

   ```tsx
   const iconMap = {
     Rocket,
     Star,
     ...,
     NewIcon,
   }
   ```

3. **Update this guide** with the new icon name and use case

## Testing Checklist

When adding or testing badges:

- [ ] Badge text appears centered above heading
- [ ] Icon renders correctly (emoji or Lucide)
- [ ] All three sizes work (small, medium, large)
- [ ] Icon size scales appropriately with badge size
- [ ] Colors match theme (green default, orange Adu Dev)
- [ ] Works in both light and dark modes
- [ ] Badge disappears when badge field is empty
- [ ] Spacing is appropriate (mb-6 below badge)
- [ ] Pill shape has proper border radius
- [ ] Text is readable against background
- [ ] Gap between icon and text is consistent with size

## Related Documentation

- [Component Workflow](./COMPONENT_WORKFLOW.md) - Schema modification process
- [Development Guide](./DEVELOPMENT_GUIDE.md) - General development practices
- [Component Architecture](./COMPONENT_ARCHITECTURE.md) - Component structure

---

**Last Updated:** Phase 19 - Badge Implementation
**Author:** Development Team
