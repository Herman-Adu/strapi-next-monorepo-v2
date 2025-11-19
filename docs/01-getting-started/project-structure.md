# 📁 Component Development File Map

> Visual guide showing which files to create/edit in each phase

---

## 🗺️ Phase-by-Phase File Map

### Phase 1: Backend Setup (Strapi)

```
apps/strapi/
├── src/
│   ├── components/
│   │   ├── elements/
│   │   │   └── ✏️ your-element.json          ← CREATE (Step 1.1)
│   │   └── sections/
│   │       └── ✏️ your-section.json          ← CREATE (Step 1.2)
│   │
│   ├── api/
│   │   └── page/
│   │       └── content-types/
│   │           └── page/
│   │               └── 📝 schema.json        ← EDIT (Step 1.3) ⚠️ CRITICAL
│   │
│   └── documentMiddlewares/
│       └── 📝 page.ts                        ← EDIT (Step 1.4) ⚠️ CRITICAL
│
└── config/
    └── sync/
        └── ✅ [auto-generated].json           ← VERIFY (Step 1.7)
```

---

### Phase 2: Type Generation

```
apps/strapi/
├── types/
│   └── generated/
│       └── ✅ contentTypes.d.ts               ← AUTO-GENERATED
│
└── src/
    └── documentMiddlewares/
        └── 📝 page.ts                         ← EDIT (remove `as any`)
```

---

### Phase 3: Frontend Implementation

```
apps/ui/
└── src/
    └── components/
        └── page-builder/
            ├── components/
            │   ├── elements/
            │   │   └── ✏️ StrapiYourElement.tsx     ← CREATE (Step 3.1)
            │   └── sections/
            │       └── ✏️ StrapiYourSection.tsx     ← CREATE (Step 3.2)
            │
            └── 📝 index.tsx                          ← EDIT (Step 3.3) ⚠️ CRITICAL
```

---

### Phase 4: Testing & Validation

```
No new files created - only testing existing work

✅ Check Strapi Admin UI (component picker)
✅ Check browser DevTools (API response)
✅ Check frontend rendering
✅ Commit to Git
```

---

## 📋 Complete File Checklist

### Files to CREATE

- [ ] `apps/strapi/src/components/elements/<your-element>.json`
- [ ] `apps/strapi/src/components/sections/<your-section>.json`
- [ ] `apps/ui/src/components/page-builder/components/elements/StrapiYourElement.tsx`
- [ ] `apps/ui/src/components/page-builder/components/sections/StrapiYourSection.tsx`

### Files to EDIT

- [ ] `apps/strapi/src/api/page/content-types/page/schema.json` ⚠️
- [ ] `apps/strapi/src/documentMiddlewares/page.ts` ⚠️
- [ ] `apps/ui/src/components/page-builder/index.tsx` ⚠️

### Files AUTO-GENERATED

- [ ] `apps/strapi/types/generated/contentTypes.d.ts`
- [ ] `apps/strapi/config/sync/core-store.plugin_content_manager_configuration_*.json`

---

## 🔍 Detailed File Modifications

### File 1: Element Schema (Optional)

**Path:** `apps/strapi/src/components/elements/testimonial-card.json`

**Action:** CREATE

**Purpose:** Define repeatable sub-component structure

**Example:**

```json
{
  "collectionName": "components_elements_testimonial_cards",
  "info": {
    "displayName": "Testimonial Card",
    "description": "Customer testimonial with quote and author"
  },
  "options": {},
  "attributes": {
    "quote": { "type": "text", "required": true },
    "authorName": { "type": "string", "required": true },
    "authorPhoto": {
      "type": "media",
      "allowedTypes": ["images"]
    }
  }
}
```

---

### File 2: Section Schema

**Path:** `apps/strapi/src/components/sections/testimonials-section.json`

**Action:** CREATE

**Purpose:** Define main section component structure

**Example:**

```json
{
  "collectionName": "components_sections_testimonials_sections",
  "info": {
    "displayName": "Testimonials Section",
    "description": "Display customer testimonials"
  },
  "options": {},
  "attributes": {
    "heading": { "type": "string", "required": true },
    "description": { "type": "text" },
    "testimonials": {
      "type": "component",
      "repeatable": true,
      "component": "elements.testimonial-card"
    }
  }
}
```

---

### File 3: Page Schema (Dynamic Zone)

**Path:** `apps/strapi/src/api/page/content-types/page/schema.json`

**Action:** EDIT - Add component to array

**Purpose:** Make component available in component picker

**Find this section:**

```json
{
  "attributes": {
    "content": {
      "type": "dynamiczone",
      "components": [
        "sections.hero",
        "sections.benefits-section",
        // ... existing components ...
```

**Add your component:**

```json
        "sections.testimonials-section",  // ← ADD THIS LINE
        "forms.newsletter-form"
```

**⚠️ CRITICAL:** Without this, component won't appear in picker!

---

### File 4: Populate Middleware

**Path:** `apps/strapi/src/documentMiddlewares/page.ts`

**Action:** EDIT - Add populate configuration

**Purpose:** Load nested data from API

**Find this section:**

```typescript
const pagePopulateObject: FindOne<"api::page.page">["populate"] = {
  content: {
    on: {
      "sections.hero": { populate: { ... } },
      // ... existing components ...
```

**Add your component:**

```typescript
      "sections.testimonials-section": {
        populate: {
          testimonials: {
            populate: {
              authorPhoto: { populate: { media: true } },
            },
          },
        },
      },
```

