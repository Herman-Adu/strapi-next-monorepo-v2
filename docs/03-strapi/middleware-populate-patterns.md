# Middleware Populate Patterns Guide

**Purpose**: Reference guide for updating `page.ts` middleware populates when schemas change

**Last Updated**: November 20, 2025

---

## When to Update Middleware

You MUST update middleware populates when you:

- ✅ Add/remove fields that are components or relations
- ✅ Change field type (component → primitive or primitive → component)
- ✅ Rename fields
- ✅ Change component UID references

You do NOT need to update middleware when you:

- ✅ Only change field descriptions/labels
- ✅ Only reorder fields
- ✅ Only change validation (required, unique, min/max)
- ✅ Only change defaults

---

## Populate Pattern Decision Tree

```
Is the field a primitive (string, number, boolean, enum, text, richtext, date)?
├── YES → Use: fieldName: true
└── NO → Is it a component?
    ├── YES → Does the component have relation fields (media, icon, link, other components)?
    │   ├── YES → Use: fieldName: { populate: { relationField: true, ... } }
    │   └── NO → Use: fieldName: true
    └── Is it a relation (direct media upload)?
        └── YES → Use: fieldName: true
```

---

## Pattern Examples

### Primitives Only

**Schema**:

```json
{
  "workflowPoints": {
    "type": "component",
    "repeatable": true,
    "component": "elements.list-item" // Has: title (string), description (text), iconType (enum)
  }
}
```

**Middleware**:

```typescript
"sections.workflow-section": {
  populate: {
    workflowPoints: true, // ← Primitives only - no nested populate needed
  },
}
```

---

### Component with Relations

**Schema**:

```json
{
  "images": {
    "type": "component",
    "repeatable": true,
    "component": "utilities.image-with-link" // Has: image (component with media), link (component)
  }
}
```

**Middleware**:

```typescript
"sections.horizontal-images": {
  populate: {
    images: {
      populate: {
        image: { populate: { media: true } },  // ← Nested component with media relation
        link: true,                             // ← Component with only primitives
      },
    },
  },
}
```

---

### Mixed Fields

**Schema**:

```json
{
  "badge": {
    "type": "component",
    "repeatable": false,
    "component": "shared.section-badge" // Has: orbAnimation (component)
  },
  "header": {
    "type": "component",
    "repeatable": false,
    "component": "shared.section-header" // Has: textStyle (component with customGradient relation)
  },
  "items": {
    "type": "component",
    "repeatable": true,
    "component": "elements.feature-card" // Has: icon (string), title (string), description (text)
  }
}
```

**Middleware**:

```typescript
"sections.feature-grid-section": {
  populate: {
    badge: { populate: { orbAnimation: true } },  // ← Nested component
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },  // ← Double nested
        descriptionTextStyle: { populate: { customGradient: true } },
      },
    },
    items: true,  // ← Primitives only
  },
}
```

---

## Common Refactoring Scenarios

### Scenario 1: Icon Component → IconType Enum

**Before Refactoring**:

```json
// elements.icon-button schema
{
  "icon": {
    "type": "component",
    "repeatable": false,
    "component": "atoms.icon"
  },
  "link": {
    "type": "component",
    "repeatable": false,
    "component": "utilities.link"
  }
}
```

**Middleware (Before)**:

```typescript
ctaButtons: { populate: { icon: true, link: true } }
```

**After Refactoring**:

```json
// elements.icon-button schema
{
  "iconType": {
    "type": "enumeration",
    "enum": ["sparkles", "rocket", "check", ...]
  },
  "href": {
    "type": "string"
  },
  "newTab": {
    "type": "boolean"
  }
}
```

**Middleware (After)**:

```typescript
ctaButtons: true // ← ALL primitives now - remove nested populates
```

**Why the Change**: Icon component was replaced with iconType enum (primitive). Primitives don't need nested populate.

---

### Scenario 2: Adding Media Relation

**Before**:

```json
{
  "testimonials": {
    "type": "component",
    "repeatable": true,
    "component": "elements.testimonial" // Had: name (string), role (string), quote (text)
  }
}
```

**Middleware (Before)**:

```typescript
testimonials: true
```

**After** (added author image):

```json
{
  "testimonials": {
    "type": "component",
    "repeatable": true,
    "component": "elements.testimonial" // Now has: authorImage (component with media)
  }
}
```

**Middleware (After)**:

```typescript
testimonials: {
  populate: {
    authorImage: { populate: { media: true } },  // ← Added media populate
  },
}
```

**Why the Change**: Added media relation to component, requires nested populate to load images.

---

### Scenario 3: Renaming Fields

**Before**:

```json
{
  "ctaLinks": {
    "type": "component",
    "repeatable": true,
    "component": "elements.icon-button"
  }
}
```

**Middleware (Before)**:

```typescript
ctaLinks: true
```

**After** (renamed to ctaButtons):

```json
{
  "ctaButtons": {
    "type": "component",
    "repeatable": true,
    "component": "elements.icon-button"
  }
}
```

**Middleware (After)**:

```typescript
ctaButtons: true // ← Updated field name
```

**Why the Change**: Field renamed in schema, middleware must use new name.

---

## Validation Checklist

After updating middleware populates:

