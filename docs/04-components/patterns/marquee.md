# 🎠 Marquee Component Development Guide

**Complete reference for building production-ready multi-row marquee components**

This guide documents all the challenges, solutions, and best practices discovered while building the professional Marquee Section component with support for multi-row layouts, vertical/horizontal orientations, and responsive breakpoints.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Critical Issues & Solutions](#critical-issues--solutions)
3. [Responsive Multi-Row Layout](#responsive-multi-row-layout)
4. [Fade Mask System](#fade-mask-system)
5. [Card Styling for Dark Theme](#card-styling-for-dark-theme)
6. [Vertical vs Horizontal Considerations](#vertical-vs-horizontal-considerations)
7. [Testing Checklist](#testing-checklist)
8. [Common Pitfalls](#common-pitfalls)
9. [Quick Reference](#quick-reference)

---

## Overview

The marquee component supports:

- ✅ **Multiple content types**: Logos, Testimonials, Reviews
- ✅ **Dual orientation**: Horizontal and Vertical scrolling
- ✅ **Multi-row layouts**: 1-3 rows with responsive visibility
- ✅ **Interactive features**: Pause on hover, alternating directions, variable speeds
- ✅ **Visual polish**: Gradient fade masks, glassmorphism cards, smooth animations
- ✅ **Full responsive**: Mobile (1 row), Tablet (2 rows), Desktop (3 rows) for vertical orientation

---

## Critical Issues & Solutions

### 🔴 Issue 1: Card Bleeding at Edges

**Problem**: Testimonial cards (240px height) peeked out above/below the fade masks during scroll transitions in vertical orientation.

**Root Causes**:

1. Percentage-based fade masks (`h-[20%]`) were too small and inconsistent
2. Fixed pixel masks (300px, 350px, 400px) were still insufficient
3. **KEY INSIGHT**: Insufficient internal padding allowed cards to get too close to edges

**Solution (Multi-Part Fix)**:

```tsx
// 1. Reduced fade mask height from 400px to 200px
// Shorter masks = less dulling of visible cards
<div className="h-[200px] bg-gradient-to-b from-background via-background/50 to-transparent" />

// 2. Added substantial vertical padding for vertical orientation
className={cn(
  "group flex [gap:var(--gap)] overflow-hidden [--duration:40s] [--gap:1rem]",
  {
    "flex-row p-2": !vertical,           // Horizontal: 8px all sides
    "flex-col py-8 px-2": vertical,      // Vertical: 32px top/bottom, 8px sides
  }
)}

// 3. Added overflow control
className={cn("relative overflow-hidden", {
  "overflow-y-hidden": vertical,
})}
```

**Lesson**: Bleeding prevention requires **both** adequate fade masks **and** internal padding to create a buffer zone. The asymmetric bleeding pattern (bottom fixed, top still bleeding) was the diagnostic clue that padding was the real issue.

---

### 🔴 Issue 2: Cards Appearing Dull in Vertical Mode

**Problem**: Vertical marquee cards looked washed out and dull compared to vibrant horizontal cards, even with proper styling applied.

**Root Cause**:

- Original 400px tall fade masks with `from-background to-transparent` gradient
- Covered too much of the visible area with semi-opaque background overlay
- Created a "veil" effect that dulled the card colors

**Solution**:

```tsx
// Shorter, more subtle fade gradients
{
  fade && (
    <>
      {/* Top fade - shorter and more gradual */}
      <div
        className={cn(
          "pointer-events-none absolute z-10 bg-gradient-to-b from-background via-background/50 to-transparent",
          {
            "inset-x-0 top-0 h-[200px]": vertical,
            "inset-y-0 left-0 w-[15%] bg-gradient-to-r": !vertical,
          }
        )}
      />

      {/* Bottom fade - shorter and more gradual */}
      <div
        className={cn(
          "pointer-events-none absolute z-10 bg-gradient-to-t from-background via-background/50 to-transparent",
          {
            "inset-x-0 bottom-0 h-[200px]": vertical,
            "inset-y-0 right-0 w-[15%] bg-gradient-to-l": !vertical,
          }
        )}
      />
    </>
  )
}
```

**Key Changes**:

1. **Reduced height**: 400px → 200px (only fades edges, not center content)
2. **Added via-step**: `via-background/50` creates smoother, more subtle transition
3. **Proportional sizing**: Vertical uses fixed pixels (200px), horizontal uses percentage (15%)

**Lesson**: Fade masks should only affect the transition zone, not the main viewing area. Too tall/wide masks dull the entire component.

---

### 🔴 Issue 3: 3-Row Layout Overflow at Breakpoint Edges

**Problem**: At 1025px viewport (just above 1024px lg breakpoint), 3 columns of vertical marquees extended beyond screen edges.

**Root Cause**:

```tsx
// BEFORE (TOO WIDE)
"w-full max-w-[360px] md:max-w-[320px] lg:max-w-[340px]"
// Result: 3 × 340px + gaps ≈ 1100px > 1024px viewport
```

**Calculation**:

- 3 columns × 340px = 1020px
- - gap-4 (16px) × 2 = 32px
- - Container padding = ~1100px
- **Problem**: Exceeds 1024px breakpoint!

**Solution**:

```tsx
// AFTER (PROPERLY SIZED)
"w-full max-w-[360px] md:max-w-[300px] lg:max-w-[320px]"

// Breakdown:
// Mobile (<768px):  1 × 360px = 360px ✅
// Tablet (768-1023): 2 × 300px + gap = ~650px ✅
// Desktop (1024+):   3 × 320px + gaps = ~1000px ✅
```

**Lesson**: Always calculate total width including gaps when sizing multi-column responsive layouts. Test at breakpoint edges (767px, 768px, 1023px, 1024px), not just the middle ranges.

---

### 🔴 Issue 4: Responsive Row Visibility

**Problem**: All 3 rows showing on mobile/tablet screens, causing clutter and performance issues.

**Solution**:

```tsx
// Progressive row visibility
const hideOnMobile = component.orientation === "vertical" && rowIndex >= 1
const hideOnTablet = component.orientation === "vertical" && rowIndex >= 2

const responsiveClasses = cn({
  "hidden md:block": hideOnMobile && !hideOnTablet, // Row 2: Hidden on mobile only
  "hidden lg:block": hideOnTablet, // Row 3: Hidden on mobile & tablet
})

// Result:
// Mobile:  Row 0 visible (1 column)
// Tablet:  Rows 0-1 visible (2 columns)
// Desktop: Rows 0-2 visible (3 columns)
```

**Lesson**: Vertical multi-row layouts need progressive disclosure. Don't show all columns on small screens.

---

## Responsive Multi-Row Layout

### Breakpoint Strategy

| Breakpoint  | Viewport Width | Vertical Columns | Column Width | Total Width (approx) |
| ----------- | -------------- | ---------------- | ------------ | -------------------- |
| **Mobile**  | < 768px        | 1                | 360px        | 360px                |
| **Tablet**  | 768-1023px     | 2                | 300px each   | 650px (with gaps)    |
| **Desktop** | 1024px+        | 3                | 320px each   | 1000px (with gaps)   |

### Column Width Calculation Formula

```
Total Width = (Columns × ColumnWidth) + (Gaps × (Columns - 1)) + ContainerPadding

Example (Desktop):
= (3 × 320px) + (2 × 48px) + (~50px)
= 960px + 96px + 50px
= ~1106px

// Must be < 1280px (typical container max-width)
```

### Implementation

```tsx
// 1. Container Layout
<div className={cn({
  "space-y-4": component.orientation !== "vertical",                    // Horizontal: vertical stack
  "flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8 lg:gap-12":  // Vertical: horizontal row
    component.orientation === "vertical",
})}>

// 2. Row/Column Sizing
<div className={cn(responsiveClasses, {
  "w-full max-w-[360px] flex-shrink-0 md:max-w-[300px] lg:max-w-[320px]":
    component.orientation === "vertical",
})}>

// 3. Marquee Height (Vertical only)
<Marquee
  className={cn({
    "h-[500px] md:h-[600px]": component.orientation === "vertical",
  })}
>
```

---

## Fade Mask System

### Vertical Orientation

```tsx
{
  /* Top Fade */
}
;<div
  className="
  pointer-events-none 
  absolute z-10 
  inset-x-0 top-0 
  h-[200px]
  bg-gradient-to-b 
  from-background 
  via-background/50 
  to-transparent
"
/>

{
  /* Bottom Fade */
}
;<div
  className="
  pointer-events-none 
  absolute z-10 
  inset-x-0 bottom-0 
  h-[200px]
  bg-gradient-to-t 
  from-background 
  via-background/50 
  to-transparent
"
/>
```

**Why these values?**

- `h-[200px]`: Shorter than card height (240px), only fades edges
- `via-background/50`: Creates smooth 3-stop gradient (100% → 50% → 0%)
- `z-10`: Sits above content but below interactive elements

### Horizontal Orientation

```tsx
{
  /* Left Fade */
}
;<div
  className="
  pointer-events-none 
  absolute z-10 
  inset-y-0 left-0 
  w-[15%]
  bg-gradient-to-r 
  from-background 
  via-background/50 
  to-transparent
"
/>

{
  /* Right Fade */
}
;<div
  className="
  pointer-events-none 
  absolute z-10 
  inset-y-0 right-0 
  w-[15%]
  bg-gradient-to-l 
  from-background 
  via-background/50 
  to-transparent
"
/>
```

**Why percentage for horizontal?**

- Adapts to container width automatically
- `15%` is enough to fade logo edges without dulling center
- Matches typical marquee fade proportions

---

## Card Styling for Dark Theme

### Problem: Dull Cards in Dark Mode

Cards need enhanced styling to stand out against dark backgrounds.

### Solution: Glassmorphism + Gradients

```tsx
<Card
  className="
  group relative
  flex h-full min-h-[240px] w-full
  flex-col overflow-hidden
  
  /* Border */
  border-2 border-border/50
  hover:border-border/70
  
  /* Background - Layered gradients with transparency */
  bg-gradient-to-br
  from-card via-card to-card/50
  dark:from-card/90 dark:via-card/70 dark:to-card/50
  
  /* Glass effect */
  backdrop-blur-sm
  
  /* Shadows */
  shadow-lg
  hover:shadow-xl
  
  /* Interaction */
  transition-all duration-300
  hover:scale-[1.02]
  
  /* Sizing */
  max-w-[360px] md:max-w-[340px] lg:max-w-[380px]
  p-6
"
>
  {/* Hover overlay gradient */}
  <div
    className="
    pointer-events-none absolute inset-0
    bg-gradient-to-br from-primary/5 via-transparent to-transparent
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  "
  />

  {/* Content with z-10 to sit above overlays */}
  <div className="relative z-10">{/* ... card content ... */}</div>
</Card>
```

### Key Styling Principles

1. **Layered Transparency**: Multiple semi-transparent layers create depth

   - Base: `from-card via-card to-card/50`
   - Dark mode: `dark:from-card/90 dark:via-card/70 dark:to-card/50`

2. **Subtle Borders**: Not too bright

   - Default: `border-border/50`
   - Hover: `border-border/70` (NOT `border-primary/50` - too bright!)

3. **Glassmorphism**: `backdrop-blur-sm` for modern glass effect

4. **Progressive Enhancement**:

   - Base shadow: `shadow-lg`
   - Hover shadow: `shadow-xl`
   - Scale: `hover:scale-[1.02]`

5. **Text Contrast**:

   - Author: `text-foreground` (full contrast)
   - Role: `text-foreground/70` (70% opacity)
   - Company: `text-foreground/60` (60% opacity)
   - Quote: `text-foreground/80` (80% opacity for readability)

6. **Star Ratings**: Extra polish
   ```tsx
   className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${
     i < component.rating!
       ? "fill-amber-400 text-amber-400 drop-shadow-sm"  // drop-shadow makes them pop
       : "fill-muted/20 text-muted/20"
   }`}
   ```

---

## Vertical vs Horizontal Considerations

### Padding Strategy

**CRITICAL**: Different orientations need different padding!

```tsx
className={cn(
  "group flex [gap:var(--gap)] overflow-hidden [--duration:40s] [--gap:1rem]",
  {
    "flex-row p-2": !vertical,      // Horizontal: 8px uniform
    "flex-col py-8 px-2": vertical, // Vertical: 32px top/bottom, 8px sides
  }
)}
```

**Why?**

- **Horizontal**: Content scrolls sideways, 8px padding prevents edge clipping
- **Vertical**: Content scrolls up/down, needs MORE vertical padding (32px) to keep tall cards (240px) away from fade zones

### Fade Mask Sizing

| Orientation    | Mask Size   | Reasoning                                                           |
| -------------- | ----------- | ------------------------------------------------------------------- |
| **Vertical**   | `h-[200px]` | Fixed pixels - cards are fixed height (240px), need consistent fade |
| **Horizontal** | `w-[15%]`   | Percentage - adapts to varying container widths, logos vary in size |

### Container Overflow

```tsx
className={cn("relative overflow-hidden", {
  "overflow-y-hidden": vertical,  // Extra vertical overflow control
})}
```

Vertical needs explicit `overflow-y-hidden` because tall content can escape during animations.

---

## Testing Checklist

### ✅ Visual Testing

**Horizontal Marquee**:

- [ ] 1 row: Clean fade at left/right edges
- [ ] 2 rows: Alternating directions work correctly
- [ ] 3 rows: All rows visible, proper spacing
- [ ] Logos scale proportionally
- [ ] No bleeding at edges
- [ ] Cards look vibrant (not dull)

**Vertical Marquee**:

- [ ] Mobile (< 768px): Only 1 column visible
- [ ] Tablet (768-1023px): Exactly 2 columns visible
- [ ] Desktop (1024px+): All 3 columns visible
- [ ] Cards don't bleed at top
- [ ] Cards don't bleed at bottom
- [ ] Cards look vibrant (not dull)
- [ ] Proper spacing between columns at all breakpoints

### ✅ Breakpoint Edge Testing

Test at these specific widths:

- [ ] 375px (mobile)
- [ ] 767px (just before tablet)
- [ ] 768px (tablet starts)
- [ ] 1023px (just before desktop)
- [ ] 1024px (desktop starts)
- [ ] 1025px (just after desktop - CRITICAL!)
- [ ] 1280px (typical container max)

### ✅ Interaction Testing

- [ ] Hover pauses animation (if enabled)
- [ ] Animation resumes on mouse leave
- [ ] Multiple rows don't interfere with each other
- [ ] Card hover effects work (scale, shadow, border)
- [ ] No layout shift on hover
- [ ] Smooth 60fps animation

### ✅ Dark Mode Testing

- [ ] Cards have good contrast
- [ ] Text is readable
- [ ] Borders visible but subtle
- [ ] Fade masks don't create harsh edges
- [ ] Stars and ratings are vibrant
- [ ] Hover states clearly visible

---

## Common Pitfalls

### ❌ Don't: Use Percentage Heights for Vertical Fades

```tsx
// BAD - Inconsistent, too small
className = "h-[20%] bg-gradient-to-b from-background to-transparent"

// GOOD - Fixed, reliable
className =
  "h-[200px] bg-gradient-to-b from-background via-background/50 to-transparent"
```

### ❌ Don't: Use Same Padding for Both Orientations

```tsx
// BAD - Insufficient for vertical
className="p-2"

// GOOD - Orientation-specific
{
  "flex-row p-2": !vertical,
  "flex-col py-8 px-2": vertical,
}
```

### ❌ Don't: Make Fade Masks Too Tall/Wide

```tsx
// BAD - Dulls entire component
className = "h-[400px] bg-gradient-to-b from-background to-transparent"

// GOOD - Only fades edges
className =
  "h-[200px] bg-gradient-to-b from-background via-background/50 to-transparent"
```

### ❌ Don't: Use Bright Hover Borders

```tsx
// BAD - Too bright, distracting
className = "hover:border-primary/50"

// GOOD - Subtle, elegant
className = "hover:border-border/70"
```

### ❌ Don't: Forget Breakpoint Edge Cases

```tsx
// BAD - Only tested at 1280px desktop
"lg:max-w-[340px]"
// Result: Breaks at 1025px (3 × 340px = 1020px + gaps > 1024px)

// GOOD - Tested at 1024px exactly
"lg:max-w-[320px]"
// Result: Works at 1024px (3 × 320px = 960px + gaps < 1024px) ✅
```

### ❌ Don't: Show All Rows on Mobile

```tsx
// BAD - 3 columns on 375px screen
{
  rows.map((row, i) => <Column key={i} />)
}

// GOOD - Progressive disclosure
const hideOnMobile = vertical && rowIndex >= 1
const hideOnTablet = vertical && rowIndex >= 2
```

---

## Quick Reference

### Card Heights

- Testimonial cards: `min-h-[240px]`
- Review cards: `w-64` (fixed width, variable height)
- Logo cards: Variable (auto-sized images)

### Responsive Column Widths (Vertical)

```tsx
"w-full max-w-[360px] md:max-w-[300px] lg:max-w-[320px]"
```

### Padding (Vertical)

```tsx
"py-8 px-2" // 32px top/bottom, 8px sides
```

### Fade Masks (Vertical)

```tsx
"h-[200px] bg-gradient-to-b from-background via-background/50 to-transparent"
```

### Fade Masks (Horizontal)

```tsx
"w-[15%] bg-gradient-to-r from-background via-background/50 to-transparent"
```

### Card Styling

```tsx
"border-2 border-border/50 hover:border-border/70
bg-gradient-to-br from-card via-card to-card/50
dark:from-card/90 dark:via-card/70 dark:to-card/50
backdrop-blur-sm shadow-lg hover:shadow-xl
transition-all duration-300 hover:scale-[1.02]"
```

---

## Applying to New Marquee Components

When creating a new marquee component from v0 or other sources:

### Step 1: Identify Orientation

- Is it horizontal (left/right scroll)?
- Is it vertical (top/bottom scroll)?

### Step 2: Set Padding

```tsx
// Horizontal
className = "flex-row p-2"

// Vertical
className = "flex-col py-8 px-2"
```

### Step 3: Configure Fade Masks

```tsx
// Horizontal
<div className="inset-y-0 left-0 w-[15%] bg-gradient-to-r from-background via-background/50 to-transparent" />
<div className="inset-y-0 right-0 w-[15%] bg-gradient-to-l from-background via-background/50 to-transparent" />

// Vertical
<div className="inset-x-0 top-0 h-[200px] bg-gradient-to-b from-background via-background/50 to-transparent" />
<div className="inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-background via-background/50 to-transparent" />
```

### Step 4: Set Responsive Widths (if multi-row vertical)

```tsx
// Calculate: (Columns × MaxWidth) + Gaps < Breakpoint
"w-full max-w-[360px] md:max-w-[300px] lg:max-w-[320px]"
```

### Step 5: Style Cards for Dark Theme

```tsx
// Apply glassmorphism pattern
"border-2 border-border/50 hover:border-border/70
bg-gradient-to-br from-card via-card to-card/50
dark:from-card/90 dark:via-card/70 dark:to-card/50
backdrop-blur-sm shadow-lg hover:shadow-xl"
```

### Step 6: Test Thoroughly

- All breakpoints (especially edges: 767px, 768px, 1023px, 1024px, 1025px)
- Both light and dark modes
- Hover states
- Animation smoothness
- No bleeding
- No dulling
- No viewport overflow

---

## Debugging Checklist

If you see **bleeding**:

1. ✅ Check fade mask height/width (should be 200px vertical, 15% horizontal)
2. ✅ Check padding (should be `py-8` for vertical)
3. ✅ Check gradient has `via` step (should be `via-background/50`)
4. ✅ Check overflow settings (`overflow-y-hidden` for vertical)

If cards look **dull**:

1. ✅ Reduce fade mask size (from 400px to 200px)
2. ✅ Add `via-background/50` to gradient
3. ✅ Check card has proper gradients (`from-card via-card to-card/50`)
4. ✅ Verify text colors use `foreground` not `muted-foreground`

If layout **overflows viewport**:

1. ✅ Calculate total width: `(columns × maxWidth) + gaps`
2. ✅ Reduce column max-width
3. ✅ Test at exact breakpoint (1024px, not 1280px)
4. ✅ Verify container padding included in calculation

If **wrong number of rows showing**:

1. ✅ Check responsive classes (`hidden md:block`, `hidden lg:block`)
2. ✅ Verify hideOnMobile/hideOnTablet logic
3. ✅ Test at each breakpoint
4. ✅ Ensure orientation check (`vertical && rowIndex >= 1`)

---

## Final Notes

This guide represents **real-world solutions** to actual production issues encountered during marquee component development. Every recommendation here was tested and validated across multiple breakpoints and themes.

**Key Takeaway**: Building a polished multi-row marquee requires attention to:

1. Precise responsive calculations
2. Orientation-specific padding strategies
3. Proper fade mask sizing and gradients
4. Dark theme card styling
5. Thorough breakpoint testing

Use this guide as a reference when creating new marquee components to avoid common pitfalls and achieve production-quality results faster.

---

**Last Updated**: November 8, 2025  
**Component**: `StrapiMarqueeSection`, `Marquee` (ui component)  
**Status**: Production-ready ✅
