# ⚡ Component Development Quick Reference

> Print this and keep it handy while creating components!

---

## 🚀 The Process (4 Phases)

```
PHASE 1: Backend (Strapi)     → 15 min
PHASE 2: Types (Generation)   → 2 min
PHASE 3: Frontend (React)     → 30 min
PHASE 4: Testing (Validation) → 10 min
```

---

## ✅ Phase 1 Checklist: Backend First!

### Files to Create/Edit:

- [ ] `apps/strapi/src/components/elements/<name>.json` (if needed)
- [ ] `apps/strapi/src/components/sections/<name>.json`
- [ ] `apps/strapi/src/api/page/content-types/page/schema.json` ⚠️ ADD TO DYNAMIC ZONE
- [ ] `apps/strapi/src/documentMiddlewares/page.ts` ⚠️ ADD POPULATE

### Commands:

```powershell
# None - just create files and save
# Strapi auto-reloads on file changes
```

### Don't Forget:

- [ ] Export config sync: Strapi Admin → Settings → Config Sync → Export
- [ ] Add `as any` to middleware temporarily (if TypeScript errors)

---

## ⚡ Phase 2 Checklist: Generate Types

### Commands:

```powershell
cd apps\strapi
yarn generate:types
```

### Don't Forget:

- [ ] Remove `as any` from middleware after types generate

---

## 💻 Phase 3 Checklist: Frontend Components

### Files to Create:

- [ ] `apps/ui/src/components/page-builder/components/elements/Strapi<Name>.tsx`
- [ ] `apps/ui/src/components/page-builder/components/sections/Strapi<Name>.tsx`

### Files to Edit:

- [ ] `apps/ui/src/components/page-builder/index.tsx` ⚠️ REGISTER COMPONENTS

### Commands:

```powershell
# From monorepo root
yarn format
cd apps\ui
yarn type-check
```

### TypeScript Pattern:

```tsx
import { Data } from "@repo/strapi"

export function StrapiYourComponent({
  component,
}: {
  readonly component: Data.Component<"sections.your-component">
}) {
  const field = component.field ?? "default"

  return <div>{field}</div>
}

StrapiYourComponent.displayName = "StrapiYourComponent"
export default StrapiYourComponent
```

---

## 🧪 Phase 4 Checklist: Test Everything

### Build Verification (MANDATORY - DO THIS FIRST!)

**⚠️ CRITICAL: Always run from MONOREPO ROOT with dev server stopped!**

```powershell
# 1. Navigate to root (NOT apps/ui or apps/strapi)
cd c:\Users\herma\source\repository\strapi-next-monorepo-v2

# 2. Stop all dev servers (Ctrl+C in all terminals)

# 3. Build (auto-cleans before building)
yarn build         # Clean ALL + build everything
yarn build:strapi  # Clean Strapi dist + build Strapi only
yarn build:ui      # Clean UI .next + build UI only

# 4. Manual clean (if needed)
yarn clean         # Clean all (.next, dist, .turbo)
yarn clean:strapi  # Clean apps/strapi/dist only
yarn clean:ui      # Clean apps/ui/.next only
yarn clean:turbo   # Clean .turbo cache only
```

**Why this matters:**

- ✅ Prevents cache/config issues
- ✅ Stops port locking from old builds
- ✅ Fresh TypeScript types
- ✅ No stale modules
- ✅ Must pass before commit!

### Build Verification (MANDATORY - DO THIS FIRST!)

```powershell
# From monorepo root
yarn build        # Build everything
# OR
yarn build:ui     # Frontend-only changes

# ⚠️ WAIT FOR GREEN TICK - DO NOT PROCEED WITHOUT IT
# ✅ "Done in X.XXs" means success
# ❌ Any errors = STOP, FIX, RE-RUN
```

**🚨 CRITICAL WORKFLOW RULE:**

- Never commit until build passes ✅
- Never move to next task until build passes ✅
- Small commits = small rollbacks if needed
- This is non-negotiable - Green tick baby! 🟢

### In Strapi Admin:

- [ ] Component appears in picker
- [ ] Test data created successfully
- [ ] Page published

### In Browser:

- [ ] Open DevTools (F12) → Network tab
- [ ] Check API response has your data
- [ ] Frontend renders correctly
- [ ] Test mobile/tablet/desktop (DevTools → Device Toolbar)

### In Git:

```powershell
git status
yarn format
git add .
yarn commit  # OR: git commit -m "feat: add your component"
git push origin main  # ⚠️ ALWAYS push after commit (keep GitHub up to date!)
```

---

## ⚠️ THE TWO STEPS EVERYONE FORGETS

### 1. Add to Page Dynamic Zone

**File:** `apps/strapi/src/api/page/content-types/page/schema.json`

```json
{
  "content": {
    "components": [
      "sections.hero",
      "sections.YOUR-COMPONENT-HERE", // ← ADD THIS!
      "forms.contact-form"
    ]
  }
}
```

