# Component Integration Guide: Strapi to Frontend

> **Mission-Critical Reference**: Complete workflow for integrating Strapi components with Next.js frontend, based on real-world lessons from Newsletter CTA Section implementation.

**📌 Quick Reference:** See [POPULATE_PATTERNS_REFERENCE.md](/docs/populate_patterns_reference) for all populate patterns.

## Table of Contents

1. [The Critical Missing Step (Populate)](#the-critical-missing-step)
2. [Complete Integration Workflow](#complete-integration-workflow)
3. [Trials & Tribulations Log](#trials--tribulations-log)
4. [Victories & Solutions](#victories--solutions)
5. [Pattern Reference](#pattern-reference)
6. [Pre-Flight Checklist](#pre-flight-checklist)

---

## The Critical Missing Step

### ⚠️ **MOST COMMON FAILURE POINT**: Populate Configuration

**Symptom**: Component works in Strapi admin, data shows in DB, but frontend receives `undefined`.

**Root Cause**: Strapi V5 only populates **1 level deep** by default. Nested components MUST be explicitly declared.

**Location**: `apps/strapi/src/documentMiddlewares/page.ts`

**Example of WRONG (incomplete) populate**:

```typescript
"sections.newsletter-cta-section": {
  populate: {
    header: true,  // ❌ Only populates header, NOT its nested components!
  },
}
```

**Example of CORRECT (deep) populate**:

```typescript
"sections.newsletter-cta-section": {
  populate: {
    badge: { populate: { orbAnimation: true } },  // ✅ 2 levels
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },           // ✅ 3 levels
        descriptionTextStyle: { populate: { customGradient: true } }, // ✅ 3 levels
      },
    },
    headingTextStyle: { populate: { customGradient: true } },  // ✅ 2 levels
    ctaButtons: true,
    benefits: true,
    gdprLink: true,
  },
}
```

### 🔍 How to Diagnose Missing Populate

1. **Add debug logging** to your React component:

   ```typescript
   console.log("Component Data:", component)
   ```

2. **Check browser console** - If nested fields show `undefined`, populate is missing

3. **Verify in Strapi admin** - Data exists there but not in frontend = populate issue

---

## Complete Integration Workflow

### Phase 1: Strapi Schema (Backend)

#### Step 1.1: Create/Modify Component Schema

**Location**: `apps/strapi/src/components/{category}/{component-name}.json`

**Example**: Adding `headingTextStyle` to Newsletter section

```json
{
  "attributes": {
    "heading": {
      "type": "string",
      "required": true
    },
    "headingTextStyle": {
      "type": "component",
      "repeatable": false,
      "component": "atoms.text-style",
      "required": false,
      "description": "Optional text styling for heading"
    }
  }
}
```

**✅ Checklist**:

- [ ] Schema file created/updated
- [ ] Field names follow camelCase convention
- [ ] Description added for clarity
- [ ] Required/optional correctly set

#### Step 1.2: Build Strapi to Regenerate Types

```bash
yarn workspace @repo/strapi build
```

**Duration**: ~25-30 seconds

**Verification**:

- [ ] Build completes without errors
- [ ] Check `apps/strapi/types/generated/components.d.ts` for new fields
- [ ] TypeScript types match schema exactly

**⚠️ Common Failure**: If build fails, check JSON syntax (trailing commas, quotes)

---

### Phase 2: Frontend Integration

#### Step 2.1: Update React Component

**Location**: `apps/ui/src/components/page-builder/components/sections/`

**Pattern for Using TextStyle**:

```typescript
import { TextStyle } from "@/components/page-builder/atoms/TextStyle"

// In component:
{component.heading && (
  component.headingTextStyle ? (
    <TextStyle
      textStyle={component.headingTextStyle}
      as="h2"
      className="text-3xl font-bold"
    >
      {component.heading}
    </TextStyle>
  ) : (
    <h2 className="text-3xl font-bold">{component.heading}</h2>
  )
)}
```

**✅ Checklist**:

- [ ] Import TextStyle component
- [ ] Wrap text in TextStyle when field exists
- [ ] Provide fallback for when textStyle is undefined
- [ ] Use correct HTML element (`as` prop)

#### Step 2.2: Build UI to Verify TypeScript

```bash
yarn build:ui
```

**Duration**: ~40-80 seconds

**Verification**:

- [ ] Build completes without TypeScript errors
- [ ] No warnings about missing properties
- [ ] All pages generate successfully (35/35)

**⚠️ Common Failure**: Property doesn't exist on type = Strapi types not regenerated

---

### Phase 3: 🚨 CRITICAL STEP - Populate Configuration

#### Step 3.1: Update Populate Middleware

**Location**: `apps/strapi/src/documentMiddlewares/page.ts`

**Find your section**:

```typescript
"sections.newsletter-cta-section": {
  populate: {
    // OLD/INCOMPLETE populate here
  },
}
```

**Update with deep populate**:

```typescript
"sections.newsletter-cta-section": {
  populate: {
    // For each component field with nested components:
    fieldName: {
      populate: {
        nestedField: { populate: { deepNestedField: true } }
      }
    }
  },
}
```

**🎯 Rule of Thumb**:

- Plain fields (string, number, enum) → `true`
- Component fields → `{ populate: { ... } }`
- Nested components → Keep going until you hit plain fields

**✅ Checklist**:

- [ ] ALL component fields have populate config
- [ ] Nested components populated to required depth
- [ ] Optional nested fields (like customGradient) included
- [ ] Repeatable components handled correctly

#### Step 3.2: Restart Dev Server

**MANDATORY** - Middleware changes require server restart

```bash
# Stop: Ctrl+C
yarn dev
```

**⚠️ Common Failure**: Forgetting to restart = old populate still used

---

### Phase 4: Testing & Verification

#### Step 4.1: Test in Strapi Admin

1. Open section in Strapi admin
2. Fill in ALL new fields (especially nested components)
3. **Save** (not enough alone)
4. **Publish** (critical - draft data doesn't appear)

**✅ Checklist**:

- [ ] All new fields visible in admin
- [ ] Nested components expand correctly
- [ ] Data saves without errors
- [ ] Published (not just saved)

#### Step 4.2: Test in Running Frontend

1. Open browser dev tools (F12)
2. Navigate to page with component
3. Check console for debug logs
4. Verify data structure in React DevTools

**✅ Checklist**:

- [ ] Component renders without errors
- [ ] Nested data shows in console (not undefined)
- [ ] Visual appearance matches Strapi settings
- [ ] Changes in Strapi reflect on frontend after refresh

#### Step 4.3: Test All Variations

- [ ] Test with textStyle enabled
- [ ] Test with textStyle disabled (undefined)
- [ ] Test different textStyle values (gradient, two-tone, default)
- [ ] Test with custom colors
- [ ] Test alignment variations
- [ ] Test with/without optional fields

---

### Phase 5: Commit & Deploy

#### Step 5.1: Remove Debug Code

```typescript
// Remove any console.log statements added for debugging
console.log("DEBUG:", data) // ❌ Remove this
```

#### Step 5.2: Commit Changes

```bash
git add .
git commit -m "feat(newsletter): add independent TextStyle controls

- Add textStyle to section-header description
- Add headingTextStyle to newsletter form
- Fix SectionHeader to use TextStyle component
- Add deep populate for nested components
- Fix divider alignment to move with text"
```

**✅ Checklist**:

- [ ] All modified files staged
- [ ] Commit message follows convention
- [ ] Debug code removed
- [ ] Build passing locally

#### Step 5.3: Push & Monitor

```bash
git push origin main
```

**✅ Checklist**:

- [ ] GitHub Actions pass (Lint + Build)
- [ ] No TypeScript errors in CI
- [ ] All apps build successfully

---

## Trials & Tribulations Log

### Issue 1: Badge Alignment Broken

**Symptom**: Badge always centered, ignoring alignment setting from Strapi.

**Root Cause**: OrbAnimation component had early return when `enabled: false`, bypassing wrapper div that contained alignment classes.

**Code Before** (Buggy):

```typescript
if (!enabled) {
  return <>{children}</>  // Lost wrapper with alignment!
}
```

**Code After** (Fixed):

```typescript
// Removed early return, wrapper always renders
const canAnimate = enabled && validPathPoints.length > 0 && ...
```

**Files Changed**:

- `apps/ui/src/components/page-builder/atoms/OrbAnimation.tsx`

**Lesson**: Early returns can bypass critical wrapper elements. Always check what classes/props are on outer elements.

---

### Issue 2: Orb Animation Not Showing

**Symptom**: Set `enabled: true` in Strapi, but no orb visible.

**Root Cause 1**: Early return (same as Issue 1)  
**Root Cause 2**: `canAnimate` condition didn't check `enabled` flag

**Code Before**:

```typescript
const canAnimate = validPathPoints.length > 0 && ...
```

**Code After**:

```typescript
const canAnimate = enabled && validPathPoints.length > 0 && ...
```

**Lesson**: When multiple conditions determine rendering, ALL conditions must be checked.

---

### Issue 3: Both Headings Show Same Data

**Symptom**: Section container heading and newsletter form heading both showed "herman is kink".

**Root Cause**: Newsletter form was incorrectly using `component.header` instead of `component.heading`.

**Code Before**:

```typescript
<SectionHeader header={component.heading} />  // Wrong type!
```

**Code After**:

```typescript
{component.heading && (
  <h2>{component.heading}</h2>
)}
```

**Files Changed**:

- `apps/ui/src/components/page-builder/components/sections/StrapiNewsletterCTASection.tsx`

**Lesson**:

- `component.header` = Section container header (component type)
- `component.heading` = Newsletter form heading (string type)
- Use correct field for correct purpose

---

### Issue 4: Section Container Not Centered

**Symptom**: SectionHeader had alignment field in Strapi but was hardcoded to `text-left`.

**Root Cause**: SectionHeader component had hardcoded `text-left` and didn't extract alignment from props.

**Code Before**:

```typescript
const wrapperClasses = cn(spacingClass, "text-left", className)
```

**Code After**:

```typescript
const alignmentClass = getAlignmentClass(alignment ?? undefined)
const wrapperClasses = cn(spacingClass, alignmentClass, className)
```

**Lesson**: Don't hardcode values that should come from Strapi. Always check schema for available fields.

---

### Issue 5: Divider Doesn't Move with Alignment

**Symptom**: Text aligns correctly, but green divider line stays left-aligned.

**Root Cause**: Divider had no alignment classes.

**Code Before**:

```typescript
<div className="from-primary/60 to-primary mb-8 h-1 w-24 rounded-full bg-gradient-to-r" />
```

**Code After**:

```typescript
const dividerAlignmentClass =
  alignment === "right" ? "ml-auto" :
  alignment === "left" ? "mr-auto" :
  "mx-auto"

<div className={cn("...", dividerAlignmentClass)} />
```

**Lesson**: Visual elements like dividers need alignment too, not just text.

---

### Issue 6: TextStyle Not Working At All

**Symptom**: Changing textStyle in Strapi had no effect on frontend.

**Root Cause 1**: Two-tone had hardcoded colors instead of using TextStyle component  
**Root Cause 2**: Duplicate rendering logic for two-tone vs other styles

**Code Before**:

```typescript
if (headingStyle === "two-tone" && headingAccent) {
  return (
    <h2>
      <span className="text-primary">{headingAccent}</span>
      <span>{heading}</span>
    </h2>
  )
}
// Separate return for gradient/default
return <TextStyle textStyle={textStyle}>...</TextStyle>
```

**Code After**:

```typescript
// Keep two-tone branch for proper accent/heading split
if (headingStyle === "two-tone" && headingAccent) {
  return (
    <h2>
      <span className="text-primary">{headingAccent}</span>{" "}
      <span className="text-muted-foreground dark:text-foreground">
        {heading}
      </span>
    </h2>
  )
}
// Gradient and default use TextStyle
const fullHeading = headingAccent ? `${headingAccent} ${heading}` : heading
return <TextStyle textStyle={textStyle}>{fullHeading}</TextStyle>
```

**Lesson**: Two-tone requires special handling because it splits text into two parts with different colors. Other styles can combine accent + heading.

---

### Issue 7: 🚨 textStyle Always Undefined (THE BIG ONE)

**Symptom**: Set textStyle to "two-tone" in Strapi, saved & published, but console shows `textStyleRaw: undefined`.

**Root Cause**: **Missing populate configuration** in `page.ts` middleware.

**Code Before** (Incomplete):

```typescript
"sections.newsletter-cta-section": {
  populate: {
    header: true,  // ❌ Only 1 level deep!
  },
}
```

**Code After** (Complete):

```typescript
"sections.newsletter-cta-section": {
  populate: {
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },
        descriptionTextStyle: { populate: { customGradient: true } },
      },
    },
    headingTextStyle: { populate: { customGradient: true } },
  },
}
```

**Files Changed**:

- `apps/strapi/src/documentMiddlewares/page.ts`

**Impact**: This ONE missing step blocked everything. Strapi wasn't sending nested component data to frontend.

**Lesson**:

- ⚠️ **ALWAYS check populate after adding nested components**
- Strapi V5 only populates 1 level by default
- Nested components need explicit populate config
- Must restart dev server after changing middleware

---

## Victories & Solutions

### Victory 1: OrbAnimation Wrapper Fix

**Achievement**: Orb animation now works while preserving alignment regardless of enabled state.

**Solution**: Removed early return, added `enabled` to `canAnimate` condition.

**Impact**: Badge alignment and orb animation work independently and correctly.

---

### Victory 2: Proper Data Separation

**Achievement**: Section container and newsletter form use different data sources correctly.

**Pattern**:

```typescript
// Section container (top)
<SectionHeader header={component.header} />  // Uses component.header

// Newsletter form (inside)
<h2>{component.heading}</h2>  // Uses component.heading
```

**Impact**: Can have different text, styles, and alignment for each area.

---

### Victory 3: SectionHeader Alignment Support

**Achievement**: SectionHeader respects alignment field for all content (text + divider).

**Implementation**:

```typescript
function getAlignmentClass(alignment?: "left" | "center" | "right"): string {
  switch (alignment) {
    case "left":
      return "text-left"
    case "right":
      return "text-right"
    case "center":
    default:
      return "text-center"
  }
}

const dividerAlignmentClass =
  alignment === "right"
    ? "ml-auto"
    : alignment === "left"
      ? "mr-auto"
      : "mx-auto"
```

**Impact**: Full control over header alignment from Strapi.

---

### Victory 4: TextStyle Component Integration

**Achievement**: TextStyle atom works with SectionHeader for gradient/two-tone/default styles.

**Pattern**:

```typescript
// Two-tone: Manual split for accent + heading
if (headingStyle === "two-tone" && headingAccent) {
  return <h2><span>{headingAccent}</span> <span>{heading}</span></h2>
}

// Gradient/Default: Use TextStyle component
return <TextStyle textStyle={textStyle}>{fullHeading}</TextStyle>
```

**Impact**: Reusable text styling across all components.

---

### Victory 5: Deep Populate Configuration

**Achievement**: Mastered Strapi V5 populate for nested components up to 4 levels deep.

**Pattern Established**:

```typescript
componentField: {
  populate: {
    nestedComponent: {
      populate: {
        deepNestedComponent: true
      }
    }
  }
}
```

**Impact**: All nested data flows correctly from Strapi to frontend.

---

### Victory 6: Independent TextStyle Controls

**Achievement**: Section container description AND newsletter form heading each have independent TextStyle.

**Schema Structure**:

```
newsletter-cta-section
├── header (component)
│   ├── heading (string)
│   ├── headingAccent (string)
│   ├── description (text)
│   ├── textStyle (component) ← For heading
│   └── descriptionTextStyle (component) ← For description
├── heading (string) ← Newsletter form
└── headingTextStyle (component) ← For form heading
```

**Impact**: Maximum flexibility - 3 independent text styling zones in one section.

---

## Pattern Reference

### Adding TextStyle to ANY Text Field

#### Backend (Strapi Schema)

1. **Add textStyle field** to component:

```json
{
  "attributes": {
    "yourTextField": {
      "type": "string",
      "required": true
    },
    "yourTextFieldTextStyle": {
      "type": "component",
      "repeatable": false,
      "component": "atoms.text-style",
      "required": false,
      "description": "Optional styling for yourTextField"
    }
  }
}
```

**Naming Convention**: `{fieldName}TextStyle`

2. **Build Strapi**:

```bash
yarn workspace @repo/strapi build
```

3. **Update populate** in `apps/strapi/src/documentMiddlewares/page.ts`:

```typescript
"sections.your-section": {
  populate: {
    yourTextFieldTextStyle: { populate: { customGradient: true } },
  },
}
```

4. **Restart dev server** (mandatory for middleware changes)

#### Frontend (React Component)

1. **Import TextStyle**:

```typescript
import { TextStyle } from "@/components/page-builder/atoms/TextStyle"
```

2. **Wrap text conditionally**:

```typescript
{component.yourTextField && (
  component.yourTextFieldTextStyle ? (
    <TextStyle
      textStyle={component.yourTextFieldTextStyle}
      as="h2"  // or p, h1, span, etc.
      className="your-classes"
    >
      {component.yourTextField}
    </TextStyle>
  ) : (
    <h2 className="your-classes">{component.yourTextField}</h2>
  )
)}
```

3. **Build UI**:

```bash
yarn build:ui
```

4. **Test in running app**

---

### Adding OrbAnimation to ANY Badge

#### Backend (Strapi Schema)

1. **Add orbAnimation field** to badge component:

```json
{
  "attributes": {
    "orbAnimation": {
      "type": "component",
      "repeatable": false,
      "component": "atoms.orb-animation",
      "required": false,
      "description": "Optional orbiting light animation around badge"
    }
  }
}
```

2. **Build Strapi**

3. **Update populate**:

```typescript
"sections.your-section": {
  populate: {
    badge: { populate: { orbAnimation: true } },
  },
}
```

4. **Restart dev server**

#### Frontend (React Component)

1. **Import OrbAnimation**:

```typescript
import { OrbAnimation } from "@/components/page-builder/atoms/OrbAnimation"
```

2. **Wrap badge**:

```typescript
<OrbAnimation
  orbAnimation={badge.orbAnimation ?? undefined}
  className="flex items-center justify-center"
>
  <div className="badge-classes">
    {/* Badge content */}
  </div>
</OrbAnimation>
```

**Note**: OrbAnimation handles alignment via wrapper className, so parent doesn't need justify-\* classes.

---

### Adding Alignment to ANY Component

#### Backend (Strapi Schema)

```json
{
  "attributes": {
    "alignment": {
      "type": "enumeration",
      "enum": ["left", "center", "right"],
      "default": "center",
      "required": false,
      "description": "Horizontal alignment"
    }
  }
}
```

#### Frontend (React Component)

```typescript
function getAlignmentClass(alignment?: "left" | "center" | "right"): string {
  switch (alignment) {
    case "left": return "text-left"
    case "right": return "text-right"
    case "center":
    default: return "text-center"
  }
}

// In component:
const alignmentClass = getAlignmentClass(component.alignment ?? undefined)
<div className={alignmentClass}>...</div>
```

**For flex containers**:

```typescript
function getFlexAlignmentClass(
  alignment?: "left" | "center" | "right"
): string {
  switch (alignment) {
    case "left":
      return "justify-start"
    case "right":
      return "justify-end"
    case "center":
    default:
      return "justify-center"
  }
}
```

**For block elements (dividers, images)**:

```typescript
const blockAlignmentClass =
  alignment === "right"
    ? "ml-auto"
    : alignment === "left"
      ? "mr-auto"
      : "mx-auto"
```

---

## Pre-Flight Checklist

Use this checklist BEFORE claiming a component is "done":

### Backend Checklist

- [ ] **Schema created/updated** in `apps/strapi/src/components/`
- [ ] **Field naming follows convention** (camelCase, descriptive)
- [ ] **Descriptions added** to all fields for clarity
- [ ] **Strapi built successfully** (`yarn workspace @repo/strapi build`)
- [ ] **Types generated** in `apps/strapi/types/generated/components.d.ts`
- [ ] **Populate configured** in `apps/strapi/src/documentMiddlewares/page.ts`
  - [ ] ALL component fields have populate
  - [ ] Nested components populated to required depth
  - [ ] Optional nested fields included (customGradient, orbAnimation, etc.)
- [ ] **Dev server restarted** after populate changes

### Frontend Checklist

- [ ] **Component imported** necessary atoms (TextStyle, OrbAnimation, etc.)
- [ ] **Conditional rendering** for optional fields
- [ ] **Fallback rendering** when fields are undefined
- [ ] **TypeScript happy** - no type errors
- [ ] **UI built successfully** (`yarn build:ui`)
- [ ] **ESLint warnings addressed** (remove unused imports)

### Testing Checklist

- [ ] **Strapi Admin**:
  - [ ] All new fields visible
  - [ ] Nested components expand correctly
  - [ ] Data saves without errors
  - [ ] Content **PUBLISHED** (not just saved)
- [ ] **Frontend (with debug logging)**:
  - [ ] Console shows data structure (not undefined)
  - [ ] Component renders without errors
  - [ ] Visual appearance matches Strapi settings
- [ ] **Variations tested**:
  - [ ] With optional fields enabled
  - [ ] With optional fields disabled
  - [ ] Different enum values (alignment, textStyle, etc.)
  - [ ] Edge cases (empty text, missing images, etc.)

### Code Quality Checklist

- [ ] **Debug code removed** (console.log, commented code)
- [ ] **Comments added** for complex logic
- [ ] **Code formatted** (Prettier ran)
- [ ] **No TypeScript errors**
- [ ] **No ESLint errors**
- [ ] **Build passes locally**

### Deployment Checklist

- [ ] **Commit message follows convention**
- [ ] **All modified files staged**
- [ ] **Pushed to GitHub**
- [ ] **CI/CD passes** (Lint + Build jobs green)
- [ ] **Deployed successfully** (if applicable)

---

## Quick Reference: Common Commands

```bash
# Build Strapi (regenerate types)
yarn workspace @repo/strapi build

# Build UI (verify TypeScript)
yarn build:ui

# Start dev server (both Strapi + UI)
yarn dev

# Run in specific workspace
yarn workspace @repo/strapi [command]
yarn workspace @repo/ui [command]

# Commit with Commitizen
yarn commit
```

---

## Emergency Troubleshooting

### Data Not Showing in Frontend

1. **Check console** - Is data `undefined`?
2. **Check Strapi admin** - Is data saved AND published?
3. **Check populate** in `page.ts` - Are nested components included?
4. **Restart dev server** - Did you restart after populate changes?
5. **Check TypeScript types** - Do they include new fields?
6. **Rebuild Strapi** - Types might be stale

### Build Failures

1. **Strapi build fails**:

   - Check JSON syntax in schema files
   - Check for circular component references
   - Clear `dist` folder and rebuild

2. **UI build fails**:
   - Check TypeScript errors in components
   - Verify all imports are correct
   - Check for missing dependencies
   - Regenerate Strapi types

### Component Not Rendering

1. **Check React DevTools** - Is component receiving props?
2. **Check conditional rendering** - Are all conditions met?
3. **Check CSS classes** - Is content hidden (opacity-0, hidden, etc.)?
4. **Check browser console** - Any JavaScript errors?

---

## Success Metrics

You know the integration is complete when:

✅ **Strapi admin**:

- All fields visible and editable
- Data saves and publishes without errors
- Nested components expand and populate correctly

✅ **Frontend**:

- Data flows from Strapi to component
- All variations render correctly
- No console errors or warnings
- TypeScript compilation passes

✅ **User experience**:

- Content editors can control all aspects from Strapi
- Visual changes in Strapi reflect immediately on frontend (after refresh)
- No hardcoded values - everything dynamic

✅ **Code quality**:

- No debug code left behind
- Consistent patterns followed
- Well-documented for future reference
- CI/CD passes all checks

---

**Last Updated**: November 13, 2025  
**Based On**: Newsletter CTA Section integration  
**Next Target**: Apply this workflow to remaining sections (Metrics, Testimonials, etc.)
