# 🚀 Component Development Workflow

> **THE COMPLETE, STEP-BY-STEP PROCESS**  
> Follow this guide EXACTLY to create new Strapi components without issues.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Backend Setup (Strapi)](#phase-1-backend-setup-strapi)
4. [Phase 2: Type Generation](#phase-2-type-generation)
5. [Phase 3: Frontend Implementation](#phase-3-frontend-implementation)
6. [Phase 4: Testing & Validation](#phase-4-testing--validation)
7. [Complete Example Walkthrough](#complete-example-walkthrough)
8. [Common Issues & Solutions](#common-issues--solutions)

---

## 🎯 Overview

### The Golden Rule

**✅ ALWAYS COMPLETE BACKEND FIRST, THEN FRONTEND**

```
Backend (Data Structure) → Type Generation → Frontend (Presentation) → Testing
```

### Why This Matters

- ❌ Starting frontend first = TypeScript errors, missing data, wasted time
- ✅ Backend first = Proper types, clean development, working components

### Component Development Phases

| Phase | Focus                | Time   | Critical? |
| ----- | -------------------- | ------ | --------- |
| 1     | Strapi Schemas       | 15 min | 🔴 YES    |
| 2     | Type Generation      | 2 min  | 🔴 YES    |
| 3     | React Components     | 30 min | 🟡 Medium |
| 4     | Testing & Validation | 10 min | 🟢 Low    |

---

## ✅ Prerequisites

Before starting, ensure:

```powershell
# Check you're in the monorepo root
cd c:\Users\herma\source\repository\strapi-next-monorepo-v2

# Check dependencies are installed
yarn install

# Check Strapi is running
yarn dev:strapi

# Check Next.js is running (in separate terminal)
yarn dev:ui
```

**Required Knowledge:**

- Basic JSON syntax
- Understanding of Strapi component categories (elements, sections, forms, utilities)
- React/TypeScript fundamentals

---

## 🔧 Phase 1: Backend Setup (Strapi)

**Goal:** Create complete, working data structure in Strapi

**Time:** ~15 minutes per component

**Deliverables:**

- ✅ Schema JSON file(s) created
- ✅ Component added to Page dynamic zone
- ✅ API populate middleware configured
- ✅ Config sync exported

---

### Step 1.1: Create Element Schema(s) (If Needed)

**When to do this:** Your section needs repeatable sub-components (cards, items, logos, etc.)

**File Location:** `apps/strapi/src/components/elements/<name>.json`

**Example:** Creating a testimonial card element

```json
{
  "collectionName": "components_elements_testimonial_cards",
  "info": {
    "displayName": "Testimonial Card",
    "description": "Customer testimonial with quote, author, and rating"
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

**Critical Points:**

- ✅ `collectionName`: Must be `components_<category>_<name>` (plural!)
- ✅ `displayName`: Shows in Strapi admin UI
- ✅ `description`: Helps editors understand the component
- ✅ Use descriptive field names
- ✅ Set `required: true` for mandatory fields
- ✅ Provide sensible defaults

**Common Field Types:**

```json
{
  "text": { "type": "string" },
  "longText": { "type": "text" },
  "number": { "type": "integer" },
  "decimal": { "type": "decimal" },
  "checkbox": { "type": "boolean" },
  "date": { "type": "date" },
  "dropdown": { "type": "enumeration", "enum": ["option1", "option2"] },
  "image": { "type": "media", "allowedTypes": ["images"] },
  "richText": { "type": "richtext" }
}
```

---

### Step 1.2: Create Section Schema

**When to do this:** ALWAYS (this is your main component)

**File Location:** `apps/strapi/src/components/sections/<name>.json`

**Example:** Creating a testimonials section

```json
{
  "collectionName": "components_sections_testimonials_sections",
  "info": {
    "displayName": "Testimonials Section",
    "description": "Display customer testimonials in grid or carousel"
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
    },
    "badgeText": {
      "type": "string"
    },
    "badgeIcon": {
      "type": "string"
    }
  }
}
```

**Critical Points:**

- ✅ Reference element components using `"component": "elements.element-name"`
- ✅ Use `"repeatable": true` for arrays/lists
- ✅ Use `enumeration` for dropdown options
- ✅ Include badge fields for optional top labels

**Component References:**

```json
{
  "singleComponent": {
    "type": "component",
    "repeatable": false,
    "component": "elements.button"
  },
  "multipleComponents": {
    "type": "component",
    "repeatable": true,
    "component": "elements.feature-card"
  }
}
```

---

### Step 1.3: Add to Page Dynamic Zone

**⚠️ CRITICAL STEP - Component won't appear in picker without this!**

**File:** `apps/strapi/src/api/page/content-types/page/schema.json`

**Find the `content` attribute:**

```json
{
  "attributes": {
    "content": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.benefits-section",
        "sections.metrics-section",
        // ... existing components ...

        // ✅ ADD YOUR NEW SECTION HERE (alphabetical order recommended)
        "sections.testimonials-section",

        "forms.newsletter-form",
        "forms.contact-form"
      ]
    }
  }
}
```

**Critical Points:**

- ✅ Add full UID: `"sections.component-name"` or `"elements.component-name"`
- ✅ Watch comma placement (valid JSON!)
- ✅ Save file - Strapi auto-reloads on change
- ✅ Refresh browser to see component in picker

**⚠️ Common Mistakes:**

- ❌ Missing comma between entries
- ❌ Typo in component UID
- ❌ Forgetting to save file
- ❌ Not refreshing browser

---

### Step 1.4: Add to API Populate Middleware

**⚠️ CRITICAL STEP - Data won't load on frontend without this!**

**When to do this:** Your component has ANY of these:

- Repeatable components (arrays)
- Media/image fields
- Nested components
- Relation fields

**File:** `apps/strapi/src/documentMiddlewares/page.ts`

**Find the `pagePopulateObject` constant:**

```typescript
const pagePopulateObject: FindOne<"api::page.page">["populate"] = {
  content: {
    on: {
      // ... existing components ...

      // ✅ ADD YOUR NEW SECTION HERE
      "sections.testimonials-section": {
        populate: {
          testimonials: {
            populate: {
              authorPhoto: { populate: { media: true } },
            },
          },
        },
      },

      // ... more components ...
    },
  },
}
```

**Populate Patterns:**

```typescript
// Pattern 1: Simple repeatable component (no media)
"sections.benefits-section": {
  populate: { benefits: true },
},

// Pattern 2: Repeatable component WITH media
"sections.tech-stack-section": {
  populate: {
    technologies: { populate: { media: true } },
  },
},

// Pattern 3: Nested components with multiple levels
"sections.testimonials-section": {
  populate: {
    testimonials: {
      populate: {
        authorPhoto: { populate: { media: true } },
      },
    },
  },
},

// Pattern 4: Multiple repeatable fields
"sections.partner-showcase-section": {
  populate: {
    partners: {
      populate: {
        logo: { populate: { media: true } },
        link: true,
      },
    },
  },
},
```

**How to Determine What to Populate:**

1. Look at your schema JSON
2. Find fields with `"type": "component"` or `"type": "media"`
3. If `"repeatable": true`, wrap in populate object
4. If it has media, add `{ populate: { media: true } }`

**⚠️ Without This Step:**

- ❌ Component appears in Strapi admin ✅
- ❌ Component saves in Strapi admin ✅
- ❌ Component shows in API response ❌ (empty/null)
- ❌ Component renders on frontend ❌ (no data)

---

### Step 1.5: Handle TypeScript Errors (Temporary)

**Issue:** After adding populate middleware, you might see TypeScript errors because types haven't generated yet.

**Solution:** Add temporary type assertion

```typescript
const pagePopulateObject = {
  content: {
    on: {
      // ... your new component ...
      "sections.testimonials-section": {
        populate: {
          testimonials: {
            populate: {
              authorPhoto: { populate: { media: true } },
            },
          },
        },
      },
    },
  },
} as any // ✅ Add this temporarily to bypass type error
```

**⚠️ This is TEMPORARY:**

- We'll remove it in Phase 2 after type generation
- Don't forget to remove it!
- It's only needed while Strapi generates types

---

### Step 1.6: Verify Strapi Restarts

**Check Strapi terminal for:**

```
[STRAPI] ✓ Reloading...
[STRAPI] ✓ Content-Type Builder: Loaded
[STRAPI] ✓ Server started
```

**If errors appear:**

- Check JSON syntax in schema files
- Check comma placement
- Check component UID references exist
- Fix errors before proceeding

---

### Step 1.7: Export Config Sync

**⚠️ IMPORTANT - Preserves component configuration**

**Steps:**

1. Open Strapi admin: `http://localhost:1337/admin`
2. Go to **Settings** → **Config Sync**
3. Click **"Export"** button
4. Wait for success message

**What This Does:**

- Creates sync files in `apps/strapi/config/sync/`
- Saves component configurations
- Allows team members to import your changes
- Essential for deployment

**Expected Files Created:**

```
apps/strapi/config/sync/
  core-store.plugin_content_manager_configuration_components##sections.testimonials-section.json
  core-store.plugin_content_manager_configuration_components##elements.testimonial-card.json
```

**⚠️ Commit These Files to Git!**

---

### ✅ Phase 1 Checklist

Before moving to Phase 2:

- [ ] Element schema(s) created (if needed)
- [ ] Section schema created
- [ ] Component added to Page dynamic zone array
- [ ] Component added to API populate middleware
- [ ] Temporary `as any` type assertion added (if TypeScript errors)
- [ ] Strapi restarted successfully (no errors)
- [ ] Config sync exported
- [ ] All files saved

---

## 🔄 Phase 2: Type Generation

**Goal:** Generate TypeScript types for type-safe frontend development

**Time:** ~2 minutes

**Deliverables:**

- ✅ TypeScript types generated
- ✅ Types available in `@repo/strapi` package
- ✅ Ready for frontend component development

---

### Step 2.1: Generate Types

**Two options:**

**Option A: Dedicated Command (Recommended)**

```powershell
cd apps\strapi
yarn generate:types
```

**Option B: Restart Dev Server (Auto-generates)**

```powershell
cd apps\strapi
# Press Ctrl+C to stop
yarn develop
```

**Expected Output:**

```
✔ Types generated successfully
  Created types/generated/contentTypes.d.ts
  Created types/generated/components.d.ts
```

---

### Step 2.2: Verify Types Exist

**Check the generated type file:**

```powershell
# Search for your component in generated types
cd apps\strapi
findstr /C:"testimonials-section" types\generated\contentTypes.d.ts
```

**Expected result:**

```typescript
'sections.testimonials-section': SectionsTestimonialsSection;
```

---

### Step 2.3: Remove Temporary Type Assertion

**File:** `apps/strapi/src/documentMiddlewares/page.ts`

**Before:**

```typescript
const pagePopulateObject = {
  content: {
    on: {
      "sections.testimonials-section": {
        populate: {
          testimonials: {
            populate: {
              authorPhoto: { populate: { media: true } },
            },
          },
        },
      },
    },
  },
} as any // ❌ Remove this now
```

**After:**

```typescript
const pagePopulateObject: FindOne<"api::page.page">["populate"] = {
  content: {
    on: {
      "sections.testimonials-section": {
        populate: {
          testimonials: {
            populate: {
              authorPhoto: { populate: { media: true } },
            },
          },
        },
      },
    },
  },
} // ✅ Proper typing restored
```

**Save the file and check for TypeScript errors:**

- ✅ No errors = Types generated correctly
- ❌ Errors = Regenerate types or check syntax

---

### ✅ Phase 2 Checklist

Before moving to Phase 3:

- [ ] Types generated successfully
- [ ] Component type found in generated files
- [ ] Temporary `as any` removed from middleware
- [ ] No TypeScript errors in Strapi
- [ ] Strapi compiling without errors

---

## 💻 Phase 3: Frontend Implementation

**Goal:** Create React components to render Strapi data

**Time:** ~30 minutes per component

**Deliverables:**

- ✅ Element React component(s) created
- ✅ Section React component created
- ✅ Components registered in page-builder
- ✅ No TypeScript errors

---

### Step 3.1: Create Element Component(s) (If Needed)

**File:** `apps/ui/src/components/page-builder/components/elements/StrapiTestimonialCard.tsx`

**Template:**

```tsx
import { Data } from "@repo/strapi"

import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"

export function StrapiTestimonialCard({
  component,
}: {
  readonly component: Data.Component<"elements.testimonial-card">
}) {
  // ✅ Handle null/undefined with ?? operator
  const rating = component.rating ?? 5
  const quote = component.quote ?? ""
  const authorName = component.authorName ?? "Anonymous"

  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-6">
      {/* Rating Stars */}
      <div className="flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
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
      <p className="text-foreground italic leading-relaxed">"{quote}"</p>

      {/* Author */}
      <div className="flex items-center gap-3">
        {component.authorPhoto && (
          <StrapiBasicImage
            component={component.authorPhoto}
            className="h-12 w-12 rounded-full object-cover"
          />
        )}
        <div>
          <div className="font-semibold">{authorName}</div>
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

**Critical Points:**

- ✅ Import `Data` from `@repo/strapi`
- ✅ Use `Data.Component<"elements.component-name">` for typing
- ✅ Handle null/undefined with `??` operator or conditional rendering
- ✅ Use `StrapiBasicImage` for media fields
- ✅ Add `displayName` for debugging
- ✅ Export default for lazy loading

**TypeScript Best Practices:**

```tsx
// ✅ DO: Use nullish coalescing
const value = component.field ?? "default"

// ✅ DO: Conditional rendering
{
  component.image && <StrapiBasicImage component={component.image} />
}

// ✅ DO: Safe array mapping
{
  component.items?.map((item, index) => <Item key={item.id ?? index} />)
}

// ❌ DON'T: Assume fields exist
const value = component.field.toLowerCase() // Error if null!

// ❌ DON'T: Use non-null assertion unless certain
const value = component.field! // Risky!
```

---

### Step 3.2: Create Section Component

**File:** `apps/ui/src/components/page-builder/components/sections/StrapiTestimonialsSection.tsx`

**Template:**

```tsx
import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiTestimonialCard } from "@/components/page-builder/components/elements/StrapiTestimonialCard"

export function StrapiTestimonialsSection({
  component,
}: {
  readonly component: Data.Component<"sections.testimonials-section">
}) {
  // ✅ Extract and validate data
  const heading = component.heading ?? "Testimonials"
  const description = component.description
  const testimonials = component.testimonials ?? []
  const displayStyle = component.displayStyle ?? "grid"
  const badgeText = component.badgeText
  const badgeIcon = component.badgeIcon

  // ✅ Early return if no data
  if (testimonials.length === 0) {
    return null
  }

  const isCarousel = displayStyle === "carousel"

  return (
    <section className="bg-muted/30 relative z-10 py-20 md:py-28">
      <Container className="mx-auto px-4">
        {/* Badge (Optional) */}
        {badgeText && (
          <div className="mb-8 flex justify-center">
            <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              {badgeIcon && <span>{badgeIcon}</span>}
              <span>{badgeText}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {heading}
          </h2>
          {description && (
            <p className="text-muted-foreground text-balance text-lg">
              {description}
            </p>
          )}
        </div>

        {/* Testimonials Grid/Carousel */}
        <div
          className={
            isCarousel
              ? "flex gap-6 overflow-x-auto pb-4"
              : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {testimonials.map((testimonial, index) => (
            <StrapiTestimonialCard
              key={testimonial.id ?? index}
              component={testimonial}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

StrapiTestimonialsSection.displayName = "StrapiTestimonialsSection"

export default StrapiTestimonialsSection
```

**Critical Points:**

- ✅ Import element components
- ✅ Use `Container` for consistent spacing
- ✅ Handle badge display conditionally
- ✅ Support different display styles (grid/carousel)
- ✅ Use `text-balance` for better typography
- ✅ Make responsive with Tailwind breakpoints
- ✅ Return `null` if no data

**Responsive Design:**

```tsx
// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

// Mobile: Stack vertically
// Desktop: Horizontal layout
<div className="flex flex-col gap-4 md:flex-row">

// Show/hide based on screen size
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>
```

---

### Step 3.3: Register in Page Builder

**File:** `apps/ui/src/components/page-builder/index.tsx`

**Step 1: Add Import**

```tsx
// Find the imports section at the top of the file

// Elements (alphabetical order)
import StrapiTestimonialCard from "@/components/page-builder/components/elements/StrapiTestimonialCard"
// Sections (alphabetical order)
import StrapiTestimonialsSection from "@/components/page-builder/components/sections/StrapiTestimonialsSection"
```

**Step 2: Add to Mapping Object**

```tsx
export const PageContentComponents: {
  [K in UID.Component]?: React.ComponentType<any>
} = {
  // ========================================
  // ELEMENTS
  // ========================================
  "elements.testimonial-card": StrapiTestimonialCard,

  // ========================================
  // SECTIONS
  // ========================================
  "sections.testimonials-section": StrapiTestimonialsSection,

  // ... rest of components ...
}
```

**Critical Points:**

- ✅ Use exact UID from schema: `"sections.component-name"`
- ✅ Component name matches import: `StrapiComponentName`
- ✅ Keep alphabetical order for maintainability
- ✅ Watch comma placement (valid TypeScript object)

**⚠️ Common Mistakes:**

- ❌ Typo in UID: `"sections.testimonial-section"` vs `"sections.testimonials-section"`
- ❌ Wrong import path
- ❌ Missing comma
- ❌ Component not default exported

---

### Step 3.4: Format and Check for Errors

**Format code:**

```powershell
# From monorepo root
yarn format
```

**Check for TypeScript errors:**

```powershell
cd apps\ui
yarn type-check
```

**Fix common TypeScript errors:**

```typescript
// Error: Property 'field' does not exist on type 'never'
// Fix: Check component UID spelling matches schema exactly

// Error: Object is possibly 'null' or 'undefined'
// Fix: Use optional chaining or nullish coalescing
const value = component.field ?? "default"
{component.image && <Image />}

// Error: Type 'string | undefined' is not assignable to type 'string'
// Fix: Provide default value
const text: string = component.text ?? ""
```

---

### ✅ Phase 3 Checklist

Before moving to Phase 4:

- [ ] Element component(s) created
- [ ] Section component created
- [ ] Both components handle null/undefined safely
- [ ] Components registered in page-builder/index.tsx
- [ ] Code formatted with `yarn format`
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Components use proper Tailwind classes
- [ ] Responsive design implemented

---

## 🧪 Phase 4: Testing & Validation

**Goal:** Verify component works end-to-end

**Time:** ~10 minutes

**Deliverables:**

- ✅ Component appears in Strapi picker
- ✅ Test data created successfully
- ✅ Frontend renders correctly
- ✅ Responsive design works
- ✅ All data populates

---

### Step 4.1: Verify Component in Strapi Admin

**Steps:**

1. Open Strapi admin: `http://localhost:1337/admin`
2. Go to **Content Manager** → **Page**
3. Open any existing page or create new
4. Scroll to **Content** section
5. Click **"Add a component"**
6. Look for your component in the **sections** category

**✅ SUCCESS:** Component appears in picker  
**❌ FAILURE:** Go back to Phase 1, Step 1.3 - Check Page dynamic zone

---

### Step 4.2: Create Test Data

**Fill in all fields:**

1. **Heading**: "What Our Customers Say"
2. **Description**: "Don't just take our word for it - hear from our satisfied clients"
3. **Display Style**: Grid
4. **Badge Text**: "Testimonials"
5. **Badge Icon**: 💬

**Add 3-6 Testimonials:**

Click "Add an entry" under Testimonials:

- **Quote**: "This platform transformed how we build applications!"
- **Author Name**: "Sarah Johnson"
- **Author Role**: "CEO"
- **Author Photo**: Upload or select from media library
- **Rating**: 5

Repeat for multiple testimonials.

**Save as Draft** (Ctrl+S)

---

### Step 4.3: Check API Response

**Open browser DevTools:**

1. Press F12
2. Go to **Network** tab
3. Refresh page
4. Find the API request (e.g., `api/pages/`)
5. Click on it
6. Check **Response** tab

**Look for your component data:**

```json
{
  "content": [
    {
      "__component": "sections.testimonials-section",
      "heading": "What Our Customers Say",
      "testimonials": [
        {
          "quote": "This platform transformed...",
          "authorName": "Sarah Johnson",
          "authorPhoto": { ... }
        }
      ]
    }
  ]
}
```

**✅ SUCCESS:** All data present including nested testimonials  
**❌ FAILURE:** Go back to Phase 1, Step 1.4 - Check populate middleware

---

### Step 4.4: Publish and View on Frontend

**In Strapi:**

1. Click **"Publish"** button (top right)
2. Confirm publish

**On Frontend:**

1. Open the page: `http://localhost:3000/<page-slug>`
2. Scroll to your component

**✅ SUCCESS:** Component renders with all data  
**❌ FAILURE:** Check browser console for errors

---

### Step 4.5: Test Responsive Design

**In browser DevTools:**

1. Press F12
2. Click **Toggle Device Toolbar** (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)

**Check:**

- ✅ Layout adjusts properly
- ✅ Text is readable
- ✅ Images scale correctly
- ✅ No horizontal scroll
- ✅ Touch targets are large enough (mobile)

---

### Step 4.6: Test Edge Cases

**Create test scenarios:**

1. **Minimal data**: Only required fields filled
2. **Maximum data**: All optional fields filled
3. **Empty arrays**: Component with no testimonials
4. **Long text**: Very long quotes/descriptions
5. **Missing images**: Testimonials without photos

**Expected behavior:**

- ✅ Component handles all cases gracefully
- ✅ No console errors
- ✅ No broken layouts
- ✅ Appropriate fallbacks for missing data

---

### Step 4.7: Commit to Git

**If everything works:**

```powershell
# Check what changed
git status

# Format code
yarn format

# Stage files
git add .

# Commit with conventional message
yarn commit
# Or: git commit -m "feat: add testimonials section component"

# Push to GitHub
git push origin main
```

---

### ✅ Phase 4 Checklist

- [ ] Component appears in Strapi picker
- [ ] Test data created successfully
- [ ] API returns all data (including nested)
- [ ] Frontend renders correctly
- [ ] No browser console errors
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] Edge cases handled (missing data, long text, etc.)
- [ ] Code committed to Git
- [ ] Config sync files committed

---

## 📖 Complete Example Walkthrough

Let's create a **Pricing Section** from scratch following the complete workflow.

### Component Plan

**Section:** Pricing Section  
**Elements:** Pricing Card, Feature Item  
**Features:**

- Grid of 3 pricing tiers
- Each tier has name, price, features list
- Highlight popular plan
- CTA button per tier

---

### Phase 1: Backend (15 minutes)

**Step 1.1: Create Feature Item Element**

File: `apps/strapi/src/components/elements/feature-item.json`

```json
{
  "collectionName": "components_elements_feature_items",
  "info": {
    "displayName": "Feature Item",
    "description": "A single feature with icon and text"
  },
  "options": {},
  "attributes": {
    "text": {
      "type": "string",
      "required": true
    },
    "icon": {
      "type": "string",
      "default": "✓"
    },
    "isIncluded": {
      "type": "boolean",
      "default": true
    }
  }
}
```

**Step 1.2: Create Pricing Card Element**

File: `apps/strapi/src/components/elements/pricing-card.json`

```json
{
  "collectionName": "components_elements_pricing_cards",
  "info": {
    "displayName": "Pricing Card",
    "description": "Pricing tier with features and CTA"
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
      "component": "elements.feature-item"
    },
    "ctaText": {
      "type": "string",
      "default": "Get Started"
    },
    "ctaLink": {
      "type": "string"
    },
    "isPopular": {
      "type": "boolean",
      "default": false
    }
  }
}
```

**Step 1.3: Create Pricing Section**

File: `apps/strapi/src/components/sections/pricing-section.json`

```json
{
  "collectionName": "components_sections_pricing_sections",
  "info": {
    "displayName": "Pricing Section",
    "description": "Display pricing tiers in a grid"
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
    "pricingTiers": {
      "type": "component",
      "repeatable": true,
      "component": "elements.pricing-card"
    },
    "badgeText": {
      "type": "string"
    }
  }
}
```

**Step 1.4: Add to Page Dynamic Zone**

File: `apps/strapi/src/api/page/content-types/page/schema.json`

```json
{
  "content": {
    "type": "dynamiczone",
    "components": [
      "sections.hero",
      "sections.pricing-section", // ✅ Added
      "forms.contact-form"
    ]
  }
}
```

**Step 1.5: Add to API Populate Middleware**

File: `apps/strapi/src/documentMiddlewares/page.ts`

```typescript
const pagePopulateObject: FindOne<"api::page.page">["populate"] = {
  content: {
    on: {
      "sections.pricing-section": {
        populate: {
          pricingTiers: {
            populate: {
              features: true,
            },
          },
        },
      },
    },
  },
} as any // ✅ Temporary
```

**Step 1.6: Export Config Sync**

1. Strapi admin → Settings → Config Sync → Export

---

### Phase 2: Type Generation (2 minutes)

```powershell
cd apps\strapi
yarn generate:types
```

**Remove `as any` from middleware after types generate.**

---

### Phase 3: Frontend (30 minutes)

**Step 3.1: Create Feature Item Component**

File: `apps/ui/src/components/page-builder/components/elements/StrapiFeatureItem.tsx`

```tsx
import { Data } from "@repo/strapi"

export function StrapiFeatureItem({
  component,
}: {
  readonly component: Data.Component<"elements.feature-item">
}) {
  const text = component.text ?? ""
  const icon = component.icon ?? "✓"
  const isIncluded = component.isIncluded ?? true

  return (
    <li
      className={`flex items-center gap-2 ${!isIncluded ? "text-muted-foreground line-through" : ""}`}
    >
      <span className="text-primary flex-shrink-0">{icon}</span>
      <span>{text}</span>
    </li>
  )
}

StrapiFeatureItem.displayName = "StrapiFeatureItem"
export default StrapiFeatureItem
```

**Step 3.2: Create Pricing Card Component**

File: `apps/ui/src/components/page-builder/components/elements/StrapiPricingCard.tsx`

```tsx
import Link from "next/link"
import { Data } from "@repo/strapi"

import { StrapiFeatureItem } from "./StrapiFeatureItem"

export function StrapiPricingCard({
  component,
}: {
  readonly component: Data.Component<"elements.pricing-card">
}) {
  const planName = component.planName ?? "Plan"
  const price = component.price ?? "$0"
  const interval = component.interval ?? "month"
  const description = component.description
  const features = component.features ?? []
  const ctaText = component.ctaText ?? "Get Started"
  const ctaLink = component.ctaLink ?? "#"
  const isPopular = component.isPopular ?? false

  return (
    <div
      className={`bg-card relative flex flex-col rounded-lg border p-8 ${
        isPopular ? "border-primary border-2" : "border-border"
      }`}
    >
      {isPopular && (
        <div className="bg-primary text-primary-foreground absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-sm font-semibold">
          Most Popular
        </div>
      )}

      <h3 className="mb-2 text-2xl font-bold">{planName}</h3>

      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-muted-foreground">/{interval}</span>
      </div>

      {description && (
        <p className="text-muted-foreground mb-6 text-sm">{description}</p>
      )}

      {features.length > 0 && (
        <ul className="mb-8 space-y-3">
          {features.map((feature, index) => (
            <StrapiFeatureItem key={feature.id ?? index} component={feature} />
          ))}
        </ul>
      )}

      <div className="mt-auto">
        <Link
          href={ctaLink}
          className={`block w-full rounded-md px-6 py-3 text-center font-medium ${
            isPopular
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  )
}

StrapiPricingCard.displayName = "StrapiPricingCard"
export default StrapiPricingCard
```

**Step 3.3: Create Pricing Section Component**

File: `apps/ui/src/components/page-builder/components/sections/StrapiPricingSection.tsx`

```tsx
import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import { StrapiPricingCard } from "@/components/page-builder/components/elements/StrapiPricingCard"

export function StrapiPricingSection({
  component,
}: {
  readonly component: Data.Component<"sections.pricing-section">
}) {
  const heading = component.heading ?? "Pricing"
  const description = component.description
  const pricingTiers = component.pricingTiers ?? []
  const badgeText = component.badgeText

  if (pricingTiers.length === 0) {
    return null
  }

  return (
    <section className="bg-background relative z-10 py-20 md:py-28">
      <Container className="mx-auto px-4">
        {badgeText && (
          <div className="mb-8 flex justify-center">
            <div className="bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium">
              {badgeText}
            </div>
          </div>
        )}

        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            {heading}
          </h2>
          {description && (
            <p className="text-muted-foreground text-balance text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <StrapiPricingCard key={tier.id ?? index} component={tier} />
          ))}
        </div>
      </Container>
    </section>
  )
}

StrapiPricingSection.displayName = "StrapiPricingSection"
export default StrapiPricingSection
```

**Step 3.4: Register Components**

File: `apps/ui/src/components/page-builder/index.tsx`

```tsx
import StrapiFeatureItem from "@/components/page-builder/components/elements/StrapiFeatureItem"
import StrapiPricingCard from "@/components/page-builder/components/elements/StrapiPricingCard"
import StrapiPricingSection from "@/components/page-builder/components/sections/StrapiPricingSection"

export const PageContentComponents: {
  [K in UID.Component]?: React.ComponentType<any>
} = {
  "elements.feature-item": StrapiFeatureItem,
  "elements.pricing-card": StrapiPricingCard,
  "sections.pricing-section": StrapiPricingSection,
}
```

**Step 3.5: Format and Check**

```powershell
yarn format
cd apps\ui
yarn type-check
```

---

### Phase 4: Testing (10 minutes)

1. **Verify in Strapi picker** ✅
2. **Create test data:**
   - Heading: "Choose Your Plan"
   - 3 pricing tiers (Basic, Pro, Enterprise)
   - Pro tier marked as popular
3. **Check API response** ✅
4. **Publish and view** ✅
5. **Test responsive** ✅
6. **Commit to Git** ✅

---

## 🐛 Common Issues & Solutions

### Issue 1: Component Not in Picker

**Symptoms:** New component doesn't appear when clicking "Add component"

**Checklist:**

- [ ] Schema files created and saved
- [ ] Component added to `apps/strapi/src/api/page/content-types/page/schema.json` components array
- [ ] Strapi restarted successfully
- [ ] Browser refreshed (hard refresh: Ctrl+Shift+R)
- [ ] No JSON syntax errors in schema files

**Solution:**

1. Open `apps/strapi/src/api/page/content-types/page/schema.json`
2. Find `content.components` array
3. Add your component UID: `"sections.your-section"`
4. Save file
5. Wait for Strapi to reload
6. Hard refresh browser

---

### Issue 2: Data Empty on Frontend

**Symptoms:** Component appears in Strapi and saves, but shows empty on website

**Checklist:**

- [ ] Populate middleware configured for component
- [ ] All nested fields included in populate
- [ ] Media fields have `{ populate: { media: true } }`
- [ ] Strapi restarted after middleware change
- [ ] Page re-published after changes

**Solution:**

1. Open `apps/strapi/src/documentMiddlewares/page.ts`
2. Find `pagePopulateObject.content.on`
3. Add your component with proper populate:
   ```typescript
   "sections.your-section": {
     populate: {
       nestedField: { populate: { media: true } },
     },
   },
   ```
4. Save and wait for reload
5. Re-publish page in Strapi
6. Hard refresh browser

---

### Issue 3: TypeScript Errors

**Symptoms:** Red squiggly lines, type errors in VS Code

**Solutions:**

**A) Types not generated:**

```powershell
cd apps\strapi
yarn generate:types
```

**B) VS Code TypeScript server stuck:**

1. Press Ctrl+Shift+P
2. Type "TypeScript: Restart TS Server"
3. Press Enter

**C) Wrong type import:**

```tsx
// ❌ Wrong
import { ComponentSectionsHero } from "@repo/strapi"

// ✅ Correct
import { Data } from "@repo/strapi"
const component: Data.Component<"sections.hero">
```

---

### Issue 4: Strapi Won't Start

**Symptoms:** Errors in terminal when running `yarn develop`

**Common causes:**

**A) JSON syntax error:**

- Check for missing/extra commas
- Validate JSON: https://jsonlint.com/

**B) Invalid component reference:**

```json
{
  "component": "elements.non-existent-component" // ❌ Doesn't exist
}
```

**C) Database connection issue:**

```powershell
# Check Docker database is running
cd apps\strapi
docker compose ps

# Start if not running
docker compose up -d db
```

---

### Issue 5: Infinite Loops/Performance Issues

**Symptoms:** Browser freezes, high CPU usage

**Common causes:**

**A) Missing key in map:**

```tsx
// ❌ Wrong - causes re-render issues
{
  items.map((item) => <Item component={item} />)
}

// ✅ Correct
{
  items.map((item, index) => <Item key={item.id ?? index} component={item} />)
}
```

**B) Component re-creating functions:**

```tsx
// ❌ Wrong - creates new function every render
const MyComponent = () => {
  const handleClick = () => { ... }
  return <button onClick={handleClick}>Click</button>
}

// ✅ Correct - use useCallback for performance
const handleClick = useCallback(() => { ... }, [])
```

---

## ✅ Final Workflow Checklist

Print this and check off each step:

### Phase 1: Backend (Strapi)

- [ ] 1.1: Element schema(s) created
- [ ] 1.2: Section schema created
- [ ] 1.3: Added to Page dynamic zone
- [ ] 1.4: Added to populate middleware
- [ ] 1.5: Temporary `as any` added (if needed)
- [ ] 1.6: Strapi restarted successfully
- [ ] 1.7: Config sync exported

### Phase 2: Type Generation

- [ ] 2.1: Types generated (`yarn generate:types`)
- [ ] 2.2: Component type exists in generated files
- [ ] 2.3: Temporary `as any` removed

### Phase 3: Frontend

- [ ] 3.1: Element component(s) created
- [ ] 3.2: Section component created
- [ ] 3.3: Components registered in page-builder
- [ ] 3.4: Code formatted, no errors

### Phase 4: Testing

- [ ] 4.1: Component in Strapi picker
- [ ] 4.2: Test data created
- [ ] 4.3: API returns full data
- [ ] 4.4: Frontend renders correctly
- [ ] 4.5: Responsive design works
- [ ] 4.6: Edge cases handled
- [ ] 4.7: Committed to Git

---

## 🔄 Modifying Existing Components (IMPORTANT!)

**When you ADD, REMOVE, or CHANGE fields in an existing component, follow these steps:**

### Step-by-Step Process

**1. Modify the Schema JSON**

Edit the component's schema file:

- Add new field
- Change field properties
- Remove field (delete from JSON)

Example: Adding `showBackground` to existing logo component:

```json
{
  "attributes": {
    "image": { "type": "media" },
    "name": { "type": "string" },
    "showBackground": {
      // ✅ NEW FIELD
      "type": "boolean",
      "default": false,
      "description": "Show background behind logo"
    }
  }
}
```

**2. Wait for Strapi to Rebuild**

Strapi will detect the change and auto-restart. Watch terminal for:

```
[Strapi] ✓ Reloading...
[Strapi] ✓ Content-Type Builder: Loaded
[Strapi] ✓ Server started
```

**3. 🔴 EXPORT CONFIG SYNC (CRITICAL - MOST MISSED STEP!)**

**⚠️ This is the #1 reason fields don't appear in Content Manager!**

In Strapi Admin:

1. **Settings** → **Config Sync**
2. Click **"Export"** button
3. Wait for success message

**Why this is critical:**

- Schema changes update the Content-Type Builder ✅
- But Content Manager needs Config Sync export to see new fields ❌
- Without export, field shows in Builder but NOT in Content Manager!

**File updated:**

```
apps/strapi/config/sync/
  core-store.plugin_content_manager_configuration_components##elements.your-component.json
```

**4. Regenerate Types**

```powershell
cd apps\strapi
yarn generate:types
```

**5. Update Frontend Component (if needed)**

Add logic for new field:

```tsx
export function StrapiMarqueeLogo({
  component,
}: {
  component: Data.Component<"elements.marquee-logo">
}) {
  // ✅ Access new field (TypeScript now knows about it!)
  const showBackground = component.showBackground ?? false

  return (
    <div className={showBackground ? "bg-muted p-4 rounded-lg" : ""}>
      {/* ... */}
    </div>
  )
}
```

**6. Test in Content Manager**

1. Go to Content Manager
2. Open any existing content using this component
3. ✅ New field should appear
4. Toggle/fill new field
5. Save and publish

**7. Verify on Frontend**

Check that new field's functionality works as expected.

---

### Common Modification Scenarios

**A) Adding/Changing Enumeration Values** ⚠️ **MOST COMMON**

Example: Adding "bordered" to existing backgroundStyle enum:

```json
{
  "backgroundStyle": {
    "type": "enumeration",
    "enum": ["solid", "transparent", "muted", "bordered"], // ✅ Added "bordered"
    "default": "solid"
  }
}
```

**Critical Steps:**

1. Edit schema JSON to add/modify enum values
2. **Run `yarn build` in apps/strapi directory** ⚠️ **REQUIRED!**
   ```powershell
   cd apps\strapi
   yarn build
   ```
3. Regenerate types
   ```powershell
   yarn generate:types
   ```
4. Update frontend component to handle new value
5. Hard refresh browser (Ctrl+Shift+R)
6. Test new option appears in dropdown

**Why `yarn build` is required:**

- Simply editing JSON and restarting doesn't update the admin UI
- `yarn build` rebuilds the admin panel with the new schema
- Without this, the dropdown won't show the new option

**B) Adding Optional Field**

```json
{
  "newField": {
    "type": "string",
    "required": false, // ✅ Optional
    "default": ""
  }
}
```

- Export Config Sync
- Regenerate types
- Update frontend with `??` fallback
- Test

**C) Adding Required Field to Existing Component**

```json
{
  "newField": {
    "type": "string",
    "required": true // ⚠️ Will break existing entries!
  }
}
```

**⚠️ Problem:** Existing content entries don't have this field!

**Solution:**

1. Make it optional first:
   ```json
   "required": false
   ```
2. Export Config Sync
3. Update all existing content entries manually
4. Then change to `required: true` if needed

**D) Removing Field**

```json
{
  "attributes": {
    "oldField": { ... }  // ❌ Delete this line
  }
}
```

1. Delete field from schema
2. Export Config Sync
3. Regenerate types
4. Remove field usage from frontend component
5. **Note:** Data remains in database but won't be accessible

**E) Changing Field Type**

**⚠️ Dangerous! Can cause data loss!**

Example: Changing `string` to `integer`

```json
{
  "price": {
    "type": "string"  // ❌ Old
    "type": "integer" // ✅ New
  }
}
```

**Safer approach:**

1. Create new field with new type: `priceNew`
2. Manually migrate data in Content Manager
3. Delete old field after migration
4. Rename new field if needed

---

### Checklist for Modifying Components

- [ ] 1. Modify schema JSON file
- [ ] 2. Wait for Strapi to rebuild (check terminal)
- [ ] 3. **Rebuild Strapi Admin Panel** ⚠️ **CRITICAL FOR ENUM CHANGES**
  ```powershell
  cd apps\strapi
  yarn build
  ```
- [ ] 4. **Export Config Sync in Strapi Admin** (for new fields only)
- [ ] 5. Regenerate TypeScript types
  ```powershell
  cd apps\strapi
  yarn generate:types
  ```
- [ ] 6. Clear Strapi cache (if needed)
  ```powershell
  Remove-Item -Path ".\apps\strapi\.tmp" -Recurse -Force
  Remove-Item -Path ".\apps\strapi\.cache" -Recurse -Force
  ```
- [ ] 7. Update frontend component code
- [ ] 8. Hard refresh browser (Ctrl+Shift+R)
- [ ] 9. Test in Content Manager (field/option appears)
- [ ] 10. Update existing content entries (if needed)
- [ ] 11. Test on frontend (functionality works)
- [ ] 12. Commit changes (schema + sync files + frontend)

---

### Troubleshooting Modifications

**Issue:** New enum value doesn't appear in Content Manager dropdown

**Solution:**

1. Check schema JSON is saved with new enum value
2. **Run `yarn build` in apps/strapi** ⚠️ **CRITICAL - Most common fix for enum changes!**
3. Hard refresh browser (Ctrl+Shift+R)
4. If still not working, clear cache and restart Strapi

**Issue:** New field doesn't appear in Content Manager

**Solution:**

1. Check schema JSON is saved
2. **Export Config Sync** (most common fix!)
3. Hard refresh browser (Ctrl+Shift+R)
4. Check `apps/strapi/config/sync/` for updated file

**Issue:** TypeScript errors about missing property

**Solution:**

```powershell
cd apps\strapi
yarn generate:types
```

**Issue:** Existing content broken after adding required field

**Solution:**

1. Change field to optional in schema
2. Export Config Sync
3. Update all existing entries
4. Then change to required (optional)

---

## 🎓 Key Takeaways

1. **Always complete backend first** - Don't touch frontend until types are generated
2. **Two critical steps often missed:**
   - Adding component to Page dynamic zone
   - Adding component to populate middleware
3. **When modifying components: ALWAYS export Config Sync** - #1 reason fields don't appear!
4. **Type safety is your friend** - Use TypeScript properly, avoid `any`
5. **Test thoroughly** - Don't skip Phase 4
6. **Commit early, commit often** - Git is your safety net

---

## 📚 Additional Resources

- [Strapi Components Documentation](https://docs.strapi.io/dev-docs/backend-customization/models#components)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

**Last Updated:** November 6, 2025  
**Version:** 1.0  
**For:** Strapi v5.29.0 + Next.js v15 Monorepo

**Questions?** Review the example walkthrough or check existing components in the codebase.
