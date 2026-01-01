# Styles Directory

**Location:** `apps/ui/src/styles/`  
**Purpose:** Global styling configuration for the UI application  
**Ethos:** Prepare well, or be prepared to fail

---

## Files Overview

### `globals.css`

**Main stylesheet** - Tailwind CSS v4 configuration and theme system

**Key Sections:**

- **Imports**: Tailwind core, design system, custom styles
- **Plugins**: Typography, animate
- **Theme Variables**: Light/dark mode, client branding
- **Gradient System**: Heading gradients, backgrounds
- **Custom Utilities**: Scrollbars, containers, marquees

### Styling Documentation

**⚠️ Moved to:** [`docs/05-styling/`](../../../../docs/05-styling/)

**Comprehensive styling guides:**

- **[tailwind-guide.md](../../../../docs/05-styling/tailwind-guide.md)** - Complete Tailwind CSS reference
- **[typography-plugin.md](../../../../docs/05-styling/typography-plugin.md)** - Typography plugin implementation
- **[styling-guide.md](../../../../docs/05-styling/styling-guide.md)** - Responsive patterns & container queries

**Why moved:** Documentation belongs in central docs library for better discoverability

- What works vs. what doesn't in Tailwind v4
- Use cases with examples
- Custom theme integration
- Best practices & troubleshooting
- Lessons learned from failed attempts

**When to read:**

- Before styling markdown/MDX content
- When choosing between prose vs. custom styling
- When encountering styling issues
- When adding new plugins

### `CkEditorDefaultStyles.css`

**CKEditor styles** - Default styling for CKEditor instances

---

## Quick Start

### Styling Markdown Content

**Simple Approach (Recommended):**

```tsx
import "@/styles/globals.css"
;<article className="prose prose-lg dark:prose-invert max-w-none">
  {markdownContent}
</article>
```

**Result:** Beautiful typography with proper heading sizes, spacing, dark mode support

**Read More:** See `TAILWIND_STYLING_GUIDE.md` → Use Case 1

---

### Styling Custom Components

**Approach:**

```tsx
<section>
  <h1 className="text-5xl font-bold tracking-tight">Heading</h1>
  <p className="text-muted-foreground text-lg leading-7">Description</p>
</section>
```

**DO NOT use:** `prose` classes on React components

**Read More:** See `TAILWIND_STYLING_GUIDE.md` → Use Case 3

---

## Theme System

### Light Mode (Default)

- Primary: `#16a34a` (Green)
- Background: `#ffffff` (White)
- Foreground: `#0a0a0a` (Black)

### Dark Mode (`.dark`)

- Primary: `#22c55e` (Emerald)
- Background: `#0a0a0a` (Dark)
- Foreground: `#fafafa` (Light)

### Client Themes

- **Adu Dev**: Orange branding (`.theme-adu-dev`)

**Usage:**

```tsx
<html className="dark theme-adu-dev">
```

---

## Tailwind v4 Key Differences

| Feature | Old (v3)             | New (v4)                 |
| ------- | -------------------- | ------------------------ |
| Config  | `tailwind.config.js` | CSS-based (optional JS)  |
| Import  | `@tailwind base;`    | `@import "tailwindcss";` |
| Plugins | `require()` in JS    | `@plugin` in CSS         |
| PostCSS | `tailwindcss`        | `@tailwindcss/postcss`   |

---

## Common Patterns

### Gradient Headings

```tsx
<h1 className="gradient-heading-diagonal">Beautiful Gradient Text</h1>
```

**Available:**

- `gradient-heading-diagonal`
- `gradient-heading-horizontal`
- `gradient-heading-vertical`
- `gradient-heading-radial`

### No Scrollbar

```tsx
<div className="no-scrollbar">{/* Content with hidden scrollbar */}</div>
```

### Marquee Animation

```tsx
<div className="animate-marquee">{/* Infinitely scrolling content */}</div>
```

---

## Troubleshooting

### Problem: Styles not applying

**Solution:** Check import order in `globals.css` - Tailwind must come first

### Problem: Typography not working

**Solution:** Ensure `prose` base class is present:

```tsx
✅ <article className="prose prose-lg">
❌ <article className="prose-lg">
```

### Problem: Dark mode not working

**Solution:** Add `dark:prose-invert` for typography:

```tsx
<article className="prose dark:prose-invert">
```

---

## Best Practices

1. **Read the guide first** - `TAILWIND_STYLING_GUIDE.md` documents what works and what doesn't
2. **Use prose for markdown** - Don't reinvent the wheel with custom component overrides
3. **Use utilities for components** - Don't use prose on React components
4. **Test dark mode** - Always include `dark:` variants
5. **Document learnings** - Add failed attempts to the guide so we don't repeat them

---

## Adding New Plugins

**For Tailwind v4:**

1. Add `@plugin "package-name";` to `globals.css`
2. Document usage in `TAILWIND_STYLING_GUIDE.md`
3. Add examples and use cases
4. Document what doesn't work

**Example:**

```css
@import "tailwindcss";

@plugin "tailwindcss-animate";
@plugin "@tailwindcss/typography";
@plugin "your-new-plugin";
```

---

## Related Documentation

- **Component Styling:** See component-specific docs in `/src/components/`
- **Design System:** See `/packages/design-system/`
- **Theme Guide:** See `/THEME_SYSTEM_GUIDE.md` (root)
- **Gradient System:** See `/GRADIENT_SYSTEM.md` (root)

---

**Maintained By:** Development Team  
**Last Updated:** November 15, 2025  
**Ethos:** Prepare well, or be prepared to fail
