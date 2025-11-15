# Styling Guide - Responsive Patterns & Container Queries

**Last Updated:** November 13, 2025

## 🎯 Core Principles

### 1. **NO HARD-CODED WIDTHS**

❌ **NEVER DO THIS:**

```tsx
<div className="max-w-6xl">  // Hard-coded width
<div className="w-[360px]">  // Fixed pixel width
```

✅ **ALWAYS DO THIS:**

```tsx
<div className="max-w-7xl">      // Semantic width token
<div className="w-full @lg:w-auto">  // Responsive with container queries
```

### 2. **CONTAINER QUERIES FIRST**

Use `@container` queries for component-level responsiveness:

```tsx
// Container queries (@) respond to PARENT container size
className = "@container px-4 sm:px-6"
className = "gap-8 @2xl:gap-12 @3xl:grid-cols-2 @4xl:gap-16"
className = "p-8 @2xl:p-12 @4xl:p-16"
```

### 3. **STANDARD BREAKPOINTS FOR LAYOUT**

Use standard breakpoints (sm, md, lg, xl) for page-level layout:

```tsx
// Standard breakpoints respond to VIEWPORT size
className = "py-8 md:py-12"
className = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className = "text-3xl md:text-4xl lg:text-5xl"
```

---

## 📐 Container Query Patterns

### Breakpoint Reference

| Token  | Min Width | Usage                        |
| ------ | --------- | ---------------------------- |
| `@sm`  | 384px     | Small containers             |
| `@md`  | 448px     | Medium containers            |
| `@lg`  | 512px     | Large containers             |
| `@xl`  | 576px     | Extra large containers       |
| `@2xl` | 672px     | 2XL containers (MOST COMMON) |
| `@3xl` | 768px     | 3XL containers               |
| `@4xl` | 896px     | 4XL containers               |
| `@5xl` | 1024px    | 5XL containers               |
| `@6xl` | 1152px    | 6XL containers               |
| `@7xl` | 1280px    | 7XL containers               |

### Common Patterns from SectionWrapper

```tsx
// Padding with container queries
"p-8 @2xl:p-12 @4xl:p-16" // default padding
"p-6 @2xl:p-8 @4xl:p-10" // compact padding
"p-12 @2xl:p-16 @4xl:p-24" // spacious padding

// Gaps with container queries
"gap-8 @2xl:gap-12 @4xl:gap-16" // standard gap progression

// Grid columns with container queries
"grid-cols-1 @3xl:grid-cols-2" // 1 col mobile, 2 cols at @3xl
"grid-cols-1 @3xl:grid-cols-[1.2fr_1fr]" // Asymmetric columns
```

---

## 🎨 Section Patterns

### Newsletter Section (Reference Implementation)

```tsx
<SectionWrapper background={backgroundConfig}>
  {/* Outer flex container for vertical centering */}
  <div className="flex w-full flex-col justify-center gap-8 @2xl:gap-12 @4xl:gap-16">
    {/* Badge + Header section */}
    <div className="w-full space-y-6">
      <SectionBadge badge={component.badge} />
      {component.header && <SectionHeader header={component.header} />}
    </div>

    {/* Main content section */}
    <div className="w-full">
      <div className="grid w-full items-start gap-8 @2xl:gap-12 @3xl:grid-cols-[1.2fr_1fr] @4xl:gap-16">
        {/* Form column */}
        <div>{/* Form content */}</div>

        {/* Benefits column */}
        <div>{/* Benefits grid */}</div>
      </div>
    </div>
  </div>
</SectionWrapper>
```

**Key Points:**

- ✅ No `max-w-*` constraints (SectionWrapper handles width)
- ✅ Uses `@2xl`, `@3xl`, `@4xl` for responsive gaps/grids
- ✅ Flexbox with `justify-center` for vertical alignment
- ✅ `w-full` for fluid width (SectionWrapper provides max-width)

### Metrics/Benefits Section Pattern

```tsx
const gridColsClass = {
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-3",
  "4": "md:grid-cols-2 lg:grid-cols-4",
  "6": "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
}[component.gridColumns || "3"]
```

---

## 📱 Standard Breakpoint Patterns

### Typography Responsive Sizing

```tsx
// Heading sizes with standard breakpoints
"text-2xl sm:text-3xl" // small heading
"text-3xl sm:text-4xl" // medium heading
"text-4xl sm:text-5xl md:text-6xl" // large heading (default)
"text-5xl sm:text-6xl md:text-7xl" // xl heading
```

### Layout Patterns

