# Shared Component Creation Guide

## Overview

This guide documents the complete workflow for creating reusable shared components in Strapi and their corresponding frontend renderers. This process enables DRY principles, consistent UX, and easier maintenance across all sections.

## Architecture

### Backend (Strapi)

- **Location**: `apps/strapi/src/components/shared/`
- **Purpose**: Define reusable component schemas that can be referenced by multiple content types
- **Type Generation**: Automatic TypeScript type generation via `yarn generate:types`

### Frontend (UI)

- **Location**: `apps/ui/src/components/page-builder/shared/`
- **Purpose**: Render shared component data from Strapi
- **Type Safety**: Uses generated `Data.Component<"shared.component-name">` types

## Complete Workflow

### Phase 1: Backend (Strapi First - ALWAYS)

#### Step 1: Research Existing Patterns

Before creating a new shared component, examine existing implementations:

```bash
# Search for similar field patterns in existing sections
grep -r "fieldName" apps/strapi/src/components/sections/*.json

# Read existing shared components for reference
cat apps/strapi/src/components/shared/seo.json
```

**Example**: For badge component, search for:

- `badge`, `badgeIcon`, `badgeSize`
- `badgeAnimation`, `badgeAnimationSpeed`
- Common patterns across metrics, tech-stack, marquee sections

#### Step 2: Design Component Schema

Create JSON schema following Strapi pattern:

```json
{
  "collectionName": "components_shared_[component_name]s",
  "info": {
    "displayName": "Component Display Name",
    "description": "Clear description of component purpose",
    "icon": "lucide-icon-name"
  },
  "options": {},
  "attributes": {
    "fieldName": {
      "type": "string | text | boolean | enumeration | etc.",
      "required": true | false,
      "default": "default-value",
      "description": "Helpful description with examples"
    },
    "enumField": {
      "type": "enumeration",
      "enum": ["option1", "option2", "option3"],
      "default": "option1",
      "required": false,
      "description": "Description of each option's effect"
    }
  }
}
```

**File Naming Convention**: `kebab-case.json`

- Example: `section-badge.json`, `section-background.json`, `section-header.json`

#### Step 3: Create Strapi Component File

```bash
# Create file in shared directory
apps/strapi/src/components/shared/component-name.json
```

**Real Example** (`section-badge.json`):

```json
{
  "collectionName": "components_shared_section_badges",
  "info": {
    "displayName": "Section Badge",
    "description": "Reusable badge component for section headers",
    "icon": "tag"
  },
  "options": {},
  "attributes": {
    "text": { "type": "string", "required": false },
    "icon": { "type": "string", "required": false },
    "variant": {
      "type": "enumeration",
      "enum": ["default", "secondary", "outline", "ghost"],
      "default": "default"
    },
    "size": {
      "type": "enumeration",
      "enum": ["small", "medium", "large"],
      "default": "medium"
    },
    "animation": { "type": "boolean", "default": false },
    "animationSpeed": {
      "type": "enumeration",
      "enum": ["extra-slow", "slow", "medium", "fast"],
      "default": "slow"
    },
    "orbSize": {
      "type": "enumeration",
      "enum": ["small", "medium", "large"],
      "default": "medium"
    },
    "pulse": { "type": "boolean", "default": false }
  }
}
```

#### Step 4: Generate TypeScript Types

```bash
cd apps/strapi
yarn generate:types
```

**Expected Output**:

```
[INFO] Starting the type generation process
[INFO] Generating types for contentTypes
[INFO] Generating types for components
[INFO] Saved contentTypes types in types/generated/contentTypes.d.ts
[INFO] Saved components types in types/generated/components.d.ts
[INFO] The task completed successfully with 0 warning(s) and 0 error(s)
```

**Verify Types Generated**:

```bash
# Check for your new component interface
grep -A 20 "SharedComponentName" apps/strapi/types/generated/components.d.ts
```

Example generated type:

```typescript
export interface SharedSectionBadge extends Struct.ComponentSchema {
  collectionName: "components_shared_section_badges"
  info: {
    description: "Reusable badge component for section headers"
    displayName: "Section Badge"
    icon: "tag"
  }
  attributes: {
    text: Schema.Attribute.String
    icon: Schema.Attribute.String
    variant: Schema.Attribute.Enumeration<
      ["default", "secondary", "outline", "ghost"]
    >
    // ... etc
  }
}
```

#### Step 5: Rebuild Strapi Admin Panel

```bash
cd apps/strapi
yarn build
```

**Expected Output**:

