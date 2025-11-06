# Component Architecture Guide

## Design Philosophy

### 1. Backend-First Development

- Always design and implement Strapi content types before frontend components
- Ensure data structure supports all required use cases
- Test API endpoints thoroughly before frontend integration

### 2. Type-Safe Integration

- Use generated TypeScript types from Strapi
- Implement proper null checks and optional chaining
- Leverage TypeScript for compile-time error detection

### 3. Performance-Oriented

- Implement lazy loading for images and heavy components
- Use proper caching strategies
- Optimize bundle size with code splitting

---

## Component Patterns

### 1. Strapi Component Pattern

```typescript
import { Data } from "@repo/strapi"

interface Props {
  readonly component: Data.Component<"namespace.component-name">
  readonly className?: string
}

export function StrapiComponentName({ component, className }: Props) {
  // Guard clause for missing data
  if (!component) return null

  // Destructure with defaults
  const {
    title,
    description,
    links = [],
    image
  } = component

  return (
    <div className={cn("base-styles", className)}>
      {title && <h2>{title}</h2>}
      {description && <p>{description}</p>}
      {/* Conditional rendering for optional fields */}
    </div>
  )
}

StrapiComponentName.displayName = "StrapiComponentName"
export default StrapiComponentName
```

### 2. Single Type Pattern (Navbar, Footer)

```typescript
import { AppLocale } from "@/types/general"

interface Props {
  readonly locale: AppLocale
  readonly className?: string
}

export async function StrapiSingleType({ locale, className }: Props) {
  // Fetch data server-side
  const response = await fetchSingleType(locale)
  const data = response?.data

  // Handle missing data gracefully
  if (!data) return null

  return (
    <div className={cn("single-type-base", className)}>
      {/* Component implementation */}
    </div>
  )
}
```

### 3. Image Component Pattern

```typescript
interface ImageProps {
  readonly component: Data.Component<"utilities.basic-image"> | undefined
  readonly className?: string
  readonly hideWhenMissing?: boolean
}

export function StrapiImage({ component, className, hideWhenMissing }: ImageProps) {
  if (!component?.image?.media && hideWhenMissing) return null

  const media = component?.image?.media
  if (!media) return <div>Image placeholder</div>

  return (
    <Image
      src={media.url}
      alt={media.alternativeText || ""}
      width={media.width}
      height={media.height}
      className={cn("default-image-styles", className)}
    />
  )
}
```

---

## API Integration Patterns

### 1. Server-Side Data Fetching

```typescript
// apps/ui/src/lib/strapi-api/content/server.ts

export async function fetchContentType(locale: AppLocale) {
  const response = await strapiApi.get("/api/content-type", {
    searchParams: {
      locale,
      "populate[field1]": "*",
      "populate[field2][populate]": "*",
      "populate[images][populate][media]": "*",
      "populate[links]": "*",
    },
  })

  return response
}
```

### 2. Population Strategy

```typescript
// Standard population patterns

// Simple field population
'populate[field]': '*'

// Nested component population
'populate[field][populate]': '*'

// Deep media population (for images)
'populate[field][populate][image][populate][media]': '*'

// Multiple level nesting
'populate[sections][populate][items][populate][media]': '*'
```

### 3. Error Handling Pattern

```typescript
export async function safeApiFetch<T>(
  fetcher: () => Promise<T>
): Promise<T | null> {
  try {
    return await fetcher()
  } catch (error) {
    console.error("API fetch failed:", error)
    return null
  }
}
```

---

## Styling Architecture

### 1. Container-Based Layout

```typescript
// Professional layout pattern
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between">
    {/* Content with proper spacing */}
  </div>
</div>
```

### 2. Responsive Design Pattern

```typescript
const responsiveClasses = cn(
  // Mobile first
  "flex flex-col gap-4",
  // Tablet
  "md:flex-row md:gap-6",
  // Desktop
  "lg:gap-8 xl:gap-12"
)
```