**Without this:** Component won't appear in picker ❌

---

### 2. Add to Populate Middleware

**File:** `apps/strapi/src/documentMiddlewares/page.ts`

```typescript
const pagePopulateObject: FindOne<"api::page.page">["populate"] = {
  content: {
    on: {
      "sections.YOUR-COMPONENT": {
        // ← ADD THIS!
        populate: {
          nestedField: true,
          mediaField: { populate: { media: true } },
        },
      },
    },
  },
}
```

**Without this:** Data will be empty on frontend ❌

---

## 🔥 Common Populate Patterns

```typescript
// Simple repeatable (no media)
"sections.benefits-section": {
  populate: { benefits: true },
},

// Repeatable WITH media
"sections.tech-stack": {
  populate: {
    technologies: { populate: { media: true } },
  },
},

// Nested components with media
"sections.testimonials": {
  populate: {
    testimonials: {
      populate: {
        authorPhoto: { populate: { media: true } },
      },
    },
  },
},
```

---

## 🎨 Styling Quick Reference

### Core Rules (NO EXCEPTIONS!)

❌ **NEVER:**

```tsx
<div className="max-w-6xl">         // Hard-coded width
<div className="w-[360px]">         // Fixed pixels
<div className="gap-[20px]">        // Arbitrary values
```

✅ **ALWAYS:**

```tsx
<div className="w-full">            // Fluid width
<div className="gap-5">             // Spacing tokens
<div className="@container">        // Container queries
```

### Container Queries (Component-Level)

```tsx
// Use @ prefix for container-relative responsive design
"gap-8 @2xl:gap-12 @4xl:gap-16" // Gaps
"p-8 @2xl:p-12 @4xl:p-16" // Padding
"grid-cols-1 @3xl:grid-cols-2" // Grid
"grid-cols-1 @3xl:grid-cols-[1.2fr_1fr]" // Asymmetric
```

### Standard Breakpoints (Page-Level)

```tsx
// Use standard breakpoints for viewport-level layout
"py-8 md:py-12" // Section padding
"text-3xl md:text-4xl lg:text-5xl" // Typography
"grid-cols-1 md:grid-cols-2 lg:grid-cols-3" // Page grids
```

### Width Tokens

```tsx
// Use semantic widths from SectionWrapper
containerWidth: "default" // max-w-7xl (1280px)
containerWidth: "narrow" // max-w-4xl (896px)
containerWidth: "wide" // max-w-screen-2xl (1536px)
containerWidth: "full" // w-full (100%)
```

**📖 Full Guide:** [STYLING_GUIDE.md](./STYLING_GUIDE.md)

---

## 🐛 Quick Troubleshooting

| Problem                           | Solution                                        |
| --------------------------------- | ----------------------------------------------- |
| Component not in picker           | → Check Page schema, add to components array    |
| Data empty on frontend            | → Check populate middleware                     |
| TypeScript errors                 | → Run `yarn generate:types`, restart TS server  |
| Strapi won't start                | → Check JSON syntax, validate with jsonlint.com |
| Frontend not updating             | → Hard refresh browser (Ctrl+Shift+R)           |
| Component renders but looks wrong | → Check Tailwind classes, test responsive       |
| Content not centered vertically   | → Use `flex flex-col justify-center`, no max-w  |
| Build fails after schema change   | → Run from ROOT, stop server, use clean scripts |

---

## 📚 Full Guides

- **Step-by-Step Process:** [COMPONENT_WORKFLOW.md](./COMPONENT_WORKFLOW.md) ⭐
- **Architecture & Examples:** [COMPONENT_DEVELOPMENT_GUIDE.md](./COMPONENT_DEVELOPMENT_GUIDE.md)
- **Git & Deployment:** [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

---

## 🎯 Golden Rules

1. ✅ **Backend first, frontend second** - Always complete Phase 1 & 2 before Phase 3
2. ✅ **Types before components** - Generate types before writing React code
3. ✅ **Build before commit** - 🚨 GREEN TICK REQUIRED - Never move on until build passes
4. ✅ **Commit then push** - Keep GitHub up to date, push immediately after every commit
5. ✅ **Test systematically** - Follow Phase 4 checklist, don't skip steps
6. ✅ **Commit with config sync** - Always export and commit sync files

**Remember: Small commits = small rollbacks. Every commit should build successfully!**

---

## ⏱️ Expected Timeline

| Phase     | Time        | Can Skip?         |
| --------- | ----------- | ----------------- |
| Phase 1   | 15 min      | ❌ Never          |
| Phase 2   | 2 min       | ❌ Never          |
| Phase 3   | 30 min      | ❌ Never          |
| Phase 4   | 10 min      | ❌ Never          |
| **Total** | **~1 hour** | **Follow all 4!** |

---

**Print Date:** November 6, 2025  
**Version:** 1.0
