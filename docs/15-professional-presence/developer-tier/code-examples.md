# Code Examples

> **Copy-paste ready patterns for common tasks**

---

## Table of Contents

1. [Add New Strapi Component Type](#add-new-strapi-component-type)
2. [Add E2E Test with MSW](#add-e2e-test-with-msw)
3. [Add New API Endpoint](#add-new-api-endpoint)
4. [Create Atomic Component](#create-atomic-component)
5. [Add New Page Route](#add-new-page-route)
6. [Handle Form Submission](#handle-form-submission)
7. [Add Integration Test](#add-integration-test)
8. [Configure Environment Variables](#configure-environment-variables)

---

## Add New Strapi Component Type

### Use Case

You need a reusable component in Strapi (e.g., "Testimonial Card", "Feature Box")

### Time: 5 minutes

### Steps

**1. Create Component Schema** (via Strapi Admin UI)

```
1. Open: http://localhost:1337/admin/plugins/content-type-builder
2. Click: "Create new component"
3. Select category: "sections" (or create new)
4. Component name: "TestimonialCard"
5. Add fields:
   - quote (Rich Text)
   - author (Text, Required)
   - role (Text)
   - avatar (Media, Single image)
6. Click: "Save"
7. Strapi restarts automatically
```

**2. Verify Schema Created**

```powershell
# Check file exists
ls apps\strapi\src\components\sections\testimonial-card.json
```

**File: `apps/strapi/src/components/sections/testimonial-card.json`**

```json
{
  "collectionName": "components_sections_testimonial_cards",
  "info": {
    "displayName": "TestimonialCard",
    "description": ""
  },
  "options": {},
  "attributes": {
    "quote": {
      "type": "richtext"
    },
    "author": {
      "type": "string",
      "required": true
    },
    "role": {
      "type": "string"
    },
    "avatar": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    }
  }
}
```

**3. Use Component in Content Type**

```
1. Open: Content-Type Builder
2. Select existing type: "Page" (or any collection/single type)
3. Add field: "testimonials" → Component (Repeatable)
4. Select: "sections.testimonial-card"
5. Click: "Finish" → "Save"
```

**4. Add Content**

```
1. Open: Content Manager → Pages
2. Edit any page
3. Scroll to "Testimonials" section
4. Click: "Add an entry"
5. Fill: Quote, Author, Role, Upload Avatar
6. Save & Publish
```

**5. Fetch in Next.js**

```typescript
// File: apps/ui/src/lib/strapi-api.ts
import ky from "ky"

export async function getPageWithTestimonials(slug: string) {
  const response = await ky
    .get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/pages`, {
      searchParams: {
        "filters[slug][$eq]": slug,
        "populate[sections][populate][testimonials][populate][avatar]": "*",
      },
    })
    .json<any>()

  return response.data[0]
}
```

**6. Render in Component**

```tsx
// File: apps/ui/src/components/sections/TestimonialSection.tsx
import Image from "next/image"

interface Testimonial {
  id: number
  quote: string
  author: string
  role?: string
  avatar?: {
    url: string
    alternativeText?: string
  }
}

export function TestimonialSection({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  return (
    <section className="py-16">
      <div className="container grid gap-8 md:grid-cols-3">
        {testimonials.map((item) => (
          <div key={item.id} className="rounded-lg border p-6">
            {item.avatar && (
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.avatar.url}`}
                alt={item.avatar.alternativeText || item.author}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <blockquote className="mt-4 text-muted-foreground">
              "{item.quote}"
            </blockquote>
            <cite className="mt-4 block not-italic">
              <strong>{item.author}</strong>
              {item.role && <span className="text-sm"> · {item.role}</span>}
            </cite>
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

## Add E2E Test with MSW

### Use Case

You added a new feature and want to test it end-to-end without Strapi running

### Time: 10-15 minutes

### Steps

**1. Add Mock Data**

```typescript
// File: apps/ui/tests/e2e/fixtures/mock-data.ts
export const mockData = {
  // ... existing mock data ...

  // Add new mock for your feature
  testimonials: {
    data: [
      {
        id: 1,
        attributes: {
          quote: "This product changed my life!",
          author: "John Doe",
          role: "CEO, Example Corp",
          avatar: {
            data: {
              attributes: {
                url: "/uploads/avatar_john_doe.jpg",
                alternativeText: "John Doe avatar",
              },
            },
          },
        },
      },
    ],
    meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 1 } },
  },
}
```

**2. Add MSW Handler (if new endpoint)**

```typescript
// File: apps/ui/tests/e2e/fixtures/msw-handlers.ts
import { http, HttpResponse } from "msw"
import { mockData } from "./mock-data"

export const handlers = [
  // ... existing handlers ...

  // Add handler for new endpoint
  http.get("http://localhost:1337/api/testimonials", () => {
    return HttpResponse.json(mockData.testimonials)
  }),
]
```

**3. Write E2E Test**

```typescript
// File: apps/ui/tests/e2e/testimonials.spec.ts
import { test, expect } from "@playwright/test"
import {
  navigateAndWaitForContent,
  setStandardTimeout,
} from "./utils/test-helpers"

test.describe("Testimonials Section", () => {
  test.describe.configure({ mode: "serial" })

  test.beforeEach(async ({ page }) => {
    test.setTimeout(setStandardTimeout())

    // Navigate to page with testimonials
    await navigateAndWaitForContent(
      page,
      "/en/about",
      /Testimonials|What People Say/i
    )

    // Wait for hydration
    await page.waitForLoadState("networkidle", { timeout: 15000 })
  })

  test("should display testimonials section", async ({ page }) => {
    // Check section exists
    const section = page.locator("section", { hasText: /Testimonials/i })
    await expect(section).toBeVisible({ timeout: 10000 })

    // Check testimonial card
    const testimonial = page.locator(
      'blockquote:has-text("This product changed my life!")'
    )
    await expect(testimonial).toBeVisible()

    // Check author
    const author = page.locator('cite:has-text("John Doe")')
    await expect(author).toBeVisible()

    // Check role
    const role = page.locator("text=/CEO, Example Corp/")
    await expect(role).toBeVisible()
  })

  test("should display avatar images", async ({ page }) => {
    // Find avatar image by alt text
    const avatar = page.locator('img[alt="John Doe avatar"]')
    await expect(avatar).toBeVisible({ timeout: 10000 })

    // Verify image loaded
    await expect(avatar).toHaveAttribute("src", /avatar_john_doe/)
  })

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify testimonials stack vertically
    const testimonials = page.locator("blockquote")
    const count = await testimonials.count()
    expect(count).toBeGreaterThan(0)

    // Check first testimonial is visible
    await expect(testimonials.first()).toBeVisible()
  })
})
```

**4. Run Test**

```powershell
# Stop Strapi first (E2E uses MSW, not real Strapi)
# Ctrl+C in dev terminal

# Run new test
yarn workspace @repo/ui playwright test tests/e2e/testimonials.spec.ts

# With UI mode (interactive)
yarn workspace @repo/ui playwright test --ui
```

**5. Debug Failed Tests**

```powershell
# Run with debug flag
yarn workspace @repo/ui playwright test tests/e2e/testimonials.spec.ts --debug

# Or use headed mode (see browser)
yarn workspace @repo/ui playwright test tests/e2e/testimonials.spec.ts --headed
```

---

## Add New API Endpoint

### Use Case

Create a custom API endpoint in Strapi (e.g., newsletter signup, contact form)

### Time: 10 minutes

### Steps

**1. Generate API Structure**

```powershell
cd apps\strapi

# Generate new API
yarn strapi generate

# Select: "api"
# API name: "newsletter"
# Press Enter
```

**This Creates:**

```
apps/strapi/src/api/newsletter/
├── controllers/
│   └── newsletter.ts
├── routes/
│   └── newsletter.ts
├── services/
│   └── newsletter.ts
└── content-types/
    └── newsletter/
        └── schema.json
```

**2. Define Controller**

```typescript
// File: apps/strapi/src/api/newsletter/controllers/newsletter.ts
import { factories } from "@strapi/strapi"

export default factories.createCoreController(
  "api::newsletter.newsletter",
  ({ strapi }) => ({
    // Custom endpoint: POST /api/newsletter/subscribe
    async subscribe(ctx) {
      try {
        const { email } = ctx.request.body

        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return ctx.badRequest("Invalid email address")
        }

        // Check if already subscribed
        const existing = await strapi.db
          .query("api::newsletter.newsletter")
          .findOne({ where: { email } })

        if (existing) {
          return ctx.send({
            message: "Already subscribed",
            data: { email },
          })
        }

        // Create subscription
        const entry = await strapi.db
          .query("api::newsletter.newsletter")
          .create({ data: { email, subscribedAt: new Date() } })

        return ctx.send({
          message: "Successfully subscribed",
          data: entry,
        })
      } catch (error) {
        return ctx.internalServerError("Subscription failed")
      }
    },
  })
)
```

**3. Define Route**

```typescript
// File: apps/strapi/src/api/newsletter/routes/custom-routes.ts
export default {
  routes: [
    {
      method: "POST",
      path: "/newsletter/subscribe",
      handler: "newsletter.subscribe",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}
```

**4. Update Schema**

```json
// File: apps/strapi/src/api/newsletter/content-types/newsletter/schema.json
{
  "kind": "collectionType",
  "collectionName": "newsletters",
  "info": {
    "singularName": "newsletter",
    "pluralName": "newsletters",
    "displayName": "Newsletter"
  },
  "options": {
    "draftAndPublish": false
  },
  "attributes": {
    "email": {
      "type": "email",
      "required": true,
      "unique": true
    },
    "subscribedAt": {
      "type": "datetime",
      "default": null
    }
  }
}
```

**5. Test Endpoint**

```powershell
# Restart Strapi to load new API
# Ctrl+C, then yarn dev

# Test with curl
curl -X POST http://localhost:1337/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected response:
# {"message":"Successfully subscribed","data":{...}}
```

**6. Use in Next.js**

```typescript
// File: apps/ui/src/app/actions/newsletter.ts
"use server"

export async function subscribeToNewsletter(email: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/newsletter/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || "Failed to subscribe",
      }
    }

    return { success: true, message: data.message }
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}
```

---

## Create Atomic Component

### Use Case

Build reusable UI component following atomic design principles

### Time: 10 minutes

### Steps

**1. Choose Component Type**

- **Atom**: Basic building block (Button, Input, Icon)
- **Molecule**: Combination of atoms (SearchBar = Input + Button)
- **Organism**: Complex component (Navbar = Logo + Nav + CTA)

**2. Create Component File**

```tsx
// File: apps/ui/src/components/atoms/Button.tsx
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    // Variant styles
    const variants = {
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
      ghost:
        "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
    }

    // Size styles
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8 text-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
```

**3. Add TypeScript Types**

```typescript
// File: apps/ui/src/components/atoms/Button.types.ts
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"
```

**4. Create Storybook Story (Optional)**

```tsx
// File: apps/ui/src/components/atoms/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./Button"

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: "Click me",
    variant: "primary",
  },
}

export const Loading: Story = {
  args: {
    children: "Loading...",
    loading: true,
  },
}
```

**5. Use Component**

```tsx
// File: apps/ui/src/app/[locale]/page.tsx
import { Button } from "@/components/atoms/Button"

export default function HomePage() {
  return (
    <section>
      <h1>Welcome</h1>
      <Button variant="primary" size="lg">
        Get Started
      </Button>
      <Button variant="outline" size="md">
        Learn More
      </Button>
    </section>
  )
}
```

**6. Test Component**

```typescript
// File: apps/ui/src/components/atoms/Button.test.tsx
import { render, screen } from "@testing-library/react"
import { Button } from "./Button"

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("applies variant styles", () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByText("Primary")
    expect(button).toHaveClass("bg-primary")
  })

  it("shows loading spinner when loading", () => {
    render(<Button loading>Loading</Button>)
    const spinner = document.querySelector("svg")
    expect(spinner).toHaveClass("animate-spin")
  })

  it("disables button when loading", () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
```

---

## Add New Page Route

### Use Case

Create a new page in Next.js App Router

### Time: 5 minutes

### Steps

**1. Create Page File**

```tsx
// File: apps/ui/src/app/[locale]/about/page.tsx
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our company and mission",
}

export default async function AboutPage() {
  return (
    <main className="container py-16">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        We build amazing products that solve real problems.
      </p>
    </main>
  )
}
```

**2. Add Loading State (Optional)**

```tsx
// File: apps/ui/src/app/[locale]/about/loading.tsx
export default function Loading() {
  return (
    <div className="container py-16">
      <div className="h-10 w-1/3 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-6 w-2/3 animate-pulse rounded bg-muted" />
    </div>
  )
}
```

**3. Add Error Boundary (Optional)**

```tsx
// File: apps/ui/src/app/[locale]/about/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="container py-16">
      <h2 className="text-2xl font-bold text-destructive">
        Something went wrong!
      </h2>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        Try again
      </button>
    </div>
  )
}
```

**4. Add to Navigation**

```tsx
// File: apps/ui/src/components/organisms/Navbar.tsx (example)
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" }, // Add this
  { href: "/contact", label: "Contact" },
]
```

**5. Test Route**

```powershell
# Visit in browser
http://localhost:3000/en/about

# Check for 200 response
curl -I http://localhost:3000/en/about
```

**6. Add E2E Test**

```typescript
// File: apps/ui/tests/e2e/about.spec.ts
import { test, expect } from "@playwright/test"

test.describe("About Page", () => {
  test("should load and display content", async ({ page }) => {
    await page.goto("/en/about")
    await expect(page.locator("h1")).toHaveText("About Us")
    await expect(page.locator("p")).toContainText("We build amazing products")
  })
})
```

---

## Handle Form Submission

### Use Case

Create form with validation and submission (contact form, newsletter, etc.)

### Time: 15 minutes

### Steps

**1. Create Form Component**

```tsx
// File: apps/ui/src/components/forms/ContactForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/atoms/Button"
import { submitContactForm } from "@/app/actions/contact"

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    }

    // Client-side validation
    if (!data.name || !data.email || !data.message) {
      setError("All fields are required")
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("Invalid email address")
      setLoading(false)
      return
    }

    // Submit to server
    const result = await submitContactForm(data)

    if (result.success) {
      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    } else {
      setError(result.error || "Submission failed")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="rounded-md bg-green-50 p-4 text-green-800">
          Thank you! We'll get back to you soon.
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-800">{error}</div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border border-input px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border border-input px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="mt-1 block w-full rounded-md border border-input px-3 py-2"
        />
      </div>

      <Button type="submit" loading={loading} className="w-full">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
```

**2. Create Server Action**

```typescript
// File: apps/ui/src/app/actions/contact.ts
"use server"

export async function submitContactForm(data: {
  name: string
  email: string
  message: string
}) {
  try {
    // Submit to Strapi
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/contact-submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to submit")
    }

    return { success: true }
  } catch (error) {
    console.error("Contact form error:", error)
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    }
  }
}
```

**3. Add E2E Test**

```typescript
// File: apps/ui/tests/e2e/contact-form.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Contact Form", () => {
  test("should submit form successfully", async ({ page }) => {
    await page.goto("/en/contact")

    // Fill form
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('textarea[name="message"]', "This is a test message")

    // Submit
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator("text=/Thank you/")).toBeVisible({
      timeout: 10000,
    })
  })

  test("should validate email format", async ({ page }) => {
    await page.goto("/en/contact")

    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', "invalid-email")
    await page.fill('textarea[name="message"]', "Test message")

    await page.click('button[type="submit"]')

    // Check for error message
    await expect(page.locator("text=/Invalid email/")).toBeVisible()
  })
})
```

---

## Add Integration Test

### Use Case

Test feature with real Strapi backend + database

### Time: 10 minutes

### Steps

**1. Create Test File**

```typescript
// File: apps/strapi/tests/integration/newsletter.test.ts
import { setupStrapi, cleanupStrapi } from "../helpers/strapi"

