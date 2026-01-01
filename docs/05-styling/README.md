# Styling Documentation

Comprehensive guides for Tailwind CSS, typography, theming, and design patterns.

## Contents

### Core Guides

- **[styling-guide.md](/docs/05-styling-styling-guide)** - Responsive patterns & container queries

  - Core styling principles
  - Container query patterns
  - Responsive breakpoints
  - Best practices

- **[tailwind-guide.md](/docs/05-styling-tailwind-guide)** - Complete Tailwind CSS reference

  - Tailwind v4 configuration
  - Component patterns
  - Utility class usage
  - Custom configurations
  - **Last Updated:** Current (moved from apps/ui/src/styles/)

- **[typography-plugin.md](/docs/05-styling-typography-plugin)** - Typography plugin implementation
  - Tailwind Typography plugin setup
  - Custom typography configurations
  - Font family definitions
  - Prose styling patterns
  - **Last Updated:** Current (moved from apps/ui/src/styles/)

### Theming & Colors

- **[theme-colors.md](/docs/05-styling-theme-colors)** - Color system and theming

  - Theme color definitions
  - Dark/light mode patterns
  - CSS variable usage

- **[tailwind-v4-gradients.md](/docs/05-styling-tailwind-v4-gradients)** - Gradient system
  - Tailwind v4 gradient patterns
  - Custom gradient utilities
  - Background effects

### Design System

- **[design-system/](./design-system/)** - Shared design tokens
  - Component patterns
  - Spacing scale
  - Typography scale

## Quick Reference

### Most Used Patterns

**Container Queries** (component-level responsiveness):

```tsx
className = "@container"
className = "@lg:grid-cols-2 @2xl:gap-8"
```

**Standard Breakpoints** (viewport-level):

```tsx
className = "sm:px-6 md:py-12 lg:grid-cols-3"
```

**Typography**:

```tsx
className = "text-3xl font-bold leading-tight"
className = "prose prose-lg dark:prose-invert"
```

**Gradients**:

```tsx
className = "bg-gradient-to-r from-blue-500 to-purple-600"
```

## Usage Guidelines

### When to Use Each Guide

- **styling-guide.md** - Daily reference for responsive patterns
- **tailwind-guide.md** - Deep dive into Tailwind configuration and patterns
- **typography-plugin.md** - When customizing typography or working with prose content
- **theme-colors.md** - When working with color system or theming
- **tailwind-v4-gradients.md** - When implementing gradient effects

### Integration with Code

These guides complement the component code in `apps/ui/src/`:

- Component implementations reference these patterns
- Shared styles defined here
- Configuration documented here, implemented in `apps/ui/tailwind.config.ts`

## See Also

- [Component Architecture](/docs/02-architecture-component-architecture)
- [Component Development Guide](/docs/04-components-development-guide)
- [Shared Component Guide](/docs/04-components-shared-component-guide)
