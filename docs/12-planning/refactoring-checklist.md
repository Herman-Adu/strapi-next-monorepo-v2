# ✅ Component Refactoring Checklist

**Use this checklist EVERY TIME you add/remove/modify fields in existing Strapi components.**

**📌 Quick Reference:** See [POPULATE_PATTERNS_REFERENCE.md](./POPULATE_PATTERNS_REFERENCE.md) for populate patterns.

---

## ⚠️ **CRITICAL STEPS** - DO NOT SKIP!

These steps are the most common cause of "data not showing" issues:

1. **✅ Step 3: Export Config Sync** - Without this, fields won't appear in Content Manager
2. **✅ Step 5: Update Populate Middleware** - Without this, data returns null/undefined in API
3. **✅ Step 6: Update Page Builder (for new components only)** - Without this, component won't render

**If your component shows in Strapi but not on the frontend, you missed Step 5!**

---

## 🔄 The Complete Process

### ✅ Step 1: Modify Schema JSON

**File:** `apps/strapi/src/components/<category>/<component-name>.json`

- [ ] Edit the schema file
- [ ] Add/remove/modify fields
- [ ] Save file
- [ ] Verify JSON syntax is valid

**Example:**

```json
{
  "attributes": {
    "existingField": { "type": "string" },
    "newField": {
      // ✅ NEW
      "type": "boolean",
      "default": false,
      "description": "Field description"
    }
  }
}
```

---

### ✅ Step 2: Wait for Strapi Rebuild

**Terminal:** Watch for auto-reload

- [ ] Check terminal for rebuild message
- [ ] Look for: `[Strapi] ✓ Reloading...`
- [ ] Look for: `[Strapi] ✓ Server started`
- [ ] Fix any JSON syntax errors if rebuild fails

---

### ✅ Step 3: Export Config Sync ⚠️ **MOST CRITICAL STEP**

**Location:** Strapi Admin → Settings → Config Sync

- [ ] Open: http://localhost:1337/admin
- [ ] Navigate: **Settings** (⚙️ icon) → **Config Sync**
- [ ] Click: Blue **"Export"** button
- [ ] Wait for: Green success message
- [ ] Verify: Config sync file updated in `apps/strapi/config/sync/`

**Why this matters:**

- ❌ Without this: Field shows in Content-Type Builder but NOT Content Manager
- ✅ With this: Field appears everywhere and is usable

---

### ✅ Step 4: Regenerate TypeScript Types

**Command:** `yarn generate:types`

- [ ] Open terminal in `apps/strapi/`
- [ ] Run: `yarn generate:types`
- [ ] Wait for: `✔ Types generated successfully`
- [ ] Check: No TypeScript errors in terminal

```powershell
cd apps\strapi
yarn generate:types
```

---

### ✅ Step 5: Update Populate Middleware ⚠️ **CRITICAL FOR NESTED FIELDS**

**File:** `apps/strapi/src/documentMiddlewares/page.ts`

**When you add a field that is:**

- ✅ **Component** (e.g., `utilities.link`, `elements.icon-button`) - **MUST ADD**
- ✅ **Media** (images, files) - **MUST ADD**
- ✅ **Relation** (links to other content types) - **MUST ADD**
- ❌ Simple fields (string, boolean, number) - **NOT NEEDED**

**Why this matters:**

- ❌ Without populate: Field appears in Strapi, saves correctly, but returns **null/undefined in API**
- ✅ With populate: Field data is included in API response and appears on frontend

**Steps:**

- [ ] Open `apps/strapi/src/documentMiddlewares/page.ts`
- [ ] Find your section in `pagePopulateObject.content.on`
- [ ] Add populate configuration for new component/media/relation field
- [ ] Save file
- [ ] Wait for Strapi to rebuild (auto-reload)

**Example - Adding a Link Component:**

```typescript
"sections.newsletter-cta-section": {
  populate: {
    ctaButtons: true,
    benefits: true,
    gdprLink: true,          // ✅ NEW - Added utilities.link component
  }
},
```

**Example - Adding a Media Field:**

