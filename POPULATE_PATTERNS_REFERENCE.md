# 🔍 Populate Patterns Quick Reference

> **CRITICAL:** Every time you add a component/media/relation field to a Strapi schema, update the populate middleware!

**Location:** `apps/strapi/src/documentMiddlewares/page.ts`

---

## 📋 When to Update Populate

| Field Type                      | Update Required? | Pattern                              |
| ------------------------------- | ---------------- | ------------------------------------ |
| **Simple fields** (string, etc) | ❌ No            | N/A                                  |
| **Component** (single)          | ✅ Yes           | `fieldName: true`                    |
| **Component** (repeatable)      | ✅ Yes           | `fieldName: true`                    |
| **Media** field                 | ✅ Yes           | `fieldName: { populate: { media } }` |
| **Relation** field              | ✅ Yes           | `fieldName: true`                    |
| **Atomic components**           | ✅ Yes           | See Pattern 5 below                  |

---

## 🎯 Populate Patterns

### Pattern 1: Simple Repeatable Component

**Schema:**

```json
{
  "benefits": {
    "type": "component",
    "repeatable": true,
    "component": "elements.benefit-card"
  }
}
```

**Populate:**

```typescript
"sections.benefits-section": {
  populate: { benefits: true },
},
```

---

### Pattern 2: Repeatable Component with Media

**Schema:**

```json
{
  "technologies": {
    "type": "component",
    "repeatable": true,
    "component": "elements.tech-card"
  }
}
```

**Element schema has media field:**

```json
{
  "icon": {
    "type": "media",
    "allowedTypes": ["images"]
  }
}
```

**Populate:**

```typescript
"sections.tech-stack-section": {
  populate: {
    technologies: { populate: { icon: true } },
  },
},
```

---

### Pattern 3: Multiple Nested Levels

**Schema:**

```json
{
  "partners": {
    "type": "component",
    "repeatable": true,
    "component": "elements.partner-card"
  }
}
```

**Element schema:**

```json
{
  "logo": {
    "type": "media"
  },
  "link": {
    "type": "component",
    "component": "utilities.link"
  }
}
```

**Populate:**

```typescript
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

---

### Pattern 4: Direct Media Field

**Schema:**

```json
{
  "backgroundImage": {
    "type": "media",
    "allowedTypes": ["images"]
  }
}
```

**Populate:**

```typescript
"sections.hero-section": {
  populate: {
    backgroundImage: true,
  },
},
```

---

### Pattern 5: Atomic Architecture (Badge/Header/Background) ⭐

**Schema:**

```json
{
  "badge": {
    "type": "component",
    "repeatable": false,
    "component": "shared.section-badge"
  },
  "header": {
    "type": "component",
    "repeatable": false,
    "component": "shared.section-header"
  },
  "background": {
    "type": "component",
    "repeatable": false,
    "component": "shared.section-background"
  },
  "metrics": {
    "type": "component",
    "repeatable": true,
    "component": "elements.stat-card"
  }
}
```

**Populate (COMPLETE - include ALL nested components):**

```typescript
"sections.metrics-section": {
  populate: {
    // Atomic components with nested fields
    badge: { populate: { orbAnimation: true } },
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },
        descriptionTextStyle: { populate: { customGradient: true } },
      },
    },
    background: true,

    // Section-specific content
    metrics: true,
  },
},
```

**⚠️ CRITICAL:** Badge/Header/Background use nested atomic components (orbAnimation, textStyle). You MUST populate to 2-3 levels deep!

**❌ WRONG (missing nested components):**

```typescript
"sections.metrics-section": {
  populate: {
    badge: true,  // ❌ orbAnimation won't be included!
    header: true, // ❌ textStyle won't be included!
    background: true,
    metrics: true,
  },
},
```

---

### Pattern 6: Newsletter/Form Components

**Schema:**

```json
{
  "ctaButtons": {
    "type": "component",
    "repeatable": true,
    "component": "elements.icon-button"
  },
  "benefits": {
    "type": "component",
    "repeatable": true,
    "component": "elements.benefit-item"
  },
  "gdprLink": {
    "type": "component",
    "repeatable": false,
    "component": "utilities.link"
  }
}
```

**Populate:**

```typescript
"sections.newsletter-cta-section": {
  populate: {
    badge: { populate: { orbAnimation: true } },
    background: true,
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },
        descriptionTextStyle: { populate: { customGradient: true } },
      },
    },
    ctaButtons: true,
    benefits: true,
    gdprLink: true,
  },
},
```

---

## 🚨 Troubleshooting

### Problem: Data shows `undefined` in console but exists in Strapi

**Diagnosis:**

```typescript
// Add to your React component:
console.log("Component Data:", component)
```

**Symptoms:**

```javascript
{
  badge: undefined,      // ❌ Should be object
  header: undefined,     // ❌ Should be object
  background: undefined, // ❌ Should be object
  metrics: [...]         // ✅ This works
}
```

**Root Cause:** Populate middleware missing badge/header/background!

**Fix:** Add populate for missing fields (see Pattern 5)

---

### Problem: Nested fields show `undefined`

**Example:**

```javascript
{
  badge: { text: "Performance", icon: "⚡" },  // ✅ Badge loads
  header: {
    heading: "Title",
    textStyle: undefined  // ❌ Nested textStyle missing!
  }
}
```

**Root Cause:** Populate not deep enough!

**Fix:**

```typescript
// ❌ WRONG
header: true,

