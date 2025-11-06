# 📚 Complete Guide: Adding Components to Strapi & Frontend

> **For Junior Developers**: This is your step-by-step guide to adding new sections, elements, forms, and pages to the application. Follow these steps exactly, and you'll successfully extend the CMS.

---

## 🎯 Table of Contents

1. [Understanding the Architecture](#understanding-the-architecture)
2. [Adding a New Section Component](#adding-a-new-section-component)
3. [Adding a New Element Component](#adding-a-new-element-component)
4. [Adding a New Form Component](#adding-a-new-form-component)
5. [Creating a New Page](#creating-a-new-page)
6. [Generating TypeScript Types](#generating-typescript-types)
7. [Frontend Component Mapping](#frontend-component-mapping)
8. [Testing Your Components](#testing-your-components)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Understanding the Architecture

### File Structure

```
apps/
├── strapi/                           # Backend CMS
│   ├── src/
│   │   ├── components/               # Strapi component schemas
│   │   │   ├── elements/            # Reusable UI elements
│   │   │   ├── forms/               # Form components
│   │   │   ├── sections/            # Page sections
│   │   │   └── utilities/           # Utility components
│   │   └── api/                     # Content types & APIs
│   │       └── page/                # Page content type
│   └── types/generated/             # Auto-generated TypeScript types
│
└── ui/                              # Frontend Next.js app
    └── src/
        └── components/
            └── page-builder/
                ├── components/
                │   ├── elements/    # Frontend element components
                │   ├── forms/       # Frontend form components
                │   ├── sections/    # Frontend section components
                │   └── utilities/   # Frontend utility components
                └── index.tsx        # Component mapping registry
```

### Component Types

1. **Elements**: Small, reusable UI pieces (buttons, cards, logos)
2. **Sections**: Large page sections (hero, features, testimonials)
3. **Forms**: Interactive forms (contact, newsletter, signup)
4. **Utilities**: Helper components (rich text, images, SEO)

### The Flow

```
1. Create Strapi schema (.json) → 2. Generate types → 3. Create React component → 4. Register in mapping → 5. Use in Strapi admin
```

---

## 📝 Adding a New Section Component

### Example: Creating a Testimonials Section

#### Step 1: Create the Strapi Schema

**File**: `apps/strapi/src/components/sections/testimonials-section.json`

```json
{
  "collectionName": "components_sections_testimonials_sections",
  "info": {
    "displayName": "Testimonials Section",
    "description": "Customer testimonials and reviews"
  },
  "options": {},
  "attributes": {
    "heading": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "testimonials": {
      "type": "component",
      "repeatable": true,
      "component": "elements.testimonial-card"
    },
    "displayStyle": {
      "type": "enumeration",
      "enum": ["grid", "carousel"],
      "default": "grid"
    }
  }
}
```

**Key Points:**

- ✅ `collectionName`: Must follow pattern `components_<category>_<name>`
- ✅ `displayName`: Shows in Strapi admin UI
- ✅ `description`: Helps editors understand the component
- ✅ `attributes`: Define the fields for this component
- ✅ `component`: Reference to element components (must exist!)

#### Step 2: Create the Element Schema (if needed)

**File**: `apps/strapi/src/components/elements/testimonial-card.json`

```json
{
  "collectionName": "components_elements_testimonial_cards",
  "info": {
    "displayName": "Testimonial Card",
    "description": "Individual testimonial with quote, author, and photo"
  },
  "options": {},
  "attributes": {
    "quote": {
      "type": "text",
      "required": true
    },
    "authorName": {
      "type": "string",
      "required": true
    },
    "authorRole": {
      "type": "string"
    },
    "authorPhoto": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    },
    "rating": {
      "type": "integer",
      "min": 1,
      "max": 5,
      "default": 5
    }
  }
}
```

#### Step 3: Generate TypeScript Types

```powershell
# Navigate to Strapi directory
cd apps\strapi

# Generate types
yarn generate:types

# OR start dev server (generates automatically)
yarn develop
```

This creates types in `apps/strapi/types/generated/contentTypes.d.ts`

#### Step 4: Create the Frontend Element Component

**File**: `apps/ui/src/components/page-builder/components/elements/StrapiTestimonialCard.tsx`

```tsx
import { Data } from "@repo/strapi"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export function StrapiTestimonialCard({
  component,
}: {
  readonly component: Data.Component<"elements.testimonial-card">
}) {
  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-6">
      {/* Rating Stars */}
      <div className="flex gap-1">
        {Array.from({ length: component.rating || 5 }).map((_, i) => (
          <svg
            key={i}
            className="text-yellow-500 h-5 w-5 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-foreground italic leading-relaxed">
        "{component.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {component.authorPhoto && (
          <StrapiBasicImage
            component={component.authorPhoto}
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-semibold">{component.authorName}</div>
          {component.authorRole && (
            <div className="text-muted-foreground text-sm">
              {component.authorRole}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

StrapiTestimonialCard.displayName = "StrapiTestimonialCard"

export default StrapiTestimonialCard
```

**Key Points:**

- ✅ Import `Data` type from `@repo/strapi`
- ✅ Use `Data.Component<"elements.testimonial-card">` for typing
- ✅ Component name: `Strapi` + PascalCase name
- ✅ Add `displayName` for debugging
- ✅ Use Tailwind classes for styling

#### Step 5: Create the Frontend Section Component

**File**: `apps/ui/src/components/page-builder/components/sections/StrapiTestimonialsSection.tsx`

```tsx
import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiTestimonialCard } from "@/components/page-builder/components/elements/StrapiTestimonialCard"

export function StrapiTestimonialsSection({
  component,
}: {
  readonly component: Data.Component<"sections.testimonials-section">
}) {
  const isCarousel = component.displayStyle === "carousel"

  return (
    <section className="bg-muted/30 relative z-10 py-20 md:py-28">
      <Container className="mx-auto px-4">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            {component.heading}
          </h2>
          {component.description && (
            <p className="text-muted-foreground text-lg text-balance">
              {component.description}
            </p>
          )}
        </div>

        {/* Testimonials */}
        {component.testimonials && component.testimonials.length > 0 && (
          <div
            className={
              isCarousel
                ? "flex gap-6 overflow-x-auto pb-4"
                : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            }
          >
            {component.testimonials.map((testimonial, index) => (
              <StrapiTestimonialCard
                key={testimonial.id || index}
                component={testimonial}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}

StrapiTestimonialsSection.displayName = "StrapiTestimonialsSection"

export default StrapiTestimonialsSection
```

#### Step 6: Register in Component Mapping

**File**: `apps/ui/src/components/page-builder/index.tsx`

```tsx
// 1. Add import at top
import StrapiTestimonialsSection from "@/components/page-builder/components/sections/StrapiTestimonialsSection"

// 2. Add to mapping object
export const PageContentComponents: {
  [K in UID.Component]?: React.ComponentType<any>
} = {
  // ... existing components ...

  // Add your new section
  "sections.testimonials-section": StrapiTestimonialsSection,

  // ... more components ...
}
```

#### Step 7: Test in Strapi Admin

1. Open Strapi admin: `http://localhost:1337/admin`
2. Go to **Content-Type Builder**
3. Find "Testimonials Section" in the list
4. Go to any **Page** content
5. Click "Add component" → Select "Testimonials Section"
6. Fill in the data
7. Save and publish
8. View on frontend: `http://localhost:3000/<page-slug>`

---

## 🧩 Adding a New Element Component

### Example: Creating a Pricing Card

#### Step 1: Create Strapi Schema

**File**: `apps/strapi/src/components/elements/pricing-card.json`

```json
{
  "collectionName": "components_elements_pricing_cards",
  "info": {
    "displayName": "Pricing Card",
    "description": "Pricing tier card with features"
  },
  "options": {},
  "attributes": {
    "planName": {
      "type": "string",
      "required": true
    },
    "price": {
      "type": "string",
      "required": true
    },
    "interval": {
      "type": "string",
      "default": "month"
    },
    "description": {
      "type": "text"
    },
    "features": {
      "type": "component",
      "repeatable": true,
      "component": "elements.list-item"
    },
    "ctaButton": {
      "type": "component",
      "repeatable": false,
      "component": "elements.icon-button"
    },
    "isPopular": {
      "type": "boolean",
      "default": false
    }
  }
}
```

#### Step 2: Generate Types

```powershell
cd apps\strapi
yarn generate:types
```

#### Step 3: Create Frontend Component

**File**: `apps/ui/src/components/page-builder/components/elements/StrapiPricingCard.tsx`

```tsx
import { Data } from "@repo/strapi"

import { StrapiIconButton } from "@/components/page-builder/components/elements/StrapiIconButton"
import { StrapiListItem } from "@/components/page-builder/components/elements/StrapiListItem"

export function StrapiPricingCard({
  component,
}: {
  readonly component: Data.Component<"elements.pricing-card">
}) {
  return (
    <div
      className={`border-border bg-card relative flex flex-col rounded-lg border p-8 ${
        component.isPopular ? "border-primary border-2" : ""
      }`}
    >
      {/* Popular Badge */}
      {component.isPopular && (
        <div className="bg-primary text-primary-foreground absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-sm font-semibold">
          Most Popular
        </div>
      )}

      {/* Plan Details */}
      <h3 className="mb-2 text-2xl font-bold">{component.planName}</h3>
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold">{component.price}</span>
        <span className="text-muted-foreground">/{component.interval}</span>
      </div>

      {component.description && (
        <p className="text-muted-foreground mb-6 text-sm">
          {component.description}
        </p>
      )}

      {/* Features */}
      {component.features && component.features.length > 0 && (
        <ul className="mb-8 space-y-3">
          {component.features.map((feature, index) => (
            <StrapiListItem key={feature.id || index} component={feature} />
          ))}
        </ul>
      )}

      {/* CTA Button */}
      {component.ctaButton && (
        <div className="mt-auto">
          <StrapiIconButton
            component={component.ctaButton}
            className="w-full justify-center"
          />
        </div>
      )}
    </div>
  )
}

StrapiPricingCard.displayName = "StrapiPricingCard"

export default StrapiPricingCard
```

---

## 📋 Adding a New Form Component

### Example: Creating a Multi-Step Contact Form

#### Step 1: Create Strapi Schema

**File**: `apps/strapi/src/components/forms/multistep-contact-form.json`

```json
{
  "collectionName": "components_forms_multistep_contact_forms",
  "info": {
    "displayName": "Multistep Contact Form",
    "description": "Multi-step contact form with validation"
  },
  "options": {},
  "attributes": {
    "heading": {
      "type": "string",
      "required": true
    },
    "description": {
      "type": "text"
    },
    "submitButtonText": {
      "type": "string",
      "default": "Send Message"
    },
    "successMessage": {
      "type": "text",
      "default": "Thank you! We'll be in touch soon."
    },
    "includePhoneField": {
      "type": "boolean",
      "default": false
    },
    "includeCompanyField": {
      "type": "boolean",
      "default": false
    }
  }
}
```

#### Step 2: Create Frontend Component with React Hook Form

**File**: `apps/ui/src/components/page-builder/components/forms/StrapiMultistepContactForm.tsx`

```tsx
"use client"

import { useState } from "react"
import { Data } from "@repo/strapi"

export function StrapiMultistepContactForm({
  component,
}: {
  readonly component: Data.Component<"forms.multistep-contact-form">
}) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-muted rounded-lg p-8 text-center">
        <h3 className="mb-2 text-2xl font-bold">Success!</h3>
        <p className="text-muted-foreground">{component.successMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border p-8">
      <h3 className="mb-2 text-2xl font-bold">{component.heading}</h3>
      {component.description && (
        <p className="text-muted-foreground mb-6">{component.description}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="border-input bg-background w-full rounded-md border px-4 py-2"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="border-input bg-background w-full rounded-md border px-4 py-2"
              required
            />
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-primary text-primary-foreground w-full rounded-md px-6 py-2"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Message */}
        {step === 2 && (
          <div className="space-y-4">
            <textarea
              placeholder="Your Message"
              className="border-input bg-background w-full rounded-md border px-4 py-2"
              rows={5}
              required
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="border-input flex-1 rounded-md border px-6 py-2"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-primary text-primary-foreground flex-1 rounded-md px-6 py-2"
              >
                {component.submitButtonText}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

StrapiMultistepContactForm.displayName = "StrapiMultistepContactForm"

export default StrapiMultistepContactForm
```

**Important**: Forms need `"use client"` directive for interactivity!

---

## 📄 Creating a New Page

### Step 1: Understand Page Content Type

The `Page` content type already exists at `apps/strapi/src/api/page/content-types/page/schema.json`

It has a **Dynamic Zone** called `content` that accepts all your components.

### Step 2: Create a Page in Strapi

1. Open Strapi admin: `http://localhost:1337/admin`
2. Go to **Content Manager** → **Page**
3. Click **Create new entry**
4. Fill in:
   - **Title**: "About Us"
   - **Slug**: "about-us" (URL will be `/about-us`)
   - **Content**: Click "Add component" and build your page
5. Add components in order:
   - Hero Section
   - Testimonials Section
   - CTA Section
6. **Save** and **Publish**

### Step 3: View Your Page

Visit: `http://localhost:3000/about-us`

The page builder automatically renders all components in order!

---

## 🔧 Generating TypeScript Types

### When to Generate Types

- ✅ After creating/modifying Strapi schemas
- ✅ Before creating frontend components
- ✅ After pulling changes from Git

### How to Generate

```powershell
# Option 1: Dedicated command
cd apps\strapi
yarn generate:types

# Option 2: Automatically when starting dev server
yarn dev
```

### Where Types Are Generated

- **Backend**: `apps/strapi/types/generated/contentTypes.d.ts`
- **Frontend**: Uses types from `@repo/strapi` package

### Using Types in Frontend

```tsx
import { Data } from "@repo/strapi"

// For components
const MyComponent = ({
  component
}: {
  component: Data.Component<"sections.hero">
}) => { ... }

// For content types
const MyPage = ({
  page
}: {
  page: Data.Page
}) => { ... }
```

---

## 🗺️ Frontend Component Mapping

### The Registry Pattern

All Strapi components must be registered in `apps/ui/src/components/page-builder/index.tsx`

### Adding to the Registry

```tsx
// 1. Import your component
import StrapiYourSection from "@/components/page-builder/components/sections/StrapiYourSection"

// 2. Add to mapping object
export const PageContentComponents: {
  [K in UID.Component]?: React.ComponentType<any>
} = {
  // Elements
  "elements.your-element": StrapiYourElement,

  // Sections
  "sections.your-section": StrapiYourSection,

  // Forms
  "forms.your-form": StrapiYourForm,
}
```

### Naming Convention

| Strapi UID              | Frontend Component  |
| ----------------------- | ------------------- |
| `sections.hero`         | `StrapiHero`        |
| `elements.feature-card` | `StrapiFeatureCard` |
| `forms.contact-form`    | `StrapiContactForm` |

**Pattern**: `Strapi` + PascalCase(name)

---

## ✅ Testing Your Components

### 1. Backend Testing (Strapi Admin)

```powershell
# Start Strapi
yarn dev:strapi
```

1. Visit `http://localhost:1337/admin`
2. Go to **Content-Type Builder**
3. Verify your component appears
4. Create test content using the component
5. Check data is saved correctly

### 2. Frontend Testing (Next.js)

```powershell
# Start full stack
yarn dev
```

1. Visit `http://localhost:3000`
2. Navigate to page with your component
3. Verify component renders correctly
4. Test responsive design (mobile, tablet, desktop)
5. Test interactions (buttons, forms, etc.)

### 3. Type Checking

```powershell
# Check for TypeScript errors
cd apps\ui
yarn type-check
```

### 4. Linting

```powershell
# Run linter
yarn lint
```

---

## 🐛 Troubleshooting

### Issue: Component Not Showing in Strapi

**Symptoms**: New component doesn't appear in component picker

**Solutions**:

1. Check JSON syntax in schema file
2. Restart Strapi dev server
3. Check Strapi console for errors
4. Verify `collectionName` is unique

### Issue: TypeScript Errors in Frontend

**Symptoms**: Red squiggly lines, type errors

**Solutions**:

```powershell
# Regenerate types
cd apps\strapi
yarn generate:types

# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Component Shows in Strapi but Not Frontend

**Symptoms**: Data saves in Strapi but nothing renders

**Solutions**:

1. Check component is registered in `page-builder/index.tsx`
2. Verify UID matches exactly (case-sensitive!)
3. Check browser console for errors
4. Verify component props match Strapi schema

### Issue: Styles Not Applying

**Symptoms**: Component renders but looks broken

**Solutions**:

1. Check Tailwind classes are correct
2. Verify you're using design system variables
3. Check for CSS conflicts
4. Test responsive classes work

### Issue: Form Submission Not Working

**Symptoms**: Form doesn't submit or shows errors

**Solutions**:

1. Check `"use client"` directive is present
2. Verify form action/handler exists
3. Check browser console for JavaScript errors
4. Test API endpoint separately

---

## 📋 Quick Reference Checklist

### Adding a New Section

- [ ] Create `apps/strapi/src/components/sections/your-section.json`
- [ ] Create any needed element schemas
- [ ] Generate TypeScript types: `yarn generate:types`
- [ ] Create `apps/ui/src/components/page-builder/components/sections/StrapiYourSection.tsx`
- [ ] Create element components if needed
- [ ] Register in `apps/ui/src/components/page-builder/index.tsx`
- [ ] Test in Strapi admin
- [ ] Test on frontend
- [ ] Check responsive design
- [ ] Commit changes to Git

### Workflow Summary

```
1. Strapi Schema (.json)
   ↓
2. Generate Types
   ↓
3. Frontend Component (.tsx)
   ↓
4. Register in Mapping
   ↓
5. Test in Strapi Admin
   ↓
6. Test on Frontend
   ↓
7. Commit to Git ✅
```

---

## 🎓 Best Practices

### Schema Design

- ✅ Use descriptive display names
- ✅ Add descriptions to help editors
- ✅ Make required fields actually required
- ✅ Use enumerations for fixed options
- ✅ Provide sensible defaults

### Component Design

- ✅ Keep components focused (single responsibility)
- ✅ Reuse elements across sections
- ✅ Handle null/undefined data gracefully
- ✅ Make components responsive by default
- ✅ Add proper TypeScript typing

### Naming Conventions

- ✅ Strapi: `kebab-case` (e.g., `hero-section`)
- ✅ Frontend: `PascalCase` with `Strapi` prefix (e.g., `StrapiHeroSection`)
- ✅ Files: Match component name (e.g., `StrapiHeroSection.tsx`)

### Performance

- ✅ Use `"use client"` only when needed
- ✅ Optimize images with Next.js Image component
- ✅ Lazy load heavy components
- ✅ Minimize bundle size

---

## 🚀 You're Ready!

You now have everything you need to:

- ✅ Add new sections to the page builder
- ✅ Create reusable element components
- ✅ Build interactive forms
- ✅ Create and publish pages
- ✅ Debug issues when they arise

**Need Help?** Check the existing components in the codebase for real examples!

---

**Created**: November 6, 2025  
**Version**: 1.0  
**For**: Strapi v5 + Next.js v15 Monorepo
