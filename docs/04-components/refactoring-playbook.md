# Component Refactoring Playbook

> **Complete Step-by-Step Guide**: How to refactor existing sections to use atomic components, shared components, and uniform spacing architecture. Based on Newsletter CTA Section refactoring (November 2025).

**Last Updated:** November 14, 2025  
**Status:** ✅ Production Pattern  
**Example Component:** Newsletter CTA Section

---

## Table of Contents

1. [Overview & Goals](#overview--goals)
2. [Pre-Refactor Checklist](#pre-refactor-checklist)
3. [Phase 1: Strapi Backend (Schema)](#phase-1-strapi-backend-schema)
4. [Phase 2: Strapi Backend (Populate)](#phase-2-strapi-backend-populate)
5. [Phase 3: Verify Strapi Build](#phase-3-verify-strapi-build)
6. [Phase 4: Frontend Implementation](#phase-4-frontend-implementation)
7. [Phase 5: Verify UI Build](#phase-5-verify-ui-build)
8. [Phase 6: Testing & Validation](#phase-6-testing--validation)
9. [Phase 7: Documentation](#phase-7-documentation)
10. [Common Patterns Reference](#common-patterns-reference)
11. [Troubleshooting](#troubleshooting)

---

## Overview & Goals

### What We're Refactoring

Taking existing monolithic section components and breaking them into:

1. **Atomic components** - Reusable primitives (TextStyle, OrbAnimation, gradient-colors)
2. **Shared components** - Common patterns (SectionBadge, SectionHeader, SectionWrapper)
3. **Uniform spacing** - Gap-based architecture with content manager control
4. **Consistent styling** - Container queries, no hardcoded margins, theme integration

### Benefits

✅ **Reusability** - Write once, use everywhere  
✅ **Consistency** - Same patterns across all sections  
✅ **Maintainability** - Fix once, fixes everywhere  
✅ **Content Manager Control** - Spacing, styling, visibility all configurable  
✅ **Type Safety** - Full TypeScript support with generated types  
✅ **Dark Mode** - Automatic support via theme system

---

## Pre-Refactor Checklist

Before touching any code:

- [ ] **Document current state** - Screenshots, behavior notes
- [ ] **Identify reusable parts** - Badge, header, common patterns
- [ ] **List atomic components needed** - TextStyle, OrbAnimation, etc.
- [ ] **Plan spacing architecture** - Uniform gaps vs internal spacing
- [ ] **Check existing schemas** - What can be reused?
- [ ] **Create git branch** - `git checkout -b refactor/component-name`
- [ ] **Read related docs** - SPACING_ARCHITECTURE_GUIDE.md, COMPONENT_INTEGRATION_GUIDE.md

---

## Phase 1: Strapi Backend (Schema)

**Critical Rule:** ALWAYS start with Strapi backend. Never touch frontend first.

### Step 1.1: Identify Shared Components Needed

**Example from Newsletter CTA:**

- ✅ `shared.section-badge` - Existing, can reuse
- ✅ `shared.section-header` - Existing, can reuse
- ✅ `shared.section-background` - Existing, can reuse
- ⚠️ `atoms.text-style` - Existing, but need to add to section schema
- ⚠️ `atoms.orb-animation` - Existing, but need to add to badge schema

### Step 1.2: Update Section Schema

**File:** `apps/strapi/src/components/sections/newsletter-cta-section.json`

**Add shared components:**

```json
{
  "attributes": {
    "badge": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-badge",
      "required": false,
      "description": "Optional badge above header"
    },
    "header": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-header",
      "required": false,
      "description": "Optional section header with heading and description"
    },
    "background": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-background",
      "required": false,
      "description": "Section background and container styling"
    }
  }
}
```

**Add atomic text styling for custom headings:**

```json
{
  "attributes": {
    "heading": {
      "type": "string",
      "required": true,
      "description": "Newsletter form heading. When using two-tone style, this is the second part (non-accented)"
    },
    "headingAccent": {
      "type": "string",
      "required": false,
      "description": "Accented part of heading for two-tone style. This text appears first in theme color. Leave empty for default/gradient styles."
    },
    "headingTextStyle": {
      "type": "component",
      "repeatable": false,
      "component": "atoms.text-style",
      "required": false,
      "description": "Optional text styling (gradient/two-tone) for newsletter form heading. Leave empty for default solid color."
    }
  }
}
```

### Step 1.3: Critical Schema Rules

❌ **DON'T:**

```json
// Hard-coded values
"maxWidth": { "type": "integer", "default": 1200 }

// Missing descriptions
"heading": { "type": "string" }

// No required flag clarity
"badge": { "type": "component" }
```

✅ **DO:**

```json
// Use semantic sizing
"containerWidth": {
  "type": "enumeration",
  "enum": ["default", "narrow", "wide", "full"],
  "default": "default"
}

// Clear descriptions
"heading": {
  "type": "string",
  "required": true,
  "description": "Main heading for newsletter form"
}

// Explicit required flag
"badge": {
  "type": "component",
  "repeatable": false,
  "component": "shared.section-badge",
  "required": false
}
```

### Step 1.4: Verify Schema Changes

```bash
# Check for syntax errors
cat apps/strapi/src/components/sections/newsletter-cta-section.json | jq .

# If jq not available, check file manually for:
# - Trailing commas
# - Missing quotes
# - Unclosed brackets
```

---

## Phase 2: Strapi Backend (Populate)

**Critical:** Deep populate configuration is THE most common failure point.

### Step 2.1: Locate Populate Middleware

**File:** `apps/strapi/src/documentMiddlewares/page.ts`

### Step 2.2: Add Deep Populate for Nested Components

**Pattern:** Populate to **3+ levels** for nested atomic components.

```typescript
export default () => ({
  "sections.newsletter-cta-section": {
    populate: {
      // Level 1: Direct components
      badge: {
        populate: {
          // Level 2: Nested in badge
          orbAnimation: true,
        },
      },
      header: {
        populate: {
          // Level 2: Nested in header
          textStyle: {
            populate: {
              // Level 3: Nested in textStyle
              customGradient: true,
            },
          },
          descriptionTextStyle: {
            populate: {
              customGradient: true,
            },
          },
        },
      },
      // Level 1: Direct atomic component
      headingTextStyle: {
        populate: {
          // Level 2: Nested in headingTextStyle
          customGradient: true,
        },
      },
      background: true,
      ctaButtons: true,
      benefits: true,
      gdprLink: true,
    },
  },
})
```

### Step 2.3: Populate Rule Reference

**When to populate:**

| Component Type                  | Populate Depth | Example                                                                       |
| ------------------------------- | -------------- | ----------------------------------------------------------------------------- |
| **Simple field**                | Not needed     | `heading: string`                                                             |
| **Simple component**            | Level 1        | `gdprLink: true`                                                              |
| **Component with atoms**        | Level 2        | `badge: { populate: { orbAnimation: true } }`                                 |
| **Component with nested atoms** | Level 3+       | `header: { populate: { textStyle: { populate: { customGradient: true } } } }` |

### Step 2.4: Populate Verification Checklist

- [ ] All `type: "component"` fields have populate
- [ ] Nested components populate their children
- [ ] Atomic components (atoms.\*) always populate customGradient if present
- [ ] No `populate: true` on string/text/enum fields (causes errors)
- [ ] Repeatable components use `populate: true` (not object syntax)

---

## Phase 3: Verify Strapi Build

**Never skip this step.** Broken Strapi = Broken frontend.

### Step 3.1: Build Strapi

```powershell
# Navigate to Strapi directory
cd apps/strapi

# Clean install (if dependencies changed)
yarn install

# Build Strapi
yarn build
```

### Step 3.2: Common Build Errors & Fixes

**Error 1: JSON Syntax Error**

```
SyntaxError: Unexpected token } in JSON
```

**Fix:** Check schema for trailing commas, missing quotes, unclosed brackets.

---

**Error 2: Component Not Found**

```
Component "atoms.text-style" not found
```

**Fix:** Verify component exists in `apps/strapi/src/components/atoms/text-style.json`

---

**Error 3: Type Generation Failed**

```
Error generating types
```

**Fix:** Check `apps/strapi/types/generated/components.d.ts` - delete and rebuild.

### Step 3.3: Verify Type Generation

```powershell
# Check generated types exist
ls apps/strapi/types/generated/

# Should see:
# - components.d.ts
# - contentTypes.d.ts
```

### Step 3.4: Start Strapi & Test Admin

```powershell
# Start Strapi
yarn dev

# Open admin: http://localhost:1337/admin
# Navigate to Content Manager
# Edit a page with the refactored section
# Verify all new fields appear
# Add test content to new fields
# Save successfully
```

**Test checklist:**

- [ ] Badge field shows shared.section-badge component
- [ ] Header field shows shared.section-header component
- [ ] Background field shows shared.section-background component
- [ ] headingTextStyle field shows atoms.text-style component
- [ ] All fields save without errors
- [ ] Preview shows test content

---

## Phase 4: Frontend Implementation

**Only proceed after Strapi build succeeds.**

### Step 4.1: Remove Old Hardcoded Patterns

**Before (Old Pattern):**

```tsx
// ❌ Hardcoded margins
<div className="mb-6">
  <Badge text={component.badge} />
</div>

// ❌ Hardcoded max-width
<div className="mx-auto max-w-6xl">

// ❌ Inconsistent spacing
<div className="space-y-8">
  <Header />
  <div className="mt-12">
    <Content />
  </div>
</div>
```

### Step 4.2: Implement Uniform Spacing Architecture

**After (New Pattern):**

```tsx
export function StrapiNewsletterCTASection({ component }) {
  // 1. Map spacing setting to gap classes
  const headerSpacing = component.header?.spacing ?? "default"

  const sectionGap = {
    compact: "gap-8", // 2rem
    default: "gap-12", // 3rem
    spacious: "gap-16", // 4rem
  }[headerSpacing]

  return (
    <SectionWrapper background={component.background}>
      {/* 2. Parent container with uniform gap */}
      <div className={`flex w-full flex-col ${sectionGap}`}>
        {/* 3. Shared components - NO margins */}
        <SectionBadge badge={component.badge ?? undefined} />

        {component.header && <SectionHeader header={component.header} />}

        {/* 4. Main content */}
        <div className="w-full">{/* Your custom content */}</div>
      </div>
    </SectionWrapper>
  )
}
```

### Step 4.3: Implement Atomic Text Styling

**Pattern for headings with text style support:**

```tsx
{
  component.heading &&
    (component.headingTextStyle?.textStyle === "two-tone" &&
    component.headingAccent ? (
      // Two-tone: Split into accent + heading
      <h2 className="text-3xl font-bold md:text-4xl">
        <span className="text-primary">{component.headingAccent}</span>{" "}
        <span className="text-muted-foreground dark:text-foreground">
          {component.heading}
        </span>
      </h2>
    ) : component.headingTextStyle ? (
      // Gradient or custom style
      <TextStyle
        textStyle={component.headingTextStyle}
        as="h2"
        className="text-3xl font-bold md:text-4xl"
      >
        {component.headingAccent
          ? `${component.headingAccent} ${component.heading}`
          : component.heading}
      </TextStyle>
    ) : (
      // Default solid color
      <h2 className="text-primary dark:text-foreground text-3xl font-bold md:text-4xl">
        {component.heading}
      </h2>
    ))
}
```

### Step 4.4: Container Query Patterns

**Use for component-level spacing:**

```tsx
// Responsive gaps
className = "gap-8 @2xl:gap-12 @4xl:gap-16"

// Responsive grids
className = "grid grid-cols-1 @3xl:grid-cols-2"

// Responsive padding (inside components)
className = "p-8 @2xl:p-12 @4xl:p-16"
```

**Use standard breakpoints for typography:**

```tsx
// Font sizes
className = "text-3xl md:text-4xl lg:text-5xl"

// Vertical spacing (page-level)
className = "py-16 md:py-24"
```

### Step 4.5: Critical Frontend Rules

❌ **NEVER:**

```tsx
// Hardcoded margins on reusable components
<SectionBadge className="mb-6" />

// Hardcoded max-widths
<div className="max-w-6xl">

// Mixing gap and space-y for same purpose
<div className="flex flex-col space-y-8">

// Empty divs instead of null
if (!showBadge) return <div></div>
```

✅ **ALWAYS:**

```tsx
// No margins on reusable components
<SectionBadge badge={component.badge} />

// Use SectionWrapper for width control
<SectionWrapper background={component.background}>

// Use gap for flex containers
<div className="flex flex-col gap-8">

// Return null when hidden
if (!showBadge) return null
```

---

## Phase 5: Verify UI Build

### Step 5.1: Build UI

```powershell
# Navigate to UI directory
cd apps/ui

# Clean install (if dependencies changed)
yarn install

# Build UI
yarn build
```

### Step 5.2: Common UI Build Errors & Fixes

**Error 1: Type Error**

```
Property 'headingTextStyle' does not exist on type 'Component<"sections.newsletter-cta-section">'
```

**Fix:** Rebuild Strapi types, then restart UI dev server.

```powershell
cd apps/strapi
yarn build
cd ../ui
yarn dev
```

---

**Error 2: Import Error**

```
Module not found: Can't resolve '@/components/page-builder/atoms/TextStyle'
```

**Fix:** Verify atomic component exists and path is correct.

---

**Error 3: ESLint/Prettier Errors**

```
Delete `;` prettier/prettier
```

**Fix:** Run formatter before building.

```powershell
yarn format
yarn lint --fix
```

### Step 5.3: Development Testing

```powershell
# Start UI dev server
cd apps/ui
yarn dev

# Open: http://localhost:3000
```

---

## Phase 6: Testing & Validation

### Step 6.1: Visual Testing Matrix

Test **ALL combinations** for **EACH spacing setting**:

| Scenario         | Badge | Header | Expected Result                        |
| ---------------- | ----- | ------ | -------------------------------------- |
| 1. All visible   | ✅    | ✅     | Badge→Header→Content with uniform gaps |
| 2. Badge hidden  | ❌    | ✅     | Header→Content, no phantom spacing     |
| 3. Header hidden | ✅    | ❌     | Badge→Content, no phantom spacing      |
| 4. Both hidden   | ❌    | ❌     | Content only, natural position         |

**For each scenario, test spacing settings:**

- Compact (gap-8)
- Default (gap-12)
- Spacious (gap-16)

### Step 6.2: Text Style Testing

Test all text style options:

- [ ] **Default** - Solid color (theme primary)
- [ ] **Gradient - Horizontal** - Left to right gradient
- [ ] **Gradient - Vertical** - Top to bottom gradient
- [ ] **Gradient - Diagonal** - Bottom-right diagonal
- [ ] **Gradient - Radial** - Circular gradient
- [ ] **Two-tone** - Accent + heading split
- [ ] **Custom gradient - Light mode** - Custom hex colors
- [ ] **Custom gradient - Dark mode** - Different colors in dark mode

### Step 6.3: Responsive Testing

Test all breakpoints:

- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Container query @2xl (672px)
- [ ] Container query @3xl (768px)
- [ ] Container query @4xl (896px)

### Step 6.4: Dark Mode Testing

- [ ] Toggle dark mode
- [ ] Verify border colors adapt
- [ ] Verify gradients switch (if using custom gradients)
- [ ] Verify text colors maintain readability

### Step 6.5: Browser DevTools Inspection

Use browser inspector to verify:

```
1. Measure gaps between elements
   - Badge bottom → Header top = X rem
   - Header bottom → Content top = X rem
   - Should be EQUAL

2. Check for phantom spacing
   - When badge hidden, no empty space where it was
   - When header hidden, no empty space where it was

3. Verify padding uniformity (bordered containers)
   - Top padding = Bottom padding
   - Left padding = Right padding
   - All padding scales with breakpoints
```

---

## Phase 7: Documentation

### Step 7.1: Organize Content Manager Fields

**⚠️ CRITICAL**: After refactoring, field order may be incorrect!

**Steps**:

1. **Edit Config Sync file**

   ```bash
   # Example path
   apps/strapi/config/sync/core-store.plugin_content_manager_configuration_components##sections.your-section.json
   ```

2. **Update field metadata** with helpful labels/descriptions

3. **Reorganize `layouts.edit` array** - Group related fields (e.g., heading + headingAccent + headingTextStyle)

4. **Import Config Sync in Strapi Admin**

   - Settings → Config Sync → Interface
   - Click "Import" button
   - Confirm dialog

5. **⚠️ CRITICAL: Rebuild Strapi Admin**

   ```bash
   # From repository root
   yarn build
   ```

   - Deletes `.strapi` and `dist` folders
   - Rebuilds admin panel with new field layouts

6. **Restart Strapi**

   ```bash
   cd apps/strapi
   yarn dev
   ```

7. **Test in Content Manager**
   - Verify field order is logical
   - Ensure related fields are grouped

**Reference**: See `CONTENT_MANAGER_FIELD_ORGANIZATION_GUIDE.md` for complete field organization patterns.

---

### Step 7.2: Update Component Documentation

If component has special features, document in:

- `COMPONENT_DEVELOPMENT_GUIDE.md`
- `QUICK_REFERENCE.md`

### Step 7.3: Update Integration Guide

Add populate example to:

- `COMPONENT_INTEGRATION_GUIDE.md`

### Step 7.4: Screenshot Documentation

Capture screenshots showing:

- All spacing variations
- All text style variations
- Dark mode
- Responsive breakpoints

Save in: `docs/screenshots/[component-name]/`

---

## Common Patterns Reference

### Pattern 1: Badge + Header + Content

```tsx
const sectionGap = {
  compact: "gap-8",
  default: "gap-12",
  spacious: "gap-16",
}[component.header?.spacing ?? "default"]

return (
  <SectionWrapper background={component.background}>
    <div className={`flex w-full flex-col ${sectionGap}`}>
      <SectionBadge badge={component.badge} />
      {component.header && <SectionHeader header={component.header} />}
      <div className="w-full">{/* Main content */}</div>
    </div>
  </SectionWrapper>
)
```

### Pattern 2: Two-Column Layout with Container Queries

```tsx
<div className="grid w-full items-start gap-8 @2xl:gap-12 @3xl:grid-cols-2 @4xl:gap-16">
  <div>{/* Left column */}</div>
  <div>{/* Right column */}</div>
</div>
```

### Pattern 3: Responsive Card Grid

```tsx
<div className="grid w-full auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-2 @2xl:gap-8">
  {items.map((item) => (
    <div key={item.id} className="rounded-xl border p-6">
      {/* Card content */}
    </div>
  ))}
</div>
```

### Pattern 4: Conditional Text Styling

```tsx
{
  component.heading &&
    (component.headingTextStyle ? (
      <TextStyle
        textStyle={component.headingTextStyle}
        as="h2"
        className="text-3xl font-bold md:text-4xl"
      >
        {component.heading}
      </TextStyle>
    ) : (
      <h2 className="text-primary dark:text-foreground text-3xl font-bold md:text-4xl">
        {component.heading}
      </h2>
    ))
}
```

---

## Troubleshooting

### Issue: Component data shows as `undefined` in frontend

**Diagnosis:**

```tsx
console.log("Component:", component)
// Shows: { badge: undefined, header: undefined }
```

**Fix:** Missing populate configuration in `page.ts`. Add deep populate.

---

### Issue: Spacing looks uneven

**Diagnosis:** Mixed spacing sources (hardcoded margins + gaps).

**Fix:**

1. Remove ALL `mb-*`, `mt-*` from reusable components
2. Use parent container `gap-*` only
3. Verify with browser DevTools

---

### Issue: Two-tone not working

**Diagnosis:** Missing `headingAccent` field in schema.

**Fix:**

1. Add `headingAccent` field to schema
2. Rebuild Strapi
3. Implement two-tone logic in component
4. Test with accent text in Strapi admin

---

### Issue: Build fails after schema changes

**Diagnosis:** Type generation out of sync.

**Fix:**

```powershell
# Delete generated types
rm apps/strapi/types/generated/components.d.ts

# Rebuild Strapi
cd apps/strapi
yarn build

# Restart UI dev server
cd ../ui
yarn dev
```

---

## Complete Refactoring Checklist

Use this for every component refactor:

### Strapi Backend

- [ ] Create/update schema with shared components
- [ ] Add atomic components (text-style, orb-animation)
- [ ] Add descriptions to all fields
- [ ] Mark required fields correctly
- [ ] Update populate middleware (3+ levels deep)
- [ ] Run `yarn build` in apps/strapi
- [ ] Verify types generated in `types/generated/`
- [ ] Test in Strapi admin (add content, save successfully)

### Frontend

- [ ] Remove hardcoded margins from reusable components
- [ ] Implement uniform spacing (gap-based)
- [ ] Add SectionBadge integration
- [ ] Add SectionHeader integration
- [ ] Add SectionWrapper with background config
- [ ] Implement text style support (default/gradient/two-tone)
- [ ] Use container queries for component spacing
- [ ] Use standard breakpoints for typography
- [ ] Run `yarn build` in apps/ui
- [ ] Fix any TypeScript errors
- [ ] Run `yarn format` and `yarn lint`

### Testing

- [ ] Test all badge/header visibility combinations
- [ ] Test all spacing settings (compact/default/spacious)
- [ ] Test all text style options
- [ ] Test responsive breakpoints
- [ ] Test dark mode
- [ ] Measure gaps with DevTools (verify uniformity)
- [ ] Check for phantom spacing when components hidden

### Documentation

- [ ] Update component documentation
- [ ] Add populate example to integration guide
- [ ] Capture screenshots
- [ ] Document any special patterns

### Commit

- [ ] Stage all changes
- [ ] Write conventional commit message
- [ ] Push to branch
- [ ] Create PR with screenshots

---

## Commit Message Template

```
feat(sections): refactor [ComponentName] with atomic architecture

- Add shared.section-badge integration
- Add shared.section-header integration
- Add shared.section-background for container styling
- Add atoms.text-style support for heading customization
- Implement uniform spacing architecture (gap-based)
- Remove hardcoded margins and max-widths
- Add container query patterns for responsive spacing
- Add deep populate configuration for nested components
- Support two-tone text style with headingAccent field

BREAKING CHANGE: Populate middleware now requires deep nesting for atomic components

Tested:
✅ All spacing variations (compact/default/spacious)
✅ All text styles (default/gradient/two-tone)
✅ Badge/header visibility combinations
✅ Responsive breakpoints
✅ Dark mode
✅ Strapi admin integration
```

---

## Related Documentation

- [SPACING_ARCHITECTURE_GUIDE.md](/docs/spacing_architecture_guide) - Spacing patterns and principles
- [COMPONENT_INTEGRATION_GUIDE.md](/docs/component_integration_guide) - Strapi → Frontend workflow
- [COMPONENT_DEVELOPMENT_GUIDE.md](/docs/component_development_guide) - Creating new components
- [STYLING_GUIDE.md](/docs/styling_guide) - Container queries and responsive patterns

---

**Remember:** Backend first, test builds, then frontend. Never skip build verification.