```typescript
"sections.hero-section": {
  populate: {
    heading: true,
    backgroundImage: true,   // ✅ NEW - Added media field
  }
},
```

**Example - Nested Component with Media:**

```typescript
"sections.partner-showcase": {
  populate: {
    partners: {
      populate: {
        logo: true,          // ✅ Media inside repeatable component
        link: true,          // ✅ Link component inside repeatable
      }
    }
  }
},
```

**Example - Atomic Architecture Components (Badge/Header/Background):**

```typescript
"sections.metrics-section": {
  populate: {
    badge: { populate: { orbAnimation: true } },  // ✅ Shared section badge
    header: {
      populate: {
        textStyle: { populate: { customGradient: true } },
        descriptionTextStyle: { populate: { customGradient: true } },
      },
    },
    background: true,                             // ✅ Shared section background
    metrics: true,                                 // ✅ Section-specific content
  }
},
```

**⚠️ CRITICAL for Atomic Architecture:**

When refactoring components to use shared atomic components (badge, header, background), you MUST update the populate configuration, or badge/header/background will return `undefined` even though the data exists in Strapi!

**Before (old simple field populate):**

```typescript
"sections.metrics-section": {
  populate: { metrics: true },  // ❌ Missing badge, header, background!
}
```

**After (atomic architecture populate):**

```typescript
"sections.metrics-section": {
  populate: {
    badge: { populate: { orbAnimation: true } },     // ✅ Added
    header: { populate: { ... } },                   // ✅ Added
    background: true,                                // ✅ Added
    metrics: true,
  }
}
```

**Example - Adding New Component Variant (Real Case: Marquee Pro Testimonials):**

```typescript
"sections.marquee-section": {
  populate: {
    logos: { populate: { image: true } },
    testimonials: { populate: { avatar: true } },
    testimonialsPro: { populate: { avatar: true } },  // ✅ NEW - Pro variant
    reviews: { populate: { avatar: true } },
  }
},
```

**⚠️ REAL WORLD EXAMPLE:**

When we added the Pro testimonial variant, we forgot this step. Result:

- ✅ Component appeared in Strapi admin
- ✅ Component saved 4 Pro testimonials
- ❌ Frontend showed empty (itemsCount: 0, hasTestimonialsPro: false)
- ❌ API returned testimonialsPro: null

**Fix:** Added `testimonialsPro: { populate: { avatar: true } }` to middleware → **INSTANTLY WORKED**

**🔍 How to verify:**

After restarting Strapi, check the API response in browser DevTools. Your new field should appear with data, not null.

---

### ✅ Step 6: Update Frontend Component

**File:** `apps/ui/src/components/page-builder/components/<category>/StrapiComponentName.tsx`

- [ ] Import `Data` type from `@repo/strapi` (if not already)
- [ ] Access new field with null coalescing: `component.newField ?? defaultValue`
- [ ] Implement UI logic for new field
- [ ] Save file

**Example:**

```tsx
export function StrapiComponentName({
  component,
}: {
  component: Data.Component<"sections.component-name">
}) {
  // ✅ Access new field with fallback
  const newField = component.newField ?? false

  return (
    <div className={newField ? "with-feature" : "without-feature"}>
      {/* Render based on new field */}
    </div>
  )
}
```

---

### ✅ Step 7: Format Code

**Command:** `yarn format`

- [ ] Run from monorepo root: `yarn format`
- [ ] Verify: All files formatted successfully
- [ ] Check: No linting errors

```powershell
yarn format
```

---

### ✅ Step 8: Test in Strapi Admin

**Location:** Content Manager

- [ ] Navigate to: **Content Manager** → **Collection/Single Type**
- [ ] Open existing entry using modified component
- [ ] Verify: New field appears in form
- [ ] Fill/toggle new field
- [ ] Click: **Save** button
- [ ] Click: **Publish** button

---

### ✅ Step 9: Test in API Response

**Location:** Browser DevTools

- [ ] Open page with component on frontend
- [ ] Press F12 → **Network** tab
- [ ] Refresh page
- [ ] Find API request (e.g., `/api/pages/`)
- [ ] Check **Response** tab
- [ ] Verify: New field present in JSON with correct value

