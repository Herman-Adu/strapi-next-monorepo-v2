# 🚀 Component Development - Complete Guide

**Created**: November 18, 2025  
**Last Updated**: November 18, 2025  
**Status**: ✅ Current (Consolidated from 4 source documents)  
**Audience**: Developers

---

## 📖 PURPOSE

This is the **single source of truth** for component development in our Strapi + Next.js monorepo. It consolidates:

- Component Development Guide (architecture & examples)
- Component Workflow (step-by-step process)
- Component Integration Guide (mapping & registration)
- Shared Component Guide (reusable patterns)

---

## 🎯 QUICK START

### For New Components

1. **Backend First** (Strapi schemas) - 15 min
2. **Generate Types** - 2 min
3. **Frontend Implementation** (React) - 30 min
4. **Register & Test** - 10 min

### Golden Rule

**✅ ALWAYS COMPLETE BACKEND FIRST, THEN FRONTEND**

```
Backend (Data Structure) → Type Generation → Frontend (Presentation) → Testing
```

---

## 📚 TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [Component Types](#component-types)
3. [Development Workflow](#development-workflow)
4. [Phase 1: Backend Setup](#phase-1-backend-setup)
5. [Phase 2: Type Generation](#phase-2-type-generation)
6. [Phase 3: Frontend Implementation](#phase-3-frontend-implementation)
7. [Phase 4: Registration & Mapping](#phase-4-registration--mapping)
8. [Shared Component Patterns](#shared-component-patterns)
9. [Testing & Validation](#testing--validation)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)

---

## 🏗️ ARCHITECTURE OVERVIEW

### File Structure

```
apps/
├── strapi/                           # Backend CMS
│   ├── src/
│   │   ├── components/               # Strapi component schemas
│   │   │   ├── elements/            # Reusable UI elements
│   │   │   ├── forms/               # Form components
│   │   │   ├── sections/            # Page sections
│   │   │   ├── atoms/               # Design atoms (text styles, etc.)
│   │   │   └── utilities/           # Utility components
│   │   ├── api/                     # Content types & APIs
│   │   │   └── page/                # Page content type
│   │   └── documentMiddlewares/     # Auto-populate logic
│   └── types/generated/             # Auto-generated TypeScript types
│
└── ui/                              # Frontend Next.js app
    └── src/
        └── components/
            ├── page-builder/
            │   ├── components/
            │   │   ├── elements/    # Frontend element components
            │   │   ├── forms/       # Frontend form components
            │   │   ├── sections/    # Frontend section components
            │   │   └── utilities/   # Frontend utility components
            │   ├── shared/          # Shared components (SectionHeader, etc.)
            │   ├── atoms/           # Atomic components (TextStyle, etc.)
            │   └── index.tsx        # Component mapping registry
            └── elementary/          # Base UI components
```

### Data Flow

```
Content Manager (Strapi Admin)
    ↓
Strapi API (with auto-populate)
    ↓
Next.js API Route (/api/pages)
    ↓
Page Builder (component mapping)
    ↓
React Component (renders UI)
```

---

## 🧩 COMPONENT TYPES

### 1. Elements

**Purpose**: Small, reusable UI pieces  
**Examples**: Buttons, cards, logos, badges, list items  
**Location**: `components/elements/`  
**Reusable**: ✅ Can be used in multiple sections

### 2. Sections

**Purpose**: Large page sections  
**Examples**: Hero, features, testimonials, FAQ  
**Location**: `components/sections/`  
**Reusable**: ✅ Can be added to any page

### 3. Forms

**Purpose**: Interactive forms  
**Examples**: Contact, newsletter, login, signup  
**Location**: `components/forms/`  
**Special**: Often includes validation & submission logic

### 4. Atoms

**Purpose**: Design system atoms  
**Examples**: Text styles, gradient configs, spacing  
**Location**: `components/atoms/`  
**Special**: Referenced by other components

### 5. Utilities

**Purpose**: Helper/wrapper components  
**Examples**: Rich text, images, links, SEO  
**Location**: `components/utilities/`  
**Special**: Often wrap content or handle formatting

---

## 🔄 DEVELOPMENT WORKFLOW

### Complete Process (4 Phases)

```
Phase 1: Backend Setup (15 min)
  ├── Create element schemas (if needed)
  ├── Create section/form schema
  ├── Add to Page dynamic zone
  ├── Configure auto-populate
  └── Export config sync

Phase 2: Type Generation (2 min)
  ├── Generate TypeScript types
  ├── Verify types in generated files
  └── Check IDE autocomplete

Phase 3: Frontend Implementation (30 min)
  ├── Create React component
  ├── Import generated types
  ├── Implement UI logic
  └── Style with Tailwind

Phase 4: Registration & Testing (10 min)
  ├── Register in component mapping
  ├── Test in Strapi admin
  ├── Verify frontend rendering
  └── Check responsive & dark mode
```

---

## 🔧 PHASE 1: BACKEND SETUP

### Prerequisites

```powershell
# Ensure Strapi is running
cd apps/strapi
yarn dev
```

### Step 1.1: Create Element Schema (If Needed)

**When**: Your section needs repeatable sub-components (cards, items, etc.)

**Location**: `apps/strapi/src/components/elements/<name>.json`

**Example**: Testimonial Card

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
    "author": {
      "type": "string",
      "required": true
    },
    "role": {
      "type": "string"
    },
    "company": {
      "type": "string"
    },
    "rating": {
      "type": "integer",
      "min": 1,
      "max": 5,
      "default": 5
    },
    "image": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    }
  }
}
```

**Naming Convention**:

- File: `kebab-case.json` (e.g., `testimonial-card.json`)
- Collection: `components_category_plural` (e.g., `components_elements_testimonial_cards`)
- Display Name: "Title Case" (e.g., "Testimonial Card")

### Step 1.2: Create Section/Form Schema

**Location**: `apps/strapi/src/components/sections/<name>.json` or `forms/<name>.json`

**Example**: Testimonials Section

```json
{
  "collectionName": "components_sections_testimonials_sections",
  "info": {
    "displayName": "Testimonials Section",
    "description": "Customer testimonials carousel or grid"
  },
  "options": {},
  "attributes": {
    "heading": {
      "type": "component",
      "repeatable": false,
      "component": "atoms.section-heading"
    },
    "testimonials": {
      "type": "component",
      "repeatable": true,
      "component": "elements.testimonial-card",
      "required": true,
      "min": 1
    },
    "layout": {
      "type": "enumeration",
      "enum": ["grid", "carousel", "marquee"],
      "default": "grid"
    },
    "backgroundColor": {
      "type": "enumeration",
      "enum": ["default", "muted", "accent"],
      "default": "default"
    }
  }
}
```

**Key Patterns**:

- **Heading**: Use `atoms.section-heading` for consistency
- **Repeatable components**: Use `repeatable: true` for lists
- **Enums**: Use for fixed options (layout, colors, etc.)
- **Required fields**: Mark critical fields as `required: true`

### Step 1.3: Add to Page Dynamic Zone

**File**: `apps/strapi/src/api/page/content-types/page/schema.json`

Find the `contentSections` attribute and add your new component:

```json
{
  "contentSections": {
    "type": "dynamiczone",
    "components": [
      // ... existing components
      "sections.testimonials-section" // Add this line
    ]
  }
}
```

**⚠️ Important**: Restart Strapi after modifying `page/schema.json`

### Step 1.4: Configure Auto-Populate

**File**: `apps/strapi/src/documentMiddlewares/page.ts`

Add your component to the populate configuration:

```typescript
case "sections.testimonials-section":
  return {
    heading: true,
    testimonials: {
      populate: {
        image: {
          fields: ["url", "alternativeText", "width", "height"],
        },
      },
    },
  }
```

**Why**: Ensures component data (including media) is automatically fetched

### Step 1.5: Export Config Sync

**In Strapi Admin**:

1. Settings → Config Sync → EXPORT
2. Verify new files created in `apps/strapi/config/sync/`
3. Commit to version control

**Purpose**: Tracks schema changes, enables team sync

---

## ⚙️ PHASE 2: TYPE GENERATION

### Step 2.1: Generate Types

```powershell
cd apps/strapi
yarn generate:types
```

**Output**: Updates `apps/strapi/types/generated/components.d.ts`

### Step 2.2: Verify Types

Check the generated types:

```typescript
// apps/strapi/types/generated/components.d.ts

export interface SectionsTestimonialsSection extends Struct.ComponentSchema {
  collectionName: "components_sections_testimonials_sections"
  info: {
    displayName: "Testimonials Section"
    description: "Customer testimonials carousel or grid"
  }
  attributes: {
    heading: Schema.Attribute.Component<"atoms.section-heading", false>
    testimonials: Schema.Attribute.Component<
      "elements.testimonial-card",
      true
    > &
      Schema.Attribute.Required
    layout: Schema.Attribute.Enumeration<["grid", "carousel", "marquee"]> &
      Schema.Attribute.DefaultTo<"grid">
    backgroundColor: Schema.Attribute.Enumeration<
      ["default", "muted", "accent"]
    > &
      Schema.Attribute.DefaultTo<"default">
  }
}
```

### Step 2.3: Check IDE Autocomplete

In your IDE (VS Code), type `Data.Component<"sections.` and verify your new component appears in autocomplete.

**✅ Success**: Type is available  
**❌ Failure**: Re-run type generation, check for errors

---

## ⚛️ PHASE 3: FRONTEND IMPLEMENTATION

### Step 3.1: Create React Component

**Location**: `apps/ui/src/components/page-builder/components/sections/<name>.tsx`

**Naming Convention**:

- File: `PascalCase.tsx` (e.g., `StrapiTestimonialsSection.tsx`)
- Component: Prefix with `Strapi` (e.g., `StrapiTestimonialsSection`)

**Example**:

```typescript
import { Data } from "@/types/strapi"
import { SectionHeader } from "../../shared/SectionHeader"
import { TestimonialCard } from "../elements/TestimonialCard"

interface StrapiTestimonialsSectionProps {
  component: Data.Component<"sections.testimonials-section">
}

export function StrapiTestimonialsSection({
  component,
}: StrapiTestimonialsSectionProps) {
  const { heading, testimonials, layout = "grid" } = component

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header (shared component) */}
        {heading && (
          <SectionHeader
            heading={heading.heading}
            description={heading.description}
            textStyle={heading.textStyle}
            showDivider={heading.showDivider}
            alignment={heading.alignment}
          />
        )}

        {/* Testimonials Grid/Carousel */}
        <div
          className={
            layout === "grid"
              ? "mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              : "mt-12 flex gap-8 overflow-x-auto"
          }
        >
          {testimonials?.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Key Patterns**:

- **Type safety**: Use `Data.Component<"component.name">`
- **Destructuring**: Extract props with defaults
- **Shared components**: Use SectionHeader for consistency
- **Conditional rendering**: Check for optional fields
- **Responsive design**: Use Tailwind breakpoints

### Step 3.2: Create Element Component (If Needed)

**Location**: `apps/ui/src/components/page-builder/components/elements/<name>.tsx`

```typescript
import { Data } from "@/types/strapi"
import Image from "next/image"

interface TestimonialCardProps {
  testimonial: Data.Component<"elements.testimonial-card">
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { quote, author, role, company, rating, image } = testimonial

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      {/* Rating */}
      {rating && (
        <div className="mb-4 flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <span key={i} className="text-yellow-400">
              ★
            </span>
          ))}
        </div>
      )}

      {/* Quote */}
      <p className="mb-4 text-muted-foreground italic">&ldquo;{quote}&rdquo;</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {image && (
          <Image
            src={image.url}
            alt={image.alternativeText || author}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
        <div>
          <p className="font-semibold">{author}</p>
          {role && <p className="text-sm text-muted-foreground">{role}</p>}
          {company && (
            <p className="text-sm text-muted-foreground">{company}</p>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## 🗺️ PHASE 4: REGISTRATION & MAPPING

### Step 4.1: Register Component

**File**: `apps/ui/src/components/page-builder/index.tsx`

Add import and mapping entry:

```typescript
// Import
import { StrapiTestimonialsSection } from "./components/sections/StrapiTestimonialsSection"

// Component Mapping
const componentMap: ComponentMap = {
  // ... existing components
  "sections.testimonials-section": StrapiTestimonialsSection,
}
```

**⚠️ Critical**: The key must exactly match the Strapi component name

### Step 4.2: Verify Mapping

**Check**:

1. No TypeScript errors
2. Component appears in autocomplete
3. Hot reload works

**Common Issues**:

- Typo in component name
- Missing import
- Wrong file path

---

## 🔁 SHARED COMPONENT PATTERNS

### SectionHeader (Most Common)

**Use this for**:

- Consistent section headings
- Text style support (default, two-tone, gradient)
- Smart dividers
- Flexible alignment

**Example**:

```typescript
import { SectionHeader } from "../../shared/SectionHeader"

<SectionHeader
  heading={heading.heading}
  description={heading.description}
  textStyle={heading.textStyle}
  showDivider={heading.showDivider}
  alignment={heading.alignment}
/>
```

**Why**: Ensures visual consistency, reduces code duplication

### SectionWrapper

**Use this for**:

- Consistent padding/spacing
- Background variants
- Container widths
- Dark mode support

```typescript
import { SectionWrapper } from "../../shared/SectionWrapper"

<SectionWrapper
  padding="large"
  background="muted"
  maxWidth="xl"
>
  {/* Your content */}
</SectionWrapper>
```

### SectionBadge

**Use this for**:

- Section labels ("Features", "Testimonials", etc.)
- Above-heading badges
- Consistent styling

```typescript
import { SectionBadge } from "../../shared/SectionBadge"

<SectionBadge>{component.badge}</SectionBadge>
```

---

## ✅ TESTING & VALIDATION

### Step 1: Test in Strapi Admin

1. Open Strapi admin
2. Go to Content Manager → Pages
3. Create/Edit a page
4. Add your new component to contentSections
5. Fill in all fields
6. Save & Publish

**Check**:

- All fields appear correctly
- Validation works (required fields)
- Media uploads work
- Config saves properly

### Step 2: Test Frontend Rendering

1. Open Next.js app (`http://localhost:3000`)
2. Navigate to the page with your component
3. Verify component renders
4. Check responsive behavior
5. Test dark mode

**Check**:

- No console errors
- Data displays correctly
- Images load
- Styling looks good
- Mobile responsive
- Dark mode works

### Step 3: Test Edge Cases

**Test**:

- Empty states (no data)
- Missing optional fields
- Maximum content (long text)
- Multiple instances on same page
- Different layout options

---

## 🐛 TROUBLESHOOTING

### "Component not found" Error

**Cause**: Component not registered in mapping  
**Fix**: Check `apps/ui/src/components/page-builder/index.tsx`

### TypeScript Errors

**Cause**: Types not generated or stale  
**Fix**: Run `cd apps/strapi && yarn generate:types`

### Component Doesn't Appear in Strapi

**Cause**: Not added to Page dynamic zone  
**Fix**: Check `page/schema.json` and restart Strapi

### Data Not Populating

**Cause**: Missing auto-populate configuration  
**Fix**: Add to `documentMiddlewares/page.ts`

### Styles Not Applying

**Cause**: Tailwind classes not recognized  
**Fix**: Check Tailwind config, restart dev server

---

## 🎯 BEST PRACTICES

### DO ✅

1. **Backend first, always** - Complete Strapi schemas before frontend
2. **Generate types after schema changes** - Keep types in sync
3. **Use shared components** - SectionHeader, SectionWrapper, etc.
4. **Type everything** - Use generated types, avoid `any`
5. **Test responsive** - Mobile, tablet, desktop
6. **Handle edge cases** - Empty states, missing data
7. **Export config sync** - Track schema changes in git
8. **Document customizations** - Add comments for complex logic

### DON'T ❌

1. **Don't skip type generation** - Leads to runtime errors
2. **Don't modify generated types** - They're overwritten
3. **Don't hardcode data** - Use props from Strapi
4. **Don't forget dark mode** - Test both themes
5. **Don't skip validation** - Mark required fields
6. **Don't duplicate logic** - Use shared components
7. **Don't commit without testing** - Always verify in browser
8. **Don't forget mobile** - Most users are mobile-first

---

## 📊 COMPONENT CHECKLIST

Use this for every new component:

**Backend (Strapi)**:

- [ ] Element schema created (if needed)
- [ ] Section/Form schema created
- [ ] Added to Page dynamic zone
- [ ] Auto-populate configured
- [ ] Config sync exported
- [ ] Strapi restarted (if needed)

**Types**:

- [ ] Types generated
- [ ] Types verified in IDE
- [ ] Autocomplete working

**Frontend**:

- [ ] React component created
- [ ] Element component created (if needed)
- [ ] Proper TypeScript types used
- [ ] Shared components used
- [ ] Responsive styling applied
- [ ] Dark mode tested

**Registration**:

- [ ] Component imported
- [ ] Mapping entry added
- [ ] No TypeScript errors

**Testing**:

- [ ] Works in Strapi admin
- [ ] Renders on frontend
- [ ] Responsive works
- [ ] Dark mode works
- [ ] Edge cases handled

**Deployment**:

- [ ] Committed to git
- [ ] Clean build passes
- [ ] Deployed to staging
- [ ] Verified in production

---

## 🚀 QUICK REFERENCE

### Common Commands

```powershell
# Generate types
cd apps/strapi && yarn generate:types

# Start dev servers
yarn dev

# Build both apps
yarn build

# Clean build
Remove-Item -Recurse -Force apps/ui/.next
Remove-Item -Recurse -Force apps/strapi/dist
yarn build
```

### File Locations

- Strapi schemas: `apps/strapi/src/components/`
- React components: `apps/ui/src/components/page-builder/components/`
- Component mapping: `apps/ui/src/components/page-builder/index.tsx`
- Auto-populate: `apps/strapi/src/documentMiddlewares/page.ts`
- Page schema: `apps/strapi/src/api/page/content-types/page/schema.json`

### Component Naming

| Type       | Strapi                        | Frontend         |
| ---------- | ----------------------------- | ---------------- |
| File       | `kebab-case.json`             | `PascalCase.tsx` |
| Component  | `category.name`               | `StrapiName`     |
| Collection | `components_category_plurals` | N/A              |

---

## 📚 RELATED DOCUMENTATION

- **Styling Guide**: `docs/05-styling/styling-complete-guide.md`
- **Testing Strategy**: `docs/07-testing/strategy.md`
- **Build Workflow**: `docs/06-workflows/build-commit-push.md`
- **Troubleshooting**: `docs/09-troubleshooting/playbook.md`
- **Strapi Best Practices**: `docs/03-strapi/best-practices.md`

---

**This is the single source of truth for component development.** Follow this guide for consistent, error-free component creation every time! 🎯