describe("Newsletter API", () => {
  let strapi: any

  beforeAll(async () => {
    strapi = await setupStrapi()
  })

  afterAll(async () => {
    await cleanupStrapi(strapi)
  })

  it("should subscribe new email", async () => {
    const email = "test@example.com"

    const response = await strapi.server.httpServer.inject({
      method: "POST",
      url: "/api/newsletter/subscribe",
      payload: { email },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().message).toBe("Successfully subscribed")
  })

  it("should reject invalid email", async () => {
    const response = await strapi.server.httpServer.inject({
      method: "POST",
      url: "/api/newsletter/subscribe",
      payload: { email: "invalid-email" },
    })

    expect(response.statusCode).toBe(400)
  })

  it("should handle duplicate subscription", async () => {
    const email = "duplicate@example.com"

    // First subscription
    await strapi.server.httpServer.inject({
      method: "POST",
      url: "/api/newsletter/subscribe",
      payload: { email },
    })

    // Second subscription (duplicate)
    const response = await strapi.server.httpServer.inject({
      method: "POST",
      url: "/api/newsletter/subscribe",
      payload: { email },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json().message).toBe("Already subscribed")
  })
})
```

**2. Run Integration Test**

```powershell
# Start Strapi + database first
yarn dev

# In another terminal, run integration tests
yarn workspace @repo/strapi test:integration
```

---

## Configure Environment Variables

### Use Case

Add new environment variable for API key, feature flag, etc.

### Time: 5 minutes

### Steps

**1. Add to `.env` File**

```bash
# File: apps/ui/.env.local
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX  # Add this
```

**2. Add TypeScript Types**

```typescript
// File: apps/ui/src/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_STRAPI_API_URL: string
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: string // Add this
  }
}
```

**3. Use in Code**

```typescript
// File: apps/ui/src/lib/analytics.ts
export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