**Example Response:**

```json
{
  "content": [
    {
      "__component": "sections.your-section",
      "existingField": "value",
      "newField": true // ✅ Should appear here
    }
  ]
}
```

---

### ✅ Step 10: Test on Frontend

**Location:** Website

- [ ] View page on frontend: http://localhost:3000/page-slug
- [ ] Verify: New field's functionality works
- [ ] Check: No console errors (F12 → Console)
- [ ] Test: Different values for new field
- [ ] Test: Edge cases (null, empty, etc.)

---

### ✅ Step 11: Commit Changes

**Location:** Git

- [ ] Stage files: `git add .`
- [ ] Commit: `yarn commit` or `git commit -m "feat: add newField to component"`
- [ ] Push: `git push origin main`

**Files to commit:**

```
apps/strapi/src/components/<category>/<component>.json       # Schema change
apps/strapi/config/sync/core-store.plugin_content_...json   # Config sync
apps/strapi/types/generated/components.d.ts                  # Generated types
apps/ui/src/components/page-builder/.../Component.tsx        # Frontend code
apps/strapi/src/documentMiddlewares/page.ts                  # Populate (if modified)
```

---

## 🚨 Common Mistakes & Fixes

### Mistake 1: Field Not Appearing in Content Manager

**Symptoms:** Field shows in Content-Type Builder but not in Content Manager

**Root Cause:** Config Sync not exported

**Fix:**

1. Go to **Settings** → **Config Sync**
2. Click **"Export"**
3. Hard refresh browser (Ctrl+Shift+R)

---

### Mistake 2: TypeScript Errors

**Symptoms:** Red squiggly lines, "Property does not exist"

**Root Cause:** Types not regenerated

**Fix:**

```powershell
cd apps\strapi
yarn generate:types
```

Then in VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

---

### Mistake 3: Data Not in API Response ⚠️ **VERY COMMON**

**Symptoms:**

- Field appears in Strapi Content Manager
- Field saves correctly
- BUT field is **null** or **undefined** in API response
- Frontend doesn't show the data

**Root Cause:** Populate middleware not updated for nested component/media/relation field

**Fix:**

1. Open `apps/strapi/src/documentMiddlewares/page.ts`
2. Find your section (e.g., `"sections.newsletter-cta-section"`)
3. Add the missing field to the `populate` object:
   ```typescript
   "sections.your-section": {
     populate: {
       existingField: true,
       missingField: true,  // ✅ ADD THIS
     }
   }
   ```
4. Save file and wait for Strapi to auto-reload
5. Check API response again - field should now have data

**Real Example:**

We added `gdprLink` (a `utilities.link` component) to `newsletter-cta-section`. It appeared in Strapi but wasn't in the API. We had to add `gdprLink: true` to the populate config.

---

### Mistake 4: Frontend Breaks

**Symptoms:** Console errors, "Cannot read property"

**Root Cause:** Not handling null/undefined

**Fix:**

```tsx
// ❌ Wrong - assumes field exists
const value = component.newField.toLowerCase()

// ✅ Correct - handles null/undefined
const value = component.newField ?? "default"
const value = component.newField?.toLowerCase() ?? "default"
```

---

## 📋 Quick Reference: Field Types

```json
{
  "stringField": { "type": "string" },
  "textField": { "type": "text" },
  "integerField": { "type": "integer", "min": 0, "max": 100 },
  "decimalField": { "type": "decimal" },
  "booleanField": { "type": "boolean", "default": false },
  "dateField": { "type": "date" },
  "enumField": { "type": "enumeration", "enum": ["option1", "option2"] },
  "mediaField": { "type": "media", "allowedTypes": ["images"] },
  "richtextField": { "type": "richtext" },
  "componentField": {
    "type": "component",
    "repeatable": true,
    "component": "elements.element-name"
  }
}
```

---

## ⏱️ Time Estimates