**⚠️ CRITICAL:** Without this, data will be empty on frontend!

**Temporary Fix (if TypeScript errors):**

```typescript
} as any  // ← Add temporarily, remove in Phase 2
```

---

### File 5: Element React Component

**Path:** `apps/ui/src/components/page-builder/components/elements/StrapiTestimonialCard.tsx`

**Action:** CREATE

**Purpose:** Render element on frontend

**Template:**

```tsx
import { Data } from "@repo/strapi"

export function StrapiTestimonialCard({
  component,
}: {
  readonly component: Data.Component<"elements.testimonial-card">
}) {
  const quote = component.quote ?? ""
  const authorName = component.authorName ?? "Anonymous"

  return (
    <div className="bg-card rounded-lg border p-6">
      <p className="italic">"{quote}"</p>
      <p className="font-semibold">{authorName}</p>
    </div>
  )
}

StrapiTestimonialCard.displayName = "StrapiTestimonialCard"
export default StrapiTestimonialCard
```

---

### File 6: Section React Component

**Path:** `apps/ui/src/components/page-builder/components/sections/StrapiTestimonialsSection.tsx`

**Action:** CREATE

**Purpose:** Render section on frontend

**Template:**

```tsx
import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"

import { StrapiTestimonialCard } from "../elements/StrapiTestimonialCard"

export function StrapiTestimonialsSection({
  component,
}: {
  readonly component: Data.Component<"sections.testimonials-section">
}) {
  const heading = component.heading ?? "Testimonials"
  const testimonials = component.testimonials ?? []

  if (testimonials.length === 0) return null

  return (
    <section className="py-20">
      <Container>
        <h2 className="mb-8 text-4xl font-bold">{heading}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <StrapiTestimonialCard key={item.id ?? index} component={item} />
          ))}
        </div>
      </Container>
    </section>
  )
}

StrapiTestimonialsSection.displayName = "StrapiTestimonialsSection"
export default StrapiTestimonialsSection
```

---

### File 7: Page Builder Registration

**Path:** `apps/ui/src/components/page-builder/index.tsx`

**Action:** EDIT - Import and register components

**Purpose:** Map Strapi UID to React component

**Step 1 - Add imports at top:**

```tsx
import StrapiTestimonialCard from "./components/elements/StrapiTestimonialCard"
import StrapiTestimonialsSection from "./components/sections/StrapiTestimonialsSection"
```

**Step 2 - Add to mapping object:**

```tsx
export const PageContentComponents: {
  [K in UID.Component]?: React.ComponentType<any>
} = {
  // Elements
  "elements.testimonial-card": StrapiTestimonialCard,

  // Sections
  "sections.testimonials-section": StrapiTestimonialsSection,

  // ... rest of components ...
}
```

**⚠️ CRITICAL:** UIDs must match schema exactly (case-sensitive!)

---

## 🎯 Quick Navigation

**Need to know:**

- **Which files to create?** → See "Files to CREATE" checklist above
- **Which files to edit?** → See "Files to EDIT" checklist above (3 critical ones marked with ⚠️)
- **Where to add component to picker?** → File 3 (Page Schema)
- **Where to add populate config?** → File 4 (Populate Middleware)
- **Where to register React components?** → File 7 (Page Builder Index)

---

## 🚨 The 3 Critical Files

If your component isn't working, check these 3 files FIRST:

### 1. Page Schema (Dynamic Zone)

**File:** `apps/strapi/src/api/page/content-types/page/schema.json`

**Check:** Component UID in `content.components` array?

**Symptom if missing:** Component not in picker

---

### 2. Populate Middleware

**File:** `apps/strapi/src/documentMiddlewares/page.ts`

**Check:** Populate configuration in `content.on` object?

**Symptom if missing:** Data empty on frontend

---

### 3. Page Builder Registration

**File:** `apps/ui/src/components/page-builder/index.tsx`

**Check:** Component imported and mapped with correct UID?

**Symptom if missing:** Component doesn't render

---

## 📊 File Creation Order

```
1. Element Schema (JSON)
2. Section Schema (JSON)
3. Page Schema (add to array)        ← CRITICAL
4. Populate Middleware (add config)  ← CRITICAL
5. Export Config Sync
6. Generate Types
7. Element Component (TSX)
8. Section Component (TSX)
9. Page Builder Registration         ← CRITICAL
10. Test Everything
```

**Follow this order to avoid issues!**

---

## ✅ Verification Checklist

After each phase, verify these files:

### After Phase 1 (Backend)

- [ ] Element JSON exists in `apps/strapi/src/components/elements/`
- [ ] Section JSON exists in `apps/strapi/src/components/sections/`
- [ ] Component UID in Page schema `components` array
- [ ] Populate config in `documentMiddlewares/page.ts`
- [ ] Sync files in `apps/strapi/config/sync/`

### After Phase 2 (Types)

- [ ] Types exist in `apps/strapi/types/generated/contentTypes.d.ts`
- [ ] No `as any` in middleware file

### After Phase 3 (Frontend)

- [ ] Element TSX in `apps/ui/src/components/page-builder/components/elements/`
- [ ] Section TSX in `apps/ui/src/components/page-builder/components/sections/`
- [ ] Components imported in `page-builder/index.tsx`
- [ ] Components mapped with correct UIDs

### After Phase 4 (Testing)

- [ ] All files committed to Git
- [ ] Config sync files committed

---

**Last Updated:** November 6, 2025  
**Version:** 1.0