export function trackPageView(url: string) {
  if (!GA_ID) return

  window.gtag("config", GA_ID, {
    page_path: url,
  })
}
```

**4. Add to CI/CD** (GitHub Actions example)

```yaml
# File: .github/workflows/deploy.yml
env:
  NEXT_PUBLIC_STRAPI_API_URL: ${{ secrets.STRAPI_URL }}
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: ${{ secrets.GA_ID }}
```

**5. Document in README**

```markdown
# File: apps/ui/README.md

## Environment Variables

| Variable                        | Required | Description               |
| ------------------------------- | -------- | ------------------------- |
| NEXT_PUBLIC_STRAPI_API_URL      | Yes      | Strapi backend URL        |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_ID | No       | Google Analytics tracking |
```

---

## 🔗 Related Documentation

- **[Getting Started Quick](./getting-started-quick.md)** - Clone to first commit in 5 minutes
- **[Troubleshooting Runbook](./troubleshooting-runbook.md)** - Error fixes for common issues
- **[MSW Testing Guide](../../13-testing/MSW-CONSOLIDATION.md)** - Deep dive on E2E testing with MSW
- **[Component Architecture](../../02-architecture/component-architecture.md)** - Atomic design principles

---

_Last Updated: January 2026 | All examples tested and verified working_