| Step                  | Time     | Critical?            |
| --------------------- | -------- | -------------------- |
| 1. Modify schema      | 2 min    | 🔴 YES               |
| 2. Wait rebuild       | 30 sec   | 🔴 YES               |
| 3. Export Config Sync | 30 sec   | 🔴 **MOST CRITICAL** |
| 4. Regenerate types   | 1 min    | 🔴 YES               |
| 5. Update populate    | 2 min    | 🟡 If needed         |
| 6. Update frontend    | 5-10 min | 🟡 If needed         |
| 7. Format code        | 30 sec   | 🟢 Nice to have      |
| 8. Test Strapi        | 2 min    | 🔴 YES               |
| 9. Test API           | 1 min    | 🔴 YES               |
| 10. Test frontend     | 2 min    | 🔴 YES               |
| 11. Commit            | 1 min    | 🟢 Final step        |

**Total:** ~15-20 minutes for safe, complete refactoring

---

## 🎯 Golden Rules

1. **ALWAYS export Config Sync after schema changes** - This is the #1 missed step!
2. **ALWAYS regenerate types** - Keep frontend and backend in sync
3. **ALWAYS update populate middleware for component/media/relation fields** - Or data won't appear in API!
4. **ALWAYS test in all three places:**
   - Strapi Admin (field appears)
   - API Response (data present, not null) ← **Check DevTools Network tab!**
   - Frontend (functionality works)
5. **ALWAYS commit config sync files** - Team needs these changes
6. **ALWAYS use null coalescing (`??`)** - Handle missing data gracefully

---

## 📚 Related Documentation

- [COMPONENT_WORKFLOW.md](./COMPONENT_WORKFLOW.md) - Creating new components
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - General development setup
- [QUICK_START.md](./QUICK_START.md) - Project quick start

---

**Last Updated:** November 7, 2025  
**Version:** 1.0  
**For:** Strapi v5.29.0 + Next.js v15

---

## 💡 Pro Tips

- **Use VS Code Tasks:** Create `.vscode/tasks.json` to run common commands
- **Keep terminal visible:** Watch for auto-reload confirmation
- **Use Git branches:** Test breaking changes safely
- **Document in PR:** Explain why field was added/removed
- **Update test data:** Keep example content current
- **Check API before frontend:** Always verify data appears in Network tab before debugging frontend
- **Simple fields vs Components:** String/boolean/number don't need populate. Components/media/relations ALWAYS need populate!

---

## 🔍 Debugging Checklist: "My field isn't showing!"

Use this when data isn't appearing on the frontend:

**Step 1: Is it in Strapi Admin?**

- [ ] Field appears in Content Manager form
- [ ] Can save and publish with field
- ✅ **YES** → Go to Step 2
- ❌ **NO** → Export Config Sync (Step 3 above)

**Step 2: Is it in the API Response?**

- [ ] Open page in browser (http://localhost:3000/your-page)
- [ ] Press F12 → **Network** tab
- [ ] Refresh page
- [ ] Find API request (e.g., `/api/pages?...`)
- [ ] Click request → **Response** tab
- [ ] Search for your field name in JSON
- ✅ **FOUND with data** → Go to Step 3
- ⚠️ **FOUND but null/undefined** → **Update populate middleware!** (Step 5 above)
- ❌ **NOT FOUND** → Regenerate types (Step 4 above), then check again

**Step 3: Is the frontend code correct?**

- [ ] Component imports `Data.Component<"your.component">`
- [ ] Accessing field with `component.yourField ?? fallback`
- [ ] No TypeScript errors
- [ ] Console shows no errors (F12 → Console)
- ✅ **All good** → Check rendering logic
- ❌ **Errors** → Fix TypeScript/React errors

**Step 4: Common causes:**

| Problem                   | Solution                          |
| ------------------------- | --------------------------------- |
| Field not in Content Mgr  | Export Config Sync                |
| TypeScript errors         | Regenerate types                  |
| Data null in API          | **Update populate middleware** ⚠️ |
| Data exists but not shown | Check component rendering logic   |
| Page not loading          | Check Strapi logs for errors      |
| Changes not appearing     | Hard refresh (Ctrl+Shift+R)       |

---

**Remember:** Measure twice, cut once. Follow the checklist every time! 🎯