- [ ] Regenerate types: `cd apps/strapi && yarn generate:types`
- [ ] Check for TypeScript errors (should be 0)
- [ ] Start Strapi dev server
- [ ] Check terminal logs for ValidationError
- [ ] Open page in frontend
- [ ] Check browser console for errors
- [ ] Verify section renders correctly

If ValidationError appears:

1. Check error message - which field is invalid?
2. Compare schema to middleware populate
3. Fix populate pattern to match schema
4. Restart Strapi
5. Retest

---

## Emergency Debugging

### Error: "Invalid key icon at content.workflowPoints"

**Diagnosis Steps**:

1. Find section in middleware (search for "workflowPoints")
2. Check what's being populated: `workflowPoints: { populate: { icon: true } }`
3. Check schema for workflowPoints component
4. Schema shows iconType enum (not icon component)
5. **Fix**: Change to `workflowPoints: true`

---

### Error: "Invalid key X at content.Y"

**Pattern**: Middleware trying to populate a field that doesn't exist or isn't a relation

**Fix Process**:

1. Identify section from error (content.Y → sections.Y-section)
2. Find populate in middleware
3. Check schema for actual field structure
4. Update populate to match schema reality
5. Test

**Example**:

```
Error: "Invalid key icon at content.ctaButtons"

1. Error is in ctaButtons field
2. Search middleware for "ctaButtons"
3. Find: ctaButtons: { populate: { icon: true, link: true } }
4. Check schema: ctaButtons uses elements.icon-button
5. Check elements.icon-button schema: has iconType (enum), href (string), newTab (boolean)
6. No icon or link components exist
7. Fix: Change to ctaButtons: true
8. Restart Strapi and test
```

---

## Best Practices

### 1. Update Middleware IMMEDIATELY After Schema Changes

- Don't wait to batch updates
- Catches errors at point of introduction
- Test after EVERY change

### 2. Test After EVERY Middleware Change

- Start dev servers
- Load affected pages
- Check for ValidationErrors
- Verify data loads correctly

### 3. Use Schema as Source of Truth

- Middleware should mirror schema structure
- If unsure, check similar working sections
- Check component schemas for nested fields

### 4. Document Custom Patterns

- If you create complex populate structure
- Add comment explaining why
- Help future developers understand

### 5. Never Guess

- Check schema first
- Follow patterns from this guide
- Test to verify

---

## Reference: Current Working Populates

**See**: `apps/strapi/src/documentMiddlewares/page.ts`

**Key Examples**:

| Section                | Pattern Type            | Example Field           |
| ---------------------- | ----------------------- | ----------------------- |
| workflow-section       | Primitives only         | workflowPoints: true    |
| horizontal-images      | Nested components       | images (with media)     |
| feature-grid-section   | Mixed (nested + simple) | badge (nested), items   |
| newsletter-cta-section | Atomic architecture     | badge, header, benefits |
| final-cta-section      | Simple repeatable       | ctaButtons: true        |
| testimonials-section   | Component with media    | testimonials (images)   |

---

## Quick Decision Guide

**When changing a schema, ask:**

1. **Did I add/remove/change a component or relation field?**

   - YES → Update middleware populate
   - NO → Skip (only descriptions/validation changed)

2. **What type is the new/changed field?**

   - Primitive (string, enum, number, etc.) → Use: `fieldName: true`
   - Component with NO nested relations → Use: `fieldName: true`
   - Component WITH nested relations → Use: `fieldName: { populate: {...} }`
   - Media field → Use: `fieldName: { populate: { media: true } }`

3. **Is this an atomic component (badge, header, background)?**

   - YES → Use deep populate (2-3 levels)
   - NO → Use simple populate based on field type

4. **Did I test after updating?**
   - YES → Proceed to commit
   - NO → Test NOW before proceeding

---

## Real-World Example: November 20, 2025 Bug Fix

**What Happened**:

- Phase 1 refactoring: Changed 6 sections from icon components → iconType enums
- Updated schemas ✅
- Updated frontend components ✅
- **Forgot to update middleware populates** ❌
- Made 9 commits without testing ❌
- Bug introduced in commit f14322d
- Discovered 9 commits later (commit 92cf304)
- Result: 2+ hours debugging, app completely broken

**The Bug**:

```typescript
// In middleware (WRONG):
"sections.final-cta-section": {
  populate: {
    ctaButtons: { populate: { icon: true, link: true } }  // ❌ icon/link don't exist!
  }
}

// Schema had changed to:
{
  "ctaButtons": {
    "component": "elements.icon-button"  // Now has iconType (enum), href (string), newTab (boolean)
  }
}

// Should have been:
"sections.final-cta-section": {
  populate: {
    ctaButtons: true  // ✅ All primitives
  }
}
```

**The Lesson**:

- ✅ Update middleware IMMEDIATELY after schema changes
- ✅ Test after EVERY change
- ✅ Never batch multiple refactorings without testing each
- ✅ 5-10 min testing saves 2+ hours debugging

---

## Related Documentation

- [Component Development Workflow](../04-components/workflow.md) - Complete workflow including middleware updates
- [Test-Driven Refactoring](../06-workflows/test-driven-refactoring.md) - Mandatory testing discipline
- [Populate Patterns Quick Reference](../10-reference/populate-patterns.md) - Quick lookup for patterns
- [Recovery Document](../11-recovery/recovery-document.md) - Session context and debugging wins

---

**Last Updated**: November 20, 2025  
**Next Review**: After next major refactoring phase