// ✅ CORRECT
header: {
  populate: {
    textStyle: { populate: { customGradient: true } },
  },
},
```

---

### Problem: Arrays return empty `[]` but data exists in Strapi

**Symptoms:**

```javascript
{
  testimonials: [] // ❌ Should have items
}
```

**Root Cause:** Repeatable component not populated!

**Fix:**

```typescript
"sections.testimonials-section": {
  populate: {
    testimonials: {  // ✅ Add populate for repeatable field
      populate: {
        authorImage: { populate: { media: true } },
      },
    },
  },
},
```

---

## ✅ Checklist: Adding New Component Field

When you add a field to a schema, follow this checklist:

- [ ] **Step 1:** Edit schema JSON
- [ ] **Step 2:** Wait for Strapi auto-reload
- [ ] **Step 3:** Export Config Sync in Strapi admin
- [ ] **Step 4:** Run `yarn generate:types` (if needed)
- [ ] **Step 5:** Update populate middleware (THIS FILE!)
  - [ ] Is it a component? Add `populate: true` or nested populate
  - [ ] Does it have media? Add `{ populate: { media: true } }`
  - [ ] Is it atomic (badge/header)? Use Pattern 5 (deep populate)
- [ ] **Step 6:** Restart Strapi (if middleware changed)
- [ ] **Step 7:** Test in browser console - check for `undefined`

---

## 📌 Quick Copy-Paste Templates

### Atomic Architecture Section (Most Common)

```typescript
"sections.YOUR-SECTION-NAME": {
  populate: {
    badge: { populate: { orbAnimation: true } },
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },
        descriptionTextStyle: { populate: { customGradient: true } },
      },
    },
    background: true,
    YOUR_CONTENT_FIELD: true,  // Replace with actual field name
  },
},
```

### Simple List Section

```typescript
"sections.YOUR-SECTION-NAME": {
  populate: {
    YOUR_REPEATABLE_FIELD: true,  // Replace with actual field name
  },
},
```

### List with Media

```typescript
"sections.YOUR-SECTION-NAME": {
  populate: {
    YOUR_REPEATABLE_FIELD: {
      populate: {
        YOUR_MEDIA_FIELD: { populate: { media: true } },
      },
    },
  },
},
```

---

## 🎓 Key Learnings

1. **Populate depth matters!** Nested components need nested populate.
2. **Atomic components** (badge, header, background) **always** need deep populate (2-3 levels).
3. **Strapi only populates 1 level by default** - everything else must be explicit.
4. **Test in browser console** - if data is `undefined`, populate is missing.
5. **When refactoring** from simple fields to atomic components, **always update populate!**

---

**Last Updated:** November 18, 2025  
**Related Docs:**

- COMPONENT_WORKFLOW.md
- REFACTORING_COMPONENTS_CHECKLIST.md
- COMPONENT_INTEGRATION_GUIDE.md