```tsx
// Vertical spacing
"py-8 md:py-12" // compact
"py-16 md:py-24" // default
"py-24 md:py-32" // spacious

// Horizontal padding
"px-4 sm:px-6 lg:px-8" // responsive container padding

// Flex direction
"flex flex-col md:flex-row" // stack on mobile, row on tablet+

// Grid columns
"grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🏗️ Container Width Tokens

Use semantic width tokens from SectionWrapper:

```tsx
// In section-background.json schema
containerWidth: "default" | "narrow" | "wide" | "full"
```

Maps to:

- `"default"` → `max-w-7xl` (1280px)
- `"narrow"` → `max-w-4xl` (896px)
- `"wide"` → `max-w-screen-2xl` (1536px)
- `"full"` → `w-full` (100%)

**✅ Use these instead of hard-coded widths!**

---

## 🚫 Common Mistakes to Avoid

### 1. Hard-Coded Max Widths

❌ **BAD:**

```tsx
<div className="mx-auto max-w-6xl">
  {" "}
  // Hard-coded width
  {/* Content */}
</div>
```

✅ **GOOD:**

```tsx
<div className="w-full">
  {" "}
  // Let SectionWrapper handle max-width
  {/* Content */}
</div>
```

### 2. Mixing Container Queries with Standard Breakpoints Incorrectly

❌ **BAD:**

```tsx
// Mixing @container and md: for same property
<div className="gap-4 md:gap-6 @2xl:gap-8">  // Confusing hierarchy
```

✅ **GOOD:**

```tsx
// Use @container queries consistently for component spacing
<div className="gap-4 @2xl:gap-6 @4xl:gap-8">
// OR use standard breakpoints for page-level layout
<div className="gap-4 md:gap-6 lg:gap-8">
```

### 3. Using Pixel Values Instead of Spacing Tokens

❌ **BAD:**

```tsx
<div className="gap-[20px]">  // Hard-coded pixels
```

✅ **GOOD:**

```tsx
<div className="gap-5">  // Tailwind spacing token (1.25rem / 20px)
```

---

## 📋 Pre-Flight Checklist

Before creating/modifying any section component:

- [ ] ✅ Using `@container` on wrapper div?
- [ ] ✅ Using container queries (`@2xl`, `@3xl`, `@4xl`) for gaps/padding?
- [ ] ✅ Using `w-full` instead of `max-w-*`?
- [ ] ✅ Using semantic width tokens from SectionWrapper?
- [ ] ✅ No hard-coded pixel widths (`w-[360px]`)?
- [ ] ✅ Standard breakpoints (md:, lg:) only for page-level layout?
- [ ] ✅ Responsive typography with `sm:`, `md:` prefixes?
- [ ] ✅ Using Tailwind spacing tokens (gap-4, p-8) not arbitrary values?

---

## 🎯 Real-World Examples

### Example 1: Two-Column Layout

```tsx
<div className="grid w-full items-start gap-8 @2xl:gap-12 @3xl:grid-cols-2 @4xl:gap-16">
  <div>{/* Left column */}</div>
  <div>{/* Right column */}</div>
</div>
```

### Example 2: Responsive Card Grid

```tsx
<div className="grid w-full auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-2 @2xl:gap-8">
  {benefits.map((benefit) => (
    <div key={benefit.id} className="rounded-xl border p-6">
      {/* Card content */}
    </div>
  ))}
</div>
```

### Example 3: Vertical Centering with Flex

```tsx
<div className="flex w-full flex-col justify-center gap-8 @2xl:gap-12 @4xl:gap-16">
  {/* Content will be vertically centered */}
  <div className="w-full space-y-6">{/* Section 1 */}</div>
  <div className="w-full">{/* Section 2 */}</div>
</div>
```

---

## 🔗 Related Documentation

- [SectionWrapper.tsx](apps/ui/src/components/page-builder/shared/SectionWrapper.tsx) - Container query implementation
- [COMPONENT_DEVELOPMENT_GUIDE.md](COMPONENT_DEVELOPMENT_GUIDE.md) - Component creation workflow
- [MARQUEE_COMPONENT_GUIDE.md](MARQUEE_COMPONENT_GUIDE.md) - Advanced responsive patterns
- [Tailwind Container Queries Docs](https://tailwindcss.com/docs/container-queries)

---

## 📝 Summary

**Remember:**

1. 🚫 NO hard-coded widths (`max-w-6xl`, `w-[360px]`)
2. ✅ USE container queries (`@2xl`, `@3xl`, `@4xl`) for component spacing
3. ✅ USE standard breakpoints (`md:`, `lg:`) for page-level layout
4. ✅ USE `w-full` and let SectionWrapper handle max-width
5. ✅ USE semantic width tokens (`containerWidth: "default"`)
6. ✅ ALWAYS test at all breakpoints (375px, 768px, 1024px, 1280px+)

**When in doubt, check existing section components for reference patterns!**
