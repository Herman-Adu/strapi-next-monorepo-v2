# Metrics Section Refactoring Plan

**Date**: November 18, 2025  
**Component**: `sections.metrics-section`  
**Goal**: Standardize to atomic architecture (Background → Badge → Header → Content)

---

## Current State Analysis

### Strapi Schema (metrics-section.json)

**Current Fields** (17 fields):

- ❌ `badge` + 7 badge customization fields (inline)
- ❌ `heading` + `headingAccent` + `headingStyle` (inline)
- ❌ `description` (inline)
- ❌ `backgroundStyle` + `containerStyle` (inline)
- ✅ `metrics` (component repeater - KEEP)

**Problem**:

- Inline badge/header/background fields (not reusable)
- Custom styling logic duplicated across sections
- Not following atomic architecture pattern
- Breaks consistency with other sections

---

## Target State (Standardized)

### New Strapi Schema

**Target Fields** (4 fields):

- ✅ `background` → `shared.section-background` component
- ✅ `badge` → Simple string (rendered by SectionBadge)
- ✅ `header` → `shared.section-header` component
- ✅ `metrics` → `elements.stat-card[]` (KEEP - no change)

**Benefits**:

- Follows atomic architecture
- Reusable components
- Consistent with other sections
- Easier to maintain

---

## Migration Steps

### Step 1: Update Strapi Schema (5 min)

**File**: `apps/strapi/src/components/sections/metrics-section.json`

```json
{
  "collectionName": "components_sections_metrics_sections",
  "info": {
    "displayName": "MetricsSection",
    "description": "Metrics/statistics section with stat cards"
  },
  "options": {},
  "attributes": {
    "background": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-background",
      "required": false
    },
    "badge": {
      "type": "string",
      "required": false
    },
    "header": {
      "type": "component",
      "repeatable": false,
      "component": "shared.section-header",
      "required": false
    },
    "metrics": {
      "type": "component",
      "repeatable": true,
      "component": "elements.stat-card",
      "required": false
    }
  }
}
```

### Step 2: Update Frontend Component (10 min)

**File**: `apps/ui/src/components/page-builder/components/sections/StrapiMetricsSection.tsx`

```tsx
import { Data } from "@repo/strapi"

import { StrapiStatCard } from "@/components/page-builder/components/elements/StrapiStatCard"
import {
  SectionBadge,
  SectionHeader,
  SectionWrapper,
} from "@/components/page-builder/shared"

export function StrapiMetricsSection({
  component,
}: {
  readonly component: Data.Component<"sections.metrics-section">
}) {
  // Use background from Strapi, or provide default
  const backgroundConfig:
    | Data.Component<"shared.section-background">
    | undefined = component.background ?? {
    id: 0,
    backgroundStyle: "muted" as const,
    containerStyle: "default" as const,
    containerWidth: "default" as const,
    padding: "default" as const,
    gradient: false,
  }

  // Map background padding to section gaps
  const backgroundPadding = backgroundConfig?.padding ?? "default"
  const sectionGap = (
    {
      none: "gap-4",
      compact: "gap-8",
      default: "gap-12",
      spacious: "gap-16",
    } as const
  )[backgroundPadding]

  return (
    <SectionWrapper background={backgroundConfig}>
      {/* Uniform spacing: Badge → Header → Content (all controlled by sectionGap) */}
      <div className={`flex w-full flex-col ${sectionGap}`}>
        {/* Badge - returns null when hidden */}
        <SectionBadge badge={component.badge ?? undefined} />

        {/* Header - renders heading+divider and description as separate children */}
        {component.header && (
          <SectionHeader header={component.header} className="mb-0" />
        )}

        {/* Metrics Grid */}
        {component.metrics && component.metrics.length > 0 && (
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {component.metrics.map((metric, index) => (
              <StrapiStatCard key={metric.id || index} component={metric} />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}

StrapiMetricsSection.displayName = "StrapiMetricsSection"

export default StrapiMetricsSection
```

### Step 3: Testing & Validation (5 min)

1. **Regenerate Types**:

   ```bash
   cd apps/strapi
   yarn strapi ts:generate-types
   ```