### 3. Theme-Aware Styling

```typescript
const themeClasses = cn(
  // Light/dark theme support
  "bg-background text-foreground",
  "border-border",
  // State-based styling
  "hover:bg-accent hover:text-accent-foreground",
  // Focus states
  "focus:ring-2 focus:ring-primary focus:outline-none"
)
```

### 4. Animation Patterns

```typescript
// Smooth transitions
const animationClasses = cn(
  "transition-all duration-200 ease-in-out",
  // Hover animations
  "hover:scale-105 hover:shadow-lg",
  // Custom animations with pseudo-elements
  "relative after:absolute after:bottom-0 after:left-0 after:right-0",
  "after:h-0.5 after:bg-primary after:scale-x-0",
  "after:transition-transform after:duration-200",
  "hover:after:scale-x-100"
)
```

---

## Component Organization

### Directory Structure

```
src/components/
├── elementary/           # Basic UI components
│   ├── AppLink.tsx
│   ├── Container.tsx
│   └── ThemeToggle.tsx
├── page-builder/
│   ├── components/       # Strapi components
│   │   ├── elements/     # Small reusable elements
│   │   ├── forms/        # Form components
│   │   ├── sections/     # Page sections
│   │   └── utilities/    # Utility components
│   └── single-types/     # Single type components
│       ├── navbar/
│       └── footer/
├── providers/            # Context providers
├── typography/           # Text components
└── ui/                   # Shadcn/ui components
```

### Import Organization

```typescript
// External libraries
import React from "react"
import { Data } from "@repo/strapi"
import { getTranslations } from "next-intl/server"

// Types
import { AppLocale } from "@/types/general"

import { fetchNavbar } from "@/lib/strapi-api/content/server"
// Internal utilities
import { cn } from "@/lib/styles"
// Components (grouped by type)
import AppLink from "@/components/elementary/AppLink"
import { ThemeToggle } from "@/components/elementary/ThemeToggle"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
```

---

## Testing Patterns

### 1. Component Testing

```typescript
// Component test pattern
describe('StrapiComponent', () => {
  it('renders with valid data', () => {
    const mockComponent = {
      title: 'Test Title',
      description: 'Test Description'
    }

    render(<StrapiComponent component={mockComponent} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('handles missing data gracefully', () => {
    render(<StrapiComponent component={null} />)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
```

### 2. API Testing

```typescript
// API integration test
describe("fetchNavbar", () => {
  it("returns properly structured data", async () => {
    const result = await fetchNavbar("en")

    expect(result).toBeDefined()
    expect(result.data).toHaveProperty("logoImage")
    expect(result.data).toHaveProperty("links")
  })
})
```

---

## Performance Optimization

### 1. Code Splitting

```typescript
// Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Client-side only if needed
})
```

### 2. Image Optimization

```typescript
// Optimized image component
<Image
  src={imageUrl}
  alt={altText}
  width={width}
  height={height}
  className="object-contain"
  priority={isPriority} // For above-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 3. Bundle Optimization

```typescript
// Tree-shakable exports
export { StrapiNavbar } from "./StrapiNavbar"
export { StrapiFooter } from "./StrapiFooter"
export type { NavbarProps, FooterProps } from "./types"
```

---

## Security Considerations

### 1. Data Sanitization

```typescript
// Sanitize user-generated content
import DOMPurify from "isomorphic-dompurify"

const sanitizedContent = DOMPurify.sanitize(userContent)
```

### 2. Safe Link Handling

```typescript
// Secure external link handling
<AppLink
  href={externalUrl}
  openExternalInNewTab={true}
  rel="noopener noreferrer"
>
  External Link
</AppLink>
```

### 3. Environment Variable Handling

```typescript
// Safe environment variable usage
const apiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_STRAPI_URL is required")
}
```

---

_This architecture guide should evolve with the project and be updated as new patterns emerge._
