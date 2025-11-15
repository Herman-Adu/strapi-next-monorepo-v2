# Tailwind CSS v4 Styling Guide

**Project:** Strapi Next Monorepo v2  
**Tailwind Version:** v4 (using `@tailwindcss/postcss`)  
**Date Created:** November 15, 2025  
**Ethos:** Prepare well, or be prepared to fail

---

## Table of Contents

1. [Installation & Configuration](#installation--configuration)
2. [Typography Plugin](#typography-plugin)
3. [What Works & What Doesn't](#what-works--what-doesnt)
4. [Use Cases & Examples](#use-cases--examples)
5. [Custom Theme Integration](#custom-theme-integration)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Installation & Configuration

### Current Setup

**PostCSS Configuration** (`apps/ui/postcss.config.js`):

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

**Global CSS** (`apps/ui/src/styles/globals.css`):

```css
@import "tailwindcss";
@import "@repo/design-system/theme.css";
@import "@repo/design-system/custom-styles.css";
@import "tw-animate-css";

@plugin "tailwindcss-animate";
@plugin "@tailwindcss/typography";
```

### Key Differences from Tailwind v3

| Feature             | Tailwind v3                     | Tailwind v4                          |
| ------------------- | ------------------------------- | ------------------------------------ |
| Config File         | `tailwind.config.js` (required) | Optional, CSS-based config preferred |
| Plugin Installation | `require()` in config           | `@plugin` directive in CSS           |
| CSS Import          | `@tailwind` directives          | `@import "tailwindcss"`              |
| PostCSS             | `tailwindcss` plugin            | `@tailwindcss/postcss` plugin        |

---

## Typography Plugin

### Installation

**For Tailwind v4** (Current Project):

```bash
# No npm install needed - plugin is included with Tailwind v4
# Just add to globals.css:
@plugin "@tailwindcss/typography";
```

**For Tailwind v3** (Reference):

```bash
npm install -D @tailwindcss/typography
# Then add to tailwind.config.js plugins array
```

### Basic Usage

The Typography plugin provides `prose` classes for beautiful default styling of HTML you don't control (like markdown, CMS content, etc.).

```tsx
<article className="prose">{/* Your markdown/HTML content */}</article>
```

### Size Modifiers

```tsx
<article className="prose prose-sm">...</article>   {/* 14px base */}
<article className="prose">...</article>            {/* 16px base (default) */}
<article className="prose prose-lg">...</article>   {/* 18px base */}
<article className="prose prose-xl">...</article>   {/* 20px base */}
<article className="prose prose-2xl">...</article>  {/* 24px base */}
```

### Dark Mode Support

```tsx
<article className="prose dark:prose-invert">
  {/* Automatically adapts to dark mode */}
</article>
```

### Element Modifiers (Tailwind v4)

Customize individual elements directly in your HTML:

```tsx
<article className="prose prose-h1:text-5xl prose-h2:text-4xl prose-a:text-primary">
  {/* Headings and links customized */}
</article>
```

**Available Element Modifiers:**

| Modifier                     | Target             |
| ---------------------------- | ------------------ |
| `prose-headings:{utility}`   | h1, h2, h3, h4, th |
| `prose-h1:{utility}`         | h1                 |
| `prose-h2:{utility}`         | h2                 |
| `prose-h3:{utility}`         | h3                 |
| `prose-h4:{utility}`         | h4                 |
| `prose-p:{utility}`          | p                  |
| `prose-a:{utility}`          | a                  |
| `prose-blockquote:{utility}` | blockquote         |
| `prose-code:{utility}`       | code               |
| `prose-pre:{utility}`        | pre                |
| `prose-ul:{utility}`         | ul                 |
| `prose-ol:{utility}`         | ol                 |
| `prose-li:{utility}`         | li                 |
| `prose-table:{utility}`      | table              |
| `prose-thead:{utility}`      | thead              |
| `prose-tr:{utility}`         | tr                 |
| `prose-th:{utility}`         | th                 |
| `prose-td:{utility}`         | td                 |
| `prose-img:{utility}`        | img                |
| `prose-hr:{utility}`         | hr                 |

### Removing Max Width

By default, `prose` classes add a `max-width` for readability. Override with:

```tsx
<article className="prose max-w-none">{/* Full width prose content */}</article>
```

### Not Prose (Sandboxing)

Exclude sections from prose styling:

```tsx
<article className="prose">
  <h1>My Article</h1>
  <p>Introduction...</p>

  <div className="not-prose">
    {/* This content won't inherit prose styles */}
    <MyCustomComponent />
  </div>

  <p>Continuation...</p>
</article>
```

---

## What Works & What Doesn't

### ✅ WORKS - Tailwind v4

#### 1. Typography Plugin with `prose` Class

```tsx
<article className="prose prose-lg dark:prose-invert max-w-none">
  {markdownContent}
</article>
```

**Use Case:** Static markdown content, blog posts, documentation pages  
**Result:** Beautiful default typography with proper spacing, font sizes, colors

#### 2. Element Modifiers on `prose`

```tsx
<article className="prose prose-h1:text-5xl prose-a:text-primary">
  {content}
</article>
```

**Use Case:** Customizing specific elements within prose content  
**Result:** Override default prose styles for individual elements

#### 3. Standard Tailwind Utilities

```tsx
<h1 className="text-5xl font-bold tracking-tight">Heading</h1>
```

**Use Case:** All non-markdown content, custom components  
**Result:** Full control over styling

#### 4. Component Overrides with `markdown-to-jsx`

```tsx
<Markdown
  options={{
    overrides: {
      h1: {
        component: ({ children }) => (
          <h1 className="text-5xl font-bold">{children}</h1>
        ),
      },
    },
  }}
>
  {content}
</Markdown>
```

**Use Case:** When you need precise control over markdown rendering  
**Result:** Complete customization of rendered HTML elements

---

### ❌ DOESN'T WORK - Tailwind v4

#### 1. Prose Modifiers WITHOUT `prose` Base Class

```tsx
❌ <div className="prose-h1:text-5xl prose-p:mb-4">
     {content}
   </div>
```

**Why:** Element modifiers only work when `prose` class is present  
**Alternative:** Use component overrides or standard utilities

#### 2. Prose Modifiers on Non-Markdown Content

```tsx
❌ <div className="prose">
     <MyCustomComponent />
   </div>
```

**Why:** Prose is designed for vanilla HTML, not React components  
**Alternative:** Use standard Tailwind classes directly on components

#### 3. `@tailwind` Directives (v3 syntax)

```css
❌ @tailwind base;
   @tailwind components;
   @tailwind utilities;
```

**Why:** Tailwind v4 uses `@import "tailwindcss"` instead  
**Correct:**

```css
✅ @import "tailwindcss";
```

#### 4. Plugin Installation via npm BEFORE CSS Declaration

```bash
❌ npm install -D @tailwindcss/typography
   # Then add @plugin in CSS
```

**Why:** In Tailwind v4, plugins are bundled - just use `@plugin` directive  
**Correct:**

```css
✅ @plugin "@tailwindcss/typography";
```

---

## Use Cases & Examples

### Use Case 1: Documentation Pages (MDX/Markdown)

**Scenario:** Rendering markdown documentation with proper typography

**Solution:**

```tsx
// Component: MarkdownRenderer.tsx
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <Markdown>{content}</Markdown>
    </article>
  )
}
```

**Result:** Beautiful typography with minimal code, dark mode support

**When to use:**

- Blog posts
- Documentation pages
- CMS-rendered content
- Static markdown files

---

### Use Case 2: Custom Styled MDX (Component Overrides)

**Scenario:** Need precise control over markdown rendering with theme colors

**Solution:**

```tsx
// Component: MarkdownRenderer.tsx with component overrides
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="max-w-none">
      <Markdown
        options={{
          overrides: {
            h1: {
              component: ({ children, ...props }) => (
                <h1
                  className="mt-8 mb-6 text-5xl font-bold tracking-tight"
                  {...props}
                >
                  {children}
                </h1>
              ),
            },
            h2: {
              component: ({ children, ...props }) => (
                <h2
                  className="mt-8 mb-4 border-b pb-2 text-4xl font-semibold tracking-tight"
                  {...props}
                >
                  {children}
                </h2>
              ),
            },
            // ... more overrides
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  )
}
```

**Result:** Complete control over styling, integrates with theme variables

**When to use:**

- Need theme color integration (e.g., `text-primary`)
- Custom spacing requirements
- Special styling for specific elements
- When prose defaults don't match design system

---

### Use Case 3: Regular React Components (NO Markdown)

**Scenario:** Custom components that aren't markdown-rendered

**Solution:**

```tsx
// Component: HeroSection.tsx
export function HeroSection() {
  return (
    <section>
      <h1 className="mb-4 text-5xl font-bold tracking-tight">Welcome</h1>
      <p className="text-muted-foreground text-lg leading-7">
        Description text
      </p>
    </section>
  )
}
```

**Result:** Direct styling with standard Tailwind utilities

**When to use:**

- All non-markdown components
- Custom UI elements
- Layout components
- Interactive components

**DO NOT use:** `prose` classes on React components

---

### Use Case 4: Hybrid Content (Markdown + Custom Components)

**Scenario:** Markdown content with custom React components embedded

**Solution:**

```tsx
<article className="prose prose-lg dark:prose-invert max-w-none">
  <h1>My Article</h1>
  <p>Some markdown content...</p>

  <div className="not-prose my-8">
    <CustomCallout variant="warning">
      This is a custom component with its own styling
    </CustomCallout>
  </div>

  <p>More markdown content...</p>
</article>
```

**Result:** Markdown styling preserved, custom components styled independently

**When to use:**

- MDX files with custom components
- Documentation with interactive examples
- Content with embedded UI elements

---

## Custom Theme Integration

### Using Theme Colors with Typography

**Option 1: Element Modifiers (Simple)**

```tsx
<article className="prose prose-a:text-primary prose-code:bg-muted">
  {content}
</article>
```

**Option 2: Custom Color Theme (Advanced)**

Add to `globals.css`:

```css
@utility prose-custom {
  --tw-prose-body: var(--color-foreground);
  --tw-prose-headings: var(--color-foreground);
  --tw-prose-links: var(--color-primary);
  --tw-prose-code: var(--color-foreground);
  --tw-prose-pre-bg: var(--color-muted);
  /* ... more customizations */
}
```

Usage:

```tsx
<article className="prose prose-custom">{content}</article>
```

### Available CSS Variables

From our theme system (`globals.css`):

```css
--color-background
--color-foreground
--color-primary
--color-primary-foreground
--color-secondary
--color-muted
--color-muted-foreground
--color-accent
--color-border
--color-ring
```

---

## Best Practices

### 1. Choose the Right Approach

| Content Type                   | Recommended Approach  | Example                                     |
| ------------------------------ | --------------------- | ------------------------------------------- |
| Static Markdown                | `prose` class         | `<article className="prose">`               |
| Dynamic Markdown with Theme    | Component overrides   | `<Markdown options={{ overrides: {...} }}>` |
| Custom Components              | Standard Tailwind     | `<h1 className="text-5xl">`                 |
| Hybrid (Markdown + Components) | `prose` + `not-prose` | See Use Case 4                              |

### 2. Always Include Base Classes

```tsx
✅ <article className="prose prose-lg">
❌ <article className="prose-lg">           {/* Won't work */}

✅ <article className="prose dark:prose-invert">
❌ <article className="dark:prose-invert">  {/* Won't work */}
```

### 3. Override Max Width When Needed

```tsx
// Default prose has max-width for readability
<article className="prose">              {/* max-width: 65ch */}

// Full width
<article className="prose max-w-none">   {/* Full width */}
```

### 4. Use Dark Mode Variant

```tsx
// Always include dark mode support for documentation
<article className="prose dark:prose-invert">{content}</article>
```

### 5. Sandbox Custom Components

```tsx
<article className="prose">
  {/* Markdown content */}

  <div className="not-prose">{/* Custom styled component */}</div>

  {/* More markdown content */}
</article>
```

---

## Troubleshooting

### Problem: Prose Styles Not Applying

**Symptom:** Content renders but without prose typography

```tsx
<article className="prose-lg dark:prose-invert">{content}</article>
```

**Solution:** Always include base `prose` class

```tsx
<article className="prose prose-lg dark:prose-invert">{content}</article>
```

---

### Problem: Theme Colors Not Working in Prose

**Symptom:** `prose-a:text-primary` doesn't apply primary color

**Solution 1:** Use element modifiers correctly

```tsx
<article className="prose prose-a:text-primary">{content}</article>
```

**Solution 2:** Use component overrides for full control

```tsx
<Markdown
  options={{
    overrides: {
      a: {
        component: ({ children, ...props }) => (
          <a className="text-primary hover:underline" {...props}>
            {children}
          </a>
        ),
      },
    },
  }}
>
  {content}
</Markdown>
```

---

### Problem: Custom Components Breaking Inside Prose

**Symptom:** Custom React components inherit unwanted prose styles

**Solution:** Use `not-prose` to sandbox

```tsx
<article className="prose">
  <div className="not-prose">
    <MyComponent />
  </div>
</article>
```

---

### Problem: Plugin Not Found Error

**Symptom:** Error when using `@plugin "@tailwindcss/typography"`

**Diagnostic:**

1. Check `postcss.config.js` has `@tailwindcss/postcss`
2. Check `globals.css` has `@import "tailwindcss"`
3. Verify plugin directive is AFTER imports

**Solution:**

```css
/* Correct order */
@import "tailwindcss";
@import "./other-styles.css";

@plugin "tailwindcss-animate";
@plugin "@tailwindcss/typography";
```

---

## Quick Reference

### Typography Plugin Cheat Sheet

```tsx
// Basic usage
<article className="prose">

// Size variants
<article className="prose prose-sm">    // 14px
<article className="prose prose-lg">    // 18px
<article className="prose prose-xl">    // 20px
<article className="prose prose-2xl">   // 24px

// Dark mode
<article className="prose dark:prose-invert">

// Full width
<article className="prose max-w-none">

// Element modifiers
<article className="prose
  prose-h1:text-5xl
  prose-h2:text-4xl
  prose-a:text-primary
  prose-code:bg-muted">

// Sandbox custom components
<article className="prose">
  <div className="not-prose">
    <CustomComponent />
  </div>
</article>
```

---

## Lessons Learned

### What We Tried That Didn't Work

1. **Prose modifier classes without `prose` base**

   - Tried: `prose-h1:text-5xl` alone
   - Result: ❌ No styling applied
   - Lesson: Element modifiers require `prose` class

2. **Global CSS prose variable overrides**

   - Tried: Setting `--tw-prose-body` in `:root`
   - Result: ❌ Didn't affect prose content
   - Lesson: Use `@utility` directive or element modifiers

3. **Installing Typography plugin via npm first**
   - Tried: `npm install @tailwindcss/typography` then `@plugin`
   - Result: ⚠️ Unnecessary (plugin is bundled in v4)
   - Lesson: Just use `@plugin` directive in v4

---

## Future Enhancements

- [ ] Create custom prose theme matching design system
- [ ] Add syntax highlighting for code blocks
- [ ] Implement copy-to-clipboard for code snippets
- [ ] Create prose presets for different content types

---

**Document Status:** ✅ Complete  
**Last Updated:** November 15, 2025  
**Maintained By:** Development Team  
**Ethos:** Prepare well, or be prepared to fail