2. **Test in Strapi Admin**:

   - Open existing page with Metrics Section
   - Fields will be empty (expected - data migration needed)
   - Add new Background component
   - Add new Header component
   - Metrics should still be there (no change)

3. **Test Frontend**:

   - Visit page with Metrics Section
   - Should render with default background/header
   - No errors in console

4. **Visual Verification**:
   - Badge displays above header
   - Header with divider (if enabled)
   - Description below header
   - Metrics grid renders correctly
   - Spacing consistent with other sections

---

## Data Migration (Manual for Now)

For each existing Metrics Section in Strapi:

### Old Data Structure:

```
badge: "Our Impact"
badgeIcon: "📊"
heading: "Trusted by Developers Worldwide"
headingAccent: "" (empty)
description: "Join thousands of teams..."
backgroundStyle: "muted"
containerStyle: "default"
metrics: [...]
```

### New Data Structure:

```
badge: "📊 Our Impact"
header:
  heading: "Trusted by Developers Worldwide"
  description: "Join thousands of teams..."
  showDivider: true (optional)
  headingTextStyle: (optional - for gradient/two-tone)
background:
  backgroundStyle: "muted"
  containerStyle: "default"
  containerWidth: "default"
  padding: "default"
  gradient: false
metrics: [...] (no change)
```

---

## Benefits After Refactoring

### ✅ Consistency

- Same structure as Newsletter CTA, Benefits, Tech Stack sections
- Predictable pattern for developers

### ✅ Reusability

- Background component shared across ALL sections
- Header component shared across ALL sections
- Badge component shared across ALL sections

### ✅ Maintainability

- Fix background once → affects all sections
- Update header styling once → affects all sections
- No duplicate logic

### ✅ Extensibility

- Add new background styles → all sections get them
- Add new header options → all sections get them
- Future-proof architecture

---

## Estimated Time

| Task                      | Time          | Notes                           |
| ------------------------- | ------------- | ------------------------------- |
| Update Strapi schema      | 5 min         | Copy-paste new schema           |
| Update frontend component | 10 min        | Copy-paste new implementation   |
| Regenerate types          | 1 min         | `yarn strapi ts:generate-types` |
| Test in Strapi            | 3 min         | Open page, verify fields        |
| Test frontend             | 3 min         | Refresh page, check rendering   |
| Update existing content   | 5-10 min      | Manual data entry per section   |
| **TOTAL**                 | **25-30 min** | **For complete refactor**       |

---

## Automation Potential

Once this pattern is proven with Metrics Section:

### Future Automation (Script Idea):

```bash
# Refactor any section to atomic architecture
node scripts/refactor-section-to-atomic.js sections/feature-grid-section

# What it does:
# 1. Updates Strapi schema (background, badge, header)
# 2. Updates frontend component (SectionWrapper, SectionBadge, SectionHeader)
# 3. Regenerates TypeScript types
# 4. Creates migration guide for existing content
# 5. Runs tests
```

**Time Savings**: 25 min → 2 min per section (90% reduction!)

---

## Next Sections to Refactor (After Metrics)

1. ✅ **Metrics Section** - CURRENT (proving the pattern)
2. ⏳ **Feature Grid Section** - Similar structure
3. ⏳ **Tech Stack Section** - Already partially done
4. ⏳ **Partner Showcase Section** - Similar structure
5. ⏳ **Integration Grid Section** - Similar structure
6. ⏳ **Workflow Section** - Similar structure
7. ⏳ **Roadmap Section** - Similar structure

**After Newsletter CTA**: We'll have a proven template to automate all of these!

---

## Success Criteria

✅ Strapi schema has 4 fields (background, badge, header, metrics)  
✅ Frontend uses SectionWrapper, SectionBadge, SectionHeader  
✅ TypeScript types regenerate without errors  
✅ Existing metrics data preserved  
✅ Visual appearance matches original  
✅ Spacing consistent with other sections  
✅ Code reduction (from 120+ lines to ~40 lines)

---

**Ready to execute?** Let's start with Step 1! 🚀