```
✔ Compiling TS (3258ms)
✔ Building build context (379ms)
✔ Building admin panel (27515ms)
Done in 34.18s.
```

**Verify in Admin**:

1. Start Strapi: `yarn dev` in apps/strapi
2. Open admin panel: http://localhost:1337/admin
3. Go to Content Manager → Create any content type with components
4. Click "Add component" → Should see new `shared.component-name` in list

### Phase 2: Frontend (After Backend Complete)

#### Step 6: Create Frontend UI Component

**Location**: `apps/ui/src/components/page-builder/shared/ComponentName.tsx`

**Template**:

```tsx
"use client"

import { Data } from "@repo/strapi"
import { cn } from "@/lib/styles"

interface ComponentNameProps {
  component?: Data.Component<"shared.component-name">
  className?: string
}

/**
 * Reusable component description.
 * Explain what it renders and when to use it.
 */
export function ComponentName({ component, className }: ComponentNameProps) {
  if (!component) return null

  // Extract fields with null coalescing for Strapi nullables
  const { field1 = "defaultValue", field2, enumField = "default" } = component

  // Build CSS classes based on Strapi data
  const componentClasses = cn(
    "base-classes",
    field2 && "conditional-classes",
    className
  )

  return <div className={componentClasses}>{/* Render component UI */}</div>
}
```

**Real Example** (`SectionBadge.tsx`):

```tsx
"use client"

import { Data } from "@repo/strapi"
import { StrapiOrbitingBadge } from "../components/elements/StrapiOrbitingBadge"

interface SectionBadgeProps {
  badge?: Data.Component<"shared.section-badge">
}

export function SectionBadge({ badge }: SectionBadgeProps) {
  if (!badge?.text) return null

  return (
    <StrapiOrbitingBadge
      badge={badge.text}
      badgeIcon={badge.icon ?? undefined}
      badgeSize={badge.size ?? undefined}
      badgeAnimation={badge.animation ?? undefined}
      badgeAnimationSpeed={badge.animationSpeed ?? undefined}
      badgeOrbSize={badge.orbSize ?? undefined}
      badgeBorderRadius="md"
      badgeOrbGlow="normal"
    />
  )
}
```

#### Step 7: Export from Index

**File**: `apps/ui/src/components/page-builder/shared/index.ts`

```typescript
export { ComponentName } from "./ComponentName"
```

#### Step 8: Test with Existing Section

**Update Strapi Section Schema** (`apps/strapi/src/components/sections/section-name.json`):

```json
{
  "attributes": {
    "badge": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-badge"
    },
    "header": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-header"
    }
  }
}
```

**Regenerate Types**:

```bash
cd apps/strapi
yarn generate:types
```

**Update Frontend Renderer** (`apps/ui/src/components/page-builder/components/sections/StrapiSectionName.tsx`):

```tsx
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiSectionName({ component }) {
  return (
    <SectionWrapper background={component.background}>
      <SectionBadge badge={component.badge} />
      <SectionHeader header={component.header} />
      {/* Section content */}
    </SectionWrapper>
  )
}
```

### Phase 3: Validation & Documentation

#### Step 9: Verify in Strapi Admin

1. Start Strapi: `cd apps/strapi && yarn dev`
2. Open http://localhost:1337/admin
3. Create/edit content using new shared component
4. Fill in all fields
5. Save and publish

#### Step 10: Test Frontend Rendering

1. Start UI: `cd apps/ui && yarn dev`
2. Open localhost:3000
3. Navigate to page using content with shared component
4. Verify correct rendering
5. Test all field variations (different sizes, styles, animations, etc.)

#### Step 11: Check for Errors

```bash
# Run linter
yarn lint

# Run type check
cd apps/ui && yarn build

# Check for console errors in browser
# Check for Strapi errors in terminal
```

## Common Patterns

### Null Handling

Strapi `Data.Component` types include `null`, so always use null coalescing:

```typescript
// ❌ Wrong - TypeScript error
<Component prop={data.field} />

// ✅ Correct
<Component prop={data.field ?? undefined} />
```

### Enum Mapping

Map Strapi enums to CSS classes with switch statements:

```typescript
function getSizeClass(size?: "small" | "medium" | "large"): string {
  switch (size) {
    case "small":
      return "text-sm"
    case "large":
      return "text-lg"
    case "medium":
    default:
      return "text-base"
  }
}
```

### Conditional Rendering

Always guard against empty/null data:

```typescript
if (!component?.requiredField) return null
```

### CSS Class Building

Use `cn()` utility for dynamic classes:

```typescript
import { cn } from "@/lib/styles"

const classes = cn(
  "base-class",
  variant === "primary" && "primary-variant",
  size && getSizeClass(size),
  className
)
```

## Reference: Created Shared Components

### 1. Section Badge (`shared.section-badge`)

**Purpose**: Reusable badge for section headers with optional animation  
**Fields**: text, icon, variant, size, animation, animationSpeed, orbSize, pulse  
**Usage**: Header badges across metrics, tech-stack, marquee, etc.

### 2. Section Background (`shared.section-background`)

**Purpose**: Background and container styling for sections  
**Fields**: backgroundStyle, pattern, gradient, containerStyle, containerWidth, padding  
**Usage**: Consistent section wrappers with theme-aware backgrounds

### 3. Section Header (`shared.section-header`)

**Purpose**: Header with heading, description, and styling options  
**Fields**: heading, headingAccent, description, headingSize, headingStyle, alignment, showDivider, spacing  
**Usage**: Standardized section headers across all sections

## Troubleshooting

### Types Not Generated

**Problem**: New component not appearing in `components.d.ts`  
**Solution**:

1. Check JSON syntax in component file
2. Run `yarn generate:types` again
3. Restart TypeScript server in VS Code (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

### Component Not in Admin Panel

**Problem**: Component not visible in Content Manager component picker  
**Solution**:

1. Run `yarn build` in apps/strapi
2. Restart Strapi server
3. Clear browser cache
4. Check `collectionName` is unique

### TypeScript Errors in Frontend

**Problem**: Property 'field' does not exist on type 'ComponentName'  
**Solution**:

1. Verify types regenerated after schema changes
2. Use `Data.Component<"shared.component-name">` type wrapper
3. Add `?? undefined` for nullable fields

### Null Type Errors

**Problem**: Type 'string | null' is not assignable to type 'string | undefined'  
**Solution**:

```typescript
// Use null coalescing operator
prop={data.field ?? undefined}
```

## Automation Checklist

When user requests: **"Create shared component [name]"**

### Backend Phase (Strapi First)

- [ ] Research existing patterns (grep search similar fields)
- [ ] Design component schema with all attributes
- [ ] Create `apps/strapi/src/components/shared/[name].json`
- [ ] Run `yarn generate:types` in apps/strapi
- [ ] Run `yarn build` in apps/strapi
- [ ] Verify types in `types/generated/components.d.ts`

### Frontend Phase (After Backend Complete)

- [ ] Create `apps/ui/src/components/page-builder/shared/[Name].tsx`
- [ ] Use `Data.Component<"shared.[name]">` type
- [ ] Add null coalescing for all Strapi fields (`?? undefined`)
- [ ] Export from `shared/index.ts`
- [ ] Update section schema to use component (if testing)
- [ ] Regenerate types
- [ ] Update section renderer component

### Validation Phase

- [ ] Check for TypeScript errors (`yarn lint`, `yarn build`)
- [ ] Test in Strapi admin (create content with component)
- [ ] Test frontend rendering (verify all field variations)
- [ ] Document in this guide's "Created Shared Components" section

## Best Practices

1. **Always Strapi First**: Complete all backend work before touching frontend
2. **Descriptive Field Descriptions**: Help content editors understand each field
3. **Sensible Defaults**: Set default values for enums and booleans
4. **Theme-Aware Styling**: Use CSS variables and theme tokens
5. **Responsive Design**: Include responsive classes in component renderers
6. **Accessibility**: Add ARIA labels, semantic HTML, keyboard navigation
7. **Type Safety**: Always use generated types, never `any`
8. **Documentation**: Update this guide when creating new patterns

## Quick Reference Commands

```bash
# Generate Strapi types
cd apps/strapi && yarn generate:types

# Build Strapi admin
cd apps/strapi && yarn build

# Run full build (all packages)
yarn turbo run build

# Lint check
yarn lint

# Format check
yarn format:check

# Start Strapi dev server
cd apps/strapi && yarn dev

# Start UI dev server
cd apps/ui && yarn dev
```

## Related Documentation

- `COMPONENT_ARCHITECTURE.md` - Overall component architecture
- `COMPONENT_DEVELOPMENT_GUIDE.md` - General component development
- `DEVELOPMENT_WORKFLOW.md` - Development workflow and standards
- Strapi Content-Type Builder: http://localhost:1337/admin/plugins/content-type-builder

---

**Last Updated**: 2025-01-12  
**Created By**: AI Agent following user's automation request  
**Reference Implementation**: Section Badge, Section Background, Section Header
